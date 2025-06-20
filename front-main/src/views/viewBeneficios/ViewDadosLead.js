import {
    Badge,
    Button,
    Card,
    Col,
    FormGroup,
    Nav,
    Row,
    Spinner,
    Tab,
    Form,
    FormControl,
    Accordion, Tabs, Alert
} from "react-bootstrap";
import React, {useCallback, useEffect, useRef, useState} from "react";
import ModalProvaVida from "views/fichas/modalProvaVida";
import axios from "axios";
import swal from "@sweetalert/with-react";
import ContentLoader from "react-content-loader";
import {Chip, Divider} from "@mui/material";
import JSONPretty from "react-json-pretty";
import moment from "moment";
import {BASE_URL} from "../../config";
import {configAxios} from "../../constants";
import {NewClienteForm} from "../create/cliente";
import {NewExtratoInssForm} from "../create/extratoInss";
import ValoresDisponiveis from "../beneficios/valoresDisponiveis";
import LancamentoHistorico from "../historico/lancamentoHistorico";
import Renegociacoes from "../../components/renegociacoes";
import SimulacoesCartoes from "../../components/simulacoes-cartoes";
import SimulacoesEmprestimos from "../../components/simulacoes-cartoes/SimulacoesEmprestimos";
import Portabilidades from "../../components/portabilidades";
import DropzoneUpload from "../../components/dropzone/DropzoneUpload";


