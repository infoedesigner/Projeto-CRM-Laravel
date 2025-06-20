import {useRouter} from "next/router";
import PageProgress from "../../../src/components/common/PageProgress";
import {Navbar} from "../../../src/components/blocks/navbar";
import {Footer18} from "../../../src/components/blocks/footer";
import axios from "axios";
import {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as yup from 'yup';
import {GetServerSideProps} from "next";
import {getHostFromContext} from "../../../src/utils/config";
import Swal from "sweetalert2";

interface ViewProps {
    host: string | undefined;
}
export const getServerSideProps: GetServerSideProps<ViewProps> = async (context) => {
    const host = getHostFromContext(context);

    return {
        props: {
            host,
        },
    };
};

const View: React.FC<ViewProps> = ({ host }) => {

    const router = useRouter();
    const {uuid, produto} = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [initialValues, setInitialValues] = useState({id_cliente: '', nome: '', cpf: '', data_nascimento: '', banco_nome: '', agencia_codigo: '', conta_bancaria: '', especie: '', descricao_especie: '', observacoes: '', rg: '', orgao_emissor: '', nacionalidade: '', genero: '', cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '', email: '', celular: '', telefone_fixo: '',aceite: false,pai:'',mae:''});
    const [beneficio, setBeneficio] = useState('');
    const [tipoDocs, setTipoDocs] = useState('cartao-benef');

    useEffect(() => {
        async function getData() {
            await axios.get(`${host}/edata/etapaFinalINSS/${uuid}`)
                .then((response) => {

                    setBeneficio(response.data.dados.id_beneficio);
                    setTipoDocs(response.data.dados.tipoDocs);

                    let {id_cliente, nome, cpf, data_nascimento, banco_nome, agencia_codigo, conta_bancaria, especie, descricao_especie, observacoes, rg, orgao_emissor, nacionalidade, genero, cep, logradouro, numero, complemento, bairro, cidade, uf, email, celular, telefone_fixo,pai,mae} = response.data.dados;

                    id_cliente = typeof id_cliente === undefined || id_cliente === null ? '' : id_cliente;
                    nome = typeof nome === undefined || nome === null ? '' : nome;
                    cpf = typeof cpf === undefined || cpf === null ? '' : cpf;
                    data_nascimento = typeof data_nascimento === undefined || data_nascimento === null ? '' : data_nascimento;
                    banco_nome = typeof banco_nome === undefined || banco_nome === null ? '' : banco_nome;
                    agencia_codigo = typeof agencia_codigo === undefined || agencia_codigo === null ? '' : agencia_codigo;
                    conta_bancaria = typeof conta_bancaria === undefined || conta_bancaria === null ? '' : conta_bancaria;
                    especie = typeof especie === undefined || especie === null ? '' : especie;
                    descricao_especie = typeof descricao_especie === undefined || descricao_especie === null ? '' : descricao_especie;
                    observacoes = typeof observacoes === undefined || observacoes === null ? '' : observacoes;
                    rg = typeof rg === undefined || rg === null ? '' : rg;
                    orgao_emissor = typeof orgao_emissor === undefined || orgao_emissor === null ? '' : orgao_emissor;
                    nacionalidade = typeof nacionalidade === undefined || nacionalidade === null ? '' : nacionalidade;
                    genero = typeof genero === undefined || genero === null ? '' : genero;
                    cep = typeof cep === undefined || cep === null ? '' : cep;
                    logradouro = typeof logradouro === undefined || logradouro === null ? '' : logradouro;
                    numero = typeof numero === undefined || numero === null ? '' : numero;
                    complemento = typeof complemento === undefined || complemento === null ? '' : complemento;
                    bairro = typeof bairro === undefined || bairro === null ? '' : bairro;
                    cidade = typeof cidade === undefined || cidade === null ? '' : cidade;
                    uf = typeof uf === undefined || uf === null ? '' : uf;
                    email = typeof email === undefined || email === null ? '' : email;
                    celular = typeof celular === undefined || celular === null ? '' : celular;
                    telefone_fixo = typeof telefone_fixo === undefined || telefone_fixo === null ? '' : telefone_fixo;
                    pai = typeof pai === undefined || pai === null ? '' : pai;
                    mae = typeof mae === undefined || mae === null ? '' : mae;

                    // @ts-ignore
                    setInitialValues({id_cliente, nome, cpf, data_nascimento, banco_nome, agencia_codigo, conta_bancaria, especie, descricao_especie, observacoes, rg, orgao_emissor, nacionalidade, genero, cep, logradouro, numero, complemento, bairro, cidade, uf, email, celular, telefone_fixo,pai,mae});
                })
                .then(() => {
                    setIsLoading(false);
                })
                .catch((error) => {
                    alert(error);
                });
        }
        getData();
    }, []);

    const confirmarCadastro = (values: any) => {

        Swal.fire({
            title: 'ATENÇÃO - Leia antes de continuar.',
                html: '<p>Ao clicar em QUERO CONTRATAR estou CIENTE que será emitindo o PEDIDO DE EMPRÉSTIMO consignado tal como solicitado, declara que todos os dados fornecidos são de minha titularidade e me comprometo civil e criminalmente pelo envio das informações corretas e estou ciente que a falsidade de dados ou da sua titularidade caracteriza fraude. Após preencher seu cadastro irá receber contato no WhatsApp para envio dos documentos pessoais RG, CPF ou CNH e confirmar dados bancários.</p>',
            showCancelButton: true,
            confirmButtonText: 'Sim, vou continuar...',
            cancelButtonText: 'Vou desistir e perder a chance',
            denyButtonText: `Desisti`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoading(true);

                await axios.post(`${host}/edata/saveFinish`, values).then((response) => {
                    if (response.status === 200 && response.data.status === 'ok') {
                        Swal.fire({
                            title: 'Show!',
                            text: 'Simulação enviada com sucesso, aguarde, você será redirecionado para enviar seus documentos.',
                            icon: 'success',
                            confirmButtonText: 'Ok :)'
                        })

                        setTimeout(() => {
                            window.location.href = `/docs/${beneficio}/${tipoDocs}/list`;
                        },4000);
                    }
                }).then(() => {
                    setIsLoading(false);
                }).catch((error) => {
                    alert(error);
                });
            }
        })
        //

    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        onSubmit: async (values) => {
            confirmarCadastro(values);
        },
        validationSchema: yup.object({
            nome: yup
                .string()
                .required('O nome é obrigatório'),
            cpf: yup
                .string()
                .required('O CPF é obrigatório'),
            celular: yup
                .string()
                .required('O celular é obrigatório')
        })
    });

    return (
        <>
            {
                isLoading ? <PageProgress/> : <>
                    <header className="wrapper bg-light">
                        <Navbar
                            info
                            search
                            stickyBox={false}
                            navOtherClass="navbar-other ms-lg-4"
                            navClassName="navbar navbar-expand-lg classic transparent position-absolute navbar-light"
                        />
                    </header>
                    <main className="content-wrapper">
                        <section className="wrapper bg-gray">
                            <div className="container pt-12 pt-md-14 pb-14 pb-md-16">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-12 mt-2">
                                        <h1>Para finalizar a contratação on-line, precisamos de alguns dados e
                                            documentos seus.</h1>
                                        <h2>Para envio dos documentos você receberá um e-mail e um contato de nosso
                                            agente automático no WhatsApp</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <form className="w-100" onSubmit={formik.handleSubmit}>
                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                        <div className="card m-0 p-0">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="alert alert-info">
                                                            Os campos com * são obrigatórios.
                                                        </div>
                                                    </div>
                                                </div>
                                                <h2>Dados cadastrais</h2>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="form-group">
                                                            <label>Nome completo*</label>
                                                            <input
                                                                className="form-control form-control-lg"
                                                                name="nome"
                                                                id="nome"
                                                                value={formik.values.nome}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                        {formik.errors.nome && (
                                                            <div className="text-danger">{formik.errors.nome}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-4 mt-2">
                                                        <div className="form-group">
                                                            <label>CPF*</label>
                                                            <input
                                                                className="form-control form-control-lg"
                                                                name="cpf"
                                                                id="cpf"
                                                                value={formik.values.cpf}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                        {formik.errors.cpf && (
                                                            <div className="text-danger">{formik.errors.cpf}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <h2 className="mt-5">Dados de contato</h2>
                                                <div className="row">
                                                    <div className="col-5 mt-2">
                                                        <div className="form-group">
                                                            <label>E-mail</label>
                                                            <input className="form-control form-control-lg" name="email"
                                                                   id="email"
                                                                   value={formik.values.email}
                                                                   onChange={formik.handleChange}
                                                                   onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                        {formik.errors.email && (
                                                            <div className="text-danger">{formik.errors.email}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-4 mt-2">
                                                        <div className="form-group">
                                                            <label>Celular com DDD (Apenas números)*</label>
                                                            <input className="form-control form-control-lg"
                                                                   name="celular" id="celular"
                                                                   value={formik.values.celular}
                                                                   onChange={formik.handleChange}
                                                                   onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                        {formik.errors.celular && (
                                                            <div className="text-danger">{formik.errors.celular}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-3 mt-2">
                                                        <div className="form-group">
                                                            <label>Número telefone/Fixo</label>
                                                            <input className="form-control form-control-lg"
                                                                   name="telefone_fixo" id="telefone_fixo"
                                                                   value={formik.values.telefone_fixo}
                                                                   onChange={formik.handleChange}
                                                                   onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-12 mt-2">
                                                        <hr/>
                                                        <h4>Atenção</h4>
                                                        Ao clicar em <strong>QUERO CONTRATAR</strong> estou <strong>CIENTE</strong> que será emitindo o <strong>PEDIDO DE EMPRÉSTIMO</strong> consignado tal como solicitado, <strong>declara que todos os dados fornecidos são de minha titularidade e me comprometo civil e criminalmente</strong> pelo envio das informações corretas e estou ciente que a falsidade de dados ou da sua titularidade caracteriza fraude. Após preencher seu cadastro irá receber contato no WhatsApp para envio dos documentos pessoais RG, CPF ou CNH e confirmar dados bancários.
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <button className="btn btn-outline-success" type="submit">Continuar</button>
                                            </div>
                                        </div>
                                    </div>
                                    </form>
                                </div>
                            </div>
                        </section>
                    </main>
                    <Footer18/>
                </>
            }
        </>
    );

}

export default View;
