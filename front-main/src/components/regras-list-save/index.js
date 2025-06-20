import React from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import {Divider} from "@mui/material";
import {valorRegras} from "../../utils";

const RegrasListSave = (props) => {
    const { item, delRegra } = props;

    const renderTipo = (tipo) => {
        switch(tipo){
            case 9 : return <>
                <ul>
                    <li>Idade de <strong>{item.idade_de}</strong> até <strong>{item.idade_ate}</strong> | Prazo de {item.prazo_de} até {item.prazo_ate} | Valor de {item.valor_de} até {item.valor_ate}</li>
                    <li className="text-danger">Especies bloqueadas: {item.especies_bloqueadas}</li>
                    <li className="text-primary">Especies liberadas: {item.especies_permitidas}</li>
                </ul>
            </>;
            case 4 : return <>
                <ul>
                    <li>Valor: {valorRegras(item.valor)}</li>
                    <li className="text-danger">Especies bloqueadas: {item.especies_bloqueadas}</li>
                    <li className="text-primary">Especies liberadas: {item.especies_permitidas}</li>
                </ul>
            </>;
            default: return <>
                <ul>
                    <li>Valor: {item.valor}</li>
                    <li className="text-danger">Especies bloqueadas: {item.especies_bloqueadas}</li>
                    <li className="text-primary">Especies liberadas: {item.especies_permitidas}</li>
                </ul>
            </>;
        }
    }

    return (
        <>
            <Row className="g-0 m-3">
                <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                    <div className="w-100 d-flex h-100" />
                    <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center mt-n2">
                        <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                    </div>
                    <div className="w-100 d-flex h-100 justify-content-center position-relative">
                        <div className="line-w-1 bg-separator h-100 position-absolute" />
                    </div>
                </Col>
                <Col>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-column justify-content-center">
                            <h5><strong>{item.nome_banco} { item.regra } [{ item.id_regra_negocio }]</strong></h5>
                        </div>
                        {
                            renderTipo(item.tipo)
                        }
                        <div><Button variant="outline-danger" size="sm" onClick={() => {delRegra(item.id)}}>Excluir</Button></div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col><hr /></Col>
            </Row>
        </>
    );

}

export default RegrasListSave;
