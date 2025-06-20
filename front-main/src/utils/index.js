import moment from 'moment';

export const canUseDOM = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

/**
 * Get unique ID.
 *
 * @return {string} uid.
 */
export function getUID() {
    return (
        Number(String(Math.random()).slice(2)) +
        Date.now() +
        Math.round(window.performance.now())
    ).toString(36);
}

export function valorRegras(valor) {

    console.log(valor);

    if(valor === 1 || valor === '1'){
        return 'Sim';
    }
    if(valor === 0 || valor === '0'){
        return 'Não';
    }
    return valor;

}

/**
 * Convert file size to human readable string.
 *
 * @param {number} size file size.
 *
 * @return {string} human readable size.
 */
export function fileSizeToHumanReadable(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    // eslint-disable-next-line no-restricted-properties
    return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${
        ['B', 'kB', 'MB', 'GB', 'TB'][i]
    }`;
}

export function tipoUsuario(tipo) {
    switch (tipo) {
        case 1:
            return 'Administrador';
        case 2:
            return 'Supervisor/gerente';
        case 3:
            return 'Cliente';
        case 4:
            return 'Usuário';
        default:
            return 'Não informado';
    }
}

export function statusMensagem(status) {
    switch (status) {
        case 1:
            return 'Em aberto';
        case 2:
            return 'Visualizado';
        default:
            return 'Não informado';
    }
}

export function statusCRUD(status) {
    switch (status) {
        case 1:
            return 'Ativo';
        case 0:
            return 'Inativo';
        default:
            return 'Não informado';
    }
}

export function statusContrato(status) {
    switch (status) {
        case 1:
            return 'Criado';
        case 2:
            return 'Enviado';
        case 3:
            return 'Assinado';
        case 4:
            return 'Rescendido';
        default:
            return 'Não informado';
    }
}

export function statusLoteHU(status) {
    switch (status) {
        case 0:
            return 'Cancelado';
        case 1:
            return 'Em aberto';
        case 2:
            return 'Processando PDF';
        case 3:
            return 'Pronto/Download';
        default:
            return 'Não informado';
    }
}

export function statusGuiaGNRE(status) {
    switch (status) {
        case 1:
            return 'Agendada';
        case 2:
            return 'Gerada';
        case 4:
            return 'Emitida com sucesso';
        case 3:
            return 'Erro na emissão';
        case 9:
            return 'Erro/Cancelada';
        default:
            return 'Não informado';
    }
}

export function statusGuiaGNREPortal(status) {
    switch (status) {
        case 0:
            return 'Processada com sucesso';
        case 1:
            return 'Invalidada pelo portal';
        case 2:
            return 'Invalidada pela UF';
        case 3:
            return 'Erro de comunicação';
        case 4:
            return 'Pendência processamento';
        case 9:
            return 'Não submitida';
        default:
            return 'Não informado';
    }
}

export function statusLoteHUOther(status) {
    switch (status) {
        case 0:
            return 'Em aberto';
        case 1:
            return 'Processado';
        default:
            return 'Não informado';
    }
}

export function statusTitulo(status) {
    switch (status) {
        case 0:
            return 'Em aberto';
        case 1:
            return 'Processado';
        default:
            return 'Não informado';
    }
}

export function statusFaturaCredilog(status) {
    switch (status) {
        case 1:
            return 'Em aberto';
        case 2:
            return 'Fechada';
        default:
            return 'Não informado';
    }
}

export function tipoGuiaGNRE(status) {
    switch (status) {
        case 1:
            return 'DIFAL';
        case 2:
            return 'Fund./Pobreza';
        default:
            return 'Não informado';
    }
}

export function statusViagem(status) {
    switch (status) {
        case 1:
            return 'Vazio';
        case 2:
            return 'Destinado';
        case 3:
            return 'Carga';
        case 4:
            return 'Viagem';
        case 5:
            return 'Descarga';
        case 6:
            return 'Encerrado';
        case 7:
            return 'Transbordo';
        default:
            return 'Não informado';
    }
}

export default function currencyFormatter(value) {
    if (!Number(value)) return '-';
    if (Number(value) <= 0.00) return '-';

    const amount = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);

    return `${amount}`;
}

export function statusEsteiraProposta(status) {
    switch (status) {
        case 0:
            return 'Em aberto';
        case 1:
            return 'Aprovação de dados';
        case 2:
            return 'Dados aprovados';
        default:
            return 'Aguardando documentação';
    }
}

export function yesOrNot(status) {
    switch (Number(status)) {
        case 0:
            return 'Não';
        case 1:
            return 'Sim';
        default:
            return 'Ops.';
    }
}

export function tipoLandmark(status) {
    switch (status) {
        case 1:
            return 'Filial';
        case 2:
            return 'Cliente (Coleta)';
        case 3:
            return 'Cliente (Entrega)';
        case 4:
            return 'Centro distribuição';
        case 5:
            return 'Ponto de parada';
        case 6:
            return 'Posto de gasolina';
        case 7:
            return 'Manutenção/Geral';
        case 8:
            return 'Ponto de impressão';
        case 9:
            return 'Posto fiscal';
        case 10:
            return 'Outros';
        default:
            return 'Não informado';
    }
}

export function Money(input) {

    // eslint-disable-next-line no-restricted-globals
    if (input === null || input === undefined || isNaN(Number(input))) {
        return '0,00';
    }

    // Converte para string para facilitar o manuseio.
    let str = input.toString();
    // Extrai o sinal negativo, se existir.
    const sign = str.startsWith('-') ? '-' : '';
    // Remove o sinal negativo para o processamento dos dígitos.
    if (sign) {
        str = str.substring(1);
    }

    // Modifica o padrão para capturar todos os dígitos.
    const numberPattern = /\d/g;
    const digits = str.match(numberPattern);
    if (!digits) {
        return '0,00';
    }

    // Reconstitui os dígitos e insere o separador decimal.
    let tmp = digits.join('');
    tmp = tmp.replace(/([0-9]{2})$/g, ',$1');
    if (tmp.length <= 2) {
        tmp = `0,${  tmp.padStart(2, '0')}`;
    }
    // Insere o separador de milhar, se necessário.
    if (tmp.length > 6) {
        tmp = tmp.replace(/([0-9]{3}),([0-9]{2})$/g, '.$1,$2');
    }

    // Adiciona o sinal negativo de volta, se necessário.
    return sign + tmp;
}

export function onlyNumbers(valor) {
    return valor.replace(/\D/g, '');
}

export function secondsToHours(secs) {
    if (secs === undefined) return ' - ';
    const duration = moment.duration(secs, 'seconds');

    if (duration.days() + duration.hours() <= 0) {
        return 'Recente';
    }
    return `${duration.days()} dia(s) e ${duration.hours()} hora(s)`;
}

export function convertData(data) {
    if (typeof myVar !== 'undefined') {
        let final = new Date(data);
        final = final.toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
        });
        console.log(final);
        return final;
    }
    return false;
}

export function dateTimeEnBr(data) {
    if (data === undefined) return ' - ';

    let check = moment(data);
    check = check.isValid() ? check.format('DD/MM/YYYY HH:mm') : ' - ';
    return check;
}

export function agora() {
    return moment(new Date()).format('DD/MM/YYYY HH:mm');
}

export function dateEnBr(data) {
    const date = moment(data);

    if (!date.isValid()) {
        return data;
    }    

    return date.format('DD/MM/YYYY');
}

export function removeHTML(html) {
    if (html?.length > 0) {
        return html.replace(/<[^>]+>/g, '');
    }
    return '...';
}

export function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1 + min));
}

export function coreMarkersText(situacaoId) {
    switch (situacaoId) {
        case 'Vazio':
            return '#ffcf52';
        case 'Viagem':
            return '#0052CC';
        case 'Descarga':
            return '#b6b1ac';
        case 'Destinado':
            return '#4c9517';
        case 'Carga':
            return '#4b4b4b';
        default:
            return '#FFF';
    }
}

export function coreMarkersTextNumber(tipo) {
    switch (parseInt(tipo, 2)) {
        case 1:
            return 'text-danger';
        case 2:
            return 'text-success';
        case 3:
            return 'text-secondary';
        case 4:
            return 'text-alternate';
        default:
            return 'text-primary';
    }
}

export function tipoIconRegra(tipo) {
    switch (Number(tipo)) {
        case 1:
            return 'circle';
        case 2:
            return 'square';
        case 3:
            return 'triangle';
        case 4:
            return 'hexagon';
        default:
            return 'circle';
    }
}

export function canaisLead(canal) {
    switch (canal) {
        case 'SMS':
            return 'bi-chat-right-text';
        case 'WhatsApp':
            return 'bi-whatsapp';
        case 'Telefone':
            return 'bi-headset';
        default:
            return 'bi-question-circle';
    }
}

export const DateTimeEnToBr = (datetime) => {
    const formattedDate = moment(datetime).format('DD/MM/YYYY HH:mm');
    return formattedDate;
};
