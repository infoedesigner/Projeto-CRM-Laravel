import React from 'react';
import { components } from 'react-select';

import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { BASE_URL, SERVICE_URL } from 'config.js';
import { configAxios } from '../../constants';

const SelectTabelas = (props) => {
    const mapResponseToValuesAndLabels = (data) => ({
        value: data.id,
        label: data.nome,
    });
    const fetchData = async (inputValue) => {
        configAxios.params = { term: inputValue };
        return (await axios.get(`${BASE_URL}/data/tabela-select`,configAxios))
            .data.map(mapResponseToValuesAndLabels);
    };

    const { onChangeValue, valor, texto } = props;

    const promiseOptions = (inputValue) =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(fetchData(inputValue));
            }, 1000);
        });

    const formatOptionLabel = ({ value, label }) => (
        <div>
            <div className="clearfix" />
            <div>
                {label} [{value}]
            </div>
        </div>
    );

    // hack for isMulti & AsyncSelect bugs react-select v.4.3.1
    const getOptionValue = (option) => {
        return option.value;
    };

    return (
        <AsyncSelect
            placeholder="Selecione"
            cacheOptions={false}
            defaultOptions
            classNamePrefix="react-select"
            loadOptions={promiseOptions}
            formatOptionLabel={formatOptionLabel}
            getOptionValue={getOptionValue}
            onChange={onChangeValue}
            noOptionsMessage={() => 'Ops, nenhum registro'}
            loadingMessage={() => 'Carregando...'}
        />
    );
};

export default SelectTabelas;
