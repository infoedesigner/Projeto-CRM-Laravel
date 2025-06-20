import React, { FormEvent, Fragment, useState } from 'react';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import {
    Alert,
    Button,
    Col,
    Form,
    FormControl,
    InputGroup,
    Modal,
    Row,
} from 'react-bootstrap';
import * as yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import Select from 'react-select';
import { useFormik } from 'formik';
import { BASE_URL, BASE_URL_LOGIN } from '../../../config';
import { USER_ROLE, configAxios } from '../../../constants';
import SelectUF from '../../../components/select-uf';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import CurrencyBR from '../../../components/currencyBR';

export function NewLeadForm(props) {
    // eslint-disable-next-line react/destructuring-assignment
    const [uf, setUf] = useState(props.uf);
    // eslint-disable-next-line react/destructuring-assignment
    const [acao, setAcao] = useState(props.acao);
    // eslint-disable-next-line react/destructuring-assignment
    const { modalLeadManual, setAddModal } = props;
    const { idLead } = props;
    // eslint-disable-next-line react/destructuring-assignment
    const [nome, setNome] = useState(props.nome);
    // eslint-disable-next-line react/destructuring-assignment
    const [canalSelecionado, setCanal] = useState(props.canal);
    // eslint-disable-next-line react/destructuring-assignment
    const [celular, setCelular] = useState(props.celular);
    // eslint-disable-next-line react/destructuring-assignment
    const [email, setEmail] = useState(props.email);
    // eslint-disable-next-line react/destructuring-assignment
    const [cpf, setCpf] = useState(props.cpf);
    // eslint-disable-next-line react/destructuring-assignment
    const [cidade, setCidade] = useState(props.cidade);
    // eslint-disable-next-line react/destructuring-assignment
    const [idade, setIdade] = useState(props.idade);
    // eslint-disable-next-line react/destructuring-assignment
    const [valor, setValor] = useState(props.valor);
    // eslint-disable-next-line react/destructuring-assignment
    const [status, setStatus] = useState(props.status);
    const [loading, setLoading] = useState(false);
    const [statusErro, setStatusErro] = useState({tipo:'', mensagem:''});

    const MAX_VAL = 120;
    const withValueCap = (inputObj) => {
        const { value } = inputObj;
        if (value <= MAX_VAL) {
            return true;
        }
        return false;
    };

    const optionsTipoContato = [
        { value: 'Telefone', label: 'Telefone' },
        { value: 'WhatsApp', label: 'WhatsApp' },
        { value: 'E-mail', label: 'E-mail' },
        { value: 'SMS', label: 'SMS' },
        { value: 'Facebook', label: 'Facebook' },
        { value: 'Outro', label: 'Outro' },
        { value: 'Website', label: 'Website' },
    ];

    const validate = async (payload) => {
        const schemaValidate = yup.object().shape({
            nome: yup.string().required('Necessário informar o nome!').min(6,'Informe o nome completo.'),
            cpf: yup.string().required('Necessário informar o CPF!').min(14, 'CPF inválido.'),
            email: yup.string().required('Necessário informar o email!').email('Informe um email válido'),
            canal: yup.string().required('Necessário informar o canal!'),
            idade: yup.number('A idade deve ser um número').required('Necessário informar a idade!').min(18,'A idade mínima é de 18 anos.'),
        })

        try{
            await schemaValidate.validate(payload);
            return true;
        } catch (e) {
            setStatusErro({tipo:'erro', mensagem: e.errors});
            return false;
        }

    }

    const insertLead = async (values) => {
        const payload = {
            nome: values.nome,
            cpf: values.cpf,
            celular: values.celular,
            email: values.email,
            cidade: values.cidade,
            uf,
            valor_disponivel: valor,
            idade: values.idade,
            status: 1,
            canal:canalSelecionado,
        }

        if(!(await validate(payload))){
            console.log('validou com erro', statusErro)
            return;
        }

        await axios.post(`${BASE_URL}/data/v1/leads`,payload,configAxios)
            .then((response) => {
                if (response.status === 200) {
                    swal(
                        'Yes ;)',
                        `Lead incluído com sucesso.`,
                        `success`
                    );
                    props.setAddModal(false);
                    props.setRefresh(true);
                }else{
                    swal(
                        'Ops... :(',
                        `Ocorreu um erro ao incluir o lead.`,
                        `warning`
                    );
                    console.log(response.data);
                }

                props.setAddModal(false);
            })
            .catch((error) => {
                swal(
                    'Ops... :(',
                    `Ocorreu um erro ao incluir o lead.`,
                    `warning`
                );
                console.log(error);
            });
    };

    const alterLead = (values) => {
        axios
            .put(
                `${BASE_URL}/data/v1/leads/${idLead}`,
                {
                    nome: values.nome,
                    cpf: values.cpf,
                    celular: values.celular,
                    email: values.email,
                    cidade: values.cidade,
                    uf,
                    idade: values.idade,
                    canal: canalSelecionado,
                    valor_disponivel: valor,
                },
                configAxios
            )
            .then((response) => {
                if (response.status === 200) {
                    swal('Yes ;)', `Lead alterado com sucesso.`, `success`);
                } else {
                    swal(
                        'Ops... :(',
                        `Ocorreu um erro ao alterar o lead.`,
                        `warning`
                    );
                    console.log(response.data);
                }
            })
            .catch((error) => {
                swal(
                    'Ops... :(',
                    `Ocorreu um erro ao alterar o lead.`,
                    `warning`
                );
                console.log(error);
            });
        // props.setAddModal(false);
    };

    const handleSubmit = async (values) => {
        if (acao === 'insert') {
            await insertLead(values);
        } else {
            await alterLead(values);
            props.setAddModal(false);
            props.setRefresh(true);
        }

    };

    const formik = useFormik({
        initialValues: {
            nome,
            cpf,
            celular,
            email,
            cidade,
            uf,
            idade,
            canal: canalSelecionado,
            valor,
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
                    { statusErro.mensagem !== ''? <h4 className="alert-danger">{statusErro.mensagem}</h4>: <></> }
                    <Form onSubmit={formik.handleSubmit}
                            id="form-modal">
                        <Form.Group className="mb-3" sm={6} md={6} lg={6}>
                            <Form.Label>Nome</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">
                                    <CsLineIcons icon="filter" />
                                </InputGroup.Text>
                                <FormControl
                                    placeholder="Nome"
                                    aria-label="Nome"
                                    aria-describedby="basic-addon1"
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
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" sm={6} md={6} lg={6}>
                            <Form.Label>Email</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">
                                    @
                                </InputGroup.Text>
                                <FormControl
                                    placeholder="Email"
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
                            </InputGroup>
                        </Form.Group>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group sm={6} md={6} lg={6}>
                                    <Form.Label>CPF</Form.Label>
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
                            <Col>
                                <Form.Group sm={6} md={6} lg={6}>
                                    <Form.Label>Celular</Form.Label>
                                    <NumberFormat
                                        format="(##)#####-####"
                                        name="celular"
                                        id="celular"
                                        mask=""
                                        allowEmptyFormatting
                                        value={formik.values.celular}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`form-control ${
                                            formik.touched.celular &&
                                            formik.errors.celular
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={2} md={2} lg={2}>
                                <Form.Group>
                                    <Form.Label>Idade</Form.Label>
                                    <NumberFormat
                                        id="idade"
                                        name="idade"
                                        className={`form-control ${
                                            formik.touched.idade &&
                                            formik.errors.idade
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        allowEmptyFormatting
                                        isAllowed={withValueCap}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.idade}
                                    />
                                    <Form.Text muted>
                                        máximo: {MAX_VAL}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col sm={8} md={8} lg={8}>
                                <Form.Group>
                                    <Form.Label>Cidade</Form.Label>
                                    <Form.Control
                                        type="text"
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
                            <Col sm={2} md={2} lg={2}>
                                <Form.Group>
                                    <Form.Label>UF</Form.Label>
                                    <SelectUF
                                        id="uf"
                                        name="uf"
                                        onBlur={formik.handleBlur}
                                        valor={uf}
                                        onChangeValue={(e) => {
                                            setUf(e.value);
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group sm={6} md={6} lg={6}>
                                    <Form.Label>Valor Disponível</Form.Label>
                                    <CurrencyBR
                                        id="valor"
                                        name="valor"
                                        className="form-control"
                                        value={parseFloat(valor)}
                                        onChangeValue={(
                                            event,
                                            value,
                                            maskedValued
                                        ) => {
                                            setValor(value);
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Label>Canal</Form.Label>
                                <Select
                                    id="canal"
                                    name="canal"
                                    classNamePrefix="react-select"
                                    options={optionsTipoContato}
                                    value={{
                                        value: canalSelecionado,
                                        label: canalSelecionado,
                                    }}
                                    onChange={(e) => {
                                        setCanal(e.value);
                                    }}
                                    placeholder="Selecione"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <button
                                    type="submit"
                                    className="btn btn-outline-primary"
                                    form="form-modal"
                                    // onClick={ handleSubmit(formik.values) }
                                >
                                    Salvar
                                </button>
                            </Col>
                        </Row>
                    </Form>
                </>
            )}
        </>
    );
}
