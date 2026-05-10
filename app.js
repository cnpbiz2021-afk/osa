// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');

hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
mobileNavClose.addEventListener('click', () => mobileNav.classList.remove('open'));
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileNav.classList.remove('open'));
});

// ===== HERO PARTICLES =====
function createParticles() {
  const container = document.querySelector('.hero-particles');
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 6 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(particle);
  }
}
createParticles();

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealElements.forEach(el => revealObserver.observe(el));

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(fi => {
      fi.classList.remove('active');
      fi.querySelector('.faq-answer').style.maxHeight = null;
    });

    // Open clicked
    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ===== SELF-DIAGNOSIS =====
const diagnosisQuestions = document.querySelectorAll('.diagnosis-question input');
const diagnosisResult = document.getElementById('diagnosisResult');
const diagnosisBtn = document.getElementById('diagnosisBtn');

diagnosisBtn.addEventListener('click', () => {
  let score = 0;
  diagnosisQuestions.forEach(q => { if (q.checked) score++; });

  diagnosisResult.classList.add('show');
  diagnosisResult.classList.remove('low', 'medium', 'high');

  const icon = diagnosisResult.querySelector('.result-icon');
  const title = diagnosisResult.querySelector('.result-title');
  const desc = diagnosisResult.querySelector('.result-desc');

  if (score <= 2) {
    diagnosisResult.classList.add('low');
    icon.textContent = '😊';
    title.textContent = '수면 건강이 양호합니다';
    desc.textContent = '현재 심각한 수면 문제는 없어 보입니다. 하지만 증상이 지속된다면 전문의 상담을 권장합니다.';
  } else if (score <= 5) {
    diagnosisResult.classList.add('medium');
    icon.textContent = '⚠️';
    title.textContent = '수면다원검사를 권장합니다';
    desc.textContent = '수면 관련 문제가 의심됩니다. 정확한 진단을 위해 수면다원검사를 받아보시길 권장합니다. 건강보험 적용이 가능할 수 있습니다.';
  } else {
    diagnosisResult.classList.add('high');
    icon.textContent = '🚨';
    title.textContent = '전문의 상담이 꼭 필요합니다';
    desc.textContent = '수면 질환의 가능성이 높습니다. 수면무호흡증 등의 질환은 치료하지 않으면 심혈관 질환, 뇌졸중 등 심각한 합병증을 유발할 수 있으니 빠른 시일 내에 전문의 상담을 받으세요.';
  }

  diagnosisResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(target * eased).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));
