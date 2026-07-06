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
    initScrollAnimations();
    initCarousel();
    initStatementToggle();

    setTimeout(() => {
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, 1200);
  }

  setTimeout(() => requestAnimationFrame(tick), 200);
})();

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
  'nav-services': { pt: 'Serviços', en: 'Services' },
  'nav-about': { pt: 'Sobre mim', en: 'About me' },
  'nav-contact': { pt: 'Contato', en: 'Contact' },
  'header-cta': { pt: 'Vamos conversar', en: "Let's talk" },
  'hero-welcome': { pt: 'bem-vindo!', en: 'welcome!' },
  'hero-title': { pt: 'Construindo marcas com propósito e personalidade.', en: 'Building brands with purpose and personality.' },
  'hero-subtitle': { pt: 'Direção de arte, branding e identidades visuais que unem<span class="mobile-break"><br></span>estratégia, conceito e sensibilidade estética.', en: 'Art direction, branding and visual identities that unite<span class="mobile-break"><br></span>strategy, concept and aesthetic sensibility.' },
  'hero-scroll': { pt: 'role para explorar', en: 'scroll to explore' },
  'services-title': { pt: 'Serviços', en: 'Services' },
  'serv-art-title': { pt: 'Direção de Arte', en: 'Art Direction' },
  'serv-art-desc': { pt: 'Criação de conceitos visuais que orientam a comunicação de marcas, campanhas e projetos, garantindo unidade estética e narrativas visuais que fortalecem o posicionamento.', en: 'Creation of visual concepts that guide the communication of brands, campaigns and projects, ensuring aesthetic unity and visual narratives that strengthen positioning.' },
  'serv-art-i1': { pt: 'criação de conceito criativo', en: 'creative concept creation' },
  'serv-art-i2': { pt: 'montagem de moodboards', en: 'moodboard creation' },
  'serv-art-i3': { pt: 'layouts diferentes de campanhas', en: 'different campaign layouts' },
  'serv-art-i4': { pt: 'fotografia comercial e artística', en: 'commercial and artistic photography' },
  'serv-id-title': { pt: 'Identidade Visual', en: 'Visual Identity' },
  'serv-id-desc': { pt: 'Desenvolvimento de identidades visuais estratégicas que traduzem a essência da marca em sistemas visuais consistentes, memoráveis e preparados para diferentes pontos de contato.', en: 'Development of strategic visual identities that translate the brand essence into consistent, memorable visual systems ready for different touchpoints.' },
  'serv-id-i1': { pt: 'estratégia e posicionamento de marca', en: 'brand strategy and positioning' },
  'serv-id-i2': { pt: 'sistema de logo', en: 'logo system' },
  'serv-id-i3': { pt: 'paleta de cores', en: 'color palette' },
  'serv-id-i4': { pt: 'tipografia', en: 'typography' },
  'serv-social-title': { pt: 'Social Media', en: 'Social Media' },
  'serv-social-desc': { pt: 'Planejamento e desenvolvimento de conteúdos visuais para redes sociais, alinhando estratégia, identidade e consistência para fortalecer a presença digital da marca.', en: 'Planning and development of visual content for social media, aligning strategy, identity and consistency to strengthen the brand\'s digital presence.' },
  'serv-social-i1': { pt: 'planejamento de calendário', en: 'calendar planning' },
  'serv-social-i2': { pt: 'edição de vídeos curtos focados em redes sociais', en: 'short video editing focused on social media' },
  'serv-social-i3': { pt: 'identidade visual para redes sociais', en: 'visual identity for social media' },
  'serv-social-i4': { pt: 'estratégias personalizadas', en: 'personalized strategies' },
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

