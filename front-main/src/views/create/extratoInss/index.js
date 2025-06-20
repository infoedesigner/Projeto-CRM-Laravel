import React, { useState } from 'react';
import { useFormik } from 'formik';
import {Chip, Divider} from "@mui/material";
import {Alert, Button, Col, Form, FormControl, InputGroup, Row} from 'react-bootstrap';
import * as yup from 'yup';
import axios from "axios";
import swal from "@sweetalert/with-react";
import Spreadsheet from "react-spreadsheet";
import {configAxios} from "../../../constants";
import 'react-datepicker/dist/react-datepicker.css';
import ContratosEmprestimosLine from "../../beneficios/contratosEmprestimosLine";
import {BASE_URL} from "../../../config";


export function NewExtratoInssForm(props) {

    const {historicoInssBanco, historicoInssContrato} = props;

    const [status, setStatus] = useState({tipo:'', mensagem:''});
    const [loading, setLoading] = useState(false);

    const validate = async (payload) => {
        const schemaValidate = yup.object().shape({
            banco_codigo: yup.string().required('Campo obrigatório'),
            banco_nome: yup.string().required('Campo obrigatório'),
        })

        try{
            await schemaValidate.validate(payload);
            return true;
        } catch (e) {
            setStatus({tipo:'erro', mensagem: e.errors});
            return false;
        }

    }

    const handleSubmit =  async (values) => {
        const payload = {
            banco_codigo: values.banco_codigo,
        }
        if(!(await validate(payload))){
            return;
        }

         await axios.post(`${BASE_URL}/data/historico-inss`, payload, configAxios)
            .then((response) => {
                if (response.status === 200) {
                    props.setAddedClient(true);
                    // console.log('response',response.data.data);
                    props.setClienteSelecionado ({value: response.data.data.id, label: response.data.data.nome});
                    swal(
                        'Yes ;)',
                        `Histórico incluído com sucesso.`,
                        `success`
                    );
                }else if (response.status === 203){
                    swal(
                        'Atenção :(',
                        `Histórico incluído com sucesso.`,
                        `success`
                    );
                }else{
                    swal(
                        'Ops... :(',
                        `Ocorreu um erro ao incluir o histórico.`,
                        `warning`
                    );
                }
                props.setAddModal(false);
            })
            .catch((error) => {
                swal(
                    'Ops... :(',
                    `Ocorreu um erro ao incluir o cliente.`,
                    `warning`
                );
                console.log('error',error);
                props.setAddModal(false);
            });

    };

    const formik = useFormik({
        initialValues: {
            banco_codigo : historicoInssBanco?.banco_codigo || '',
            banco_nome : historicoInssBanco?.banco_nome || '',
            agencia_codigo : historicoInssBanco?.agencia_codigo || '',
            agencia_nome : historicoInssBanco?.agencia_nome || '',
            agencia_endereco_logradouro : historicoInssBanco?.agencia_endereco_logradouro || '',
            agencia_endereco_bairro : historicoInssBanco?.agencia_endereco_bairro || '',
            agencia_endereco_cidade : historicoInssBanco?.agencia_endereco_cidade || '',
            agencia_endereco_cep : historicoInssBanco?.agencia_endereco_cep || '',
            agencia_endereco_uf : historicoInssBanco?.agencia_endereco_uf || '',
            meio_pagamento_tipo : historicoInssBanco?.meio_pagamento_tipo || ''
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    return (
        <>
            {loading ? (
                <p>Salvando...</p>
            ) : (

                <Form onSubmit={formik.handleSubmit}>
                    { status.mensagem !== ''? <h4 className="alert-danger">{status.mensagem}</h4>: <></>}
                    <Divider className="mb-3 mt-3" ><Chip label="Informações do banco" /></Divider>
                    <Row className="mb-3">
                        <Col sm={12} md={6} lg={4} xl={4} xxl={4}>
                            <Form.Group >
                                <Form.Label>Código do banco</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="banco_codigo"
                                    id="banco_codigo"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.banco_codigo}
                                    className={`form-control ${
                                        formik.touched.banco_codigo &&
                                        formik.errors.banco_codigo
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={4} xxl={4}>
                            <Form.Group >
                                <Form.Label>Nome do banco</Form.Label>
                                    <FormControl aria-label="Email"
                                                 aria-describedby="basic-addon1"
                                                 name="banco_nome"
                                                 id="banco_nome"
                                                 onChange={formik.handleChange}
                                                 onBlur={formik.handleBlur}
                                                 value={formik.values.banco_nome}
                                                 className={`form-control ${
                                                     formik.touched.banco_nome &&
                                                     formik.errors.banco_nome
                                                         ? 'is-invalid'
                                                         : ''
                                                 }`}
                                    />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Divider className="mb-3 mt-3"><Chip label="Agência e endereço" /></Divider>
                    <Row className="mb-3">
                        <Col sm={12} md={6} lg={2} xl={2} xxl={2}>
                            <Form.Group >
                                <Form.Label>Código da agência</Form.Label>
                                <Form.Control type="text"
                                              name="agencia_codigo"
                                              id="agencia_codigo"
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              value={formik.values.agencia_codigo}
                                              className={`form-control ${
                                                  formik.touched.agencia_codigo &&
                                                  formik.errors.agencia_codigo
                                                      ? 'is-invalid'
                                                      : ''
                                              }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={4} xxl={4}>
                            <Form.Group >
                                <Form.Label>Nome da agência</Form.Label>
                                <FormControl aria-label="Email"
                                             aria-describedby="basic-addon1"
                                             name="agencia_nome"
                                             id="agencia_nome"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.agencia_nome}
                                             className={`form-control ${
                                                 formik.touched.agencia_nome &&
                                                 formik.errors.agencia_nome
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={12} md={6} lg={4} xl={6} xxl={6}>
                            <Form.Group >
                                <Form.Label>Endereço</Form.Label>
                                <Form.Control type="text"
                                              name="agencia_endereco_logradouro"
                                              id="agencia_endereco_logradouro"
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              value={formik.values.agencia_endereco_logradouro}
                                              className={`form-control ${
                                                  formik.touched.agencia_endereco_logradouro &&
                                                  formik.errors.agencia_endereco_logradouro
                                                      ? 'is-invalid'
                                                      : ''
                                              }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <Form.Group >
                                <Form.Label>Bairro</Form.Label>
                                <FormControl aria-label="agencia_endereco_bairro"
                                             aria-describedby="basic-addon1"
                                             name="agencia_endereco_bairro"
                                             id="agencia_endereco_bairro"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.agencia_endereco_bairro}
                                             className={`form-control ${
                                                 formik.touched.agencia_endereco_bairro &&
                                                 formik.errors.agencia_endereco_bairro
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <Form.Group >
                                <Form.Label>Cidade</Form.Label>
                                <FormControl aria-label="agencia_endereco_cidade"
                                             aria-describedby="basic-addon1"
                                             name="agencia_endereco_cidade"
                                             id="agencia_endereco_cidade"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.agencia_endereco_cidade}
                                             className={`form-control ${
                                                 formik.touched.agencia_endereco_cidade &&
                                                 formik.errors.agencia_endereco_cidade
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <Form.Group >
                                <Form.Label>CEP</Form.Label>
                                <Form.Control type="text"
                                              name="agencia_endereco_cep"
                                              id="agencia_endereco_cep"
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              value={formik.values.agencia_endereco_cep}
                                              className={`form-control ${
                                                  formik.touched.agencia_endereco_cep &&
                                                  formik.errors.agencia_endereco_cep
                                                      ? 'is-invalid'
                                                      : ''
                                              }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <Form.Group >
                                <Form.Label>Estado</Form.Label>
                                <FormControl aria-label="agencia_endereco_uf"
                                             aria-describedby="basic-addon1"
                                             name="agencia_endereco_uf"
                                             id="agencia_endereco_uf"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.agencia_endereco_uf}
                                             className={`form-control ${
                                                 formik.touched.agencia_endereco_uf &&
                                                 formik.errors.agencia_endereco_uf
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <Form.Group >
                                <Form.Label>Meio pagamento/Tipo</Form.Label>
                                <FormControl aria-label="meio_pagamento_tipo"
                                             aria-describedby="basic-addon1"
                                             name="meio_pagamento_tipo"
                                             id="meio_pagamento_tipo"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.meio_pagamento_tipo}
                                             className={`form-control ${
                                                 formik.touched.meio_pagamento_tipo &&
                                                 formik.errors.meio_pagamento_tipo
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Divider className="mb-3 mt-3" ><Chip label="Extrato consignado (contratos/empréstimos)" /></Divider>
                    <Row>
                        <Col>
                            <ContratosEmprestimosLine historicoInssContrato={historicoInssContrato}/>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col>
                            <Button
                                id="salvar-cliente"
                                type="submit"
                                className="btn"
                            >
                                Salvar
                            </Button>
                        </Col>
                    </Row>
                </Form>
            )}
        </>
    );
}
