gsap.registerPlugin(ScrollTrigger);
let lastScroll = 0;

// ─── PRELOADER ───
(function() {
  const preloader = document.getElementById('preloader');
  const bar = document.querySelector('.preloader-bar');
  const label = document.getElementById('preloaderLabel');
  const main = document.getElementById('main');
  const header = document.getElementById('header');
  const cursor = document.getElementById('cursor');

  let start = performance.now();
  const DURATION = 2200;

  function tick() {
    const elapsed = performance.now() - start;
    const pct = Math.min(elapsed / DURATION, 1);
    const eased = 1 - Math.pow(1 - pct, 3);
    bar.style.width = (eased * 100) + '%';
    label.textContent = String(Math.round(eased * 100)).padStart(2, '0');
    if (pct < 1) {
      requestAnimationFrame(tick);
    } else {
      label.textContent = '00';
      setTimeout(reveal, 300);
    }
  }

  function reveal() {
    preloader.classList.add('done');
    main.classList.add('visible');
    header.classList.add('visible');

    animateHero();
    initScrollAnimations();

    setTimeout(() => {
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, 1200);
  }

  setTimeout(() => requestAnimationFrame(tick), 200);
})();

// ─── HERO ANIMATION ───
function animateHero() {
  const tl = gsap.timeline();

  tl.to('.hero-label', {
    y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
  }, 0.3);

  tl.to('.char', {
    y: 0, opacity: 1, duration: 1.2,
    stagger: 0.04, ease: 'power3.out',
  }, 0.6);

  tl.to('.hero-sub-text', {
    y: 0, opacity: 1, duration: 1, ease: 'power3.out',
  }, 1.0);

  tl.to('.hero-cta', {
    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
  }, 1.1);
}

// ─── MENU ───
const menuBtn = document.getElementById('menuBtn');
const fullMenu = document.getElementById('fullMenu');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
  menuOpen ? closeMenu() : openMenu();
});

function openMenu() {
  menuOpen = true;
  menuBtn.classList.add('open');
  fullMenu.classList.add('open');
  document.body.style.overflow = 'hidden';

  gsap.fromTo(fullMenu,
    { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
    { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      duration: 1.2, ease: 'power3.inOut', delay: 0.1 }
  );

  gsap.fromTo('.full-menu-link',
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'power3.out', delay: 0.3 }
  );

  gsap.fromTo('.full-menu-footer',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 }
  );
}

function closeMenu() {
  menuOpen = false;
  menuBtn.classList.remove('open');
  document.body.style.overflow = '';

  gsap.to(fullMenu, {
    clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
    duration: 0.8, ease: 'power3.inOut',
    onComplete: () => fullMenu.classList.remove('open')
  });
}

document.querySelectorAll('.full-menu-link').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    closeMenu();
    const href = a.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500);
    }
  });
});

// ─── NAV HIGHLIGHT ───
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
  let current = '';
  const scrollY = window.scrollY;
  sections.forEach(section => {
    const top = section.offsetTop - 300;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── HEADER HIDE/SHOW ───
document.addEventListener('scroll', () => {
  const h = document.getElementById('header');
  if (!h) return;
  const scrollY = window.scrollY;
  if (scrollY > lastScroll && scrollY > 200) {
    h.style.transform = 'translateY(-100%)';
  } else {
    h.style.transform = 'translateY(0)';
  }
  lastScroll = scrollY;
});

// ─── CURSOR ───
const cursor = document.getElementById('cursor');
let cursorFired = false;
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    if (!cursorFired) {
      cursorFired = true;
      cursor.classList.add('visible');
      gsap.set(cursor, { x: e.clientX, y: e.clientY });
      return;
    }
    gsap.to(cursor, {
      x: e.clientX, y: e.clientY,
      duration: 0.3, ease: 'power2.out'
    });
  });

  document.querySelectorAll('a, button, .work-card, .work-card-btn, .service-row').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// ─── SCROLL ANIMATIONS ───
