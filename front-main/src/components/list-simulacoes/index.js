import {Badge, Button, ButtonGroup, Card, Col, Row} from 'react-bootstrap';
import React, {useEffect, useState} from "react";
import {Divider} from "@mui/material";
// eslint-disable-next-line import/no-named-as-default
import Swal from "sweetalert2";
import axios from "axios";
import currencyFormatter from "../../utils";
import {BASE_URL} from "../../config";
import {configAxios, configAxiosPost} from "../../constants";

const ListSimulacoes = (props) => {

    const {item,id_beneficio,itemparent} = props;

    console.log(item);

    const applySimulacao = (qtde_parcelas,valor_margem,valor_parcela,credito,id_coeficiente,coeficiente,data_coeficiente) =>{

        Swal.fire({
            title: 'Envio de simulação para digitação',
            text: `Deseja enviar a simulação com ${qtde_parcelas} parcelas de ${currencyFormatter(valor_parcela)} cada?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#37a507',
            cancelButtonColor: '#ff4040',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
        }).then(async (result) => {
            if (result.isConfirmed) {

                await axios.post(`${BASE_URL}/data/v1/esteiraPropostas`, {
                    id_beneficio,
                    qtde_parcelas,
                    valor_margem,
                    valor_parcela,
                    id_tabela:item.id_tabela,
                    id_banco:itemparent.id_banco,
                    id_coeficiente,
                    coeficiente,
                    credito,
                    valor_comissao:item.comissao,
                    data_coeficiente
                },configAxiosPost)
                    .then((response) => {

                    });

                Swal.fire(
                    'Ótimo!',
                    'Proposta enviada para esteira com sucesso!',
                    'success'
                )
            }
        })

    }

    return (
        <Col sm={12} md={12} lg={4} xl={4} className="mb-2">
            <Card>
                <Card.Body>
                    {
                        item.coeficiente <= 0 ? 'Coeficientes não cadastrados para tabela.' : <Row>
                            <Col sm={12} md={12} lg={12}>
                                <span role="img" aria-label="donut">🧾</span>
                                Coeficiente {item.coeficiente}
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <span role="img" aria-label="donut">💸</span>
                                Prazo {item.qtde_parcela}
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <strong>
                                    <span role="img" aria-label="donut">💰</span>
                                    <span className="text-black-50">Valor total a pagar {currencyFormatter(item.valor_total_pagar)} <span className="text-small">[{item.perc_juros_total}%]</span></span>
                                </strong>
                            </Col>
                            {/*<Col sm={12} md={12} lg={12}>*/}
                            {/*    <strong>*/}
                            {/*        <span role="img" aria-label="donut">💰</span>*/}
                            {/*        <span className="text-warning">Comissão {currencyFormatter(item.comissao)}</span>*/}
                            {/*    </strong>*/}
                            {/*</Col>*/}
                            <Col sm={12} md={12} lg={12}>
                                <strong>
                                    <span role="img" aria-label="donut">💰</span>
                                    Valor parcela {currencyFormatter(item.valor_parcela)}
                                </strong>
                            </Col>
                            <Col sm={12} md={12} lg={12} className="p-1 rounded-3 mt-2 mb-2" style={{backgroundColor:'#baffbc'}}>
                                <strong>
                                    <span className="text-large"><strong><span role="img" aria-label="donut">💰</span>Crédito {currencyFormatter(item.margem_total_disponivel)}</strong></span>
                                </strong>
                            </Col>
                            <Col sm={12} md={12} lg={4}>
                                <Button onClick={()=>{
                                    applySimulacao(
                                        item.qtde_parcela,
                                        item.valor_margem,
                                        item.valor_parcela,
                                        item.margem_total_disponivel,
                                        item.id_coeficiente,
                                        item.coeficiente,
                                        item.data
                                    );
                                }}>Aplicar</Button>
                            </Col>
                        </Row>
                    }
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ListSimulacoes;
