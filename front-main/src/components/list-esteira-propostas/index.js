import React from 'react';
import {
    Badge,
    Button,
    ButtonGroup,
    Card,
    Col,
    Dropdown,
    Row,
} from 'react-bootstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import {
    coreMarkersTextNumber, DateTimeEnToBr,
    Money,
    statusEsteiraProposta,
    tipoIconRegra,
} from '../../utils';

const ListEsteiraProposta = (props) => {
    const { item, setIdBeneficio, showModalFichaCadastral, showBeneficios, setModalOpen, setIdEsteira } = props;

    return (
        <Card className="mb-2">
            <Card.Header className="pt-3 pb-3">
                <Row>
                    <Col sm={8} md={8} lg={8}>
                        <Row>
                            <Col>
                                <strong>
                                    <span role="img" aria-label="donut">
                                        🤞🏼
                                    </span>
                                    {item.nome}
                                </strong>
                            </Col>
                            <Col>
                                <strong>CPF:</strong> {item.cpf}
                            </Col>
                            <Col>
                                <CsLineIcons
                                    icon="calendar"
                                    className="mb-1 d-inline-block "
                                />
                                <span> {DateTimeEnToBr(item.created_at)}</span>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Badge
                            bg="success"
                            className="me-1 position-absolute e-2 t-n2 z-index-1"
                        >
                            {statusEsteiraProposta(item.status)}
                        </Badge>
                    </Col>
                    <Col>
                        <CsLineIcons
                            icon="content"
                            className="mb-1 d-inline-block"
                        />
                        <span> {item.n_contrato}</span>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col sm={10} md={10} lg={10} xl={10} xs={10} xxl={10}>
                        <Row>
                            <Col>
                                <strong>Banco</strong>
                            </Col>
                            <Col>
                                <strong>Produto</strong>
                            </Col>
                            <Col>
                                <strong>Valor solicitado</strong>
                            </Col>
                            <Col>
                                <strong>Valor liberado</strong>
                            </Col>
                            <Col>
                                <strong>Coeficiente</strong>
                            </Col>
                            <Col>
                                <strong>Prazo</strong>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <CsLineIcons
                                    icon="money"
                                    className="mb-1 d-inline-block"
                                />
                                <span> {item.banco_nome}</span>
                            </Col>
                            <Col>
                                <CsLineIcons
                                    icon="shipping"
                                    className="mb-1 d-inline-block"
                                />
                                <span> {item.produto_simulado.toUpperCase()}</span>
                            </Col>
                            <Col>
                                <CsLineIcons
                                    icon="dollar"
                                    className="mb-1 d-inline-block"
                                />
                                <span> {Money(item.valor_solicitado)}</span>
                            </Col>
                            <Col>
                                <CsLineIcons
                                    icon="dollar"
                                    className="mb-1 d-inline-block"
                                />
                                <span> {Money(item.valor_liberado)}</span>
                            </Col>
                            <Col>
                                <CsLineIcons
                                    icon="dollar"
                                    className="mb-1 d-inline-block"
                                />
                                <span> {item.coeficiente}</span>
                            </Col>
                            <Col>
                                <CsLineIcons
                                    icon="dollar"
                                    className="mb-1 d-inline-block"
                                />
                                <span> {item.parcelas}</span>
                            </Col>
                        </Row>
                    </Col>

                    <Col>
                        <Dropdown
                            as={ButtonGroup}
                            className="me-1"
                            id="parentElement"
                        >
                            <Button
                                variant="success"
                                onClick={() => {
                                    setIdBeneficio(item.id_beneficio);
                                    setIdEsteira(item.id);
                                    setModalOpen(true);
                                }}
                            >
                                Dados pedido
                            </Button>
                            <Dropdown.Toggle split variant="primary" />
                            <Dropdown.Menu
                                popperConfig={{
                                    modifiers: [
                                        {
                                            name: 'preventOverflow',
                                            options: {
                                                boundary:
                                                    document.querySelector(
                                                        '#parentElement'
                                                    ),
                                            },
                                        },
                                    ],
                                }}
                            >
                                <Dropdown.Item
                                    onClick={() => {
                                        showModalFichaCadastral(item.id);
                                    }}
                                >
                                    Ficha cadastral
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        showBeneficios(item.cpf);
                                    }}
                                >
                                    Benefício
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Card.Body>
            <Card.Footer className="pt-3 pb-3">
                <Row className="p-0">
                    <Col>
                        <CsLineIcons
                            icon="calendar"
                            className="mb-1 d-inline-block"
                        />
                        <span>
                            <strong> Última atualização</strong>{' '}
                            {DateTimeEnToBr(item.updated_at)}
                        </span>
                    </Col>
                    <Col>
                        <CsLineIcons
                            icon="user"
                            className="mb-1 d-inline-block"
                        />
                        <span>
                            <strong>Colaborador</strong> {item.colaborador}
                        </span>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
};

export default ListEsteiraProposta;
