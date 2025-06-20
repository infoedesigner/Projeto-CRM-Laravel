import React from 'react';

import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { BASE_URL, SERVICE_URL } from 'config.js';
import { configAxios } from '../../constants';

const SelectAPIs = (props) => {
    const fetchData = async (inputValue) => {
        configAxios.params = { term: inputValue };
        return (await axios.get(`${BASE_URL}/data/apis-select`, configAxios))
            .data;
    };

    const { onChangeValue } = props;

    const promiseOptions = (inputValue) =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(fetchData(inputValue));
            }, 1000);
        });

    const formatOptionLabel = ({ api_name }) => (
        <div>
            <div className="clearfix" />
            <div>{api_name} </div>
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

export default SelectAPIs;
