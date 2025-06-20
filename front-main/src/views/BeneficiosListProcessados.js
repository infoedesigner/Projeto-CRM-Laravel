import React, {useCallback, useEffect, useState} from 'react';
import {
    Row,
    Col,
    Spinner,
    Button,
    InputGroup,
    FormControl,
    Card,
    Tab,
    Nav,
} from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import {OverlayScrollbarsComponent} from 'overlayscrollbars-react';
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import BreadcrumbList from '../components/breadcrumb-list/BreadcrumbList';
import {configAxios} from '../constants';
import {BASE_URL} from '../config';
import ModalFichaCadastral from './fichas/modalFichaCadastral';
import ModalBeneficios from './fichas/modalBeneficios';
import BeneficiosLikeChat from '../components/list-beneficios-like-chat';
import ConsignadoInss from "./viewBeneficios/ConsignadoInss";

const BeneficiosListProcessadosPage = () => {
    const title = 'Benefícios';
    const description = 'Benefícios processados';

    const breadcrumbs = [{to: '', text: 'Home'}];
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);
    const [tabelas, setTabelas] = useState([]);
    const [mFichaCadastral, setMFichaCadastral] = useState(false);
    const [mBeneficios, setMBeneficios] = useState(false);
    const [itemModal, setItemModal] = useState({});
    const [buscaKey, setBuscaKey] = useState('');
    const [rotinas, setRotinas] = useState([]);
    const [rotinasClientes, setRotinasClientes] = useState([]);
    const [id, setId] = useState(0);

    const [startDate, setStartDate] = useState(new Date((new Date()).setDate((new Date()).getDate() - 3)));
    const [endDate, setEndDate] = useState(new Date());

    const GET_DATA = useCallback(async () => {
        configAxios.params = {key: buscaKey};
        await axios
            .get(`${BASE_URL}/data/v1/beneficios?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&key=${buscaKey}`, configAxios)
            .then((response) => {
                setData(response.data.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
    }, [buscaKey]);

    const GET_TABELAS = async () => {
        configAxios.params = {term: ''};
        await axios
            .get(`${BASE_URL}/data/v1/tabela`, configAxios)
            .then((response) => {
                setTabelas(response.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
    };

    const GET_ROTINAS = async () => {
        configAxios.params = {term: ''};
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

    const GET_ROTINAS_CLIENTES = async () => {
        configAxios.params = {term: ''};
        await axios
            .get(`${BASE_URL}/data/v1/rotinas?tipo=RotinaCliente`, configAxios)
            .then((response) => {
                setRotinasClientes(response.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
    };

    const [selectedTab, changeSelectedTab] = useState('rotinasClientes');

    useEffect(() => {
        GET_DATA();
    }, [buscaKey]);

    useEffect(() => {
        GET_TABELAS();
        GET_ROTINAS();
        GET_ROTINAS_CLIENTES();
    }, []);

    const showModalFichaCadastral = async (id) => {
        await axios
            .get(
                `${BASE_URL}/data/v1/esteiraPropostas/${id}/${buscaKey}`,
                configAxios
            )
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

    const totalRegistros = data.data?.length;

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
                <Col className="mt-3 mb-5" sm={12} md={4} lg={4} xl={4}>
                    <InputGroup>
                        <FormControl
                            placeholder="Busca por nome ou CPF"
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
            {totalRegistros > 0 && (
                <Row>
                    <Col
                        xs="auto"
                        className="w-100 w-md-auto h-100"
                        id="listView"
                    >
                        <div className="sw-md-30 sw-lg-40 w-100 d-flex flex-column h-100">
                            <Card className="h-100">
                                <Tab.Container activeKey={selectedTab}>
                                    <Card.Header className="border-0 pb-0">
                                        <Nav
                                            className="nav-tabs-line card-header-tabs"
                                            variant="tabs"
                                            activeKey={selectedTab}
                                        >
                                            <Nav.Item className="w-50 text-center">
                                                <Nav.Link
                                                    href="#rotinasClientes"
                                                    className={`${
                                                        selectedTab ===
                                                        'rotinasClientes' &&
                                                        'active'
                                                    }`}
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        changeSelectedTab(
                                                            'rotinasClientes'
                                                        );
                                                    }}
                                                >
                                                    Rotinas clientes
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item className="w-50 text-center">
                                                <Nav.Link
                                                    href="#rotinas"
                                                    className={`${
                                                        selectedTab ===
                                                        'rotinas' &&
                                                        'active'
                                                    }`}
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        changeSelectedTab(
                                                            'rotinas'
                                                        );
                                                    }}
                                                >
                                                    Rotinas
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Card.Header>
                                    <Card.Body className="h-100-card">
                                        <Tab.Content className=" h-100">
                                            <Tab.Pane
                                                active={
                                                    selectedTab ===
                                                    'rotinasClientes'
                                                }
                                                className="h-100 scroll-out"
                                            >
                                                <OverlayScrollbarsComponent
                                                    className="h-100 nav py-0"
                                                    options={{
                                                        scrollbars: {
                                                            autoHide: 'leave',
                                                            autoHideDelay: 600,
                                                        },
                                                        overflowBehavior: {
                                                            x: 'hidden',
                                                            y: 'scroll',
                                                        },
                                                    }}
                                                >
                                                    <SortableTree
                                                        style={{
                                                            height: '500px',
                                                        }}
                                                        canDrag={({node}) => false }
                                                        canDrop={() => false}
                                                        treeData={rotinas}
                                                        onChange={(treeNew) =>
                                                            setRotinas(treeNew)
                                                        }
                                                        onClick={(event) => {
                                                            console.log(event);
                                                        }}
                                                        isVirtualized={false}
                                                        theme={ FileExplorerTheme }
                                                        generateNodeProps={( rowInfo ) => {
                                                            const {node} =
                                                                rowInfo;
                                                            return { onClick: () => {
                                                                    console.log( rowInfo );
                                                                },
                                                            };
                                                        }}
                                                    />
                                                </OverlayScrollbarsComponent>
                                            </Tab.Pane>
                                            <Tab.Pane
                                                active={ selectedTab === 'rotinas' }
                                                className="h-100 scroll-out"
                                            >
                                                <OverlayScrollbarsComponent
                                                    className="h-100 nav py-0"
                                                    options={{
                                                        scrollbars: {
                                                            autoHide: 'leave',
                                                            autoHideDelay: 600,
                                                        },
                                                        overflowBehavior: {
                                                            x: 'hidden',
                                                            y: 'scroll',
                                                        },
                                                    }}
                                                >
                                                    {rotinasClientes.map(
                                                        (item, key) => {
                                                            return (
                                                                <div key={key}>
                                                                    { item.rotina }
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </OverlayScrollbarsComponent>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Card.Body>
                                </Tab.Container>
                            </Card>
                        </div>
                    </Col>
                    <Col xs="auto" className="w-100 w-md-auto h-100">
                        <div className="sw-md-30 sw-lg-40 w-100 d-flex flex-column h-100">
                            <Card className="h-100 mb-3">
                                <Tab.Container defaultActiveKey="clientes">
                                    <Card.Header className="border-0 pb-0">
                                        <Nav
                                            className="nav-tabs-line"
                                            variant="tabs"
                                            activeKey="clientes"
                                        >
                                            <Nav.Item>
                                                <Nav.Link
                                                    eventKey="clientes"
                                                >
                                                    Clientes (Benefícios)
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Card.Header>
                                    <Card.Body>
                                        <Tab.Content>
                                            <Tab.Pane
                                                eventKey="clientes"
                                            >
                                                <Card.Text>
                                                    <OverlayScrollbarsComponent
                                                        className="h-100 nav py-0"
                                                        options={{
                                                            scrollbars: {
                                                                autoHide:
                                                                    'leave',
                                                                autoHideDelay: 600,
                                                            },
                                                            overflowBehavior: {
                                                                x: 'hidden',
                                                                y: 'scroll',
                                                            },
                                                        }}
                                                    >
                                                        {data.data?.map(
                                                            (item, key) => {
                                                                return (
                                                                    <BeneficiosLikeChat key={key} item={item} setId={setId} />
                                                                );
                                                            }
                                                        )}
                                                    </OverlayScrollbarsComponent>
                                                </Card.Text>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Card.Body>
                                </Tab.Container>
                            </Card>
                        </div>
                    </Col>
                    <Col>
                        <div className="w-100 d-flex flex-column h-100">
                            <ConsignadoInss id={id}/>
                        </div>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default BeneficiosListProcessadosPage;
