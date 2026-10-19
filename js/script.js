/* ================================================
   NABEEL SOHAIL — DEEP SPACE TERMINAL JS
   ================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- LOADER: NABEEL/OS boot sequence (full on first visit, short on return visits) ----
let skipped = false;
(function initLoader() {
  const loader = document.getElementById('loader');
  const boot = () => document.body.classList.add('booted');
  if (!loader) { boot(); return; }
  const logEl = document.getElementById('ldLog');
  const prog = document.getElementById('ldProg');
  const pctEl = document.getElementById('ldPct');
  const stageEl = document.getElementById('ldStage');
  const tEl = document.getElementById('ldT');
  const logoEl = document.getElementById('ldLogo');
  const skipBtn = document.getElementById('loaderSkip');
  const C = 2 * Math.PI * 86;

  let seen = false;
  try { seen = localStorage.getItem('nos-booted') === '1'; localStorage.setItem('nos-booted', '1'); } catch (e) {}
  const pace = seen ? 0.3 : 1;

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', onKey);
    if (reduceMotion) { loader.classList.add('hidden'); boot(); return; }
    loader.classList.add('closing');
    setTimeout(boot, 260);
    setTimeout(() => loader.classList.add('hidden'), 820);
  };
  const skip = () => { skipped = true; close(); };
  const onKey = e => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); skip(); } };
  if (reduceMotion) { close(); return; }
  document.addEventListener('keydown', onKey);
  if (skipBtn) skipBtn.addEventListener('click', skip);

  const steps = [
    { p: 8,  stage: 'POST · power-on self test',      log: ['0.000', '', 'nabeel-os 2.0 booting on x86_64'] },
    { p: 16, stage: 'Mounting filesystems',            log: ['0.042', 'ok', 'mount <span class="hl">/dev/portfolio</span> (ro)'] },
    { p: 26, stage: 'Loading AI modules',              log: ['0.118', 'ok', 'load module <span class="hl">llm.ko</span>'] },
    { p: 34, stage: 'Loading AI modules',              log: ['0.203', 'ok', 'load module <span class="hl">rag.ko</span>'] },
    { p: 43, stage: 'Loading AI modules',              log: ['0.287', 'ok', 'load module <span class="hl">agents.ko</span>'] },
    { p: 52, stage: 'Loading AI modules',              log: ['0.361', 'ok', 'load module <span class="hl">vision.ko</span> <span class="hl">voice.ko</span>'] },
    { p: 61, stage: 'Starting services',               log: ['0.440', 'ok', 'start <span class="hl">fastapi.service</span>'] },
    { p: 70, stage: 'Starting services',               log: ['0.519', 'ok', 'start <span class="hl">vector-store.service</span>'] },
    { p: 79, stage: 'Network',                         log: ['0.602', 'ok', 'network online, 0 packets dropped'] },
    { p: 88, stage: 'Compiling interface',             log: ['0.688', 'ok', 'compile ui: windows, dock, terminal'] },
    { p: 96, stage: 'Starting session',                log: ['0.771', 'ok', 'session opened for <span class="hl">visitor@nabeel-os</span>'] },
    { p: 100, stage: 'Ready',                          log: ['0.840', 'ok', 'welcome.'] },
  ];

  const addLog = ([ts, kind, html]) => {
    const d = document.createElement('div');
    d.className = 'ld-line';
    d.innerHTML = '<b>[ ' + ts.padStart(5, ' ') + ' ]</b>' + (kind === 'ok' ? '<span class="ok">[ OK ]</span>' : '') + html;
    logEl.appendChild(d);
    while (logEl.children.length > 14) logEl.removeChild(logEl.firstChild);
  };

  let p = 0, target = 0, start = performance.now(), i = 0, done = false;
  const tick = now => {
    if (closed) return;
    p += (target - p) * 0.12;
    if (target - p < 0.05) p = target;
    prog.style.strokeDashoffset = (C * (1 - p / 100)).toFixed(2);
    pctEl.textContent = String(Math.round(p)).padStart(3, '0') + '%';
    tEl.textContent = 'T+' + ((now - start) / 1000).toFixed(2) + 's';
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const next = () => {
    if (closed) return;
    if (i >= steps.length) return;
    const s = steps[i++];
    target = s.p;
    stageEl.textContent = s.stage;
    addLog(s.log);
    if (i === 5 || i === steps.length) { logoEl.classList.remove('glitch'); void logoEl.offsetWidth; logoEl.classList.add('glitch'); }
    if (i < steps.length) {
      setTimeout(next, (190 + Math.random() * 120) * pace);
    } else {
      setTimeout(() => { loader.classList.add('ready'); }, 250 * pace);
      setTimeout(close, 1250 * pace);
    }
  };
  setTimeout(next, 350 * pace);
})();

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = -100, my = -100, fx = -100, fy = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function followCursor() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(followCursor);
})();

document.querySelectorAll('a, button, .tech-pill, .svc-card, .proj-card, .lead-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1.6)';
    cursor.style.background = 'transparent';
    cursor.style.border = '1.5px solid var(--accent)';
    follower.style.transform = 'translate(-50%,-50%) scale(0.5)';
    follower.style.opacity = '0.5';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'var(--accent)';
    cursor.style.border = 'none';
    follower.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.opacity = '1';
  });
});

// ---- NAVBAR ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 56 });
    }
  });
});

// ---- REVEAL ON SCROLL ----
const revealEls = document.querySelectorAll('.reveal');
const revealObs = ('IntersectionObserver' in window && !reduceMotion && !window.gsap) ? new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }) : null;
revealEls.forEach(el => revealObs ? revealObs.observe(el) : el.classList.add('visible'));

// ---- PARTICLE CANVAS ----
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas || reduceMotion || window.innerWidth < 768) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.r  = Math.random() * 1.2 + 0.3;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(58, 78, 255,${this.a})`;
      ctx.fill();
    }
  }

  const particleCount = window.innerWidth < 768 ? 50 : 110;
  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(58, 78, 255,${0.06 * (1 - d / maxDist)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // only animate while the hero is on screen and the tab is visible
  let inView = true, running = false;
  function loop() {
    if (!inView || document.hidden) { running = false; return; }
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  const wake = () => { if (!running && inView && !document.hidden) { running = true; requestAnimationFrame(loop); } };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; wake(); }).observe(canvas);
  }
  document.addEventListener('visibilitychange', wake);
  wake();
})();

// ---- ABOUT TERMINAL: tabbed fact sheet that types itself ----
(function initTerm2() {
  const root = document.getElementById('term2');
  if (!root) return;
  const cmdEl = document.getElementById('t2Cmd');
  const outEl = document.getElementById('t2Out');
  const statusEl = document.getElementById('t2Status');
  const tabs = [...root.querySelectorAll('.t2-tab')];

  const data = {
    whoami: { cmd: 'whoami', rows: [
      ['name', 'Mohammad Nabeel Sohail'],
      ['role', 'Senior AI & Web Engineer · Technical Lead'],
      ['org', 'Tegnol Agency'],
      ['studying', 'MSc AI with Data Analytics, Teesside University'],
      ['based', 'Middlesbrough, UK'],
      ['path', 'UK → Kuwait → Karachi → UK'],
      ['rights', 'British national, full right to work in the UK'],
    ] },
    journey: { cmd: 'journey --timeline', rows: [
      ['2021', 'BSCS begins, SSUET Karachi'],
      ['2022', 'Computer Science lecturer, SAF Collegiate'],
      ['2023', 'AI team, FTech Solutions'],
      ['2025', 'Technical Lead, Tegnol Agency'],
      ['now', 'MSc AI with Data Analytics, Teesside'],
    ] },
    communities: { cmd: 'ls communities/', rows: [
      ['ieee', 'Vice Chair, SSUET Student Branch'],
      ['acm', 'Vice Chair, SSUET Chapter'],
      ['gdgoc', 'Communication & Marketing Lead, SSUET'],
      ['smec', "Director & Mentor '25 · Team Lead '24"],
      ['nasa', 'Core team, Space Apps Karachi'],
    ] },
    ask: { cmd: 'ask --about', rows: [
      ['topics', 'AI · machine learning · GenAI · web development'],
      ['also', 'leadership · mentoring · community building'],
      ['values', 'quality over quantity · purpose over prestige'],
      ['reach', 'nabeel.dev.ai@gmail.com'],
    ] },
  };

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 'whoami', run = 0, timer = null, auto = !reduce, started = false;

  const rowEl = r => {
    const d = document.createElement('div');
    const k = document.createElement('span'); k.className = 't2-k'; k.textContent = r[0];
    const v = document.createElement('span'); v.className = 't2-v'; v.textContent = r[1];
    d.append(k, v);
    return d;
  };
  const setTab = name => tabs.forEach(t => {
    const on = t.dataset.cmd === name;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
  });

  function show(name, animate) {
    const id = ++run;
    clearTimeout(timer);
    current = name;
    setTab(name);
    const { cmd, rows } = data[name];
    outEl.textContent = '';
    if (!animate) {
      cmdEl.textContent = cmd;
      rows.forEach(r => outEl.appendChild(rowEl(r)));
      statusEl.textContent = 'exit 0';
      return;
    }
    cmdEl.textContent = '';
    statusEl.textContent = 'running…';
    let i = 0;
    const type = () => {
      if (id !== run) return;
      if (i <= cmd.length) { cmdEl.textContent = cmd.slice(0, i++); timer = setTimeout(type, 38 + Math.random() * 30); return; }
      let n = 0;
      const line = () => {
        if (id !== run) return;
        if (n < rows.length) {
          const el = rowEl(rows[n++]);
          outEl.appendChild(el);
          requestAnimationFrame(() => el.classList.add('on'));
          timer = setTimeout(line, 130);
        } else {
          statusEl.textContent = 'exit 0';
          if (auto) timer = setTimeout(() => {
            const names = Object.keys(data);
            show(names[(names.indexOf(current) + 1) % names.length], true);
          }, 6500);
        }
      };
      timer = setTimeout(line, 220);
    };
    type();
  }

  // lock the terminal to its tallest tab so the layout never jumps
  const lock = () => {
    root.style.height = '';
    const keepCmd = cmdEl.textContent, keepOut = outEl.innerHTML;
    let max = 0;
    Object.values(data).forEach(({ cmd, rows }) => {
      cmdEl.textContent = cmd; outEl.textContent = '';
      rows.forEach(r => outEl.appendChild(rowEl(r)));
      max = Math.max(max, root.offsetHeight);
    });
    cmdEl.textContent = keepCmd; outEl.innerHTML = keepOut;
    root.style.height = max + 'px';
  };
  let lockT;
  window.addEventListener('resize', () => { clearTimeout(lockT); lockT = setTimeout(lock, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(lock);
  lock();

  tabs.forEach(t => {
    t.addEventListener('click', () => { auto = false; show(t.dataset.cmd, !reduce); });
    t.addEventListener('keydown', e => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!k) return;
      e.preventDefault();
      const i = (tabs.indexOf(t) + k + tabs.length) % tabs.length;
      tabs[i].focus(); auto = false; show(tabs[i].dataset.cmd, !reduce);
    });
  });

  if (reduce || !('IntersectionObserver' in window)) { show('whoami', false); return; }
  new IntersectionObserver((es, o) => {
    if (es[0].isIntersecting && !started) { started = true; o.disconnect(); show('whoami', true); }
  }, { threshold: 0.35 }).observe(root);
})();

// ---- CARD TILT ----
document.querySelectorAll('.proj-card, .svc-card, .lead-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${x * 5}deg) rotateX(${-y * 3}deg)`;
    card.style.transformStyle = 'preserve-3d';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ---- DYNAMIC FOOTER YEAR ----
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- CONTACT FORM ----
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value;
    const message = document.getElementById('cf-message').value.trim();
    if (!name || !email || !message) return;

    const btnText   = form.querySelector('.cf-btn-text');
    const btnLoad   = form.querySelector('.cf-btn-loading');
    const successEl = document.getElementById('cfSuccess');
    const submitBtn = document.getElementById('cfSubmit');

    btnText.style.display = 'none';
    btnLoad.style.display = 'inline-flex';
    submitBtn.disabled = true;

    const showMsg = (ok, html) => {
      successEl.classList.toggle('is-error', !ok);
      successEl.innerHTML = '<i class="fas ' + (ok ? 'fa-check-circle' : 'fa-triangle-exclamation') + '"></i> ' + html;
      successEl.style.display = 'flex';
      clearTimeout(showMsg.t);
      showMsg.t = setTimeout(function() { successEl.style.display = 'none'; }, ok ? 8000 : 14000);
    };
    const done = () => {
      btnText.style.display = 'inline-flex';
      btnLoad.style.display = 'none';
      submitBtn.disabled = false;
    };

    const data = new FormData(form);
    data.set('subject', (subject ? '[Portfolio] ' + subject : '[Portfolio] Message') + ' — ' + name);
    data.set('topic', subject || 'Not specified');

    fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: data })
      .then(r => r.json().then(j => ({ ok: r.ok && j.success, j })))
      .then(res => {
        done();
        if (res.ok) {
          form.reset();
          showMsg(true, 'Message sent. Thank you, ' + name.split(' ')[0] + '. I will reply to ' + email + ' soon.');
        } else {
          showMsg(false, 'Could not send the message. Please email <a href="mailto:nabeel.dev.ai@gmail.com">nabeel.dev.ai@gmail.com</a> directly.');
        }
      })
      .catch(() => {
        done();
        showMsg(false, 'Network problem, the message was not sent. Please email <a href="mailto:nabeel.dev.ai@gmail.com">nabeel.dev.ai@gmail.com</a> directly.');
      });
  });
})();

// ---- TECH PILL STAGGER ON SCROLL ----
const techObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.tech-pill').forEach((pill, i) => {
        setTimeout(() => {
          pill.style.opacity = '1';
          pill.style.transform = 'translateY(0)';
        }, i * 60);
      });
      techObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

const techGrid = document.querySelector('.tech-grid');
if (techGrid) {
  techGrid.querySelectorAll('.tech-pill').forEach(p => {
    p.style.opacity = '0';
    p.style.transform = 'translateY(16px)';
    p.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });
  techObs.observe(techGrid);
}

// ---- BACK TO TOP ----
const backTop = document.getElementById('backTop');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0 });
  });
}

// ---- CONTACT PATHS: preselect subject ----
document.querySelectorAll('[data-subject]').forEach(a => {
  a.addEventListener('click', () => {
    const sel = document.getElementById('cf-subject');
    if (sel) sel.value = a.dataset.subject;
    setTimeout(() => { const n = document.getElementById('cf-name'); if (n) n.focus({ preventScroll: true }); }, 400);
  });
});

// ---- SERVICES CONSOLE: tabs built from panels ----
(() => {
  const box = document.getElementById('svcConsole');
  if (!box) return;
  const panels = [...box.querySelectorAll('.svc-panel')];
  const list = document.createElement('div');
  list.className = 'svc-tabs';
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-orientation', 'vertical');
  const stage = document.createElement('div');
  stage.className = 'svc-stage';
  const tabs = panels.map((p, i) => {
    const t = document.createElement('button');
    t.type = 'button';
    t.className = 'svc-tab';
    t.id = 'svc-tab-' + i;
    t.setAttribute('role', 'tab');
    t.setAttribute('aria-controls', 'svc-panel-' + i);
    t.innerHTML = '<span class="svc-n">' + p.dataset.idx + '</span><span></span>';
    t.lastChild.textContent = p.querySelector('h3').textContent;
    p.id = 'svc-panel-' + i;
    p.setAttribute('role', 'tabpanel');
    p.setAttribute('aria-labelledby', t.id);
    stage.appendChild(p);
    list.appendChild(t);
    return t;
  });
  const select = (i, focus) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
    });
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', e => {
      const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); select((i + k + tabs.length) % tabs.length, true); }
    });
  });
  box.append(list, stage);
  box.classList.add('is-ready');
  select(0);
})();

// ---- RECOMMENDATIONS: carousel + read-full modal ----
(() => {
  const track = document.getElementById('quotesTrack');
  const modal = document.getElementById('quoteModal');
  if (!track || !modal) return;
  const nav = document.getElementById('quotesNav');
  const prev = document.getElementById('qPrev');
  const next = document.getElementById('qNext');
  const quotes = [...track.querySelectorAll('.quote')];

  const open = q => {
    document.getElementById('qmText').textContent = q.querySelector('blockquote').textContent;
    document.getElementById('qmName').textContent = q.querySelector('strong').textContent;
    document.getElementById('qmMeta').textContent = q.querySelector('figcaption span').textContent;
    if (modal.showModal) modal.showModal(); else modal.setAttribute('open', '');
  };
  const addMore = () => {
    quotes.forEach(q => {
      const bq = q.querySelector('blockquote');
      const had = q.querySelector('.q-more');
      const cut = bq.scrollHeight > bq.clientHeight + 1;
      if (cut && !had) {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'q-more'; b.textContent = 'Read full >';
        b.addEventListener('click', () => open(q));
        bq.after(b);
      } else if (!cut && had) had.remove();
    });
  };
  const update = () => {
    const over = track.scrollWidth > track.clientWidth + 2;
    nav.hidden = !over;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  const step = dir => track.scrollBy({ left: dir * (quotes[0].offsetWidth + 20), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  track.addEventListener('scroll', update, { passive: true });
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  document.getElementById('qmClose').addEventListener('click', () => modal.close());
  const refresh = () => { addMore(); update(); };
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  refresh();
})();


/* ================================================
   OS LAYER: menu bar, dock, windows, palette, depth
   ================================================ */
