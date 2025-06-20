import { useRouter } from "next/router"
import {Footer18} from "../../../../src/components/blocks/footer";
import {Fragment, useEffect, useState} from "react";
import {Navbar} from "../../../../src/components/blocks/navbar";
import PageProgress from "../../../../src/components/common/PageProgress";
import {useFormik} from "formik";
import * as yup from 'yup';
import Confetti from "react-confetti";
import axios from "axios";
import {getHostFromContext} from "../../../../src/utils/config";
import {CurrencyEnToBr} from "../../../../src/utils/currencyEnToBr";
import {GetServerSideProps} from "next";
import CPFMask from "../../../../src/utils/CPFMask";
import CPFValidar from "../../../../src/utils/CPFValidar";
import Swal from "sweetalert2";
import justNumbers from "../../../../src/utils/justNumbers";
import currency from "../../../../src/utils/currency";
import toFloat from "../../../../src/utils/toFloat";

interface HomeProps {
    host: string | undefined;
}
export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
    const host = getHostFromContext(context);

    return {
        props: {
            host,
        },
    };
};

const Home: React.FC<HomeProps> = ({ host }) => {
    const router = useRouter()
    const {produto, cpf, valor} = router.query;

    const toUpper = (str: String) => {
        return str.toUpperCase();
    }
    const [success, setSuccess] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [uuid, setUuid] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [messageFGTS, setMessageFGTS] = useState(false);

    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: 800,
        height: 600,
    });

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    },[]);

    const api = async (values: any) => {
        setMessage('Aguarde, procurando as melhores taxas.');

        await axios.post( `${host}/edata/landingpage/ok`, {
            nome: values.nome,
            cpf: cpf,
            celular: values.celular,
            email: values.email,
            produto: produto,
            valor: toFloat(justNumbers(valor)/100),
            data_nascimento: values.data_nascimento
        } ).then(
            (response: any) => {
                console.log(response.data);
                if(response.data.status==='ok') {
                    setMessage(response.data.message);
                    setSuccess(true);
                    setUuid(response.data.uuid);
                    setRedirect(response.data.redirect);
                    setMessageFGTS(response.data?.mensagem_liberar);
                }else{
                    setMessage(response.data.message);
                    setSuccess(false);
                }
            }
        ).then(() => {
            setIsLoading(false);
        }).catch((e: Error) => {
            setSuccess(false);
        });
    }

    useEffect(() => {
        if(redirect === true) {
            setTimeout(() => {
                return window.location.href = `/${produto}/oba/meu-credito/${uuid}`;
            }, 2000);
        }
    },[redirect]);

    useEffect(() => {
        if(messageFGTS){
            Swal.fire({
                title: 'Ops, precisamos de sua ajuda.',
                text: 'Para continuar a simulação, precisamos que você libere seu CPF para consulta pelo aplicativo do FGTS para a instituição do nosso parceiro Banco Pan. Para assistir o vídeo explicativo, <a href="https://www.youtube.com/watch?v=no8qYEp3hHU" target="_blank">clique aqui.</a>',
                icon: 'error',
                confirmButtonText: 'Beleza, vou liberar'
            })
        }
    },[messageFGTS]);

    useEffect(() => {
        setIsLoading(false);
    },[valor]);

    const confirmarCadastro = (values: any) => {

        Swal.fire({
            title: 'Leia antes de continuar.',
            html: '<h5>Autorizo à empresa <b>CARRERA CARNEIRO</b>, CNPJ: 10.016.303/0001-56, por meio de seus representantes legais e ou prepostos, a efetuar quaisquer consultas relativas ao meu cadastro pessoal junto ao INSS, DATAPREV, FGTS e em Bureaus cadastrais e / ou outras fontes publicas e/ou privadas para obtenção das melhores soluções de crédito do junto às instituições financeiras que presta serviços.</h5> <br> <h4>Declaro que os dados que forneço para CARRERA CARNEIRO são de minha titularidade, que todos os dados informados são verdadeiros e que respondo civil e criminalmente por toda e qualquer informação ora fornecida.</h4>',
            showCancelButton: true,
            confirmButtonText: 'Sim, vou continuar...',
            cancelButtonText: 'Vou desistir e perder a chance',
            denyButtonText: `Desisti`,
        }).then((result) => {
            if (result.isConfirmed) {
                api(values);
            }else{
                setSubmitted(false);
            }
        })
        //

    }

    const formik = useFormik({
        initialValues: {
            nome: '',
            email: '',
            celular: '',
            cpf: cpf,
            valor: valor,
            data_nascimento: ''
        },
        onSubmit: (values) => {
            confirmarCadastro(values);
            setSubmitted(true);
        },
        validationSchema: yup.object({
            nome: yup
                .string()
                .required('O campo nome é obrigatório'),
            celular: yup
                .number()
                .typeError('O celular aceita apenas números, exemplo: 41985227839')
                .required('O celular é obrigatório'),
            email: yup.string()
                .email('Digite um endereço de e-mail válido.')
        }),
        onReset: () => {},
    });

    return (
        isLoading ? <PageProgress/> : <Fragment>
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                numberOfPieces={200}
                tweenDuration={1000}
                drawShape={context => {
                    context.beginPath();
                    context.arc(0, 0, 8, 0, 2 * Math.PI, false);
                    context.fillStyle = '#fcd72b';
                    context.fill();
                    context.lineWidth = 6;
                    context.strokeStyle = 'rgba(252,215,43,0.5)';
                    context.stroke();
                }}
                run={success ? true : false}
            />
            <PageProgress />
            {/* ========== header ========== */}
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
                <section className="wrapper bg-gray position-relative min-vh-60 d-lg-flex align-items-center">
                    <div
                        className="col-lg-6 position-lg-absolute top-0 start-0 image-wrapper bg-image bg-cover h-100"
                        style={{ backgroundImage: 'url(/img/photos/bg40.png)' }}
                    >
                        <div className="divider text-gray divider-v-end d-none d-lg-block">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 1200">
                                <g />
                                <g>
                                    <g>
                                        <polygon fill="currentColor" points="48 0 0 0 48 1200 54 1200 54 0 48 0" />
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="container">
                        <div className="row gx-0">
                            <div className="col-lg-6 ms-auto">
                                <div className="pt-13 pb-15 pb-md-17 py-lg-16 ps-lg-15 pe-xxl-16">
                                    <h2 className="fs-15 text-uppercase text-muted mb-3">Ótima escolha</h2>
                                    <h3 className="display-5 ls-sm mb-7">Para continuar a simulação, confirme os dados abaixo</h3>

                                    <div className="d-flex flex-row mb-5">
                                        <div>
                                            <h3 className="display-5 ls-sm mb-7 text-blue text-uppercase">{produto}</h3>
                                            <p className="mb-0">Seu CPF é {CPFMask(typeof cpf === "string" ? cpf : '')}</p>
                                            <p className="mb-0">e o valor desejado para simulação é {CurrencyEnToBr( typeof valor != "undefined" ? valor as string : "0.00")}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Em qual e-mail e celular você gostaria de receber a resposta da simulação?</p>
                                        <form className="w-100" onSubmit={formik.handleSubmit}>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                    <input
                                                        className="form-control form-control-lg"
                                                        style={{minWidth: '200px'}}
                                                        placeholder="Seu nome completo"
                                                        name="nome"
                                                        id="nome"
                                                        value={formik.values.nome}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.errors.nome && (
                                                        <div className="text-danger">{formik.errors.nome}</div>
                                                    )}
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                                                    <input
                                                        className="form-control form-control-lg"
                                                        style={{minWidth: '200px'}}
                                                        placeholder="Seu celular com DDD (apenas números)"
                                                        name="celular"
                                                        id="celular"
                                                        value={formik.values.celular}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        maxLength={11}
                                                    />
                                                    {formik.errors.celular && (
                                                        <div className="text-danger">{formik.errors.celular}</div>
                                                    )}
                                                </div>
                                                {
                                                    produto === 'FGTS' && <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                                                        <input
                                                            className="form-control form-control-lg"
                                                            style={{minWidth: '200px'}}
                                                            placeholder="Data de nascimento"
                                                            name="data_nascimento"
                                                            id="data_nascimento"
                                                            value={formik.values.data_nascimento}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            maxLength={10}
                                                        />
                                                        {formik.errors.celular && (
                                                            <div className="text-danger">{formik.errors.data_nascimento}</div>
                                                        )}
                                                    </div>
                                                }
                                                <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                                                    <input
                                                        className="form-control form-control-lg"
                                                        style={{minWidth: '300px'}}
                                                        placeholder="Seu e-mail (opcional)"
                                                        name="email"
                                                        id="email"
                                                        value={formik.values.email}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.errors.email && (
                                                        <div className="text-danger">{formik.errors.email}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-12 col-lg-12 mt-2" style={{display: submitted ? 'inline' : 'none'}}>
                                                    <div className="alert alert-success">{message}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-12 col-lg-12 mt-2" style={{display: submitted ? 'none' : 'inline'}}>
                                                    <button className="btn btn-success btn-lg rounded" type="submit">Continuar</button>
                                                </div>
                                                {/*
                                                <div className="col-sm-12 col-md-12 col-lg-12 mt-2">
                                                    <button className="btn btn-success btn-lg rounded" type="submit">Continuar</button>
                                                </div>
                                                */}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer18 />
        </Fragment>
    )
}

export default Home;
