import React, { useEffect } from 'react';
import { Row, Col, Card, Spinner, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Rating from 'react-rating';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

const CampanhaCreatePage = () => {
    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <h3>
                                <CsLineIcons
                                    icon="notification"
                                    color="#ccc"
                                    className="mb-3 d-inline-block text-primary"
                                />{' '}
                                Iniciar uma nova campanha
                            </h3>
                            <p>
                                As campanhas podem ser criadas a qualquer
                                momento, porém aumentam o risco de bloqueio de
                                contas de e-mail e WhatsApp.
                            </p>
                            <p>
                                <Badge href="#" bg="success" className="p-2">
                                    Recomendamos uma criação de campanha
                                    semanal, tanto para e-mail quanto para
                                    WhatsApp.
                                </Badge>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 mt-3">
                <Col className="mb-5">
                    <Card className="h-100">
                        <Badge
                            bg="primary"
                            className="me-1 position-absolute e-3 t-n2 z-index-1"
                        >
                            Envio imediato e/ou agendado
                        </Badge>
                        <Card.Img
                            src="/img/campanhas/whatsapp.jpg"
                            className="card-img-top sh-22"
                            alt="CC"
                        />
                        <Card.Body>
                            <h5 className="heading mb-0">
                                <NavLink
                                    to="/campanhas/campanha/create/Whatsapp"
                                    className="body-link stretched-link"
                                >
                                    Campanhas de WhatsApp
                                </NavLink>
                            </h5>
                        </Card.Body>
                        <Card.Footer className="border-0 pt-0">
                            <div className="mb-2">
                                <Rating
                                    initialRating={5}
                                    readonly
                                    emptySymbol={
                                        <i className="cs-star text-primary" />
                                    }
                                    fullSymbol={
                                        <i className="cs-star-full text-primary" />
                                    }
                                />
                            </div>
                            <div className="card-text mb-0">
                                <div>0 campanhas em andamento</div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col className="mb-5">
                    <Card className="h-100">
                        <Badge
                            bg="primary"
                            className="me-1 position-absolute e-3 t-n2 z-index-1"
                        >
                            Envio imediato e/ou agendado
                        </Badge>
                        <Card.Img
                            src="/img/campanhas/email.jpg"
                            className="card-img-top sh-22"
                            alt="CC"
                        />
                        <Card.Body>
                            <h5 className="heading mb-0">
                                <NavLink
                                    to="/campanhas/campanha/create/E-mail"
                                    className="body-link stretched-link"
                                >
                                    E-mail
                                </NavLink>
                            </h5>
                        </Card.Body>
                        <Card.Footer className="border-0 pt-0">
                            <div className="mb-2">
                                <Rating
                                    initialRating={5}
                                    readonly
                                    emptySymbol={
                                        <i className="cs-star text-primary" />
                                    }
                                    fullSymbol={
                                        <i className="cs-star-full text-primary" />
                                    }
                                />
                            </div>
                            <div className="card-text mb-0">
                                <div>0 campanhas em andamento</div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col className="mb-5">
                    <Card className="h-100">
                        <Badge
                            bg="primary"
                            className="me-1 position-absolute e-3 t-n2 z-index-1"
                        >
                            Envio imediato e/ou agendado
                        </Badge>
                        <Card.Img
                            src="/img/campanhas/sms.jpg"
                            className="card-img-top sh-22"
                            alt="CC"
                        />
                        <Card.Body>
                            <h5 className="heading mb-0">
                                <NavLink
                                    to="/campanhas/campanha/create/SMS"
                                    className="body-link stretched-link"
                                >
                                    SMS
                                </NavLink>
                            </h5>
                        </Card.Body>
                        <Card.Footer className="border-0 pt-0">
                            <div className="mb-2">
                                <Rating
                                    initialRating={5}
                                    readonly
                                    emptySymbol={
                                        <i className="cs-star text-primary" />
                                    }
                                    fullSymbol={
                                        <i className="cs-star-full text-primary" />
                                    }
                                />
                            </div>
                            <div className="card-text mb-0">
                                <div>0 campanhas em andamento</div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default CampanhaCreatePage;
