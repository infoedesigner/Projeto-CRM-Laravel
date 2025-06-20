import React, { useEffect } from 'react';
import { Row, Col, Card, Spinner, Button, Modal } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import { useQuery, gql } from '@apollo/client';
import axios from "axios";
import swal from "@sweetalert/with-react";
import BreadcrumbList from '../../components/breadcrumb-list/BreadcrumbList';
import NenhumRegistro from '../NenhumRegistro';
// eslint-disable-next-line import/no-cycle
import { NewUserForm } from '../create/user/NewUserForm';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import {BASE_URL} from "../../config";
import {configAxios} from "../../constants";

const UsersPage = () => {
    const title = 'Usuários';
    const description = 'Administradores, vendedores, back-office, etc.';

    const breadcrumbs = [{ to: '', text: 'Home' }];
    const [addModal, setAddModal] = React.useState(false);
    const [loading, setLoading] = true;
    const [data, setData] = true;

    const getUsers = () => {
        axios
            .get(`${BASE_URL}/data/user`, configAxios)
            .then((res) => {
                if (res.status === 200) {
                    setData(res.data);
                }
            })
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                swal('ERRO', `${error}`, 'error');
            });
    }

    if (loading)
        return (
            <>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            </>
        );

    const totalRegistros = data.data.length;

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
                        Cadastro de usuário
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <NewUserForm setAddModal={setAddModal} />
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
                    data.map((user) => (
                        <Col
                            key={user.id}
                            sm={12}
                            md={12}
                            lg={6}
                            xxl={6}
                            className="pb-2"
                        >
                            <Card>
                                <Card.Body>
                                    <CsLineIcons icon="user" /> {user.name}
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

export default UsersPage;
