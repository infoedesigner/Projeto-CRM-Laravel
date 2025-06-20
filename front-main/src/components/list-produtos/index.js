import React, {useEffect, useState} from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import 'react-circular-progressbar/dist/styles.css';

const ListProdutos = (props) => {
    const { id, produto, descricao } = props;

    return (
        <Card className="mb-2">
            <Row className="g-0 sh-12">
                <Col xs="auto">
                    <img
                        src="/img/bancos/none.png"
                        alt="user"
                        className="card-img card-img-horizontal sw-13 sw-lg-15"
                    />
                </Col>
                <Col>
                    <Card.Body className="pt-0 pb-0 h-100">
                        <Row className="g-0 h-100 align-content-center">
                            <Col
                                md="7"
                                className="d-flex flex-column mb-2 mb-md-0"
                            >
                                {id} {produto}
                                <div className="text-small text-muted text-truncate">
                                    {descricao}
                                </div>
                            </Col>
                            <Col>
                                <div className="d-flex flex-row ms-3">
                                    <div className="sw-5 sh-5 position-relative">
                                        <div style={{ width: 40, height: 40 }}>
                                            <CircularProgressbar
                                                value={
                                                    parseInt(id, 2) === 1
                                                        ? 63
                                                        : 37
                                                }
                                                strokeWidth={4}
                                                className="w-100 h-100 primary text-small"
                                            />
                                        </div>
                                        <div className="position-absolute absolute-center text-alternate text-small ">
                                            {parseInt(id, 2) === 1
                                                ? '63%'
                                                : '37%'}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col
                                md="5"
                                className="d-flex align-items-center justify-content-md-end"
                            >
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="btn-icon btn-icon-start ms-1"
                                >
                                    <CsLineIcons
                                        icon="edit-square"
                                        width="15"
                                        height="15"
                                        className="me-xxl-2"
                                    />
                                    <span className="d-none d-xxl-inline-block">
                                        Editar
                                    </span>
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
};

export default ListProdutos;
