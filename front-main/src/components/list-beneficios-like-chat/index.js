import React from 'react';
import { Card, Col, Badge, Row } from 'react-bootstrap';
import Clamp from 'components/clamp';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { dateEnBr } from '../../utils';

const BeneficiosLikeChat = ({ item, setId }) => {
    return (
        <>
            <Row className="pb-5">
                <Col>
                    <Card.Body className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                        <div className="d-flex flex-column">
                            <div><a href="#" onClick={(e)=>{setId(item.id)}}>{item.nome}</a></div>
                            <div className="text-small text-muted clamp-line">
                                {dateEnBr(item.data_nascimento)}
                            </div>
                            <div>{item.cpf}</div>
                        </div>
                    </Card.Body>
                </Col>
                <Col xs="auto">
                    <CsLineIcons
                        icon="arrow-top-right"
                        fill="#ededed"
                        stroke="#CCC"
                    />
                </Col>
            </Row>
        </>
    );
};
export default BeneficiosLikeChat;
