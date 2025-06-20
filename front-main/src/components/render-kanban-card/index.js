import React, { useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { Badge, Button, ButtonGroup, Card, Col, Row } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import '../../views/styles/leads-board.css';
import { canaisLead, statusEsteiraProposta } from '../../utils';

const RenderKanbanCard = (props) => {
    const {
        dragging,
        id,
        nome,
        canal,
        status,
        historico_count,
        addHistoricoModal,
    } = props;

    return !dragging ? (
        <>
            <HtmlHead>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css"
                />
            </HtmlHead>
            <Card className="mb-2 kanban-card">
                <Card.Body>
                    <Row className="pb-0">
                        <Col>
                            <Badge
                                bg="success"
                                className="me-1 position-absolute e-2 t-n2 z-index-1"
                            >
                                {historico_count}
                            </Badge>
                            <i className="d-inline-block icon-16 bi-person" />{' '}
                            <strong>{nome}</strong>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <i
                                className={`d-inline-block icon-16 ${canaisLead(
                                    canal
                                )}`}
                            />{' '}
                            {canal}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ButtonGroup size="sm">
                                <Button
                                    variant="success"
                                    onClick={() => {
                                        addHistoricoModal(id);
                                    }}
                                >
                                    <i className="d-inline-block bi-clock-history" />
                                </Button>
                                <Button variant="outline-success">
                                    <i className="d-inline-block bi-eraser" />
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    ) : (
        <>
            <Card className="mb-2 react-kanban-card--dragging">
                <Card.Body>
                    <Row>
                        <Col className="text-muted">
                            <strong>
                                <span role="img" aria-label="donut">
                                    🤗
                                </span>
                                {nome}
                            </strong>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-muted">{canal}</Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    );
};

export default RenderKanbanCard;
