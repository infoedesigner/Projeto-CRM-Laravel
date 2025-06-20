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

const ListEsteiraPropostaPedidos = (props) => {
    const { item, aprove, recursar, setModalSimular, showBeneficios, showModalFichaCadastral, setIdEsteira } = props;

    return (
        <Card className="mb-2">
            <Card.Header className="pt-3 pb-3">
                <Row>
                    <Col sm={10} md={10} lg={10}>
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
                                <strong>Benefício:</strong> {item.beneficio}
                            </Col>
                            <Col>
                                <strong>Idade:</strong> {item.idade}
                            </Col>
                            <Col>
                                <strong>Celular:</strong> {item.celular}
                            </Col>
                            <Col>
                                <strong>E-mail:</strong> {item.email}
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
                </Row>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col sm={10} md={10} lg={10} xl={10} xs={10} xxl={10}>
                        <Row>
                            <Col>
                                <strong>Data</strong>
                            </Col>
                            <Col>
                                <strong>Produto</strong>
                            </Col>
                            <Col>
                                <strong>Limite de crédito</strong>
                            </Col>
                            <Col>
                                <strong>Valor desejado</strong>
                            </Col>
                            <Col>
                                <strong>Margem disponível</strong>
                            </Col>
                            <Col>
                                <strong>Prazo</strong>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <CsLineIcons
                                    icon="calendar"
                                    className="mb-1 d-inline-block "
                                />
                                <span> {DateTimeEnToBr(item.created_at)}</span>
                            </Col>
                            <Col>
                                <CsLineIcons
                                    icon="shipping"
                                    className="mb-1 d-inline-block"
                                />
                                <span> {item.produto}</span>
                            </Col>
                            <Col>
                                <CsLineIcons
                                    icon="dollar"
                                    className="mb-1 d-inline-block"
                                />
                                <span> {Money(item.valor)}</span>
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
                                <span> {Money(item.margem_disponivel)}</span>
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
                                    aprove(item.id);
                                }}
                            >
                                Aprovar
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
                                        setIdEsteira(item.id);
                                        setModalSimular(true);
                                    }}
                                >
                                    Simular
                                </Dropdown.Item>
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
                                <Dropdown.Item href="#/action-2"
                                               onClick={() => {
                                                   recursar(item.id);
                                               }}>
                                    Recusado
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
                            <strong>Espécie</strong> {`${item.descricao_especie}[${item.especie}]`}
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

export default ListEsteiraPropostaPedidos;