const ViewDadosLead = (props) => {

    const {id} = props;
    const [beneficio,setBeneficio] = useState([{}]);
    const [historicoInssMargem,setHistoricoInssMargem] = useState([{}]);
    const [historicoInssBanco,setHistoricoInssBanco] = useState([{}]);
    const [historicoInssContrato,setHistoricoInssContrato] = useState([{}]);
    const [isLoading,setIsLoading] = useState(true);
    const [parcelas,setParcelas] = useState(84);
    const [xmlConsulta, setXmlConsulta] = useState(undefined);
    const [xmlConsultaOffline, setXmlConsultaOffline] = useState(undefined);
    const [lead, setLead] = useState([]);
    const [hoje, setHoje] = useState(moment());
    const [valorSimulado, setValorSimulado] = useState(1000.00);
    const [motivosBloqueios, setMotivosBloqueios] = useState([]);
    const [simulacoesRealizadas, setSimulacoesRealizadas] = useState([]);

    const [isLoadingReprocess,setIsLoadingReprocess] = useState(false);

    const getHistoricoInssMargem = async (id_beneficio) => {
        await axios
            .get(`${BASE_URL}/data/v1/historicoInssMargem/${id_beneficio}/${parcelas}`, configAxios)
            .then((res) => {
                setHistoricoInssMargem(res.data.data);
            })
            .then(()=>{
                setIsLoading(false);
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    };

    const getHistoricoInssBanco = async (id_beneficio) => {
        await axios
            .get(`${BASE_URL}/data/v1/historicoInssBanco/${id_beneficio}`, configAxios)
            .then((res) => {
                setHistoricoInssBanco(res.data.data);
            })
            .then(()=>{
                setIsLoading(false);
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    };

    const getHistoricoInssContrato = async (id_beneficio) => {
        await axios
            .get(`${BASE_URL}/data/v1/historicoInssContrato/${id_beneficio}`, configAxios)
            .then((res) => {
                setHistoricoInssContrato(res.data.data);
            })
            .then(()=>{
                setIsLoading(false);
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    };

    const getBeneficio = async () => {
        setIsLoading(true);
        await axios
            .get(`${BASE_URL}/data/getBeneficiosById/${id}`, configAxios)
            .then((res) => {
                setBeneficio(res.data);
            })
            .then(()=>{
                setIsLoading(false);
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    };

    const atualizaDadosOffline = async (nb,id_beneficio,uuid) => {
        await axios
            .get(`${BASE_URL}/data/v1/processInssHistorico/${nb}/${uuid}`, configAxios)
            .then(()=>{
                getHistoricoInssMargem(id_beneficio);
                getHistoricoInssBanco(id_beneficio);
                getHistoricoInssContrato(id_beneficio);
                setIsLoading(false);
                swal('Sucesso', `Atualização realizada com sucesso em ${hoje.format('DD/MM/YYYY')}`, 'success');
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    };

    const atualizaDadosOnline = async (nb,id_beneficio,uuid,cpf) => {
        await axios
            .get(`${BASE_URL}/data/v1/reprocessOnline/${nb}/${id_beneficio}/${uuid}/${cpf}/Sim/1`, configAxios)
            .then(()=>{
                getHistoricoInssMargem(id_beneficio);
                getHistoricoInssBanco(id_beneficio);
                getHistoricoInssContrato(id_beneficio);
                setIsLoading(false);
                swal('Sucesso', `Atualização realizada com sucesso em ${hoje.format('DD/MM/YYYY')}`, 'success');
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    };

    const getXML = async (id_beneficio) => {
        await axios.get(`${BASE_URL}/data/v1/getXmlConsultaByBeneficioId/${id_beneficio}/online`, configAxios)
            .then((response) => {
                setXmlConsulta(response.data.xml_online.json_response);
            }).catch(error => {
                console.log(error);
            });

        await axios.get(`${BASE_URL}/data/v1/getXmlConsultaByBeneficioId/${id_beneficio}/offline`, configAxios)
            .then((response) => {
                setXmlConsultaOffline(response.data.xml_online.json_response);
            }).catch(error => {
                console.log(error);
            });
    }

    const getSimulacoesRealizadas = async (id_beneficio) => {
        await axios.get(`${BASE_URL}/data/v1/simulacoes-realizadas/${id_beneficio}`, configAxios)
            .then((response) => {
                console.log(response.data.data);
                setSimulacoesRealizadas(response.data.data);
            }).catch(error => {
                console.log(error);
            });
    }

    const getMotivoBloqueios = async (id_beneficio) => {
        await axios.get(`${BASE_URL}/data/v1/motivo-bloqueios/${id_beneficio}`, configAxios)
            .then((response) => {
                console.log(response.data.data);
                setMotivosBloqueios(response.data.data);
            }).catch(error => {
                console.log(error);
            });
    }

    const reprocessarSimulacoes = async (id_beneficio) => {

        setIsLoadingReprocess(true);

        await axios.get(`${BASE_URL}/data/v1/reprocessar-simulacoes/${id_beneficio}`, configAxios)
            .then((response) => {
                setIsLoadingReprocess(false);
            }).catch(error => {
                setIsLoadingReprocess(false);
            }).finally(()=>{
                getSimulacoesRealizadas(id_beneficio);
                getMotivoBloqueios(id_beneficio);
                setIsLoadingReprocess(false);
            });
    };

    useEffect(()=>{
        if(id > 0) {
            getBeneficio();
        }
    },[id]);

    useEffect(() => {
        if(beneficio.id > 0) {
            getHistoricoInssMargem(beneficio.id);
            getHistoricoInssBanco(beneficio.id);
            getHistoricoInssContrato(beneficio.id);
            getXML(beneficio.id);
            getSimulacoesRealizadas(beneficio.id);
            getMotivoBloqueios(beneficio.id);
        }
    },[beneficio]);

    if(isLoading){
        return (
            <>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col className="text-center">
                                <Spinner animation="border" variant="light" size="sm"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ContentLoader
                                    speed={1}
                                    width={476}
                                    height={124}
                                    viewBox="0 0 476 124"
                                    backgroundColor="#f3f3f3"
                                    foregroundColor="#ecebeb"
                                    {...props}
                                >
                                    <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
                                    <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
                                    <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
                                    <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
                                    <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
                                    <circle cx="20" cy="20" r="20" />
                                </ContentLoader>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </>
        );
    }

    if(id <= 0){
        return (<Card><Card.Body><h5>Selecione um benefício/cliente</h5></Card.Body></Card>);
    }

    return (
        <>
            <Row>
                <Col sm={12} md={12} lg={5}>
                    <Card>
                        <Card.Header>
                            <Card.Title><strong>Nome:</strong> {beneficio?.nome}</Card.Title>
                            <Card.Subtitle>
                                <Row className="gap-2">
                                    <Col><strong>CPF:</strong> {beneficio?.cpf}</Col>
                                </Row>
                                <Row className="gap-2">
                                    <Col><strong>Idade:</strong> {beneficio?.idade}</Col>
                                    <Col><strong>Espécie:</strong> {beneficio?.especie}</Col>
                                </Row>
                            </Card.Subtitle>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>Nº Benefício: {beneficio?.beneficio}</Col>
                                <Col>Senha: {beneficio?.senha}</Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <Button variant="outline-info" onClick={()=>{atualizaDadosOffline(beneficio.beneficio,beneficio.id,beneficio.uuid)}}>Dados complementares offline</Button>
                                </Col>
                                <Col>
                                    <Button variant="outline-success" onClick={()=>{atualizaDadosOnline(beneficio.beneficio,beneficio.id,beneficio.uuid,beneficio.cpf)}}>Reprocessar dados on-line</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={12} lg={7} xl={7}>
                    <ValoresDisponiveis historicoInssMargem={historicoInssMargem}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="h-100 mb-3 mt-3">
                        <Tab.Container defaultActiveKey="resumo">
                            <Card.Header className="border-0 pb-0">
                                <Nav className="nav-tabs-line" variant="tabs" activeKey="resumo">
                                    <Nav.Item>
                                        <Nav.Link eventKey="resumo">
                                            Resumo
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="documentos">
                                            Documentos
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="prova-vida">
                                            Prova de Vida
                                        </Nav.Link>
                                    </Nav.Item>                                    
                                    <Nav.Item>
                                        <Nav.Link eventKey="limite">
                                            Limite de crédito (simulações)
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="extrato">
                                            Extrato consignado
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="dados">
                                            Dados pessoais
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="fechamento">
                                            Status fechamento
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="historico">
                                            Contato/Histórico
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="xml">
                                            XML on-line
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="xml-offline">
                                            XML off-line
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Content>
                                    <Tab.Pane eventKey="resumo">
                                        <Row>
                                            <Col>
                                                <div className="form-check form-switch">
                                                    <input type="checkbox" className="form-check-input" id="bloqueado" />
                                                    <label className="form-check-label" htmlFor="bloqueado">
                                                        Bloqueado
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="form-check form-switch">
                                                    <input type="checkbox" className="form-check-input" id="recebe_pa" />
                                                    <label className="form-check-label" htmlFor="recebe_pa">
                                                        Recebe PA
                                                    </label>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Divider className="mt-3 mb-3"><Chip label="Dados espécie" /></Divider>
                                        <Row>
                                            <Col>Consulta: <Badge bg="success">On-line</Badge></Col>
                                            <Col>Espécie: {beneficio.descricao_especie}</Col>
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="documentos">
                                        <Row>
                                            <Col sm={12} md={12} lg={12}>
                                                <DropzoneUpload id_beneficio={beneficio.id}/>
                                            </Col>
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="prova-vida">
                                        <Row>
                                            <Col sm={12} md={12} lg={12}>
                                                <ModalProvaVida id_beneficio={beneficio.id}/>
                                            </Col>
                                        </Row>
                                    </Tab.Pane>                                    
                                    <Tab.Pane eventKey="limite">
                                            <Row>
                                                <Col>
                                                    <Tabs>
                                                        <Tab eventKey="emprestimos" title="Empréstimos">
                                                            <Card>
                                                                <Card.Body>
                                                                    <Row className="mt-2">
                                                                        <Col>
                                                                            <SimulacoesEmprestimos id_beneficio={beneficio.id} hoje={hoje} historicoInssMargem={historicoInssMargem}/>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Body>
                                                            </Card>
                                                        </Tab>
                                                        <Tab eventKey="renegociacoes" title="Renegociações">
                                                            <Card>
                                                                <Card.Body>
                                                                    <Renegociacoes id_beneficio={beneficio.id} cpf={beneficio.cpf}/>
                                                                </Card.Body>
                                                            </Card>
                                                        </Tab>
                                                        <Tab eventKey="portabilidades" title="Portabilidades">
                                                            <Card>
                                                                <Card.Body>
                                                                    <Portabilidades id_beneficio={beneficio.id} cpf={beneficio.cpf}/>
                                                                </Card.Body>
                                                            </Card>
                                                        </Tab>
                                                        <Tab eventKey="cartoes" title="Cartões">
                                                            <Card>
                                                                <Card.Body>
                                                                    <SimulacoesCartoes id_beneficio={beneficio.id} cpf={beneficio.cpf}/>
                                                                </Card.Body>
                                                            </Card>
                                                        </Tab>
                                                        <Tab eventKey="aumentos" title="Aumentos">
                                                            <div className="mt-3">
                                                                <Alert variant="info">Em breve</Alert>
                                                            </div>
                                                        </Tab>
                                                        <Tab eventKey="simulacoes_realizadas" title="Simulações realizadas">
                                                            <div className="pt-3">
                                                                <Button size="sm" variant="outline-info" onClick={()=>{
                                                                    reprocessarSimulacoes(beneficio.id);
                                                                }}>{isLoadingReprocess ? 'Aguarde...' : 'Reprocessar simulações' }</Button>
                                                                <ul className="pt-3">
                                                                    {simulacoesRealizadas.map((simulacao,k) => {
                                                                        return (
                                                                            <>
                                                                                <li key={k}>
                                                                                    <h3>{`${simulacao.nome} [${simulacao.id_tabela}]`}</h3>
                                                                                    <div className="p-2"><JSONPretty id="json-pretty" data={simulacao.params} space="2"/></div>
                                                                                    <div className="p-2"><JSONPretty id="json-pretty" data={simulacao.validacao} space="2"/></div>
                                                                                </li>
                                                                                <Divider>-</Divider>
                                                                            </>
                                                                        );
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        </Tab>
                                                        <Tab eventKey="motivo_recusa" title="Motivos recursa">
                                                            <div className="pt-3">
                                                                <ul className="pt-3">
                                                                    {motivosBloqueios.map((motivo,k) => {
                                                                        return (
                                                                            <>
                                                                                <li key={k}>
                                                                                    <h3>{`${motivo.nome} [${motivo.id_tabela}]`}</h3>
                                                                                    <div className="p-2"><JSONPretty id="json-pretty" data={motivo.motivo} space="2"/></div>
                                                                                    <div className="p-2"><JSONPretty id="json-pretty" data={motivo.params} space="2"/></div>
                                                                                </li>
                                                                                <Divider>-</Divider>
                                                                            </>
                                                                        );
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        </Tab>
                                                    </Tabs>
                                                </Col>
                                            </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="extrato">
                                        <Card.Text>
                                            {beneficio.id > 0 ? <NewExtratoInssForm historicoInssBanco={historicoInssBanco} historicoInssContrato={historicoInssContrato}/> : 'Carregando'}
                                        </Card.Text>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="dados">
                                        <Card.Text>
                                            <NewClienteForm beneficio={beneficio}/>
                                        </Card.Text>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="fechamento">
                                        <Card.Text>
                                            Em negociação
                                        </Card.Text>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="historico">
                                        <Card>
                                            <Card.Body>
                                                <LancamentoHistorico lead={lead}/>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="xml">
                                        <Card.Text>
                                            {
                                                xmlConsulta === undefined ? 'Não encontrado...' : <JSONPretty id="json-pretty" data={xmlConsulta} space="4"/>
                                            }
                                        </Card.Text>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="xml-offline">
                                        <Card.Text>
                                            {
                                                xmlConsultaOffline === undefined ? 'Não encontrado...' : <JSONPretty id="json-pretty" data={xmlConsultaOffline} space="4"/>
                                            }
                                        </Card.Text>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
            </Row>
        </>
    );

}

export default ViewDadosLead;