// ─── SERVICES CAROUSEL ───
function initCarousel() {
  var track = document.querySelector('.services-track');
  var dots = document.querySelectorAll('.carousel-dot');
  var prev = document.querySelector('.carousel-prev');
  var next = document.querySelector('.carousel-next');
  if (!track || !dots.length) return;
  var total = dots.length;
  var autoTimer, resumeTimer;
  var isPaused = false;
  var isMobile = window.innerWidth <= 768;
  var currentSlide = 0;

  // Infinite loop on mobile: clone first card at end
  if (isMobile) {
    var firstCard = track.querySelector('.service-row');
    if (firstCard) track.appendChild(firstCard.cloneNode(true));
    // Inject visible dot into each service row
    track.querySelectorAll('.service-row').forEach(function(row) {
      var dot = document.createElement('span');
      dot.className = 'service-row-mobile-dot';
      row.appendChild(dot);
    });
  }

  function syncDots() {
    var cards = track.querySelectorAll('.service-row');
    var active = -1;
    cards.forEach(function(card, i) {
      var left = card.offsetLeft;
      var right = left + card.offsetWidth;
      var viewLeft = track.scrollLeft;
      var viewRight = viewLeft + track.offsetWidth;
      if (left >= viewLeft - 1 && right <= viewRight + 2) {
        active = i;
      }
    });
    // Keep previous slide during transitions
    if (active >= 0) currentSlide = active;
    // Highlight active service row
    cards.forEach(function(c) { c.classList.remove('active'); });
    if (cards[currentSlide]) cards[currentSlide].classList.add('active');
    // Update dots (map cloned index to original)
    var dotIndex = currentSlide >= total ? 0 : currentSlide;
    dots.forEach(function(d) { d.classList.remove('active'); });
    if (dots[dotIndex]) dots[dotIndex].classList.add('active');
    // Infinite wrap on mobile: jump from clone to first card
    if (isMobile && cards.length > total && currentSlide >= total) {
      track.style.scrollBehavior = 'auto';
      track.scrollLeft = 0;
      currentSlide = 0;
      requestAnimationFrame(function() { track.style.scrollBehavior = ''; });
    }
  }

  function scrollTo(index) {
    var cards = track.querySelectorAll('.service-row');
    if (!cards[index]) return;
    track.scrollTo({ left: cards[index].offsetLeft, behavior: 'smooth' });
  }

  function nextSlide() {
    var cur = currentSlide;
    if (isMobile && cur === total - 1) {
      var cards = track.querySelectorAll('.service-row');
      if (cards[total]) track.scrollTo({ left: cards[total].offsetLeft, behavior: 'smooth' });
    } else {
      scrollTo((cur + 1) % total);
    }
  }

  function prevSlide() {
    var cur = currentSlide;
    scrollTo((cur - 1 + total) % total);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function() {
      if (isPaused) return;
      var rect = track.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      nextSlide();
    }, 3500);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    clearTimeout(resumeTimer);
  }

  function pauseTemporarily() {
    isPaused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function() { isPaused = false; }, 5000);
  }

  var scrollTimer;
  track.addEventListener('scroll', function() {
    cancelAnimationFrame(scrollTimer);
    scrollTimer = requestAnimationFrame(syncDots);
    pauseTemporarily();
  });

  prev && prev.addEventListener('click', function() { prevSlide(); pauseTemporarily(); });
  next && next.addEventListener('click', function() { nextSlide(); pauseTemporarily(); });

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      scrollTo(parseInt(dot.dataset.index));
      pauseTemporarily();
    });
  });

  track.addEventListener('mouseenter', function() { isPaused = true; });
  track.addEventListener('mouseleave', function() { setTimeout(function() { isPaused = false; }, 1000); });

  document.addEventListener('keydown', function(e) {
    var inView = track.getBoundingClientRect().top < window.innerHeight && track.getBoundingClientRect().bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowLeft') { prevSlide(); pauseTemporarily(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { nextSlide(); pauseTemporarily(); e.preventDefault(); }
  });

  syncDots();
  if (window.innerWidth <= 768) { startAuto(); }
}

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
  var logos = ['img/Ativo19logo.webp', 'img/Ativo18logo.webp'];
  var i = 0;
  setInterval(function() {
    i = (i + 1) % logos.length;
    img.src = logos[i];
  }, 1000);
})();
