import React, {useEffect, useState} from "react";
import {Accordion, Badge, Col, Row, Spinner} from "react-bootstrap";
import {Divider} from "@mui/material";

const MotivoBlock = (props) => {

    const { tabela } = props;

    const [motivo, setMotivo] = useState([]);

    useEffect(() => {
        setMotivo(tabela.motivo_bloqueio);
    },[tabela]);

    return (
        <>
            <Row>
                <Col><strong>{motivo.tabela}</strong></Col>
            </Row>
            <Row>
                <Col>{JSON.stringify(motivo.blockByRegrasLabel)}</Col>
            </Row>
            <Divider>x</Divider>
        </>
    );
}

export default MotivoBlock;
