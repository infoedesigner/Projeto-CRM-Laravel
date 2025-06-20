import React, {useEffect, useState} from "react";
import axios from "axios";
import {Accordion, Badge, Card, Col, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import {Chip, Divider} from "@mui/material";
import {BASE_URL} from "../../config";
import {configAxios} from "../../constants";
import {NewClienteForm} from "../../views/create/cliente";
import ListSimulacoes from "../list-simulacoes";
import currencyFormatter from "../../utils";
import MotivoBlock from "../motivo";

const Portabilidades = (props) => {

    const { id_beneficio, cpf } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [renegociacoes, setRenegociacoes] = useState([]);
    const [valor, setValor] = useState(10000);

    useEffect(async () => {
        await axios.get(`${BASE_URL}/data/v1/contratos/${id_beneficio}/Portabilidade`, configAxios)
            .then((response) => {
                setRenegociacoes(response.data);
            }).catch(error => {
                console.log(error);
            }).finally(()=>{
                setIsLoading(false);
            });
    },[id_beneficio]);

    return (
        isLoading ? <Spinner variant="primary" animation="border" size="20"/> : <>
            <Accordion defaultActiveKey="1" flush>
                {
                    renegociacoes.length > 0 ? renegociacoes.map((i,k)=>{
                        return (<Accordion.Item eventKey={k} key={k}>
                            <Accordion.Header as="div">
                                <h5><strong>{i.banco_nome} {`{${i.contrato}}`}</strong> <Badge bg={i.qtdeVerde > 0 ? 'success' : 'danger'}>{i.tipo_emprestimo_descricao}</Badge></h5>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Divider className="mt-3 mb-3"><Chip label="Dados do contrato" /></Divider>
                                <Row>
                                    <Col><strong>Banco:</strong> {i.banco_nome}</Col>
                                    <Col><strong>Parcela:</strong> {i.valor_parcela}</Col>
                                    <Col><strong>Taxa atual:</strong> {i.taxa}</Col>
                                    <Col><strong>Parcelas totais / em aberto:</strong> {`${i.quantidade_parcelas} / ${i.quantidade_parcelas_emaberto}`}</Col>
                                </Row>
                                <Divider className="mt-3 mb-3"><Chip label="Simulações disponíveis" /></Divider>
                                {
                                    i.tabelas?.length >= 1 && i.tabelas.map((tabelas,tabela_key) => {
                                        return (tabelas.simulacao?.coeficiente > 0 && <Row key={tabela_key}>
                                            <Col>
                                                <Row>
                                                    <Col><h5><strong>{tabelas.simulacao?.label}</strong></h5></Col>
                                                </Row>
                                                <Row>
                                                    <Col><strong>Novo coeficiente:</strong> {tabelas.simulacao?.coeficiente}</Col>
                                                    <Col><strong>Prazo:</strong> {tabelas.simulacao?.prazo}</Col>
                                                    <Col><strong>Saldo atual:</strong> {currencyFormatter(i.saldo_quitacao)}</Col>
                                                    <Col><strong>Valor total:</strong> {currencyFormatter(tabelas.simulacao?.valor_total)}</Col>
                                                    <Col><strong>Troco:</strong> {currencyFormatter(tabelas.simulacao?.troco)}</Col>
                                                </Row>
                                            </Col>
                                        </Row>);
                                    })
                                }
                                <Divider className="mt-3 mb-3"><Chip label="Motivos" /></Divider>
                                {
                                    i.tabelas?.length > 0 && i.tabelas.map((tabela,index_tabela)  => {
                                        return <Row key={index_tabela}>
                                            <Col>
                                                <MotivoBlock tabela={tabela}/>
                                            </Col>
                                        </Row>
                                    })
                                }
                            </Accordion.Body>
                        </Accordion.Item>)
                    }) : <Accordion.Item eventKey="1">Nenhum coeficiente para as regras.</Accordion.Item>
                }
            </Accordion>
        </>
    );
}

export default Portabilidades;
