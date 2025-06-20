import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Button, Modal } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import axios from 'axios';
import SortableTree from 'react-sortable-tree';
import BreadcrumbList from '../../components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { BASE_URL } from '../../config';
import { configAxios } from '../../constants';

import 'react-sortable-tree/style.css';

const RotinasPage = () => {
    const title = 'Rotinas';
    const description = 'Administração de rotinas';

    const breadcrumbs = [{ to: '', text: 'Home' }];
    const [addModal, setAddModal] = useState(false);
    const [rotinas, setRotinas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const GET_BANCO = async () => {
        await axios
            .get(
                `${BASE_URL}/data/v1/rotinas/menuRotinasEdicao/json`,
                configAxios
            )
            .then((res) => {
                if (res.status === 200) {
                    setRotinas(res.data);
                }
            })
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        GET_BANCO();
    }, []);

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
                        Cadastro de rotinas
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body> </Modal.Body>
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
                <Col>
                    {isLoading ? (
                        'Carregando...'
                    ) : (
                        <div style={{ height: 500 }}>
                            <SortableTree
                                style={{ height: '300px' }}
                                treeData={rotinas}
                                onChange={(treeNew) => setRotinas(treeNew)}
                                isVirtualized={false}
                            />
                        </div>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default RotinasPage;
