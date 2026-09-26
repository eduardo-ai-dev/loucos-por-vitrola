/**
 * Loucos por Vitrola - Sistema de Catálogo, Modal Interativo & Frete ViaCEP
 * Renderização dinâmica, filtros por categoria, busca, frete e modal de especificações
 */

class CatalogManager {
  constructor() {
    this.products = [];
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.sortBy = 'default';
    this.selectedProduct = null;
    this.modalShippingInfo = null;

    this.initElements();
    this.loadProducts();
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
      const response = await fetch('assets/data/products.json');
      if (response.ok) {
        this.products = await response.json();
      } else {
        throw new Error('Falha no fetch HTTP');
      }
    } catch (e) {
      if (typeof window.LOUCOS_PRODUCTS !== 'undefined' && Array.isArray(window.LOUCOS_PRODUCTS)) {
        this.products = window.LOUCOS_PRODUCTS;
      } else {
        console.error('Nenhuma fonte de produtos disponível:', e);
      }
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

    // Ações do Modal
    if (this.modalAddToCartBtn) {
      this.modalAddToCartBtn.addEventListener('click', () => {
        if (this.selectedProduct && window.cartInstance) {
          window.cartInstance.addItem(this.selectedProduct, 1);
          this.closeModal();
          window.cartInstance.open();
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
    if (this.modalBadge) this.modalBadge.textContent = product.badge || 'Revisado';
    if (this.modalTitle) this.modalTitle.textContent = product.name;
    if (this.modalPrice) this.modalPrice.textContent = this.formatCurrency(product.price);
    if (this.modalDescription) this.modalDescription.textContent = product.description;
    if (this.modalCondition) this.modalCondition.textContent = product.condition || 'Excelente estado';
    if (this.modalVoltage) this.modalVoltage.textContent = product.voltage || 'Bivolt';
    if (this.modalCartridge) this.modalCartridge.textContent = product.cartridge || 'Inclusa';

    const images = Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : ['assets/images/produtos/technics-sld20.jpg'];

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
      result = result.filter(p => p.category === this.currentFilter);
    }

    if (this.searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.brand.toLowerCase().includes(this.searchQuery) ||
        p.description.toLowerCase().includes(this.searchQuery)
      );
    }

    if (this.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }

  renderProductCard(product) {
    const imgUrl = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'assets/images/produtos/technics-sld20.jpg';
    
    return `
      <article class="product-card" data-id="${product.id}">
        <div class="product-card-media">
          <span class="badge badge-gold product-card-badge">${product.badge || 'Revisado'}</span>
          <img src="${imgUrl}" alt="${product.name}" class="product-card-img" loading="lazy" onerror="this.src='assets/images/produtos/technics-sld20.jpg'">
        </div>
        <div class="product-card-body">
          <span class="product-card-brand">${product.brand}</span>
          <h3 class="product-card-title">${product.name}</h3>
          <p class="product-card-condition">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            ${product.condition}
          </p>
          <div class="product-card-footer">
            <div class="product-card-price-box">
              <span class="price-label">À vista (ou até 12x)</span>
              <span class="product-card-price">${this.formatCurrency(product.price)}</span>
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
