import React, { useEffect, useState } from 'react';
import {Button, Col, Form, FormLabel, Row} from "react-bootstrap";
import axios from "axios";
import swal from "@sweetalert/with-react";
import NumberFormat from "react-number-format";
import {useFormik} from "formik";
import * as yup from "yup";
import SelectBancos from "../../components/select-bancos";
import SelectRegrasNegocio from "../../components/select-regras";
import RegrasListSave from "../../components/regras-list-save";
import {BASE_URL} from "../../config";
import CsLineIcons from "../../cs-line-icons/CsLineIcons";
import {configAxios} from "../../constants";
import SelectBancosCodigo from "../../components/select-bancos-codigo";
import RegrasPortabilidadeListSave from "../../components/regras-list-portabilidade";

const RegrasNegocioPortabilidade = (props) => {

    const {tabelaId} = props;

    const [tipoRegra, setTipoRegra] = useState(0);
    const [dataRegras, setDataRegras] = useState([]);
    const [loading, setLoading] = useState(false);

    const GET_DATA_REGRAS = async () => {
        await axios.get(`${BASE_URL}/data/v1/regrasTabela-portabilidade/${tabelaId}`)
            .then((response) => {
                setDataRegras(response.data.data);
            }).catch((error) => {
                console.error(error);
            }).finally(()=>{
                setLoading(false);
            });
    }

    const handleSubmit = async (values) => {
        setLoading(true);
        await axios
            .post(`${BASE_URL}/data/v1/add-regrasTabela-portabilidade`, values, configAxios)
            .then((response) => {
                swal('Yes', `Registro salvo com sucesso`, 'success');
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                swal('Ops', `Erro ao realizar o registro ${err}`, 'error');
            }).finally(()=>{
                GET_DATA_REGRAS();
            });
    };

    const formik = useFormik({
        initialValues: {
            id_banco: '',
        },
        validationSchema: yup.object({
            id_banco: yup.string().required('O campo é obrigatório.'),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const delRegra = async (id_regra_produto) => {

        await axios
            .get(`${BASE_URL}/data/v1/delRegrasProduto-portabilidade/${id_regra_produto}`)
            .then(() => {
                GET_DATA_REGRAS();
                setLoading(false);
            })
            .catch((error) => {
                swal('ERRO', `${error}`, 'error');
            });

    }

    useEffect(() => {
        formik.setFieldValue('id_tabela', tabelaId);
        GET_DATA_REGRAS();
    },[tabelaId]);

    return (
        <>
            <Row className="g-3 mb-7">
                <Col sm={12} md={12} lg={12} xl={6}>
                    <div className="top-label">
                        <SelectRegrasNegocio
                            onChangeValue={(e) => {
                                formik.resetForm();
                                formik.setFieldValue('id_regra_negocio', e.id);
                                formik.setFieldValue('id_tabela', tabelaId);
                                setTipoRegra(e.tipo);
                            }}
                            name="regra"
                        />
                        <span>Regra de negócio</span>
                    </div>
                </Col>
                <Col sm={12} md={12} lg={12} xl={6}>
                    <div className="top-label">
                        <SelectBancos
                            onChangeValue={(e) => {
                                formik.setFieldValue('id_banco', e.id);
                            }}
                            name="banco"
                        />
                        <span>Banco</span>
                    </div>
                </Col>
                <Col sm={12} md={12} lg={12} xl={6}>
                    <Form.Group>
                        <Form.Label>Espécies bloqueadas (separado por vírgula)</Form.Label>
                        <Form.Control
                            type="text"
                            name="especies_bloqueadas"
                            id="especies_bloqueadas"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.especies_bloqueadas}
                            className={`form-control ${
                                formik.touched.especies_bloqueadas &&
                                formik.errors.especies_bloqueadas
                                    ? 'is-invalid'
                                    : ''
                            }`}
                        />
                    </Form.Group>
                </Col>
                <Col sm={12} md={12} lg={12} xl={6}>
                    <Form.Group>
                        <Form.Label>Espécies permitidas (separado por vírgula)</Form.Label>
                        <Form.Control
                            type="text"
                            name="especies_permitidas"
                            id="especies_permitidas"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.especies_permitidas}
                            className={`form-control ${
                                formik.touched.especies_permitidas &&
                                formik.errors.especies_permitidas
                                    ? 'is-invalid'
                                    : ''
                            }`}
                        />
                    </Form.Group>
                </Col>

                <Col sm={12} md={12} lg={12} xl={6}>
                    <Form.Group>
                        <Form.Label>Bancos portados (separado por vírgula)</Form.Label>
                        <SelectBancosCodigo onChangeValue={(e)=>{
                            const bancos_portados = e.map(obj => obj.banco_codigo).join(',');
                            formik.setFieldValue('bancos_portados', bancos_portados);
                        }}/>
                    </Form.Group>
                </Col>
                <Col sm={12} md={12} lg={12} xl={6}>
                    <Form.Group>
                        <Form.Label>Bancos não portados (separado por vírgula)</Form.Label>
                        <SelectBancosCodigo onChangeValue={(e)=>{
                            const bancos_nao_portados = e.map(obj => obj.banco_codigo).join(',');
                            formik.setFieldValue('bancos_nao_portados', bancos_nao_portados);
                        }}/>
                    </Form.Group>
                </Col>

                <Col sm={12} md={12} lg={12} xl={12}>
                    <div className="row">
                        <div className="col-12">Regras para o tipo {tipoRegra}</div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    name="idade_de"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.idade_de}
                                    disabled={tipoRegra!==9}
                                />
                                <span>Idade de</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    name="idade_ate"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.idade_ate}
                                    disabled={tipoRegra!==9}
                                />
                                <span>Idade até</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    name="prazo_de"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.prazo_de}
                                    disabled={tipoRegra!==9}
                                />
                                <span>Prazo de</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    name="prazo_ate"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.prazo_ate}
                                    disabled={tipoRegra!==9}
                                />
                                <span>Prazo até</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    name="valor_de"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.valor_de}
                                    disabled={tipoRegra!==9}
                                />
                                <span>Valor de</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    name="valor_ate"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.valor_ate}
                                    disabled={tipoRegra!==9}
                                />
                                <span>Valor até</span>
                            </div>
                        </div>
                        <div className="col-2 mt-3">
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    name="valor"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.valor}
                                    disabled={tipoRegra===9}
                                />
                                <span>Parâmetro</span>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col sm={12} md={12} lg={12} xl={12}>
                    <Button
                        variant="outline-success"
                        className="mb-1"
                        onClick={() => {
                            formik.handleSubmit();
                        }}
                    >
                        Adicionar regra
                    </Button>
                </Col>
            </Row>
            {/* maps com itens regras */}
            {dataRegras?.length > 0 ? (
                dataRegras.map((i, key) => {
                    return <RegrasPortabilidadeListSave key={key} item={i} delRegra={delRegra} />;
                })
            ) : (
                <>Nenhuma regra</>
            )}            
        </>
    );
};

export default RegrasNegocioPortabilidade;
