import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Col,
    Form,
    Modal,
    Nav,
    Row,
    Tab,
    Form as BootstrapForm, FormGroup, InputGroup, FormLabel
} from 'react-bootstrap';
import axios from "axios";
import {Formik} from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import {BASE_URL} from "../../config";
import {configAxios} from "../../constants";

const LancamentoHistorico = (props) => {

    const {lead} = props;

    const validationSchema = Yup.object().shape({
        tipo_contato: Yup.string().required('Campo obrigatório'),
        descricao: Yup.string().required('Campo obrigatório'),
    });

    return (
        <Formik
            initialValues={{
                tipo_contato: '',
                descricao: '',
                data_contato: new Date(),
                hora_contato: '08:30:00',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                values.id_lead = lead.idLead;
                await axios.post(`${BASE_URL}/data/v1/historicoLead`,values,configAxios).then((response) => {
                    console.log('enviado');
                }).catch(error => {
                    alert(error);
                });
            }}
        >
            {({values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <Row className="g-1">
                        <Col sm={12} md={12} lg={6}>
                            <BootstrapForm.Group className="mb-3">
                                <BootstrapForm.Label>Forma de contato</BootstrapForm.Label>
                                <Form.Select name="tipo_contato" id="tipo_contato" onChange={handleChange} onBlur={handleBlur}>
                                    <option>Selecione</option>
                                    <option value="Telefone">Telefone</option>
                                    <option value="WhatsApp">WhatsApp</option>
                                    <option value="E-mail">E-mail</option>
                                </Form.Select>
                            </BootstrapForm.Group>
                            {errors.tipo_contato && touched.tipo_contato && <div>{errors.tipo_contato}</div>}
                        </Col>
                        <Col sm={12} md={12} lg={6}>
                            <BootstrapForm.Group className="mb-3">
                                <BootstrapForm.Label>Observações da conversa</BootstrapForm.Label>
                                <Form.Control as="textarea" rows={3} name="descricao" id="descricao" onChange={handleChange} onBlur={handleBlur} value={values.descricao}/>
                            </BootstrapForm.Group>
                            {errors.descricao && touched.descricao && <div>{errors.descricao}</div>}
                        </Col>
                        <h3>Próximo contato</h3>
                        <p>Só preencha os dados abaixo caso agendado com o cliente um próximo contato</p>
                        <Col sm={12} md={12} lg={3} xl={3}>
                            <InputGroup>
                                <FormLabel>Data contato</FormLabel>
                                <DatePicker className="form-control" name="data_contato" id="data_contato" onChange={(date) => setFieldValue('data_contato',date)} dateFormat="dd/MM/yyyy" locale={ptBR} selected={values.data_contato}/>
                            </InputGroup>
                        </Col>
                        <Col sm={12} md={12} lg={3} xl={3}>
                            <BootstrapForm.Group className="mb-3">
                                <BootstrapForm.Label>Hora contato</BootstrapForm.Label>
                                <Form.Select name="hora_contato" id="hora_contato" onChange={handleChange} onBlur={handleBlur}>
                                    <option value="08:00">08:00</option>
                                    <option value="08:30">08:30</option>
                                    <option value="09:00">09:00</option>
                                    <option value="09:30">09:30</option>
                                    <option value="10:00">10:00</option>
                                    <option value="10:30">10:30</option>
                                    <option value="11:00">11:00</option>
                                    <option value="11:30">11:30</option>
                                    <option value="12:00">12:00</option>
                                    <option value="12:30">12:30</option>
                                    <option value="13:00">13:00</option>
                                    <option value="13:30">13:30</option>
                                    <option value="14:00">14:00</option>
                                    <option value="14:30">14:30</option>
                                    <option value="15:00">15:00</option>
                                    <option value="15:30">15:30</option>
                                    <option value="16:00">16:00</option>
                                    <option value="16:30">16:30</option>
                                    <option value="17:00">17:00</option>
                                    <option value="17:30">17:30</option>
                                    <option value="18:00">18:00</option>
                                    <option value="18:30">18:30</option>
                                    <option value="19:00">19:00</option>
                                    <option value="19:30">19:30</option>
                                </Form.Select>
                            </BootstrapForm.Group>
                        </Col>
                        <Col sm={12} md={12} lg={12}>
                            <Button type="submit">{isSubmitting ? 'Enviando...':'Salvar'}</Button>
                        </Col>
                    </Row>
                </form>
            )}
        </Formik>
    );
};

export default LancamentoHistorico;
