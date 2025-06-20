import React, {useEffect} from 'react';
import { components } from 'react-select';

import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { BASE_URL, SERVICE_URL } from 'config.js';
import { configAxios } from '../../constants';

const SelectCoeficiente = (props) => {
    const { onChangeValue, valor, texto, inputValue } = props;

    const mapResponseToValuesAndLabels = (data) => ({
            value: data.id,
            label: `${data.coeficiente}  ${data.nome}`
    });

    const fetchData = async () => {
        if(inputValue.length > 0) {
            configAxios.params = { term: inputValue };
            console.log('term',inputValue)
        }
        return (await axios.get(`${BASE_URL}/data/coeficiente-select`,configAxios))
            .data.map(mapResponseToValuesAndLabels);
    };
    // eslint-disable-next-line
    const promiseOptions = () =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(fetchData(inputValue));
            }, 1000);
        });

    const formatOptionLabel = ({ value, label }) => (
        <div>
            <div className="clearfix" />
            <div>
                {inputValue}{' - '} {label}
            </div>
        </div>
    );

    // hack for isMulti & AsyncSelect bugs react-select v.4.3.1
    const getOptionValue = (option) => {
        return option.value;
    };

    useEffect(()=>{
        promiseOptions();
        // eslint-disable-next-line
    },[inputValue])

    return (
        <AsyncSelect
            placeholder="Selecione"
            // cacheOptions={false}
            defaultOptions
            classNamePrefix="react-select"
            loadOptions={promiseOptions}
            formatOptionLabel={formatOptionLabel}
            getOptionValue={getOptionValue}
            onChange={onChangeValue}
            noOptionsMessage={() => 'Ops, nenhum registro'}
            loadingMessage={() => 'Carregando...'}
            value = { { value:  valor , label:  texto  } }
        />
    );
};

export default SelectCoeficiente;
