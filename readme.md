# 🎶 Loucos por Vitrola — A Arte em Toca-Discos

Plataforma web multipágina estática, moderna e de alta performance desenvolvida para a oficina especializada **Loucos por Vitrola**. O projeto une estética vintage audiófila com tecnologias web modernas (HTML5 semântico, CSS moderno e Vanilla JavaScript ES6+), oferecendo vitrine de equipamentos restaurados, galeria de projetos, carrinho de compras com persistência local e checkout integrado ao WhatsApp.

---

## 📸 Visão Geral do Projeto

- **Segmento:** Restauração, calibração e venda de toca-discos vintage e equipamentos analógicos.
- **Abordagem Técnica:** Multipage Application (MPA) 100% estática, focada em SEO, acessibilidade (WCAG AA) e performance com zero dependência de frameworks dinâmicos (sem React, Vue ou runtimes de backend).
- **Identidade Visual:** Paleta de cores premium extraída diretamente do logotipo oficial (tons bordô, ouro champagne, preto vinil e marfim).

---

## 🚀 Funcionalidades Principais

### 🛒 E-Commerce Estático & Conversão (CRO)
* **Catálogo de Vitrolas:** Vitrine categorizada com filtros de busca e cards interativos.
* **Modal de Detalhes (`<dialog>` nativo):** Exibição de galeria de fotos, histórico de restauração, especificações técnicas e botão CTA para compra.
* **Carrinho Lateral (*Off-Canvas Drawer*):** Gaveta lateral acessível de qualquer página com contagem de itens, ajuste de quantidade e persistência no `localStorage`.
* **Checkout via WhatsApp:** Compilação automática dos itens do carrinho, valores e frete em uma mensagem estruturada e codificada para o WhatsApp oficial da oficina.
* **Simulador de Frete por CEP:** Consulta assíncrona integrada à API do ViaCEP com estimativa dinâmica de prazo e valor (com regra de frete grátis para compras qualificadas).

### 🛠️ Institucional, Confiança e Prova Social
* **Slider Interativo "Antes e Depois":** Componente visual deslizante para comparação de aparelhos antes e depois do processo de restauração na bancada.
* **FAQ Sanfonado (Accordion):** Respostas rápidas e acessíveis implementadas com `<details>` e `<summary>` nativos cobrindo prazos, garantia e segurança de envio.
* **Barra de Anúncios (*Announcement Bar*):** Destaque de topo para avisos de frete e atendimento.
* **Formulário de Orçamento Especializado:** Canal direto para solicitação de diagnóstico e restauração de equipamentos de clientes de todo o país.

---

## 🎨 Paleta de Cores & Design Tokens

Cores extraídas da identidade visual do logotipo oficial e aplicadas via variáveis CSS:

| Token CSS | Cor | HEX | Aplicação |
| :--- | :---: | :---: | :--- |
| `--color-primary-burgundy` | ![#5D1510](https://placehold.co/15x15/5D1510/5D1510.png) | `#5D1510` | Cor primária da marca, botões principais e cabeçalhos |
| `--color-primary-dark` | ![#341817](https://placehold.co/15x15/341817/341817.png) | `#341817` | Hovers escuros, superfícies de destaque e rodapé |
| `--color-vinyl-black` | ![#040707](https://placehold.co/15x15/040707/040707.png) | `#040707` | Fundo contrastante, prato vinil e textos de alto contraste |
| `--color-vintage-gold` | ![#E6D193](https://placehold.co/15x15/E6D193/E6D193.png) | `#E6D193` | Acentos dourados, bordas refinadas e badges |
| `--color-surface-cream` | ![#FAF7F2](https://placehold.co/15x15/FAF7F2/FAF7F2.png) | `#FAF7F2` | Fundo principal neutro e aconchegante |
| `--color-whatsapp` | ![#25D366](https://placehold.co/15x15/25D366/25D366.png) | `#25D366` | Ações de checkout e atendimento direto |

---

## 📁 Estrutura de Diretórios

```text
loucos-por-vitrola/
├── old/                     # Backup do código original legado
├── assets/
│   ├── css/
│   │   ├── reset.css        # Reset moderno de estilos
│   │   ├── variables.css    # Tokens globais de cor, tipografia e espaçamento
│   │   ├── main.css         # Estilização global e layout base
│   │   └── components/
│   │       ├── header.css   # Header com sticky e backdrop blur
│   │       ├── drawer.css   # Carrinho lateral off-canvas
│   │       ├── modal.css    # Janela de detalhes do produto (<dialog>)
│   │       ├── slider.css   # Comparador interativo antes/depois
│   │       └── footer.css   # Rodapé institucional e links
│   ├── js/
│   │   ├── main.js          # Menu mobile, drawer toggle e inicialização
│   │   ├── catalog.js       # Renderização de produtos, filtros e modais
│   │   ├── cart.js          # Regras do carrinho, cálculo de frete e WhatsApp
│   │   └── comparison.js    # Controle do slider interativo antes/depois
│   ├── data/
│   │   └── products.json    # Catálogo de produtos e especificações
│   └── images/
│       ├── logo/            # Logotipo oficial em alta definição
│       ├── produtos/        # Imagens das vitrolas e peças à venda
│       └── oficina/         # Registros de restaurações e bancada
├── index.html               # Página inicial (Home)
├── sobre.html               # Nossa história e oficina
├── servicos.html            # Restauração, upgrades e revisão técnica
├── produtos.html            # Catálogo interativo de vitrolas à venda
├── galeria.html             # Galeria de projetos e estudos de caso
├── contato.html             # Formulário de orçamento e localização
└── README.md                # Documentação técnica do repositório
```

---

## 💻 Como Executar Localmente

Como o projeto é 100% estático, não requer instalação de pacotes pesados (`npm install`). Porém, para o funcionamento adequado das requisições assíncronas (`fetch` do catálogo JSON e módulos JS), recomenda-se rodar sob um servidor HTTP local:

### Opção 1: Via Python (Recomendado e Nativo)
No terminal, dentro da pasta do projeto:
```bash
python3 -m http.server 8080
```
Em seguida, acesse no navegador: `http://localhost:8080`

### Opção 2: Via Node.js (npx)
```bash
npx serve . -p 8080
```

### Opção 3: Extensão VS Code / Cursor
Instale a extensão **Live Server**, abra a pasta do projeto, clique com o botão direito no `index.html` e selecione **"Open with Live Server"**.

---

## 🔍 SEO e Acessibilidade

- Metatags `Open Graph` e `Twitter Cards` configuradas para pré-visualização enriquecida em compartilhamentos no WhatsApp e redes sociais.
- Marcação semântica com tags HTML5 e atributos `aria-expanded`, `aria-label` e `role="dialog"`.
- Totalmente navegável via teclado (`Tab`, `Escape` para fechar modais/carrinho).
- Estrutura pronta para dados estruturados (`Schema.org/LocalBusiness` e `Schema.org/Product`).

---

## 📞 Contato & Redes Sociais

- **Site:** [loucosporvitrola.com.br](https://loucosporvitrola.com.br/)
- **WhatsApp:** [+55 (11) 99617-6660](https://wa.me/5511996176660)
- **Instagram:** [@loucos_por_vitrola](https://www.instagram.com/loucos_por_vitrola/)
- **Facebook:** [/Loucosporvitrola](https://www.facebook.com/Loucosporvitrola)

---

*Desenvolvido com foco em alta performance, preservação histórica e paixão pela música analógica.* 📻