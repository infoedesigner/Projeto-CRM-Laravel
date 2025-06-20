import {Alert, Badge, Button, ButtonGroup, Card, Col, Row, Spinner, Tab, Tabs} from 'react-bootstrap';
import {CardContent, Typography} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import { format } from 'date-fns';

import {dateTimeEnBr, Money} from "../../utils";
import {BASE_URL} from "../../config";
import {configAxios} from "../../constants";

const TabsTitleCom = (props) => {
    const {qtde} = props;
    return (
        <div className="d-flex justify-content-between">
            <span>Benefícios com crédito <Badge bg="success">{qtde}</Badge></span>
        </div>
    );
}

const TabsTitleSem = (props) => {
    const {qtde} = props;
    return (
        <div className="d-flex justify-content-between">
            <span>Benefícios sem crédito <Badge bg="warning">{qtde}</Badge></span>
        </div>
    );
}

const TabsTitleNaoEncontrado = (props) => {
    const {qtde} = props;
    return (
        <div className="d-flex justify-content-between">
            <span>Não encontrado(s) <Badge bg="info">{qtde}</Badge></span>
        </div>
    );
}

const TabsTitleOffline = (props) => {
    const {qtde} = props;
    return (
        <div className="d-flex justify-content-between">
            <span>Off-line <Badge bg="info">{qtde}</Badge></span>
        </div>
    );
}

const TabsTitleOnlineBlock = (props) => {
    const {qtde} = props;
    return (
        <div className="d-flex justify-content-between">
            <span>On-line (Bloqueados) <Badge bg="info">{qtde}</Badge></span>
        </div>
    );
}

const TabsTitleErros = (props) => {
    const {qtde} = props;
    return (
        <div className="d-flex justify-content-between">
            <span>Erro(s) <Badge bg="danger">{qtde}</Badge></span>
        </div>
    );
}

