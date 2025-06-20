import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Card,
    Spinner,
    Button,
    Modal, Form,
} from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import axios from 'axios';
import Swal from "sweetalert2";
import BreadcrumbList from '../../components/breadcrumb-list/BreadcrumbList';
import NenhumRegistro from '../NenhumRegistro';
// eslint-disable-next-line import/no-cycle
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { configAxios } from '../../constants';
import { BASE_URL, BASE_URL_DOCS } from '../../config';
import { dateEnBr } from '../../utils';
import {NewPortabilidade} from "../create/portabilidade";
import {EditPortabilidade} from "../edit/portabilidade";
import Regras from "../regras/regras";
import RegrasNegocioPortabilidade from "../regras-negocio-portabilidade";

const PortabilidadePage = () => {
    const title = 'Tabelas';
    const description = 'Tabelas de coeficientes de refinanciamento e portabilidade-card'

    const breadcrumbs = [{ to: '', text: 'Home' }];
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [addModal, setAddModal] = React.useState(false);
    const [editModal, setEditModal] = React.useState(false);
    const [error, setError] = useState([]);
    const [id, setId] = useState(null);

    const [modalRegrasNegocio, setModalRegrasNegocio] = useState(false);
    const [tabelaId, setTabelaId] = useState(null);
    const [tabelaTitle, setTabelaTitle] = useState(null);
    const [search, setSearch] = useState('%');

    const GET_DATA = async () => {
        configAxios.params = { key: search };
        await axios
            .get(`${BASE_URL}/data/v1/portabilidade`, configAxios)
            .then((response) => {
                setData(response.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
    };

    useEffect(() => {
        GET_DATA();
    }, []);

    const handleEdit = (id_edit) => {
        setId(id_edit);
        setEditModal(true);
    }

    const handleRegrasNegocio = (id_portabilidade, tabela) => {
        setTabelaId(id_portabilidade);
        setTabelaTitle(tabela);
        setModalRegrasNegocio(true);
    }

    if (loading)
        return (
            <>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            </>
        );

    const totalRegistros = data.length;

    return (
        <>
            {/* Static Backdrop Start */}
            <Modal
                backdrop="static"
                keyboard={false}
                show={addModal}
                onHide={() => setAddModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="staticBackdropLabel">
                        Cadastro de refin./portabilidade
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <NewPortabilidade setAddModal={setAddModal} GET_DATA={GET_DATA} />
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

            {/* Static Backdrop Start */}
            <Modal
                backdrop="static"
                keyboard={false}
                show={editModal}
                onHide={() => setEditModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="staticBackdropLabel">
                        Edição de refin./portabilidade
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditPortabilidade setEditModal={setEditModal} id={id} GET_DATA={GET_DATA}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setEditModal(false)}
                    >
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* inicio modal */}
            <Modal
                show={modalRegrasNegocio}
                onHide={() => setModalRegrasNegocio(false)}
                className="modal-right large"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Regras de negócio da tabela{' '}
                        <span className="text-muted">{tabelaTitle}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegrasNegocioPortabilidade tabelaId={tabelaId}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setModalRegrasNegocio(!modalRegrasNegocio);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setModalRegrasNegocio(!modalRegrasNegocio);
                        }}
                    >
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* fim modal */}

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
            <Row className="mb-3">
                <Col>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col sm={6} md={6} lg={6}>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            name="search"
                                            id="search"
                                            onChange={(e)=>{
                                                setSearch(e.target.value);
                                            }}
                                            placeholder="Parte do nome ou ID da tabela"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Button variant="primary" className="btn-icon" onClick={()=>{
                                        GET_DATA();
                                    }}>Buscar</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                {totalRegistros > 0 ? (
                    data.map((tabela) => (
                        <Col
                            key={tabela.id}
                            sm={12}
                            md={12}
                            lg={3}
                            xxl={3}
                            className="pb-2"
                        >
                            <Card className={`${tabela.status===1 ? '' : 'bg-outline-danger'}`}>
                                <Card.Header><CsLineIcons icon="building-large" />{' '} {`${tabela.nome_tabela} banco ${tabela.nome_banco} [${tabela.id}]`}</Card.Header>
                                <Card.Body>
                                    <Row className="mb-3">
                                        <Col sm={12} md={12} lg={12}>
                                            <strong>{`Prazo ${tabela.prazo_inicio} á ${tabela.prazo_fim}`}</strong>
                                            <br />
                                            {`Coeficiente ${tabela.coeficiente}`}
                                            <br />
                                            {`Taxa mínima de juros ${tabela.taxa_juros_minima}`}
                                            <br />
                                            <span className="text-muted">
                                                {`Seguro ${tabela.seguro}`}
                                            </span>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer>
                                    <Row>
                                        <Col><Button variant="outline-info" onClick={()=>{handleRegrasNegocio(tabela.id,tabela.nome_tabela)}}>Regras de negócio</Button></Col>
                                        <Col><Button variant="outline-primary" onClick={()=>{handleEdit(tabela.id)}}>Editar</Button></Col>
                                    </Row>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <NenhumRegistro />
                    </Col>
                )}
            </Row>
        </>
    );
};

export default PortabilidadePage;
