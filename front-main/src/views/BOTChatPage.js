import React, {useEffect, useState} from 'react';
import {
    Row,
    Col,
    Card,
    Spinner,
    Button,
    Modal,
    Form as BootstrapForm,
    Form,
    InputGroup,
    FormLabel
} from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import Masonry from "react-masonry-css";
import Pagination from "react-js-pagination";
import * as Yup from "yup";
import {Formik} from "formik";
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';
import {BASE_URL} from '../config';
import {configAxios} from '../constants';

import '../masonry.css';
import CsLineIcons from "../cs-line-icons/CsLineIcons";

const BOTChatPage = () => {
    const title = 'BOT/Chat';
    const description = 'Frases de treinamento do BOT';

    const breadcrumbs = [{to: '', text: 'Home'}];
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const [modalAdd, setModalAdd] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);

    const [editForm, setEditForm] = useState({pergunta: 'a',resposta:'b'});

    const validationSchema = Yup.object().shape({
        pergunta: Yup.string().required('Campo obrigatório'),
        resposta: Yup.string().required('Campo obrigatório'),
    });

    const fetchMessages = async (page) => {
        setLoading(true);

        configAxios.params = {
            page: page > 1 ? page : 1,
        };

        await axios
            .get(`${BASE_URL}/data/botchat`, configAxios)
            .then((res) => {
                if (res.status === 200) {
                    setData(res.data);
                }
            })
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                swal('ERRO', `${error}`, 'error');
            });
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    if (loading){
        console.log('Carregando...');
        return (
            <>
                <div className="text-center">
                    <Spinner animation="border" variant="primary"/>
                </div>
            </>
        );
    }

    const triggerEditQuestao = async (id) => {
        await axios
            .get(`${BASE_URL}/data/botchat/${id}`, configAxios)
            .then((res) => {
                if (res.status === 200) {
                    setEditForm(res.data);
                    setModalEdit(true);
                }
            })
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                swal('ERRO', `${error}`, 'error');
            });
    }

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <>
            <HtmlHead title={title} description={description}/>
            <div className="page-title-container">
                <Row>
                    {/* Title Start */}
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4">{title}</h1>
                        <h4 className="text-primary">{description}</h4>
                        <BreadcrumbList items={breadcrumbs}/>
                    </Col>
                    {/* Title End */}
                </Row>
                <Row>
                    <Col sm={6} md={6} lg={2}>
                        <Button
                            onClick={() => {
                                setModalAdd(true);
                            }}
                        >
                            <CsLineIcons icon="filter"/>{' '}
                            <span>Novo questão</span>
                        </Button>
                    </Col>
                </Row>
            </div>
            <Row>
                <Col sm={12} md={12} lg={12} xl={12}>
                    <Pagination
                        activePage={data?.current_page ? data?.current_page : 0}
                        itemsCountPerPage={data?.per_page ? data?.per_page : 0}
                        totalItemsCount={data?.total ? data?.total : 0}
                        onChange={(pageNumber) => {
                            fetchMessages(pageNumber)
                        }}
                        pageRangeDisplayed={20}
                        itemClass="page-item"
                        linkClass="page-link"
                    />
                </Col>
            </Row>
            { /* Modal Add */}
            <Modal
                backdrop="static"
                className="modal-right large"
                show={modalAdd}
                onHide={() => {
                    setModalAdd(false);
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cadastro de questão para treinamento do BOT de IA</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            pergunta: '',
                            resposta: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            await axios
                                .post(`${BASE_URL}/data/botchat`, values,configAxios)
                                .then((res) => {
                                    if (res.status === 200 || res.status === 201) {
                                        fetchMessages(1);
                                    }
                                })
                                .then(() => {
                                    setLoading(false);
                                })
                                .catch((error) => {
                                    swal('ERRO', `${error}`, 'error');
                                });
                        }}
                    >
                        {({values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              setFieldValue,
                              isSubmitting }) => (
                            <form onSubmit={handleSubmit}>
                                <Row className="g-1">
                                    <Col sm={12} md={12} lg={12}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>Questão/Pergunta</BootstrapForm.Label>
                                            <Form.Control as="textarea" rows={3} name="pergunta" id="pergunta" onChange={handleChange} onBlur={handleBlur} value={values.pergunta}/>
                                        </BootstrapForm.Group>
                                        {errors.pergunta && touched.pergunta && <div>{errors.pergunta}</div>}
                                    </Col>
                                    <Col sm={12} md={12} lg={12}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>Ação/Resposta</BootstrapForm.Label>
                                            <Form.Control as="textarea" rows={3} name="resposta" id="resposta" onChange={handleChange} onBlur={handleBlur} value={values.resposta}/>
                                        </BootstrapForm.Group>
                                        {errors.resposta && touched.resposta && <div>{errors.resposta}</div>}
                                    </Col>
                                    <Col sm={12} md={12} lg={12}>
                                        <Button type="submit">{isSubmitting ? 'Enviando...':'Salvar'}</Button>
                                    </Col>
                                </Row>
                            </form>
                        )}
                    </Formik>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setModalAdd(false);
                        }}
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal Edit */}
            <Modal
                backdrop="static"
                className="modal-right large"
                show={modalEdit}
                onHide={() => {
                    setModalEdit(false);
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Editar questão de treinamento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            id: editForm.id || '',
                            pergunta: editForm.pergunta || '',
                            resposta: editForm.resposta || '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            setLoading(true);
                            await axios
                                .put(`${BASE_URL}/data/botchat/${values.id}`, values,configAxios)
                                .then((res) => {
                                    if (res.status === 200) {
                                        setLoading(false);
                                    }
                                })
                                .then(() => {
                                    setLoading(false);
                                })
                                .catch((error) => {
                                    swal('ERRO', `${error}`, 'error');
                                });
                        }}
                    >
                        {({values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              setFieldValue,
                              isSubmitting }) => (
                            <form onSubmit={handleSubmit}>
                                <Row className="g-1">
                                    <Col sm={12} md={12} lg={12}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>Questão/Pergunta</BootstrapForm.Label>
                                            <Form.Control as="textarea" rows={3} name="pergunta" id="pergunta" onChange={handleChange} onBlur={handleBlur} value={values.pergunta}/>
                                        </BootstrapForm.Group>
                                        {errors.pergunta && touched.pergunta && <div>{errors.pergunta}</div>}
                                    </Col>
                                    <Col sm={12} md={12} lg={12}>
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>Ação/Resposta</BootstrapForm.Label>
                                            <Form.Control as="textarea" rows={3} name="resposta" id="resposta" onChange={handleChange} onBlur={handleBlur} value={values.resposta}/>
                                        </BootstrapForm.Group>
                                        {errors.resposta && touched.resposta && <div>{errors.resposta}</div>}
                                    </Col>
                                    <Col sm={12} md={12} lg={12}>
                                        <Button type="submit">{isSubmitting ? 'Enviando...':'Salvar'}</Button>
                                    </Col>
                                </Row>
                            </form>
                        )}
                    </Formik>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setModalEdit(false);
                        }}
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {
                    data.map((i, k) => {
                        return <Col key={k} sm={12} md={4} lg={4}>
                            <Card className="h-100 hover-scale-up" id="introThird">
                                <Card.Body>
                                    <Row className="g-1">
                                        <Col sm={12} md={12} lg={12}><strong>Questão/pergunta:</strong> {i.pergunta}</Col>
                                        <Col sm={12} md={12} lg={12}><strong>Ação/resposta:</strong> {i.resposta}</Col>
                                        <Col><Button onClick={() => {
                                            triggerEditQuestao(i.id);
                                        }}>Editar</Button></Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    })
                }
            </Masonry>
        </>
    );
};

export default BOTChatPage;
