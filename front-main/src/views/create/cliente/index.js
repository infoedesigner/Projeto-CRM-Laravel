import React, {useEffect, useState} from 'react';
import { useFormik } from 'formik';
import {Alert, Button, Col, Form, FormControl, InputGroup, Row} from 'react-bootstrap';
import * as yup from 'yup';
import NumberFormat from "react-number-format";
import DatePicker from "react-datepicker";
import Select from "react-select";
import axios from "axios";
import swal from "@sweetalert/with-react";
import ptBr from 'date-fns/locale/pt-BR';
import { Modal } from '@mui/material';
import ModalDadosCpf from 'views/fichas/modalDadosCpf';
import {configAxios} from "../../../constants";
import 'react-datepicker/dist/react-datepicker.css';
import SelectUF from "../../../components/select-uf";
import SelectBancos from "../../../components/select-bancos";
import {BASE_URL} from "../../../config";



export function NewClienteForm(props) {
    const {beneficio} = props;

    const [status, setStatus] = useState({tipo:'', mensagem:''});
    const [loading, setLoading] = useState(false);
    const [dataNascto, setDataNascto] = useState();
    const [codGenero, setCodGenero] = useState('');
    const [nomeGenero, setNomeGenero] = useState('');
    const [uf, setUf] = useState('');
    const [cpf, setCpf] = useState('');
    const [isShowModalDadosCpf, setIsShowModalDadosCpf] = useState(false);

    const optionsGenero = [
        { value: '0', label: 'F' },
        { value: '1', label: 'M' },
    ];

    const validate = async (payload) => {
        const schemaValidate = yup.object().shape({
            data_nascimento: yup.date('Necessário selecionar a data de nascimento!').required('Necessário selecionar a data de nascimento!'),
            cpf: yup.string().required('Necessário informar o CPF!').min(14, 'Digite o CPF corretamente!'),
            email: yup.string ('Necessário informar um emal').required('Necessário informar um email!').email('Informe um email válido!'),
            nome: yup.string().required('Necessário informar o nome!')
        })

        try{
            await schemaValidate.validate(payload);
            return true;
        } catch (e) {
            setStatus({tipo:'erro', mensagem: e.errors});
            console.log(payload);
            return false;
        }

    }

    const consultaCpf =  () => {
        setIsShowModalDadosCpf(true);
    };

    const handleSubmit =  async (values) => {
        const payload = {
            nome: values.nome,
            cpf: values.cpf,
            logradouro: values.logradouro,
            data_nascimento: dataNascto,
            complemento: values.complemento,
            bairro: values.bairro,
            cidade: values.cidade,
            cep: values.cep,
            estado: uf,
            gerero:codGenero,
            obito: values.obito,
            email: values.email,
            status: 1,
        }
        if(!(await validate(payload))){
            console.log('validou com erro', status)
            return;
        }

         await axios.post(`${BASE_URL}/data/cliente`, payload, configAxios)
            .then((response) => {
                if (response.status === 200) {
                    props.setAddedClient(true);
                    // console.log('response',response.data.data);
                    props.setClienteSelecionado ({value: response.data.data.id, label: response.data.data.nome});
                    swal(
                        'Yes ;)',
                        `Cliente incluído com sucesso.`,
                        `success`
                    );
                }else if (response.status === 203){
                    swal(
                        'Atenção :(',
                        `Cliente incluído com sucesso.`,
                        `success`
                    );
                }else{
                    swal(
                        'Ops... :(',
                        `Ocorreu um erro ao incluir o cliente.`,
                        `warning`
                    );
                }
                props.setAddModal(false);
            })
            .catch((error) => {
                swal(
                    'Ops... :(',
                    `Ocorreu um erro ao incluir o cliente.`,
                    `warning`
                );
                props.setAddModal(false);
            });

    };

    const formik = useFormik({
        initialValues: {
            nome: beneficio?.nome || '',
            cpf: beneficio?.cpf || '',
            dataNascimento: beneficio?.data_nascimento || '',
            logradouro: beneficio?.logradouro || '',
            numero: beneficio?.numero || '',
            complemento: beneficio?.complemento || '',
            bairro: beneficio?.bairro || '',
            cidade: beneficio?.cidade || '',
            cep: beneficio?.cep || '',
            estado: beneficio?.estado || '',
            gerero: beneficio?.gerero || '',
            obito: beneficio?.obito || '',
            email: beneficio?.email || '',
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        setDataNascto(new Date(beneficio?.data_nascimento));
    },[beneficio]);

    return (
        <>
            {loading ? (
                <p>Salvando...</p>
            ) : (
                <>
                    <Form onSubmit={formik.handleSubmit}>
                    { status.mensagem !== ''? <h4 className="alert-danger">{status.mensagem}</h4>: <></>}
                    <Row className="mb-3">
                        <Col sm={12} md={6} lg={6} xl={6} xxl={6}>
                            <Form.Group >
                                <Form.Label>Nome</Form.Label>
                                <Form.Control placeholder="nome do cliente"
                                    type="text"
                                    name="nome"
                                    id="nome"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.nome}
                                    className={`form-control ${
                                        formik.touched.nome &&
                                        formik.errors.nome
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6} lg={6} xl={6} xxl={6}>
                            <Form.Group >
                                <Form.Label>E-mail</Form.Label>
                                    <FormControl placeholder="email"
                                                 aria-label="Email"
                                                 aria-describedby="basic-addon1"
                                                 name="email"
                                                 id="email"
                                                 onChange={formik.handleChange}
                                                 onBlur={formik.handleBlur}
                                                 value={formik.values.email}
                                                 className={`form-control ${
                                                     formik.touched.email &&
                                                     formik.errors.email
                                                         ? 'is-invalid'
                                                         : ''
                                                 }`}
                                    />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={12} md={6} lg={2} xl={2} xxl={2}>
                            <Form.Group>                                                                         
                                <Form.Label>CPF</Form.Label>                            
                                <Button 
                                    className='small p-1 ms-2'
                                    variant="primary" 
                                    size="sx" 
                                    onClick={consultaCpf}
                                >Consultar
                                </Button>
                                <NumberFormat format="###.###.###-##"
                                              mask=""
                                              allowEmptyFormatting
                                              name="cpf"
                                              id="cpf"
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              value={formik.values.cpf}
                                              className={`form-control ${
                                                  formik.touched.cpf &&
                                                  formik.errors.cpf
                                                      ? 'is-invalid'
                                                      : ''
                                              }`}                                            
                                />                                
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6} lg={2} xl={2} xxl={2}>
                            <Form.Group>
                                <Form.Label>Data Nascimento</Form.Label>
                                <DatePicker
                                    id="dataNascimento"
                                    name="dataNascimento"
                                    className="form-control"
                                    locale={ptBr}
                                    onChange={(date) => setDataNascto(date)}
                                    selected={dataNascto}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6} lg={1} xl={1} xxl={1}>
                            <Form.Group>
                                <Form.Label>Gênero </Form.Label>
                                <Select
                                    id="canal"
                                    name="canal"
                                    classNamePrefix="react-select"
                                    options={optionsGenero}
                                    value={{ value: codGenero, label: nomeGenero}}
                                    onChange={(e) => {
                                        setCodGenero(e.value);
                                        setNomeGenero(e.label);
                                    }}
                                    placeholder="Selecione"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6} lg={2} xl={2} xxl={2} >
                            <Form.Group>
                                <Form.Label>CEP</Form.Label>
                                <NumberFormat format="##.###-###"
                                              mask=""
                                              allowEmptyFormatting
                                              name="cep"
                                              id="cep"
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              value={formik.values.cep}
                                              className={`form-control ${
                                                  formik.touched.cep &&
                                                  formik.errors.cep
                                                      ? 'is-invalid'
                                                      : ''
                                              }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6} lg={5} xl={5} xxl={5}>
                            <Form.Group>
                                <Form.Label>Logradouro</Form.Label>
                                    <FormControl placeholder="Rua.../Av.../Travessa..."
                                                 aria-label="Logradouro"
                                                 aria-describedby="basic-addon1"
                                                 name="logradouro"
                                                 id="logradouro"
                                                 onChange={formik.handleChange}
                                                 onBlur={formik.handleBlur}
                                                 value={formik.values.logradouro}
                                                 className={`form-control ${
                                                     formik.touched.logradouro &&
                                                     formik.errors.logradouro
                                                         ? 'is-invalid'
                                                         : ''
                                                 }`}
                                    />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={6} md={6} lg={1} xl={1} xxl={1}>
                            <Form.Group>
                                <Form.Label>Número</Form.Label>
                                <FormControl placeholder="012..."
                                             aria-label="numero"
                                             name="numero"
                                             id="numero"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.numero}
                                             className={`form-control ${
                                                 formik.touched.numero &&
                                                 formik.errors.numero
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={2} xl={2} xxl={2}>
                            <Form.Group>
                                <Form.Label>Complemento</Form.Label>
                                <FormControl placeholder="apto x, bloco y"
                                             aria-label="complemento"
                                             name="complemento"
                                             id="complemento"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.complemento}
                                             className={`form-control ${
                                                 formik.touched.complemento &&
                                                 formik.errors.complemento
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>

                        <Col sm={6} md={6} lg={3} xl={3} xxl={3}>
                            <Form.Group>
                                <Form.Label>Bairro</Form.Label>
                                <FormControl placeholder="bairro"
                                             aria-label="bairro"
                                             name="bairro"
                                             id="bairro"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.bairro}
                                             className={`form-control ${
                                                 formik.touched.bairro &&
                                                 formik.errors.bairro
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={5} xl={5} xxl={5}>
                            <Form.Group>
                                <Form.Label>Cidade</Form.Label>
                                <FormControl placeholder="cidade"
                                             aria-label="cidade"
                                             name="cidade"
                                             id="cidade"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.cidade}
                                             className={`form-control ${
                                                 formik.touched.cidade &&
                                                 formik.errors.cidade
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={4} md={4} lg={1} xl={1} xxl={1}>
                            <Form.Group>
                                <Form.Label>UF</Form.Label>
                                <SelectUF
                                    id="uf"
                                    name="uf"
                                    onBlur={formik.handleBlur}
                                    valor={ uf }
                                    onChangeValue={(e) => {
                                        setUf(e.value);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3 g-3">
                        <Col sm={12} md={6} lg={4} xl={4} xxl={4}>
                            <Form.Label>Banco</Form.Label>
                            <SelectBancos
                                id="banco"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.banco }
                            />
                        </Col>
                        <Col sm={6} md={6} lg={2} xl={2} xxl={2}>
                            <Form.Group>
                                <Form.Label>Agencia</Form.Label>
                                <FormControl placeholder=""
                                             aria-label=""
                                             name="agencia"
                                             id="agencia"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.agencia}
                                             className={`form-control ${
                                                 formik.touched.agencia &&
                                                 formik.errors.agencia
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={3} xl={3} xxl={3}>
                            <Form.Group>
                                <Form.Label>Conta</Form.Label>
                                <FormControl placeholder=""
                                             aria-label=""
                                             name="conta"
                                             id="conta"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.conta}
                                             className={`form-control ${
                                                 formik.touched.conta &&
                                                 formik.errors.conta
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={3} xl={3} xxl={3}>
                            <Form.Group>
                                <Form.Label>Tipo</Form.Label>
                                <FormControl placeholder=""
                                             aria-label=""
                                             name="tipo"
                                             id="tipo"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.tipo}
                                             className={`form-control ${
                                                 formik.touched.tipo &&
                                                 formik.errors.tipo
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={3} xl={3} xxl={3}>
                            <Form.Group>
                                <Form.Label>Telefone</Form.Label>
                                <FormControl placeholder=""
                                             aria-label=""
                                             name="telefone"
                                             id="telefone"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.telefone}
                                             className={`form-control ${
                                                 formik.touched.telefone &&
                                                 formik.errors.telefone
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6} xl={6} xxl={6}>
                            <Form.Group>
                                <Form.Label>E-mail</Form.Label>
                                <FormControl placeholder=""
                                             aria-label=""
                                             name="email"
                                             id="email"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.email}
                                             className={`form-control ${
                                                 formik.touched.email &&
                                                 formik.errors.email
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6} xl={6} xxl={6}>
                            <Form.Group>
                                <Form.Label>Nome do pai</Form.Label>
                                <FormControl placeholder=""
                                             aria-label=""
                                             name="pai"
                                             id="pai"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.pai}
                                             className={`form-control ${
                                                 formik.touched.pai &&
                                                 formik.errors.pai
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6} md={6} lg={6} xl={6} xxl={6}>
                            <Form.Group>
                                <Form.Label>Nome da mãe</Form.Label>
                                <FormControl placeholder=""
                                             aria-label=""
                                             name="mae"
                                             id="mae"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.mae}
                                             className={`form-control ${
                                                 formik.touched.mae &&
                                                 formik.errors.mae
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <div className="form-check form-switch">
                                <input type="checkbox"
                                       className="form-check-input"
                                       id="obito"
                                       onChange={formik.handleChange}
                                       onBlur={formik.handleBlur}
                                       value={formik.values.obito}
                                />
                                <label className="form-check-label" htmlFor="customSwitchTopLabel">
                                    (Óbito) Ative para informar o falecimento do cliente.
                                </label>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button
                                id="salvar-cliente"
                                type="submit"
                                className="btn"
                            >
                                Salvar
                            </Button>
                        </Col>
                    </Row>
                    </Form>
                    {isShowModalDadosCpf && (
                        <ModalDadosCpf
                            dialogClassName="full"
                            id_beneficio={beneficio?.id}
                            cpf={beneficio?.cpf}
                            show={isShowModalDadosCpf}
                            onHide={() => {
                                setIsShowModalDadosCpf(false);
                            }}
                        />        
                    )}
                </>                    
            )}          
                               
        </>
    );
}
