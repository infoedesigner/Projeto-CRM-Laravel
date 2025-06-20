import React, {FormEvent, Fragment, useEffect, useState} from 'react';
import "react-datepicker/dist/react-datepicker.css";
import {useFormik} from "formik";
import {Button, Col, Form, Form as BootstrapForm, Row} from "react-bootstrap";
import axios from "axios";
import swal from "@sweetalert/with-react";
import * as yup from "yup";
import SelectBancos from "../../../components/select-bancos";
import SelectTabelas from "../../../components/select-tabelas";
import {BASE_URL} from "../../../config";
import {configAxios} from "../../../constants";

export function ComissoesAddPage(props) {

    const {modalAdd, setModalAdd, GET_DATA} = props;
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        await axios
            .post(`${BASE_URL}/data/v1/comissao`, values, configAxios)
            .then((response) => {
                swal('Yes', `Registro salvo com sucesso`, 'success');
                GET_DATA();
                setModalAdd(false);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                swal('Ops', `Erro ao realizar o registro ${err}`, 'error');
            });
    };

    const formik= useFormik({
        initialValues: {
            id_banco: '',
            id_tabela: '',
            parcelas_inicio: '',
            parcelas_fim: '',
            valor_comissao: '',
            percent_comissao: '',
        },
        validationSchema : yup.object({
            id_banco: yup.number().required('Campo obrigatório'),
            id_tabela: yup.number().required('Campo obrigatório'),
            parcelas_inicio: yup.number().required('Campo obrigatório'),
            parcelas_fim: yup.number().required('Campo obrigatório'),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    return (
        <>
            {loading ? 'Carregando...' : <Form onSubmit={formik.handleSubmit}>
                <Row>
                    <Col sm={12} md={12} lg={6}>
                        <BootstrapForm.Group className="mb-3" controlId="formBasicEmail">
                            <BootstrapForm.Label>Banco</BootstrapForm.Label>
                            <SelectBancos onChangeValue={(e)=>{
                                console.log(e);
                                formik.setFieldValue('id_banco', e.id);
                            }}/>
                        </BootstrapForm.Group>
                    </Col>
                    <Col sm={12} md={12} lg={6}>
                        <BootstrapForm.Group className="mb-3" controlId="formBasicEmail">
                            <BootstrapForm.Label>Tabela</BootstrapForm.Label>
                            <SelectTabelas onChangeValue={(e)=>{
                                formik.setFieldValue('id_tabela', e.value);
                            }}/>
                        </BootstrapForm.Group>
                    </Col>
                    <Col sm={12} md={12} lg={4}>
                        <Form.Group sm={6} md={6} lg={6}>
                            <Form.Label>Prazo início</Form.Label>
                            <Form.Control
                                type="text"
                                name="parcelas_inicio"
                                id="parcelas_inicio"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.parcelas_inicio}
                                className={`form-control ${
                                    formik.touched.parcelas_inicio &&
                                    formik.errors.parcelas_inicio
                                        ? 'is-invalid'
                                        : ''
                                }`}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={12} lg={4}>
                        <Form.Group sm={6} md={6} lg={6}>
                            <Form.Label>Prazo fim</Form.Label>
                            <Form.Control
                                type="text"
                                name="parcelas_fim"
                                id="parcelas_fim"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.parcelas_fim}
                                className={`form-control ${
                                    formik.touched.parcelas_fim &&
                                    formik.errors.parcelas_fim
                                        ? 'is-invalid'
                                        : ''
                                }`}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group sm={6} md={6} lg={6}>
                            <Form.Label>Comissão (valor fixo)</Form.Label>
                            <Form.Control
                                type="text"
                                name="valor_comissao"
                                id="valor_comissao"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.valor_comissao}
                                className={`form-control ${
                                    formik.touched.valor_comissao &&
                                    formik.errors.valor_comissao
                                        ? 'is-invalid'
                                        : ''
                                }`}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group sm={6} md={6} lg={6}>
                            <Form.Label>Comissão (%)</Form.Label>
                            <Form.Control
                                type="text"
                                name="percent_comissao"
                                id="percent_comissao"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.percent_comissao}
                                className={`form-control ${
                                    formik.touched.percent_comissao &&
                                    formik.errors.percent_comissao
                                        ? 'is-invalid'
                                        : ''
                                }`}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <button
                            type="submit"
                            className="btn btn-outline-primary"
                        >
                            Salvar
                        </button>
                    </Col>
                </Row>
            </Form>}
        </>
    );
}
