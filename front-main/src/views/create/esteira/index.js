import React, {FormEvent, Fragment, useEffect, useState} from 'react';
import { gql, useMutation } from '@apollo/client';
import swal from "@sweetalert/with-react";
import axios from "axios";
import {
    Alert,
    Button,
    Col,
    Form, FormControl,
    InputGroup,
    Modal,
    Row,
} from 'react-bootstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR";
import * as yup from 'yup';
import NumberFormat from "react-number-format";
import { useFormik } from 'formik';
import Select from "react-select";
import {useSelector} from "react-redux";
import {configAxios} from "../../../constants";
import { NewClienteForm } from '../cliente';
import SelectProdutos from '../../../components/select-produtos';
import SelectBancos from '../../../components/select-bancos';
import SelectTabelas from "../../../components/select-tabelas";
import SelectCoeficiente from "../../../components/select-coeficiente";
import CurrencyBR from "../../../components/currencyBR";
import {BASE_URL} from "../../../config";

export function NewEsteiraForm(props) {
    const [loading, setLoading] = useState(false);

    // eslint-disable-next-line react/destructuring-assignment
    const { setAddModal } = props.setAddModal;
    const [modalAddCliente, setModalAddCliente] = useState(false);
    const [tabela, setTabela] = useState('');
    const [tabelaTexto, setTabelaTexto] = useState('');
    const [data, setData] = useState([]);
    const [cliente, setCliente] = useState({value:'', label:''});
    const [parcela, setParcela] = useState(0);
    const [emprestimo, setEmprestimo] = useState(0);
    const [seguro, setSeguro] = useState(false);
    const [dataLancamento, setDataLancamento] = useState(null);
    const [dataCoeficiente, setDataCoeficiente] = useState(null);
    const [dataVencimento, setDataVencimento] = useState(null);
    const [dataDigBanco, setDataDigBanco] = useState(null);
    const [dataContratoFisico, setDataContratoFisico] = useState(null);
    const [dataPendencia, setDataPendencia] = useState(null);
    const [novoCliente, setNovoCliente] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [optionClientes, setOptionClientes] =useState([]);
    const [optionCoeficiente,setOptionCoeficiente] = useState([]);
    const [codCoeficiente, setCodCoeficiente] = useState(0);
    const [nomeCoeficiente, setNomeCoeficiente] = useState('');
    const [optionParcelas, setOptionParcelas] = useState('');
    const [digitaBanco, setDigitaBanco] = useState(false);
    const [contratoFisico, setContratoFisico] = useState(false);
    const [comPendencia, setComPendencia] = useState(false);
    const [banco, setBanco] = useState('');
    const [produto, setProduto] = useState('');
    const { currentUser, isLogin } = useSelector((state) => state.auth);
    const [status, setStatus] = useState({tipo:'', mensagem:''});

    const MAX_VAL = 100;
    const withValueTax = (inputObj) => {
        const { value } = inputObj;
        if (value <= MAX_VAL) {
            return true
        };
        return false;
    };

    const getClientes = async () =>{
        await axios.get( `${BASE_URL}/data/cliente-select`, configAxios)
            .then( res => {
                if ( res.status === 200 ) {
                    const statusOptions = [];
                    setData(res.data);
                    // eslint-disable-next-line no-plusplus
                    for ( let i = 0; i < res.data.length; i++ ) {
                        statusOptions.push( { value: res.data[ i ].id, label: res.data[ i ].nome } );
                    }
                    setOptionClientes(statusOptions);
                }
            } ).catch( ( error ) => {
            console.log( error.status );
        } );
    }

    const getCoeficiente = async () =>{
        if(inputValue.length > 0) {
            configAxios.params = { term: inputValue };
        }
        await axios.get( `${BASE_URL}/data/coeficiente-select`, configAxios)
            .then( res => {
                if ( res.status === 200 ) {
                    const statusOptions = [];
                    const statusParcelas = [];
                    setData(res.data);
                    // eslint-disable-next-line no-plusplus
                    for ( let i = 0; i < res.data.length; i++ ) {
                        statusOptions.push( { value: res.data[ i ].id, label: res.data[ i ].coeficiente } );
                        statusParcelas.push({value: res.data[ i ].id, parcela: res.data[ i ].qtde_parcela } );

                    }
                    setOptionCoeficiente(statusOptions);
                    setOptionParcelas(statusParcelas);
                    setCodCoeficiente(0);
                    setNomeCoeficiente("");
                }
            } ).catch( ( error ) => {
                console.log( error.status );
            } );
    };

    const getParcelas = (id) => {
        const coef =  optionParcelas.filter( ( i, k ) => {
            return i.value === id;
        })
        setParcela( coef[0].parcela);
    };

    const validate = async (payload) => {
        const schemaValidate = yup.object().shape({
            emprestimo: yup.number().required('Necessário informar a quantidade de parcelas!').min(10,'Empréstimo inferior a R$ 10,00'),
            parcela: yup.string().required('Necessário informar a quantidade de parcelas!'),
            tabela: yup.string().required('Necessário selecionar a tabela!'),
            produto: yup.string().required('Necessário selecionar o produto!'),
            cliente: yup.string().required('Necessário selecionar o cliente!'),
        })

        try{
            await schemaValidate.validate(payload);
            return true;
        } catch (e) {
            setStatus({tipo:'erro', mensagem: e.errors});
            return false;
        }

    }

    const handleSubmit = async (values) => {
        configAxios.params = {};
        const payload = {
            userId: currentUser.id,
            cliente: cliente.value,
            banco,
            bancoContrato:'',
            produto,
            tabela,
            coeficiente: codCoeficiente,
            parcela,
            taxa: values.taxa,
            emprestimo,
            seguro,
            contrato: values.contrato,
            beneficio:values.beneficio,
            observacao:values.observacao,
            digitaBanco,
            contratoFisico,
            comPendencia,
            dataCoeficiente,
            dataPendencia,
            dataLancamento,
            dataVencimento,
            dataContratoFisico,
            dataDigBanco
        }

        if(!(await validate(payload))){
            console.log('validou com erro', status)
            return;
        }

        await axios.post(
            `${BASE_URL}/data/v1/esteiraPropostas`, payload,configAxios)
            .then((response) => {
                if (response.status === 200) {
                    swal(
                        'Yes ;)',
                        `Registro salvo com sucesso.`,
                        `success`
                    );
                    props.setAddModal(false);
                }else if (response.status === 203){
                    let erros = '';
                    erros = response.data.message.map((item) => {
                        return `${item[0]}  \n`
                    })
                    swal(
                        'Atenção :(',
                        `campos obrigatórios não informado. \n ${erros}`,
                        `warning`
                    );
                    console.log('response.data.message',response.data.message);
                }else{
                    swal(
                        'Ops... :(',
                        `Ocorreu um erro ao salvar.`,
                        `warning`
                    );
                    console.log('response.data.message',response.data.message);
                }
            })
            .catch((error) => {
                swal(
                    'Ops... :(',
                    `Ocorreu um erro ao salvar.`,
                    `warning`
                );
                console.log('error',error);
                props.setAddModal(false);
            });
    };

    // hack for isMulti & AsyncSelect bugs react-select v.4.3.1
    const getOptionValue = (option) => {
        return option.id;
    };

    useEffect( () =>{
        if(novoCliente){
            getClientes();
        }
        setNovoCliente(false)
        // eslint-disable-next-line
    },[novoCliente]);

    const formik = useFormik({
        initialValues: {
            nome: '',
            cliente: '',
            banco: '',
            bancoContrato:'',
            produto: '',
            tabela:'',
            parcela:0,
            taxa:0,
            emprestimo:'',
            seguro: false,
            contrato:'',
            beneficio:'',
            observacao:''
        },
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    return (
        <>
            {loading ? (
                <p>Salvando...</p>
            ) : (
                <>
                    { status.mensagem !== ''? <h4 className="alert-danger">{status.mensagem}</h4>: <></> }
                    <Form onSubmit={ formik.handleSubmit}>
                        <h4>Dados do cliente</h4>
                        <Row className="g-3 mb-3">
                            <Col sm={10} md={10} lg={10}>
                                <Form.Label>Nome do cliente</Form.Label>
                                <Select
                                    placeholder="Selecione"
                                    components={   <span className="custom-css-class">Nenhum registro para a busca</span>  }
                                    value={ cliente }
                                    onChange={ ( evt ) => {
                                        setCliente({value:evt.value, label: evt.label}) ;
                                    } }
                                    options={ optionClientes }
                                />
                            </Col>
                            <Col sm={2} md={2} lg={2}>
                                <Button
                                    style={{ marginTop: '28px' }}
                                    variant="outline-secondary"
                                    onClick={() => setModalAddCliente(true)}
                                >
                                    Novo
                                </Button>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <h4>Dados do empréstimo</h4>
                            <Col sm={12} md={4} lg={4}>
                                <Form.Label>Banco</Form.Label>
                                <SelectBancos
                                    id="banco"
                                    onChangeValue={(e) => setBanco(e.id)}
                                />
                            </Col>
                            <Col sm={12} md={6} lg={6}>
                                <Form.Label>Produto</Form.Label>
                                <SelectProdutos
                                    id="produto"
                                    onChangeValue={(e) => setProduto(e.id)}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={12} md={3} lg={3}>
                                <Form.Label>Tabelas</Form.Label>
                                <SelectTabelas
                                    id="tabela"
                                    name="tabela"
                                    valor={ tabela }
                                    texto={ tabelaTexto}
                                    onChangeValue={(e) => {
                                        setTabela(e.value);
                                        setTabelaTexto(e.label);
                                        getCoeficiente(setInputValue(tabela))
                                    }}
                                />
                            </Col>
                            <Col sm={3} md={3} lg={3} xl={2}>
                                <Form.Group>
                                    <Form.Label>Coeficiente { tabela }</Form.Label>
                                    <Select
                                        placeholder="Selecione"
                                        id="coeficiente"
                                        components={   <span className="custom-css-class">Nenhum registro para a busca</span>  }
                                        value={{value: codCoeficiente, label:nomeCoeficiente} }
                                        onChange={ ( evt ) => {
                                            setCodCoeficiente(parseInt(evt.value, 10) );
                                            setNomeCoeficiente(evt.label)
                                            getParcelas(evt.value);
                                        } }
                                        options={ optionCoeficiente }
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={2} md={1} lg={1} xl={1}>
                                <Form.Group>
                                    <Form.Label>Taxa</Form.Label>
                                    <NumberFormat
                                        id="taxa"
                                        name="taxa"
                                        className="form-control"
                                        allowEmptyFormatting
                                        isAllowed={withValueTax}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.taxa}
                                        decimalSeparator=","
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={2} md={1} lg={1} xl={1}>
                                <Form.Group>
                                    <Form.Label>Parcelas</Form.Label>
                                    <NumberFormat
                                        className="form-control"
                                        id="parcela"
                                        name="parcela"
                                        allowEmptyFormatting
                                        isAllowed={withValueTax}
                                        value={parcela}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6} md={2} lg={2} xl={2}>
                                <Form.Group>
                                    <Form.Label>Empréstimo</Form.Label>
                                    <CurrencyBR
                                        id="emprestimo"
                                        name="emprestimo"
                                        className="form-control"
                                        onChangeValue={(event, value, maskedValued) => {
                                            setEmprestimo(value);
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6} md={2} lg={2} xl={2}>
                                <Form.Group className="form-control">
                                    <Form.Check
                                        type="switch"
                                        id="seguro"
                                        label="Com seguro"
                                        value={ seguro }
                                        onChange={ ( e ) => {
                                            setSeguro(e.target.checked);
                                        } }
                                    />
                                    <Form.Text muted>Ative para indicar seguro</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <h4>Dados do contrato</h4>
                        <Row className="g-3 mb-3">
                            <Col sm={6} md={3} lg={3}>
                                <Form.Label>Nº Contrato</Form.Label>
                                <FormControl placeholder=""
                                             aria-label="contrato"
                                             aria-describedby="basic-addon1"
                                             name="contrato"
                                             id="contrato"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.contrato}
                                             className={`form-control ${
                                                 formik.touched.contrato &&
                                                 formik.errors.contrato
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Col>
                            <Col sm={12} md={2} lg={2} xl={2} xxl={2}>
                                <Form.Label className="d-block">Lançamento</Form.Label>
                                <DatePicker className="form-control" locale={ptBR} dateFormat="dd/MM/yyyy" selected={dataLancamento} onChange={(date) => setDataLancamento(date)} />
                            </Col>
                            <Col sm={12} md={2} lg={2} xl={2} xxl={2}>
                                <Form.Label className="d-block">1ºVencimento</Form.Label>
                                <DatePicker className="form-control" locale={ptBR} dateFormat="dd/MM/yyyy" selected={dataVencimento} onChange={(date) => setDataVencimento(date)} />
                            </Col>
                            <Col sm={12} md={2} lg={2} xl={2} xxl={2}>
                                <Form.Label className="d-block">Data Coeficiente</Form.Label>
                                <DatePicker className="form-control" locale={ptBR} dateFormat="dd/MM/yyyy" selected={dataCoeficiente} onChange={(date) => setDataCoeficiente(date)} />
                            </Col>
                            <Col sm={12} md={2} lg={2} xl={2} xxl={2}>
                                <Form.Label>Benefício/Senha</Form.Label>
                                <FormControl placeholder=""
                                             aria-label="beneficio"
                                             aria-describedby="basic-addon1"
                                             name="beneficio"
                                             id="beneficio"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.beneficio}
                                             className={`form-control ${
                                                 formik.touched.beneficio &&
                                                 formik.errors.beneficio
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={6} md={2} lg={2} xl={2} xxl={2}>
                                <Form.Check
                                    type="checkbox"
                                    label="Digitação Banco"
                                    id="digitaBanco"
                                    inline
                                    value={ digitaBanco }
                                    onChange={ ( e ) => {
                                        setDigitaBanco(e.target.checked);
                                    } }
                                />
                            </Col>
                            <Col sm={6} md={2} lg={2} xl={2} xxl={2}>
                                <DatePicker className="form-control w-lg-100" locale={ptBR} dateFormat="dd/MM/yyyy" selected={dataDigBanco} onChange={(date) => setDataDigBanco(date)} />
                            </Col>
                            <Col sm={6} md={2} lg={2} xl={2} xxl={2}>
                                <Form.Check
                                    type="checkbox"
                                    label="Contrato Físico"
                                    id="contratoFisico"
                                    inline
                                    value={ contratoFisico }
                                    onChange={ ( e ) => {
                                        setContratoFisico(e.target.checked);
                                    } }
                                />
                            </Col>
                            <Col sm={6} md={2} lg={2} xl={2} xxl={2}>
                                    <DatePicker className="form-control" locale={ptBR} dateFormat="dd/MM/yyyy" selected={dataContratoFisico} onChange={(date) => setDataContratoFisico(date)} />
                            </Col>
                            <Col sm={6} md={2} lg={2} xl={2} xxl={2}>
                                <Form.Check
                                    type="checkbox"
                                    label="Com pendência"
                                    id="comPendencia"
                                    inline
                                    value={ comPendencia }
                                    onChange={ ( e ) => {
                                        setComPendencia(e.target.checked);
                                    } }
                                />
                            </Col>
                            <Col sm={6} md={2} lg={2} xl={2} xxl={2}>
                                <DatePicker className="form-control" locale={ptBR} dateFormat="dd/MM/yyyy" selected={dataPendencia} onChange={(date) => setDataPendencia(date)} />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={12} md={12} lg={12} xl={12} xxl={12}>
                                <Form.Label>Observação</Form.Label>
                                <FormControl placeholder=""
                                             aria-label="observacao"
                                             aria-describedby="basic-addon1"
                                             name="observacao"
                                             id="observacao"
                                             onChange={formik.handleChange}
                                             onBlur={formik.handleBlur}
                                             value={formik.values.observacao}
                                             className={`form-control ${
                                                 formik.touched.observacao &&
                                                 formik.errors.observacao
                                                     ? 'is-invalid'
                                                     : ''
                                             }`}
                                />
                            </Col>
                        </Row>
                        <Button
                            type='submit'
                        >
                            Salvar...
                        </Button>
                    </Form>
                    <Modal
                        backdrop="static"
                        className="modal bg-body"
                        size="xl"
                        centered
                        show={modalAddCliente}
                        onHide={() => {
                            setModalAddCliente(false);
                        }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Cadastro simples de cliente
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <NewClienteForm setAddModal={setModalAddCliente}  setAddedClient = { setNovoCliente} setClienteSelecionado={setCliente}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => setModalAddCliente(false)}
                            >
                                Cancelar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </>
    );
}
