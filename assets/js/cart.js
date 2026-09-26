/**
 * Loucos por Vitrola - Sistema de Carrinho Lateral, Frete ViaCEP & Integração WhatsApp
 * Vanilla JS Puro (ES6+), Persistência via localStorage e sessionStorage
 */

const STORAGE_KEY = 'loucos_vitrola_cart_v1';
const WHATSAPP_PHONE = '5511996176660';

class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.shippingInfo = null; // { cep, city, state, price, days, isFree }
    this.initElements();
    this.initAnnouncementBar();
    this.initShippingCalculator();
    this.attachEventListeners();
    this.updateUI();
  }

  loadCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Erro ao carregar carrinho do localStorage:', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cart));
    } catch (e) {
      console.error('Erro ao salvar carrinho no localStorage:', e);
    }
    // Reavalia o frete se já calculado (para verificar se agora qualifica para frete grátis >= R$ 990)
    if (this.shippingInfo) {
      this.recalculateShipping();
    }
    this.updateUI();
  }

  initElements() {
    this.drawer = document.getElementById('cartDrawer');
    this.backdrop = document.getElementById('drawerBackdrop');
    this.badge = document.getElementById('cartBadge');
    this.itemsList = document.getElementById('cartItemsList');
    this.emptyState = document.getElementById('cartEmptyState');
    this.subtotalPriceElem = document.getElementById('cartSubtotalPrice');
    this.shippingRowElem = document.getElementById('cartShippingRow');
    this.shippingPriceElem = document.getElementById('cartShippingPrice');
    this.totalPriceElem = document.getElementById('cartTotalPrice');
    this.checkoutBtn = document.getElementById('cartCheckoutBtn');
    this.closeBtn = document.getElementById('cartCloseBtn');
    this.openBtns = document.querySelectorAll('.cart-toggle-btn');

    // Elementos de Frete do Carrinho
    this.cepInput = document.getElementById('cartCepInput');
    this.calcShippingBtn = document.getElementById('cartCalcShippingBtn');
    this.shippingResultBox = document.getElementById('cartShippingResult');
  }

  initAnnouncementBar() {
    const bar = document.getElementById('announcementBar');
    const dismissBtn = document.getElementById('dismissAnnouncementBtn');

    if (!bar) return;

    if (sessionStorage.getItem('loucos_announcement_dismissed') === 'true') {
      bar.classList.add('dismissed');
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        bar.classList.add('dismissed');
        sessionStorage.setItem('loucos_announcement_dismissed', 'true');
      });
    }
  }

  initShippingCalculator() {
    if (!this.cepInput) return;

    // Máscara automática de CEP XXXXX-XXX
    this.cepInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 8) val = val.slice(0, 8);
      if (val.length > 5) {
        val = val.slice(0, 5) + '-' + val.slice(5);
      }
      e.target.value = val;

      if (val.replace(/\D/g, '').length === 8) {
        this.calculateShipping(val);
      }
    });

    if (this.calcShippingBtn) {
      this.calcShippingBtn.addEventListener('click', () => {
        this.calculateShipping(this.cepInput.value);
      });
    }
  }

  async calculateShipping(cepRaw) {
    const cepClean = (cepRaw || '').replace(/\D/g, '');
    if (cepClean.length !== 8) {
      this.showToast('Digite um CEP válido com 8 dígitos.', 'error');
      return;
    }

    if (this.calcShippingBtn) {
      this.calcShippingBtn.disabled = true;
      this.calcShippingBtn.textContent = 'Calculando...';
    }

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
      const data = await res.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      const uf = (data.uf || '').toUpperCase();
      const city = data.localidade || '';
      const subtotal = this.getSubtotal();

      let price = 85.00;
      let days = '7 a 12 dias úteis';

      if (uf === 'SP') {
        price = 35.00;
        days = '2 a 4 dias úteis';
      } else if (['PR', 'SC', 'RS', 'RJ', 'MG', 'ES'].includes(uf)) {
        price = 55.00;
        days = '4 a 7 dias úteis';
      }

      const isFree = subtotal >= 990.00;

      this.shippingInfo = {
        cep: `${cepClean.slice(0, 5)}-${cepClean.slice(5)}`,
        city: city,
        state: uf,
        basePrice: price,
        price: isFree ? 0 : price,
        days: days,
        isFree: isFree
      };

      this.renderShippingResult();
      this.updateUI();
      this.showToast(`Frete calculado para ${city} - ${uf}!`, 'success');

    } catch (err) {
      console.warn('Erro ao consultar ViaCEP:', err);
      // Fallback gracioso
      const subtotal = this.getSubtotal();
      const isFree = subtotal >= 990.00;
      this.shippingInfo = {
        cep: cepClean,
        city: 'Destino informado',
        state: 'BR',
        basePrice: 55.00,
        price: isFree ? 0 : 55.00,
        days: '5 a 8 dias úteis',
        isFree: isFree
      };
      this.renderShippingResult();
      this.updateUI();
    } finally {
      if (this.calcShippingBtn) {
        this.calcShippingBtn.disabled = false;
        this.calcShippingBtn.textContent = 'Calcular';
      }
    }
  }

  recalculateShipping() {
    if (!this.shippingInfo) return;
    const subtotal = this.getSubtotal();
    const isFree = subtotal >= 990.00;
    this.shippingInfo.isFree = isFree;
    this.shippingInfo.price = isFree ? 0 : this.shippingInfo.basePrice;
    this.renderShippingResult();
  }

  renderShippingResult() {
    if (!this.shippingResultBox || !this.shippingInfo) return;

    const { city, state, price, days, isFree } = this.shippingInfo;
    const priceText = isFree ? '<span class="shipping-badge-free">GRÁTIS (Pedido &gt; R$ 990)</span>' : this.formatCurrency(price);

    this.shippingResultBox.style.display = 'block';
    this.shippingResultBox.innerHTML = `
      <div class="shipping-result-line">
        <span><strong>Destino:</strong> ${city} - ${state}</span>
        <span>${priceText}</span>
      </div>
      <div class="shipping-result-line" style="font-size: 0.8rem;">
        <span>Prazo estimado: ${days}</span>
        <span style="color: #0F853B;">Embalagem anti-impacto inclusa</span>
      </div>
    `;
  }

  attachEventListeners() {
    if (this.openBtns) {
      this.openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => this.checkoutWhatsApp());
    }
  }

  isOpen() {
    return this.drawer && this.drawer.classList.contains('open');
  }

  open() {
    if (this.drawer && this.backdrop) {
      this.drawer.classList.add('open');
      this.backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    if (this.drawer && this.backdrop) {
      this.drawer.classList.remove('open');
      this.backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  addItem(product, quantity = 1) {
    if (!product || !product.id) return;

    const existingIndex = this.cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'assets/images/produtos/technics-sld20.jpg',
        condition: product.condition || 'Revisado',
        quantity: quantity
      });
    }

    this.saveCart();
    this.bounceBadge();
    this.showToast(`"${product.name}" adicionado ao carrinho!`, 'success');
  }

  updateQuantity(productId, delta) {
    const itemIndex = this.cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    this.cart[itemIndex].quantity += delta;

    if (this.cart[itemIndex].quantity <= 0) {
      this.cart.splice(itemIndex, 1);
      this.showToast('Item removido do carrinho.', 'info');
    }

    this.saveCart();
  }

  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.showToast('Item removido do carrinho.', 'info');
  }

  clearCart() {
    this.cart = [];
    this.shippingInfo = null;
    this.saveCart();
  }

  getTotalCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotalPrice() {
    const subtotal = this.getSubtotal();
    const shipping = this.shippingInfo ? this.shippingInfo.price : 0;
    return subtotal + shipping;
  }

  bounceBadge() {
    if (!this.badge) return;
    this.badge.classList.remove('badge-bounce');
    void this.badge.offsetWidth;
    this.badge.classList.add('badge-bounce');
  }

  formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  updateUI() {
    const count = this.getTotalCount();
    const subtotal = this.getSubtotal();
    const total = this.getTotalPrice();

    if (this.badge) {
      this.badge.textContent = count;
      this.badge.style.display = count > 0 ? 'flex' : 'none';
    }

    const btmBadge = document.getElementById('bottomNavBadge');
    if (btmBadge) {
      btmBadge.textContent = count;
      btmBadge.style.display = count > 0 ? 'flex' : 'none';
    }

    if (this.subtotalPriceElem) {
      this.subtotalPriceElem.textContent = this.formatCurrency(subtotal);
    }

    if (this.shippingRowElem && this.shippingPriceElem) {
      if (this.shippingInfo) {
        this.shippingRowElem.style.display = 'flex';
        this.shippingPriceElem.innerHTML = this.shippingInfo.isFree
          ? '<span class="shipping-badge-free">GRÁTIS</span>'
          : this.formatCurrency(this.shippingInfo.price);
      } else {
        this.shippingRowElem.style.display = 'none';
      }
    }

    if (this.totalPriceElem) {
      this.totalPriceElem.textContent = this.formatCurrency(total);
    }

    if (this.checkoutBtn) {
      this.checkoutBtn.disabled = this.cart.length === 0;
      if (this.cart.length === 0) {
        this.checkoutBtn.style.opacity = '0.6';
        this.checkoutBtn.style.cursor = 'not-allowed';
      } else {
        this.checkoutBtn.style.opacity = '1';
        this.checkoutBtn.style.cursor = 'pointer';
      }
    }

    if (this.itemsList && this.emptyState) {
      if (this.cart.length === 0) {
        this.itemsList.style.display = 'none';
        this.emptyState.style.display = 'flex';
        this.itemsList.innerHTML = '';
        if (this.shippingResultBox) this.shippingResultBox.style.display = 'none';
      } else {
        this.emptyState.style.display = 'none';
        this.itemsList.style.display = 'flex';
        this.itemsList.innerHTML = this.cart.map(item => `
          <li class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='assets/images/produtos/technics-sld20.jpg'">
            <div class="cart-item-info">
              <span class="cart-item-title">${item.name}</span>
              <span class="cart-item-price">${this.formatCurrency(item.price)}</span>
              <div class="cart-item-controls">
                <button type="button" class="qty-btn" onclick="window.cartInstance.updateQuantity('${item.id}', -1)" aria-label="Diminuir quantidade">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button type="button" class="qty-btn" onclick="window.cartInstance.updateQuantity('${item.id}', 1)" aria-label="Aumentar quantidade">+</button>
              </div>
            </div>
            <button type="button" class="cart-item-remove" onclick="window.cartInstance.removeItem('${item.id}')" aria-label="Remover ${item.name}">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </li>
        `).join('');
      }
    }
  }

  checkoutWhatsApp() {
    if (this.cart.length === 0) {
      this.showToast('Seu carrinho está vazio!', 'error');
      return;
    }

    let message = `*Olá, Oficina Loucos por Vitrola!*\n`;
    message += `Gostaria de finalizar o meu pedido pelo site:\n\n`;

    this.cart.forEach((item, index) => {
      const itemSub = this.formatCurrency(item.price * item.quantity);
      message += `${index + 1}. *${item.name}*\n`;
      message += `   • Quantidade: ${item.quantity}\n`;
      message += `   • Preço: ${this.formatCurrency(item.price)} (Subtotal: ${itemSub})\n\n`;
    });

    const subtotal = this.getSubtotal();
    message += `• *Subtotal dos Equipamentos:* ${this.formatCurrency(subtotal)}\n`;

    if (this.shippingInfo) {
      const { cep, city, state, price, days, isFree } = this.shippingInfo;
      const freightText = isFree ? 'GRÁTIS (Promoção &gt; R$ 990)' : this.formatCurrency(price);
      message += `• *Frete Estimado (${cep} - ${city}/${state}):* ${freightText}\n`;
      message += `• *Prazo Estimado de Entrega:* ${days}\n\n`;
      message += `*Valor Total com Frete: ${this.formatCurrency(this.getTotalPrice())}*\n\n`;
    } else {
      message += `\n*Valor Total (sem frete): ${this.formatCurrency(subtotal)}*\n`;
      message += `(Gostaria de informar meu CEP para calcularmos o frete seguro com embalagem anti-impacto).\n\n`;
    }

    message += `Poderiam me confirmar a disponibilidade e enviar o link ou chave PIX (com 5% de desconto à vista) para pagamento com garantia de 90 dias?`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
  }

  showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button style="background:none;border:none;color:#fff;cursor:pointer;font-size:1.1rem;" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      if (toast && toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }
    }, 3500);
  }
}

// Inicialização automática do Singleton
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cartInstance = new CartManager();
  });
}
