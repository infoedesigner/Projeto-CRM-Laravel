import {Badge, Button, Card, Col, FormGroup, Nav, Row, Spinner, Tab, Form, FormControl} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import swal from "@sweetalert/with-react";
import ContentLoader from "react-content-loader";
import {Chip, Divider} from "@mui/material";
import JSONPretty from "react-json-pretty";
import {BASE_URL} from "../../config";
import {configAxios} from "../../constants";
import {NewClienteForm} from "../create/cliente";
import {NewExtratoInssForm} from "../create/extratoInss";
import ValoresDisponiveis from "../beneficios/valoresDisponiveis";
import LancamentoHistorico from "../historico/lancamentoHistorico";
import SelectRotinas from "../../components/select-rotinas";

const ConsignadoInss = (props) => {

    const {idBeneficio, GET_DATA, idEsteira} = props;
    const [beneficio,setBeneficio] = useState([{}]);
    const [historicoInssMargem,setHistoricoInssMargem] = useState([{}]);
    const [historicoInssBanco,setHistoricoInssBanco] = useState([{}]);
    const [historicoInssContrato,setHistoricoInssContrato] = useState([{}]);
    const [isLoading,setIsLoading] = useState(true);
    const [parcelas,setParcelas] = useState(84);
    const [xmlConsulta, setXmlConsulta] = useState(undefined);
    const [lead, setLead] = useState([]);

    const getHistoricoInssMargem = useCallback(async (id_beneficio) => {
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
    });

    const getHistoricoInssBanco = useCallback(async (id_beneficio) => {
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
    });

    const getHistoricoInssContrato = useCallback(async (id_beneficio) => {
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
    });

    const getBeneficio = useCallback(async () => {
        setIsLoading(true);
        await axios
            .get(`${BASE_URL}/data/getBeneficiosById/${idBeneficio}`, configAxios)
            .then((res) => {
                setBeneficio(res.data);
            })
            .then(()=>{
                setIsLoading(false);
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    });

    const getXML = async (id_beneficio) => {
        await axios.get(`${BASE_URL}/data/v1/getXmlConsultaByBeneficioId/${id_beneficio}`, configAxios)
            .then((response) => {
                setXmlConsulta(response.data.xml_online.json_response);
            }).catch(error => {
                console.log(error);
            });
    }

    const changeStatus = async (id_esteira, id_status) => {
        await axios
            .post(`${BASE_URL}/data/v1/change-status`, {
                id_esteira,
                id_status
            },configAxios)
            .then(response =>{
                GET_DATA();
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    }

    useEffect(()=>{
        if(idBeneficio > 0) {
            getBeneficio();
        }
    },[idBeneficio]);

    useEffect(() => {
        if(beneficio.id > 0) {
            getHistoricoInssMargem(beneficio.id);
            getHistoricoInssBanco(beneficio.id);
            getHistoricoInssContrato(beneficio.id);
            getXML(beneficio.id);
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

    if(idBeneficio <= 0){
        return (<Card><Card.Body><h5>Selecione um benefício/cliente</h5></Card.Body></Card>);
    }

    return (
        <>
            <Row>
                <Col sm={12} md={12} lg={4}>
                    <Card>
                        <Card.Header>
                            <Card.Title><strong>Nome:</strong> {beneficio?.nome}</Card.Title>
                            <Card.Subtitle><Row><Col><strong>CPF:</strong> {beneficio?.cpf}</Col></Row></Card.Subtitle>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>Nº Benefício: {beneficio?.beneficio}</Col>
                                <Col>Senha: {beneficio?.senha}</Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <Row>
                                <Col>Status:</Col>
                                <Col sm={12} md={12} lg={8}><SelectRotinas tipo="Esteira" onChangeValue={(e)=>{changeStatus(idEsteira,e.id)}}/></Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <LancamentoHistorico lead={lead}/>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="h-100 mb-3 mt-3">
                        <Tab.Container defaultActiveKey="limite">
                            <Card.Header className="border-0 pb-0">
                                <Nav className="nav-tabs-line" variant="tabs" activeKey="limite">
                                    <Nav.Item>
                                        <Nav.Link eventKey="limite">
                                            Limite de crédito
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
                                            Histórico
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="xml">
                                            XML
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Content>
                                    <Tab.Pane eventKey="limite">
                                        <Card.Text>
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
                                            <Divider className="mt-3 mb-3"><Chip label="Limites" /></Divider>
                                            <Row>
                                                <Col><ValoresDisponiveis historicoInssMargem={historicoInssMargem}/></Col>
                                            </Row>
                                            <Divider className="mt-3 mb-3"><Chip label="Dados espécie" /></Divider>
                                            <Row>
                                                <Col>Consulta: {beneficio.offline === 1 ? <Badge bg="danger">Off-line</Badge> : <Badge bg="sucess">On-line</Badge>}</Col>
                                                <Col>Espécie: {beneficio.descricao_especie}</Col>
                                            </Row>
                                            <Divider className="mt-3 mb-3"><Chip label="Produtos" /></Divider>
                                            <Card>
                                                <Card.Body>
                                                    Apenas uma tabela encontrada
                                                </Card.Body>
                                            </Card>
                                        </Card.Text>
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
                                        <Card.Text>
                                            Histórico não encontrado
                                        </Card.Text>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="xml">
                                        <Card.Text>
                                            {
                                                xmlConsulta === undefined ? 'Carregando...' : <JSONPretty id="json-pretty" data={xmlConsulta} space="4"/>
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

export default ConsignadoInss;
