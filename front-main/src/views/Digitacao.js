import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Card,
    Spinner,
    Button,
    InputGroup,
    FormControl, FormLabel,
} from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import DatePicker from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';
import NenhumRegistro from './NenhumRegistro';
import { configAxios } from '../constants';
import { BASE_URL } from '../config';
import ListEsteiraProposta from '../components/list-esteira-propostas';
import ModalFichaCadastral from './fichas/modalFichaCadastral';
import ModalBeneficios from './fichas/modalBeneficios';
import modalDigitacaoPedido from "./pedidos/aprovarDadosPedido";
import ListEsteiraPropostaPedidos from "../components/list-esteira-propostas/pedidos";
import Pagination from "../components/pagination";
import ModalDigitacaoPedido from "./pedidos/digitacaoDadosPedido";

const DigitacaoPage = () => {
    const title = 'Pedidos de empréstimo - Digitação';
    const description = 'Pedidos com dados aprovados para digitação no banco';

    const breadcrumbs = [{ to: '', text: 'Home' }];

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);
    const [mFichaCadastral, setMFichaCadastral] = useState(false);
    const [mBeneficios, setMBeneficios] = useState(false);
    const [itemModal, setItemModal] = useState({});
    const [idAprove, setIdAprove] = useState(0);

    const [buscaKey, setBuscaKey] = useState('');
    const [startDate, setStartDate] = useState(new Date((new Date()).setDate((new Date()).getDate() - 3)));
    const [endDate, setEndDate] = useState(new Date());

    // MODAIS
    const [modalDigitacao, setModalDigitacao] = useState(false);

    const GET_DATA = async (page) => {
        configAxios.params = {
            key: buscaKey,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            page:page > 1 ? page : 1,
            status: 2
        };
        await axios
            .get(`${BASE_URL}/data/v1/digitacao`, configAxios)
            .then((response) => {
                setData(response.data.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
    };

    useEffect(() => {
        GET_DATA(1);
    },[]);

    const digitacao = async (id) => {
        setIdAprove(id);
        setModalDigitacao(true);
    };

    const showModalFichaCadastral = async (id) => {
        await axios
            .get(`${BASE_URL}/data/v1/esteiraPropostas/${id}`, configAxios)
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

    const totalRegistros = data.data.length;

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
            <ModalDigitacaoPedido modalDigitacao={modalDigitacao} setModalDigitacao={setModalDigitacao} idAprove={idAprove} update={GET_DATA}/>
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
                        <DatePicker className="form-control" selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" loca le={ptBR}/>
                    </InputGroup>
                </Col>
                <Col className="mt-3 mb-5" sm={12} md={6} lg={6} xl={6}>
                    <FormLabel>Busca por palavra</FormLabel>
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
                <Col sm={12} md={12} lg={12} xl={12}>
                    <Pagination
                        activePage={data?.current_page ? data?.current_page : 0}
                        itemsCountPerPage={data?.per_page ? data?.per_page : 0 }
                        totalItemsCount={data?.total ? data?.total : 0}
                        onChange={(pageNumber) => {
                            GET_DATA(pageNumber)
                        }}
                        pageRangeDisplayed={20}
                        itemClass="page-item"
                        linkClass="page-link"
                    />
                </Col>
            </Row>
            <Row>
                {totalRegistros > 0 ? (
                    data.data.map((item) => (
                        <Col key={item.id} sm={12} md={12} lg={12} xxl={12}>
                            <ListEsteiraProposta
                                item={item}
                                digitacao={digitacao}
                                showModalFichaCadastral={
                                    showModalFichaCadastral
                                }
                                showBeneficios={showBeneficios}
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

export default DigitacaoPage;
