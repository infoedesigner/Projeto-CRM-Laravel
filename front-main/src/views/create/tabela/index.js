import React, { FormEvent, Fragment, useState } from 'react';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import * as yup from 'yup';
import { useFormik, useFormikContext } from 'formik';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import SelectBancos from '../../../components/select-bancos';
import { BASE_URL } from '../../../config';
import { configAxios } from '../../../constants';

export function NewTabela(props) {
    const [loading, setLoading] = useState(false);
    const [dataCadastro, setDataCadastro] = useState(null);

    const { GET_DATA } = props;

    const handleSubmit = async (values) => {
        setLoading(true);
        await axios
            .post(`${BASE_URL}/data/v1/tabela`, values, configAxios)
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
            id_banco: '',
            nome: '',
            data_cadastro: '',
        },
        validationSchema: yup.object({
            id_banco: yup.string().required('O campo é obrigatório.'),
            nome: yup.string().required('O campo é obrigatório.'),
            data_cadastro: yup.string().required('O campo é obrigatório.'),
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
                        <Col>
                            <Form.Group>
                                <Form.Label>Banco</Form.Label>
                                <SelectBancos
                                    onChangeValue={(e) => {
                                        formik.setFieldValue('id_banco', e.id);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group>
                                <Form.Label>Nome tabela</Form.Label>
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
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group>
                                <Form.Label>Data cadastro</Form.Label>
                                <DatePicker
                                    className="form-control"
                                    locale={ptBR}
                                    dateFormat="dd/MM/yyyy"
                                    selected={dataCadastro}
                                    onChange={(date) => {
                                        formik.setFieldValue(
                                            'data_cadastro',
                                            date.toLocaleString()
                                        );
                                        setDataCadastro(date);
                                    }}
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
                </Form>
            )}
        </>
    );
}
