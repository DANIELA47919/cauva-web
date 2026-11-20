/* CAUVA V10 · interacción. Sin librerías; respeta prefers-reduced-motion. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceMQ.matches;
  const hasIO = 'IntersectionObserver' in window;

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- Diálogos ---------- */
  function openDialog(dlg) {
    if (dlg.open) return;
    dlg.showModal();
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => dlg.classList.add('is-open')));
  }
  function closeDialog(dlg, done) {
    if (!dlg.open) { if (done) done(); return; }
    dlg.classList.remove('is-open');
    const finish = () => {
      if (dlg.open) dlg.close();
      if (!$$('dialog[open]').length) document.documentElement.style.overflow = '';
      if (done) done();
    };
    if (reduced()) finish(); else setTimeout(finish, 320);
  }
  function wireDialog(dlg, close) {
    dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
    dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
  }

  /* ---------- Encabezado compacto y sección actual ---------- */
  const header = $('[data-header]');
  const onScrollHeader = () => header.classList.toggle('is-compact', window.scrollY > 40);
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  const navLinks = $$('.nav-main a');
  if (hasIO) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = '#' + e.target.id;
        navLinks.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === id ? 'true' : 'false'));
      });
    }, { rootMargin: '-45% 0px -55% 0px' });
    ['servicios', 'modelado', 'proyectos', 'nosotros', 'contacto', 'recorrido', 'inicio'].forEach(id => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Barra de acciones del teléfono ---------- */
  const bar = $('[data-action-bar]');
  if (bar && hasIO) {
    new IntersectionObserver(([e]) => bar.classList.toggle('is-visible', !e.isIntersecting), { threshold: 0 }).observe($('.hero-services') || $('#inicio'));
    new IntersectionObserver(([e]) => bar.classList.toggle('is-near-contact', e.isIntersecting), { threshold: 0 }).observe($('#contacto'));
  }

  /* ---------- Ilustraciones que se dibujan ---------- */
  function drawIn(svg) { if (svg && !svg.classList.contains('is-drawn')) svg.classList.add('is-drawn'); }
  const drawIO = hasIO ? new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting && !e.target.closest('[hidden]') && !e.target.closest('.scene:not(.is-active)')) { drawIn(e.target); drawIO.unobserve(e.target); } });
  }, { threshold: 0.35 }) : null;
  $$('.draw').forEach(svg => { if (drawIO) drawIO.observe(svg); else drawIn(svg); });
  const drawIfVisible = root => $$('.draw', root).forEach(svg => {
    const r = svg.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) drawIn(svg);
    else if (drawIO) drawIO.observe(svg);
  });

  /* ---------- Pestañas accesibles (servicios y modelado) ---------- */
  function makeTabs(list, onChange) {
    const tabs = $$('[role="tab"]', list);
    function select(tab, focus, fromUser) {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (!panel) return;
        if (on) {
          const wasHidden = panel.hidden;
          panel.hidden = false;
          panel.classList.add('is-active');
          if (wasHidden && !reduced()) { panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); }
          drawIfVisible(panel);
        } else {
          panel.hidden = true;
          panel.classList.remove('is-active', 'is-entering');
        }
      });
      if (focus) tab.focus();
      if (fromUser && tab.scrollIntoView && list.scrollWidth > list.clientWidth) tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced() ? 'auto' : 'smooth' });
      if (onChange) onChange(tabs.indexOf(tab));
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false, true));
      tab.addEventListener('keydown', e => {
        const last = tabs.length - 1;
        let n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = i === last ? 0 : i + 1;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = i === 0 ? last : i - 1;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = last;
        if (n !== null) { e.preventDefault(); select(tabs[n], true, true); }
      });
    });
    return { select: (i, user) => select(tabs[i], false, user), tabs };
  }

  const svcList = $('[data-svc-tabs]');
  const svcTabs = svcList ? makeTabs(svcList) : null;
  $$('[data-open-service]').forEach(a => a.addEventListener('click', () => {
    if (!svcTabs) return;
    const i = svcTabs.tabs.findIndex(t => t.dataset.svc === a.dataset.openService);
    if (i >= 0) svcTabs.select(i, false);
  }));

  const modelList = $('[data-model-tabs]');
  const modelProgress = $('[data-model-progress]');
  const modelTabs = modelList ? makeTabs(modelList, i => {
    if (modelProgress) modelProgress.style.transform = 'scaleX(' + ((i + 1) / 5) + ')';
    $$('[role="tab"]', modelList).forEach((t, k) => t.classList.toggle('is-done', k < i));
  }) : null;

  // Deslizar con el dedo entre pasos del modelado (fuera del comparador)
  const modelStage = $('[data-model-stage]');
  if (modelStage && modelTabs) {
    let sx = 0, sy = 0, tracking = false;
    modelStage.addEventListener('touchstart', e => {
      if (e.target.closest('[data-compare]')) { tracking = false; return; }
      tracking = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    modelStage.addEventListener('touchend', e => {
      if (!tracking) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      const cur = modelTabs.tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
      const next = clamp(cur + (dx < 0 ? 1 : -1), 0, modelTabs.tabs.length - 1);
      if (next !== cur) modelTabs.select(next, true);
    }, { passive: true });
  }

  /* ---------- Comparador modelo / construcción ---------- */
  const compare = $('[data-compare]');
  if (compare) {
    const handle = $('[data-compare-handle]', compare);
    let pos = 50, dragging = false;
    const set = v => {
      pos = clamp(v, 0, 100);
      compare.style.setProperty('--pos', pos + '%');
      handle.setAttribute('aria-valuenow', String(Math.round(pos)));
      handle.setAttribute('aria-valuetext', Math.round(pos) + ' % modelo 3D');
    };
    const fromEvent = e => { const r = compare.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); };
    compare.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch' && e.target !== handle && !handle.contains(e.target)) return; // en el teléfono, arrastrar desde la manija
      dragging = true; compare.setPointerCapture(e.pointerId); fromEvent(e);
    });
    compare.addEventListener('pointermove', e => { if (dragging) fromEvent(e); });
    const stop = () => { dragging = false; };
    compare.addEventListener('pointerup', stop);
    compare.addEventListener('pointercancel', stop);
    handle.addEventListener('keydown', e => {
      const step = e.shiftKey ? 20 : 5;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); set(pos - step); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); set(pos + step); }
      if (e.key === 'Home') { e.preventDefault(); set(0); }
      if (e.key === 'End') { e.preventDefault(); set(100); }
    });
  }

  /* ---------- Recorrido: secuencia animada con controles ---------- */
  const film = $('[data-film]');
  if (film) {
    const scenes = $$('.scene', film);
    const steps = $$('[data-film-step]', film);
    const playBtn = $('[data-film-play]', film);
    const playLabel = $('[data-film-play-label]', film);
    const tag = $('[data-film-tag]', film);
    const caption = $('[data-film-caption]', film);
    const titles = steps.map(b => $('.fs-num', b).textContent + ' · ' + $('.fs-title', b).textContent);
    const DUR = 5200;
    let idx = 0, playing = false, userPaused = false, t0 = 0, elapsed = 0, raf = 0, visible = false, ended = false;

    function show(i) {
      idx = i;
      scenes.forEach((s, k) => s.classList.toggle('is-active', k === i));
      steps.forEach((b, k) => {
        if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        b.classList.toggle('is-done', k < i);
        b.style.removeProperty('--fill');
      });
      tag.textContent = titles[i];
      if (caption) caption.innerHTML = '<strong>' + titles[i] + '</strong>' + $('.fs-text', steps[i]).textContent;
      const svg = $('.draw', scenes[i]);
      if (svg) { svg.classList.remove('is-drawn'); void svg.getBoundingClientRect(); requestAnimationFrame(() => drawIn(svg)); }
    }
    function setPlaying(on) {
      playing = on;
      playBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      playLabel.textContent = on ? 'Pausar' : (ended ? 'Ver de nuevo' : 'Reproducir');
      cancelAnimationFrame(raf);
      if (on) { t0 = performance.now() - elapsed; raf = requestAnimationFrame(tick); }
    }
    function tick(now) {
      elapsed = now - t0;
      const p = clamp(elapsed / DUR, 0, 1);
      steps[idx].style.setProperty('--fill', p.toFixed(3));
      if (p >= 1) {
        elapsed = 0; t0 = now;
        if (idx === scenes.length - 1) { ended = true; setPlaying(false); return; }
        show(idx + 1);
      }
      raf = requestAnimationFrame(tick);
    }
    playBtn.addEventListener('click', () => {
      if (playing) { userPaused = true; setPlaying(false); return; }
      userPaused = false;
      if (ended) { ended = false; elapsed = 0; show(0); }
      setPlaying(true);
    });
    steps.forEach((b, i) => b.addEventListener('click', () => { ended = false; elapsed = 0; show(i); if (playing) { t0 = performance.now(); } else { steps[i].style.setProperty('--fill', '1'); } }));
    show(0);
    if (hasIO) {
      new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !userPaused && !ended && !reduced() && !playing) setPlaying(true);
        if (!visible && playing) setPlaying(false);
      }, { threshold: 0.55 }).observe($('.film-stage', film));
    }
    document.addEventListener('visibilitychange', () => { if (document.hidden && playing) setPlaying(false); });
  }

  /* ---------- Galerías por proyecto ---------- */
  const lightbox = $('[data-lightbox]');
  const lbImg = lightbox && $('[data-lb-img]', lightbox);
  const lbText = lightbox && $('[data-lb-text]', lightbox);
  const lbCount = lightbox && $('[data-lb-count]', lightbox);
  let group = [], gi = 0, lbReturn = null;
  const bestSrc = img => {
    const set = img.getAttribute('srcset');
    if (set) { const parts = set.split(',').map(s => s.trim().split(/\s+/)[0]); return parts[parts.length - 1]; }
    return img.getAttribute('src');
  };
  function groupItems(name) {
    const seen = new Set();
    return $$('[data-zoom][data-group="' + name + '"]').map(b => $('img', b)).filter(img => {
      const k = bestSrc(img); if (seen.has(k)) return false; seen.add(k); return true;
    });
  }
  function showLb(i, animate) {
    gi = (i + group.length) % group.length;
    const img = group[gi];
    const apply = () => {
      lbImg.src = bestSrc(img); lbImg.alt = img.alt; lbText.textContent = img.alt;
      lbCount.textContent = (gi + 1) + ' / ' + group.length;
      lbImg.classList.remove('is-swapping');
    };
    if (animate && !reduced()) { lbImg.classList.add('is-swapping'); setTimeout(apply, 170); } else apply();
    const multi = group.length > 1;
    $('[data-lb-prev]', lightbox).hidden = !multi; $('[data-lb-next]', lightbox).hidden = !multi;
  }
  function closeLb() { closeDialog(lightbox, () => { if (lbReturn && document.contains(lbReturn)) lbReturn.focus({ preventScroll: true }); }); }
  if (lightbox) {
    $$('[data-zoom]').forEach(btn => btn.addEventListener('click', () => {
      lbReturn = btn;
      group = groupItems(btn.dataset.group);
      const src = bestSrc($('img', btn));
      showLb(Math.max(0, group.findIndex(img => bestSrc(img) === src)), false);
      openDialog(lightbox);
    }));
    $('[data-lb-prev]', lightbox).addEventListener('click', () => showLb(gi - 1, true));
    $('[data-lb-next]', lightbox).addEventListener('click', () => showLb(gi + 1, true));
    $('[data-lb-close]', lightbox).addEventListener('click', closeLb);
    wireDialog(lightbox, closeLb);
    lightbox.addEventListener('keydown', e => {
      if (group.length < 2) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); showLb(gi - 1, true); }
      if (e.key === 'ArrowRight') { e.preventDefault(); showLb(gi + 1, true); }
    });
    let sx = 0, sy = 0;
    lightbox.addEventListener('touchstart', e => { sx = e.changedTouches[0].clientX; sy = e.changedTouches[0].clientY; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && group.length > 1) showLb(gi + (dx < 0 ? 1 : -1), true);
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) closeLb();
    }, { passive: true });
  }

  /* ---------- Menú ---------- */
  const menu = $('[data-menu]');
  const menuBtn = $('[data-menu-open]');
  function closeMenu(after) { menuBtn.setAttribute('aria-expanded', 'false'); closeDialog(menu, after); }
  if (menu && menuBtn) {
    menuBtn.addEventListener('click', () => { menuBtn.setAttribute('aria-expanded', 'true'); openDialog(menu); });
    $('[data-menu-close]', menu).addEventListener('click', () => closeMenu(() => menuBtn.focus()));
    wireDialog(menu, () => closeMenu(() => menuBtn.focus()));
    $$('.menu-nav a', menu).forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      closeMenu(() => { if (target) target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' }); history.replaceState(null, '', a.getAttribute('href')); });
    }));
    $$('a[target="_blank"]', menu).forEach(a => a.addEventListener('click', () => closeMenu()));
  }

  /* ---------- Formulario: cotizar desde cualquier botón ---------- */
  const form = $('[data-quote-form]');
  const select = $('#q-servicio');
  $$('[data-quote]').forEach(a => a.addEventListener('click', e => {
    const service = a.dataset.quote;
    const go = () => {
      if (service && select) {
        const opt = Array.from(select.options).find(o => o.text.trim() === service);
        if (opt) {
          select.value = opt.value || opt.text;
          const f = select.closest('.field'); f.classList.remove('is-flash'); void f.offsetWidth; f.classList.add('is-flash');
        }
      }
      const contact = $('#contacto');
      contact.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
      history.replaceState(null, '', '#contacto');
      setTimeout(() => { const n = $('#q-nombre'); if (n) n.focus({ preventScroll: true }); }, reduced() ? 0 : 700);
    };
    e.preventDefault();
    if (menu && menu.open) closeMenu(go); else go();
  }));

  function rutValido(raw) {
    const clean = raw.replace(/[^0-9kK]/g, '').toUpperCase();
    if (clean.length < 2) return false;
    const body = clean.slice(0, -1), dv = clean.slice(-1);
    if (!/^\d+$/.test(body)) return false;
    let sum = 0, mul = 2;
    for (let i = body.length - 1; i >= 0; i--) { sum += Number(body[i]) * mul; mul = mul === 7 ? 2 : mul + 1; }
    const r = 11 - (sum % 11);
    return dv === (r === 11 ? '0' : r === 10 ? 'K' : String(r));
  }
  const rules = {
    'q-nombre': el => el.value.trim().length >= 2 ? '' : 'Escribe tu nombre o el de tu empresa.',
    'q-correo': el => !el.value.trim() ? 'Escribe tu correo electrónico.' : (el.validity.typeMismatch ? 'Revisa el correo: falta algo, por ejemplo la @.' : ''),
    'q-telefono': el => el.value.replace(/\D/g, '').length >= 8 ? '' : 'Escribe un número de contacto de al menos 8 dígitos.',
    'q-rut': el => (!el.value.trim() || rutValido(el.value)) ? '' : 'El RUT no es válido. Revisa el dígito verificador.',
    'q-servicio': el => el.value ? '' : 'Elige el servicio que necesitas.'
  };
  let tried = false;
  function check(id) {
    const el = document.getElementById(id);
    const msg = rules[id](el);
    el.closest('.field').classList.toggle('is-invalid', !!msg);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    document.getElementById(id + '-e').textContent = msg;
    return !msg;
  }
  if (form) {
    form.noValidate = true;
    Object.keys(rules).forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => { if (tried) check(id); });
      el.addEventListener('blur', () => { if (tried) check(id); });
    });
    form.addEventListener('submit', e => {
      tried = true;
      const bad = Object.keys(rules).filter(id => !check(id));
      if (bad.length) { e.preventDefault(); document.getElementById(bad[0]).focus(); return; }
      const btn = $('[data-submit]', form);
      btn.setAttribute('aria-busy', 'true');
      btn.textContent = 'Enviando solicitud…';
    });
  }
  const toast = $('[data-toast]');
  if (toast && new URLSearchParams(location.search).get('cotizacion') === 'enviada') {
    toast.hidden = false;
    history.replaceState({}, document.title, location.pathname + location.hash);
    const hide = () => { toast.hidden = true; };
    $('[data-toast-close]', toast).addEventListener('click', hide);
    setTimeout(hide, 9000);
  }

  /* ---------- Experimento de inclinación ---------- */
  const incline = $('[data-incline]');
  if (incline) {
    const hull = $('[data-hull]', incline), weights = $('[data-weights-group]', incline);
    const pend = $('[data-pendulum]', incline), bob = $('[data-bob]', incline), angle = $('[data-angle]', incline);
    const buttons = $$('[data-weights]', incline);
    const CX = 320, CY = 232, PY = 100, LEN = 168, MAX = 6, SHIFT = 96;
    const st = { off: 0, deg: 0 };
    let anim = null;
    const render = () => {
      hull.setAttribute('transform', 'rotate(' + st.deg.toFixed(3) + ' ' + CX + ' ' + CY + ')');
      weights.setAttribute('transform', 'translate(' + st.off.toFixed(2) + ' 0)');
      const a = st.deg * Math.PI / 180;
      const px = CX - (PY - CY) * Math.sin(a), py = CY + (PY - CY) * Math.cos(a);
      pend.setAttribute('x1', px.toFixed(2)); pend.setAttribute('y1', py.toFixed(2));
      pend.setAttribute('x2', px.toFixed(2)); pend.setAttribute('y2', (py + LEN).toFixed(2));
      bob.setAttribute('cx', px.toFixed(2)); bob.setAttribute('cy', (py + LEN).toFixed(2));
      angle.textContent = Math.abs(st.deg) > 0.3 ? 'θ escora' : '';
      angle.setAttribute('x', (px + (st.deg >= 0 ? 14 : -78)).toFixed(1));
      angle.setAttribute('y', (py + LEN + 28).toFixed(1));
    };
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const go = pos => {
      buttons.forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.weights) === pos ? 'true' : 'false'));
      const from = { ...st }, to = { off: pos * SHIFT, deg: pos * MAX };
      if (anim) cancelAnimationFrame(anim);
      if (reduced()) { Object.assign(st, to); render(); return; }
      const t0 = performance.now();
      const step = now => {
        const t = now - t0;
        st.off = from.off + (to.off - from.off) * ease(clamp(t / 650, 0, 1));
        st.deg = from.deg + (to.deg - from.deg) * ease(clamp((t - 220) / 950, 0, 1));
        render();
        anim = t < 1180 ? requestAnimationFrame(step) : null;
      };
      anim = requestAnimationFrame(step);
    };
    buttons.forEach(b => b.addEventListener('click', () => go(Number(b.dataset.weights))));
    render();
    if (hasIO) {
      const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); if (!reduced()) setTimeout(() => go(1), 700); }, { threshold: 0.6 });
      io.observe(incline);
    }
  }
})();
