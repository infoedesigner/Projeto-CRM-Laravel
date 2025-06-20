import { BASE_URL, SERVICE_URL } from 'config';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import api from '../api';
import { configAxios } from '../../constants';

const addDaysToday = (days = 0) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result.toISOString().replace(/T.*$/, '');
};

let guid = 0;

const createId = () => {
    guid += 1;
    return String(guid);
};

window.eventsData = [];

api.onGet(`${SERVICE_URL}/apps/events`).reply(200, window.eventsData);
api.onPost(`${SERVICE_URL}/apps/events`).reply((config) => {
    const requestData = JSON.parse(config.data);
    const { item } = requestData;

    // Add item
    window.eventsData = [{ ...item, id: createId() }, ...window.eventsData];
    return [200, window.eventsData];
});
api.onPut(`${SERVICE_URL}/apps/events`).reply((config) => {
    const requestData = JSON.parse(config.data);
    const { item } = requestData;
    if (window.eventsData.find((x) => x.id === item.id)) {
        window.eventsData = window.eventsData.map((x) =>
            x.id === item.id ? item : x
        );
        // Update item
        return [200, window.eventsData];
    }
    window.eventsData.push({ ...item, id: createId() });
    return [200, window.eventsData];
});
api.onDelete(`${SERVICE_URL}/apps/events`).reply((config) => {
    const { id } = config;
    // Delete item
    window.eventsData = [...window.eventsData.filter((x) => id !== x.id)];
    return [200, window.eventsData];
});