function initScrollAnimations() {
  ScrollTrigger.refresh();

  // Work cards: fade-in on scroll
  gsap.utils.toArray('.work-card').forEach(card => {
    gsap.to(card, {
      y: 0, opacity: 1, duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card, start: 'top 90%', end: 'top 50%',
        toggleActions: 'play none none none',
      }
    });
  });

  // Work cards: hover "Ver mais" to expand preview
  gsap.utils.toArray('.work-card').forEach(card => {
    const trigger = card.querySelector('.work-card-trigger');
    const expand = card.querySelector('.work-card-expand');
    const inner = card.querySelector('.work-card-expand-inner');
    if (!trigger || !expand || !inner) return;

    let open = false;

    trigger.addEventListener('mouseenter', () => reveal());
    trigger.addEventListener('mouseleave', (e) => {
      if (expand.contains(e.relatedTarget)) return;
      hide();
    });
    expand.addEventListener('mouseleave', (e) => {
      if (trigger.contains(e.relatedTarget)) return;
      hide();
    });

    function reveal() {
      if (open) return;
      open = true;
      expand.style.height = '0';
      const h = inner.offsetHeight;
      gsap.to(expand, {
        height: h, duration: 0.6, ease: 'power3.inOut',
        onComplete: () => { expand.style.height = 'auto'; }
      });
      gsap.fromTo(inner,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.05 }
      );
    }

    function hide() {
      if (!open) return;
      open = false;
      expand.style.height = expand.offsetHeight + 'px';
      requestAnimationFrame(() => {
        gsap.to(expand, {
          height: 0, duration: 0.4, ease: 'power3.inOut',
          onComplete: () => { expand.style.height = ''; }
        });
      });
    }
  });

  gsap.utils.toArray('.service-row').forEach((row, i) => {
    gsap.to(row, {
      y: 0, opacity: 1, duration: 1,
      delay: i * 0.12, ease: 'power3.out',
      scrollTrigger: {
        trigger: row, start: 'top 85%', end: 'top 50%',
        toggleActions: 'play none none none',
      }
    });
  });

  gsap.utils.toArray('.statement-quote-line').forEach((line, i) => {
    gsap.to(line, {
      y: 0, opacity: 1, duration: 1.2,
      delay: i * 0.15, ease: 'power3.out',
      scrollTrigger: {
        trigger: line, start: 'top 85%', end: 'top 45%',
        toggleActions: 'play none none none',
      }
    });
  });

  gsap.to('.statement-caption', {
    y: 0, opacity: 1, duration: 1.2, delay: 0.4,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.statement', start: 'top 75%', end: 'top 45%',
      toggleActions: 'play none none none',
    }
  });

  gsap.to('.statement-cta', {
    y: 0, opacity: 1, duration: 1, delay: 0.6,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.statement', start: 'top 75%', end: 'top 45%',
      toggleActions: 'play none none none',
    }
  });

  gsap.from('.footer-main', {
    y: 40, opacity: 0, duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.footer', start: 'top 85%', end: 'top 50%',
      toggleActions: 'play none none none',
    }
  });

  gsap.from('.footer-bottom', {
    y: 20, opacity: 0, duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.footer-bottom', start: 'top 90%',
      toggleActions: 'play none none none',
    }
  });

  document.querySelector('.back-to-top')?.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  ScrollTrigger.create({ onUpdate: updateNav });
  ScrollTrigger.refresh();
}

