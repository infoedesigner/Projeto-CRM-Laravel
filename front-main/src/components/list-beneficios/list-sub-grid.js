import React, { useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Card,
    Col,
    Dropdown,
    DropdownButton,
    ListGroup,
    Nav,
    Row,
} from 'react-bootstrap';
import axios from 'axios';
import { configAxios } from '../../constants';
import { BASE_URL } from '../../config';
import Glide from '../carousel/Glide';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { Money } from '../../utils';

const ListSubBeneficiosGrid = (p) => {
    const { id, setModalEsteiraManual, tabelas } = p;

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

    return loading
        ? 'Carregando...'
        : data.map((i, k) => {
              return (
                  <Col key={k} sm={12} md={12} lg={12} xl={6}>
                      <Card className="hover-border-primary">
                          <Card.Body>
                              <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                                  <span>
                                      Margem disponível{' '}
                                      {i.margem_disponivel_emprestimo_on}
                                  </span>
                                  <CsLineIcons
                                      icon="money"
                                      className="text-primary"
                                  />
                              </div>
                              <div className="text-small text-muted mb-1">
                                  VALOR
                              </div>
                              <div className="cta-1 text-primary">
                                  {Money(i.margem_base_calculo_margem_consig)}
                              </div>
                          </Card.Body>
                          <Card.Footer>
                              <DropdownButton
                                  as={ButtonGroup}
                                  title="Opções de simulação"
                                  variant="quaternary"
                                  className="mb-1"
                              >
                                  {tabelas.map((t, ks) => {
                                      return (
                                          <Dropdown.Item
                                              href="#/action-1"
                                              key={ks}
                                          >
                                              {t.nome}
                                          </Dropdown.Item>
                                      );
                                  })}
                              </DropdownButton>{' '}
                          </Card.Footer>
                      </Card>
                  </Col>
              );
          });
};

export default ListSubBeneficiosGrid;
