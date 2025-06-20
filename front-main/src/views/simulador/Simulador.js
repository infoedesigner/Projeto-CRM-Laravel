import React, { useEffect, useState } from 'react';
import {Row, Col, Card, Spinner, Button, Modal, Tabs, Tab, Form, Alert, FormCheck} from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import axios from 'axios';
import {useFormik} from "formik";
import * as yup from "yup";
import ptBR from "date-fns/locale/pt-BR";
import DatePicker from "react-datepicker";
import BreadcrumbList from '../../components/breadcrumb-list/BreadcrumbList';
import { BASE_URL } from '../../config';
import { configAxios } from '../../constants';

import 'react-sortable-tree/style.css';
import SelectTabelas from "../../components/select-tabelas";

const SimuladorPage = () => {
    const title = 'Simulador';
    const description = 'Simulador e check de regras';

    const breadcrumbs = [{ to: '', text: 'Home' }];

    const [isLoading, setIsLoading] = useState(false);
    const [key, setKey] = useState('simulador');
    const [tabela, setTabela] = useState({value: 0, label: 'Não definido'});
    const [dib, setDib] = useState(new Date());

    const [check, setCheck] = useState('Nenhuma simulação');

    const handleSubmit = async (values) => {

        setIsLoading(true);

        axios.post(`${BASE_URL}/data/v1/check-regra-simulador`,values,configAxios)
            .then((response)=>{
                const bloqueado = response.data.data.block;
                // eslint-disable-next-line no-unused-expressions
                bloqueado === true ? setCheck(`Block: ${response.data.data.block}, mensagem: ${response.data.message}, bloqueado por: ${response.data.data.blockBy}`) : setCheck('Nenhum bloqueio para essa tabela com esses parâmetros.');
            })
            .finally(()=>{
                setIsLoading(false);
        });

    };

    const formik = useFormik({
        initialValues: {
            id_tabela: '',
            idade: '',
            prazo: '',
            valor: '',
            especie: '',
            dib: '',
            uf: '',
            representante_legal: false,
            analfabeto: false,
            ordem_pagamento: false,
        },
        validationSchema: yup.object({
            id_tabela: yup.string().required('O campo é obrigatório.'),
            especie: yup.string().required('O campo é obrigatório.'),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        formik.setFieldValue('id_tabela',tabela.value);
        formik.setFieldValue('dib',dib);
    }, [tabela,dib]);

    return (
        <>
            <HtmlHead title={title} description={description} />
            <div className="page-title-container">
                <Row>
                    {/* Title Start */}
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4">{title}</h1>
                        <h4 className="text-primary">{description}</h4>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                    {/* Title End */}
                </Row>
            </div>
            <Row>
                <Col>
                    {isLoading ? (
                        <Spinner animation="border" role="status">{` `}</Spinner>
                    ) : (
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Body>
                                        <Tabs
                                            id="controlled-tab-example"
                                            activeKey={key}
                                            onSelect={(k) => setKey(k)}
                                            className="mb-3"
                                        >
                                            <Tab eventKey="simulador" title="Simulador">
                                                Em desenvolvimento
                                            </Tab>
                                            <Tab eventKey="validador" title="Validador de regras">
                                                <Form onSubmit={formik.handleSubmit}>
                                                    <Row className="gap-2">
                                                        <Col sm={12} md={12} lg={3}>
                                                            <Form.Group>
                                                                <Form.Label>Tabela</Form.Label>
                                                                <SelectTabelas onChangeValue={(e)=>{
                                                                    setTabela(e);
                                                                }} valor={tabela.value} texto={tabela.label}/>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={12} md={12} lg={2}>
                                                            <Form.Group>
                                                                <Form.Label>Idade</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="idade"
                                                                    id="idade"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    value={formik.values.idade}
                                                                    className={`form-control ${
                                                                        formik.touched.idade &&
                                                                        formik.errors.idade
                                                                            ? 'is-invalid'
                                                                            : ''
                                                                    }`}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={12} md={12} lg={2}>
                                                            <Form.Group>
                                                                <Form.Label>Prazo</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="prazo"
                                                                    id="prazo"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    value={formik.values.prazo}
                                                                    className={`form-control ${
                                                                        formik.touched.prazo &&
                                                                        formik.errors.prazo
                                                                            ? 'is-invalid'
                                                                            : ''
                                                                    }`}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={12} md={12} lg={2}>
                                                            <Form.Group>
                                                                <Form.Label>Valor</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="valor"
                                                                    id="valor"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    value={formik.values.valor}
                                                                    className={`form-control ${
                                                                        formik.touched.valor &&
                                                                        formik.errors.valor
                                                                            ? 'is-invalid'
                                                                            : ''
                                                                    }`}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={12} md={12} lg={2}>
                                                            <Form.Group>
                                                                <Form.Label>Espécie</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="especie"
                                                                    id="especie"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    value={formik.values.especie}
                                                                    className={`form-control ${
                                                                        formik.touched.especie &&
                                                                        formik.errors.especie
                                                                            ? 'is-invalid'
                                                                            : ''
                                                                    }`}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={12} md={12} lg={2}>
                                                            <Form.Group>
                                                                <Form.Label>UF</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="uf"
                                                                    id="uf"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    value={formik.values.uf}
                                                                    className={`form-control ${
                                                                        formik.touched.uf &&
                                                                        formik.errors.uf
                                                                            ? 'is-invalid'
                                                                            : ''
                                                                    }`}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={12} md={12} lg={2}>
                                                            <Form.Group>
                                                                <Form.Label>Data DIB</Form.Label>
                                                                <DatePicker
                                                                    className="form-control"
                                                                    selected={dib}
                                                                    onChange={(date) => setDib(date)}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    locale={ptBR}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group>
                                                                <Form.Label>Representante legal</Form.Label>
                                                                <FormCheck
                                                                    type="checkbox"
                                                                    label="Sim"
                                                                    name="representante_legal"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    checked={formik.values.representante_legal}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group>
                                                                <Form.Label>Analfabeto</Form.Label>
                                                                <FormCheck
                                                                    type="checkbox"
                                                                    label="Sim"
                                                                    name="analfabeto"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    checked={formik.values.analfabeto}
                                                                    value={1}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group>
                                                                <Form.Label>Ordem pagamento</Form.Label>
                                                                <FormCheck
                                                                    type="checkbox"
                                                                    label="Sim"
                                                                    name="ordem_pagamento"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    checked={formik.values.ordem_pagamento}
                                                                    value={1}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                    <Row className="gap-2 mt-3">
                                                        <Col>
                                                            <Alert>{check}</Alert>
                                                        </Col>
                                                    </Row>
                                                    <Row className="gap-2 mt-3">
                                                        <Col>
                                                            <Button onClick={()=>{
                                                                formik.submitForm();
                                                            }}>Validar regra</Button>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </Tab>
                                        </Tabs>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default SimuladorPage;