// ─── IMAGE VIEWER (slideshow) ───
(function() {
  const iv = document.getElementById('imageViewer');
  if (!iv) return;
  const ivImg = document.getElementById('ivImg');
  const ivBody = document.getElementById('ivBody');
  const ivClose = document.getElementById('ivClose');
  const ivZoomIn = document.getElementById('ivZoomIn');
  const ivZoomOut = document.getElementById('ivZoomOut');
  const ivLevel = document.getElementById('ivLevel');
  const ivPrev = document.getElementById('ivPrev');
  const ivNext = document.getElementById('ivNext');
  let zoom = 1, images = [], index = 0;

  function load(i) {
    index = i;
    zoom = 1;
    ivImg.src = images[index];
    ivImg.style.transform = 'scale(1)';
    ivLevel.textContent = '100%';
    ivPrev.style.display = index > 0 ? 'flex' : 'none';
    ivNext.style.display = index < images.length - 1 ? 'flex' : 'none';
  }

  function open(src) { images = [src]; load(0); iv.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function openGallery(arr, i) { images = arr; load(i); iv.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { iv.classList.remove('open'); document.body.style.overflow = ''; ivImg.src = ''; images = []; }
  function update() { const p = Math.round(zoom * 100); ivImg.style.transform = `scale(${zoom})`; ivLevel.textContent = p + '%'; }

  function next() { if (index < images.length - 1) load(index + 1); }
  function prev() { if (index > 0) load(index - 1); }

  ivClose.addEventListener('click', close);
  iv.addEventListener('click', e => { if (e.target === iv) close(); });
  ivZoomIn.addEventListener('click', () => { zoom = Math.min(8, zoom + 0.5); update(); });
  ivZoomOut.addEventListener('click', () => { zoom = Math.max(1, zoom - 0.5); update(); });
  ivBody.addEventListener('wheel', e => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); zoom = Math.max(1, Math.min(8, zoom + (e.deltaY > 0 ? -0.5 : 0.5))); update(); } }, { passive: false });
  ivPrev.addEventListener('click', e => { e.stopPropagation(); prev(); });
  ivNext.addEventListener('click', e => { e.stopPropagation(); next(); });

  // touch pinch-to-zoom
  let lastDist = 0;
  ivBody.addEventListener('touchstart', e => {
    if (e.touches.length === 2) { e.preventDefault(); const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY; lastDist = Math.hypot(dx, dy); }
  }, { passive: false });
  ivBody.addEventListener('touchmove', e => {
    if (e.touches.length === 2) { e.preventDefault(); const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY; const dist = Math.hypot(dx, dy); const delta = (dist - lastDist) * 0.01; zoom = Math.max(1, Math.min(8, zoom + delta)); update(); lastDist = dist; }
  }, { passive: false });

  // keyboard nav
  document.addEventListener('keydown', e => {
    if (!iv.classList.contains('open')) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'Escape') close();
  });

  // click image to advance
  ivImg.addEventListener('click', e => { e.stopPropagation(); next(); });

  window.__openViewer = open;
  window.__openGallery = openGallery;
})();

// ─── PRESENTATION MODAL ───
(function() {
  const pres = document.getElementById('presentation');
  if (!pres) return;
  const strip = document.getElementById('presentationStrip');
  const closeBtn = document.getElementById('presentationClose');

  function getImages(card) {
    const isMobile = window.innerWidth <= 768;
    const attr = isMobile && card.hasAttribute('data-images-mobile') ? 'data-images-mobile' : 'data-images';
    return JSON.parse(card.getAttribute(attr) || '[]');
  }

  function open(images) {
    strip.innerHTML = images.map(src => `<img src="${src}" alt="">`).join('');
    pres.classList.add('open');
    document.body.style.overflow = 'hidden';
    pres.scrollTop = 0;
    gsap.fromTo(strip.querySelectorAll('img'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'power2.out', delay: 0.1 }
    );
  }
  function close() { pres.classList.remove('open'); document.body.style.overflow = ''; strip.innerHTML = ''; }
  closeBtn.addEventListener('click', close);
  pres.addEventListener('click', e => { if (e.target === pres) close(); });

  // Click "Abrir apresentação" buttons
  document.querySelectorAll('.work-card-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.work-card');
      const imgs = getImages(card);
      if (imgs.length) open(imgs);
    });
  });

  // Click card cover → open presentation
  document.querySelectorAll('.work-card-cover').forEach(cover => {
    cover.addEventListener('click', e => {
      const card = cover.closest('.work-card');
      const imgs = getImages(card);
      if (imgs.length) open(imgs);
    });
  });

  // Click image inside presentation → open gallery slideshow
  strip.addEventListener('click', e => {
    const img = e.target.closest('img');
    if (!img || !window.__openGallery) return;
    const allImgs = Array.from(strip.querySelectorAll('img')).map(i => i.src);
    const idx = allImgs.indexOf(img.src);
    if (idx > -1) window.__openGallery(allImgs, idx);
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (pres.classList.contains('open')) close();
    }
  });
})();

window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});
