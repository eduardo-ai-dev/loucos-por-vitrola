/**
 * Loucos por Vitrola - Sistema de Catálogo, Modal Interativo & Frete ViaCEP
 * Renderização dinâmica, filtros por categoria, busca, frete e modal de especificações
 */

const DEFAULT_PRODUCTS = [
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

class CatalogManager {
  constructor() {
    this.products = [];
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.sortBy = 'default';
    this.selectedProduct = null;
    this.modalShippingInfo = null;
    this.wishlist = this.loadWishlist();

    this.initElements();
    this.loadProducts();
  }

  loadWishlist() {
    try {
      const data = localStorage.getItem('lpr_wishlist');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    localStorage.setItem('lpr_wishlist', JSON.stringify(this.wishlist));
  }

  toggleWishlist(productId, btnElem) {
    const idx = this.wishlist.indexOf(productId);
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
      btnElem.classList.remove('active');
      if (window.cartInstance) window.cartInstance.showToast('Removido dos favoritos', 'info');
    } else {
      this.wishlist.push(productId);
      btnElem.classList.add('active');
      if (window.cartInstance) window.cartInstance.showToast('Adicionado aos favoritos!', 'success');
    }
    this.saveWishlist();
  }

  initElements() {
    this.gridContainer = document.getElementById('catalogProductsGrid');
    this.featuredContainer = document.getElementById('featuredVitrineGrid');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.searchInput = document.getElementById('catalogSearchInput');
    this.sortSelect = document.getElementById('catalogSortSelect');
    this.productCountElem = document.getElementById('catalogProductCount');

    // Elementos do Modal
    this.modalOverlay = document.getElementById('productDetailModal');
    this.modalCloseBtn = document.getElementById('modalCloseBtn');
    this.modalBrand = document.getElementById('modalProductBrand');
    this.modalBadge = document.getElementById('modalProductBadge');
    this.modalTitle = document.getElementById('modalProductTitle');
    this.modalPrice = document.getElementById('modalProductPrice');
    this.modalDescription = document.getElementById('modalProductDesc');
    this.modalSpecsList = document.getElementById('modalProductSpecs');
    this.modalCondition = document.getElementById('modalProductCondition');
    this.modalVoltage = document.getElementById('modalProductVoltage');
    this.modalCartridge = document.getElementById('modalProductCartridge');
    this.modalMainImg = document.getElementById('modalMainImage');
    this.modalThumbs = document.getElementById('modalThumbnails');
    this.modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
    this.modalBuyWhatsAppBtn = document.getElementById('modalBuyWhatsAppBtn');

    // Frete no Modal
    this.modalCepInput = document.getElementById('modalCepInput');
    this.modalCalcShippingBtn = document.getElementById('modalCalcShippingBtn');
    this.modalShippingResult = document.getElementById('modalShippingResult');

    this.attachEventListeners();
  }

  async loadProducts() {
    try {
      const response = await fetch('./assets/data/products.json');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          this.products = data;
        } else {
          this.products = DEFAULT_PRODUCTS;
        }
      } else {
        throw new Error(`Falha no fetch HTTP: status ${response.status}`);
      }
    } catch (e) {
      console.warn('Usando catálogo embutido de fallback (CORS/offline):', e);
      if (typeof window !== 'undefined' && Array.isArray(window.LOUCOS_PRODUCTS) && window.LOUCOS_PRODUCTS.length > 0) {
        this.products = window.LOUCOS_PRODUCTS;
      } else {
        this.products = DEFAULT_PRODUCTS;
      }
    }

    if (!Array.isArray(this.products) || this.products.length === 0) {
      this.products = DEFAULT_PRODUCTS;
    }

    this.render();
  }

  attachEventListeners() {
    // Filtros de Categoria
    if (this.filterButtons) {
      this.filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.filterButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentFilter = btn.dataset.filter || 'all';
          this.render();
        });
      });
    }

    // Busca textual
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    // Ordenação
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.render();
      });
    }

    // Fechamento de modal
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) {
          this.closeModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isModalOpen()) {
        this.closeModal();
      }
    });

    if (this.modalAddToCartBtn) {
      this.modalAddToCartBtn.addEventListener('click', () => {
        if (this.selectedProduct && window.cartInstance) {
          window.cartInstance.addItem(this.selectedProduct, 1);
          this.closeModal();
        }
      });
    }

    if (this.modalBuyWhatsAppBtn) {
      this.modalBuyWhatsAppBtn.addEventListener('click', () => {
        if (this.selectedProduct) {
          this.buyProductViaWhatsApp(this.selectedProduct);
        }
      });
    }

    // Máscara e cálculo de CEP no Modal
    if (this.modalCepInput) {
      this.modalCepInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 8) val = val.slice(0, 8);
        if (val.length > 5) {
          val = val.slice(0, 5) + '-' + val.slice(5);
        }
        e.target.value = val;

        if (val.replace(/\D/g, '').length === 8) {
          this.calculateModalShipping(val);
        }
      });
    }

    if (this.modalCalcShippingBtn) {
      this.modalCalcShippingBtn.addEventListener('click', () => {
        this.calculateModalShipping(this.modalCepInput?.value || '');
      });
    }

    // Share Modal
    const shareBtn = document.getElementById('modalShareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (this.selectedProduct) {
          const url = encodeURIComponent(window.location.href);
          const text = encodeURIComponent(`Olha que incrível este ${this.selectedProduct.name} na Loucos por Vitrola!`);
          window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
        }
      });
    }

    // Wishlist global listener for dynamic buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.product-card-wishlist');
      if (btn) {
        const id = btn.dataset.id;
        if (id) this.toggleWishlist(id, btn);
      }
    });
  }

  async calculateModalShipping(cepRaw) {
    const cepClean = (cepRaw || '').replace(/\D/g, '');
    if (cepClean.length !== 8) {
      if (window.cartInstance) window.cartInstance.showToast('Digite um CEP válido com 8 dígitos.', 'error');
      return;
    }

    if (this.modalCalcShippingBtn) {
      this.modalCalcShippingBtn.disabled = true;
      this.modalCalcShippingBtn.textContent = 'Calculando...';
    }

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
      const data = await res.json();

      if (data.erro) throw new Error('CEP não encontrado');

      const uf = (data.uf || '').toUpperCase();
      const city = data.localidade || '';
      const priceVal = this.selectedProduct ? this.selectedProduct.price : 0;

      let freight = 85.00;
      let days = '7 a 12 dias úteis';

      if (uf === 'SP') {
        freight = 35.00;
        days = '2 a 4 dias úteis';
      } else if (['PR', 'SC', 'RS', 'RJ', 'MG', 'ES'].includes(uf)) {
        freight = 55.00;
        days = '4 a 7 dias úteis';
      }

      const isFree = priceVal >= 990.00;

      this.modalShippingInfo = {
        cep: `${cepClean.slice(0, 5)}-${cepClean.slice(5)}`,
        city: city,
        state: uf,
        price: isFree ? 0 : freight,
        days: days,
        isFree: isFree
      };

      if (this.modalShippingResult) {
        this.modalShippingResult.style.display = 'block';
        const priceDisplay = isFree 
          ? '<span class="shipping-badge-free">GRÁTIS (Item &gt; R$ 990)</span>' 
          : this.formatCurrency(freight);

        this.modalShippingResult.innerHTML = `
          <div class="shipping-result-line">
            <span><strong>Destino:</strong> ${city} - ${uf}</span>
            <span>${priceDisplay}</span>
          </div>
          <div class="shipping-result-line" style="font-size: 0.8rem;">
            <span>Prazo: ${days}</span>
            <span style="color: #0F853B;">Seguro e caixa dupla inclusos</span>
          </div>
        `;
      }
    } catch (e) {
      console.warn('Erro frete modal:', e);
      if (this.modalShippingResult) {
        this.modalShippingResult.style.display = 'block';
        this.modalShippingResult.innerHTML = `<span>Estimativa padrão: R$ 55,00 (4 a 7 dias úteis)</span>`;
      }
    } finally {
      if (this.modalCalcShippingBtn) {
        this.modalCalcShippingBtn.disabled = false;
        this.modalCalcShippingBtn.textContent = 'Calcular';
      }
    }
  }

  isModalOpen() {
    return this.modalOverlay && this.modalOverlay.classList.contains('active');
  }

  openModal(product) {
    if (!product || !this.modalOverlay) return;

    this.selectedProduct = product;
    this.modalShippingInfo = null;
    if (this.modalShippingResult) this.modalShippingResult.style.display = 'none';
    if (this.modalCepInput) this.modalCepInput.value = '';

    if (this.modalBrand) this.modalBrand.textContent = product.brand || 'Vintage';
    if (this.modalBadge) this.modalBadge.textContent = product.badge || product.condition || 'Revisado';
    if (this.modalTitle) this.modalTitle.textContent = product.name;
    if (this.modalPrice) this.modalPrice.textContent = this.formatCurrency(product.price);
    if (this.modalDescription) this.modalDescription.textContent = product.description;
    if (this.modalCondition) this.modalCondition.textContent = product.condition || 'Excelente estado';
    if (this.modalVoltage) this.modalVoltage.textContent = product.voltage || 'Bivolt';
    if (this.modalCartridge) this.modalCartridge.textContent = product.cartridge || 'Inclusa';

    const images = product.image 
      ? [product.image]
      : (Array.isArray(product.images) && product.images.length > 0 
          ? product.images 
          : ['assets/images/produtos/placeholder.jpg']);

    if (this.modalMainImg) {
      this.modalMainImg.src = images[0];
      this.modalMainImg.alt = product.name;
    }

    if (this.modalThumbs) {
      this.modalThumbs.innerHTML = images.map((imgSrc, idx) => `
        <img src="${imgSrc}" alt="${product.name} miniatura ${idx + 1}" class="modal-thumb ${idx === 0 ? 'active' : ''}" onclick="window.catalogInstance.setModalImage('${imgSrc}', this)">
      `).join('');
    }

    if (this.modalSpecsList) {
      if (Array.isArray(product.specs) && product.specs.length > 0) {
        this.modalSpecsList.innerHTML = product.specs.map(spec => `<li>${spec}</li>`).join('');
      } else {
        this.modalSpecsList.innerHTML = `<li>Aparelho 100% revisado na oficina com garantia de 90 dias.</li>`;
      }
    }

    this.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    this.injectProductSchema(product, images[0]);
  }

  injectProductSchema(product, image) {
    let oldScript = document.getElementById('productSchema');
    if (oldScript) oldScript.remove();

    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": image,
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "Vintage"
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "BRL",
        "price": product.price,
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/RefurbishedCondition"
      }
    };

    const script = document.createElement('script');
    script.id = 'productSchema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  setModalImage(src, thumbElem) {
    if (this.modalMainImg) {
      this.modalMainImg.src = src;
    }
    if (this.modalThumbs) {
      this.modalThumbs.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
      if (thumbElem) thumbElem.classList.add('active');
    }
  }

  closeModal() {
    if (this.modalOverlay) {
      this.modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      this.selectedProduct = null;
      this.modalShippingInfo = null;
    }
  }

  buyProductViaWhatsApp(product) {
    const phone = '5511996176660';
    let msg = `*Olá, Oficina Loucos por Vitrola!*\n`;
    msg += `Tenho muito interesse no seguinte equipamento anunciado no site:\n\n`;
    msg += `• *Equipamento:* ${product.name}\n`;
    msg += `• *Valor:* ${this.formatCurrency(product.price)}\n`;
    msg += `• *Condição:* ${product.condition}\n`;

    if (this.modalShippingInfo) {
      const { cep, city, state, price, days, isFree } = this.modalShippingInfo;
      const fText = isFree ? 'GRÁTIS' : this.formatCurrency(price);
      msg += `• *Frete Estimado (${cep} - ${city}/${state}):* ${fText} (${days})\n`;
      msg += `• *Total Estimado com Frete:* ${this.formatCurrency(product.price + (isFree ? 0 : price))}\n\n`;
    } else {
      msg += `\n`;
    }

    msg += `Gostaria de verificar se ele ainda está disponível e tirar dúvidas sobre as opções de pagamento (PIX com 5% de desconto ou cartão até 12x) e garantia de 90 dias.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  formatCurrency(val) {
    return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  filterAndSortProducts() {
    let result = [...this.products];

    if (this.currentFilter !== 'all') {
      result = result.filter(p => {
        if (this.currentFilter === 'historicos' || this.currentFilter === 'receivers') {
          return p.category === 'historicos' || p.category === 'receivers';
        }
        return p.category === this.currentFilter;
      });
    }

    if (this.searchQuery) {
      result = result.filter(p => {
        const name = (p.name || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return name.includes(this.searchQuery) || brand.includes(this.searchQuery) || desc.includes(this.searchQuery);
      });
    }

    if (this.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }

  renderProductCard(product) {
    const imgUrl = product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'assets/images/produtos/placeholder.jpg');
    const isWished = this.wishlist.includes(product.id) ? 'active' : '';
    const installmentVal = this.formatCurrency(product.price / 12);
    const badgeText = product.badge || product.condition || 'Revisado';
    const brandHtml = product.brand ? `<span class="product-card-brand">${product.brand}</span>` : '';
    
    return `
      <article class="product-card" data-id="${product.id}">
        <div class="product-card-media">
          <button type="button" class="product-card-wishlist ${isWished}" data-id="${product.id}" aria-label="Adicionar aos favoritos">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <span class="badge badge-gold product-card-badge">${badgeText}</span>
          <img src="${imgUrl}" alt="${product.name}" class="product-card-img" loading="lazy" onerror="this.src='assets/images/produtos/placeholder.jpg'">
        </div>
        <div class="product-card-body">
          ${brandHtml}
          <h3 class="product-card-title">${product.name}</h3>
          <p class="product-card-condition">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            ${product.condition || 'Excelente estado'}
          </p>
          <div class="product-card-footer">
            <div class="product-card-price-box">
              <span class="product-card-price" style="margin-bottom: 0;">${this.formatCurrency(product.price)}</span>
              <span class="product-installments">ou 12x de ${installmentVal}</span>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.catalogInstance.openProductById('${product.id}')">
              Ver Detalhes
            </button>
          </div>
        </div>
      </article>
    `;
  }

  openProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      this.openModal(product);
    }
  }

  render() {
    const filtered = this.filterAndSortProducts();

    if (this.productCountElem) {
      this.productCountElem.textContent = `${filtered.length} equipamento${filtered.length === 1 ? '' : 's'} encontrado${filtered.length === 1 ? '' : 's'}`;
    }

    if (this.gridContainer) {
      if (filtered.length === 0) {
        this.gridContainer.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--color-text-muted);">
            <svg class="icon icon-lg" style="width: 48px; height: 48px; margin-bottom: 1rem; stroke: var(--color-vintage-gold);" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <h3>Nenhum equipamento encontrado</h3>
            <p>Tente ajustar os filtros ou o termo de pesquisa.</p>
          </div>
        `;
      } else {
        this.gridContainer.innerHTML = filtered.map(p => this.renderProductCard(p)).join('');
      }
    }

    if (this.featuredContainer) {
      const featured = this.products.slice(0, 3);
      this.featuredContainer.innerHTML = featured.map(p => this.renderProductCard(p)).join('');
    }
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.catalogInstance = new CatalogManager();
  });
}
