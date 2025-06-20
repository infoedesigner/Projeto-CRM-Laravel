import { FormEvent, Fragment, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import { configAxios } from '../../../constants';
import { BASE_URL } from '../../../config';

export function NewBanco(props) {
    const [loading, setLoading] = useState(false);

    const { refetch } = props;

    const handleSubmit = async (values) => {
        setLoading(true);
        await axios
            .post(`${BASE_URL}/data/v1/banco`, values, configAxios)
            .then((response) => {
                swal('Yes', `Registro salvo com sucesso`, 'success');
                refetch();
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
            {loading ? (
                <p>Salvando...</p>
            ) : (
                <Form onSubmit={formik.handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group sm={6} md={6} lg={6}>
                            <Form.Label>Nome do banco</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome_banco"
                                id="nome_banco"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.nome_banco}
                                className={`form-control ${
                                    formik.touched.nome_banco &&
                                    formik.errors.nome_banco
                                        ? 'is-invalid'
                                        : ''
                                }`}
                            />
                        </Form.Group>
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
