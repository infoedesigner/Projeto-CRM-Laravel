import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Card,
    Spinner,
    Button,
    Modal,
    ButtonGroup,
    Dropdown, FormGroup, Form,
} from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import { useQuery, gql } from '@apollo/client';
import axios from 'axios';
import Swal from "sweetalert2";
import BreadcrumbList from '../../components/breadcrumb-list/BreadcrumbList';
import NenhumRegistro from '../NenhumRegistro';
// eslint-disable-next-line import/no-cycle
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { configAxios } from '../../constants';
import { BASE_URL, BASE_URL_DOCS } from '../../config';
import { NewTabela } from '../create/tabela';
import { ImportTabela } from '../create/tabela/import';
import { dateEnBr } from '../../utils';
import Regras from "../regras/regras";
import TabelaEditPage from "./edit_form";

const TabelaPage = () => {
    const title = 'Tabelas';
    const description = 'Tabelas de produtos';

    const breadcrumbs = [{ to: '', text: 'Home' }];
    const [addModal, setAddModal] = React.useState(false);
    const [importModal, setImportModal] = React.useState(false);
    const [editModal, setEditModal] = React.useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [dataEdit, setDataEdit] = useState({});
    const [error, setError] = useState([]);
    const [idImportacao, setIdImportacao] = useState([]);
    const [search, setSearch] = useState('%');

    const [modalRegrasNegocio, setModalRegrasNegocio] = useState(false);
    const [tabelaTitle, setTabelaTitle] = useState('...');
    const [tabelaId, setTabelaId] = useState(0);

    const handleRegrasNegocio = (id, tabela) => {
        setTabelaId(id);
        setTabelaTitle(tabela);
        setModalRegrasNegocio(true);
    };

    const GET_DATA = async () => {
        configAxios.params = { key: search };
        await axios
            .get(`${BASE_URL}/data/v1/tabela`, configAxios)
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

    const GET_EDIT = async (id) => {
        await axios
            .get(`${BASE_URL}/data/v1/tabela/${id}`, configAxios)
            .then((response) => {
                setDataEdit(response.data);
                setEditModal(true);
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

    const importar = (id) => {
        setIdImportacao(id);
        setImportModal(true);
    };

    if (loading)
        return (
            <>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            </>
        );

    const totalRegistros = data.length;

    const desativar = (id) => {
        Swal.fire({
            title: 'Tem certeza que deseja desativar a tabela?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Sim, desativar',
            denyButtonText: `Não desativar`,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#c04545',
            denyButtonColor: '#1ad058',
            padding: '50px',
            icon: "warning"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`${BASE_URL}/data/v1/tabela/${id}`, configAxios)
                    .then((res)=>{
                        GET_DATA();
                    })
            }
        })
    }

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
                        Cadastro de tabela
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <NewTabela setAddModal={setAddModal} GET_DATA={GET_DATA} />
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

            <Modal
                backdrop="static"
                keyboard={false}
                show={editModal}
                onHide={() => setEditModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="staticBackdropLabel">
                        Editar tabela
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TabelaEditPage id={dataEdit.id} id_banco={dataEdit.id_banco} nome={dataEdit.nome} comissao={dataEdit.comissao} GET_DATA={GET_DATA}/>
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
            {/* Static Backdrop End */}

            <Modal
                backdrop="static"
                keyboard={false}
                show={importModal}
                onHide={() => setImportModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="staticBackdropLabel">
                        Importação de coeficientes
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <ImportTabela
                        setImportModal={setImportModal}
                        idImportacao={idImportacao}
                        GET_DATA={GET_DATA}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setImportModal(false)}
                    >
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Static Backdrop End */}

            {/* inicio modal */}
            <Modal
                show={modalRegrasNegocio}
                onHide={() => setModalRegrasNegocio(false)}
                className="modal-right large"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Regras de negócio da tabela{' '} [{tabelaId}] - {' '}
                        <span className="text-muted">{tabelaTitle} </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Regras tabelaId={tabelaId}/>
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
                    <Col md="6">
                        <h1 className="mb-0 pb-0 display-4">{title}</h1>
                        <h4 className="text-primary">{description}</h4>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                    {/* Title End */}
                    <Col md="4">
                        Layout de importação para download,{' '}
                        <a
                            href={`${BASE_URL_DOCS}/Padrão para importação tabela (coeficientes).xlsx`}
                            className="btn btn-outline-info"
                        >
                            clique aqui.
                        </a>
                    </Col>
                    <Col
                        md="2"
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
                            sm={6}
                            md={3}
                            lg={3}
                            xxl={3}
                            className="pb-2"
                        >
                            <Card className={`${tabela.status===1 ? '' : 'bg-outline-danger'}`}>
                                <Card.Body>
                                    <Row className="mb-3">
                                        <Col
                                            sm={12}
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            xxl={8}
                                        >
                                            <CsLineIcons icon="wallet" />{' '}
                                            <strong>{tabela.nome}[ID {tabela.id}]</strong>
                                            <br />
                                            <CsLineIcons icon="building-large" />{' '}
                                            <span className="text-muted">
                                                {tabela.nome_banco}
                                            </span>
                                            <br />
                                            <CsLineIcons icon="calendar" />
                                            <span className="text-muted">
                                                {' '}
                                                {dateEnBr(tabela.data_cadastro)}
                                            </span>
                                        </Col>
                                        <Col className="text-center text-large">
                                            <h1>{tabela.coeficientes}</h1>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Dropdown
                                                drop="down"
                                                as={ButtonGroup}
                                                className="mb-1"
                                            >
                                                <Button variant="secondary" onClick={()=>{
                                                    GET_EDIT(tabela.id);
                                                }}>
                                                    Editar tabela
                                                </Button>
                                                <Dropdown.Toggle
                                                    split
                                                    variant="secondary"
                                                />
                                                <Dropdown.Menu>
                                                    <Dropdown.Item
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            importar(tabela.id);
                                                        }}
                                                    >
                                                        Importar tabela
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href={`${BASE_URL}/export/coeficientes?id_tabela=${tabela.id}`} target="_blank">
                                                        Visualizar tabela
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#" onClick={()=>{handleRegrasNegocio(tabela.id, tabela.nome)}}>
                                                        Regras de negócio
                                                    </Dropdown.Item>
                                                    <Dropdown.Divider />
                                                    <Dropdown.Item onClick={()=>{desativar(tabela.id)}}>
                                                        Desativar tabela
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>{' '}
                                        </Col>
                                    </Row>
                                </Card.Body>
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

export default TabelaPage;
