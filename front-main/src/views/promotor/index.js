import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Button, Modal } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import { useQuery, gql } from '@apollo/client';
import axios from 'axios';
import BreadcrumbList from '../../components/breadcrumb-list/BreadcrumbList';
import NenhumRegistro from '../NenhumRegistro';
// eslint-disable-next-line import/no-cycle
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { NewBanco } from '../create/banco';
import { configAxios } from '../../constants';
import { BASE_URL } from '../../config';
import { NewPromotor } from '../create/promotor';

const PromotorPage = () => {
    const title = 'Promotor';
    const description = 'Promotores cadastrados';

    const breadcrumbs = [{ to: '', text: 'Home' }];
    const [addModal, setAddModal] = React.useState(false);
    const [loading, setLoading] = useState(true);
    const [buscaKey, setBuscaKey] = useState('');
    const [data, setData] = useState([]);
    const [error, setError] = useState([]);

    const GET_DATA = async () => {
        configAxios.params = { key: buscaKey };
        await axios
            .get(`${BASE_URL}/data/v1/promotor`, configAxios)
            .then((response) => {
                setData(response.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
    };

    useEffect(() => {
        GET_DATA();
    }, [buscaKey]);

    if (loading)
        return (
            <>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            </>
        );

    const totalRegistros = data.length;

    return (
        <>
            {/* Static Backdrop Start */}
            <Modal
                backdrop="static"
                keyboard={false}
                show={addModal}
                onHide={() => setAddModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="staticBackdropLabel">
                        Cadastro de promotor
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <NewPromotor
                        setAddModal={setAddModal}
                        GET_DATA={GET_DATA}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setAddModal(false)}
                    >
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Static Backdrop End */}
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
                    <Col
                        md="5"
                        className="d-flex align-items-start justify-content-end"
                    >
                        <Button
                            variant="outline-primary"
                            className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1"
                            onClick={() => {
                                setAddModal(true);
                            }}
                        >
                            <CsLineIcons icon="edit-square" /> <span>Novo</span>
                        </Button>
                    </Col>
                </Row>
            </div>
            <Row>
                {totalRegistros > 0 ? (
                    data.map((promotor) => (
                        <Col
                            key={promotor.id}
                            sm={6}
                            md={3}
                            lg={3}
                            xxl={3}
                            className="pb-2"
                        >
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col sm={12} md={9} lg={9} xl={9}>
                                            <CsLineIcons icon="user" />{' '}
                                            {promotor.nome}
                                            <br />
                                            <CsLineIcons icon="credit-card" />{' '}
                                            <span className="text-muted">
                                                {promotor.identificador}
                                            </span>
                                            <br />
                                            <CsLineIcons icon="book" />
                                            <span className="text-muted">
                                                {' '}
                                                {promotor.nome_parceiro}
                                            </span>
                                        </Col>
                                        <Col>
                                            <Button>Editar</Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <NenhumRegistro />
                    </Col>
                )}
            </Row>
        </>
    );
};

export default PromotorPage;
