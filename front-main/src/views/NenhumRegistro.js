import React, {useEffect} from 'react';
import {Row, Col, Card, Spinner} from 'react-bootstrap';

const NenhumRegistro = () => {
    return (<>
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        Nenhum registro encontrado.
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>);
}

export default NenhumRegistro;