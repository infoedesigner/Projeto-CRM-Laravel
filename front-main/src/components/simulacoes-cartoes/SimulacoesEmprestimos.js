import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from "react";
import axios from "axios";
import {Accordion, Button, Col, Form, FormControl, FormGroup, FormLabel, Row, Spinner} from "react-bootstrap";
import swal from "@sweetalert/with-react";
import {BASE_URL} from "../../config";
import {configAxios} from "../../constants";
import ListSimulacoes from "../list-simulacoes";

const SimulacoesEmprestimos = forwardRef((props, ref) => {

    const { id_beneficio, hoje, historicoInssMargem } = props;

    const [simulacoes, setSimulacoes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [simulaTabelaId, setSimulaTabelaId] = useState(0);
    const [valorSimulado, setValorSimulado] = useState(0.00);
    const [valorSimuladoParcela, setValorSimuladoParcela] = useState(0.00);

    const handleValorEmprestimo = async () => {

        if(valorSimulado < 700.00){
            swal('Valor incorreto', 'Informe um valor maior ou igual a 700,00', 'error');
        }else {

            setIsLoading(true);
            await axios
                .get(`${BASE_URL}/data/v1/simulacoes/${id_beneficio}/${hoje.format('YYYY-MM-DD')}/${valorSimulado}`, configAxios)
                .then((res) => {
                    setSimulacoes(res.data.simulacoes);
                })
                .then(() => {
                    setIsLoading(false);
                })
                .catch((error_axios) => {
                    swal('ERRO', `${error_axios}`, 'error');
                });

        }
    }

    const handleValorParcela = async () => {
        setIsLoading(true);
        await axios
            .get(`${BASE_URL}/data/v1/simulacoes/${id_beneficio}/${hoje.format('YYYY-MM-DD')}/0.00/${valorSimuladoParcela}`, configAxios)
            .then((res) => {
                setSimulacoes(res.data.simulacoes);
            })
            .then(()=>{
                setIsLoading(false);
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    }

    const handleValorTotal = async (valor) => {
        setValorSimuladoParcela(valor);
        setIsLoading(true);
        await axios
            .get(`${BASE_URL}/data/v1/simulacoes/${id_beneficio}/${hoje.format('YYYY-MM-DD')}/0.00/${valor}`, configAxios)
            .then((res) => {
                setSimulacoes(res.data.simulacoes);
            })
            .then(()=>{
                setIsLoading(false);
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    }

    useEffect(()=>{
        setValorSimuladoParcela(historicoInssMargem?.margem_disponivel_emprestimo || 0.00);
        setIsLoading(false);
    },[historicoInssMargem]);


    return (
        isLoading ? <Spinner variant="primary" animation="border" size="20"/> : <>
            <Row>
                <Col sm={3} md={3} lg={2}>
                    <FormLabel>Valor total margem</FormLabel>
                    <FormControl type="text" onChange={(e)=>{setValorSimulado(e.target.value)}} value={valorSimulado}/>
                </Col>
                <Col sm={3} md={3} lg={2}>
                    <FormLabel>Valor parcela desejada</FormLabel>
                    <FormControl type="text" onChange={(e)=>{setValorSimuladoParcela(e.target.value)}} value={valorSimuladoParcela}/>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col sm={3} md={3} lg={2}>
                    <Button onClick={()=>{handleValorEmprestimo()}}>
                        Simular valor empréstimo
                    </Button>
                </Col>
                <Col sm={3} md={3} lg={2}>
                    <Button onClick={()=>{handleValorParcela()}}>
                        Simular valor parcela
                    </Button>
                </Col>
                <Col sm={3} md={3} lg={2}>
                    <Button onClick={()=>{handleValorTotal(historicoInssMargem?.margem_disponivel_emprestimo)}}>
                        Simular valor total
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Accordion defaultActiveKey="1" flush>
                        {
                            simulacoes.length > 0 ? simulacoes.map((i,k)=>{
                                return (
                                    <Accordion.Item eventKey={k} key={k}>
                                        <Accordion.Header as="div"><h5><strong>{i.label} [{i.id_tabela}]</strong></h5></Accordion.Header>
                                        <Accordion.Body>
                                            <Row>
                                                {
                                                    i.coeficientes.length > 0 ? i.coeficientes.map((isub,ksub) => {
                                                        return <ListSimulacoes item={isub} key={ksub} setSimulaTabelaId={setSimulaTabelaId} id_beneficio={id_beneficio} itemparent={i}/>;
                                                    }) : <Col>Nenhum coeficiente para essa tabela.</Col>
                                                }
                                            </Row>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                );
                            }) : <Col className="mt-2">Nenhuma simulação para esse benefício.</Col>
                        }
                    </Accordion>
                </Col>
            </Row>
        </>
    );
});

export default SimulacoesEmprestimos;
