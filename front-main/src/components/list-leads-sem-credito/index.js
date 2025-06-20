import React, {useEffect, useState} from 'react';
import {Badge, Button, ButtonGroup, Card, Col, Modal, Row} from 'react-bootstrap';
import {CardContent} from "@mui/material";
import axios from "axios";
import {NewLeadForm} from "../../views/create/lead";
import {configAxios} from "../../constants";
import {BASE_URL} from "../../config";
import {dateTimeEnBr, Money} from "../../utils";

const ListLeadsSemCredito = (props) => {

    const {item, handleHistoricoLead, setModalXMLOpen,setCpf} = props;

    return (
        <Col sm={12} md={12} lg={6} xl={6}>
            <Card className="mb-2">
                <Badge
                    pill
                    bg="info"
                    className="me-1 position-absolute e-n2 t-2 z-index-1"
                >
                    CODE: {item.code}
                </Badge>
                <Card.Header>
                    <Row>
                        <Col sm={12} md={12} lg={9} xl={9}>
                            <span className="heading mb-1 lh-1-25">{item.nome} simulado em <i className="d-inline-block bi-clock"/> {dateTimeEnBr(item.enviado_em)}</span>
                        </Col>
                        <Col>
                            <Button variant="outline-success" title="Histórico de contato"
                                    onClick={() => {
                                        handleHistoricoLead(true);
                                    }}>
                                <i className="d-inline-block bi-clock"/>
                            </Button>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body className="py-4">
                    <Row>
                        <Col sm={12} md={12} lg={5}>
                            <Row>
                                <Col>
                                    <Button size="sm" variant="outline-success" onClick={()=>{
                                        setModalXMLOpen(true)
                                        setCpf(item.cpf)
                                    }}>XML da consulta</Button>
                                </Col>
                            </Row>
                            <Row className="g-2 mt-3">
                                <Col sm={12} md={12} lg={12}><strong>CPF:</strong>{` ${item.cpf}`}</Col>
                                <Col sm={12} md={12} lg={12}><strong>Produto:</strong>{` ${item.produto.toUpperCase()}`}
                                </Col>
                                <Col sm={12} md={12} lg={12}><strong>Canal:</strong>{` ${item.canal}`}</Col>
                                <Col sm={12} md={12} lg={12}><strong>Celular:</strong>{` ${item.celular}`}</Col>
                                <Col sm={12} md={12} lg={12}><strong>E-mail:</strong>{` ${item.email}`}</Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ListLeadsSemCredito;
