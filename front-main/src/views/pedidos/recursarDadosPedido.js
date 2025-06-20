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

const ModalRecursarPedido = (props) => {
    const { modal, setModal, id, update } = props;
    const [isLoading, setIsLoading] = useState(false);
    const saveApprove = async () => {
        setIsLoading(true);
        await axios
            .post(
                `${BASE_URL}/data/v1/saveApprove`,
                {
                    id
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
                    setModal(false);
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
            show={modal}
            onHide={() => setModal(false)}
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>Recursar pedido de empréstimo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={12} md={12} lg={12} xl={12}>
                        <p><strong>Atenção, ao reprovar os dados o cliente será notificado sobre a recusa do pedido de empréstimo.</strong></p>
                    </Col>
                    <Col sm={12} md={12} lg={12} xl={12}>
                        <Button variant="primary" onClick={() => {saveApprove()}}>
                            { isLoading ? 'Aguarde' : 'Recusar pedido'}
                        </Button>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => setModal(false)}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRecursarPedido;
