/**
 * Loucos por Vitrola - Sistema de Formulário de Orçamento & Contato
 * Validação semântica e encaminhamento direto para o WhatsApp Oficial
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('quoteContactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim();
    const city = document.getElementById('contactCity')?.value.trim();
    const equipmentBrand = document.getElementById('contactBrand')?.value.trim();
    const equipmentModel = document.getElementById('contactModel')?.value.trim();
    const serviceType = document.getElementById('contactServiceType')?.value;
    const symptoms = document.getElementById('contactSymptoms')?.value.trim();

    if (!name || !phone || !equipmentBrand) {
      if (window.cartInstance) {
        window.cartInstance.showToast('Por favor, preencha os campos obrigatórios (Nome, WhatsApp e Marca).', 'error');
      } else {
        alert('Por favor, preencha os campos obrigatórios.');
      }
      return;
    }

    let message = `*Olá, Oficina Loucos por Vitrola! Solicito Orçamento:*\n\n`;
    message += `👤 *Nome:* ${name}\n`;
    message += `📱 *WhatsApp:* ${phone}\n`;
    if (city) message += `📍 *Cidade/Estado:* ${city}\n`;
    message += `\n🎧 *Equipamento:* ${equipmentBrand} ${equipmentModel || ''}\n`;
    message += `🔧 *Tipo de Serviço:* ${serviceType || 'Restauração Geral / Avaliação'}\n`;
    if (symptoms) {
      message += `📝 *Defeito / Descrição:* ${symptoms}\n`;
    }
    message += `\nAguardo as instruções para envio ou agendamento na bancada.`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511996176660?text=${encoded}`;

    if (window.cartInstance) {
      window.cartInstance.showToast('Redirecionando para o WhatsApp da oficina...', 'success');
    }

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      contactForm.reset();
    }, 800);
  });
});
