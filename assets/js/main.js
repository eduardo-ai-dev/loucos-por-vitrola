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

  // 4. Acordeão de FAQ (se presente na página de serviços)
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Fecha outros itens se desejar acordeão exclusivo
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});
