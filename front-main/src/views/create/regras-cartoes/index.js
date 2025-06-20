import React, { FormEvent, Fragment, useState } from 'react';
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
import SelectProdutos from "../../../components/select-produtos";
import SelectTipoRegraCartao from "../../../components/select-tipo-regras-cartoes";

export function NewRegrasCartoes(props) {
    const [loading, setLoading] = useState(false);

    const { GET_DATA } = props;
    const handleSubmit = async (values) => {
        setLoading(true);
        await axios
            .post(`${BASE_URL}/data/v1/regras-cartoes`, values, configAxios)
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
            id_produto: '',
            nome_regra: '',
            tipo: '',
        },
        validationSchema: yup.object({
            id_produto: yup.string().required('O campo é obrigatório.'),
            nome_regra: yup.string().required('O campo é obrigatório.'),
        }),
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
                    <Row className="mb-3">
                        <Col sm={12} md={12} lg={12}>
                            <Form.Group>
                                <Form.Label>Nome da regra</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nome_regra"
                                    id="nome_regra"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.nome_regra}
                                    className={`form-control ${
                                        formik.touched.nome_regra &&
                                        formik.errors.nome_regra
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
                                <Form.Label>Produto</Form.Label>
                                <SelectProdutos
                                    onChangeValue={(e) => {
                                        formik.setFieldValue('id_produto', e.id);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group>
                                <Form.Label>Tipo</Form.Label>
                                <SelectTipoRegraCartao onChangeValue={(e) => {
                                    formik.setFieldValue('tipo', e.value);
                                }} />
                            </Form.Group>
                        </Col>
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
