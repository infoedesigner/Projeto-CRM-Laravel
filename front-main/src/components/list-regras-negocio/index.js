import React from 'react';
import { Card } from 'react-bootstrap';
import CsLineIcons from "../../cs-line-icons/CsLineIcons";
import {coreMarkersTextNumber, tipoIconRegra} from "../../utils";

const ListRegrasNegocio = (props) => {

    const { id, regra, range_inicial, range_final, tipo } = props;

    return (
        <Card className="mb-2">
            <Card.Body className="py-4">
                <label className="form-check custom-icon mb-0 checked-line-through checked-opacity-75">
                    <input type="checkbox" className="form-check-input" />
                    <span className="form-check-label">
              <span className="content">
                <CsLineIcons icon={tipoIconRegra(tipo)} className={coreMarkersTextNumber(tipo)} />
                <span className="heading mb-1 lh-1-25">{ regra }</span>
                <span className="d-block text-small">Limites { range_inicial } - { range_final }</span>
              </span>
            </span>
                </label>
            </Card.Body>
        </Card>
    );
};

export default ListRegrasNegocio;
