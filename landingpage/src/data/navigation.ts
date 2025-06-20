// pages navigations
const pages = [
  {
    id: 21,
    title: 'On-line',
    children: [
      { id: 211, title: 'FGTS', url: '/fgts' },
      { id: 212, title: 'INSS', url: '/inss' },
      { id: 213, title: 'Outros créditos', url: '/outros-creditos' }
    ]
  },
];

// documentation pages links
const documentionNavigation = {
  usage: [
    { id: 1, title: 'WhatsApp', url: '/whatsapp' },
    { id: 2, title: 'Formulário de contato', url: '#' },
    { id: 3, title: '(41) 2118-6622', url: '#' },
  ],
};

export { pages, documentionNavigation };
