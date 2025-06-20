import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Button, Modal, Form } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import NumberFormat from 'react-number-format';
import axios from "axios";
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';
import ListProdutos from '../components/list-produtos';
import CsLineIcons from '../cs-line-icons/CsLineIcons';
import { NewProdutoForm } from './create/produto';
import {configAxios} from "../constants";
import {BASE_URL} from "../config";
import Regras from "./regras/regras";

const ProdutoPage = () => {
    const title = 'Produtos';
    const description = 'Lista de produtos Carrera Carneiro';

    const breadcrumbs = [{ to: '', text: 'Home' }];

    const [addModal, setAddModal] = React.useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const GET_DATA = async (page) => {
        setLoading(true);
        configAxios.params = {
            page:page > 1 ? page : 1,
            status: 1,
        };
        await axios.get(`${BASE_URL}/data/v1/produto`,configAxios)
            .then((response) => {
                setData(response.data);
            }).catch((error) => {
                console.error(error);
            }).finally(()=>{
                setLoading(false);
            });
    }

    useEffect(() => {
        GET_DATA(1);
    },[]);

    return (
        <>
            <Modal
                backdrop="static"
                keyboard={false}
                show={addModal}
                onHide={() => setAddModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="staticBackdropLabel">
                        Cadastro de produto
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <NewProdutoForm setAddModal={setAddModal} />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setAddModal(false)}
                    >
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
            <HtmlHead title={title} description={description} />

            <div className="page-title-container">
                <Row>
                    {/* Title Start */}
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4">{title}</h1>
                        <h4 className="text-primary">{description}</h4>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                    {/* Title End */}
                    <Col
                        md="5"
                        className="d-flex align-items-start justify-content-end"
                    >
                        <Button
                            variant="outline-primary"
                            className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1"
                            onClick={() => {
                                setAddModal(true);
                            }}
                        >
                            <CsLineIcons icon="edit-square" /> <span>Novo</span>
                        </Button>
                    </Col>
                </Row>
            </div>
            {
                loading ? 'Carregando...' : data.map(({ id, produto, descricao, banco }) => (
                    // eslint-disable-next-line react/jsx-key
                    <ListProdutos
                        id={id}
                        produto={produto}
                        descricao={descricao}
                        banco={banco}
                        key={id}
                    />
                ))
            }
        </>
    );
};

export default ProdutoPage;
