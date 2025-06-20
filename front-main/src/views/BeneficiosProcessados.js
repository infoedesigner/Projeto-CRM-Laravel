import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Spinner,
    Button,
    InputGroup,
    FormControl, FormLabel,
} from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';
import NenhumRegistro from './NenhumRegistro';
import { configAxios } from '../constants';
import { BASE_URL } from '../config';
import ModalFichaCadastral from './fichas/modalFichaCadastral';
import ModalBeneficios from './fichas/modalBeneficios';
import ListBeneficios from '../components/list-beneficios';

const BeneficiosProcessadosPage = () => {

    registerLocale('ptBR', ptBR);

    const title = 'Benefícios';
    const description = 'Benefícios processados em fila';

    const breadcrumbs = [{ to: '', text: 'Home' }];
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);
    const [tabelas, setTabelas] = useState([]);
    const [mFichaCadastral, setMFichaCadastral] = useState(false);
    const [mBeneficios, setMBeneficios] = useState(false);
    const [itemModal, setItemModal] = useState({});
    const [buscaKey, setBuscaKey] = useState('');

    const [startDate, setStartDate] = useState(new Date((new Date()).setDate((new Date()).getDate() - 3)));
    const [endDate, setEndDate] = useState(new Date());

    const GET_DATA = () => {
        configAxios.params = { key: buscaKey };
        axios
            .get(`${BASE_URL}/data/v1/beneficios?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&key=${buscaKey}`, configAxios)
            .then((response) => {
                setData(response.data.data.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
    };

    const GET_TABELAS = async () => {
        configAxios.params = { term: '' };
        await axios
            .get(`${BASE_URL}/data/v1/tabela`, configAxios)
            .then((response) => {
                setTabelas(response.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
    };

    const aprove = async (id) => {
        console.log(`Aprovando ${id}`);
    };

    useEffect(() => {
        GET_DATA();
        GET_TABELAS();
        const intervalId = setInterval(() => {
            GET_DATA();
        }, 1000 * 60); // in milliseconds
        return () => clearInterval(intervalId);
    }, []);

    const showModalFichaCadastral = async (id) => {
        await axios
            .get(
                `${BASE_URL}/data/v1/esteiraPropostas/${id}/${buscaKey}`,
                configAxios
            )
            .then((res) => {
                setItemModal(res.data);
            })
            .then(() => {
                setMFichaCadastral(true);
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    };

    const showBeneficios = async (cpf) => {
        await axios
            .get(`${BASE_URL}/data/v1/beneficiosByCPF/${cpf}`, configAxios)
            .then((res) => {
                setItemModal(res.data);
            })
            .then(() => {
                setMBeneficios(true);
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    };

    if (loading)
        return (
            <>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            </>
        );
    if (error) return `Erro! ${error.message}`;

    const totalRegistros = data.length;

    return (
        <>
            <HtmlHead title={title} description={description} />
            <ModalFichaCadastral
                mFichaCadastral={mFichaCadastral}
                setMFichaCadastral={setMFichaCadastral}
                itemModal={itemModal}
            />
            <ModalBeneficios
                mBeneficios={mBeneficios}
                setMBeneficios={setMBeneficios}
                itemModal={itemModal}
            />
            <div className="page-title-container">
                <Row>
                    {/* Title Start */}
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4">{title}</h1>
                        <h4 className="text-primary">
                            {description}{' '}
                            <span role="img" aria-label="donut">
                                🤝
                            </span>
                        </h4>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                    {/* Title End */}
                </Row>
            </div>
            <Row>
                <Col className="mt-3 mb-5" sm={12} md={3} lg={3} xl={3}>
                    <InputGroup>
                        <FormLabel>Data inicial</FormLabel>
                        <DatePicker className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" locale={ptBR}/>
                    </InputGroup>
                </Col>
                <Col className="mt-3 mb-5" sm={12} md={3} lg={3} xl={3}>
                    <InputGroup>
                        <FormLabel>Data final</FormLabel>
                        <DatePicker className="form-control" selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" locale={ptBR}/>
                    </InputGroup>
                </Col>
                <Col className="mt-3 mb-5" sm={12} md={6} lg={6} xl={6}>
                    <FormLabel>Data final</FormLabel>
                    <InputGroup>
                        <FormControl
                            placeholder="Nome ou CPF"
                            value={buscaKey}
                            onChange={(e) => {
                                setBuscaKey(e.target.value);
                            }}
                        />
                        <Button
                            variant="outline-secondary"
                            id="button-addon2"
                            onClick={GET_DATA}
                        >
                            Buscar
                        </Button>
                    </InputGroup>
                </Col>
            </Row>

            <Row>
                {totalRegistros > 0 ? (
                    data.map((item) => (
                        <Col key={item.id} sm={12} md={12} lg={6} xxl={6}>
                            <ListBeneficios
                                item={item}
                                aprove={aprove}
                                showModalFichaCadastral={
                                    showModalFichaCadastral
                                }
                                showBeneficios={showBeneficios}
                                tabelas={tabelas}
                            />
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

export default BeneficiosProcessadosPage;
