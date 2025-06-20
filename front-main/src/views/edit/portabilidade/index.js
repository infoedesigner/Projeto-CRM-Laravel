import React, {FormEvent, Fragment, useEffect, useState} from 'react';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import * as yup from 'yup';
import { useFormik, useFormikContext } from 'formik';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import Select from "react-select";
import SelectBancos from '../../../components/select-bancos';
import { BASE_URL } from '../../../config';
import { configAxios } from '../../../constants';
import SelectTipoRefinPortabilidade from "../../../components/select-tipo-refin-portabilidade";

export function EditPortabilidade(props) {
    const [loading, setLoading] = useState(false);

    const { id, setEditModal, GET_DATA } = props;
    const [show,setShow] = useState({});

    const handleSubmit = async (values) => {
        setLoading(true);
        await axios
            .patch(`${BASE_URL}/data/v1/portabilidade/${id}`, values, configAxios)
            .then((response) => {
                swal('Yes', `Registro salvo com sucesso`, 'success');
                GET_DATA();
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                swal('Ops', `Erro ao realizar o registro ${err}`, 'error');
            });
    };

    const formik = useFormik({
        initialValues: {
            id: show.id || '',
            nome_tabela: show.nome_tabela || '',
            id_banco: show.id_banco || '',
            tipo: show.tipo || '',
            prazo_inicio: show.prazo_inicio || '',
            prazo_fim: show.prazo_fim || '',
            coeficiente: show.coeficiente || '',
            idade_min: show.idade_min || '',
            idade_max: show.idade_max || '',
            seguro: show.seguro || '',
            taxa_juros_minima: show.taxa_juros_minima || '',
        },
        validationSchema: yup.object({
            nome_tabela: yup.string().required('O campo é obrigatório.'),
            id_banco: yup.string().required('O campo é obrigatório.'),
            tipo: yup.string().required('O campo é obrigatório.'),
            prazo_inicio: yup.string().required('O campo é obrigatório.'),
            prazo_fim: yup.string().required('O campo é obrigatório.'),
            coeficiente: yup.string().required('O campo é obrigatório.'),
            idade_min: yup.string().required('O campo é obrigatório.'),
            idade_max: yup.string().required('O campo é obrigatório.'),
            seguro: yup.string().required('O campo é obrigatório.'),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(async () => {
        if(typeof Number(id) === 'number'){
            await axios
                .get(`${BASE_URL}/data/v1/portabilidade/${id}`, configAxios)
                .then((response) => {
                    setShow(response.data);
                    formik.setFieldValue('id', response.data.id);
                    formik.setFieldValue('tipo', response.data.tipo);
                    formik.setFieldValue('nome_tabela', response.data.nome_tabela);
                    formik.setFieldValue('prazo_inicio', response.data.prazo_inicio);
                    formik.setFieldValue('prazo_fim', response.data.prazo_fim);
                    formik.setFieldValue('coeficiente', response.data.coeficiente);
                    formik.setFieldValue('idade_min', response.data.idade_min);
                    formik.setFieldValue('idade_max', response.data.idade_max);
                    formik.setFieldValue('taxa_juros_minima', response.data.taxa_juros_minima);
                    formik.setFieldValue('seguro', response.data.seguro);
                })
                .catch((err) => {
                    swal('Ops', `Erro ao realizar o registro ${err}`, 'error');
                });
        }
    },[id]);

    return (
        <>
            {loading ? (
                <p>Salvando...</p>
            ) : (
                <Form onSubmit={formik.handleSubmit}>
                    <Row className="mb-3">
                        <Col sm={12} md={12} lg={12}>
                            <Form.Group>
                                <Form.Label>Nome da tabela</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nome_tabela"
                                    id="nome_tabela"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.nome_tabela}
                                    className={`form-control ${
                                        formik.touched.nome_tabela &&
                                        formik.errors.nome_tabela
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group>
                                <Form.Label>Banco</Form.Label>
                                <SelectBancos
                                    onChangeValue={(e) => {
                                        formik.setFieldValue('id_banco', e.id);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group>
                                <Form.Label>Tipo</Form.Label>
                                <SelectTipoRefinPortabilidade onChangeValue={(e) => {
                                    formik.setFieldValue('tipo', e.value);
                                }} valor={{value:show.tipo, label:show.tipo}}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={4} md={4} lg={4}>
                            <Form.Group>
                                <Form.Label>Prazo min.</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="prazo_inicio"
                                    id="prazo_inicio"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.prazo_inicio}
                                    className={`form-control ${
                                        formik.touched.prazo_inicio &&
                                        formik.errors.prazo_inicio
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={4} md={4} lg={4}>
                            <Form.Group>
                                <Form.Label>Prazo máx.</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="prazo_fim"
                                    id="prazo_fim"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.prazo_fim}
                                    className={`form-control ${
                                        formik.touched.prazo_fim &&
                                        formik.errors.prazo_fim
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={4} md={4} lg={4}>
                            <Form.Group>
                                <Form.Label>Coeficiente/Fator*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="coeficiente"
                                    id="coeficiente"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.coeficiente}
                                    className={`form-control ${
                                        formik.touched.coeficiente &&
                                        formik.errors.coeficiente
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={4} md={4} lg={4}>
                            <Form.Group>
                                <Form.Label>Idade min.</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="idade_min"
                                    id="idade_min"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.idade_min}
                                    className={`form-control ${
                                        formik.touched.idade_min &&
                                        formik.errors.idade_min
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={4} md={4} lg={4}>
                            <Form.Group>
                                <Form.Label>Idade máx.</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="idade_max"
                                    id="idade_max"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.idade_max}
                                    className={`form-control ${
                                        formik.touched.idade_max &&
                                        formik.errors.idade_max
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={4} md={4} lg={4}>
                            <Form.Group>
                                <Form.Label>Seguro</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="seguro"
                                    id="seguro"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.seguro}
                                    className={`form-control ${
                                        formik.touched.seguro &&
                                        formik.errors.seguro
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={4} md={4} lg={4}>
                            <Form.Group>
                                <Form.Label>Taxa mín. de juros</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="taxa_juros_minima"
                                    id="taxa_juros_minima"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.taxa_juros_minima}
                                    className={`form-control ${
                                        formik.touched.taxa_juros_minima &&
                                        formik.errors.taxa_juros_minima
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>*Coeficiente, seguro e taxa de juros devem ser separados por ponto, exemplo 0.0450</Col>
                    </Row>

                    <Row className="mt-3">
                        <Col>
                            <button
                                type="submit"
                                className="btn btn-outline-primary"
                            >
                                Salvar
                            </button>
                        </Col>
                    </Row>
                </Form>
            )}
        </>
    );
}
