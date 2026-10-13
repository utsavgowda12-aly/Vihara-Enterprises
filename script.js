const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: .12 });
reveals.forEach(el => observer.observe(el));

const autoVideos = document.querySelectorAll('video[data-autoplay]');
if (autoVideos.length) {
  const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }), { threshold: .45 });

  autoVideos.forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    videoObserver.observe(video);
  });
}

const filters = document.querySelectorAll('.filters button');
const projects = document.querySelectorAll('.project-card');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  projects.forEach(project => project.classList.toggle('hidden', filter !== 'all' && project.dataset.category !== filter));
}));

const area = document.getElementById('area');
const areaValue = document.getElementById('areaValue');
const planValue = document.getElementById('planValue');
const rateValue = document.getElementById('rateValue');
const estimateValue = document.getElementById('estimateValue');
const priceCards = document.querySelectorAll('.price-card');
let selectedRate = 1850;

function updateEstimate() {
  const squareFeet = Number(area.value);
  const total = squareFeet * selectedRate;
  areaValue.textContent = `${squareFeet.toLocaleString('en-IN')} sq.ft.`;
  rateValue.textContent = `₹${selectedRate.toLocaleString('en-IN')}`;
  estimateValue.textContent = total >= 10000000 ? `₹${(total / 10000000).toFixed(2)} crore` : `₹${(total / 100000).toFixed(2)} lakh`;
}
if (area) {
  area.addEventListener('input', updateEstimate);
  priceCards.forEach(card => card.addEventListener('click', () => {
    priceCards.forEach(item => item.classList.remove('active'));
    card.classList.add('active');
    selectedRate = Number(card.dataset.rate);
    planValue.textContent = card.dataset.plan;
    updateEstimate();
  }));
}

document.getElementById('contactForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const name = new FormData(event.target).get('name');
  document.getElementById('formStatus').textContent = `Thank you, ${name}. Your request is ready — our team will contact you shortly.`;
  event.target.reset();
});
document.getElementById('year').textContent = new Date().getFullYear();
