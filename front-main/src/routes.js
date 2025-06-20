import { DEFAULT_PATHS } from 'config.js';

import { lazy } from 'react';
import LeadsPage from 'views/Leads';
import DashboardVendas from './views/dashboard/Vendas';
import RegrasNegocioPage from './views/RegrasNegocio';
import ProdutoPage from './views/Produto';

import { USER_ROLE } from './constants';
import RelatoriosPage from './views/Relatorios';
import ToDoProcessamentoPage from './views/ToDoProcessamento';
import EsteiraPropostasPage from './views/EsteiraPropostas';
import UsersPage from './views/users/Users';
import LeadsBoardPage from './views/LeadsBoard';
import BancosPage from './views/bancos/Bancos';
import EmDesenvolvimentoPage from './views/EmDesenvolvimento';
import WhatsAppIncomingPage from './views/WhatsAppIncoming';
/*import viewBeneficiosInprocessPage from './views/ViewBeneficiosInprocessPage';*/
import PromotorPage from './views/promotor';
import TabelaPage from './views/tabela';
import CampanhasGerenciarPage from './views/Campanhas';
import CampanhaCreatePage from './views/create/campanha';
import CampanhaAddPage from './views/create/campanha/add';
import BlackListPage from './views/BlackList';
import BOTChatPage from './views/BOTChatPage';
import BOTWhatsAppPage from './views/BOTWhatsAppPage';
import RotinasPage from './views/rotinas/Rotinas';
import ComissoesPage from "./views/Comissoes";
import DigitacaoPage from "./views/Digitacao";
import SimuladorPage from "./views/simulador/Simulador";
import PortabilidadePage from "./views/portabilidade";
import RegrasCartoes from "./views/regras-cartoes";
import Welcome from "./views/default/Welcome";
import BIA1 from "./views/dashboard/BI-A1";
import ProvaVidaPage from "./views/fichas/modalProvaVida";

const apps = {
    calendar: lazy(() => import('views/apps/calendar/Calendar')),
};

