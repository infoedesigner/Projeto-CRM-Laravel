import React from 'react';

import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { BASE_URL, SERVICE_URL } from 'config.js';
import { configAxios } from '../../constants';

const SelectRotinas = (props) => {
    const {tipo} = props;
    const fetchData = async (inputValue) => {
        configAxios.params = { term: inputValue, tipo };
        return (await axios.get(`${BASE_URL}/data/v1/rotinas`, configAxios))
            .data;
    };

    const { onChangeValue } = props;

    const promiseOptions = (inputValue) =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(fetchData(inputValue));
            }, 1000);
        });

    const formatOptionLabel = ({ rotina }) => (
        <div>
            <div className="clearfix" />
            <div>{rotina} </div>
        </div>
    );

    // hack for isMulti & AsyncSelect bugs react-select v.4.3.1
    const getOptionValue = (option) => {
        return option.id;
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

export default SelectRotinas;
