import React, {useEffect, useState} from "react";
import axios from "axios";
import {Accordion, Badge, Card, CardBody, CardHeader, Col, Row, Spinner} from "react-bootstrap";
import {BASE_URL} from "../../config";
import {configAxios} from "../../constants";
import currencyBR from "../currencyBR";
import currencyFormatter from "../../utils";

const SimulacoesCartoes = (props) => {
    const { id_beneficio, cpf } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [simulacoes, setSimulacoes] = useState([]);
    const [valor, setValor] = useState(10000);

    useEffect(async () => {
        await axios.get(`${BASE_URL}/data/v1/cartoes/simulacoes/${id_beneficio}/${cpf}/${valor}`, configAxios)
            .then((response) => {
                setSimulacoes(response.data.simulacoes);
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
                    simulacoes.length > 0 ? simulacoes?.map((i,k)=>{
                        return (<Accordion.Item eventKey={k} key={k}>
                            <Accordion.Header as="div"><h5><strong>{i.label}</strong></h5></Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    <Col sm={12} md={12} lg={12}><h4>Fator: {i.fator}</h4></Col>
                                </Row>
                                <Row>
                                    <Col sm={12} md={6} lg={6}>
                                        <Card>
                                            <CardHeader>
                                                Margem disponível cartão
                                            </CardHeader>
                                            <CardBody>
                                                <Row>
                                                    <Col sm={12} md={12} lg={12}><span role="img" aria-label="donut">💰</span> Disponível cartão: <strong>{currencyFormatter(i.margem_margem_disponivel_cartao)}</strong></Col>
                                                    <Col sm={12} md={12} lg={12}><span role="img" aria-label="donut">💸</span> Limite de saque: <strong>{currencyFormatter(i.margem_margem_disponivel_cartao*0.7)}</strong></Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <CardHeader>
                                                Margem disponível cartão benefício
                                            </CardHeader>
                                            <CardBody>
                                                <Row>
                                                    <Col sm={12} md={12} lg={12}><span role="img" aria-label="donut">💰</span> Disponível cartão benefício: <strong>{currencyFormatter(i.margem_disponivel_cartao_beneficio)}</strong></Col>
                                                    <Col sm={12} md={12} lg={12}><span role="img" aria-label="donut">💸</span> Limite de saque: <strong>{currencyFormatter(i.margem_disponivel_cartao_beneficio*0.7)}</strong></Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>)
                    }) : <Accordion.Item eventKey="1">Nenhum fator para as regras.</Accordion.Item>
                }
            </Accordion>
        </>
    );
}

export default SimulacoesCartoes;
