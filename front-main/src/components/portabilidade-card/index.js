import {Badge, Button, ButtonGroup, Card, Col, Row} from 'react-bootstrap';
import React, {useEffect, useState} from "react";
import currencyFormatter from "../../utils";

const PortabilidadeCard = (props) => {

    const {item} = props;

    return (
        <Col sm={12} md={12} lg={12} xl={12} className="mb-2">
            <Card>
                <Card.Body>
                    <Row>
                        <Col sm={12} md={12} lg={12}>
                            <strong>{item.nome_tabela}</strong>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6} md={6} lg={6}>
                            Prazo: {item.prazo_inicio} á {item.prazo_fim}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6} md={6} lg={6}>
                            Idade: {item.idade_min} á {item.idade_max}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6} md={6} lg={6}>
                            Coeficiente: {item.coeficiente}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6} md={6} lg={6}>
                            Seguro: {item.seguro}
                        </Col>
                        <Col sm={6} md={6} lg={6}>
                            Taxa mínima de juros: {item.taxa_juros_minima}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default PortabilidadeCard;
