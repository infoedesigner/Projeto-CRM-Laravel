import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Button, Modal, Form } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';

const RelatoriosPage = () => {
    registerLocale('ptBr', ptBR);
    const title = 'Relatórios';
    const description = 'Relatórios analíticos e sintéticos';

    const breadcrumbs = [{ to: '', text: 'Home' }];
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [value, setValue] = useState();

    const options = [
        { value: 'Leads', label: 'Leads' },
        { value: 'Consultas', label: 'Consultas' },
        { value: 'Contratos', label: 'Contratos' },
    ];

    return (
        <>
            <HtmlHead title={title} description={description} />
            <div className="page-title-container">
                <Row>
                    {/* Title Start */}
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4">{title}</h1>
                        <h4 className="text-primary">{description}</h4>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                    {/* Title End */}
                </Row>
                <Row className="g-2 mb-2">
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title>Relatórios</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col sm={12} md={12} lg={6} xl={2} xxl={2}>
                                        <Form.Label className="d-block">
                                            Selecione um tipo de relatório
                                        </Form.Label>
                                        <Select
                                            classNamePrefix="react-select"
                                            options={options}
                                            value={value}
                                            onChange={setValue}
                                            placeholder="Selecione uma opção"
                                        />
                                    </Col>
                                    <Col sm={12} md={12} lg={6} xl={2} xxl={2}>
                                        <Form.Label className="d-block">
                                            Data início
                                        </Form.Label>
                                        <DatePicker
                                            className="form-control"
                                            locale={ptBR}
                                            dateFormat="dd/MM/yyyy"
                                            selected={startDate}
                                            onChange={(date) =>
                                                setStartDate(date)
                                            }
                                        />
                                    </Col>
                                    <Col sm={12} md={12} lg={6} xl={2} xxl={2}>
                                        <Form.Label className="d-block">
                                            Data fim
                                        </Form.Label>
                                        <DatePicker
                                            className="form-control"
                                            locale={ptBR}
                                            dateFormat="dd/MM/yyyy"
                                            selected={endDate}
                                            onChange={(date) =>
                                                setEndDate(date)
                                            }
                                        />
                                    </Col>
                                </Row>
                                <Row className="mt-7">
                                    <Col>
                                        <Button>Filtrar</Button>
                                    </Col>
                                    <Col>
                                        <Button variant="tertiary">
                                            Exportar Excel
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default RelatoriosPage;
