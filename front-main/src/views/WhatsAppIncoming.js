import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Button } from 'react-bootstrap';
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

const WhatsAppIncomingPage = () => {
    const title = 'WhatsApp';
    const description = 'Mensagens de entrada pelo WhatsApp';

    const breadcrumbs = [{ to: '', text: 'Home' }];
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const fetchMessages = async () => {
        await axios
            .get(`${BASE_URL}/data/whatsapp`, configAxios)
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
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    if (loading)
        return (
            <>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            </>
        );

    const localizedTextsMap = {
        columnMenuUnsort: 'não classificado',
        columnMenuSortAsc: 'Classificar por ordem crescente',
        columnMenuSortDesc: 'Classificar por ordem decrescente',
        columnMenuFilter: 'Filtro',
        columnMenuHideColumn: 'Ocultar',
        columnMenuShowColumns: 'Mostrar colunas',
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'contato',
            headerName: 'Nome',
            width: 300,
            editable: true,
        },
        {
            field: 'from_id',
            headerName: 'Celular',
            width: 150,
            editable: true,
        },
        {
            field: 'created_at',
            headerName: 'Data envio',
            width: 200,
            editable: true,
        },
        {
            field: 'conversar',
            headerName: 'Conversar',
            sortable: false,
            renderCell: (item) => {
                const onClick = (e) => {
                    window.open(
                        `https://api.whatsapp.com/send?phone=${item.row.from_id}`,
                        '_blank'
                    );
                };
                return (
                    <Button onClick={onClick} variant="success" size="sm">
                        Conversar
                    </Button>
                );
            },
        },
        {
            field: 'ocultar',
            headerName: 'Ocultar',
            sortable: false,
            renderCell: (item) => {
                const onClick = (e) => {};
                return (
                    <Button onClick={onClick} variant="danger" size="sm">
                        Ocultar
                    </Button>
                );
            },
        },
    ];

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
                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        localeText={localizedTextsMap}
                        initialState={{
                            pinnedColumns: {
                                left: ['contato'],
                                right: ['actions'],
                            },
                        }}
                    />
                </Col>
            </Row>
        </>
    );
};

export default WhatsAppIncomingPage;