const ListLeads = (props) => {

    const [loading, setLoading] = useState(true);
    const {kLL,item, handleHistoricoLead, setModalXMLOpen,setCpf, setId, beneficiosComCredito,beneficiosSemCredito,erros,naoEncontrado,beneficiosOffline,beneficiosOnlineBlock} = props;

    const renderErros = (b) => {
        return b.map((i,k)=> {
            return <p key={k}>{i.error}</p>
        });
    }

    const renderNaoEncontrado = (b) => {
        return b.map((i,k)=> {
            return <p key={k}>{i.error}</p>
        });
    }

    useEffect(()=>{
        setLoading(false);
    },[]);

    const renderBeneficios = (b) => {
        return <>
            <Row className="border-bottom p-1 pt-3">
                <Col sm={2} md={2} lg={1}>#IDB.</Col>
                <Col sm={1} md={1} lg={1}>-</Col>
                <Col sm={1} md={1} lg={1}>-</Col>
                <Col sm={2} md={2} lg={2}>Benefício</Col>
                <Col sm={3} md={2} lg={1}>Espécie</Col>
                <Col className="text-nowrap" lg={1}>Situação</Col>
                <Col className="text-nowrap" lg={1}>Margem</Col>
                <Col className="text-nowrap" lg={2}>Crédito calculado</Col>
                <Col className="text-nowrap" lg={2}>Margem RMC/RCC</Col>
            </Row>
            {
                b.map((i,k) => {
                    return <Row key={k} className="border-bottom p-1 pt-3">
                        <Col sm={2} md={2} lg={1}>{`${i.id_beneficio}`}</Col>
                        <Col sm={1} md={1} lg={1}>{Number(i.credito_margem)>=1 ? <Badge bg="success">Margem</Badge> : <Badge bg="danger">Margem</Badge>}</Col>
                        <Col sm={1} md={1} lg={1}>{Number(i.credito_refin_portabilidade)>=1 ? <Badge bg="success">Ref./Port.</Badge> : <Badge bg="danger">Ref./Port.</Badge>}</Col>
                        <Col sm={2} md={2} lg={2}><Button onClick={()=>{setId(i.id_beneficio)}} size="sm" variant="link"><i className="d-inline-block bi-eye"/> {`${i.beneficio}`}</Button></Col>
                        <Col sm={3} md={2} lg={1}><Typography variant="caption">{`${i.especie}`}</Typography></Col>
                        <Col className="text-nowrap" lg={1}><Typography variant="caption">{i.situacao}</Typography></Col>
                        <Col className="text-nowrap" lg={1}><Typography variant="caption">{Money(i.margem_disponivel_emprestimo)}</Typography></Col>
                        <Col className="text-nowrap" lg={2}><Typography variant="caption">{Money(i.credito_calculado)}</Typography></Col>
                        <Col className="text-nowrap" lg={2}><Typography variant="caption">{`${Money(i.margem_margem_disponivel_cartao)} / ${Money(i.margem_disponivel_cartao_beneficio)}`}</Typography></Col>
                    </Row>
                })
            }
        </>;
    }

    const reprocessarBeneficios = useMemo(()=>{
        return async(cpf_check) => {

            setLoading(true);

            await axios
                .get(
                    `${BASE_URL}/data/v1/reprocessar-beneficios/${cpf_check}`,
                    configAxios
                )
                .then((res) => {
                    setLoading(false);
                })
                // eslint-disable-next-line no-shadow
                .catch((error) => {
                    console.log(error);
                }).finally(()=>{
                    setLoading(false);
                });
        }
    });

    return (
        loading ? <Col sm={12} md={12} lg={12} xl={12} className="mb-3">
            <Card>
                <Card.Body>
                    <Spinner animation="border" variant="success"/>
                </Card.Body>
            </Card>
        </Col> : <Col sm={12} md={12} lg={12} xl={12}>
            <Card className="mb-2">
                <Card.Header>
                    <Badge
                        pill
                        bg="info"
                        className="me-1 position-absolute e-n2 t-2 z-index-1"
                    >
                        CODE {item?.code}
                    </Badge>
                    <h5>{item?.nome?.toString().toUpperCase()} simulado em <span className="text-primary"><i className="d-inline-block bi-clock"/> {dateTimeEnBr(item?.enviado_em)}</span>{item?.recorrente===1 ? <span className="badge rounded-pill bg-quaternary" style={{marginLeft:'10px'}}>Recorrente</span>:<span className="badge rounded-pill bg-dark" style={{marginLeft:'10px'}}>Acesso único</span>} <span className="badge rounded-pill bg-muted">{`Hora agora ${format(new Date(), "HH:mm:ss")}`}</span></h5>
                </Card.Header>
                <Card.Body className="py-4">
                    <Row>
                        <Col sm={12} md={12} lg={4}>
                            <Row className="g-2">
                                <Col sm={12} md={12} lg={12}><strong>Primeira consulta:</strong>{` ${dateTimeEnBr(item?.primeira_consulta)}`}</Col>
                                <Col sm={12} md={12} lg={12}><strong>CPF:</strong>{` ${item?.cpf}`}</Col>
                                <Col sm={12} md={12} lg={12}><strong>Produto:</strong> {item?.produto ? item.produto.toUpperCase() : 'Não informado'}</Col>
                                <Col sm={12} md={12} lg={12}><strong>Canal:</strong>{` ${item?.canal}`}</Col>
                                <Col sm={12} md={12} lg={12}><strong>Celular:</strong>{` ${item?.celular}`}</Col>
                                <Col sm={12} md={12} lg={12}><strong>E-mail:</strong>{` ${ item?.email ? item?.email : 'Não informado '}`}</Col>
                                <Col sm={12} md={12} lg={12}><strong>Data de nascimento:</strong>{` ${item?.data_nascimento_formatada}`} {`${item?.idade_calculada} ano(s)`}</Col>
                                <Col sm={12} md={12} lg={12}>{`IP: ${item?.ip}`}</Col>
                                <Col sm={12} md={6} lg={6}><Alert variant="info">{`Valor solicitado: ${item?.valor}`}</Alert></Col>
                                <Col sm={12} md={6} lg={6}><Alert variant={item?.categoria==='qualificado'?'success':'warning'}>{`Categoria: ${item?.categoria}`}</Alert></Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button size="sm" variant="outline-success" onClick={()=>{
                                        setModalXMLOpen(true)
                                        setCpf(item?.cpf)
                                    }}>XML da consulta</Button>
                                </Col>
                                <Col>
                                    <Button size="sm" variant="outline-info" onClick={()=>{
                                        reprocessarBeneficios(item?.cpf);
                                    }}>Reprocessar benefícios</Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={12} md={12} lg={8}>
                            <Tabs defaultActiveKey={1} id={`tab_creditos_${kLL}`}>
                                <Tab title={<TabsTitleCom qtde={beneficiosComCredito?.length}/>} eventKey={1}>
                                    {
                                        beneficiosComCredito?.length > 0 ? renderBeneficios(beneficiosComCredito) : <div className="p-3">Nenhum benefício com crédito disponível</div>
                                    }
                                </Tab>
                                <Tab title={<TabsTitleSem qtde={beneficiosSemCredito?.length}/>} eventKey={2}>
                                    {
                                        beneficiosSemCredito?.length > 0 ? renderBeneficios(beneficiosSemCredito) : <div className="p-3">Nenhum benefício sem crédito disponível</div>
                                    }
                                </Tab>
                                <Tab title={<TabsTitleOffline qtde={beneficiosOffline?.length}/>} eventKey={3}>
                                    {
                                        beneficiosOffline?.length > 0 ? renderBeneficios(beneficiosOffline) : <div className="p-3">Nenhum benefício off-line</div>
                                    }
                                </Tab>
                                <Tab title={<TabsTitleOnlineBlock qtde={beneficiosOnlineBlock?.length}/>} eventKey={4}>
                                    {
                                        beneficiosOnlineBlock?.length > 0 ? renderBeneficios(beneficiosOnlineBlock) : <div className="p-3">Nenhum benefício on-line bloqueado</div>
                                    }
                                </Tab>
                                <Tab title={<TabsTitleNaoEncontrado qtde={naoEncontrado?.length}/>} eventKey={5}>
                                    {
                                        naoEncontrado?.length > 0 ? renderNaoEncontrado(naoEncontrado) : <div className="p-3">Nenhum registro encontrado</div>
                                    }
                                </Tab>
                                <Tab title={<TabsTitleErros qtde={erros?.length}/>} eventKey={6}>
                                    {
                                        erros?.length > 0 ? renderErros(erros) : <div className="p-3">Nenhum erro encontrado</div>
                                    }
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ListLeads;
