import React from 'react';
import Select, { components } from 'react-select';

const SelectTipoRegraCartao = (props) => {

    const { onChangeValue, valor } = props;

    const options = [
        { value: 'Cartão de crédito (RMC)', label: 'Cartão de crédito (RMC)' },
        { value: 'Cartão beneficio (RCC)', label: 'Cartão beneficio (RCC)' },
    ]

    return (
        <Select
            placeholder="Selecione"
            classNamePrefix="react-select"
            options={options}
            onChange={onChangeValue}
            noOptionsMessage={() => 'Ops, nenhum registro'}
            defaultValue={valor}
        />
    );
};

export default SelectTipoRegraCartao;
