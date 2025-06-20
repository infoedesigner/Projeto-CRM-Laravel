import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Button, Modal } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import { useQuery, gql } from '@apollo/client';
import BreadcrumbList from '../../components/breadcrumb-list/BreadcrumbList';
import NenhumRegistro from '../NenhumRegistro';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { NewBanco } from '../create/banco';

const BancosPage = () => {
    const title = 'Bancos';
    const description = 'Administração de bancos credenciados';

    const GET_BANCO = gql`
        query {
            allBancos {
                paginatorInfo {
                    total
                }
                data {
                    id
                    nome_banco
                }
            }
        }
    `;

    const breadcrumbs = [{ to: '', text: 'Home' }];
    const [addModal, setAddModal] = useState(false);
    const { loading, error, data, refetch } = useQuery(GET_BANCO);

    if (loading)
        return (
            <>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            </>
        );
    if (error) return `Erro ${error.message}`;

    const totalRegistros = data.allBancos.data.length;

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
                        Cadastro de banco
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <NewBanco setAddModal={setAddModal} refetch={refetch} />
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
                    data.allBancos.data.map((user) => (
                        <Col
                            key={user.id}
                            sm={6}
                            md={3}
                            lg={3}
                            xxl={3}
                            className="pb-2"
                        >
                            <Card>
                                <Card.Body>
                                    <CsLineIcons icon="building-large" />{' '}
                                    {user.nome_banco}
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

export default BancosPage;
