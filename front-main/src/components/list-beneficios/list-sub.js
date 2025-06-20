import React, { useEffect, useState } from 'react';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import axios from 'axios';
import { configAxios } from '../../constants';
import { BASE_URL } from '../../config';
import CustomTable from '../table';
import { Money, yesOrNot } from '../../utils';

const ListSubBeneficios = (p) => {
    const { id, setModalEsteiraManual } = p;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);

    const GET_DATA = async () => {
        configAxios.params = { term: '' };
        await axios
            .get(`${BASE_URL}/data/v1/historico-inss/${id}`, configAxios)
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

    useEffect(() => {
        GET_DATA();

        const intervalId = setInterval(() => {
            GET_DATA();
        }, 1000 * 30); // in milliseconds
        return () => clearInterval(intervalId);
    }, []);

    const columns = [
        {
            name: 'Situação',
            sortable: true,
            selector: (row) => row.banco_nome,
        },
        {
            name: 'NIT',
            sortable: true,
            selector: (row) => row.nit,
        },
        {
            name: 'Agência',
            sortable: true,
            selector: (row) => row.agencia_nome,
        },
        {
            name: 'Banco',
            sortable: true,
            selector: (row) => row.banco_nome,
        },
        {
            name: 'Valor benefício',
            sortable: true,
            selector: (row) => Money(row.valor_beneficio),
        },
        {
            name: 'Bloqueio empréstimo',
            sortable: true,
            selector: (row) => yesOrNot(row.bloqueio_emprestimo),
        },
        {
            name: 'Permite empréstimo benefício',
            sortable: true,
            selector: (row) => yesOrNot(row.beneficio_permite_emprestimo),
        },
        {
            name: 'Margem competência',
            sortable: true,
            selector: (row) => row.margem_competencia,
        },
        {
            name: 'Margem disp. empréstimo',
            sortable: true,
            selector: (row) => row.margem_disponivel_emprestimo,
        },
        {
            name: 'Qtde. empréstimo',
            sortable: true,
            selector: (row) => row.margem_quantidade_emprestimo,
        },
        {
            name: 'Opções',
            selector: (row) => (
                <Button
                    onClick={() => {
                        setModalEsteiraManual(row);
                    }}
                >
                    Visualizar
                </Button>
            ),
        },
    ];

    return loading ? (
        'Carregando...'
    ) : (
        <Row className="m-1">
            <Col sm={12} md={12} lg={12}>
                <CustomTable columns={columns} data={data} />
            </Col>
        </Row>
    );
};

export default ListSubBeneficios;
