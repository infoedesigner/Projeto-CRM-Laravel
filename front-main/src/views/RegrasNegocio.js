import React, { useEffect } from 'react';
import { Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import { useQuery, gql } from '@apollo/client';
import ListLeads from '../components/list-leads';
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';
import ListProdutos from '../components/list-produtos';
import ListRegrasNegocio from '../components/list-regras-negocio';
import NenhumRegistro from './NenhumRegistro';
import CsLineIcons from '../cs-line-icons/CsLineIcons';

const RegrasNegocioPage = () => {
    const title = 'Regras de negócio';
    const description = 'Lista de regras de negócios para simuladores';

    const breadcrumbs = [{ to: '', text: 'Home' }];

    const GET_DATA = gql`
        query {
            getRegras(where: { column: REGRA, operator: LIKE, value: "%%" }) {
                id
                tipo
                regra
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

    const totalRegistros = data.getRegras.length;

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

                    {/* Top Buttons Start */}
                    <Col
                        md="5"
                        className="d-flex align-items-start justify-content-end"
                    >
                        <Button
                            variant="outline-primary"
                            className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1"
                        >
                            <CsLineIcons icon="edit-square" /> <span>Novo</span>
                        </Button>
                    </Col>
                    {/* Top Buttons End */}
                </Row>
            </div>
            <Card className="mb-5" body>
                {description}
            </Card>
            <Row>
                {totalRegistros > 0 ? (
                    data.getRegras.map(
                        ({ id, regra, range_inicial, range_final, tipo }) => (
                            <Col key={id} sm={12} md={6} lg={4} xxl={4}>
                                <ListRegrasNegocio
                                    id={id}
                                    regra={regra}
                                    range_inicial={range_inicial}
                                    range_final={range_final}
                                    tipo={tipo}
                                />
                            </Col>
                        )
                    )
                ) : (
                    <Col>
                        <NenhumRegistro />
                    </Col>
                )}
            </Row>
        </>
    );
};

export default RegrasNegocioPage;
