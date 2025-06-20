import { SERVICE_URL } from 'config';
import api from '../api';

const notificationData = [
  {
    id: 1,
    img: '/img/profile/avatar-default.webp',
    title: 'profile-1',
    detail: 'Nenhum lead novo nos últimos minutos.',
    link: '#/',
  },
];
api.onGet(`${SERVICE_URL}/notifications`).reply(200, notificationData);
