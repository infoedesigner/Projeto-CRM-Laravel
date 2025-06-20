import { FormEvent, Fragment, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import * as yup from 'yup';
import { useFormik, useFormikContext } from 'formik';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import SelectAPIs from '../../../components/select-apis';
import { BASE_URL } from '../../../config';
import { configAxios } from '../../../constants';

export function NewPromotor(props) {
    const [loading, setLoading] = useState(false);

    // eslint-disable-next-line react/destructuring-assignment
    const { GET_DATA } = props;

    const handleSubmit = async (values) => {
        setLoading(true);
        await axios
            .post(`${BASE_URL}/data/v1/promotor`, values, configAxios)
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
            provider: '',
            codigo: '',
            nome: '',
            identificador: '',
            nome_parceiro: '',
            padrao: '',
        },
        validationSchema: yup.object({
            nome: yup.string().required('O campo é obrigatório.'),
            provider: yup.string().required('O campo é obrigatório.'),
            codigo: yup.string().required('O campo é obrigatório.'),
            identificador: yup.string().required('O campo é obrigatório.'),
            nome_parceiro: yup.string().required('O campo é obrigatório.'),
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
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group>
                                <Form.Label>Provider</Form.Label>
                                <SelectAPIs
                                    onChangeValue={(e) => {
                                        formik.setFieldValue('provider', e.id);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            <Form.Group>
                                <Form.Label>Código</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="codigo"
                                    id="codigo"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.codigo}
                                    className={`form-control ${
                                        formik.touched.codigo &&
                                        formik.errors.codigo
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
                                <Form.Label>Nome</Form.Label>
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
                                <Form.Label>Identificador</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="identificador"
                                    id="identificador"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.identificador}
                                    className={`form-control ${
                                        formik.touched.identificador &&
                                        formik.errors.identificador
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={12} md={12} lg={12}>
                            <Form.Group>
                                <Form.Label>Nome parceiro</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nome_parceiro"
                                    id="nome_parceiro"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.nome_parceiro}
                                    className={`form-control ${
                                        formik.touched.nome_parceiro &&
                                        formik.errors.nome_parceiro
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
                </Form>
            )}
        </>
    );
}
