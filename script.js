const navbar = document.querySelector('#navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a, .brand').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.querySelector('#year').textContent = new Date().getFullYear();

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  form.classList.add('loading');
  status.textContent = '';

  const payload = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await fetch('/.netlify/functions/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || 'No se pudo enviar el mensaje.');

    form.reset();
    status.textContent = '✓ Mensaje enviado correctamente. Gracias por contactarme.';
    status.style.color = '#35d0ba';
  } catch (error) {
    status.textContent = 'No se pudo enviar el mensaje. Inténtalo nuevamente en unos minutos.';
    status.style.color = '#ff8f8f';
    console.error(error);
  } finally {
    form.classList.remove('loading');
  }
});
