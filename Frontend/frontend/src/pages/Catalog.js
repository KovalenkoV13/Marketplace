import {Link, useParams} from "react-router-dom";
import {Card, Col, Row} from "react-bootstrap";
import {CardActionArea, CardActions, IconButton} from "@mui/material";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import React, {useContext, useState} from "react";
import {Context} from "../components/reducer";
import Filtres from "../components/filtres";
import {useGoods} from "../components/api/query";


function Catalog(props) {
    const {state, dispatch} = useContext(Context);
    const goods = useGoods();
    const {id} = useParams();
    const [pageNumber, setPageNumber] = useState(1);
    return (
        <>
            <Filtres />
        <div className="conteinerCatalog">
            <div className="BR">
                <p className="Br_p"><Link className="Br_Link" to="/">Главная </Link>
                    / Каталог</p>
            </div>
            <Row xs={3} md={3} className="g-4">
                {goods.data.results.map((data) => {
                    return <Col>
                        <Card key={data.name}>
                            <div className="c_img">
                                <Card.Img className="cardImage" variant="top" src={data.img}/>
                            </div>
                            <Card.Body>
                                <div className="Text">
                                    <div className="textStyle">
                                        <Card.Title>{data.name}</Card.Title>
                                    </div>
                                    <div className="textStyle">
                                        <Card.Text>
                                            {data.brand}
                                        </Card.Text>
                                    </div>
                                    <div className="textStyle">
                                        <Card.Text class="cost">
                                            {data.cost}₽
                                        </Card.Text>
                                    </div>
                                </div>
                                <div className="actionP">
                                    <CardActions disableSpacing>
                                        <IconButton aria-label="add to favorites" color="error">
                                            <FavoriteTwoToneIcon/>
                                        </IconButton>
                                        <IconButton aria-label="add to favorites" color="error">
                                            <AddShoppingCartOutlinedIcon/>
                                        </IconButton>
                                        <Link className="cardButton" to={`/catalog/${data.name}`} > Подробнее</Link>
                                    </CardActions>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                })}
            </Row>

        </div>
        </>
    );
};
export default Catalog;