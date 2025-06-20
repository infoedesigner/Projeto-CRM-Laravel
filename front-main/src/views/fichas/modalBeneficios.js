import React, { useEffect, useState } from 'react';
import {
    Badge,
    Button,
    ButtonGroup,
    Card,
    Col,
    Form,
    ListGroup,
    Modal,
    Row,
} from 'react-bootstrap';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from 'components/dropzone/DropzonePreview';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { dateEnBr } from '../../utils';

const ModalBeneficios = (props) => {
    const { mBeneficios, setMBeneficios, itemModal } = props;
    const [startDate, setStartDate] = useState();
    registerLocale('ptBR', ptBR);

    useEffect(() => {
        setStartDate(new Date(itemModal.data_nascimento));
        console.log(itemModal.data);
    }, [itemModal]);

    return (
        <>
            <Modal
                className="modal-right large"
                show={mBeneficios}
                onHide={() => setMBeneficios(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Benefícios do CPF{' '}
                        <Badge pill bg="secondary">
                            {itemModal?.data?.length}
                        </Badge>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card body className="mb-5">
                        {itemModal?.data?.length <= 0 ? (
                            'Nenhum benefício encontrado'
                        ) : (
                            <ListGroup>
                                <ListGroup.Item
                                    className="align-items-center"
                                    key={0}
                                >
                                    <Row>
                                        <Col sm={12} md={3} lg={3}>
                                            Benefício
                                        </Col>
                                        <Col sm={12} md={3} lg={3}>
                                            <span className="text-muted">
                                                DIB¹
                                            </span>
                                        </Col>
                                        <Col sm={12} md={6} lg={6}>
                                            Funções
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {itemModal?.data?.map((item, index) => {
                                    return (
                                        <ListGroup.Item
                                            className="align-items-center"
                                            key={item.id}
                                        >
                                            <Row>
                                                <Col sm={12} md={3} lg={3}>
                                                    {item.beneficio}
                                                </Col>
                                                <Col sm={12} md={3} lg={3}>
                                                    {dateEnBr(item.dib)}
                                                </Col>
                                                <Col sm={12} md={6} lg={6}>
                                                    <ButtonGroup aria-label="Basic outlined example">
                                                        <Button variant="outline-primary">
                                                            Enviar contrato
                                                        </Button>
                                                        <Button variant="outline-primary">
                                                            Re-consultar
                                                        </Button>
                                                    </ButtonGroup>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                        )}
                    </Card>
                    <Row>
                        <Col>¹DIB - Data do início do benefício</Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setMBeneficios(false)}
                    >
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalBeneficios;
