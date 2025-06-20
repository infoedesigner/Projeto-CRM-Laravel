import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from 'components/dropzone/DropzonePreview';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';

const ModalFichaCadastral = (props) => {
    const { mFichaCadastral, setMFichaCadastral, itemModal } = props;
    const [startDate, setStartDate] = useState();
    registerLocale('ptBR', ptBR);

    useEffect(() => {
        setStartDate(new Date(itemModal.data_nascimento));
    }, [itemModal]);

    const onChangeStatus = (fileWithMeta, status) => {
        console.log(fileWithMeta);
        console.log(status);
    };

    return (
        <>
            <Modal
                className="modal-right large"
                show={mFichaCadastral}
                onHide={() => setMFichaCadastral(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ficha cadastral</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Dados cadastrais</h4>
                    <Row className="g-3 mb-7">
                        <Col lg="6">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={itemModal?.nome}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>NOME</Form.Label>
                            </div>
                        </Col>
                        <Col lg="6">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={itemModal?.cpf}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>CPF</Form.Label>
                            </div>
                        </Col>
                        <Col lg="4">
                            <div className="top-label">
                                <DatePicker
                                    className="form-control"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                />
                                <Form.Label>DATA DE NASCIMENTO</Form.Label>
                            </div>
                        </Col>
                        <Col lg="8">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={itemModal?.logradouro}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>LOGRADOURO</Form.Label>
                            </div>
                        </Col>
                        <Col lg="3">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={itemModal?.numero}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>NÚMERO</Form.Label>
                            </div>
                        </Col>
                        <Col lg="9">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={itemModal?.complemento}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>COMPLEMENTO</Form.Label>
                            </div>
                        </Col>
                        <Col lg="4">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={itemModal?.bairro}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>BAIRRO</Form.Label>
                            </div>
                        </Col>
                        <Col lg="4">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={itemModal?.cidade}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>CIDADE</Form.Label>
                            </div>
                        </Col>
                        <Col lg="4">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={itemModal?.cep}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>CEP</Form.Label>
                            </div>
                        </Col>
                        <Col lg="4">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={itemModal?.estado}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>ESTADO</Form.Label>
                            </div>
                        </Col>
                        <Col lg="4">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={
                                        itemModal?.genero === 1
                                            ? 'Masculino'
                                            : 'Feminino'
                                    }
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>GÊNERO</Form.Label>
                            </div>
                        </Col>
                    </Row>
                    <h4>Dados complementares</h4>
                    <Row className="g-3 mb-7">
                        <Col lg={4}>
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={itemModal.telefone}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>TELEFONE</Form.Label>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={itemModal.email}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>E-MAIL</Form.Label>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={itemModal.email}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>NOME DO PAI</Form.Label>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    value={itemModal.email}
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                                <Form.Label>NOME DO MÃE</Form.Label>
                            </div>
                        </Col>
                        <Col sm={12} md={12} lg={12} xl={12}>
                            <Dropzone
                                PreviewComponent={DropzonePreview}
                                submitButtonContent={null}
                                accept="text/*"
                                submitButtonDisabled
                                SubmitButtonComponent={null}
                                inputWithFilesContent={null}
                                onChangeStatus={onChangeStatus}
                                classNames={{
                                    inputLabelWithFiles:
                                    defaultClassNames.inputLabel,
                                }}
                                inputContent="Arraste ou clique aqui, para anexar arquivos ao processo"
                            />
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col>
                            <Row className="align-items-center">
                                <Col xs="6">
                                    <div className="d-flex align-items-center">
                                        <div className="d-inline-block">
                                            <Button
                                                variant="link"
                                                className="lh-1 d-inline-block p-0"
                                            >
                                                Usuário
                                            </Button>
                                            <div className="text-muted text-small">
                                                Supervisor
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs="6">
                                    <Row className="g-0 justify-content-end">
                                        <Col xs="auto" className="pe-3">
                                            <CsLineIcons
                                                icon="eye"
                                                width="15"
                                                height="15"
                                                className="cs-icon icon text-primary me-1"
                                            />
                                            <span className="align-middle">
                                                221
                                            </span>
                                        </Col>
                                        <Col xs="auto">
                                            <CsLineIcons
                                                icon="message"
                                                width="15"
                                                height="15"
                                                className="cs-icon icon text-primary me-1"
                                            />
                                            <span className="align-middle">
                                                17
                                            </span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setMFichaCadastral(false)}
                    >
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalFichaCadastral;
