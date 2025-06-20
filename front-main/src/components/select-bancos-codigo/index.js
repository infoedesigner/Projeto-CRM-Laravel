import React from 'react';

import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import axios from 'axios';
import { BASE_URL, SERVICE_URL } from 'config.js';
import { configAxios } from '../../constants';

const SelectBancosCodigo = (props) => {
    const fetchData = async (inputValue) => {
        configAxios.params = { term: inputValue };
        return (await axios.get(`${BASE_URL}/data/banco-select`, configAxios))
            .data;
    };

    const CustomMultiValueLabel = propsC => (
        <components.MultiValueLabel {...propsC}>
            {/* eslint-disable-next-line react/destructuring-assignment */}
            {propsC.data.banco_codigo}
        </components.MultiValueLabel>
    );

    const { onChangeValue } = props;

    const promiseOptions = (inputValue) =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(fetchData(inputValue));
            }, 1000);
        });

    const formatOptionLabel = ({ nome_banco, banco_codigo }) => (
        <div>
            <div className="clearfix" />
            <div>{banco_codigo} - {nome_banco}</div>
        </div>
    );

    // hack for isMulti & AsyncSelect bugs react-select v.4.3.1
    const getOptionValue = (option) => {
        return option.id;
    };

    return (
        <AsyncSelect
            isMulti
            placeholder="Selecione"
            cacheOptions={false}
            defaultOptions
            components={{ MultiValueLabel: CustomMultiValueLabel }}
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

export default SelectBancosCodigo;
