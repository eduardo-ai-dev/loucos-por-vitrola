# PROMPT DE ENGENHARIA E REFATORAÇÃO: LOUCOS POR VITROLA (MULTIPAGE VINTAGE PREMIUM)

## 1. CONTEXTO E PAPEL
Atue como um **Engenheiro de Software Sênior**, **Especialista em Arquitetura Web Estática de Alta Performance** e **Especialista em UI/UX**.

Seu objetivo é refatorar integralmente o site da marca **Loucos por Vitrola** (localizado no workspace atual). O projeto deve ser transformado de uma estrutura legada/desatualizada em uma **plataforma Web Multipage moderna, ultra-veloz, acessível, esteticamente sofisticada (estilo Vintage/Audiófilo Premium)**, dotada de um catálogo de vitrolas com modal interativo e fluxo de carrinho de compras lateral integrado ao WhatsApp.

---

## 2. REGRAS OBRIGATÓRIAS E RESTRIÇÕES ARQUITETURAIS (NÃO NEGOCIÁVEIS)

1. **PROIBIDO O USO DE REACT, NEXT.JS, VUE OU FRAMEWORKS SPA:**
   - Não utilize React, Next.js, Nuxt, Angular, Svelte ou qualquer runtime dinâmico baseado em virtual DOM.
   - Não utilize linguagens de backend dinâmico (Node.js/Express em runtime de produção, PHP, Python/Django, etc.).
   
2. **STACK OBRIGATÓRIA (ESTÁTICA, SEMÂNTICA E MODULAR):**
   - **HTML5:** Semântica estrita (`<main>`, `<nav>`, `<article>`, `<aside>`, `<header>`, `<footer>`, `dialog`).
   - **CSS / Estilização:** 
     - Abordagem moderna com **Tailwind CSS (via CLI estático ou compilação Vite estática para HTML puro)** OU **CSS Vanilla Moderno** estruturado com metodologia BEM e Design Tokens nativos (`var(--color-...)`), clamp fluido para tipografia e CSS Grid/Flexbox avançado.
   - **JavaScript:** **Vanilla JavaScript puro (ES6+ modular)** via `<script type="module">`. Código limpo, componentizado por responsabilidade, orientado a eventos, sem dependências externas pesadas.
   - **Ícones:** SVG inline limpo ou biblioteca de ícones vetoriais leves (Lucide Icons via CDN/SVG estático).

3. **ARQUITETURA MULTIPAGE (MPA):**
   - O site **NÃO** deve ser Single-Page. Cada seção principal deve ter sua própria página HTML física e independente para máxima indexação por motores de busca (SEO).

4. **WORKFLOW DE ARQUIVOS (WORKSPACE FILE SYSTEM):**
   - Crie uma pasta `/old` e mova todos os arquivos existentes do site legado para dentro dela.
   - Inicialize a nova estrutura de pastas diretamente na raiz do workspace.

---

## 3. EXTRAÇÃO DA PALETA DE CORES (DESIGN TOKENS EXTRAÍDOS DO LOGOTIPO)

A análise colorimétrica do logotipo oficial resultou nos seguintes valores exatos que devem reger toda a identidade visual do projeto:

| Nome do Token | HEX | RGB | Aplicação UI / Semântica |
| :--- | :--- | :--- | :--- |
| `--color-primary-burgundy` | `#5D1510` | `rgb(93, 21, 16)` | Cor primária (Vinho Bordô Vintage): barras, cabeçalhos, botões primários, detalhes do chassi |
| `--color-primary-dark` | `#341817` | `rgb(52, 24, 23)` | Tom de sombra bordô/café profundo para hovers, bordas e pés de página |
| `--color-vinyl-black` | `#040707` | `rgb(4, 7, 7)` | Preto Vinil Profundo: tipografia principal, áreas de contraste escuro, prato do toca-discos |
| `--color-vintage-gold` | `#E6D193` | `rgb(230, 209, 147)` | Ouro Champagne / Bege Agulha: acentos nobres, badges, bordas finas, destaques no fundo escuro |
| `--color-gold-hover` | `#CBB375` | `rgb(203, 179, 117)` | Variação de hover para o ouro vintage |
| `--color-surface-cream` | `#FAF7F2` | `rgb(250, 247, 242)` | Fundo neutro aconchegante (Off-white / Papel marfim) |
| `--color-surface-pure` | `#FFFFFF` | `rgb(255, 255, 255)` | Fundo de cards, modais e superfícies destacadas |
| `--color-text-muted` | `#635C58` | `rgb(99, 92, 88)` | Textos secundários, especificações e legendas |
| `--color-whatsapp` | `#25D366` | `rgb(37, 211, 102)` | Cor oficial do botão de checkout via WhatsApp |

### Diretrizes de Tipografia e Estilo
- **Títulos (H1, H2, H3):** Serif vintage de alta legibilidade (ex: *Playfair Display*, *Cinzel* ou *Cinzel Decorative*).
- **Corpo e UI (P, Span, Inputs):** Sans-serif neutra, técnica e legível (ex: *Plus Jakarta Sans*, *Inter* ou *Outfit*).
- **Atmosfera Visual:** Clássica, audiófila, minimalista e quente. Efeito de vinil, respiros generosos (white-space) e contrastes que respeitem a norma WCAG AA de acessibilidade.

---

## 4. MAPA DE URLs LEGADAS E EXTRAÇÃO DE CONTEÚDO

O agente executor deve navegar/extrair o conteúdo das seguintes páginas originais para migrar dados históricos, depoimentos, fotos e listagem de serviços:

