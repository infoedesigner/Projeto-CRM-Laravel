import React from 'react';
import { Card, Col, Row, Badge } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import Blink from 'react-blink-text';
import currencyFormatter from "../../../utils";

const ValoresDisponiveis = (props) => {

    const {historicoInssMargem} = props;

    return (
        <div>
            <Row className="g-2">
                <Col sm={12} md={12} lg={4}>
                    <Card>
                        <Card.Body>
                            <Row className="g-0 align-items-center">
                                <Col xs="auto">
                                    <div className="bg-gradient-light sw-6 sh-6 rounded-md d-flex justify-content-center align-items-center">
                                        <CsLineIcons icon="prize" className="text-white" />
                                    </div>
                                </Col>
                                <Col className="sh-6 ps-3 d-flex flex-column justify-content-center">
                                    <div className="heading mb-0 d-flex align-items-center lh-1-25">Margem consignado</div>
                                    <Row className="g-0">
                                        <Col xs="auto">
                                            <div className="cta-2 text-primary">{currencyFormatter(historicoInssMargem.margem_disponivel_emprestimo)}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={12} lg={4}>
                    <Card>
                        <Card.Body>
                            <Row className="g-0 align-items-center">
                                <Col xs="auto">
                                    <div className="bg-gradient-light sw-6 sh-6 rounded-md d-flex justify-content-center align-items-center">
                                        <CsLineIcons icon="credit-card" className="text-white" />
                                    </div>
                                </Col>
                                <Col className="sh-6 ps-3 d-flex flex-column justify-content-center">
                                    <div className="heading mb-0 d-flex align-items-center lh-1-25">Margem cartão</div>
                                    <Row>
                                        <Col>
                                            <div className="cta-2 text-primary">
                                                {Number(historicoInssMargem.margem_margem_disponivel_cartao) > 0 && currencyFormatter(historicoInssMargem.margem_margem_disponivel_cartao)}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={12} lg={4}>
                    <Card>
                        <Card.Body>
                            <Row className="g-0 align-items-center">
                                <Col xs="auto">
                                    <div className="bg-gradient-light sw-6 sh-6 rounded-md d-flex justify-content-center align-items-center">
                                        <CsLineIcons icon="credit-card" className="text-white" />
                                    </div>
                                </Col>
                                <Col className="sh-6 ps-3 d-flex flex-column justify-content-center">
                                    <div className="heading mb-0 d-flex align-items-center lh-1-25">Margem cartão benefício</div>
                                    <Row>
                                        <Col>
                                            <div className="cta-2 text-primary">
                                                {Number(historicoInssMargem.margem_disponivel_cartao_beneficio) > 0 && currencyFormatter(historicoInssMargem.margem_disponivel_cartao_beneficio)}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={12} lg={4}>
                    <Card>
                        <Card.Body>
                            <Row className="g-0 align-items-center">
                                <Col xs="auto">
                                    <div className="bg-success sw-6 sh-6 rounded-md d-flex justify-content-center align-items-center">
                                        <CsLineIcons icon="prize" className="text-white" />
                                    </div>
                                </Col>
                                <Col className="sh-6 ps-3 d-flex flex-column justify-content-center">
                                    <div className="heading mb-0 d-flex align-items-center lh-1-25">Crédito disponível</div>
                                    <Row>
                                        <Col>
                                            <div className="cta-2 text-primary">
                                                {Number(historicoInssMargem.calc_margem_disponivel_emprestimo) > 0 && currencyFormatter(historicoInssMargem.calc_margem_disponivel_emprestimo)}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ValoresDisponiveis;
