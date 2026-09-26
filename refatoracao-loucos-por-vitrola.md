# Plano de Refatoração: Loucos por Vitrola (Multipage Vintage Premium)

## Objetivo
Refatorar integralmente a plataforma web da marca **Loucos por Vitrola** para uma arquitetura multipage estática de alta performance, semântica, acessível e 100% funcional em Vanilla JS e CSS Moderno, com catálogo interativo, modal de detalhes, carrinho lateral integrado ao WhatsApp e identidade visual vintage audiófila extraída do logotipo oficial.

---

## Tarefas de Execução

- [x] **1. Estrutura Inicial e Arquivos Base**
  - Criar diretório `/old` para conformidade com a especificação
  - Copiar `SPEC.md` para a raiz do projeto
  - Criar estrutura de pastas: `assets/css/`, `assets/js/`, `assets/data/`, `assets/images/produtos/`, `assets/images/galeria/`
  - Espelhar `.docs/logo-loucos-por-vitrola.png` para `assets/images/` mantendo caminho original relativo `.docs/`

- [x] **2. Catálogo de Dados e Imagens**
  - Criar `assets/data/products.json` com especificações técnicas reais (Technics, Gradiente, Garrard, Pioneer, etc.)
  - Criar `assets/js/products-data.js` como módulo com fallback para execução local direta
  - Gerar e organizar imagens em alta resolução para os produtos e galeria de restaurações

- [x] **3. Sistema de Estilos e Design Tokens (CSS)**
  - Implementar `assets/css/style.css` com paleta exata (`--color-primary-burgundy`, `--color-vintage-gold`, `--color-vinyl-black`, etc.), tipografia serifada nobre (Playfair Display) e sans-serif limpa (Plus Jakarta Sans)
  - Implementar `assets/css/components.css` (Header global, Footer, Botões, Badges, Cards de produto, Modal de detalhes, Carrinho lateral/Drawer, Lightbox)
  - Implementar `assets/css/pages.css` (Hero sections, grids, processo em 4 passos, depoimentos, formulários, faq)

- [x] **4. Motores de Lógica em Vanilla JavaScript (ES6+)**
  - Implementar `assets/js/cart.js` (Carrinho lateral, persistência em localStorage, soma de totais, contagem de badge, integração WhatsApp com mensagem formatada)
  - Implementar `assets/js/catalog.js` (Renderização de cards, filtros por marca/categoria, abertura e fechamento de modal com especificações)
  - Implementar `assets/js/gallery.js` (Filtros de categorias da galeria e lightbox nativo)
  - Implementar `assets/js/contact.js` (Formulário de orçamento interativo com geração de mensagem no WhatsApp)
  - Implementar `assets/js/main.js` (Menu mobile responsivo, integração do header/drawer, navegação ativa)

- [x] **5. Desenvolvimento das Páginas Multipage (HTML5 Semântico)**
  - `index.html`: Home com Hero CRO, pilares, vitrine, resumo de serviços, processo em 4 passos, depoimentos e CTAs
  - `sobre.html`: História da oficina desde 2016, bios de André Denani e Emilio Colonic, manifesto da música analógica
  - `servicos.html`: Detalhamento dos serviços (restauração mecânica, cápsulas/agulhas, calibração, upgrades) e FAQ
  - `produtos.html`: Catálogo completo com filtros interativos, busca, grid de cards e modal
  - `galeria.html`: Portfólio de restaurações concluídas com filtro e visualizador lightbox
  - `contato.html`: Formulário de orçamento, links rápidos WhatsApp, endereço no ABC Paulista e horário de funcionamento

- [x] **6. Verificação de Qualidade e Interatividade**
  - Validar funcionamento do carrinho, modal, filtros e links
  - Verificar responsividade em desktop e mobile
  - Auditar contraste, acessibilidade e caminhos de imagens
