import React from 'react';
import {
    Button,
    ButtonGroup,
    Card,
    Col,
    Dropdown,
    Row,
    Tooltip,
    OverlayTrigger,
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { dateEnBr } from '../../utils';

const CardProcessamento = (props) => {
    const { item } = props;

    const processRecord = (id) => {
        console.log(id);
    };

    return (
        <div className="mb-2 pb-2">
            <Row className="g-0 sh-6">
                <Col xs="auto">
                    <img
                        src="/img/profile/profile-9.webp"
                        className="card-img rounded-xl sh-6 sw-6"
                        alt="thumb"
                    />
                </Col>
                <Col>
                    <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                        <div className="d-flex flex-column">
                            <div>{item.cpf}</div>
                            <div className="text-medium text-muted">
                                {dateEnBr(item.created_at)}{' '}
                            </div>
                            <OverlayTrigger
                                placement="bottom"
                                overlay={
                                    <Tooltip id={`tooltip-bottom-${item.id}`}>
                                        <code>{item.json_response}</code>
                                    </Tooltip>
                                }
                            >
                                <div
                                    className={`text-medium ${
                                        Number(item.code_response) === 200
                                            ? 'text-success'
                                            : 'text-danger'
                                    }`}
                                >
                                    {item.code_response}
                                    <input type="text" value={item.json_response}/>
                                </div>
                            </OverlayTrigger>
                        </div>
                        <div className="d-flex">
                            <Dropdown as={ButtonGroup} className="mb-1">
                                <Dropdown.Toggle variant="tertiary">
                                    Opções
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="sw-40" size="sm">
                                    <div className="px-4 py-3">
                                        <Row className="mb-3 ms-0 me-0">
                                            <Col xs="12" className="ps-1 mb-2">
                                                <div className="text-extra-small text-danger">
                                                    ATENÇÃO
                                                </div>
                                            </Col>
                                            <Col xs="12" className="ps-1 pe-1">
                                                <ul className="list-unstyled">
                                                    <li>
                                                        <a href="#/!">
                                                            <CsLineIcons
                                                                icon="close-circle"
                                                                className="me-2"
                                                                size="18"
                                                            />{' '}
                                                            <span className="align-middle">
                                                                Apagar registro
                                                            </span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </Col>
                                        </Row>
                                        <Row className="mb-1 ms-0 me-0">
                                            <Col xs="12" className="ps-1 pe-1">
                                                <ul className="list-unstyled">
                                                    <li>
                                                        <a
                                                            href="#/!"
                                                            onClick={() => {
                                                                processRecord(
                                                                    item.id
                                                                );
                                                            }}
                                                        >
                                                            <CsLineIcons
                                                                icon="cpu"
                                                                className="me-2"
                                                                size="18"
                                                            />{' '}
                                                            <span className="align-middle">
                                                                Processar
                                                                on-line
                                                            </span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#/!"
                                                            onClick={() => {
                                                                processRecord(
                                                                    item.id
                                                                );
                                                            }}
                                                        >
                                                            <CsLineIcons
                                                                icon="cpu"
                                                                className="me-2"
                                                                size="18"
                                                            />{' '}
                                                            <span className="align-middle">
                                                                Processar
                                                                off-line
                                                            </span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href={`/view-beneficios-inprocess/${item.uuid}`}
                                                        >
                                                            <CsLineIcons
                                                                icon="cpu"
                                                                className="me-2"
                                                                size="18"
                                                            />{' '}
                                                            <span className="align-middle">
                                                                Ver status
                                                                processamento
                                                            </span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </Col>
                                        </Row>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default CardProcessamento;