- **Home Oficial:** `https://loucosporvitrola.com.br/`
- **Sobre Nós:** `https://loucosporvitrola.com.br/sobre-nos/`
- **Serviços:** `https://loucosporvitrola.com.br/servicos/`
- **Galeria:** `https://loucosporvitrola.com.br/galeria/`
- **Contato:** `https://loucosporvitrola.com.br/contato/`

### Canais Oficiais de Contato & Redes Sociais:
- **WhatsApp Oficial:** `+55 (11) 99617-6660` (`https://wa.me/5511996176660`)
- **Instagram:** `https://www.instagram.com/loucos_por_vitrola/`
- **Facebook:** `https://www.facebook.com/Loucosporvitrola`
- **Assinatura da Marca:** *"A arte em toca discos"*

---

## 5. ESTRUTURA DE PÁGINAS DO NOVO SITE MULTIPAGE

O novo projeto deverá conter as seguintes páginas HTML na raiz:

### 1. `index.html` (Início / Home)
- **Header Global:** Logo oficial, menu responsivo (com hamburger mobile), badge dinâmico do carrinho de compras e botão "Fale no WhatsApp".
- **Hero Section:** Headline de alto impacto (Copywriting CRO): *"A Arte e a Alma do Som Analógico: Restauração Especializada e Vitrolas Selecionadas"*. CTA duplo: [Ver Catálogo de Vitrolas] e [Solicitar Restauração].
- **Destaques Rápidos:** Pilares da marca (Restauração Artesanal, Peças Originais, Calibração Precisa, Envio Seguro).
- **Vitrine em Destaque:** 3 a 4 equipamentos em destaque direto para compra.
- **Serviços Resumidos:** Cardápio visual dos serviços com link para a página completa.
- **Como Funciona Nosso Processo:** Passo a passo transparente (1. Diagnóstico e Orçamento -> 2. Desmontagem e Restauração -> 3. Calibração e Testes de Áudio -> 4. Entrega com Garantia).
- **Depoimentos de Colecionadores:** Prova social de clientes satisfeitos.
- **Footer Global:** Links institucionais, dados de contato, horário de atendimento, links sociais e selo de direitos reservados.

### 2. `sobre.html` (Sobre Nós)
- História da oficina Loucos por Vitrola e a paixão pelo áudio analógico e equipamentos vintage (Gradiente, Technics, Garrard, CCE, Philips, Pioneer, etc.).
- Manifesto de valorização da música física e preservação histórica.
- Fotos da oficina, bancada de trabalho e ferramentas de calibração.

### 3. `servicos.html` (Serviços Especializados)
- Restauração completa de gabinetes e partes mecânicas.
- Troca e alinhamento de cápsulas e agulhas (Audio-Technica, Shure, Ortofon, etc.).
- Ajuste de contrapeso, pitch, anti-skating e lubrificação técnica.
- Upgrades: Instalação de pré-amplificadores, saídas RCA blindadas e aterramento anti-hum.
- FAQ detalhado sobre envio de aparelhos, prazos e garantia.

### 4. `produtos.html` (Catálogo de Vitrolas & Aparelhos à Venda - NOVO)
- Filtros rápidos por categoria/marca (ex: Todas, Toca-Discos Diretos, Belt Drive, Receivers/Caixas, Acessórios).
- Grid de cards de produtos de alta conversão contendo:
  - Foto em alta resolução com badge de status (*Disponível*, *Único*, *Revisado com Garantia*).
  - Nome do modelo e marca (ex: *Technics SL-D20*, *Gradiente DD-100Q*).
  - Preço formatado em Reais (BRL).
  - Botão de ação: **"Ver Detalhes"**.
- Ao clicar no card, dispara a **Janela Modal de Detalhes do Produto**.

### 5. `galeria.html` (Galeria de Projetos & Antes/Depois)
- Portfólio visual com fotos de restaurações concluídas.
- Filtros por tipo de equipamento.
- Efeito lightbox nativo para visualização das imagens em tela cheia sem plugins pesados.

### 6. `contato.html` (Contato & Orçamentos)
- Formulário de contato semântico para solicitação de orçamento (com campos para marca do aparelho, defeito apresentado e fotos).
- Atalho direto para atendimento via WhatsApp com mensagem pré-formatada.
- Informações de envio/recebimento para clientes de todo o Brasil.

---

## 6. SISTEMA DE E-COMMERCE ESTÁTICO (CATÁLOGO + MODAL + CARRINHO LATERAL + WHATSAPP)

Toda a lógica deve ser escrita em **Vanilla JavaScript puro (`assets/js/cart.js` e `assets/js/catalog.js`)**, sem bibliotecas externas.

### 6.1. Fonte de Dados (`assets/data/products.json`)
Crie um arquivo JSON estruturado contendo o inventário inicial com dados realistas do nicho:
```json
[
  {
    "id": "vitrola-technics-sld20",
    "name": "Toca-Discos Technics SL-D20 Direct Drive",
    "price": 1450.00,
    "condition": "Totalmente Restaurado & Calibrado",
    "voltage": "110V / 220V",
    "cartridge": "Cápsula Audio-Technica Original",
    "description": "Excelente estado de conservação. Mecanismo revisado, rotação 33/45 RPM perfeitamente calibrada, tampa acrílica polida sem trincas. Acompanha borrachão original e cabos blindados.",
    "images": [
      "assets/images/produtos/technics-1.jpg",
      "assets/images/produtos/technics-2.jpg"
    ],
    "stock": 1
  }
]