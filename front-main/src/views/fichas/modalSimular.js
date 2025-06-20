import React, { useEffect, useState } from 'react';
import {Button, Card, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row} from 'react-bootstrap';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from 'components/dropzone/DropzonePreview';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import SelectTabelas from "../../components/select-tabelas";

const ModalSimular = (props) => {
    registerLocale('ptBR', ptBR);

    const {modalSimular, setModalSimular, idEsteira} = props;

    const [tabela, setTabela] = useState([{value:0,label:'Selecione'}]);
    const [prazo, setPrazo] = useState(84);
    const [dataSimulacao, setDataSimulacao] = useState(new Date());

    const GET_DATA = (id) => {
        console.log(id);
    }

    useEffect(() => {
        GET_DATA(idEsteira);
    },[idEsteira]);

    return (
        <>
            <Modal
                className="modal-right large"
                show={modalSimular}
                onHide={() => setModalSimular(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Simular</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="g-3">
                        <Col sm={12} md={12} lg={6} xl={6}>
                            <FormGroup>
                                <FormLabel>Tabela</FormLabel>
                                <SelectTabelas onChangeValue={(e)=>{
                                    setTabela(e);
                                }} valor={tabela.value} texto={tabela.label}/>
                            </FormGroup>
                        </Col>
                        <Col sm={12} md={12} lg={4} xl={4}>
                            <FormGroup>
                                <FormLabel>Margem disponível</FormLabel>
                                <FormControl
                                    placeholder="0.00"
                                    onChange={(e) => {
                                        setPrazo(e.target.value);
                                    }}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={12} md={12} lg={4} xl={4}>
                            <FormGroup>
                                <FormLabel>Prazo</FormLabel>
                                <FormControl
                                    placeholder="84"
                                    onChange={(e) => {
                                        setPrazo(e.target.value);
                                    }}
                                />
                            </FormGroup>
                        </Col>
                        <Col className="mt-3 mb-5" sm={12} md={3} lg={3} xl={3}>
                            <InputGroup>
                                <FormLabel>Data simulação</FormLabel>
                                <DatePicker className="form-control" selected={dataSimulacao} onChange={(date) => setDataSimulacao(date)} dateFormat="dd/MM/yyyy" locale={ptBR}/>
                            </InputGroup>
                        </Col>
                        <Col sm={12} md={12} lg={12} xl={12}>
                            <Button>Simular</Button>
                        </Col>
                    </Row>
                    <Row className="mt-7">
                        <Col sm={12} md={12} lg={12} xl={12}>
                            <Button variant="success">Salvar simulação</Button>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setModalSimular(false)}
                    >
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalSimular;
