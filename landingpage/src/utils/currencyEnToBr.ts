export const CurrencyEnToBr = (valorEmIngles: any): any => {

    const valorEmDolares = parseFloat(valorEmIngles.replace(/[^0-9]+/g,""))/100;

    const valorFormatado = valorEmDolares.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return valorFormatado;
}

export const CurrencyEnToBrNo = (valorEmIngles: any): any => {

    const valorEmDolares = parseFloat(valorEmIngles.replace(/[^0-9]+/g,""))/100;

    const valorFormatado = valorEmDolares.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/[^0-9.,-]/g, '');

    return valorFormatado;
}

export const CurrencyEnToBrOnly = (numberValue: number): any => {
    return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
