/**
 * Loucos por Vitrola - Image Comparison Slider ("Antes e Depois")
 * Controle interativo com Range Input nativo e abas mobile
 */

class ComparisonSlider {
  constructor(element) {
    this.wrapper = element;
    this.container = element.querySelector('.comparison-container');
    this.range = element.querySelector('.comparison-range');
    this.tabs = element.querySelectorAll('.comparison-tab-btn');

    this.init();
  }

  init() {
    if (this.range && this.container) {
      this.range.addEventListener('input', (e) => {
        this.updatePosition(e.target.value);
      });
    }

    if (this.tabs) {
      this.tabs.forEach(btn => {
        btn.addEventListener('click', () => {
          this.tabs.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const mode = btn.dataset.compareView;
          if (mode === 'before') {
            this.updatePosition(100);
            if (this.range) this.range.value = 100;
          } else if (mode === 'after') {
            this.updatePosition(0);
            if (this.range) this.range.value = 0;
          } else {
            this.updatePosition(50);
            if (this.range) this.range.value = 50;
          }
        });
      });
    }
  }

  updatePosition(percent) {
    if (this.container) {
      this.container.style.setProperty('--slider-pos', `${percent}%`);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.comparison-slider-wrapper');
  sliders.forEach(slider => new ComparisonSlider(slider));
});
