/**
 * Loucos por Vitrola - Sistema de Galeria & Lightbox Nativo
 * Filtro por categorias e visualização ampliada sem dependências externas
 */

class GalleryManager {
  constructor() {
    this.initElements();
    this.attachEventListeners();
  }

  initElements() {
    this.items = document.querySelectorAll('.gallery-item');
    this.filterBtns = document.querySelectorAll('.gallery-filter-btn');
    this.lightbox = document.getElementById('galleryLightbox');
    this.lightboxImg = document.getElementById('lightboxImage');
    this.lightboxCaption = document.getElementById('lightboxCaption');
    this.lightboxClose = document.getElementById('lightboxClose');
  }

  attachEventListeners() {
    // Filtros de Categoria da Galeria
    if (this.filterBtns) {
      this.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const filter = btn.dataset.galleryFilter || 'all';
          this.filterItems(filter);
        });
      });
    }

    // Abertura do Lightbox
    if (this.items) {
      this.items.forEach(item => {
        item.addEventListener('click', () => {
          const img = item.querySelector('.gallery-img');
          const title = item.querySelector('.gallery-title')?.textContent || '';
          const desc = item.querySelector('.gallery-desc')?.textContent || '';

          if (img) {
            this.openLightbox(img.src, `${title} — ${desc}`);
          }
        });
      });
    }

    // Fechamento do Lightbox
    if (this.lightboxClose) {
      this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    }

    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) {
          this.closeLightbox();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isLightboxOpen()) {
        this.closeLightbox();
      }
    });
  }

  filterItems(category) {
    if (!this.items) return;

    this.items.forEach(item => {
      const itemCat = item.dataset.category;
      if (category === 'all' || itemCat === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  isLightboxOpen() {
    return this.lightbox && this.lightbox.classList.contains('active');
  }

  openLightbox(src, caption) {
    if (!this.lightbox || !this.lightboxImg) return;

    this.lightboxImg.src = src;
    if (this.lightboxCaption) {
      this.lightboxCaption.textContent = caption;
    }

    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    if (this.lightbox) {
      this.lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

// Inicialização automática
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.galleryInstance = new GalleryManager();
  });
}
