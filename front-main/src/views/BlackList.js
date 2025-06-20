import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Card, Spinner, Button, Modal, Form } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import { useQuery, gql } from '@apollo/client';
import autoAnimate from '@formkit/auto-animate';
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from '../cs-line-icons/CsLineIcons';
import CardProcessamento from '../components/card-processamento';

const BlackListPage = () => {
    const title = 'Blacklist';
    const description = 'Lista de CPF cadastrados em blacklist';

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

    const { loading, error, data } = useQuery(GET_DATA);

    if (loading)
        return (
            <>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            </>
        );
    if (error) return `Erro! ${error.message}`;

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
                                    <span>Bloqueados</span>
                                    <CsLineIcons
                                        icon="activity"
                                        stroke="#ff4141"
                                        className="text-primary"
                                    />
                                </div>
                                <div className="text-small text-muted mb-1">
                                    TOTAL
                                </div>
                                <div className="cta-1 text-danger">
                                    {data?.getProcessamentos
                                        ? data.getProcessamentos.length
                                        : 0}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default BlackListPage;
