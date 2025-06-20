import axios from "axios";
import {useRouter} from "next/router";
import PageProgress from "../../../../src/components/common/PageProgress";
import {Navbar} from "../../../../src/components/blocks/navbar";
import {Footer18} from "../../../../src/components/blocks/footer";
import {getHostFromContext} from "../../../../src/utils/config";
import React, {useEffect, useState} from "react";
import {CurrencyEnToBr, CurrencyEnToBrOnly} from "../../../../src/utils/currencyEnToBr";
import {GetServerSideProps} from "next";
import Swal from "sweetalert2";
import { NumericFormat } from 'react-number-format';

import "@sweetalert2/themes/bootstrap-4/bootstrap-4.min.css";
import {CurrencyBrToEn} from "../../../../src/utils/currencyBrToEn";
import { Modal, Row, Col } from 'react-bootstrap';
import Simulacao from "../../../../components/simulacao";

interface ViewProps {
    host: string | undefined;
}

interface Beneficio {
    idBeneficio: number;
    valorDisponivel: number;
    idCoeficiente: number;
    qtdeParcelas: number;
    valorCoeficiente: number;
    dataCoeficiente: number;
    margemDisponivel: number;
    valorParcela: number;
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

    type CheckboxValues = string[];

    const router = useRouter();
    const {uuid, produto} = router.query;
    const [margem, setMargem] = useState([]);
    const [valorDisponivel, setValorDisponivel] = useState(0.00);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});
    // @ts-ignore
    const [beneficio, setBeneficio] = useState({id:0});
    const [modal, setModal] = useState(false);
    const [selected, setSelected] = useState({});

    const [novaSimulacao, setNovaSimulacao] = useState("");

    const getCredito = async (uuid: any, produto: any) => {

        if(typeof uuid === undefined){
            console.log(`UUID inválido: ${uuid}`);
            return true;
        }
        const produtosINSS = ['inss','credito-saude-inss','emprestimo-bpc-e-loas','emprestimo-para-representante-legal-inss'];

        produtosINSS.includes(produto.toLowerCase()) ? await axios.get(`${host}/edata/creditosINSS/${uuid}`)
            .then((response) => {
                setMargem(response.data.simulacoes);
                setValorDisponivel(response.data.max_disponivel);
                setData(response.data);
            })
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                alert(error);
            }) : await axios.get(`${host}/edata/creditosFGTS/${uuid}`)
            .then((response) => {
                setMargem(response.data.parcelas);
            })
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                alert(error);
            });

    }

    const trocarValorSimulacao = async (uuid,valor) => {
        setIsLoading(true);
        await axios.post(`${host}/edata/changeSimulacao`, {
            'uuid':uuid,
            'valor': valor,
        }).then((response) => {
            getCredito(uuid,produto);
        }).finally(()=>{
            setTimeout(()=>{
                setModal(false);
                setIsLoading(false);
            },2000)
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const handleModal = () => {
        setModal(true);
    }

    const saveSimulacao = async(selected:any): Promise<void> => {

        setIsLoading(true);

        await axios.post(`${host}/edata/saveSimulacao`, {
            'uuid': uuid,
            'beneficiosSelecionados': selected.toString(),
        }).then((response) => {
            console.log('Deu certo...');
            if (response.status === 200 && response.data.status === 'ok') {
                return window.location.href = `/${produto}/cadastro/${response.data.uuid}`;
            }
        }).then(() => {
            setIsLoading(false);
        }).catch((error) => {
            console.log(error);
        });

    }

    useEffect(() => {
        getCredito(uuid,produto);
    },[uuid]);

    const delay = 2000; // Tempo de espera após a última digitação (em milissegundos)
    let timer : any;

    useEffect(() => {
        return () => {
            clearTimeout(timer); // Limpa o timer quando o componente é desmontado
        };
    },[]);

    useEffect(()=>{
        console.log(selected);
    },[selected]);

    return (
        <>
            { isLoading ? <><PageProgress/><div>Carregando...</div></> : <>

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
                                    <h2>Encontramos as seguintes opções para seu empréstimo consignado, por favor
                                        selecione
                                        uma opção abaixo para continuar.</h2>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-12 mt-2">
                                    <div className="alert alert-success">Selecione a melhor opção de crédito</div>
                                </div>
                            </div>
                            <div className="row">
                                {
                                    margem.map((i: any, k) => {
                                        return <Simulacao item={i} key={k} data={data} setSelected={setSelected} saveSimulacao={saveSimulacao} selected={selected}/>;
                                    })
                                }
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
