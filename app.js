(function () {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== HEADER : 스크롤 시 흰 배경 + 높이 축소 =====
  const header = document.getElementById('navbar');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ===== 현재 섹션 메뉴 표시 =====
  const navLinks = Array.from(document.querySelectorAll('.gnb a'));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => {
    const sec = document.querySelector(a.getAttribute('href'));
    if (sec) sectionObserver.observe(sec);
  });

  // ===== MOBILE NAV =====
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');

  function setMenu(open) {
    mobileNav.classList.toggle('open', open);
    mobileNav.setAttribute('aria-hidden', String(!open));
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) mobileNavClose.focus(); else hamburger.focus({ preventScroll: true });
  }
  hamburger.addEventListener('click', () => setMenu(true));
  mobileNavClose.addEventListener('click', () => setMenu(false));
  mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) setMenu(false);
  });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', (e) => {
    if (e.matches && mobileNav.classList.contains('open')) setMenu(false);
  });

  // ===== SCROLL REVEAL =====
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // ===== FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('active');
      faqItems.forEach((fi) => {
        fi.classList.remove('active');
        fi.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        fi.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (willOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
  window.addEventListener('resize', () => {
    const open = document.querySelector('.faq-item.active .faq-answer');
    if (open) open.style.maxHeight = open.scrollHeight + 'px';
  });

  // ===== SELF-DIAGNOSIS =====
  const diagnosisInputs = document.querySelectorAll('.diagnosis-question input');
  const diagnosisResult = document.getElementById('diagnosisResult');
  document.getElementById('diagnosisBtn').addEventListener('click', () => {
    let score = 0;
    diagnosisInputs.forEach((q) => { if (q.checked) score++; });

    diagnosisResult.classList.add('show');
    diagnosisResult.classList.remove('low', 'medium', 'high');
    const icon = diagnosisResult.querySelector('.result-icon');
    const title = diagnosisResult.querySelector('.result-title');
    const desc = diagnosisResult.querySelector('.result-desc');

    if (score <= 2) {
      diagnosisResult.classList.add('low');
      icon.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-check-circle"/></svg>';
      title.textContent = '수면 건강이 양호합니다';
      desc.textContent = '현재 심각한 수면 문제는 없어 보입니다. 하지만 증상이 지속된다면 전문의 상담을 권장합니다.';
    } else if (score <= 5) {
      diagnosisResult.classList.add('medium');
      icon.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-alert"/></svg>';
      title.textContent = '수면다원검사를 권장합니다';
      desc.textContent = '수면 관련 문제가 의심됩니다. 정확한 진단을 위해 수면다원검사를 받아보시길 권장합니다. 건강보험 적용이 가능할 수 있습니다.';
    } else {
      diagnosisResult.classList.add('high');
      icon.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-alert-circle"/></svg>';
      title.textContent = '전문의 상담이 꼭 필요합니다';
      desc.textContent = '수면 질환의 가능성이 높습니다. 수면무호흡증 등의 질환은 치료하지 않으면 심혈관 질환, 뇌졸중 등 심각한 합병증을 유발할 수 있으니 빠른 시일 내에 전문의 상담을 받으세요.';
    }
    diagnosisResult.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  });

  // ===== COUNTER (카운트업) =====
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    function update(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(target * eased).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  if (!reduceMotion) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach((c) => counterObserver.observe(c));
  }

  // ===== 시설 안내 갤러리 : 자동 슬라이드 + 라이트박스 =====
  const track = document.getElementById('facilityTrack');
  if (track) {
    const originals = Array.from(track.children);
    const gallery = originals.map((el) => ({
      src: el.querySelector('img').getAttribute('src'),
      alt: el.querySelector('img').getAttribute('alt'),
      caption: el.querySelector('.facility-caption').textContent
    }));

    // 무한 루프용 복제본 (2세트)
    for (let n = 0; n < 2; n++) {
      originals.forEach((el) => {
        const c = el.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.setAttribute('tabindex', '-1');
        c.querySelector('img').setAttribute('alt', '');
        track.appendChild(c);
      });
    }
    const items = Array.from(track.children);

    const BASE = 0.5, FAST = 5;
    let x = 0, vel = reduceMotion ? 0 : -BASE, target = reduceMotion ? 0 : -BASE, hoverPause = false, visible = true;
    let loopW = 0;
    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return originals.reduce((w, el) => w + el.getBoundingClientRect().width + gap, 0);
    };
    function frame() {
      if (visible) {
        if (!loopW) loopW = measure();
        vel += ((hoverPause ? 0 : target) - vel) * 0.08;
        x += vel;
        if (x <= -loopW) x += loopW;
        if (x > 0) x -= loopW;
        track.style.transform = 'translate3d(' + x + 'px,0,0)';
      }
      requestAnimationFrame(frame);
    }
    window.addEventListener('resize', () => { loopW = 0; });
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(track);
    requestAnimationFrame(frame);

    // 화살표 : 마우스 오버/누르고 있는 동안 해당 방향으로 빠르게, 클릭 시 한 장 이동
    const prev = document.getElementById('facilityArrowPrev');
    const next = document.getElementById('facilityArrowNext');
    const idle = () => (reduceMotion ? 0 : -BASE);
    const setDir = (v) => { target = v; };
    prev.addEventListener('mouseenter', () => setDir(FAST));
    next.addEventListener('mouseenter', () => setDir(-FAST));
    [prev, next].forEach((b) => b.addEventListener('mouseleave', () => setDir(idle())));
    prev.addEventListener('touchstart', () => setDir(FAST), { passive: true });
    next.addEventListener('touchstart', () => setDir(-FAST), { passive: true });
    [prev, next].forEach((b) => b.addEventListener('touchend', () => setDir(idle())));
    const step = () => originals[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
    prev.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); x += step(); } });
    next.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); x -= step(); } });

    // 손가락으로 드래그(스와이프)
    let dragStartX = null, dragStartPos = 0, dragged = false;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return;
      dragStartX = e.clientX; dragStartPos = x; dragged = false; hoverPause = true;
    });
    window.addEventListener('pointermove', (e) => {
      if (dragStartX === null) return;
      const dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 6) dragged = true;
      x = dragStartPos + dx; vel = 0;
    });
    const endDrag = () => {
      if (dragStartX === null) return;
      dragStartX = null; hoverPause = false;
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    track.addEventListener('mouseenter', () => { hoverPause = true; });
    track.addEventListener('mouseleave', () => { hoverPause = false; });

    // 라이트박스
    const lightbox = document.getElementById('facilityLightbox');
    const lbImg = document.getElementById('lightboxImage');
    const lbCap = document.getElementById('lightboxCaption');
    const btnClose = document.getElementById('lightboxClose');
    let current = 0, lastFocus = null;

    const render = () => {
      const item = gallery[current];
      lbImg.src = item.src; lbImg.alt = item.alt; lbCap.textContent = item.caption;
    };
    function open(i) {
      lastFocus = document.activeElement;
      current = i; render();
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      btnClose.focus();
    }
    function close() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }
    const showPrev = () => { current = (current - 1 + gallery.length) % gallery.length; render(); };
    const showNext = () => { current = (current + 1) % gallery.length; render(); };

    items.forEach((el, i) => {
      const idx = i % gallery.length;
      el.addEventListener('click', () => { if (!dragged) open(idx); });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(idx); }
      });
    });
    btnClose.addEventListener('click', close);
    document.getElementById('lightboxPrev').addEventListener('click', showPrev);
    document.getElementById('lightboxNext').addEventListener('click', showNext);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }
})();
