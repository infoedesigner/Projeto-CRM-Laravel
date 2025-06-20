import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Col,
    Form,
    Modal,
    Nav,
    Row,
    Tab,
} from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import swal from '@sweetalert/with-react';
import { configAxios } from '../../../constants';
import { BASE_URL } from '../../../config';

import currencyFormatter from '../../../utils';

const ConsultaLinhasCredito = (props) => {
    const { modalCpf, setModalCpf } = props;

    const [beneficiario, setBeneficiario] = useState('Aguardando CPF');
    const [isLoading, setIsLoading] = useState(true);
    const [checkUuid, setCheckUuid] = useState(null);
    const [apisINSS, setApisINSS] = useState([]);
    const [apisFGTS, setApisFGTS] = useState([]);

    const getBeneficiosByCPFINSS = async (vars) => {
        setIsLoading(true);
        setCheckUuid(null);
        setBeneficiario('Consultando...');
        configAxios.params = {
            cpf: vars.cpf,
            apis: vars.apis,
            valor: vars.valor,
            data_nascimento: vars.data_nascimento,
            nome: vars.nome,
        };

        await axios
            .get(`${BASE_URL}/data/getBeneficiosByCPF/${vars.cpf}`, configAxios)
            .then((res) => {
                if (res.status === 200) {
                    swal(
                        'Yes ;)',
                        `Consulta na fila de processamento.`,
                        `success`
                    );
                    setBeneficiario(`${res.data.message}`);
                    setCheckUuid(res.data.uuid);
                }
                if (res.status === 202) {
                    setBeneficiario(res.data.message);
                }
            })
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                swal('ERRO', `${error}`, 'error');
            });
    };

    const fetchApisINSS = async () => {
        await axios
            .get(`${BASE_URL}/data/apis-select/INSS`, configAxios)
            .then((response) => {
                setApisINSS(response.data);
            })
            .then(() => {
                setIsLoading(false);
            });
    };

    const fetchApisFGTS = async () => {
        await axios
            .get(`${BASE_URL}/data/apis-select/FGTS`, configAxios)
            .then((response) => {
                setApisFGTS(response.data);
            })
            .then(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchApisINSS();
        fetchApisFGTS();
    }, []);

    const formikINSS = useFormik({
        initialValues: {
            cpf: '',
            apis: [],
        },
        validationSchema: yup.object({
            cpf: yup.string().required('O campo é obrigatório.'),
        }),
        onSubmit: (values, formikApi) => {
            getBeneficiosByCPFINSS(values);
            formikApi.resetForm({ values: { ...values, apis: '' } });
        },
    });

    const formikFGTS = useFormik({
        initialValues: {
            cpf: '',
            apis: [],
            valor: 0.0,
            data_nascimento: '',
            nome: '',
        },
        validationSchema: yup.object({
            cpf: yup.string().required('O campo é obrigatório.'),
            nome: yup.string().required('O campo é obrigatório.'),
        }),
        onSubmit: (values, formikApi) => {
            getBeneficiosByCPFINSS(values);
            formikApi.resetForm({ values: { ...values, apis: '' } });
        },
    });

    return (
        <Modal
            show={modalCpf}
            onHide={() => setModalCpf(false)}
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>Consulta linhas de crédito</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Card className="mb-3">
                    <Tab.Container defaultActiveKey="INSS">
                        <Card.Header className="border-0 pb-0">
                            <Nav
                                className="nav-tabs-line"
                                variant="tabs"
                                activeKey="INSS"
                            >
                                <Nav.Item>
                                    <Nav.Link eventKey="INSS">INSS</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="OUTROS">
                                        Outros convênios
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="FGTS">FGTS</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        <Card.Body>
                            <Tab.Content>
                                <Tab.Pane eventKey="INSS">
                                    <Card.Title>Consulta INSS</Card.Title>
                                    <Card.Text>
                                        <Form
                                            onSubmit={formikINSS.handleSubmit}
                                        >
                                            <Row>
                                                <Col>
                                                    <div className="mb-3 form-floating">
                                                        <NumberFormat
                                                            mask="-"
                                                            format="###.###.###-##"
                                                            allowEmptyFormatting
                                                            onChange={
                                                                formikINSS.handleChange
                                                            }
                                                            onBlur={
                                                                formikINSS.handleBlur
                                                            }
                                                            value={
                                                                formikINSS
                                                                    .values.cpf
                                                            }
                                                            name="cpf"
                                                            id="cpf"
                                                            className={`form-control ${
                                                                formikINSS
                                                                    .touched
                                                                    .cpf &&
                                                                formikINSS
                                                                    .errors.cpf
                                                                    ? 'is-invalid'
                                                                    : ''
                                                            }`}
                                                        />
                                                        <Form.Label>
                                                            CPF
                                                        </Form.Label>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    {apisINSS.length <= 0 ||
                                                    isLoading ? (
                                                        <div>
                                                            Nenhum produto
                                                            encontrado.{' '}
                                                            <Button
                                                                onClick={() => {
                                                                    fetchApisINSS();
                                                                }}
                                                            >
                                                                Atualizar
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        apisINSS.map(
                                                            (item, key) => {
                                                                const name = `apis`;
                                                                return (
                                                                    <Form.Check
                                                                        name={
                                                                            name
                                                                        }
                                                                        type="switch"
                                                                        id={`checkedSwitch${key}`}
                                                                        label={
                                                                            item.api_name
                                                                        }
                                                                        value={
                                                                            item.id
                                                                        }
                                                                        onChange={
                                                                            formikINSS.handleChange
                                                                        }
                                                                        onBlur={
                                                                            formikINSS.handleBlur
                                                                        }
                                                                        key={
                                                                            key
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                        )
                                                    )}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Alert className="alert alert-info">
                                                        {beneficiario}{' '}
                                                    </Alert>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Button
                                                        onClick={() => {
                                                            formikINSS.submitForm();
                                                        }}
                                                    >
                                                        Consultar INSS
                                                    </Button>
                                                </Col>
                                            </Row>
                                            {checkUuid !== null ? (
                                                <Row className="mt-5">
                                                    <Col>
                                                        <Link
                                                            to={`/view-beneficios-inprocess/${checkUuid}`}
                                                            className="btn btn-success"
                                                        >
                                                            Visualizar
                                                        </Link>
                                                    </Col>
                                                </Row>
                                            ) : (
                                                ''
                                            )}
                                        </Form>
                                    </Card.Text>
                                </Tab.Pane>
                                <Tab.Pane eventKey="OUTROS">
                                    <Card.Title>Outros convênios</Card.Title>
                                    <Card.Text>
                                        <p>
                                            Nenhum convênio encontrado para essa
                                            modalidade.
                                        </p>
                                    </Card.Text>
                                </Tab.Pane>
                                <Tab.Pane eventKey="FGTS">
                                    <Card.Title>Consulta FGTS</Card.Title>
                                    <Card.Text>
                                        <Form
                                            onSubmit={formikFGTS.handleSubmit}
                                        >
                                            <Row>
                                                <Col>
                                                    <div className="mb-3 form-floating">
                                                        <Form.Control
                                                            type="text"
                                                            name="nome"
                                                            id="nome"
                                                            onChange={
                                                                formikFGTS.handleChange
                                                            }
                                                            onBlur={
                                                                formikFGTS.handleBlur
                                                            }
                                                            value={
                                                                formikFGTS
                                                                    .values.nome
                                                            }
                                                            className={`form-control ${
                                                                formikFGTS
                                                                    .touched
                                                                    .nome &&
                                                                formikFGTS
                                                                    .errors.nome
                                                                    ? 'is-invalid'
                                                                    : ''
                                                            }`}
                                                        />
                                                        <Form.Label>
                                                            NOME
                                                        </Form.Label>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <div className="mb-3 form-floating">
                                                        <NumberFormat
                                                            mask="-"
                                                            format="###.###.###-##"
                                                            allowEmptyFormatting
                                                            onChange={
                                                                formikFGTS.handleChange
                                                            }
                                                            onBlur={
                                                                formikFGTS.handleBlur
                                                            }
                                                            value={
                                                                formikFGTS
                                                                    .values.cpf
                                                            }
                                                            name="cpf"
                                                            id="cpf"
                                                            className={`form-control ${
                                                                formikFGTS
                                                                    .touched
                                                                    .cpf &&
                                                                formikFGTS
                                                                    .errors.cpf
                                                                    ? 'is-invalid'
                                                                    : ''
                                                            }`}
                                                        />
                                                        <Form.Label>
                                                            CPF
                                                        </Form.Label>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={12} md={6} lg={6}>
                                                    <div className="mb-3 form-floating">
                                                        <NumberFormat
                                                            format={
                                                                currencyFormatter
                                                            }
                                                            onChange={
                                                                formikFGTS.handleChange
                                                            }
                                                            onBlur={
                                                                formikFGTS.handleBlur
                                                            }
                                                            value={
                                                                formikFGTS
                                                                    .values
                                                                    .valor
                                                            }
                                                            name="valor"
                                                            id="valor"
                                                            className={`form-control ${
                                                                formikFGTS
                                                                    .touched
                                                                    .valor &&
                                                                formikFGTS
                                                                    .errors
                                                                    .valor
                                                                    ? 'is-invalid'
                                                                    : ''
                                                            }`}
                                                        />
                                                        <Form.Label>
                                                            Valor
                                                        </Form.Label>
                                                    </div>
                                                </Col>
                                                <Col sm={12} md={6} lg={6}>
                                                    <div className="mb-3 form-floating">
                                                        <NumberFormat
                                                            mask="-"
                                                            format="##-##-####"
                                                            onChange={
                                                                formikFGTS.handleChange
                                                            }
                                                            onBlur={
                                                                formikFGTS.handleBlur
                                                            }
                                                            value={
                                                                formikFGTS
                                                                    .values
                                                                    .data_nascimento
                                                            }
                                                            name="data_nascimento"
                                                            id="data_nascimento"
                                                            className={`form-control ${
                                                                formikFGTS
                                                                    .touched
                                                                    .data_nascimento &&
                                                                formikFGTS
                                                                    .errors
                                                                    .data_nascimento
                                                                    ? 'is-invalid'
                                                                    : ''
                                                            }`}
                                                        />
                                                        <Form.Label>
                                                            Data nascimento
                                                        </Form.Label>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    {apisFGTS.length <= 0 ||
                                                    isLoading ? (
                                                        <div>
                                                            Nenhum produto
                                                            encontrado.{' '}
                                                            <Button
                                                                onClick={() => {
                                                                    fetchApisFGTS();
                                                                }}
                                                            >
                                                                Atualizar
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        apisFGTS.map(
                                                            (item, key) => {
                                                                const name = `apis`;
                                                                return (
                                                                    <Form.Check
                                                                        name={
                                                                            name
                                                                        }
                                                                        type="switch"
                                                                        id={`checkedSwitch${key}`}
                                                                        label={
                                                                            item.api_name
                                                                        }
                                                                        value={
                                                                            item.id
                                                                        }
                                                                        onChange={
                                                                            formikFGTS.handleChange
                                                                        }
                                                                        onBlur={
                                                                            formikFGTS.handleBlur
                                                                        }
                                                                        key={
                                                                            key
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                        )
                                                    )}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Alert className="alert alert-info">
                                                        {beneficiario}{' '}
                                                    </Alert>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Button
                                                        onClick={() => {
                                                            formikFGTS.submitForm();
                                                        }}
                                                    >
                                                        Consultar FGTS
                                                    </Button>
                                                </Col>
                                            </Row>
                                            {checkUuid !== null ? (
                                                <Row>
                                                    <Col>
                                                        <Link
                                                            to={`/view-beneficios-inprocess/${checkUuid}`}
                                                            className="btn btn-primary"
                                                        >
                                                            Visualizar
                                                        </Link>
                                                    </Col>
                                                </Row>
                                            ) : (
                                                ''
                                            )}
                                        </Form>
                                    </Card.Text>
                                </Tab.Pane>
                            </Tab.Content>
                        </Card.Body>
                    </Tab.Container>
                </Card>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalCpf(false)}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConsultaLinhasCredito;
