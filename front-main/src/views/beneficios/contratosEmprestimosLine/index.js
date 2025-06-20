import React from 'react';
import {Card, Col, Row, Badge, ListGroup, Button, Modal} from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import Blink from 'react-blink-text';
import axios from "axios";
import currencyFormatter, {dateEnBr} from "../../../utils";
import {configAxios} from "../../../constants";
import {BASE_URL} from "../../../config";
import PortabilidadeCard from "../../../components/portabilidade-card";

const ContratosEmprestimosLine = (props) => {

    const {historicoInssContrato} = props;
    const [historico, setHistorico] = React.useState([]);
    const [portabilidade, setPortabilidade] = React.useState([]);
    const [refinanciamento, setRefinanciamento] = React.useState([]);
    const [showModal, setModalShow] = React.useState(false);

    const handleFinanciamento = async (contratoId) => {

        await axios.get(`${BASE_URL}/data/v1/portabilidade/simulacao/Portabilidade/${contratoId}`, configAxios)
            .then((response)=>{
                setHistorico(response.data.historico);
                setPortabilidade(response.data.portabilidade);
                setRefinanciamento(response.data.refinanciamento);
            })
            .finally(()=>{
                setModalShow(true);
            });
    }

    return (
        <div>
            <Modal
                className="modal-right large"
                show={showModal}
                onHide={() => setModalShow(false)}
            >
                <Modal.Header>
                    <Modal.Title>
                        <Row>
                            <Col>Simulações</Col>
                            <Col><Button onClick={()=>{setModalShow(false)}} size="sm" variant="outline-primary">Fechar</Button></Col>
                        </Row>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Row>
                                <Col>Portabilidade <Badge>{portabilidade?.length}</Badge></Col>
                            </Row>
                            <Row>
                                <Col>
                                    {portabilidade?.length > 0 ? portabilidade.map((i,k)=>{
                                        return (<PortabilidadeCard key={k} item={i}/>)
                                    })  :'Nenhum opção de portabilidade-card'}
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>Refinanciamento <Badge>{refinanciamento?.length}</Badge></Col>
                            </Row>
                            <Row>
                                <Col>
                                    {refinanciamento?.length > 0 ? refinanciamento.map((i,k)=>{
                                        return (<PortabilidadeCard key={k} item={i}/>)
                                    })  :'Nenhum opção de portabilidade-card'}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            <Row className="g-2">
                <Col lg="12" xxl="12">
                    <ListGroup>
                        <ListGroup.Item key={0}>
                            <Row>
                                <Col>Banco</Col>
                                <Col>Competência</Col>
                                <Col>Contrato</Col>
                                <Col>Data início</Col>
                                <Col>Parcelas/[Abertas]</Col>
                                <Col>Valor parcela</Col>
                                <Col>Valor emprestado</Col>
                                <Col>Saldo quitação</Col>
                                <Col>Taxa</Col>
                                <Col>Atualizado em</Col>
                                <Col>Funções</Col>
                            </Row>
                        </ListGroup.Item>
                        {
                            typeof historicoInssContrato === "object" ?
                                historicoInssContrato.map((i,k) => {
                                    return (<ListGroup.Item key={k}>
                                        <Row>
                                            <Col>{i.banco_nome}</Col>
                                            <Col>{`${i.competencia_inicio_desconto} até`}<br/>{i.competencia_fim_desconto}</Col>
                                            <Col>{i.contrato}</Col>
                                            <Col>{dateEnBr(i.data_inicio_contrato)}</Col>
                                            <Col>{i.quantidade_parcelas} [{i.quantidade_parcelas_emaberto}]</Col>
                                            <Col>{currencyFormatter(i.valor_parcela)}</Col>
                                            <Col>{currencyFormatter(i.valor_emprestado)}</Col>
                                            <Col>{currencyFormatter(i.saldo_quitacao)}</Col>
                                            <Col>{i.taxa}</Col>
                                            <Col>{i.updated_at}</Col>
                                            <Col><Button onClick={()=>{handleFinanciamento(i.id)}}><CsLineIcons icon="wallet"/></Button></Col>
                                        </Row>
                                    </ListGroup.Item>)
                                }) : 'Nenhum contrato'
                        }
                    </ListGroup>
                </Col>
            </Row>
        </div>
    );
};

export default ContratosEmprestimosLine;
