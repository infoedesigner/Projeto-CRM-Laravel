import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Card, Spinner, Button, Modal, Form } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import { useQuery, gql } from '@apollo/client';
import autoAnimate from '@formkit/auto-animate';
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from '../cs-line-icons/CsLineIcons';
import CardProcessamento from '../components/card-processamento';

const ToDoProcessamentoPage = () => {
    const title = 'Processamento de consultas';
    const description = 'Lista de consultas pendentes de processamento';

    const breadcrumbs = [{ to: '', text: 'Home' }];
    const parent = useRef(null);

    useEffect(() => {
        // eslint-disable-next-line no-unused-expressions
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const GET_DATA = gql`
        query {
            allProcessamentos {
                paginatorInfo {
                    count
                }
                data {
                    user_id
                    cpf
                }
            }
        }
    `;

    const GET_LEADS = gql`
        query {
            getLeads(where: { column: NOME, operator: LIKE, value: "%%" }) {
                nome
                email
                cpf
            }
        }
    `;

    const GET_TOTALS_FINISH = gql`
        query {
            getProcessamentos(
                where: { column: STATUS, operator: EQ, value: 2 }
            ) {
                id
                cpf
                code_response
                json_response
                uuid
                created_at
            }
        }
    `;

    const GET_TOTALS_WAITING = gql`
        query {
            getProcessamentos(
                where: { column: STATUS, operator: EQ, value: 1 }
            ) {
                id
                cpf
                code_response
                json_response
                uuid
                provider
                created_at
            }
        }
    `;

    const { loading, error, data } = useQuery(GET_DATA);
    const {
        loading: loadingL,
        error: errorL,
        data: dataL,
    } = useQuery(GET_LEADS);
    const {
        loading: totalFinish,
        error: errorTotalFinish,
        data: dataTotalFinish,
    } = useQuery(GET_TOTALS_FINISH);
    const {
        loading: totalWaiting,
        error: errorTotalWaiting,
        data: dataTotalWaiting,
    } = useQuery(GET_TOTALS_WAITING);

    console.log(totalWaiting);

    if (loading || loadingL)
        return (
            <>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            </>
        );
    if (error || errorL) return `Erro! ${error.message}`;

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
                <Row className="g-2 mb-5">
                    <Col lg="6" xxl="3">
                        <Card>
                            <Card.Body>
                                <div className="heading d-flex justify-content-between lh-1-25 mb-3">
                                    <span>Aguardando</span>
                                    <CsLineIcons
                                        icon="box"
                                        className="text-primary"
                                    />
                                </div>
                                <div className="text-small text-muted mb-1">
                                    TOTAL
                                </div>
                                <div className="cta-1 text-primary">
                                    {dataTotalWaiting?.getProcessamentos
                                        ? dataTotalWaiting.getProcessamentos
                                              .length
                                        : 0}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="6" xxl="3">
                        <Card>
                            <Card.Body>
                                <div className="heading d-flex justify-content-between lh-1-25 mb-3">
                                    <span>Processados</span>
                                    <CsLineIcons
                                        icon="trend-up"
                                        className="text-primary"
                                    />
                                </div>
                                <div className="text-small text-muted mb-1">
                                    TOTAL
                                </div>
                                <div className="cta-1 text-primary">
                                    {dataTotalFinish?.getProcessamentos
                                        ? dataTotalFinish.getProcessamentos
                                              .length
                                        : 0}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={12} lg={12} xl={6} xxl={6}>
                        <h4>Fila de consultas para processamento</h4>
                        <Card>
                            <Card.Body className="mb-n3 border-last-none">
                                {/* maps com itens regras */}
                                {dataTotalWaiting?.getProcessamentos.length >
                                0 ? (
                                    dataTotalWaiting.getProcessamentos.map(
                                        (i, key) => {
                                            return (
                                                <Col key={key} ref={parent}>
                                                    <CardProcessamento
                                                        item={i}
                                                    />
                                                </Col>
                                            );
                                        }
                                    )
                                ) : (
                                    <Card.Body>
                                        <Col>Nenhum item para processar.</Col>
                                    </Card.Body>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={12} md={12} lg={12} xl={6} xxl={6}>
                        <h4>Fila de leads para verificação</h4>
                        <Card>
                            <Card.Body className="mb-n3 border-last-none">
                                {/* maps com itens regras */}
                                {dataL.length > 0 ? (
                                    dataL.getLeads.map((i, key) => {
                                        return (
                                            <Col key={key}>
                                                <CardProcessamento
                                                    item={i}
                                                    tipo="1"
                                                />
                                            </Col>
                                        );
                                    })
                                ) : (
                                    <Card.Body>
                                        <Col>Nenhum lead para verificar.</Col>
                                    </Card.Body>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ToDoProcessamentoPage;
