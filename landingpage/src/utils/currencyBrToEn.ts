export const CurrencyBrToEn = (currencyValue: any): any => {
    const cleanedValue = currencyValue.replace(/[^0-9,-]/g, '');
    const dotFormattedValue = cleanedValue.replace(',', '.');
    const numberValue = parseFloat(dotFormattedValue).toFixed(2);
    return numberValue;
}
