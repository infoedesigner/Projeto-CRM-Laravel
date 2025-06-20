import React, { useState } from 'react';
import { Badge, Button, Card, Col, Modal, Row } from 'react-bootstrap';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import ListSubBeneficios from './list-sub';
import { dateEnBr } from '../../utils';
import { NewEsteiraForm } from '../../views/create/esteira';

const ListBeneficiosTable = (props) => {
    const { item } = props;
    const [modalEsteiraManual, setModalEsteiraManual] = useState(false);

    return (
        <>
            <Modal
                backdrop="static"
                className="modal-right large"
                show={modalEsteiraManual}
                onHide={() => setModalEsteiraManual(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cadastro manual de empréstimo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewEsteiraForm setAddModal={setModalEsteiraManual} />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setModalEsteiraManual(false)}
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
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
                            </Row>
                        </Col>
                        <Col>
                            <Badge
                                bg="success"
                                className="me-1 position-absolute e-2 t-n2 z-index-1"
                            >
                                {item.api_name}
                            </Badge>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col sm={10} md={10} lg={10} xl={10} xs={10} xxl={10}>
                            <Row>
                                <Col>
                                    <strong>Data aniversário</strong>
                                </Col>
                                <Col>
                                    <strong>Descrição</strong>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <CsLineIcons
                                        icon="birthday"
                                        className="mb-1 d-inline-block "
                                    />
                                    <span>
                                        {' '}
                                        {dateEnBr(item.data_nascimento)}
                                    </span>
                                </Col>
                                <Col>
                                    {' '}
                                    <CsLineIcons
                                        icon="bookmark"
                                        className="d-inline-block "
                                    />
                                    <span>
                                        {' '}
                                        {item.descricao_especie}[{item.especie}]
                                    </span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <ListSubBeneficios
                        id={item.id}
                        setModalEsteiraManual={setModalEsteiraManual}
                    />
                </Card.Body>
                <Card.Footer className="pt-3 pb-3">
                    <Row className="p-0">
                        <Col>
                            <CsLineIcons
                                icon="calendar"
                                className="mb-1 d-inline-block"
                            />
                            <span>
                                <strong>Última atualização</strong>{' '}
                                {item.updated_at}
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
        </>
    );
};

export default ListBeneficiosTable;
