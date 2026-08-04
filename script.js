
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

document.querySelectorAll('.service-tab').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.service-tab').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.service-panel').forEach(panel => panel.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.target).classList.add('active');
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const quoteModal = document.querySelector('.quote-modal');
const openQuoteButtons = document.querySelectorAll('.open-quote');
const closeQuoteButton = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');

function openQuote() {
  quoteModal.classList.add('open');
  quoteModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}
function closeQuote() {
  quoteModal.classList.remove('open');
  quoteModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
openQuoteButtons.forEach(button => button.addEventListener('click', openQuote));
closeQuoteButton.addEventListener('click', closeQuote);
modalBackdrop.addEventListener('click', closeQuote);

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
document.querySelectorAll('.case-gallery img').forEach(image => {
  image.addEventListener('click', () => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add('open');
  });
});
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.classList.remove('open');
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeQuote();
    lightbox.classList.remove('open');
  }
});

const params = new URLSearchParams(window.location.search);
if (params.get('cotizacion') === 'enviada') {
  alert('La solicitud de cotización fue enviada correctamente.');
  history.replaceState({}, document.title, window.location.pathname);
}
document.getElementById('year').textContent = new Date().getFullYear();
