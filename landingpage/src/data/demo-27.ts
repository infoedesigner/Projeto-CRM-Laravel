import Shield from 'icons/lineal/Shield';
import CheckList from 'icons/lineal/CheckList';
import Telephone from 'icons/lineal/Telephone';
import LightBulb from 'icons/lineal/LightBulb';
import PieChartTwo from 'icons/lineal/PieChartTwo';
import CloudComputingTwo from 'icons/lineal/CloudComputingTwo';
import color from 'utils/color';

const serviceList = [
  {
    id: 1,
    Icon: Telephone,
    color: color.blue,
    title: 'Suporte otimizado',
    description: `Nossa equipe é altamente qualificada, com formação e treinamento em empréstimos consignados, para oferecer as melhores opções.`
  },
  {
    id: 2,
    Icon: Shield,
    color: color.yellow,
    title: 'Operações seguras',
    description: `Faça tudo do conforto de sua casa, segurança física e digital oferecidas pelos maiores bancos brasileiros.`
  },
  {
    id: 3,
    color: color.orange,
    Icon: CloudComputingTwo,
    title: 'Acompamento em tempo real',
    description: `Todo o processo é feito em nuvem, de maneira digital, mas convidamos você e sua família para tomar um café conosco.`
  }
];

const processList = [
  {
    id: 1,
    Icon: LightBulb,
    title: 'Decisão',
    description: 'O primeiro passo é sua decisão de melhorar sua vida financeira.'
  },
  {
    id: 2,
    Icon: PieChartTwo,
    title: 'Simule',
    description: 'Agora só simular e escolher a melhor opção para você.'
  },
  {
    id: 3,
    Icon: CheckList,
    title: 'Contrate',
    description: 'Pronto, preencha os dados e assine seu contrato, dinheiro em até 30 minutos na sua conta.'
  }
];

const pricingList = [
  {
    price: 2000,
    plan: 'Início de ano',
    features: ['Liberação rápida', 'Sem seguro', 'Pouca documentação', '100% on-line']
  },
  {
    price: 5000,
    plan: 'Férias merecidas',
    features: ['Liberação rápida', 'Sem seguro', 'Pouca documentação', '100% on-line']
  },
  {
    price: 12000,
    plan: 'Quitar dívidas',
    features: ['Liberação rápida','Menores taxas', 'Sem seguro', 'Pouca documentação', '100% on-line']
  }
];

export default { serviceList, processList, pricingList };
