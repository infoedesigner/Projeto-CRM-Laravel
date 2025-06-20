import moment from 'moment';
export const DateEnToBr = (dateString: string): string => {
    const date = moment(dateString, 'YYYY-MM-DD');
    return date.format('DD/MM/YYYY');
}