import React, { useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import CardsEstatistica from './campanha/CardsEstatistica';
import CsLineIcons from '../cs-line-icons/CsLineIcons';
import RadarTiposCampanhas from './campanha/RadarTiposCampanhas';
import ChartBubble from './dashboard/ChartBubbles';

const CampanhasGerenciarPage = () => {
    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <h3>Campanhas</h3>
                            <Row className="g-5">
                                <Col xl="4" xxl="3">
                                    <RadarTiposCampanhas />
                                </Col>
                                <Col xl="8" xxl="9">
                                    <CardsEstatistica />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col className="mt-3">
                    <Card>
                        <Card.Body style={{ minHeight: '400px' }}>
                            <ChartBubble />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default CampanhasGerenciarPage;
