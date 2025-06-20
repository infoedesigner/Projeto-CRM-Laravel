import React, { useEffect, useState } from 'react';
import Board, { moveCard } from '@lourenci/react-kanban';
import './styles/leads-board.css';
import {
    Button,
    Card,
    Col,
    Form, FormControl,
    FormGroup, FormLabel, InputGroup,
    Modal,
    Row,
    Spinner,
} from 'react-bootstrap';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import Select from 'react-select';
import HtmlHead from '../components/html-head/HtmlHead';
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';
import RenderKanbanCard from '../components/render-kanban-card';
import { BASE_URL } from '../config';
import { configAxios } from '../constants';

const LeadsBoardPage = () => {
    const titleUI = 'Leads board';
    const descriptionUI = 'Acompanhamento de situação de leads';

    const breadcrumbs = [{ to: '', text: 'Home' }];
    registerLocale('ptBR', ptBR);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingCard, setIsLoadingCard] = useState(false);
    const [historico, setHistorico] = useState('');
    const [startTimeDate, setStartTimeDate] = useState(null);
    const [boardJson, setBoardJson] = useState({
        columns: [
            {
                id: 1,
                title: 'Carregando',
                cards: [
                    {
                        id: 1,
                        nome: 'Aguarde',
                        canal: '...',
                        status: 1,
                    },
                ],
            },
        ],
    });
    const [historicoModal, setHistoricoModal] = useState(false);
    const [lead, setLead] = useState({});
    const [valueTipoContato, setValueTipoContato] = useState({});

    const [buscaKey, setBuscaKey] = useState('');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const optionsTipoContato = [
        { value: 'Telefone', label: 'Telefone' },
        { value: 'WhatsApp', label: 'WhatsApp' },
        { value: 'E-mail', label: 'E-mail' },
    ];

    const getBoards = async () => {
        setIsLoading(true);
        await axios
            .get(`${BASE_URL}/data/v1/leads-board`, configAxios)
            .then((res) => {
                setBoardJson(res.data);
            })
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                swal('ERRO', `${error}`, 'error');
            });
    };

    const changeLeadStatus = async (card, source, destination) => {
        setIsLoadingCard(true);
        await axios
            .post(
                `${BASE_URL}/data/v1/changeLeadBoard`,
                {
                    id: card.id,
                    from_status: source.fromColumnId,
                    to_status: destination.toColumnId,
                },
                configAxios
            )
            .then((res) => {
                setIsLoadingCard(false);
            })
            .catch((error) => {
                setIsLoading(false);
                swal('ERRO', `${error}`, 'error');
            });
    };

    const saveHistorico = async () => {
        await axios
            .post(
                `${BASE_URL}/data/v1/historicoLead`,
                {
                    id_lead: lead.id,
                    data_contato: startDate,
                    hora_contato: startTimeDate,
                    descricao: historico,
                    tipo_contato: valueTipoContato.value,
                },
                configAxios
            )
            .then((res) => {
                swal('Yes', `Registro salvo com sucesso`, 'success');
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
        getBoards();
    }, []);

    const handleMouseMove = (event) => {
        console.log({
            x: event.clientX,
            y: event.clientY,
        });
    };

    const addHistoricoModal = async (id) => {
        await axios
            .get(`${BASE_URL}/data/v1/leads/${id}`, configAxios)
            .then((res) => {
                setLead(res.data.data);
            })
            .finally(() => {
                setHistoricoModal(true);
            })
            .catch((error) => {
                swal('ERRO', `${error}`, 'error');
            });
    };

    const LeadsBoard = () => {
        return isLoading ? (
            <Spinner
                animation="border"
                style={{
                    width: '1.5rem',
                    height: '1.5rem',
                }}
            />
        ) : (
            <Board
                renderCard={(
                    { id, nome, canal, status, historico_count },
                    { dragging }
                ) => (
                    <RenderKanbanCard
                        dragging={dragging}
                        id={id}
                        nome={nome}
                        canal={canal}
                        status={status}
                        historico_count={historico_count}
                        addHistoricoModal={addHistoricoModal}
                    />
                )}
                onCardDragEnd={(board, card, source, destination) => {
                    changeLeadStatus(card, source, destination);
                    setBoardJson(board);
                }}
                disableColumnDrag
                initialBoard={boardJson}
            />
        );
    };

    return (
        <>
            <HtmlHead title={titleUI} description={descriptionUI} />
            <Modal
                size="lg"
                backdrop="static"
                keyboard={false}
                show={historicoModal}
                onHide={() => setHistoricoModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="staticBackdropLabel">
                        Cadastro de histórico
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="pb-3">
                        <Col sm={12} md={6} lg={6} xl={6}>
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    defaultValue={lead?.nome}
                                />
                                <Form.Label>NOME</Form.Label>
                            </div>
                        </Col>
                        <Col sm={12} md={6} lg={6} xl={6}>
                            <div className="top-label">
                                <Form.Control
                                    type="text"
                                    defaultValue={lead?.cpf}
                                />
                                <Form.Label>CPF</Form.Label>
                            </div>
                        </Col>
                    </Row>
                    <Row className="pb-3">
                        <Col sm={12} md={6} lg={4} xl={4}>
                            <div className="top-label">
                                <Select
                                    classNamePrefix="react-select"
                                    options={optionsTipoContato}
                                    value={valueTipoContato}
                                    onChange={setValueTipoContato}
                                    placeholder=""
                                />
                                <Form.Label>TIPO DE CONTATO</Form.Label>
                            </div>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={4}>
                            <div className="top-label">
                                <DatePicker
                                    className="form-control"
                                    locale={ptBR}
                                    onChange={(date) => setStartDate(date)}
                                    selected={startDate}
                                    dateFormat="dd/MM/yyyy"
                                />
                                <Form.Label>DATA PRÓX. CONTATO</Form.Label>
                            </div>
                        </Col>
                        <Col>
                            <div className="top-label">
                                <DatePicker
                                    className="form-control"
                                    dateFormat="h:mm"
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    selected={startTimeDate}
                                    onChange={(date) => setStartTimeDate(date)}
                                />
                                <Form.Label>HORA</Form.Label>
                            </div>
                        </Col>
                    </Row>
                    <Row className="pb-3">
                        <Col lg="12">
                            <div className="top-label">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    onChange={(e) => {
                                        setHistorico(e.target.value);
                                    }}
                                />
                                <Form.Label>HISTÓRICO</Form.Label>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button
                                variant="outline-primary"
                                onClick={() => {
                                    saveHistorico();
                                    setHistoricoModal(false);
                                }}
                            >
                                Salvar
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setHistoricoModal(false)}
                    >
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="page-title-container">
                <Row>
                    <Col className="mt-3 mb-5" sm={12} md={3} lg={3} xl={3}>
                        <InputGroup>
                            <FormLabel>Data inicial</FormLabel>
                            <DatePicker className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" locale={ptBR}/>
                        </InputGroup>
                    </Col>
                    <Col className="mt-3 mb-5" sm={12} md={3} lg={3} xl={3}>
                        <InputGroup>
                            <FormLabel>Data final</FormLabel>
                            <DatePicker className="form-control" selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" loca le={ptBR}/>
                        </InputGroup>
                    </Col>
                    <Col className="mt-3 mb-5" sm={12} md={6} lg={6} xl={6}>
                        <FormLabel>Data final</FormLabel>
                        <InputGroup>
                            <FormControl
                                placeholder="Nome ou CPF"
                                value={buscaKey}
                                onChange={(e) => {
                                    setBuscaKey(e.target.value);
                                }}
                            />
                            <Button
                                variant="outline-secondary"
                                id="button-addon2"
                                onClick={getBoards}
                            >
                                Buscar
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    {/* Title Start */}
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4">
                            {titleUI}{' '}
                            {isLoadingCard ? (
                                <Spinner
                                    animation="grow"
                                    variant="light"
                                    style={{
                                        width: '1.4rem',
                                        height: '1.4rem',
                                    }}
                                />
                            ) : (
                                ''
                            )}
                        </h1>
                        <h4 className="text-primary">
                            {descriptionUI}
                            <span role="img" aria-label="donut">
                                🤗
                            </span>
                        </h4>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                    {/* Title End */}
                </Row>
            </div>
            <LeadsBoard setHistoricoModal={setHistoricoModal} />
        </>
    );
};

export default LeadsBoardPage;
