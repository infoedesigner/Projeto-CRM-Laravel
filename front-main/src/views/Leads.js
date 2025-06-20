import React, {useEffect, useState} from 'react';
import {
    Row,
    Col,
    Card,
    Spinner,
    Button,
    Modal,
    InputGroup,
    FormLabel,
    FormControl, Form,
} from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import axios from "axios";
import DatePicker from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import {Checkbox, FormControlLabel} from "@mui/material";
import Pagination from "react-js-pagination";
import JSONPretty from 'react-json-pretty';
import Swal from "sweetalert2";
import {AccessAlarm, FavoriteBorder, FavoriteBorderTwoTone} from "@mui/icons-material";
import Select from "react-select";

import ListLeads from '../components/list-leads';
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from "../cs-line-icons/CsLineIcons";
import { NewLeadForm } from "./create/lead";
import {BASE_URL} from "../config";
import {configAxios} from "../constants";
import 'react-json-pretty/themes/monikai.css';

import LancamentoHistorico from "./historico/lancamentoHistorico";
import ViewDadosLead from "./viewBeneficios/ViewDadosLead";
import StatusSideBar from "../components/status";

const LeadsPage = () => {

    const title = 'Leads';
    const description = 'Lista de leads captados pelo omnichannel e landing page';
    const breadcrumbs = [{ to: '', text: 'Home' }];

    const qualificacoes = [
        {value: 'qualificado', label: 'Qualificado'},
        {value: 'desqualificado', label: 'Não Qualificado'},
        {value: 'todos', label: 'Todos'},
    ];

    const [modalLeadManual, setModalLeadManual] = useState(false);
    const [modalHistorico, setModalHistorico] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [rotinas, setRotinas] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingPage, setLoadingPage] = useState(true);

    const [produtos, setProdutos] = useState([]);
    const [produto, setProduto] = useState('');
    const [categoria, setCategoria] = useState('qualificado');

    const [buscaKey, setBuscaKey] = useState('');
    const [startDate, setStartDate] = useState(new Date((new Date()).setDate((new Date()).getDate() - 3)));
    const [endDate, setEndDate] = useState(new Date());

    const [lead, setLead] = useState({});

    const [cpf, setCpf] = useState(0);
    const [xmlConsulta, setXmlConsulta] = useState('XML...');
    const [modalXMLOpen, setModalXMLOpen] = useState(false);

    const [id, setId] = useState(0);
    const [selectedValues, setSelectedValues] = useState(['BLOG-INSS','CARTAO-BENEFICIO','CARTAO-DE-CREDITO','CREDITO-SAUDE-FGTS','CREDITO-SAUDE-INSS','EMPRESTIMO-BPC-E-LOAS','EMPRESTIMO-PARA-REPRESENTANTE-LEGAL-INSS','FGTS','FUNCIONARIO-PUBLICO-GOVERNO-FEDERAL','FUNCIONARIO-PUBLICO-GOVERNO-PARAIBA','FUNCIONARIO-PUBLICO-GOVERNO-PARANA','FUNCIONARIO-PUBLICO-GOVERNO-SAO-PAULO','INSS','NEGATIVADO','PORTABILIDADE-DE-DIVIDAS']);

    const GET_XML = async () => {
        await axios.get(`${BASE_URL}/data/v1/getXmlConsulta/${cpf}`, configAxios)
            .then((response) => {
                setXmlConsulta(response.data.consulta);
            }).catch(() => {
                setLoading(false);
            });
        setLoading(false);
    }

    const GET_DATA = async (page) => {

        setLoadingPage(true);

        configAxios.params = {
            key: buscaKey,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            page:page > 1 ? page : 1,
            status: 1,
            situacao: 'com-credito',
            categoria,
            produto: selectedValues.join(','),
        };
           await axios.get(`${BASE_URL}/data/v1/leads`,configAxios)
                .then((response) => {
                    setData(response.data.json.leads.data);
                    setProdutos(response.data.json.produtos);
                }).catch((error) => {
                   console.error(error);
                }).finally(()=>{
                   setLoadingPage(false);
               });
    }

    const GET_ROTINAS = async () => {
        configAxios.params = {tipo: 'Leads'};
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
            // eslint-disable-next-line no-shadow
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(()=>{
        setXmlConsulta('Aguarde...');
        GET_XML();
    },[cpf]);

    useEffect(()=>{
        if(id > 0) {
            setModalOpen(true);
        }
    },[id]);

    useEffect(() => {
        GET_ROTINAS();
        GET_DATA(1);
    },[selectedValues]);

    const handleLeadTratado = (id_lead) => {

        Swal.fire({
            title: 'O lead já foi tratado?',
            text: "Caso sim, clique em ok, ele será armazenado para futuras campanhas.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#37a507',
            cancelButtonColor: '#efda27',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Ainda não',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Ótimo!',
                    'Lead armazenado com sucesso.',
                    'success'
                )
                GET_DATA(1);
            }
        })

    }

    if (loading)
        return (
            <>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            </>
        );

    const handleHistoricoLead = (leadObj) => {
        setLead(leadObj);
        setModalHistorico(true);
    }

    const handleCheckboxChange = (event, value) => {
        if (event.target.checked) {
            setSelectedValues(prevValues => [...prevValues, value]);
        } else {
            setSelectedValues(prevValues => prevValues.filter(val => val !== value));
        }
    };

    return (
        <>
            <HtmlHead title={title} description={description} >
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css"
                />
            </HtmlHead>
            <div className="page-title-container">
                <Row>
                    {/* Title Start */}
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4">{title}</h1>
                        <h4 className="text-primary">{description}</h4>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={6} md={6} lg={2}>
                        <Button
                            onClick={() => {
                                setModalLeadManual(true);
                            }}
                        >
                            <CsLineIcons icon="filter" />{' '}
                            <span>Novo Lead</span>
                        </Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        {
                            loading ? 'Carregando...' : produtos.map((i,k) => {
                                return (
                                    <FormControlLabel
                                        key={k}
                                        control={
                                            <Checkbox
                                                id={i.id}
                                                value={i.lp_code}
                                                checkedIcon={<FavoriteBorderTwoTone />}
                                                onChange={(event) => handleCheckboxChange(event, i.lp_code)}
                                                checked={selectedValues.includes(i.lp_code)}
                                            />
                                        }
                                        label={i.produto}
                                    />)
                            })
                        }
                    </Col>
                </Row>
                <Row>
                    <Col className="mt-3 mb-5" sm={12} md={3} lg={2} xl={2}>
                        <InputGroup>
                            <FormLabel>Data inicial</FormLabel>
                            <DatePicker className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" locale={ptBR}/>
                        </InputGroup>
                    </Col>
                    <Col className="mt-3 mb-5" sm={12} md={3} lg={2} xl={2}>
                        <InputGroup>
                            <FormLabel>Data final</FormLabel>
                            <DatePicker className="form-control" selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" locale={ptBR}/>
                        </InputGroup>
                    </Col>
                    <Col className="mt-3 mb-5" sm={12} md={3} lg={3} xl={3}>
                        <Form.Label className="d-block">Qualificação</Form.Label>
                        <Select
                            classNamePrefix="react-select"
                            defaultValue={qualificacoes[0]}
                            name="qualificacoes"
                            options={qualificacoes}
                            onChange={(e) => {
                                setCategoria(e.value);
                            }}
                        />
                    </Col>
                    <Col className="mt-3 mb-5" sm={12} md={3} lg={3} xl={3}>
                        <FormLabel>Nome ou parte do CPF</FormLabel>
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
                {/* Title End */}
                <Modal
                    backdrop="static"
                    className="modal-right large"
                    show={modalLeadManual}
                    onHide={() => {
                        setModalLeadManual(false);
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Cadastro de Lead</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <NewLeadForm setAddModal ={ setModalLeadManual}
                                     acao = "insert"
                                     idLead=""
                                     nome=""
                                     celular=""
                                     email=""
                                     canal=""
                                     cpf=""
                                     cidade=""
                                     uf=""
                                     idade=""
                                     valor={ 0 }
                        />

                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setModalLeadManual(false);
                            }}
                        >
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* Title End */}
                <Modal
                    backdrop="static"
                    className="modal-right large"
                    show={modalHistorico}
                    onHide={() => {
                        setModalHistorico(false);
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Lançamento de histórico</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <LancamentoHistorico lead={lead}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setModalHistorico(false);
                            }}
                        >
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    backdrop="static"
                    className="modal-right large"
                    show={modalXMLOpen}
                    onHide={() => {
                        setModalXMLOpen(false);
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>XML Consulta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h3>XML</h3>
                        {/* eslint-disable-next-line react/jsx-no-bind */}
                        <JSONPretty id="json-pretty" data={xmlConsulta} replacer={
                            function (key, value) {
                                if (key === 'queryTime') {
                                    value += ' - saldo atual';
                                }
                                return value;
                            }
                        } space="4"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setModalXMLOpen(false);
                            }}
                        >
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    backdrop="static"
                    className="modal-right large"
                    show={modalOpen}
                    onHide={() => {
                        setModalOpen(false);
                        setId(0);
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Dados do pedido</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ViewDadosLead id={id}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setModalOpen(false);
                            }}
                        >
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <Row>
                <Col sm={4} md={4} lg={2}>
                    <Card>
                        <Card.Body>
                            <StatusSideBar rotinas={rotinas}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Row>
                        {
                            loadingPage ? <Spinner animation="border"/> : data?.map(
                                (item,kLL) => (
                                    <ListLeads
                                        key={ kLL }
                                        kLL={kLL}
                                        item={ item }
                                        beneficios={item.beneficios}
                                        especies={item.especies}
                                        situacoes={item.situacoes}
                                        margens={item.margens}
                                        nbs={item.nbs}
                                        handleHistoricoLead={ () => {
                                            handleHistoricoLead(item.id)
                                        }}
                                        setModalXMLOpen={setModalXMLOpen}
                                        setCpf={setCpf}
                                        setId={setId}
                                        handleLeadTratado={handleLeadTratado}
                                        margensCartao={item.margemCartao}
                                        margensCartaoBeneficio={item.margemCartaoBeneficio}
                                        creditoMargem={item.credito_margem}
                                        creditoRefinPortabilidade={item.credito_refin_portabilidade}
                                        beneficiosComCredito={item.beneficios_com_credito}
                                        beneficiosSemCredito={item.beneficios_sem_credito}
                                        beneficiosOffline={item.beneficios_offline}
                                        beneficiosOnlineBlock={item.beneficios_online_block}
                                        erros={item.erros}
                                        ip={item.ip}
                                        naoEncontrado={item.naoEncontrado}
                                    />
                                )
                            )
                        }
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default LeadsPage;
