import { FormEvent, Fragment, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import * as yup from 'yup';
import { useFormik } from 'formik';

export function NewProdutoForm(props) {
    const [loading, setLoading] = useState(false);

    // eslint-disable-next-line react/destructuring-assignment
    const { setAddModal } = props.setAddModal;

    const handleSubmit = async () => {};

    const formik = useFormik({
        initialValues: {
            produto: '',
            descricao: '',
        },
        validationSchema: yup.object({
            produto: yup.string().required('O campo é obrigatório.'),
            descricao: yup.string().required('O campo é obrigatório.'),
        }),
        onSubmit: (values) => {
            handleSubmit();
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
                            <Form.Label>Nome do produto</Form.Label>
                            <Form.Control
                                type="text"
                                name="produto"
                                id="produto"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.produto}
                                className={`form-control ${
                                    formik.touched.produto &&
                                    formik.errors.produto
                                        ? 'is-invalid'
                                        : ''
                                }`}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group sm={6} md={6} lg={6}>
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                type="text"
                                name="descricao"
                                id="descricao"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.descricao}
                                className={`form-control ${
                                    formik.touched.descricao &&
                                    formik.errors.descricao
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
