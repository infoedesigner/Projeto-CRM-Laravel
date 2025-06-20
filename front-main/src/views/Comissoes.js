import React, { useEffect, useState } from 'react';
import {Row, Col, Card, Spinner, Button, Modal, Form as BootstrapForm, FormGroup, CardBody} from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import axios from "axios";
import Swal from "sweetalert2";
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from '../cs-line-icons/CsLineIcons';
import {configAxios} from "../constants";
import {BASE_URL} from "../config";
import {ComissoesAddPage} from "./create/comissoes";

const ComissoesPage = () => {
    const title = 'Comissões';
    const description = 'Lista de comissões';
    const breadcrumbs = [{ to: '', text: 'Home' }];
    const [modalAdd, setModalAdd] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const add = () => {
    }

    const GET_DATA = async() => {
        await axios
            .get(`${BASE_URL}/data/v1/comissao`,configAxios)
            .then((response) => {
                setData(response.data.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        GET_DATA();
    },[]);

    const deletar = (id) => {
        Swal.fire({
            title: 'Deletar comissão',
            text: "Atenção, deseja deletar a comissão?.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#da1919',
            cancelButtonColor: '#52e152',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${BASE_URL}/data/v1/comissao/${id}`,configAxios).finally(()=>{
                    GET_DATA();
                });
            }
        })
    }

    return (
        <>
            <HtmlHead title={title} description={description} />
            {/* inicio modal */}
            <Modal
                show={modalAdd}
                onHide={() => setModalAdd(false)}
                className="modal-right large"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Cadastro de comissões
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="g-3 mb-7">
                        <Col>
                            <ComissoesAddPage modalAdd={modalAdd} setModalAdd={setModalAdd} GET_DATA={GET_DATA}/>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setModalAdd(!modalAdd);
                        }}
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* fim modal */}
            <div className="page-title-container">
                <Row>
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4">{title}</h1>
                        <h4 className="text-primary">{description}</h4>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>

                    <Col
                        md="5"
                        className="d-flex align-items-start justify-content-end"
                    >
                        <Button
                            variant="outline-primary"
                            className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1"
                            onClick={() => {
                                setModalAdd(true);
                            }}
                        >
                            <CsLineIcons icon="edit-square" /> <span>Novo</span>
                        </Button>
                    </Col>
                </Row>
            </div>
            {
                loading ? 'Carregando...' : <Row>
                    {
                        data?.map((item,key) => (
                            <Col key={key} sm={12} md={6} lg={3}>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col sm={12} md={12} lg={10}><h3>{item.nome_banco}</h3></Col>
                                            <Col>
                                                <Button size="sm" variant="danger" onClick={()=>{
                                                    deletar(item.id);
                                                }}>
                                                    <CsLineIcons icon="close" size={12}/>
                                                </Button>
                                            </Col>
                                            <Col sm={12} md={12} lg={12}>{item.tabela}</Col>
                                            <Col sm={12} md={12} lg={12}>{`Prazo entre ${item.parcelas_inicio} e ${item.parcelas_fim}`}</Col>
                                            <Col sm={12} md={12} lg={12}>{`Comissão ${item.percent_comissao}`}</Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            }
        </>
    );
};

export default ComissoesPage;
