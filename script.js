const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

const siteHeader = document.querySelector('.header');
let lastScrollY = window.scrollY;
let headerTicking = false;
const updateHeader = () => {
  const currentScrollY = window.scrollY;
  const movingDown = currentScrollY > lastScrollY;
  const menuOpen = nav?.classList.contains('open');
  siteHeader?.classList.toggle('header-hidden', movingDown && currentScrollY > 140 && !menuOpen);
  if (!movingDown || currentScrollY < 80) siteHeader?.classList.remove('header-hidden');
  lastScrollY = currentScrollY;
  headerTicking = false;
};
window.addEventListener('scroll', () => {
  if (!headerTicking) {
    window.requestAnimationFrame(updateHeader);
    headerTicking = true;
  }
}, { passive: true });

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
const projectGrid = document.querySelector('.project-grid');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  projectGrid?.classList.toggle('filtered', filter !== 'all');
  projects.forEach(project => project.classList.toggle('hidden', filter !== 'all' && project.dataset.category !== filter));
}));

const area = document.getElementById('area');
const areaValue = document.getElementById('areaValue');
const planValue = document.getElementById('planValue');
const rateValue = document.getElementById('rateValue');
const estimateValue = document.getElementById('estimateValue');
const priceCards = document.querySelectorAll('.price-card');
let selectedRate = Number(document.querySelector('.price-card.active')?.dataset.rate || 1850);

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

const openExpertPopup = () => {
  const popup = document.createElement('div');
  popup.className = 'expert-popup';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-modal', 'true');
  popup.setAttribute('aria-labelledby', 'expertPopupTitle');
  popup.innerHTML = `
    <button class="expert-popup-backdrop" type="button" aria-label="Close consultation popup"></button>
    <div class="expert-popup-panel">
      <button class="expert-popup-close" type="button" aria-label="Close consultation popup">×</button>
      <div class="expert-popup-mark">VE</div>
      <p class="eyebrow">A BETTER BUILD STARTS WITH A CONVERSATION</p>
      <h2 id="expertPopupTitle">Talk to Our<br><span>Construction Experts.</span></h2>
      <p class="expert-popup-copy">Planning a home, electrical system, pump installation, drainage work or custom interior detail? Tell us where you are starting and we’ll help define the next step.</p>
      <div class="expert-popup-types" aria-label="Project types"><span>Residential</span><span>Interiors</span><span>Electrical</span><span>Pump systems</span><span>Drainage</span><span>ART Works</span></div>
      <div class="expert-popup-actions"><a class="btn primary" href="index.html#contact">Discuss your project <span>↗</span></a><a class="expert-phone" href="tel:+919008499355"><small>CALL OUR TEAM</small><strong>+91 90084 99355</strong></a></div>
    </div>`;
  document.body.appendChild(popup);
  document.body.classList.add('popup-open');
  requestAnimationFrame(() => popup.classList.add('is-open'));
  const closePopup = () => {
    popup.classList.remove('is-open');
    document.body.classList.remove('popup-open');
    window.setTimeout(() => popup.remove(), 350);
    document.removeEventListener('keydown', handleEscape);
  };
  const handleEscape = event => { if (event.key === 'Escape') closePopup(); };
  popup.querySelector('.expert-popup-close').addEventListener('click', closePopup);
  popup.querySelector('.expert-popup-backdrop').addEventListener('click', closePopup);
  popup.querySelector('.expert-popup-actions a').addEventListener('click', closePopup);
  document.addEventListener('keydown', handleEscape);
  popup.querySelector('.expert-popup-close').focus();
};

let hasSeenExpertPopup = false;
try { hasSeenExpertPopup = sessionStorage.getItem('viharaExpertPopupSeen') === 'true'; } catch (error) {}
if (!hasSeenExpertPopup) {
  window.setTimeout(() => {
    try { sessionStorage.setItem('viharaExpertPopupSeen', 'true'); } catch (error) {}
    openExpertPopup();
  }, 1100);
}

document.getElementById('year').textContent = new Date().getFullYear();
