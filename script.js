gsap.registerPlugin(ScrollTrigger);

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
    initNoise();
    initScrollAnimations();
    initServiceCards();
    initStatementToggle();

    setTimeout(() => {
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, 1200);
  }

  setTimeout(() => requestAnimationFrame(tick), 200);
})();

// ─── NOISE ───
function initNoise() {
  const canvas = document.getElementById('workNoise');
  if (!canvas) return;
  new Noise(canvas, {
    grainSize: 4,
    patternRefreshInterval: 2,
    patternAlpha: 20,
  });
}

// ─── HERO ANIMATION ───
function animateHero() {
  const tl = gsap.timeline();

  tl.to('.hero-welcome', {
    opacity: 1, duration: 1, ease: 'power2.out',
  }, 0.4);

  tl.to('.hero-logo', {
    opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
  }, 0.6);

  tl.to('.hero-title', {
    y: 0, opacity: 1, duration: 1, ease: 'power3.out',
  }, 1.0);

  tl.to('.hero-subtitle', {
    y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
  }, 1.3);

  gsap.to('.hero-logo', {
    y: -20, duration: 3, ease: 'sine.inOut',
    repeat: -1, yoyo: true,
    delay: 2.5,
  });
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

  document.querySelectorAll('a, button, .work-card, .work-card-btn, .carousel-arrow, .carousel-dot').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  const servicesSection = document.getElementById('services');
  if (servicesSection) {
    servicesSection.addEventListener('mouseenter', () => cursor.classList.add('services-hover'));
    servicesSection.addEventListener('mouseleave', () => cursor.classList.remove('services-hover'));
  }
  const workSection = document.getElementById('work');
  if (workSection) {
    workSection.addEventListener('mouseenter', () => cursor.classList.add('work-hover'));
    workSection.addEventListener('mouseleave', () => cursor.classList.remove('work-hover'));
  }
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
  const allCards = gsap.utils.toArray('.work-card');
  const closeAll = [];
  allCards.forEach(card => {
    const trigger = card.querySelector('.work-card-trigger');
    const expand = card.querySelector('.work-card-expand');
    const inner = card.querySelector('.work-card-expand-inner');
    if (!trigger || !expand || !inner) return;

    let open = false;

    trigger.addEventListener('mouseenter', () => {
      closeAll.forEach(fn => fn());
      reveal();
    });
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

    closeAll.push(hide);
  });

  gsap.to('.statement-subtitle', {
    y: 0, opacity: 1, duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.statement-subtitle', start: 'top 90%', end: 'top 60%',
      toggleActions: 'play none none none',
    }
  });

  gsap.utils.toArray('.statement-bio-p').forEach((p, i) => {
    gsap.to(p, {
      y: 0, opacity: 1, duration: 1.2,
      delay: i * 0.2, ease: 'power3.out',
      scrollTrigger: {
        trigger: p, start: 'top 85%', end: 'top 45%',
        toggleActions: 'play none none none',
      }
    });
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

  gsap.from('.footer-bottom, .footer-bottom-mobile', {
    y: 20, opacity: 0, duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.footer-bottom, .footer-bottom-mobile', start: 'top 90%',
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
    strip.innerHTML = images.map(src => {
      if (src.endsWith('.mp4')) return `<video src="${src}" autoplay loop muted playsinline></video>`;
      return `<img src="${src}" alt="">`;
    }).join('');
    pres.classList.add('open');
    document.body.style.overflow = 'hidden';
    pres.scrollTop = 0;
    gsap.fromTo(strip.querySelectorAll('img, video'),
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

// ─── ABOUT MODAL ───
(function() {
  const modal = document.getElementById('aboutModal');
  if (!modal) return;
  const closeBtn = document.getElementById('aboutClose');
  const overlay = document.getElementById('aboutOverlay');
  const about = document.getElementById('about');
  function open() { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { modal.classList.remove('open'); document.body.style.overflow = ''; }
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
})();

window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

// ─── LANGUAGE TOGGLE ───
const i18n = {
  'site-title': {
    pt: 'Fernanda Zorzo — Direção de Arte & Branding',
    en: 'Fernanda Zorzo — Art Direction & Branding'
  },
  'nav-home': { pt: 'Home', en: 'Home' },
  'nav-work': { pt: 'Projetos', en: 'Projects' },
  'nav-services': { pt: 'Atuação', en: 'Expertise' },
  'nav-about': { pt: 'Sobre mim', en: 'About me' },
  'nav-contact': { pt: 'Contato', en: 'Contact' },
  'header-cta': { pt: 'Vamos conversar', en: "Let's talk" },
  'hero-welcome': { pt: 'bem-vindo!', en: 'welcome!' },
  'hero-title': { pt: 'Construindo marcas com propósito e personalidade.', en: 'Building brands with purpose and personality.' },
  'hero-subtitle': { pt: 'Direção de arte, branding e identidades visuais que unem<span class="mobile-break"><br></span>estratégia, conceito e sensibilidade estética.', en: 'Art direction, branding and visual identities that unite<span class="mobile-break"><br></span>strategy, concept and aesthetic sensibility.' },
  'hero-scroll': { pt: 'role para explorar', en: 'scroll to explore' },
  'services-title': { pt: 'Minha Atuação', en: 'What I Do' },
  'serv-branding-title': { pt: 'Branding &<br>Identidade Visual', en: 'Branding &<br>Visual Identity' },
  'serv-branding-desc': { pt: 'Desenvolvimento de identidades visuais estratégicas que traduzem a essência da marca em sistemas visuais consistentes, memoráveis e preparados para diferentes pontos de contato.', en: 'Development of strategic visual identities that translate the brand essence into consistent, memorable visual systems ready for different touchpoints.' },
  'serv-branding-i1': { pt: 'Branding', en: 'Branding' },
  'serv-branding-i2': { pt: 'Identidade Visual', en: 'Visual Identity' },
  'serv-branding-i3': { pt: 'Estratégia de Marca', en: 'Brand Strategy' },
  'serv-branding-i4': { pt: 'Sistemas Visuais', en: 'Visual Systems' },
  'serv-branding-i5': { pt: 'Diretrizes de Marca', en: 'Brand Guidelines' },
  'serv-branding-i6': { pt: 'Design de Logotipo', en: 'Logo Design' },
  'serv-branding-i7': { pt: 'Design de Embalagem', en: 'Packaging Design' },
  'serv-branding-i8': { pt: 'Design Gráfico', en: 'Print Design' },
  'serv-artdirection-title': { pt: 'Direção<br>de Arte', en: 'Art<br>Direction' },
  'serv-artdirection-desc': { pt: 'Criação de conceitos visuais para marcas, campanhas e projetos editoriais, garantindo consistência estética e narrativas visuais fortes.', en: 'Creation of visual concepts for brands, campaigns and editorial projects, ensuring aesthetic consistency and strong visual narratives.' },
  'serv-artdirection-i1': { pt: 'Direção Criativa', en: 'Creative Direction' },
  'serv-artdirection-i2': { pt: 'Direção de Arte', en: 'Art Direction' },
  'serv-artdirection-i3': { pt: 'Conceitos Criativos', en: 'Creative Concepts' },
  'serv-artdirection-i4': { pt: 'Key Visuals', en: 'Key Visuals' },
  'serv-artdirection-i5': { pt: 'Moodboards', en: 'Moodboards' },
  'serv-artdirection-i6': { pt: 'Direção de Fotografia', en: 'Photography Direction' },
  'serv-artdirection-i7': { pt: 'Direção de Imagem com IA', en: 'AI Image Direction' },
  'serv-artdirection-i8': { pt: 'Design Editorial', en: 'Editorial Design' },
  'serv-artdirection-i9': { pt: 'Retoque de Imagem', en: 'Image Retouching' },
  'serv-social-title': { pt: 'Social<br>Media', en: 'Social<br>Media' },
  'serv-social-desc': { pt: 'Planejamento e desenvolvimento de conteúdos visuais alinhados ao posicionamento da marca, criando presença digital consistente e estratégica.', en: 'Planning and development of visual content aligned with brand positioning, creating a consistent and strategic digital presence.' },
  'serv-social-i1': { pt: 'Planejamento de Conteúdo', en: 'Content Planning' },
  'serv-social-i2': { pt: 'Estratégia de Social Media', en: 'Social Media Strategy' },
  'serv-social-i3': { pt: 'Direção de Feed', en: 'Feed Direction' },
  'serv-social-i4': { pt: 'Design de Campanhas', en: 'Campaign Design' },
  'serv-social-i5': { pt: 'Design de Carrossel', en: 'Carousel Design' },
  'serv-social-i6': { pt: 'Criação de Reels', en: 'Reels Ideation' },
  'serv-social-i7': { pt: 'Copywriting', en: 'Copywriting' },
  'serv-social-i8': { pt: 'Templates de Conteúdo', en: 'Content Templates' },
  'serv-web-title': { pt: 'Web<br>Design', en: 'Web<br>Design' },
  'serv-web-desc': { pt: 'Design de páginas focadas em comunicação, experiência e conversão, desenvolvidas para apresentar marcas, produtos e serviços de forma clara e impactante.', en: 'Page design focused on communication, experience and conversion, developed to present brands, products and services in a clear and impactful way.' },
  'serv-web-i1': { pt: 'Landing Pages', en: 'Landing Pages' },
  'serv-web-i2': { pt: 'Sites Portfólio', en: 'Portfolio Websites' },
  'serv-web-i3': { pt: 'Sites One Page', en: 'One Page Websites' },
  'serv-web-i4': { pt: 'Design de UI', en: 'UI Design' },
  'serv-web-i5': { pt: 'Wireframes', en: 'Wireframes' },
  'serv-web-i6': { pt: 'Protótipos Interativos', en: 'Interactive Prototypes' },
  'serv-research-title': { pt: 'Pesquisa<br>Criativa', en: 'Creative<br>Research' },
  'serv-research-desc': { pt: 'Pesquisa estratégica para orientar decisões criativas, identificar oportunidades e construir marcas conectadas ao seu contexto cultural e de mercado.', en: 'Strategic research to guide creative decisions, identify opportunities and build brands connected to their cultural and market context.' },
  'serv-research-i1': { pt: 'Coolhunting', en: 'Coolhunting' },
  'serv-research-i2': { pt: 'Pesquisa de Tendências', en: 'Trend Research' },
  'serv-research-i3': { pt: 'Benchmarking', en: 'Benchmarking' },
  'serv-research-i4': { pt: 'Análise de Concorrentes', en: 'Competitor Analysis' },
  'serv-research-i5': { pt: 'Pesquisa de Público', en: 'Audience Research' },
  'serv-research-i6': { pt: 'Posicionamento de Marca', en: 'Brand Positioning' },
  'serv-research-i7': { pt: 'Estratégia Visual', en: 'Visual Strategy' },
  'serv-research-i8': { pt: 'Consultoria Criativa', en: 'Creative Consulting' },
  'serv-production-title': { pt: 'Produção<br>Criativa', en: 'Creative<br>Production' },
  'serv-production-desc': { pt: 'Produção de materiais visuais que complementam a identidade da marca e fortalecem sua comunicação em diferentes canais.', en: 'Production of visual materials that complement brand identity and strengthen its communication across different channels.' },
  'serv-production-i1': { pt: 'Fotografia Comercial', en: 'Commercial Photography' },
  'serv-production-i2': { pt: 'Direção de Fotografia', en: 'Photography Direction' },
  'serv-production-i3': { pt: 'Edição de Imagem', en: 'Image Editing' },
  'serv-production-i4': { pt: 'Produção Visual com IA', en: 'AI Visual Production' },
  'serv-production-i5': { pt: 'Mockups', en: 'Mockups' },
  'serv-production-i6': { pt: 'Design de Apresentações', en: 'Presentation Design' },
  'serv-production-i7': { pt: 'Design de Catálogos', en: 'Catalog Design' },
  'serv-production-i8': { pt: 'Lookbooks', en: 'Lookbooks' },
  'work-title': { pt: 'Projetos', en: 'Projects' },
  'ver-mais': { pt: 'Ver mais', en: 'See more' },
  'abrir-apres': { pt: 'Abrir apresentação', en: 'Open presentation' },
  'proj1-title': { pt: 'Redesign Sorveteria Zorzo', en: 'Redesign Sorveteria Zorzo' },
  'proj1-tag': { pt: 'Identidade Visual', en: 'Visual Identity' },
  'proj1-desc': { pt: 'Redesign da identidade visual da Zorzo Sorvetes, uma marca familiar com décadas de história. O projeto buscou modernizar sua comunicação sem perder a essência artesanal, desenvolvendo um sistema visual mais consistente, contemporâneo e preparado para fortalecer sua presença em diferentes pontos de contato.', en: 'Visual identity redesign for Zorzo Sorvetes, a family brand with decades of history. The project aimed to modernize its communication without losing the artisanal essence, developing a more consistent, contemporary visual system ready to strengthen its presence across different touchpoints.' },
  'proj2-title': { pt: 'Identidade Visual Giovana Schneider', en: 'Visual Identity Giovana Schneider' },
  'proj2-tag': { pt: 'Identidade Visual', en: 'Visual Identity' },
  'proj2-desc': { pt: 'Identidade visual desenvolvida para a psicóloga Giovana Schneider, inspirada na simbologia do sol como representação de renovação, acolhimento e evolução. Do conceito ao sistema completo de aplicação.', en: 'Visual identity developed for psychologist Giovana Schneider, inspired by the symbology of the sun as a representation of renewal, warmth and evolution. From concept to the complete application system.' },
  'proj3-title': { pt: 'Beijo Gummies – Identidade Visual & Redesign de Embalagem', en: 'Beijo Gummies – Visual Identity & Packaging Redesign' },
  'proj3-tag': { pt: 'Branding', en: 'Branding' },
  'proj3-desc': { pt: 'Projeto conceitual de redesign para a embalagem do Beijo Docile, explorando uma linguagem visual mais contemporânea e atrativa para destacar o produto no ponto de venda. Do papel à prateleira, uma nova identidade e formato que coloca o produto em evidência.', en: 'Conceptual redesign project for Beijo Docile packaging, exploring a more contemporary and attractive visual language to highlight the product at the point of sale. From paper to shelf, a new identity and format that puts the product in the spotlight.' },
  'proj4-title': { pt: 'Bahia Pattern Design', en: 'Bahia Pattern Design' },
  'proj4-tag': { pt: 'Estamparia', en: 'Pattern Design' },
  'proj4-desc': { pt: 'Criação de uma estampa autoral inspirada nas referências visuais da Bahia — cores, texturas e elementos culturais traduzidos em um padrão contemporâneo com aplicações em superfícies de moda praia.', en: 'Creation of an original pattern inspired by Bahian visual references — colors, textures and cultural elements translated into a contemporary print with applications on beachwear surfaces.' },
  'statement-title': { pt: 'Direção & Design', en: 'Direction & Design' },
  'about-title': { pt: 'Sobre mim', en: 'About me' },
  'statement-toggle': { pt: 'Ler mais', en: 'Read more' },
  'statement-toggle-less': { pt: 'Mostrar menos', en: 'Show less' },
  'statement-bio-1': { pt: 'Olá! Me chamo Fernanda Zorzo e sou diretora de arte e designer visual brasileira. Desenvolvo identidades visuais e projetos de comunicação que unem estratégia, conceito e direção criativa para construir marcas com personalidade.', en: "Hi! I'm Fernanda Zorzo, a Brazilian art director and visual designer. I develop visual identities and communication projects that unite strategy, concept and creative direction to build brands with personality." },
  'statement-bio-2': { pt: 'Minha abordagem parte da ideia de que o design vai além da estética: ele organiza narrativas, comunica valores e cria conexões. Busco desenvolver sistemas visuais consistentes, expressivos e atemporais, sempre considerando o contexto, a cultura e a intenção por trás de cada projeto.', en: 'My approach starts from the idea that design goes beyond aesthetics: it organizes narratives, communicates values and creates connections. I aim to develop visual systems that are consistent, expressive and timeless, always considering the context, culture and intention behind each project.' },
  'statement-bio-3': { pt: 'Tenho interesse especial por tipografia, fotografia, colagem digital e direção de arte, com referências que transitam entre moda, música, design editorial e cultura contemporânea. Cada projeto é uma oportunidade de transformar ideias em experiências visuais autênticas e memoráveis.', en: 'I have a special interest in typography, photography, digital collage and art direction, with references spanning fashion, music, editorial design and contemporary culture. Each project is an opportunity to transform ideas into authentic and memorable visual experiences.' },
  'statement-cta': { pt: 'Vamos conversar', en: "Let's talk" },
  'about-title': { pt: 'Sobre mim', en: 'About me' },
  'about-text': { pt: 'Olá! Sou a Fezo. Atuo como diretora de arte, desenvolvendo conceitos e sistemas visuais que ajudam marcas a se comunicar de forma mais autêntica e memorável. Meu trabalho combina estratégia, branding e design para criar identidades, campanhas e experiências visuais que fazem sentido para as pessoas e para a cultura.', en: "Hi! I'm Fezo. I work as an art director, developing concepts and visual systems that help brands communicate more authentically and memorably. My work combines strategy, branding and design to create identities, campaigns and visual experiences that make sense for people and culture." },
  'footer-nav-label': { pt: 'Navegação', en: 'Navigation' },
  'footer-contact-label': { pt: 'Contato', en: 'Contact' },
  'footer-email': { pt: 'Email', en: 'Email' },
  'footer-cta1': { pt: 'Disponível para projetos e colaborações criativas', en: 'Available for projects and creative collaborations' },
  'footer-whatsapp': { pt: 'WhatsApp', en: 'WhatsApp' },
  'footer-copy': { pt: '© 2026 Fernanda Zorzo', en: '© 2026 Fernanda Zorzo' },
  'footer-topo': { pt: 'Voltar ao topo', en: 'Back to top' }
};

// ─── STATEMENT TOGGLE ───
function initStatementToggle() {
  var btn = document.querySelector('.statement-toggle');
  var extra = document.querySelector('.statement-bio-extra');
  if (!btn || !extra) return;

  btn.addEventListener('click', function() {
    var opening = !extra.classList.contains('open');
    if (opening) {
      extra.style.maxHeight = extra.scrollHeight + 'px';
      extra.classList.add('open');
      btn.setAttribute('data-i18n', 'statement-toggle-less');
      btn.textContent = document.documentElement.lang === 'en' ? 'Show less' : 'Mostrar menos';
    } else {
      extra.style.maxHeight = '0';
      extra.classList.remove('open');
      btn.setAttribute('data-i18n', 'statement-toggle');
      btn.textContent = document.documentElement.lang === 'en' ? 'Read more' : 'Ler mais';
    }
  });
}

// ─── SERVICES CARDS ANIMATION ───
function initServiceCards() {
  var track = document.querySelector('.services-track');
  var cards = gsap.utils.toArray('.service-card');
  var dots = document.querySelectorAll('.services-dot');
  if (!cards.length) return;

  if (window.innerWidth > 768) {
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
    tl.to(cards, {
      y: 0, opacity: 1, duration: 0.9,
      stagger: 0.08, ease: 'power3.out',
    });
    if (window.innerWidth <= 1024) {
      tl.to(cards, {
        y: -6, duration: 2, ease: 'sine.inOut',
        stagger: { each: 0.3, from: 'start' },
        repeat: -1, yoyo: true,
      }, '+=0.6');
    }
    // Carousel: dot/arrow navigation
    var currentPage = 0;
    var totalPages = dots.length;
    var prevBtn = document.getElementById('servicesPrev');
    var nextBtn = document.getElementById('servicesNext');

    var carousel = document.querySelector('.services-carousel');
    function goToPage(index) {
      currentPage = index;
      var allCards = track.querySelectorAll('.service-card');
      var targetCard = allCards[currentPage * 3];
      if (!targetCard) return;
      carousel.scrollLeft = targetCard.offsetLeft;
      dots.forEach(function(d) { d.classList.remove('active'); });
      if (dots[currentPage]) dots[currentPage].classList.add('active');
      if (prevBtn) prevBtn.classList.toggle('hidden', currentPage === 0);
      if (nextBtn) nextBtn.classList.toggle('hidden', currentPage === totalPages - 1);
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        goToPage(parseInt(this.dataset.index));
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', function() {
      if (currentPage > 0) goToPage(currentPage - 1);
    });
    if (nextBtn) nextBtn.addEventListener('click', function() {
      if (currentPage < totalPages - 1) goToPage(currentPage + 1);
    });

    // Hover card → glow corresponding dot
    var cardsPerPage = 3;
    cards.forEach(function(card, i) {
      card.addEventListener('mouseenter', function() {
        var page = Math.floor(i / cardsPerPage);
        dots.forEach(function(d) { d.classList.remove('glow'); });
        if (dots[page]) dots[page].classList.add('glow');
      });
      card.addEventListener('mouseleave', function() {
        dots.forEach(function(d) { d.classList.remove('glow'); });
      });
    });

    requestAnimationFrame(function() { goToPage(0); });
  } else {
    // Mobile: infinite carousel (one card at a time, touch swipe)
    cards.forEach(function(c) {
      c.style.opacity = '1';
      c.style.transform = 'none';
      c.classList.remove('expanded');
    });

    var dotsContainer = document.querySelector('.services-dots');
    dotsContainer.innerHTML = '';
    for (var i = 0; i < cards.length; i++) {
      var dot = document.createElement('div');
      dot.className = 'services-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-index', i);
      dotsContainer.appendChild(dot);
    }
    dots = dotsContainer.querySelectorAll('.services-dot');

    var currentIndex = 0;
    var totalCards = cards.length;
    var carousel = document.querySelector('.services-carousel');
    var startX = 0, isDragging = false;

    function goToCard(index, animate) {
      currentIndex = ((index % totalCards) + totalCards) % totalCards;
      if (!animate) track.style.transition = 'none';
      else track.style.transition = '';
      track.style.transform = 'translateX(-' + (currentIndex * carousel.offsetWidth) + 'px)';
      cards.forEach(function(c) { c.classList.remove('active'); });
      if (cards[currentIndex]) cards[currentIndex].classList.add('active');
      dots.forEach(function(d) { d.classList.remove('active'); });
      if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        goToCard(parseInt(this.dataset.index), true);
      });
    });

    carousel.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      isDragging = true;
      track.style.transition = 'none';
    }, { passive: true });

    carousel.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      var diffX = e.touches[0].clientX - startX;
      track.style.transform = 'translateX(' + (-currentIndex * carousel.offsetWidth + diffX) + 'px)';
    }, { passive: true });

    carousel.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      isDragging = false;
      var diffX = e.changedTouches[0].clientX - startX;
      track.style.transition = '';
      if (Math.abs(diffX) > 50) {
        if (diffX < 0) goToCard(currentIndex + 1, true);
        else goToCard(currentIndex - 1, true);
      } else {
        goToCard(currentIndex, true);
      }
    }, { passive: true });

    goToCard(0, false);
  }
}

window.addEventListener('resize', function() {
  var cards = document.querySelectorAll('.service-card');
  var track = document.querySelector('.services-track');
  if (window.innerWidth > 768) {
    cards.forEach(function(c) { c.classList.remove('expanded'); });
    if (track) { track.style.transform = ''; track.style.transition = ''; }
  }
});

function setLanguage(lang) {
  document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[key] && i18n[key][lang]) {
      el.innerHTML = i18n[key][lang];
    }
  });
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll(`.lang-btn[data-lang="${lang}"]`).forEach(b => b.classList.add('active'));
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

// ─── FOOTER LOGO SWAP ───
(function() {
  var img = document.getElementById('footerLogo');
  if (!img) return;
  var logos = window.innerWidth <= 768
    ? ['img/Ativo21logo.webp', 'img/Ativo22logo.webp']
    : ['img/Ativo19logo.webp', 'img/Ativo18logo.webp'];
  var i = 0;
  img.src = logos[0];
  setInterval(function() {
    i = (i + 1) % logos.length;
    img.src = logos[i];
  }, 1000);
})();
