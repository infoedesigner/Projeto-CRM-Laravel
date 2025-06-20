import { FormEvent, Fragment, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from "axios";
import swal from "@sweetalert/with-react";
import {BASE_URL} from "../../../config";
import {configAxios} from "../../../constants";

export function NewUserForm(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);

    // eslint-disable-next-line react/destructuring-assignment
    const { setAddModal } = props.setAddModal;

    const handleSubmit = async () => {
        axios
            .post(`${BASE_URL}/data/user`, {
                name,
                email,
                password
            }, configAxios)
            .then((res) => {
                if (res.status === 200) {
                    setLoading(false);
                    swal('Sucesso', `Usuário cadastrado com sucesso.`, 'success');
                }
            })
            .catch((error) => {
                swal('ERRO', `${error}`, 'error');
            });
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: yup.object({
            name: yup.string().required('O campo é obrigatório.'),
            email: yup.string().email('E-mail inválido.').required('O campo é obrigatório.'),
            password: yup.string().required('O campo é obrigatório.'),
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
                            <Form.Label>Nome completo</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                id="name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                                className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                            />
                        </Form.Group>
                        <Form.Group sm={6} md={6} lg={6}>
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                id="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                            />
                        </Form.Group>
                        <Form.Group sm={6} md={6} lg={6}>
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                id="password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                            />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Col>
                            <button type="submit" className="btn btn-outline-primary">
                                Salvar
                            </button>
                        </Col>
                    </Row>
                </Form>
            )}
        </>
    );
}
