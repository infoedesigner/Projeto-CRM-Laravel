import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Modal, Button, Form, Alert } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import useCustomLayout from 'hooks/useCustomLayout';
import { MENU_PLACEMENT, LAYOUT, configAxios } from 'constants.js';
import { Link, NavLink } from 'react-router-dom';
import Rating from 'react-rating';
import FunilDefault from '../../components/funil-vendas/Default';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import ChartBubble from './ChartBubbles';
import { NewEsteiraForm } from '../create/esteira';
import ConsultaLinhasCredito from './modais/ConsultaLinhasCredito';
import {LandingPage} from "../create/landingpage";

const DashboardVendas = () => {
    const title = 'Dashboard';
    const description = 'Visão sintética de leads.';

    const [modalCpf, setModalCpf] = useState(false);
    const [modalLp, setModalLp] = useState(false);
    const [modalEsteiraManual, setModalEsteiraManual] = useState(false);
    const [modalClienteForm, setModalClienteForm] = useState(false);

    useCustomLayout({
        placement: MENU_PLACEMENT.Horizontal,
        layout: LAYOUT.Fluid,
    });

    return (
        <>
            <HtmlHead title={title} description={description} />
            <ConsultaLinhasCredito
                modalCpf={modalCpf}
                setModalCpf={setModalCpf}
            />
            <Modal
                size="xl"
                centered
                backdrop="static"
                show={modalEsteiraManual}
                onHide={() => setModalEsteiraManual(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cadastro manual de empréstimo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewEsteiraForm setAddModal={setModalEsteiraManual} />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setModalEsteiraManual(false)}
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                centered
                backdrop="static"
                show={modalLp}
                onHide={() => setModalLp(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Lançamento Lead Landing Page</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LandingPage />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setModalLp(false)}
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                className="modal-right large"
                show={modalClienteForm}
                onHide={() => setModalClienteForm(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cadastro simples de cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewEsteiraForm setAddModal={setModalClienteForm} />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setModalClienteForm(false)}
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Title Start */}
            <section className="scroll-section" id="title">
                <div className="page-title-container">
                    <Row>
                        <Col>
                            <h1 className="mb-0 pb-0 display-4">{title}</h1>
                            <h3 className="text-primary">{description}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6} md={6} lg={2}>
                            <Button
                                onClick={() => {
                                    setModalCpf(true);
                                }}
                            >
                                <CsLineIcons icon="diagram-2" />{' '}
                                <span>Nova consulta</span>
                            </Button>
                        </Col>
                        <Col sm={6} md={6} lg={2}>
                            <Button
                                variant="outline-quaternary"
                                onClick={() => {
                                    setModalEsteiraManual(true);
                                }}
                                className="pl-4"
                            >
                                <CsLineIcons icon="cook-hat" />{' '}
                                <span>Lançamento manual</span>
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="outline-quaternary"
                                onClick={() => {
                                    setModalLp(true);
                                }}
                                className="pl-4"
                            >
                                <CsLineIcons icon="cook-hat" />{' '}
                                <span>Lançamento Lead Landing page</span>
                            </Button>
                        </Col>
                    </Row>
                </div>
            </section>
            {/* Title End */}
            <Row className="g-2 mb-2">
                <Col sm={12} md={12} lg={12} xl={6} xxl={6}>
                    <Row className="g-2 mb-5">
                        <Col sm={12} md={12} lg={12} xl={6} xxl={6}>
                            <Card className="hover-border-primary">
                                <Card.Body>
                                    <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                                        <span>Produtos</span>
                                        <CsLineIcons
                                            icon="suitcase"
                                            className="text-primary"
                                        />
                                    </div>
                                    <div className="text-small text-muted mb-1">
                                        ATIVOS
                                    </div>
                                    <div className="cta-1 text-primary">2</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={12} md={12} lg={12} xl={6} xxl={6}>
                            <Card className="hover-border-primary">
                                <Card.Body>
                                    <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                                        <span>Regras de negócio</span>
                                        <CsLineIcons
                                            icon="check-square"
                                            className="text-primary"
                                        />
                                    </div>
                                    <div className="text-small text-muted mb-1">
                                        ATIVOS
                                    </div>
                                    <div className="cta-1 text-primary">0</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={12} md={12} lg={12} xl={6} xxl={6}>
                            <Card className="hover-border-primary">
                                <Card.Body>
                                    <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                                        <span>
                                            Simulações (não finalizadas)
                                        </span>
                                        <CsLineIcons
                                            icon="file-empty"
                                            className="text-primary"
                                        />
                                    </div>
                                    <div className="text-small text-muted mb-1">
                                        REALIZADAS
                                    </div>
                                    <div className="cta-1 text-primary">0</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={12} md={12} lg={12} xl={6} xxl={6}>
                            <Card className="hover-border-primary">
                                <Card.Body>
                                    <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                                        <span>Simulações (finalizadas)</span>
                                        <CsLineIcons
                                            icon="screen"
                                            className="text-primary"
                                        />
                                    </div>
                                    <div className="text-small text-muted mb-1">
                                        REALIZADAS
                                    </div>
                                    <div className="cta-1 text-primary">0</div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col sm={12} md={12} lg={12} xl={6} xxl={6}>
                    <Card className="sh-50 h-xl-100-card">
                        <Card.Body className="h-100">
                            <ChartBubble />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col sm={12} md={12} lg={12} xl={12} xxl={4} className="mb-5">
                    <Card className="sh-50 sh-md-40">
                        <FunilDefault />
                    </Card>
                </Col>
                <Col sm={12} md={12} lg={12} xl={12} xxl={4} className="mb-5">
                    <Row className="g-2">
                        <Col xs="6" xl="6" className="sh-19">
                            <Card className="h-100 hover-scale-up">
                                <Card.Body className="text-center">
                                    <NavLink to="#">
                                        <CsLineIcons
                                            icon="user"
                                            className="text-primary"
                                        />
                                        <p className="heading mt-3 text-body">
                                            Clientes
                                        </p>
                                        <div className="text-large fw-medium">
                                            0
                                        </div>
                                    </NavLink>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs="6" xl="6" className="sh-19">
                            <Card className="h-100 hover-scale-up">
                                <Card.Body className="text-center">
                                    <NavLink to="#">
                                        <CsLineIcons
                                            icon="acorn"
                                            className="text-primary"
                                        />
                                        <p className="heading mt-3 text-body">
                                            Leads
                                        </p>
                                        <div className="text-large fw-medium">
                                            0
                                        </div>
                                    </NavLink>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs="6" xl="6" className="sh-19">
                            <Card className="h-100 hover-scale-up">
                                <Card.Body className="text-center">
                                    <NavLink to="#">
                                        <CsLineIcons
                                            icon="antenna"
                                            className="text-primary"
                                        />
                                        <p className="heading mt-3 text-body">
                                            Em negociação
                                        </p>
                                        <div className="text-medium fw-medium">
                                            0
                                        </div>
                                    </NavLink>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs="6" xl="6" className="sh-19">
                            <Card className="h-100 hover-scale-up">
                                <Card.Body className="text-center">
                                    <NavLink to="#">
                                        <CsLineIcons
                                            icon="check-circle"
                                            className="text-primary"
                                        />
                                        <p className="heading mt-3 text-body">
                                            Contratato
                                        </p>
                                        <div className="text-medium fw-medium">
                                            0
                                        </div>
                                    </NavLink>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col sm={12} md={12} lg={12} xl={12} xxl={4} className="mb-5">
                    <Card className="sh-50 sh-md-40 h-xl-100-card hover-img-scale-up">
                        <img
                            src="/img/banner/cta-standard-3.webp"
                            className="card-img h-100 scale position-absolute"
                            alt="card image"
                        />
                        <div className="card-img-overlay d-flex flex-column justify-content-between bg-transparent">
                            <div>
                                <div className="cta-1 mb-3 text-black w-75 w-sm-50">
                                    Carrera Carneiro
                                </div>
                                <div className="w-50 text-black mb-3">
                                    Consulta de crédito consignado das
                                    modalidades FGTS e INSS
                                </div>
                                <Rating
                                    className="mb-2"
                                    initialRating={5}
                                    readonly
                                    emptySymbol={
                                        <i className="cs-star text-primary" />
                                    }
                                    fullSymbol={
                                        <i className="cs-star-full text-primary" />
                                    }
                                />
                            </div>
                            <div>
                                <NavLink
                                    to="#"
                                    className="btn btn-icon btn-icon-start btn-outline-primary mt-3 stretched-link"
                                    onClick={() => {
                                        setModalCpf(true);
                                    }}
                                >
                                    <CsLineIcons icon="chevron-right" />{' '}
                                    <span>Nova consulta</span>
                                </NavLink>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default DashboardVendas;
