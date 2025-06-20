import axios from "axios";
import {useRouter} from "next/router";
import React, {useCallback, useEffect, useState} from "react";
import {GetServerSideProps} from "next";

import "@sweetalert2/themes/bootstrap-4/bootstrap-4.min.css";
import {Row, Col, Button, Alert, Card, Badge} from 'react-bootstrap';
import DropDocument from "components/docs/drop-doc";
import FotoFace from "components/docs/foto-face";
import VideoFace from "components/docs/video-face";
import { getHostFromContext } from "utils/config";
import PageProgress from "components/common/PageProgress";
import ProgressList from "components/common/ProgressList";
import NavbarInterno from "components/blocks/navbar/NavbarInterno";
import FooterInterno from "components/blocks/footer/FooterInterno";
import Swal from "sweetalert2";
import { Loader } from "components/common/Loader";
import Loading from 'icons/lineal/Loading';


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
    const { beneficio, tipo } = router.query; //26582    
    const [isLoadingPage, setIsLoadingPage] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); 
    const [passo, setPasso] = useState(1);    
    const [etapas, setEtapas] = useState([]);
        

    const changeEtapas = async () => {
        
        setEtapas([]);

        switch(tipo){
            case 'conta-benef':
                // @ts-ignore
                setEtapas(['doc-pessoal', 'foto', 'prova-vida', 'alerta', 'aviso-link']);
                break;
            case 'conta-repres':
                // @ts-ignore
                setEtapas(['doc-pessoal', 'doc-benef','foto', 'prova-vida', 'alerta', 'aviso-link']);
                break;
            case 'cartao-benef':
                // @ts-ignore
                setEtapas(['doc-pessoal', 'cartao-benef', 'cartao-conta', 'foto', 'prova-vida', 'alerta', 'aviso-link']);
                break;
            case 'cartao-repres':
                // @ts-ignore
                setEtapas(['doc-pessoal', 'doc-benef', 'cartao-benef', 'cartao-conta', 'foto', 'prova-vida', 'alerta', 'aviso-link']);
                break;
            default:
                if(etapas.length == 0){
                    Swal.fire({
                        title: 'Não foi possível identificar o seu perfil.',
                        html: `<p>Entre em contato conosco pelo WhatsApp e informe que não conseguiu fazer a prova de vida.</p> <a href='https://wa.me/554121186622?text="Oi,Não consegui realizar a prova de vida"'>(41)2118-6622</a> `,
                        icon: 'error'
                    }).then( () => {
                        router.back();
                    })
                }                 
                break;        
        }
    }

    const addPasso = () => {
        setPasso(passo+1) ; 
    }

    useEffect( () => {
        changeEtapas();       
    },[])

    //TODO: Buscar dados do cliente na base de dados para comparar com resultado do OCR
    //TODO: Registar cada passo que o cliente executar para exibir no backoffice

    return (
        <>
            { isLoadingPage ? <><PageProgress/><div>Carregando...</div></> : <>
                {/* ========== header ========== */}

                {/* Static Backdrop Start */}

                <header className="wrapper bg-light">
                    <NavbarInterno
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
                            <div className="row justify-content-center h-500">
                                <div className="col-sm-12 col-lg-8">
                                    <Card className="h-min-25">
                                        <Card.Body>                                            
                                            <div className="flex align-content-center h-10">
                                                <h3>Envio de documentos para o benefício { beneficio } </h3>
                                                <Row className="justify-content-between flex align-content-center bg-blue h-1 mt-7" >
                                                    {etapas.map((etapa, index) => (
                                                        <Col key={index} className="text-center fs-24 m-0 p-0">
                                                            <Badge pill 
                                                                bg= { index+1 <= passo ? "blue text-white" : "gray border border-blue" }
                                                                className="text-blue circle absolute w-8 h-8 p-0 m-0 flex align-content-center" >
                                                                { index + 1 }
                                                            </Badge>
                                                            { index < etapas.length && <hr className="m-0" />}
                                                        </Col>
                                                    ))}
                                                </Row>                                          
                                            </div>
                                            <>                                                                                               
                                                <div className="mt-10 text-center py-7">
                                                    { isLoading ? <Loader message="Por favor aguarde!" /> :  <>
                                                        { ['doc-benef','doc-pessoal', 'cartao-benef' ,'cartao-conta' ].includes(etapas[passo-1])  ? 
                                                            (<>
                                                                <DropDocument host={host} beneficio={beneficio} etapa={etapas[passo-1]} addPasso={addPasso} setIsLoading={setIsLoading} />                                
                                                            </>) : null } 
                                                        { etapas[passo-1] == 'foto' ? 
                                                            <FotoFace host={host} beneficio={beneficio} etapa={etapas[passo-1]} addPasso={addPasso} setIsLoading={setIsLoading}  /> 
                                                            : null } 

                                                        { etapas[passo-1] == 'prova-vida' ? 
                                                            <VideoFace host={host} beneficio={beneficio} etapa={etapas[passo-1]} addPasso={addPasso} setIsLoading={setIsLoading}  /> 
                                                            : null }                                                     

                                                        { etapas[passo-1] == 'alerta' ? <>
                                                                <h5 className="text-red fw-bold fs-24">Atenção! Nem a Carrera Carneiro e tão pouco o banco solicitam a devolução de crédito, depósitos, transferências ou pagamentos por crédito concedidos.</h5>
                                                                <Button onClick={(addPasso)}>Clique aqui se entendeu.</Button>
                                                            </> : null }

                                                        { etapas[passo-1] == 'aviso-link' ? 
                                                            <div className="text-blue fw-bold fs-24">Aguarde que um dos nossos consultores enviará um link para assinatura do seu contrato! 
                                                                <p className="text-dark fw-bold fs-24">Se tiver alguma dúvida chame no WhatsApp
                                                                <a href='https://wa.me/554121186622?text="Oi,tenho uma dúvida"'> (41)2118-6622</a> opção 3-Assinatura do meu contrato de Empréstimo </p>
                                                            </div>: null } </>
                                                    }    
                                                </div>                                                
                                            </>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <FooterInterno/>
            </>
            }
        </>
    );

}

export default View;
