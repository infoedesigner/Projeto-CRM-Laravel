import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Modal, Button, Form, Alert } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import useCustomLayout from 'hooks/useCustomLayout';
import { MENU_PLACEMENT, LAYOUT, configAxios } from 'constants.js';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import MapaClientes from "../../components/maps/Clientes";

export const data = {
    labels: [
        'CARTAO-DE-CREDITO',
        'NEGATIVADO',
        'EMPRESTIMO-PARA-REPRESENTANTE-LEGAL-INSS',
        'EMPRESTIMO-BPC-E-LOAS',
        'PORTABILIDADE-DE-DIVIDAS',
        'CREDITO-SAUDE-INSS',
        'INSS'
    ],
    datasets: [
        {
            label: '# de leads',
            data: [
                248,
                568,
                667,
                765,
                858,
                912,
                17474
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(39,189,0,0.2)',
            ],
            borderWidth: 1,
        },
    ],
};

const BIA1 = () => {
    const title = 'BI-A1';
    const description = 'Visão sintética de leads.';

    ChartJS.register(ArcElement, Tooltip, Legend);

    useCustomLayout({
        placement: MENU_PLACEMENT.Horizontal,
        layout: LAYOUT.Fluid,
    });

    const [panelData, setPanelData] = useState({});

    useEffect(()=>{
        setPanelData({
            totalLeads: 21987,
            qualificados: 14796,
            naoQualificados: 7191,
            esteira: 0,
            digitacao: 0,
            contratos: 0
        });
    },[]);

    return (
        <>
            <HtmlHead title={title} description={description} />
            <Row>
                <Col sm={12} md={12} lg={2} xl={2}>
                    <Card>
                        <Card.Body>
                            <div className="heading d-flex justify-content-between lh-1-25 mb-3">
                                <span>Total de leads</span>
                                <CsLineIcons icon="box" className="text-primary" />
                            </div>
                            <div className="text-small text-muted mb-1">GERAL</div>
                            <div className="cta-1 text-primary">{panelData.totalLeads}</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={12} lg={2} xl={2}>
                    <Card>
                        <Card.Body>
                            <div className="heading d-flex justify-content-between lh-1-25 mb-3">
                                <span>Qualificados</span>
                                <CsLineIcons icon="box" className="text-primary" />
                            </div>
                            <div className="text-small text-muted mb-1">GERAL</div>
                            <div className="cta-1 text-primary">{panelData.qualificados}</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={12} lg={2} xl={2}>
                    <Card>
                        <Card.Body>
                            <div className="heading d-flex justify-content-between lh-1-25 mb-3">
                                <span>Não qualificados</span>
                                <CsLineIcons icon="box" className="text-primary" />
                            </div>
                            <div className="text-small text-muted mb-1">GERAL</div>
                            <div className="cta-1 text-primary">{panelData.naoQualificados}</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={12} lg={2} xl={2}>
                    <Card>
                        <Card.Body>
                            <div className="heading d-flex justify-content-between lh-1-25 mb-3">
                                <span>Esteira</span>
                                <CsLineIcons icon="box" className="text-primary" />
                            </div>
                            <div className="text-small text-muted mb-1">GERAL</div>
                            <div className="cta-1 text-primary">{panelData.esteira}</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={12} lg={2} xl={2}>
                    <Card>
                        <Card.Body>
                            <div className="heading d-flex justify-content-between lh-1-25 mb-3">
                                <span>Digitação</span>
                                <CsLineIcons icon="box" className="text-primary" />
                            </div>
                            <div className="text-small text-muted mb-1">GERAL</div>
                            <div className="cta-1 text-primary">{panelData.digitacao}</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={12} lg={2} xl={2}>
                    <Card>
                        <Card.Body>
                            <div className="heading d-flex justify-content-between lh-1-25 mb-3">
                                <span>Contratos</span>
                                <CsLineIcons icon="box" className="text-primary" />
                            </div>
                            <div className="text-small text-muted mb-1">GERAL</div>
                            <div className="cta-1 text-primary">{panelData.contratos}</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={12} md={12} lg={6} xl={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Mapa de clientes</Card.Title>
                            <MapaClientes />
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={12} lg={6} xl={6}>
                    <Card>
                        <Card.Body>
                            <div className="heading d-flex justify-content-between lh-1-25 mb-3">
                                <span>Leads por produto - top 7 produtos</span>
                                <CsLineIcons icon="chart-4" className="text-primary" />
                            </div>
                            <div className="h-50">
                                <Doughnut data={data}/>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default BIA1;
