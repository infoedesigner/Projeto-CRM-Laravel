import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Badge, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import DatePicker from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import { Range } from 'rc-slider';
import ReactTags from 'react-tag-autocomplete';
import { BASE_URL } from '../../../config';
import { configAxios } from '../../../constants';
import 'rc-slider/assets/index.css';

const CampanhaAddPage = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [dataLancamento, setDataLancamento] = useState(new Date());
    const [idade, setIdade] = useState([0, 25]);
    const [tags, setTags] = useState([]);

    const onTagDelete = (i) => {
        const newTags = [...tags];
        newTags.splice(i, 1);
        setTags(newTags);
    };

    const onTagAddition = (tag) => {
        setTags(() => {
            return [...tags, tag];
        });
    };
    // eslint-disable-next-line react/destructuring-assignment
    const { tipo } = props.match.params;

    useEffect(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        console.log(idade);
    }, [idade]);

    const { refetch } = props;

    const handleSubmit = async (values) => {
        setIsLoading(true);
        await axios
            .post(`${BASE_URL}/data/v1/campanha`, values, configAxios)
            .then((response) => {
                swal('Yes', `Campanha salva com sucesso`, 'success');
                refetch();
            })
            .then(() => {
                setIsLoading(false);
            })
            .catch((err) => {
                swal('Ops', `Erro ao criar a campanha ${err}`, 'error');
            });
    };

    const formik = useFormik({
        initialValues: {
            nome_banco: '',
        },
        validationSchema: yup.object({
            nome_banco: yup.string().required('O campo é obrigatório.'),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    return (
        <>
            <Row>
                <Col>
                    {isLoading ? (
                        <Spinner animation="border" />
                    ) : (
                        <Card>
                            <Card.Body>
                                <h1>
                                    Cadastro de campanha{' '}
                                    <Badge bg="success">{tipo}</Badge>
                                </h1>
                                <Form onSubmit={formik.handleSubmit}>
                                    <Row className="mb-3">
                                        <Col sm={12} md={4} lg={4}>
                                            <Form.Group>
                                                <Form.Label>
                                                    Nome da campanha
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="nome_banco"
                                                    id="nome_banco"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    value={
                                                        formik.values.nome_banco
                                                    }
                                                    className={`form-control ${
                                                        formik.touched
                                                            .nome_banco &&
                                                        formik.errors.nome_banco
                                                            ? 'is-invalid'
                                                            : ''
                                                    }`}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={4} lg={4}>
                                            <Form.Label>
                                                Tags para filtro (Digite uma
                                                palavra e pressione enter)
                                            </Form.Label>
                                            <ReactTags
                                                tags={tags}
                                                allowNew
                                                onDelete={onTagDelete}
                                                onAddition={onTagAddition}
                                                placeholderText=""
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12} md={6} lg={6}>
                                            <Form.Label>Mensagem</Form.Label>
                                        </Col>
                                    </Row>
                                    <Row className="mt-5 mb-5">
                                        <Form.Label>Faixa de idade</Form.Label>
                                        <Col sm={12} md={4} lg={4}>
                                            <Range
                                                allowCross={false}
                                                value={idade}
                                                onChange={setIdade}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                style={{ marginLeft: '5px' }}
                                                marks={{
                                                    0: 0,
                                                    25: 25,
                                                    50: 50,
                                                    75: 75,
                                                    100: 100,
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col
                                            sm={12}
                                            md={2}
                                            lg={2}
                                            xl={2}
                                            xxl={2}
                                        >
                                            <Form.Label className="d-block">
                                                Data de início do disparo
                                            </Form.Label>
                                            <DatePicker
                                                className="form-control"
                                                locale={ptBR}
                                                dateFormat="dd/MM/yyyy"
                                                selected={dataLancamento}
                                                onChange={(date) =>
                                                    setDataLancamento(date)
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col>
                                            <button
                                                type="submit"
                                                className="btn btn-outline-primary"
                                            >
                                                Salvar e agendar
                                            </button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default CampanhaAddPage;
