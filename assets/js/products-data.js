/**
 * Loucos por Vitrola - Base de Dados de Produtos
 * Compatível com execução local via file:/// e HTTP Server
 */

const PRODUCTS = [
  {
    "id": "vitrola-maleta-retro",
    "name": "Vitrola Retrô Estilo Maleta",
    "category": "belt-drive",
    "price": 459.00,
    "condition": "Novo na Caixa",
    "image": "https://images.pexels.com/photos/27383803/pexels-photo-27383803/free-photo-of-a-person-is-holding-a-record-player-with-a-turntable.jpeg?auto=compress&cs=tinysrgb&w=800",
    "description": "Vitrola estilo maleta vintage. Portátil, com alto-falantes embutidos, conexão Bluetooth e três velocidades (33, 45 e 78 RPM)."
  },
  {
    "id": "toca-discos-madeira",
    "name": "Toca-Discos Clássico em Madeira",
    "category": "belt-drive",
    "price": 1250.00,
    "condition": "Revisado / Garantia",
    "image": "https://images.unsplash.com/photo-1679658430343-7708a722721e?auto=format&fit=crop&w=800&q=80",
    "description": "Acabamento premium em madeira natural. Sistema de tração por correia que reduz vibrações, ideal para audiófilos."
  },
  {
    "id": "technics-dj",
    "name": "Toca-Discos Profissional Direct Drive",
    "category": "direct-drive",
    "price": 3500.00,
    "condition": "Restaurado",
    "image": "https://images.pexels.com/photos/16625614/pexels-photo-16625614/free-photo-of-old-fashioned-record-player.jpeg?auto=compress&cs=tinysrgb&w=800",
    "description": "Motor de tração direta de alto torque, controle de pitch deslizante e prato em alumínio fundido."
  },
  {
    "id": "vitrola-gramofone",
    "name": "Vitrola Retrô Estilo Vintage",
    "category": "historicos",
    "price": 1890.00,
    "condition": "Novo",
    "image": "https://images.unsplash.com/photo-1640633003470-5d454658846a?auto=format&fit=crop&w=800&q=80",
    "description": "Design clássico que remete às vitrolas do início do século XX, unindo estética antiga a tecnologia moderna (Bluetooth e USB)."
  },
  {
    "id": "receiver-vintage",
    "name": "Toca-Discos Vintage Estilo Retrô",
    "category": "historicos",
    "price": 2100.00,
    "condition": "Restaurado / Painel Impecável",
    "image": "https://images.unsplash.com/photo-1526394931762-90052e97b376?auto=format&fit=crop&w=800&q=80",
    "description": "Peça clássica de coleção. Estrutura em madeira escura e acabamento que remete às décadas de 60 e 70."
  },
  {
    "id": "agulha-reposicao",
    "name": "Agulha de Reposição de Alta Precisão",
    "category": "acessorios",
    "price": 150.00,
    "condition": "Novo",
    "image": "https://images.pexels.com/photos/17286521/pexels-photo-17286521/free-photo-of-hand-and-record-player.jpeg?auto=compress&cs=tinysrgb&w=800",
    "description": "Agulha com ponta de diamante elíptica para extrair o máximo de detalhes dos sulcos do vinil."
  },
  {
    "id": "kit-limpeza-vinil",
    "name": "Kit de Limpeza Antiestática para Vinil",
    "category": "acessorios",
    "price": 120.00,
    "condition": "Novo",
    "image": "https://images.pexels.com/photos/5118434/pexels-photo-5118434.jpeg?auto=compress&cs=tinysrgb&w=800",
    "description": "Escova de fibra de carbono e fluido especial para manter os seus discos livres de poeira e estalos."
  },
  {
    "id": "toca-discos-minimalista",
    "name": "Toca-Discos Minimalista Moderno",
    "category": "belt-drive",
    "price": 1950.00,
    "condition": "Vitrine",
    "image": "https://images.unsplash.com/photo-1558584609-4f40c370b7ec?auto=format&fit=crop&w=800&q=80",
    "description": "Design limpo e moderno. Braço pré-ajustado e operação totalmente manual."
  }
];

if (typeof window !== 'undefined') {
  window.LOUCOS_PRODUCTS = PRODUCTS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRODUCTS;
}
