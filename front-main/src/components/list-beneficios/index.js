import React, { useState } from 'react';
import { Badge, Card, Col, Row } from 'react-bootstrap';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { dateEnBr, dateTimeEnBr } from '../../utils';
import ListSubBeneficiosGrid from './list-sub-grid';
import ListSubBeneficiosGridProviderTwo from './list-sub-provider-2-grid';

const ListBeneficios = (props) => {
    const { item, tabelas } = props;

    return (
        <>
            <Card className="mb-5">
                <Card.Header className="pt-3 pb-3">
                    <Row>
                        <Col sm={12} md={12} lg={12}>
                            <Badge
                                bg="success"
                                className="me-1 position-absolute e-2 t-n2 z-index-1"
                            >
                                {item.api_name}
                                {''}
                                {item.tabela_propria === '1'
                                    ? ' #Tabela própria'
                                    : ' #Coeficiente'}
                            </Badge>
                            <Row>
                                <Col>
                                    <strong>
                                        <span role="img" aria-label="donut">
                                            🤞🏼
                                        </span>
                                        {item.nome}
                                    </strong>
                                </Col>
                                <Col>
                                    <strong>CPF:</strong> {item.cpf}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col sm={10} md={10} lg={10} xl={10} xs={10} xxl={10}>
                            <Row className="mb-1">
                                <Col sm={6} md={4} lg={4}>
                                    <CsLineIcons
                                        icon="birthday"
                                        className="mb-1 d-inline-block "
                                    />
                                    <strong>Aniversário</strong>
                                </Col>
                                <Col>
                                    <span>
                                        {dateEnBr(item.data_nascimento)}
                                    </span>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col sm={6} md={4} lg={4}>
                                    <CsLineIcons
                                        icon="bookmark"
                                        className="d-inline-block "
                                    />
                                    <strong>Descrição</strong>
                                </Col>
                                <Col>
                                    <span>
                                        {item.descricao_especie}[{item.especie}]
                                    </span>
                                </Col>
                            </Row>

                            <Row className="gx-2">
                                {item.provider === '5' && (
                                    <ListSubBeneficiosGrid
                                        id={item.id}
                                        tabelas={tabelas}
                                    />
                                )}
                                {item.provider === '2' && (
                                    <ListSubBeneficiosGridProviderTwo
                                        id={item.id}
                                        item={item}
                                    />
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer className="pt-3 pb-3">
                    <Row className="p-0">
                        <Col>
                            <CsLineIcons
                                icon="calendar"
                                className="mb-1 d-inline-block"
                            />
                            <span>
                                <strong>Última atualização</strong>{' '}
                                {dateTimeEnBr(item.updated_at)}
                            </span>
                        </Col>
                        <Col>
                            <CsLineIcons
                                icon="user"
                                className="mb-1 d-inline-block"
                            />
                            <span>
                                <strong>Colaborador</strong> {item.colaborador}
                            </span>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </>
    );
};

export default ListBeneficios;
