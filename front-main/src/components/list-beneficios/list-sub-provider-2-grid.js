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
import { Menu, Item, contextMenu } from 'react-contexify';
import { configAxios } from '../../constants';
import { BASE_URL } from '../../config';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { Money } from '../../utils';

const ListSubBeneficiosGridProviderTwo = (props) => {
    const { id, item } = props;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);

    const GET_DATA = async () => {
        setLoading(true);
        configAxios.params = { uuid: item.uuid };
        await axios
            .get(
                `${BASE_URL}/data/v1/condicoesCredito/${item.id}`,
                configAxios
            )
            .then((response) => {
                setData(response.data.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
    };

    useEffect(() => {
        GET_DATA();
    }, []);

    const renderItens = (itemRi) => {
        const menus = [];

        axios
            .get(
                `${BASE_URL}/data/v1/condicoesCredito-parcelas/${itemRi.id_consulta_credito}/${itemRi.uuid}`,
                configAxios
            )
            .then((resp) => {
                resp.data.data.map((is, ks) => {
                    return menus.push(
                        <Dropdown.Item
                            href="#/action-1"
                            key={`item_drop_${ks}`}
                        >
                            {`Parcela: ${
                                is.parcelas_num_parcela
                            }, valor: ${Money(
                                is.parcelas_valor_parcela
                            )}, venc.: ${is.parcelas_data_vencimento}`}
                        </Dropdown.Item>
                    );
                });
            });

        return menus;
    };

    return loading
        ? 'Carregando...'
        : data.map((i, k) => {
              return (
                  <Col key={k} sm={12} md={12} lg={12} xl={6}>
                      <Card className="hover-border-primary">
                          <Card.Body>
                              <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                                  <span>
                                      Valor bruto {Money(i.valor_bruto)}
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
                                  {Money(i.valor_liquido)}
                              </div>
                              <div className="text-small text-muted mb-1">
                                  Taxa anual / Taxa mensal
                              </div>
                              <div className="text-success">
                                  {i.taxa_apropriacao_anual} /{' '}
                                  {i.taxa_apropriacao_mensal}
                              </div>
                          </Card.Body>
                          <Card.Footer>
                              <DropdownButton
                                  drop="up"
                                  as={ButtonGroup}
                                  title="Opções de simulação"
                                  variant="quaternary"
                                  className="mb-1"
                              >
                                  {renderItens(i, k)}
                              </DropdownButton>{' '}
                          </Card.Footer>
                      </Card>
                  </Col>
              );
          });
};

export default ListSubBeneficiosGridProviderTwo;
