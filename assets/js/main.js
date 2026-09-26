/**
 * Loucos por Vitrola - Script Principal (Navegação & Interações Globais)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Controle do Menu Mobile
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  function openMobileNav() {
    if (mobileNavDrawer && drawerBackdrop) {
      mobileNavDrawer.classList.add('open');
      drawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileNavDrawer && drawerBackdrop) {
      mobileNavDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileNav);
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileNav);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', () => {
      closeMobileNav();
      if (window.cartInstance) window.cartInstance.close();
    });
  }

  // 2. Sombra suave no Header ao rolar a página
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('header-scrolled');
    } else {
      siteHeader?.classList.remove('header-scrolled');
    }
  }, { passive: true });

  // 3. Destacar Link Ativo na Navegação com base no caminho da página
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 4. Dark Mode Toggle
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const currentTheme = localStorage.getItem('loucos_theme');
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('loucos_theme', 'light');
        themeToggleBtn.textContent = '☀️';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('loucos_theme', 'dark');
        themeToggleBtn.textContent = '🌙';
      }
    });
  }

  // 5. Botão Voltar ao Topo (Scroll to Top)
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-to-top';
  scrollTopBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>';
  scrollTopBtn.setAttribute('aria-label', 'Voltar ao topo');
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 6. Navigation Inferior Mobile (App-like)
  const bottomNav = document.createElement('nav');
  bottomNav.className = 'mobile-bottom-nav';
  bottomNav.innerHTML = `
    <div class="mobile-bottom-nav-inner">
      <a href="index.html" class="bottom-nav-item ${currentPath === 'index.html' || currentPath === '' ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
        Início
      </a>
      <a href="produtos.html" class="bottom-nav-item ${currentPath === 'produtos.html' ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
        Catálogo
      </a>
      <div class="bottom-nav-item" style="cursor:pointer;" id="bottomNavCartBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        Carrinho
        <span class="bottom-nav-badge" id="bottomNavBadge" style="display:none;">0</span>
      </div>
      <a href="https://wa.me/5511996176660" target="_blank" class="bottom-nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        Dúvidas
      </a>
    </div>
  `;
  document.body.appendChild(bottomNav);
  
  const bottomNavCartBtn = document.getElementById('bottomNavCartBtn');
  if (bottomNavCartBtn) {
    bottomNavCartBtn.addEventListener('click', () => {
      if (window.cartInstance) window.cartInstance.open();
    });
  }

  // 7. Áudio Lo-Fi Toggle
  let vinylAudio = null;
  const soundToggleBtn = document.getElementById('lofiToggleBtn');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      // Inicializa o áudio apenas no primeiro clique para evitar bloqueios do navegador
      if (!vinylAudio) {
        vinylAudio = new Audio('assets/audio/vinyl-crackle.mp3');
        vinylAudio.loop = true;
        vinylAudio.volume = 0.15;
      }

      // Alterna entre Play e Pause
      if (vinylAudio.paused) {
        vinylAudio.play().catch(e => console.warn('Autoplay bloqueado', e));
        soundToggleBtn.setAttribute('aria-label', 'Pausar som de vinil');
        soundToggleBtn.textContent = '⏸️'; 
      } else {
        vinylAudio.pause();
        soundToggleBtn.setAttribute('aria-label', 'Tocar som de vinil');
        soundToggleBtn.textContent = '🎵';
      }
    });
  }

  // 8. Banner LGPD
  if (!localStorage.getItem('loucos_cookies_accepted')) {
    const lgpdBanner = document.createElement('div');
    lgpdBanner.className = 'cookie-banner';
    lgpdBanner.innerHTML = `
      <p>Nós utilizamos o armazenamento local (como localStorage) para salvar os itens do seu carrinho de compras e suas preferências, oferecendo uma melhor experiência. Ao continuar, você concorda com nossa <a href="termos.html" style="color:var(--color-vintage-gold);text-decoration:underline;">Política de Privacidade</a>.</p>
      <div class="cookie-banner-actions">
        <button class="btn btn-primary btn-sm" id="acceptCookiesBtn">Entendi e Aceito</button>
      </div>
    `;
    document.body.appendChild(lgpdBanner);
    
    // Animate in
    setTimeout(() => lgpdBanner.classList.add('show'), 1000);

    document.getElementById('acceptCookiesBtn').addEventListener('click', () => {
      localStorage.setItem('loucos_cookies_accepted', 'true');
      lgpdBanner.classList.remove('show');
      setTimeout(() => lgpdBanner.remove(), 500);
    });
  }

});
