import axios from "axios";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {GetServerSideProps} from "next";

import "@sweetalert2/themes/bootstrap-4/bootstrap-4.min.css";
import {Navbar} from "../../src/components/blocks/navbar";
import {Modal, Row, Col} from 'react-bootstrap';
import {getHostFromContext} from "../../src/utils/config";
import {Footer18} from "../../src/components/blocks/footer";
import PageProgress from "../../src/components/common/PageProgress";

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
    const [modal, setModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleModal = () => {
        setModal(true);
    }

    return (
        <>
            { isLoading ? <><PageProgress/><div>Carregando...</div></> : <>
                {/* ========== header ========== */}

                {/* Static Backdrop Start */}
                <Modal
                    backdrop="static"
                    keyboard={false}
                    show={modal}
                    onHide={() => setModal(false)}
                >
                    <Modal.Body>
                        <Row className="mb-3">
                            <Col><h5>Margem disponível</h5></Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                            teste
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>

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
                                    <h2>Encontramos as seguintes opções para seu empréstimo consignado, por favor selecione
                                        uma ou mais opções abaixo para continuar.</h2>
                                    <div className="alert alert-blue">SUJEITO À ANÁLISE DE CRÉDITO </div>
                                </div>
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
