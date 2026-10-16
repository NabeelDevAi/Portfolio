/* ================================================
   NABEEL SOHAIL — CONTAINER YARD
   ================================================ */

(function () {
  'use strict';

  // ---- Mobile menu ----
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');

  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuBtn.focus();
    }
  });

  // ---- Active nav (section in view) ----
  var navItems = Array.prototype.slice.call(navLinks.querySelectorAll('.nav-item'));
  var sectionMap = {};
  navItems.forEach(function (a) { sectionMap[a.getAttribute('href').slice(1)] = a; });

  if ('IntersectionObserver' in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navItems.forEach(function (a) { a.classList.remove('active'); });
        var link = sectionMap[en.target.id];
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(sectionMap).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) navObs.observe(el);
    });
  }

  // ---- Back to top ----
  var backTop = document.getElementById('backTop');
  window.addEventListener('scroll', function () {
    backTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0 });
    document.getElementById('main-content').focus({ preventScroll: true });
  });

  // ---- Footer year ----
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Bay plan: open a container ----
  var bay = document.getElementById('bay');
  var panel = document.getElementById('bay-panel');
  var openBox = panel.querySelector('.open-box');
  var closeBtn = document.getElementById('panelClose');
  var boxes = Array.prototype.slice.call(bay.querySelectorAll('button.box'));
  var active = null;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function slotOf(box) { return box.closest('.slot'); }

  // The panel opens beneath the row that holds the chosen container.
  function placePanel(box) {
    var slot = slotOf(box);
    var rowTop = slot.offsetTop;
    var last = slot;
    var next = slot.nextElementSibling;
    while (next && next !== panel && next.offsetTop === rowTop) {
      last = next;
      next = next.nextElementSibling;
    }
    last.after(panel);
  }

  function fill(box) {
    var src = slotOf(box).querySelector('.manifest-src');
    panel.querySelector('#panel-title').textContent = box.querySelector('.box-name').textContent;
    panel.querySelector('#panel-cat').textContent = box.querySelector('.box-cat').textContent;
    panel.querySelector('#panel-code').textContent = box.querySelector('.box-code').textContent;
    panel.querySelector('#panel-desc').textContent = src.querySelector('.m-desc').textContent;

    var tags = panel.querySelector('#panel-tags');
    tags.innerHTML = '';
    src.querySelectorAll('.m-tags li').forEach(function (li) {
      var t = document.createElement('li');
      t.textContent = li.textContent;
      tags.appendChild(t);
    });

    var foot = panel.querySelector('#panel-link');
    foot.innerHTML = '';
    var link = src.querySelector('.m-link');
    var note = src.querySelector('.m-note');
    if (link) {
      var a = link.cloneNode(true);
      foot.appendChild(a);
    } else if (note) {
      var p = document.createElement('p');
      p.className = 'm-note';
      p.textContent = note.textContent;
      foot.appendChild(p);
    }

    // doors take the container's own colour
    var cs = getComputedStyle(box);
    openBox.style.setProperty('--c', cs.getPropertyValue('--c'));
  }

  function openPanel(box) {
    if (active) active.setAttribute('aria-expanded', 'false');
    active = box;
    box.setAttribute('aria-expanded', 'true');
    placePanel(box);
    fill(box);
    panel.hidden = false;

    openBox.classList.remove('is-opening');
    if (!reduceMotion.matches) {
      void openBox.offsetWidth; // restart the door animation
      openBox.classList.add('is-opening');
    }

    document.body.classList.add('panel-open');
    // keep the chosen container in view above its opened bill of lading
    var rowTop = slotOf(box).getBoundingClientRect().top;
    var navH = 72;
    window.scrollTo({
      top: window.scrollY + rowTop - navH - 12,
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
    panel.focus({ preventScroll: true });
  }

  function closePanel() {
    if (!active) return;
    var box = active;
    active.setAttribute('aria-expanded', 'false');
    active = null;
    panel.hidden = true;
    document.body.classList.remove('panel-open');
    openBox.classList.remove('is-opening');
    box.focus();
  }

  boxes.forEach(function (box) {
    box.addEventListener('click', function () {
      if (active === box) closePanel();
      else openPanel(box);
    });
  });
  closeBtn.addEventListener('click', closePanel);
  panel.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanel();
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (active) placePanel(active);
    }, 120);
  });

  // ---- Contact form ----
  var form = document.getElementById('contactForm');
  var statusEl = document.getElementById('cfStatus');

  function setError(input, errId, show) {
    var err = document.getElementById(errId);
    err.hidden = !show;
    if (show) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('cf-name');
    var email = document.getElementById('cf-email');
    var subject = document.getElementById('cf-subject');
    var message = document.getElementById('cf-message');

    var okName = name.value.trim().length > 0;
    var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    var okMsg = message.value.trim().length > 0;

    setError(name, 'err-name', !okName);
    setError(email, 'err-email', !okEmail);
    setError(message, 'err-message', !okMsg);

    if (!okName || !okEmail || !okMsg) {
      statusEl.textContent = 'Fix the highlighted fields and try again.';
      (!okName ? name : !okEmail ? email : message).focus();
      return;
    }

    var sub = subject.value
      ? '[Portfolio] ' + subject.value + ' — ' + name.value.trim()
      : '[Portfolio] Message from ' + name.value.trim();
    var body = 'Name: ' + name.value.trim() + '\nEmail: ' + email.value.trim() + '\n\n' + message.value.trim();
    var url = 'mailto:nabeel.dev.ai@gmail.com?subject=' + encodeURIComponent(sub) + '&body=' + encodeURIComponent(body);

    statusEl.textContent = 'Opening your email app. If nothing opens, write to nabeel.dev.ai@gmail.com directly.';
    window.location.href = url;
  });

  ['cf-name', 'cf-email', 'cf-message'].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', function () {
      if (el.getAttribute('aria-invalid') === 'true' && el.value.trim()) {
        el.removeAttribute('aria-invalid');
        var err = document.getElementById('err-' + id.replace('cf-', ''));
        if (err) err.hidden = true;
      }
    });
  });
})();