const appRoot = DEFAULT_PATHS.APP.endsWith('/')
    ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length)
    : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
    mainMenuItems: [
/*        {
            path: `${appRoot}/view-beneficios-inprocess/:uuid`,
            component: viewBeneficiosInprocessPage,
        },*/
        {
            path: `${appRoot}/campanhas/campanha/create/:tipo`,
            component: CampanhaAddPage,
        },
        {
            path: `${appRoot}/dashboard/`,
            label: 'menu.dashboard',
            icon: 'dashboard-1',
            roles: [USER_ROLE.Admin, USER_ROLE.Editor],
            subs: [
                {
                    path: 'vendas',
                    label: 'menu.dashboard.geral',
                    icon: 'colors',
                    component: DashboardVendas,
                    roles: [USER_ROLE.Admin, USER_ROLE.Editor],
                },
                {
                    path: 'bi',
                    label: 'menu.dashboard.bi',
                    icon: 'chart-up',
                    component: BIA1,
                    roles: [USER_ROLE.Admin, USER_ROLE.Editor],
                },
            ]
        },
        {
            path: `${appRoot}/agenda`,
            label: 'menu.agenda',
            icon: 'calendar',
            component: apps.calendar,
            roles: [USER_ROLE.Admin, USER_ROLE.Editor],
        },
        {
            path: `${appRoot}/crm/`,
            label: 'menu.crm',
            icon: 'crown',
            subs: [
                {
                    path: 'leads',
                    label: 'menu.leads.com',
                    icon: 'crown',
                    component: LeadsPage,
                    roles: [USER_ROLE.Admin, USER_ROLE.Editor],
                },
                {
                    path: 'leads/board',
                    label: 'menu.leads.board',
                    icon: 'board-1',
                    component: LeadsBoardPage,
                    roles: [USER_ROLE.Admin, USER_ROLE.Editor],
                },
                {
                    path: 'leads/whatsapp',
                    label: 'menu.leads.whatsapp',
                    icon: 'messages',
                    component: WhatsAppIncomingPage,
                    roles: [USER_ROLE.Admin, USER_ROLE.Editor],
                },
            ],
        },
        {
            path: `${appRoot}/back-office`,
            label: 'menu.backoffice',
            icon: 'crown',
            subs: [
                {
                    path: `${appRoot}/digitacao`,
                    label: 'menu.esteira.digitacao',
                    icon: 'duplicate',
                    component: DigitacaoPage,
                    roles: [USER_ROLE.Admin, USER_ROLE.Editor],
                },
                {
                    path: `${appRoot}/esteira`,
                    label: 'menu.esteira.beneficios_liberados',
                    icon: 'database',
                    component: EsteiraPropostasPage,
                    roles: [USER_ROLE.Admin, USER_ROLE.Editor],
                },
                {
                    path: `${appRoot}/simulador`,
                    label: 'menu.backoffice.simulador',
                    icon: 'database',
                    component: SimuladorPage,
                    roles: [USER_ROLE.Admin, USER_ROLE.Editor],
                },
            ],
        },
        {
            path: `${appRoot}/campanhas`,
            label: 'menu.campanhas',
            icon: 'star',
            roles: [USER_ROLE.Admin, USER_ROLE.Editor],
            subs: [
                {
                    path: `${appRoot}/campanha/criar`,
                    label: 'menu.campanha.criar',
                    icon: 'share',
                    component: CampanhaCreatePage,
                    roles: [USER_ROLE.Admin, USER_ROLE.Editor],
                },
                {
                    path: `${appRoot}/campanha/gerenciar`,
                    label: 'menu.campanha.gerenciar',
                    icon: 'star',
                    component: CampanhasGerenciarPage,
                    roles: [USER_ROLE.Admin],
                },
            ],
        },
        {
            path: `${appRoot}/config/`,
            label: 'menu.configuracoes',
            icon: 'gear',
            subs: [
                {
                    path: `${appRoot}/todo-processamento`,
                    label: 'menu.processamento',
                    icon: 'cpu',
                    component: ToDoProcessamentoPage,
                    roles: [USER_ROLE.Admin],
                },
                {
                    path: `${appRoot}/black-list`,
                    label: 'menu.esteira.blacklist',
                    icon: 'warning-hexagon',
                    component: BlackListPage,
                    roles: [USER_ROLE.Admin],
                },
                {
                    path: `comissoes`,
                    label: 'menu.comissoes',
                    icon: 'dollar',
                    component: ComissoesPage,
                    roles: [USER_ROLE.Admin],
                },
                {
                    path: `produtos`,
                    label: 'menu.produtos',
                    icon: 'dollar',
                    component: ProdutoPage,
                    roles: [USER_ROLE.Admin],
                },
                {
                    path: 'regras',
                    icon: 'dollar',
                    label: 'menu.config.regras',
                    component: RegrasNegocioPage,
                    roles: [USER_ROLE.Admin],
                },
                {
                    path: 'bancos',
                    icon: 'building-large',
                    label: 'menu.config.bancos',
                    component: BancosPage,
                    roles: [USER_ROLE.Admin],
                },
                {
                    path: 'promotor',
                    icon: 'content',
                    label: 'menu.configuracoes.promotor',
                    component: PromotorPage,
                    roles: [USER_ROLE.Admin],
                },
                {
                    path: 'rotinas',
                    icon: 'accordion',
                    label: 'menu.config.rotinas',
                    component: RotinasPage,
                    roles: [USER_ROLE.Admin],
                },
                {
                    path: 'tabelas',
                    icon: 'abacus',
                    label: 'menu.configuracoes.tabelas',
                    component: TabelaPage,
                    roles: [USER_ROLE.Admin],
                },
                {
                    path: 'portabilidade-card',
                    icon: 'abacus',
                    label: 'menu.configuracoes.portabilidade',
                    component: PortabilidadePage,
                    roles: [USER_ROLE.Admin],
                },
                {
                    path: 'regras-cartoes',
                    icon: 'abacus',
                    label: 'menu.configuracoes.cartoes',
                    component: RegrasCartoes,
                    roles: [USER_ROLE.Admin],
                },
                {
                    path: 'usuarios',
                    icon: 'like',
                    label: 'menu.usuarios',
                    component: UsersPage,
                    roles: [USER_ROLE.Admin],
                },
                {
                    path: 'chat',
                    icon: 'message',
                    label: 'menu.chat',
                    component: BOTChatPage,
                    roles: [USER_ROLE.Admin],
                },
                {
                    path: 'botwhats',
                    icon: 'messages',
                    label: 'menu.botwhatsapp',
                    component: BOTWhatsAppPage,
                    roles: [USER_ROLE.Admin],
                },
            ],
            component: RegrasNegocioPage,
            roles: [USER_ROLE.Admin],
        },
        {
            path: `${appRoot}/relatorios`,
            label: 'menu.relatorios',
            icon: 'invoice',
            component: RelatoriosPage,
            roles: [USER_ROLE.Admin],
        },
    ],
    sidebarItems: [],
};
export default routesAndMenuItems;
