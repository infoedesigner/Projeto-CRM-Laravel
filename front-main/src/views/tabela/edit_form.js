import React, { useEffect, useState } from 'react';
import {useFormik} from "formik";
import * as yup from "yup";
import {Button, Col, Form, Row} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import SelectBancos from "../../components/select-bancos";
import {BASE_URL} from "../../config";
import {configAxios} from "../../constants";

const TabelaEditPage = (props) => {

    const {id, nome, id_banco, comissao, GET_DATA} = props;

    const handleSubmit = async (values) => {
        await axios
            .patch(`${BASE_URL}/data/v1/tabela/${id}`, values, configAxios)
            .then((response) => {
                Swal.fire(
                    'Ótimo!',
                    'Tabela atualizada com sucesso.',
                    'success'
                )
                GET_DATA();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const formik = useFormik({
        initialValues: {
            id,
            id_banco,
            nome,
        },
        validationSchema: yup.object({
            nome: yup.string().required('O campo é obrigatório.'),
            comissao: yup.string().required('O campo é obrigatório.'),
            id_banco: yup.string().required('O campo é obrigatório.'),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    return (
        <Row className="gap-3">
            <Col sm={12} md={12} lg={12}>
                <Form.Group>
                    <Form.Label>Banco</Form.Label>
                    <SelectBancos
                        onChangeValue={(e) => {
                            formik.setFieldValue('id_banco', e.id);
                        }}
                    />
                </Form.Group>
            </Col>
            <Col>
                <Form.Group>
                    <Form.Label>Nome da tabela</Form.Label>
                    <Form.Control
                        type="text"
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
                </Form.Group>
            </Col>
            <Col>
                <Form.Group>
                    <Form.Label>Comissão (utilizar ponto como separador)</Form.Label>
                    <Form.Control
                        type="text"
                        name="comissao"
                        id="comissao"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.comissao}
                        className={`form-control ${
                            formik.touched.comissao &&
                            formik.errors.comissao
                                ? 'is-invalid'
                                : ''
                        }`}
                    />
                </Form.Group>
            </Col>
            <Col sm={12} md={12} lg={12}>
                <Button onClick={()=>{ formik.handleSubmit() }}>Salvar</Button>
            </Col>
        </Row>
    );
};

export default TabelaEditPage;
