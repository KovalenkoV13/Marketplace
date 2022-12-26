import React, {useContext, useEffect, useReducer, useState} from "react";
import {Link} from "react-router-dom";
import {Card, Col, Row, Spinner,Button} from "react-bootstrap";
import {CardActions, IconButton, Snackbar} from "@mui/material";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { Api } from "../components/api/pharmacyApi.ts";
import {Context} from "../components/reducer";
import Cookies from "js-cookie";
import axios from "axios";
const api = new Api();

const getGoods = async (name2= '', min = "0", max="1000", name ='Супра' ) =>{
    const res = await api.api.apiGoodList({
        name: `${name2}`,
        min_price: `${min}`,
        max_price: `${max}`,
        search: `${name}`
    })
        .then((response) => {
            return response.data;
        }).catch(()=>{
            return {count:0, results:[]}
        })
    return res
}




const createCart = async (name, cost, img, user) =>{
    const res = await api.api.apiCartCreate(
        {
            name: `${name}`,
            cost: `${cost}`,
            img: `${img}`,
            user_profile_userprofile: `${user}`
        },
        {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken')
            }}
    )
        .then((response) => {
            return response.data;
        }).catch(()=>{
            return {count:0, results:[]}
        })
    return res
}




function Catalog(props) {
    const {state, dispatch} = useContext(Context);
    const [searchValue, setSearchValue] = useState('Терафлю');
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(20000);
    const [loading, setLoading] = useState(false);
    const [good, setGood] = useState([]);
    const [open, setOpen] = useState(false);
    const [openAut, setOpenAut] = useState(false);


    console.log(state)

    // поиск товара
    const handleSearch = async () =>{
        await setLoading(true);
        const { results } = await getGoods('', min, max, searchValue);
        await setGood(results);
        await setLoading(false);
    }

    const handleAdd = async () =>{
        setOpen(true);
    }
    const handleClose = async () =>{
        setOpen(false);
    }

    const handleAddAut = async () =>{
        setOpenAut(true);
    }
    const handleCloseAut = async () =>{
        setOpenAut(false);
    }


    return (

        <>
            <div className="conteinerCatalog">

                <div className="BR">
                    <p className="Br_p"><Link className="Br_Link" to="/">Главная </Link>
                        / Каталог</p>
                </div>
                {loading && <div className="loadingBg"><Spinner animation="border"/></div>}
                <div className={"inputForm"}>
                <div className="inputGood">
                    <h4>Поиск по наименованию</h4>
                    <input value={searchValue} onChange={(event => setSearchValue(event.target.value))}/>
                </div>
                <div className="inputCost">
                    <h4>Диапазон цен</h4>
                    <div className={"minCost"}>
                        <h5>От</h5> <input type={"number"} value={min} onChange={(event => setMin(event.target.value))}/>
                    </div>
                    <div className={"maxCost"}>
                        <h5>До</h5> <input type={"number"} value={max} onChange={(event => setMax(event.target.value))}/>
                    </div>
                </div>
                    <Button variant={"dark"} className={"buttonSearch"} disabled={loading}  onClick={handleSearch}>Искать</Button>
                </div>
                {!good.length && <div>
                    <h1>К сожалению, пока ничего не найдено 🥲</h1>
                </div>}
                {good.length && <Row xs={3} md={3} className="g-4">
                    {good.map((data) => {
                        return <Col className={data.name}>
                            <Snackbar
                                open={open}
                                anchorOrigin={ {vertical: 'bottom', horizontal: 'right'} }
                                autoHideDuration={3000}
                                onClose={handleClose}
                                message="Товар добавлен в корзину!"
                            />
                            <Snackbar
                                open={openAut}
                                anchorOrigin={ {vertical: 'bottom', horizontal: 'right'} }
                                autoHideDuration={3000}
                                onClose={handleCloseAut}
                                message="Авторизируйтесь, чтобы добавить товар в корзину"
                            />
                            <Card key={data.name}>
                                <div key={data.img} className="c_img">
                                    <Card.Img className="cardImage" variant="top" src={data.img}/>
                                </div>
                                <Card.Body >
                                    <div key={data.name} className="Text">
                                        <div key={data.name} className="textStyle">
                                            <Card.Title key={data.name}>{data.name}</Card.Title>
                                        </div>
                                        <div key={data.brand} className="textStyle">
                                            <Card.Text>
                                                {data.brand}
                                            </Card.Text>
                                        </div>
                                        <div key={data.cost} className="textStyle">
                                            <Card.Text className="cost">
                                                {data.cost}₽
                                            </Card.Text>
                                        </div>
                                    </div>
                                    <div  className="actionP">
                                        <CardActions disableSpacing>
                                            {state.isAuthenticated && <IconButton
                                                aria-label="add to shoplist"
                                                onClick={() => {createCart(data.name,data.cost,data.img,state.id); handleAdd()}}
                                                color="error"
                                            >
                                                <AddShoppingCartOutlinedIcon/>
                                            </IconButton>}
                                            {!state.isAuthenticated && <IconButton
                                                aria-label="add to shoplist"
                                                onClick={() => {handleAddAut()}}
                                                color="error"
                                            >
                                                <AddShoppingCartOutlinedIcon/>
                                            </IconButton>}
                                            <Link className="cardButton"  to={`/catalog/'${data.name}'`} > Подробнее</Link>
                                        </CardActions>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    })}
                </Row>}

            </div>
        </>
    );
};
export default Catalog;