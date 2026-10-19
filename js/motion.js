/* ================================================
   MOTION LAYER: GSAP + ScrollTrigger choreography
   Progressive enhancement: without GSAP or with reduced motion,
   script.js and the CSS fallbacks show everything statically.
   ================================================ */
(function () {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || reduce) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'expo.out', duration: 1 });
  root.classList.add('gx');

  const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => [...c.querySelectorAll(s)];
  const done = el => { el.classList.add('visible', 'rv-done'); gsap.set(el, { clearProps: 'opacity,transform,clipPath' }); };

  const whenBooted = cb => {
    if (document.body.classList.contains('booted')) return cb();
    const mo = new MutationObserver(() => {
      if (document.body.classList.contains('booted')) { mo.disconnect(); cb(); }
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  };

  /* ---------- scroll progress ---------- */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });

  /* ---------- hero ---------- */
  const hero = document.getElementById('hero');
  if (hero) {
    // split headline into masked lines of characters
    $('.ht-line', hero).forEach(line => {
      const txt = line.textContent;
      line.textContent = '';
      const ln = document.createElement('span');
      ln.className = 'ln';
      ln.setAttribute('aria-hidden', 'true');
      [...txt].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; ln.appendChild(s); });
      line.appendChild(ln);
    });
    const tag = hero.querySelector('.hero-tagline');
    if (tag) {
      const words = tag.textContent.trim().split(/\s+/);
      tag.setAttribute('aria-label', tag.textContent.trim());
      tag.textContent = '';
      words.forEach((w, i) => {
        const s = document.createElement('span');
        s.className = 'tw'; s.setAttribute('aria-hidden', 'true'); s.style.display = 'inline-block';
        s.textContent = w; tag.appendChild(s);
        if (i < words.length - 1) tag.appendChild(document.createTextNode(' '));
      });
    }

    const q = s => $(s, hero);
    gsap.set(q('.ch'), { yPercent: 115, rotate: 5 });
    gsap.set(q('.tw'), { y: 18, opacity: 0 });
    gsap.set(q('.hero-status, .hero-cta-row .btn-primary-dark, .hero-cta-row .btn-ghost-dark, .hc-list li, .hc-cue'), { opacity: 0 });
    gsap.set(q('.eyebrow-bar'), { scaleX: 0, transformOrigin: '0 50%' });
    gsap.set(q('.eyebrow-text'), { opacity: 0 });
    gsap.set(q('.hud-frame'), { opacity: 0, y: 30 });
    gsap.set(q('.hud-img'), { clipPath: 'inset(100% 0 0 0)' });
    gsap.set(q('.hud-corner, .hud-tag-top, .hud-tag-bot'), { opacity: 0 });

    whenBooted(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(q('.hero-status'), { opacity: 1, y: 0, duration: 0.8 }, 0)
        .to(q('.eyebrow-bar'), { scaleX: 1, duration: 0.9 }, 0.1)
        .to(q('.eyebrow-text'), { opacity: 1, duration: 0.8 }, 0.2)
        .to(q('.ch'), { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.028 }, 0.15)
        .to(q('.tw'), { y: 0, opacity: 1, duration: 0.8, stagger: 0.06 }, 0.75)
        .to(q('.hero-cta-row .btn-primary-dark, .hero-cta-row .btn-ghost-dark'), { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 1.0)
        .to(q('.hud-frame'), { opacity: 1, y: 0, duration: 1.1, clearProps: 'transform' }, 0.35)
        .to(q('.hud-img'), { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'power4.inOut', clearProps: 'clipPath' }, 0.45)
        .to(q('.hud-corner, .hud-tag-top, .hud-tag-bot'), { opacity: 1, duration: 0.6, stagger: 0.06 }, 1.2)
        .to(q('.hc-list li'), { opacity: 1, duration: 0.6, stagger: 0.07 }, 1.3)
        .to(q('.hc-cue'), { opacity: 1, duration: 0.6 }, 1.6);
    });

    // ambient aurora drift, paused while the hero is off-screen
    const drifts = q('.aura').map((a, i) => gsap.to(a, {
      x: gsap.utils.random(-70, 70), y: gsap.utils.random(-50, 50), scale: gsap.utils.random(0.9, 1.15),
      duration: 14 + i * 4, ease: 'sine.inOut', repeat: -1, yoyo: true,
    }));

    // cursor light
    const spot = hero.querySelector('.hero-spot');
    if (spot && hasHover) {
      const sx = gsap.quickTo(spot, 'x', { duration: 0.8, ease: 'power3.out' });
      const sy = gsap.quickTo(spot, 'y', { duration: 0.8, ease: 'power3.out' });
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        sx(e.clientX - r.left); sy(e.clientY - r.top);
      });
      hero.addEventListener('pointerenter', () => gsap.to(spot, { opacity: 1, duration: 0.6 }));
      hero.addEventListener('pointerleave', () => gsap.to(spot, { opacity: 0, duration: 0.6 }));
    }

    // scroll parallax as the hero leaves
    const out = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero, start: 'top top', end: 'bottom top', scrub: true,
        onToggle: self => drifts.forEach(d => (self.isActive ? d.resume() : d.pause())),
      },
    });
    out.to(q('.hero-inner'), { y: -70, opacity: 0.25 }, 0)
       .to(q('.aura-a'), { yPercent: 18 }, 0)
       .to(q('.aura-b'), { yPercent: 30 }, 0)
       .to(q('.hero-credits'), { y: -30 }, 0);
  }

  /* ---------- section headings ---------- */
  $('.sec-head').forEach(head => {
    const parts = {
      idx: head.querySelector('.sh-idx'), rule: head.querySelector('.sh-rule'),
      h2: head.querySelector('h2'), p: head.querySelector('p'),
    };
    const tl = gsap.timeline({ paused: true, onComplete: () => { if (head.classList.contains('reveal')) done(head); } });
    if (head.classList.contains('reveal')) gsap.set(head, { opacity: 1, y: 0 });
    if (parts.idx) tl.fromTo(parts.idx, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.7 }, 0);
    if (parts.rule) tl.fromTo(parts.rule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, 0);
    if (parts.h2) tl.fromTo(parts.h2, { yPercent: 40, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
      { yPercent: 0, opacity: 1, clipPath: 'inset(0 0 -25% 0)', duration: 1.1, clearProps: 'clipPath' }, 0.1);
    if (parts.p) tl.fromTo(parts.p, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 }, 0.35);
    ScrollTrigger.create({ trigger: head, start: 'top 88%', once: true, onEnter: () => tl.play() });
  });

  /* ---------- windows and content reveals (batched for natural stagger) ---------- */
  const batch = (sel, from) => ScrollTrigger.batch(sel, {
    start: 'top 90%', once: true,
    onEnter: els => gsap.fromTo(els, from, {
      opacity: 1, y: 0, x: 0, rotationX: 0, scale: 1, duration: 1.05, stagger: 0.09, overwrite: true,
      onComplete: function () { this.targets().forEach(done); },
    }),
  });
  batch('.win.reveal', { opacity: 0, y: 50, rotationX: 8, scale: 0.975, transformPerspective: 1400, transformOrigin: '50% 0' });
  batch('.reveal:not(.win):not(.sec-head)', { opacity: 0, y: 34 });

  /* ---------- interactions ---------- */
  if (hasHover) {
    // magnetic buttons (use the independent `translate` property so hover transforms still work)
    $('.btn-primary-dark, .btn-ghost-dark, .btn-nav-cta').forEach(btn => {
      const s = { x: 0, y: 0 };
      const apply = () => { btn.style.translate = s.x.toFixed(1) + 'px ' + s.y.toFixed(1) + 'px'; };
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        gsap.to(s, { x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.4, ease: 'power3.out', overwrite: true, onUpdate: apply });
      });
      btn.addEventListener('pointerleave', () =>
        gsap.to(s, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.45)', overwrite: true, onUpdate: apply }));
    });

    // cursor-tracked spotlight inside cards
    $('.proj-card, .why-card, .lead-card, .quote').forEach(card => {
      const glow = document.createElement('span');
      glow.className = 'spot-glow';
      glow.setAttribute('aria-hidden', 'true');
      card.appendChild(glow);
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--sx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--sy', (e.clientY - r.top) + 'px');
      });
    });
  }

  // layout shifts from late fonts/images move trigger positions
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
