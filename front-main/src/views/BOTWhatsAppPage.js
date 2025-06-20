import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Button, ButtonGroup } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';
import { BASE_URL } from '../config';
import { configAxios } from '../constants';

const BOTWhatsAppPage = () => {
    const title = 'BOT WhatsApp';
    const description = 'Conexão de conta BOT WhatsApp';

    const breadcrumbs = [{ to: '', text: 'Home' }];
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    return (
        <>
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
                </Row>
            </div>
            <Row className="h-100">
                <Col style={{ height: '640px' }}>
                    <ButtonGroup aria-label="Basic outlined example">
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                window.open(
                                    `https://whatsapp-node-api-carrera.herokuapp.com/auth/getqr`,
                                    '_blank',
                                    'width=600,height=600'
                                );
                            }}
                        >
                            Conectar número WhatsApp
                        </Button>
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                window.open(
                                    `https://whatsapp-node-api-carrera.herokuapp.com/auth/checkauth`,
                                    '_blank',
                                    'width=600,height=600'
                                );
                            }}
                        >
                            Verificar conexão
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </>
    );
};

export default BOTWhatsAppPage;
