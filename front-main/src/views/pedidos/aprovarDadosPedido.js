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
} from 'react-bootstrap';
import axios from "axios";
import swal from "@sweetalert/with-react";
import Swal from 'sweetalert2';
import {BASE_URL} from "../../config";
import {configAxios} from "../../constants";

const ModalAprovarPedido = (props) => {
    const { modalAprovar, setModalAprovar, idAprove, update } = props;
    const [isLoading, setIsLoading] = useState(false);
    const saveApprove = async () => {
        setIsLoading(true);
        await axios
            .post(
                `${BASE_URL}/data/v1/saveApprove`,
                {
                    id: idAprove
                },
                configAxios
            )
            .then((res) => {
                Swal.fire({
                    title: 'Sucesso',
                    width: 600,
                    padding: '3em',
                    icon: 'success',
                    color: '#1d4408',
                    timerProgressBar: true,
                    timer: 2000,
                    backdrop: `
                        rgba(255,209,85,0.5)
                        url("../../../img/coins.gif")
                        center top
                        no-repeat
                    `
                });
                setIsLoading(false);
                setTimeout(() => {
                    setModalAprovar(false);
                    update();
                },2000);
            })
            .catch((error) => {
                setIsLoading(false);
                swal('ERRO', `${error}`, 'error');
            });
    }

    return (
        <Modal
            show={modalAprovar}
            onHide={() => setModalAprovar(false)}
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>Aprovar dados de pedido de empréstimo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={12} md={12} lg={12} xl={12}>
                        <p>Os dados foram conferidos e estão aprovados? Caso sim selecione a opção "Aprovar pedido".</p>
                        <p><strong>Atenção, ao aprovar os dados o cliente será notificado sobre o andamento do pedido de empréstimo.</strong></p>
                    </Col>
                    <Col sm={12} md={12} lg={12} xl={12}>
                        <Button variant="primary" onClick={() => {saveApprove();}}>
                            { isLoading ? 'Aguarde' : 'Aprovar pedido'}
                        </Button>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => setModalAprovar(false)}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAprovarPedido;