(function initOS() {
  const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const secs = [...document.querySelectorAll('section[data-app]')];
  const dockItems = [...document.querySelectorAll('.dock-item')];
  const dock = document.getElementById('dock');
  const mbApp = document.getElementById('mbApp');

  // clock (UK time)
  const clock = document.getElementById('mbClock');
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });
  const tick = () => { if (clock) clock.textContent = fmt.format(new Date()); };
  tick(); setInterval(tick, 20000);

  // active section -> menu bar app name + dock indicator
  let cur = '';
  let appTimer = 0;
  const typeApp = txt => {
    if (!mbApp) return;
    clearInterval(appTimer);
    if (reduceMotion) { mbApp.textContent = txt; return; }
    let i = 0; mbApp.textContent = '';
    appTimer = setInterval(() => { mbApp.textContent = txt.slice(0, ++i); if (i >= txt.length) clearInterval(appTimer); }, 28);
  };
  const setActive = id => {
    if (id === cur) return;
    cur = id;
    const sec = document.getElementById(id);
    typeApp(sec.dataset.app);
    dockItems.forEach(a => a.classList.toggle('active', a.dataset.sec === id));
    document.querySelectorAll('.win').forEach(w => w.classList.toggle('is-active', sec.contains(w)));
  };
  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const line = window.scrollY + window.innerHeight * 0.4;
      let hit = secs[0];
      secs.forEach(s => { if (line >= s.offsetTop) hit = s; });
      setActive(hit.id);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // dock magnification
  if (dock && hasHover && !reduceMotion) {
    dock.addEventListener('pointermove', e => {
      dockItems.forEach(a => {
        const r = a.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        const s = 1 + 0.55 * Math.exp(-(d * d) / (2 * 46 * 46));
        a.style.setProperty('--ds', s.toFixed(3));
      });
    });
    dock.addEventListener('pointerleave', () => dockItems.forEach(a => a.style.removeProperty('--ds')));
  }

  // 3D tilt + glare
  if (hasHover && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      const max = parseFloat(el.dataset.tilt) || 5;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', ((px - 0.5) * 2 * max).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - py) * 2 * max).toFixed(2) + 'deg');
        el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
        el.classList.add('is-tilting');
      });
      el.addEventListener('pointerleave', () => {
        el.classList.remove('is-tilting');
        ['--rx', '--ry'].forEach(p => el.style.removeProperty(p));
      });
    });

    // hero depth parallax
    const hero = document.getElementById('hero');
    const layers = [...hero.querySelectorAll('[data-depth]')];
    let tx = 0, ty = 0, cx = 0, cy = 0, run = false;
    const frame = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      layers.forEach(l => {
        const d = parseFloat(l.dataset.depth);
        l.style.translate = (cx * d).toFixed(2) + 'px ' + (cy * d).toFixed(2) + 'px';
      });
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) requestAnimationFrame(frame); else run = false;
    };
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!run) { run = true; requestAnimationFrame(frame); }
    });
    hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!run) { run = true; requestAnimationFrame(frame); } });
  }

  // command palette
  const pal = document.getElementById('palette');
  const input = document.getElementById('palInput');
  const list = document.getElementById('palList');
  const btn = document.getElementById('paletteBtn');
  if (!pal) return;
  const go = id => () => window.scrollTo({ top: document.getElementById(id).offsetTop - 56 });
  const open = url => () => window.open(url, '_blank', 'noopener');
  const cmds = [
    ...secs.map(s => ({ g: 'Go to', t: s.dataset.app.replace('.app', ''), k: s.id + ' ' + s.dataset.app, run: go(s.id), ic: 'fa-arrow-right' })),
    { g: 'Action', t: 'Download CV', k: 'cv resume pdf', run: () => { const a = document.createElement('a'); a.href = 'NabeelSohail-CV.pdf'; a.download = ''; a.click(); }, ic: 'fa-download' },
    { g: 'Action', t: 'Send an email', k: 'email mail contact', run: () => { location.href = 'mailto:nabeel.dev.ai@gmail.com'; }, ic: 'fa-envelope' },
    { g: 'Action', t: 'Copy email address', k: 'copy email', run: () => navigator.clipboard && navigator.clipboard.writeText('nabeel.dev.ai@gmail.com'), ic: 'fa-copy' },
    { g: 'Link', t: 'LinkedIn', k: 'linkedin social', run: open('https://www.linkedin.com/in/nabeeldevai/'), ic: 'fa-arrow-up-right-from-square' },
    { g: 'Link', t: 'GitHub', k: 'github code social', run: open('https://github.com/NabeelDevAi'), ic: 'fa-arrow-up-right-from-square' },
    { g: 'Link', t: 'WhatsApp', k: 'whatsapp chat message', run: open('https://wa.me/923453628868'), ic: 'fa-arrow-up-right-from-square' },
  ];
  let shown = [], sel = 0;
  const render = () => {
    const q = input.value.trim().toLowerCase();
    shown = cmds.filter(c => !q || (c.t + ' ' + c.k + ' ' + c.g).toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(shown.length - 1, 0));
    list.textContent = '';
    if (!shown.length) { const li = document.createElement('li'); li.className = 'pal-empty'; li.textContent = 'No matches'; list.appendChild(li); return; }
    shown.forEach((c, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.id = 'pal-' + i;
      li.setAttribute('aria-selected', String(i === sel));
      li.innerHTML = '<span class="pal-g"></span><span class="pal-t"></span><i class="fas ' + c.ic + '"></i>';
      li.children[0].textContent = c.g; li.children[1].textContent = c.t;
      li.addEventListener('click', () => exec(i));
      li.addEventListener('pointermove', () => { if (sel !== i) { sel = i; mark(); } });
      list.appendChild(li);
    });
    input.setAttribute('aria-activedescendant', 'pal-' + sel);
  };
  const mark = () => {
    [...list.children].forEach((li, i) => li.setAttribute('aria-selected', String(i === sel)));
    const li = list.children[sel]; if (li) { li.scrollIntoView({ block: 'nearest' }); input.setAttribute('aria-activedescendant', li.id); }
  };
  const exec = i => { const c = shown[i]; if (!c) return; pal.close(); setTimeout(c.run, 60); };
  const openPal = () => { input.value = ''; sel = 0; render(); if (!pal.open) pal.showModal(); input.focus(); };
  btn.addEventListener('click', openPal);
  document.addEventListener('keydown', e => {
    const typing = /^(input|textarea|select)$/i.test(document.activeElement.tagName);
    if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing && !pal.open)) { e.preventDefault(); pal.open ? pal.close() : openPal(); }
  });
  input.addEventListener('input', () => { sel = 0; render(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(shown.length, 1); mark(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(shown.length, 1); mark(); }
    else if (e.key === 'Enter') { e.preventDefault(); exec(sel); }
  });
  pal.addEventListener('click', e => { if (e.target === pal) pal.close(); });
})();
