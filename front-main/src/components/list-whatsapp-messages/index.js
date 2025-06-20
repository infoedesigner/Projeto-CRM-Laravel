import React from 'react';
import {
    Accordion,
    Badge,
    Button,
    Card,
    Col,
    Row,
    useAccordionButton,
} from 'react-bootstrap';

const ListWhatsAppMessage = (props) => {
    const { item } = props;

    function CustomToggleButton({ children, eventKey, className }) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
            console.log('totally!')
        );

        return (
            <div className="d-grid gap-2 mb-3">
                <Button className={className} onClick={decoratedOnClick}>
                    {children}
                </Button>
            </div>
        );
    }

    return (
        <>
            <Col sm={12} md={12} lg={12} className="mb-3">
                <Accordion>
                    <CustomToggleButton
                        className="btn"
                        eventKey={`colapse${item.id}`}
                    >
                        {item.contato}{' '}
                    </CustomToggleButton>
                    <Accordion.Collapse eventKey={`colapse${item.id}`}>
                        <Card body className="no-shadow border">
                            <Badge
                                pill
                                bg="primary"
                                className="me-1 position-absolute e-n2 t-2 z-index-1"
                            >
                                {item.from_id}
                            </Badge>
                            <Card.Header>
                                <span className="heading mb-1 lh-1-25">
                                    {item.contato}{' '}
                                </span>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <a
                                            href={`https://api.whatsapp.com/send?phone=${item.from_id}`}
                                            target="_blank"
                                            className="btn btn-sm btn-success"
                                            rel="noreferrer"
                                        >
                                            Conversar
                                        </a>
                                    </Col>
                                    <Col>
                                        <a
                                            href="#"
                                            onClick={() => {
                                                console.log(item);
                                            }}
                                            className="btn btn-sm btn-outline-danger"
                                            rel="noreferrer"
                                        >
                                            Marcar como lido (ocultar)
                                        </a>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={8} md={8} lg={8}>
                                        <p>Mensagem(ns)</p>
                                        <ul>
                                            {item.messages?.length <= 0
                                                ? 'Nenhuma mensagem'
                                                : item.messages?.map(
                                                      (i, key) => {
                                                          return (
                                                              <li key={key}>
                                                                  {i.body}
                                                              </li>
                                                          );
                                                      }
                                                  )}
                                        </ul>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Accordion.Collapse>
                </Accordion>
            </Col>
        </>
    );
};

export default ListWhatsAppMessage;
