import React, { Component } from "react";
import IntlCurrencyInput from "react-intl-currency-input"

const currencyConfig = {
    locale: "pt-BR",
    formats: {
        number: {
            BRL: {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            },
        },
    },
};

// eslint-disable-next-line react/prefer-stateless-function
class BrlCurrencyComponent extends Component {
    render() {
        const { value, onChangeValue } = this.props;

        return <IntlCurrencyInput currency="BRL"
                                  config={ currencyConfig }
                                  className="form-control"
                                  onChange={ onChangeValue }
                                  value={ value }
        />;
    }
}

export default BrlCurrencyComponent;