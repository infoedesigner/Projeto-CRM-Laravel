import React, { useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';

const CardsEstatistica = () => {
    return (
        <>
            {/* Stats Start */}
            <h2 className="small-title">Resumo</h2>
            <Row className="g-2 mb-5">
                <Col sm="6" lg="3">
                    <Card className="hover-border-primary">
                        <Card.Body>
                            <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                                <span>Quantidade global (Todas as mídias)</span>
                                <CsLineIcons
                                    icon="suitcase"
                                    className="text-primary"
                                />
                            </div>
                            <div className="text-small text-muted mb-1">
                                DISPARADAS
                            </div>
                            <div className="cta-1 text-primary">14</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm="6" lg="3">
                    <Card className="hover-border-primary">
                        <Card.Body>
                            <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                                <span>Quantidade global</span>
                                <CsLineIcons
                                    icon="check-square"
                                    className="text-primary"
                                />
                            </div>
                            <div className="text-small text-muted mb-1">
                                EM FILA DE ENVIO
                            </div>
                            <div className="cta-1 text-primary">153</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm="6" lg="3">
                    <Card className="hover-border-primary">
                        <Card.Body>
                            <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                                <span>Quantidade global</span>
                                <CsLineIcons
                                    icon="file-empty"
                                    className="text-primary"
                                />
                            </div>
                            <div className="text-small text-muted mb-1">
                                LIDAS/RECEBIDAS
                            </div>
                            <div className="cta-1 text-primary">24</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm="6" lg="3">
                    <Card className="hover-border-primary">
                        <Card.Body>
                            <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                                <span>Conversão de clique</span>
                                <CsLineIcons
                                    icon="screen"
                                    className="text-primary"
                                />
                            </div>
                            <div className="text-small text-muted mb-1">
                                WHATSAPP E E-MAIL
                            </div>
                            <div className="cta-1 text-primary">524</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Stats End */}
        </>
    );
};

export default CardsEstatistica;
