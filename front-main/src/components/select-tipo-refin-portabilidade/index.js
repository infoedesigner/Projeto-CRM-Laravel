import React from 'react';
import Select, { components } from 'react-select';

const SelectTipoRefinPortabilidade = (props) => {

    const { onChangeValue, valor } = props;

    const options = [
        { value: 'Portabilidade', label: 'Portabilidade' },
        { value: 'Refinanciamento', label: 'Refinanciamento' },
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

export default SelectTipoRefinPortabilidade;
