import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Card,
    Spinner,
    Button,
    InputGroup,
    FormControl, FormLabel, Modal,
} from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import DatePicker from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import CheckboxTree from 'react-checkbox-tree';
import {CheckIcon} from "@heroicons/react/outline";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Icon } from '@iconify/react';
import Pagination from "react-js-pagination";
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';
import NenhumRegistro from './NenhumRegistro';
import { configAxios } from '../constants';
import { BASE_URL } from '../config';
import ListEsteiraProposta from '../components/list-esteira-propostas';
import ModalFichaCadastral from './fichas/modalFichaCadastral';
import ModalBeneficios from './fichas/modalBeneficios';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import ConsignadoInss from "./viewBeneficios/ConsignadoInss";

const EsteiraPropostasPage = () => {
    const title = 'Esteira de propostas';
    const description = 'Controle de vendas eficaz!';

    const breadcrumbs = [{ to: '', text: 'Home' }];
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);
    const [mFichaCadastral, setMFichaCadastral] = useState(false);
    const [mBeneficios, setMBeneficios] = useState(false);
    const [itemModal, setItemModal] = useState({});

    const [buscaKey, setBuscaKey] = useState('');
    const [startDate, setStartDate] = useState(new Date((new Date()).setDate((new Date()).getDate() - 3)));
    const [endDate, setEndDate] = useState(new Date());
    const [rotinas, setRotinas] = useState(undefined);

    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);

    const [idBeneficio, setIdBeneficio] = useState(0);
    const [idEsteira, setIdEsteira] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    const GET_DATA = async (page) => {
        configAxios.params = {
            key: buscaKey,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            page:page > 1 ? page : 1,
            status: 0
        };
        await axios
            .get(`${BASE_URL}/data/v1/esteiraPropostas`, configAxios)
            .then((response) => {
                setData(response.data.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
    };

    const GET_ROTINAS = async () => {
        configAxios.params = {tipo: 'Esteira'};
        await axios
            .get(
                `${BASE_URL}/data/v1/rotinas/menuRotinasEdicao/json`,
                configAxios
            )
            .then((res) => {
                if (res.status === 200) {
                    setRotinas(res.data);
                }
            })
            // eslint-disable-next-line no-shadow
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        GET_DATA(1);
        GET_ROTINAS();
    },[]);

    useEffect(() => {
        GET_DATA();
        const intervalId = setInterval(() => {
            GET_DATA();
        }, 1000 * 60); // in milliseconds
        return () => clearInterval(intervalId);
    }, []);

    const showModalFichaCadastral = async (id) => {
        await axios
            .get(`${BASE_URL}/data/v1/esteiraPropostas/${id}`, configAxios)
            .then((res) => {
                setItemModal(res.data);
            })
            .then(() => {
                setMFichaCadastral(true);
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    };

    const showBeneficios = async (cpf) => {
        await axios
            .get(`${BASE_URL}/data/v1/beneficiosByCPF/${cpf}`, configAxios)
            .then((res) => {
                setItemModal(res.data);
            })
            .then(() => {
                setMBeneficios(true);
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    };

    if (loading)
        return (
            <>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            </>
        );
    if (error) return `Erro! ${error.message}`;

    const totalRegistros = data.data.length;

    return (
        <>
            <HtmlHead title={title} description={description} />
            <ModalFichaCadastral
                mFichaCadastral={mFichaCadastral}
                setMFichaCadastral={setMFichaCadastral}
                itemModal={itemModal}
            />
            <ModalBeneficios
                mBeneficios={mBeneficios}
                setMBeneficios={setMBeneficios}
                itemModal={itemModal}
            />
            <Modal
                backdrop="static"
                className="modal-right large"
                show={modalOpen}
                onHide={() => {
                    setModalOpen(false);
                    setIdBeneficio(0);
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Dados do pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ConsignadoInss idBeneficio={idBeneficio} GET_DATA={GET_DATA} idEsteira={idEsteira}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setModalOpen(false);
                        }}
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="page-title-container">
                <Row>
                    {/* Title Start */}
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4">{title}</h1>
                        <h4 className="text-primary">
                            {description}{' '}
                            <span role="img" aria-label="donut">
                                🤝
                            </span>
                        </h4>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                    {/* Title End */}
                </Row>
            </div>
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
                            onClick={GET_DATA}
                        >
                            Buscar
                        </Button>
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col sm={12} md={12} lg={12} xl={12}>
                    <Pagination
                        activePage={data?.current_page ? data?.current_page : 0}
                        itemsCountPerPage={data?.per_page ? data?.per_page : 0 }
                        totalItemsCount={data?.total ? data?.total : 0}
                        onChange={(pageNumber) => {
                            GET_DATA(pageNumber)
                        }}
                        pageRangeDisplayed={20}
                        itemClass="page-item"
                        linkClass="page-link"
                    />
                </Col>
            </Row>

            <Row>
                <Col sm={4} md={4} lg={3}>
                    <Card>
                        <Card.Body>
                            {
                                rotinas === undefined ? 'Carregando...' : <CheckboxTree
                                    nodes={rotinas}
                                    checked={checked}
                                    expanded={expanded}
                                    onCheck={(c) => setChecked(c)}
                                    onExpand={(e) => setExpanded(e)}
                                    icons={{
                                        check: <Icon icon="tabler:circle-check-filled"/>,
                                        uncheck: <Icon icon="tabler:circle-check" />,
                                        halfCheck: <Icon icon="tabler:discount-check" />,
                                        expandClose: <Icon icon="tabler:list" />,
                                        expandOpen: <Icon icon="tabler:list-details" />,
                                        expandAll: <Icon icon="tabler:list-tree" />,
                                        collapseAll: <Icon icon="tabler:list" />,
                                        parentClose: <Icon icon="tabler:eye-exclamation" />,
                                        parentOpen: <Icon icon="tabler:eye-check" />,
                                        leaf: <Icon icon="tabler:arrow-move-right" />
                                    }}
                                />
                            }
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Row>
                        {totalRegistros > 0 ? (
                            data.data.map((item) => (
                                <ListEsteiraProposta key={item.id}
                                                     item={item}
                                                     showModalFichaCadastral={
                                                         showModalFichaCadastral
                                                     }
                                                     showBeneficios={showBeneficios}
                                                     setIdBeneficio={setIdBeneficio}
                                                     setModalOpen={setModalOpen}
                                                     setIdEsteira={setIdEsteira}
                                />
                            ))
                        ) : (
                            <NenhumRegistro />
                        )}
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default EsteiraPropostasPage;
