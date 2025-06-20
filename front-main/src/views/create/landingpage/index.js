import React, {FormEvent, Fragment, useEffect, useState} from 'react';
import { gql, useMutation } from '@apollo/client';
import swal from "@sweetalert/with-react";
import axios from "axios";
import {
    Alert,
    Button,
    Col,
    Form, FormControl,
    InputGroup,
    Modal,
    Row,
} from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import * as yup from 'yup';
import { useFormik } from 'formik';
import Select from "react-select";
import NumberFormat from "react-number-format";
import DatePicker from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import {configAxios} from "../../../constants";
import {BASE_URL, BASE_URL_DOCS} from "../../../config";

export function LandingPage(props) {

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {

        setLoading(true);
        await axios.post(
            `${BASE_URL_DOCS}/edata/landingpage`, values)
            .then((response) => {
                if (response.status === 200) {
                    swal(
                        'Yes ;)',
                        `LEAD salvo com sucesso.`,
                        `success`
                    );
                }
            })
            .catch((error) => {
                swal(
                    'Ops... :(',
                    `Ocorreu um erro ao salvar.`,
                    `warning`
                );
                console.log('error',error);
            }).finally(()=>{
                setLoading(false);
            });
    };

    useEffect( () =>{

    },[]);

    const formik = useFormik({
        initialValues: {
            produto:'',
            nome: '',
            cpf: '',
            celular: '',
        },
        validationSchema: yup.object({
            produto: yup.string().required('O produto é campo obrigatório!'),
            nome: yup.string().required('O nome é campo obrigatório!'),
            cpf: yup.string().required('O CPF é campo obrigatório!'),
            celular: yup.string().required('O celular é campo obrigatório!'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            handleSubmit(values);
        },
    });

    const produtos = [
        {label:'Cartão', value:'CARTAO-DE-CREDITO'},
        {label:'Crédito saúde FGTS', value:'CREDITO-SAUDE-FGTS'},
        {label:'Crédito saúde INSS', value:'CREDITO-SAUDE-INSS'},
        {label:'FGTS', value:'FGTS'},
        {label:'Funcionário Público Governo Federal', value:'FUNCIONARIO-PUBLICO-GOVERNO-FEDERAL'},
        {label:'Funcionário Público Governo Paraíba', value:'FUNCIONARIO-PUBLICO-GOVERNO-PARAIBA'},
        {label:'Funcionário Público Governo Paraná', value:'FUNCIONARIO-PUBLICO-GOVERNO-PARANA'},
        {label:'Funcionário Público Governo São Paulo', value:'FUNCIONARIO-PUBLICO-GOVERNO-SAO-PAULO'},
        {label:'INSS', value:'INSS'},
        {label:'Negativado', value:'NEGATIVADO'},
        {label:'Portabilidade de dívidas', value:'PORTABILIDADE-DE-DIVIDAS'},
        {label:'Representante Legal INSS', value:'EMPRESTIMO-PARA-REPRESENTANTE-LEGAL-INSS'},
        {label:'BCP e LOAS', value:'EMPRESTIMO-BPC-E-LOAS'},
        {label:'BLOG', value:'BLOG-INSS'},
        {label:'Cartão benefício', value:'CARTAO-BENEFICIO'},
    ];

    return (
        <>
            <Form onSubmit={ formik.handleSubmit}>
                <h4>Dados do lançamento</h4>
                <Row className="g-3 mb-3">
                    <Col sm={10} md={10} lg={6}>
                        <Form.Label>Produto</Form.Label>
                        <Select
                            placeholder="Selecione"
                            components={ <span className="custom-css-class">Nenhum registro para a busca</span> }
                            onChange={ ( evt ) => {
                                formik.setFieldValue('produto', evt.value);
                            } }
                            options={ produtos }
                            className={`${
                                formik.touched.produto &&
                                formik.errors.produto
                                    ? 'is-invalid'
                                    : ''
                            }`}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={8}>
                        <Form.Label>Nome</Form.Label>
                        <FormControl placeholder=""
                                     aria-label="nome"
                                     aria-describedby="basic-addon1"
                                     name="nome"
                                     id="nome"
                                     onChange={formik.handleChange}
                                     onBlur={formik.handleBlur}
                                     value={formik.values.nome}
                                     className={`form-control ${
                                         formik.touched.nome &&
                                         formik.errors.nome
                                             ? 'is-invalid'
                                             : ''
                                     }`}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={4}>
                        <Form.Label>CPF</Form.Label>
                        <FormControl placeholder=""
                                     aria-label="cpf"
                                     aria-describedby="basic-addon1"
                                     name="cpf"
                                     id="cpf"
                                     onChange={formik.handleChange}
                                     onBlur={formik.handleBlur}
                                     value={formik.values.cpf}
                                     className={`form-control ${
                                         formik.touched.cpf &&
                                         formik.errors.cpf
                                             ? 'is-invalid'
                                             : ''
                                     }`}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={6}>
                        <Form.Label>Celular</Form.Label>
                        <FormControl placeholder=""
                                     aria-label="celular"
                                     aria-describedby="basic-addon1"
                                     name="celular"
                                     id="celular"
                                     onChange={formik.handleChange}
                                     onBlur={formik.handleBlur}
                                     value={formik.values.celular}
                                     className={`form-control ${
                                         formik.touched.celular &&
                                         formik.errors.celular
                                             ? 'is-invalid'
                                             : ''
                                     }`}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={6}>
                        <Form.Label>E-mail</Form.Label>
                        <FormControl placeholder=""
                                     aria-label="email"
                                     aria-describedby="basic-addon1"
                                     name="email"
                                     id="email"
                                     onChange={formik.handleChange}
                                     onBlur={formik.handleBlur}
                                     value={formik.values.email}
                                     className={`form-control ${
                                         formik.touched.email &&
                                         formik.errors.email
                                             ? 'is-invalid'
                                             : ''
                                     }`}
                        />
                    </Col>
                    <Col sm={6} md={6} lg={4} xl={4}>
                        <Form.Group>
                            <Form.Label>Valor</Form.Label>
                            <NumberFormat
                                id="valor"
                                name="valor"
                                className="form-control"
                                allowEmptyFormatting
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.valor}
                                decimalSeparator=","
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={4} lg={4} xl={4} xxl={4}>
                        <Form.Label className="d-block">Data nascimento</Form.Label>
                        <DatePicker className="form-control" locale={ptBR} dateFormat="dd/MM/yyyy" />
                    </Col>
                </Row>
                <Button
                    type='submit'
                >
                    {loading ? 'Salvando, aguarde...' : 'Salvar'}
                </Button>
            </Form>
        </>
    );
}
