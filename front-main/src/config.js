import {
    LAYOUT,
    MENU_BEHAVIOUR,
    NAV_COLOR,
    MENU_PLACEMENT,
    RADIUS,
    THEME_COLOR,
    USER_ROLE,
} from 'constants.js';

export const IS_DEMO = false;
export const IS_AUTH_GUARD_ACTIVE = true;
export const SERVICE_URL = '/app';
export const USE_MULTI_LANGUAGE = true;

const LOCAL_DOMAINS = ['localhost', '127.0.0.1', '192.168.15.9', 'homolog.ccef.com.br'];
// const LOCAL_DOMAINS = [];

// eslint-disable-next-line no-nested-ternary
export const BASE_URL = LOCAL_DOMAINS.includes(window.location.hostname)
    ? window.location.hostname === 'homolog.ccef.com.br' ? 'https://api-homolog.ccef.com.br/api' : 'http://127.0.0.1:8000/api'
    : 'https://api.ccef.com.br/api';

// eslint-disable-next-line no-nested-ternary
export const BASE_URL_LOGIN = LOCAL_DOMAINS.includes(window.location.hostname)
    ? window.location.hostname === 'homolog.ccef.com.br' ? 'https://api-homolog.ccef.com.br/api/auth' : 'http://127.0.0.1:8000/api/auth'
    : 'https://api.ccef.com.br/api/auth';

// eslint-disable-next-line no-nested-ternary
export const BASE_URL_DOCS = LOCAL_DOMAINS.includes(window.location.hostname)
    ? window.location.hostname === 'homolog.ccef.com.br' ? 'https://api-homolog.ccef.com.br' : 'http://127.0.0.1:8000'
    : 'https://api.ccef.com.br';

export const REACT_HELMET_PROPS = {
    defaultTitle: 'Carrera Carneiro',
    titleTemplate: '%s | Carrera Carneiro',
};

export const DEFAULT_PATHS = {
    APP: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    USER_WELCOME: '/dashboards/default',
    NOTFOUND: '/page-not-found',
    UNAUTHORIZED: '/unauthorized',
    INVALID_ACCESS: '/invalid-access',
};

export const DEFAULT_SETTINGS = {
    MENU_PLACEMENT: MENU_PLACEMENT.Vertical,
    MENU_BEHAVIOUR: MENU_BEHAVIOUR.Pinned,
    LAYOUT: LAYOUT.Fluid,
    RADIUS: RADIUS.Rounded,
    COLOR: THEME_COLOR.LightBlue,
    NAV_COLOR: NAV_COLOR.Default,
    USE_SIDEBAR: false,
};

export const DEFAULT_USER = {
    id: 1,
    name: 'Robson Carrera',
    thumb: '/img/profile/profile-9.webp',
    role: USER_ROLE.Admin,
    email: 'ccarneiro@carreracarneiro.com.br',
};

export const REDUX_PERSIST_KEY = 'cc';
