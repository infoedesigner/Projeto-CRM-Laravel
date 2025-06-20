import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Badge } from 'react-bootstrap';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import { BASE_URL } from '../config';
import { configAxios } from '../constants';
import CsLineIcons from '../cs-line-icons/CsLineIcons';

const viewBeneficiosInprocessPage = () => {
    const { uuid } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const getBeneficiosByUuid = async () => {
        setIsLoading(true);
        await axios
            .get(
                `${BASE_URL}/data/v1/listBeneficiosByUuid/${uuid}`,
                configAxios
            )
            .then((res) => {
                setData(res.data.beneficios);
            })
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                swal('ERRO', `${error}`, 'error');
            });
    };

    useEffect(() => {
        getBeneficiosByUuid();
    }, []);

    return isLoading ? (
        'Carregando...'
    ) : (
        <>
            <Row className="mb-3">
                <Col>
                    <Card>
                        <Card.Body>
                            <h3>Benefícios em processamento</h3>
                            <p>{uuid}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {data.map((item, key) => {
                return (
                    <Card className="mb-2 sh-10 sh-md-8" key={key}>
                        <Card.Body className="pt-0 pb-0 h-100">
                            <Row className="g-0 h-100 align-content-center">
                                <Col
                                    md="5"
                                    className="d-flex align-items-center mb-2 mb-md-0"
                                >
                                    <NavLink
                                        to={`/view-beneficios-inprocess/${item.uuid}`}
                                        className="body-link text-truncate"
                                    >
                                        {item.api_name}
                                    </NavLink>
                                </Col>
                                <Col
                                    md="2"
                                    className="d-flex align-items-center text-muted text-medium mb-1 mb-md-0"
                                >
                                    <Badge
                                        bg="outline-tertiary"
                                        className="me-1"
                                    >
                                        {item.code_response}
                                    </Badge>
                                </Col>
                                <Col
                                    md="3"
                                    className="d-flex align-items-center text-medium text-danger justify-content-center"
                                >
                                    <span className="text-medium">
                                        {Number(item.status) === 1
                                            ? 'Em processamento'
                                            : 'Processado'}
                                    </span>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                );
            })}
        </>
    );
};

export default viewBeneficiosInprocessPage;
