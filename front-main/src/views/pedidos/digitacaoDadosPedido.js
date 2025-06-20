import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Col,
    Form,
    Modal,
    Nav,
    Row,
    Tab,
} from 'react-bootstrap';
import axios from "axios";
import swal from "@sweetalert/with-react";
import Swal from 'sweetalert2';
import {useFormik} from "formik";
import * as Yup from 'yup';
import {BASE_URL} from "../../config";
import {configAxios} from "../../constants";

const ModalDigitacaoPedido = (props) => {
    const { modalDigitacao, setModalDigitacao, idAprove, update } = props;
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object({
        n_proposta: Yup.string().required('Campo obrigatório'),
        n_contrato: Yup.string().required('Campo obrigatório'),
        valor_liberado: Yup.string().required('Campo obrigatório'),
    });

    const formik = useFormik({
        initialValues: {
            n_proposta: '',
            n_contrato: '',
            valor_liberado: 0.00,
        },
        validationSchema,
        onSubmit: async(values) => {
            setIsLoading(true);
            await axios
                .post(
                    `${BASE_URL}/data/v1/saveDadosDigitacao`,
                    {
                        id: idAprove,
                        n_proposta: values.n_proposta,
                        n_contrato: values.n_contrato,
                        valor_liberado: values.valor_liberado,
                    },
                    configAxios
                )
                .then((res) => {
                    Swal.fire({
                        title: 'Sucesso',
                        width: 600,
                        padding: '3em',
                        icon: 'success',
                        color: '#1d4408',
                        timerProgressBar: true,
                        timer: 2000,
                        backdrop: `
                        rgba(255,209,85,0.5)
                        url("../../../img/coins.gif")
                        center top
                        no-repeat
                    `
                    });
                    setIsLoading(false);
                    setTimeout(() => {
                        setModalDigitacao(false);
                        update();
                    },2000);
                })
                .catch((error) => {
                    setIsLoading(false);
                    swal('ERRO', `${error}`, 'error');
                });
        },
    });

    return (
        <Modal
            show={modalDigitacao}
            onHide={() => setModalDigitacao(false)}
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>Por favor, informe os dados de retorno do banco</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={12} md={12} lg={12} xl={12}>
                        <form onSubmit={formik.handleSubmit}>
                            <Row className="g-3">
                                <Col sm={12} md={12} lg={6} xl={6}>
                                    <div className="top-label">
                                        <Form.Control
                                            type="text"
                                            id="n_proposta"
                                            name="n_proposta"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.n_proposta}
                                        />
                                        <Form.Label>NÚMERO PROPOSTA</Form.Label>
                                        {formik.touched.n_proposta && formik.errors.n_proposta && <div>{formik.errors.n_proposta}</div>}
                                    </div>
                                </Col>
                                <Col sm={12} md={12} lg={6} xl={6}>
                                    <div className="top-label">
                                        <Form.Control
                                            type="text"
                                            id="n_contrato"
                                            name="n_contrato"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.n_contrato}
                                        />
                                        <Form.Label>NÚMERO CONTRATO</Form.Label>
                                        {formik.touched.n_contrato && formik.errors.n_contrato && <div>{formik.errors.n_contrato}</div>}
                                    </div>
                                </Col>
                                <Col sm={12} md={12} lg={12} xl={12}>
                                    <div className="top-label">
                                        <Form.Control
                                            type="text"
                                            id="valor_liberado"
                                            name="valor_liberado"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.valor_liberado}
                                        />
                                        <Form.Label>VALOR LIBERADO</Form.Label>
                                        {formik.touched.valor_liberado && formik.errors.valor_liberado && <div>{formik.errors.valor_liberado}</div>}
                                    </div>
                                </Col>
                                <Col sm={12} md={12} lg={12} xl={12}>
                                    <Button variant="primary" type="submit">
                                        { isLoading ? 'Aguarde' : 'Salvar dados da digitação'}
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => setModalDigitacao(false)}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDigitacaoPedido;
