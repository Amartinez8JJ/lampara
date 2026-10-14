/* Lámpara · motion.js — capa de movimiento e interacción (dueño: agente Movimiento)
   ---------------------------------------------------------------------------
   Se carga al final (después de index.html y de los módulos) y NO toca el
   núcleo: engancha todo por selectores estables del contrato, delegación de
   eventos y window.Lampara (eventos beforeTab, tab, render, reset).

   Reglas
   - Solo transform/opacity (y sus propiedades sueltas translate/scale/rotate,
     que se componen con los transform del núcleo sin pisarlos). Nada de
     lecturas de layout por cuadro salvo las imprescindibles de un gesto.
   - Listeners pasivos. El único activo es touchmove en #phone, y solo llama a
     preventDefault cuando un gesto ya fue reclamado (para que el navegador no
     haga scroll a la vez).
   - Movimiento reducido (Lampara.RM() / prefers-reduced-motion): se apaga todo
     lo decorativo. Los gestos (arrastrar la hoja, volver deslizando…) siguen
     porque son manipulación directa, pero sin inercia ni rebotes.
   - Todo desactivable: ?motion=off · localStorage 'lampara-motion'='off' ·
     LamparaMotion.off() · LamparaMotion.set('tabSwipe', false).
   Documentación: CAMBIOS-movimiento.md
   --------------------------------------------------------------------------- */
(function () {
  'use strict';
  const L = window.Lampara;
  const D = document, HTML = D.documentElement;
  const phone = D.getElementById('phone');
  if (!L || !phone || !Element.prototype.animate) return;

  const $ = (s, r) => (r || D).querySelector(s);
  const $$ = (s, r) => Array.from((r || D).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const now = () => performance.now();
  const raf = fn => requestAnimationFrame(fn);

  /* =========================================================================
     1. TOKENS DE MOVIMIENTO
     ========================================================================= */
  const DUR = { instant: 90, fast: 160, base: 260, page: 340, slow: 520 };
  const EASE = {
    out: 'cubic-bezier(0.22, 1, 0.36, 1)',     /* llegar (= --ease del núcleo) */
    in: 'cubic-bezier(0.55, 0, 1, 0.45)',      /* irse */
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    page: 'cubic-bezier(0.2, 0.8, 0.2, 1)',    /* eje compartido */
    spin: 'cubic-bezier(0.16, 1, 0.3, 1)'      /* tiras de contador */
  };
  /* Resortes físicos (k = rigidez, c = amortiguación, masa 1). Se simulan y se
     convierten en keyframes lineales: cualquier propiedad puede rebotar. */
  const SPRING = {
    press: { k: 760, c: 32 },   /* vuelta de un botón: rápida, rebote apenas visible */
    snap: { k: 430, c: 34 },    /* hoja o vista que vuelve a su lugar */
    glide: { k: 520, c: 38 },   /* indicador y píldoras que se deslizan */
    bouncy: { k: 380, c: 17 },  /* íconos, ＋ que gira */
    soft: { k: 170, c: 21 },    /* cosas grandes: la moneda */
    sway: { k: 60, c: 7 }       /* la llama que se mece */
  };
  /* Vocabulario háptico: un patrón por tipo de evento (navigator.vibrate) */
  const HAPTIC = {
    tick: 4,             /* pasar un umbral, cambiar de pestaña o segmento */
    tap: 6,              /* tocar algo vivo (la lámpara) */
    select: 8,           /* elegir / abrir (el ＋) */
    press: 12,           /* mantener cumplido (lo hace el núcleo) */
    snap: [6, 28, 8],    /* un gesto se confirma: hoja cerrada, volver */
    success: [10, 40, 20],
    error: [20, 40, 20]
  };
  const GESTURE = { slop: 7, edge: 28, handle: 44, flick: 0.45, axisBias: 1.2 };

  /* =========================================================================
     2. INTERRUPTORES
     ========================================================================= */
  const FLAGS = {
    transitions: true, indicator: true, fab: true, stagger: true, roll: true, segments: true,
    press: true, hold: true, glow: true, lamp: true, tilt: true,
    sheetDrag: true, backSwipe: true, tabSwipe: true, focusDrag: true, bannerSwipe: true, coin: true,
    haptics: true
  };
  let killed = false;
  try { killed = localStorage.getItem('lampara-motion') === 'off'; } catch (e) { /* sin almacenamiento */ }
  const qm = new URLSearchParams(location.search).get('motion');
  if (qm === 'off' || qm === '0') killed = true;
  if (qm === 'on' || qm === '1') killed = false;

  const moving = () => !killed && !L.RM();
  const can = f => !killed && !!FLAGS[f];      /* función activa (los gestos siguen con RM) */
  const fx = f => can(f) && moving();          /* efecto decorativo */

  function haptic(kind) {
    if (!can('haptics')) return;
    const p = typeof kind === 'string' ? HAPTIC[kind] : kind;
    if (p) L.haptic(p);
  }

  /* =========================================================================
     3. UTILIDADES: resortes, limpieza, posiciones
     ========================================================================= */
  const springCache = new Map();
  /* curva normalizada 0→1 con velocidad inicial v0 (en «distancias por segundo») */
  function springCurve(cfg, v0) {
    v0 = clamp(v0 || 0, -40, 40);
    const key = cfg.k + ':' + cfg.c + ':' + v0.toFixed(1);
    const hit = springCache.get(key);
    if (hit) return hit;
    const out = [0], dt = 1 / 240;
    let x = 0, v = v0, n = 0;
    while (n < 150) {
      for (let i = 0; i < 4; i++) { const a = -cfg.k * (x - 1) - cfg.c * v; v += a * dt; x += v * dt; }
      out.push(x); n++;
      if (Math.abs(1 - x) < 0.002 && Math.abs(v) < 0.05) break;
    }
    out[out.length - 1] = 1;
    const r = { values: out, duration: Math.max(16, Math.round(n * 1000 / 60)) };
    if (springCache.size > 300) springCache.clear();
    springCache.set(key, r);
    return r;
  }
  /* anima con un resorte: frame(p) devuelve el keyframe para el progreso p (puede pasarse de 1) */
  function spring(el, frame, o) {
    o = o || {};
    const c = springCurve(o.cfg || SPRING.snap, o.v0);
    return el.animate(c.values.map(frame), { duration: c.duration, easing: 'linear', fill: o.fill || 'none', delay: o.delay || 0, id: o.id || 'mo' });
  }
  /* cancela las animaciones propias (id 'mo…') de un elemento */
  function stop(el, prefix) {
    if (!el || !el.getAnimations) return;
    const p = prefix || 'mo';
    el.getAnimations().forEach(a => { if (a.id && a.id.indexOf(p) === 0) a.cancel(); });
  }
  const rubber = (x, d) => (1 - 1 / (x * 0.55 / d + 1)) * d;
  function curTranslate(el) {
    const t = getComputedStyle(el).translate;
    if (!t || t === 'none') return [0, 0];
    const p = t.split(' ').map(parseFloat);
    return [p[0] || 0, p[1] || 0];
  }
  function curAngle(el) {
    const r = getComputedStyle(el).rotate;
    const m = r && r.match(/(-?[\d.]+)deg/);
    return m ? parseFloat(m[1]) : 0;
  }
  function local(x, y) { const r = phone.getBoundingClientRect(); return { x: x - r.left - phone.clientLeft, y: y - r.top - phone.clientTop }; }
  function centerLocal(el) { const r = el.getBoundingClientRect(); return local(r.left + r.width / 2, r.top + r.height / 2); }
  /* llama a fn cuando el elemento queda oculto (o al vencer el tiempo) */
  function whenHidden(el, fn, ms) {
    let done = false, t = 0;
    const mo = new MutationObserver(() => { if (el.hidden) fin(); });
    function fin() { if (done) return; done = true; mo.disconnect(); clearTimeout(t); fn(); }
    mo.observe(el, { attributes: true, attributeFilter: ['hidden'] });
    t = setTimeout(fin, ms || 900);
    if (el.hidden) fin();
  }
  const isField = t => !!t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"], [data-mo-noswipe]');
  /* ¿hay un carrusel horizontal entre t y stop? (entonces el gesto es suyo).
     El scroller principal de cada vista (.view > .scr) no cuenta: es vertical y
     si desborda a lo ancho es una fuga de maquetación (pan-y ya la frena). */
  function inHScroll(t, stopEl) {
    for (let el = t; el && el !== stopEl && el !== phone; el = el.parentElement) {
      if (el.scrollWidth > el.clientWidth + 1 && !(el.classList.contains('scr') && el.parentElement && el.parentElement.classList.contains('view'))) {
        const ox = getComputedStyle(el).overflowX;
        if (ox === 'auto' || ox === 'scroll') return true;
      }
    }
    return false;
  }

  /* =========================================================================
     4. CLASES EN <html> Y CAPA DE DESTELLOS
     ========================================================================= */
  const layer = D.createElement('div');
  layer.id = 'mo-fx'; layer.setAttribute('aria-hidden', 'true');
  phone.appendChild(layer);

  function sync() {
    const m = moving();
    HTML.classList.toggle('mo-gest', !killed);
    HTML.classList.toggle('mo-on', m);
    HTML.classList.toggle('mo-vt', m && FLAGS.transitions);
    if (!fx('tilt')) tiltReset();
    placeInd(false);
  }

  /* =========================================================================
     5. BARRA INFERIOR: indicador que se desliza + ícono que rebota
     ========================================================================= */
  const tabbar = $('#tabbar');
  let ind = null, indX = null;
  const tabOrder = () => (tabbar ? $$('.tab[data-tab]', tabbar).map(t => t.dataset.tab) : []);
  const tabCenter = t => t.offsetLeft + t.offsetWidth / 2;
  function ensureInd() {
    if (!tabbar) return null;
    if (!ind || !ind.isConnected) {
      ind = D.createElement('mo-tabind'); ind.setAttribute('aria-hidden', 'true');
      tabbar.appendChild(ind); indX = null;
    }
    return ind;
  }
  /* el núcleo dibuja una brasa fija por pestaña (.tab::before); con data-ind="motion" la oculta y queda la nuestra, que viaja */
  const indY = tab => tab.offsetTop + 18;
  function placeInd(animate) {
    if (!tabbar) return;
    if (!can('indicator')) { if (ind) ind.hidden = true; delete tabbar.dataset.ind; return; }
    const el = ensureInd(); el.hidden = false;
    tabbar.dataset.ind = 'motion';
    const tab = $('.tab[aria-current="page"]', tabbar);
    if (!tab) { el.classList.remove('show'); return; }
    const x = tabCenter(tab), y = indY(tab), from = indX;
    stop(el);
    el.style.translate = x + 'px ' + y + 'px';
    el.classList.add('show');
    indX = x;
    if (animate && from != null && Math.abs(from - x) > 0.5 && fx('indicator')) {
      const d = x - from;
      spring(el, p => {
        const s = Math.sin(Math.PI * clamp(p, 0, 1));
        return { translate: (from + d * p).toFixed(2) + 'px ' + y + 'px', scale: (1 + 0.2 * s).toFixed(3) + ' ' + (1 - 0.06 * s).toFixed(3) };
      }, { cfg: SPRING.glide });
    }
  }
  /* durante el deslizar entre pestañas el indicador se asoma hacia la siguiente */
  function peekInd(name, p) {
    if (!ind || !fx('indicator')) return;
    const cur = $('.tab[aria-current="page"]', tabbar); if (!cur) return;
    const x0 = tabCenter(cur), y = indY(cur);
    let x = x0;
    const t = name && $('.tab[data-tab="' + name + '"]', tabbar);
    if (t) x = x0 + (tabCenter(t) - x0) * p;
    stop(ind); ind.style.translate = x.toFixed(2) + 'px ' + y + 'px'; indX = x;
  }
  function bounceIcon(tab) {
    const i = $('.i', tab); if (!i) return;
    stop(i);
    spring(i, p => ({ scale: (0.78 + 0.22 * p).toFixed(3) }), { cfg: SPRING.bouncy });
  }

  /* =========================================================================
     6. TRANSICIÓN ENTRE PESTAÑAS con dirección
     El núcleo ya usa document.startViewTransition en go(). En 'beforeTab'
     marcamos <html data-mo-nav="fwd|back|same"> y el CSS hace el resto.
     ========================================================================= */
  let navTimer = 0, userNavAt = 0, swipedView = null, lastDir = 0;
  L.on('beforeTab', d => {
    if (!d) return;
    const order = tabOrder(), a = order.indexOf(d.from), b = order.indexOf(d.to);
    const dir = a < 0 || b < 0 ? 'same' : b > a ? 'fwd' : b < a ? 'back' : (L.pushView ? 'back' : 'same');
    lastDir = dir === 'fwd' ? 1 : dir === 'back' ? -1 : 0;
    if (!fx('transitions') || !D.startViewTransition) return;
    HTML.dataset.moNav = dir;
    clearTimeout(navTimer);
    navTimer = setTimeout(endNav, 2500);   /* respaldo si la transición no llega a correr */
  });
  function endNav() { clearTimeout(navTimer); delete HTML.dataset.moNav; }
  /* se limpia cuando termina la animación de la vista que llega (no por reloj: en un equipo lento la cortaría) */
  HTML.addEventListener('animationend', e => { if (e.pseudoElement && e.pseudoElement.indexOf('view-transition-new(lp-views)') > -1) endNav(); });
  L.on('tab', v => {
    if (swipedView) { clearSwipe(swipedView); swipedView = null; }
    const view = $('#v-' + v); if (!view) return;
    if (now() - userNavAt < 800) haptic('tick');
    /* sin View Transitions (Firefox, Safari viejo): entrada simple con dirección */
    if (fx('transitions') && !D.startViewTransition) {
      view.animate([{ opacity: 0, translate: (lastDir * 36) + 'px 0' }, { opacity: 1, translate: '0 0' }], { duration: DUR.page, easing: EASE.page, id: 'mo-in' });
    }
    if (v !== 'hoy') stagger($('.scr', view), { delay: 60 });
    if (v === 'camino') rollIn($('#camino'), true);
  });
  function clearSwipe(view) { stop(view); view.style.translate = ''; view.style.opacity = ''; view.style.willChange = ''; }

  /* =========================================================================
     7. APARICIÓN ESCALONADA de bloques al entrar a una vista, hoja o segmento
     ========================================================================= */
  const UNITS = '.vh, .segc, .sec-h, .card, .leader, .prow, .planrow, .wrow, .inv, .tpl, .addrow, .stat, .medal-t, .kcard, .fhead, .phero, .qa, .pet, .mrow, .hoy-mod, .inv-pill, [data-mo-in]';
  const SHEET_UNITS = '.agrid > *, .qacts > *, .ilist > *, .dlist > *, .rules > *, .plans > *';
  /* el más externo gana: una tarjeta aparece entera, no fila por fila */
  function outermost(list) {
    const out = []; let last = null;
    list.forEach(el => { if (last && last.contains(el)) return; out.push(el); last = el; });
    return out;
  }
  function stagger(scope, o) {
    if (!scope || !fx('stagger')) return;
    o = o || {};
    let list;
    if (o.sheet) list = $$(SHEET_UNITS, scope);
    else if (scope.id === 'scr-hoy') list = Array.from(scope.children).filter(el => !el.classList.contains('sky') && !el.hidden);
    else list = outermost($$(UNITS, scope));
    if (o.after) list = list.filter(el => o.after.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING && !o.after.contains(el));
    const box = scope.getBoundingClientRect(), items = [];
    for (const el of list) {
      if (items.length >= (o.max || 12)) break;
      if (!o.sheet) {
        const r = el.getBoundingClientRect();
        if (r.height === 0) continue;
        if (r.top > box.bottom + 20) break;
        if (r.bottom < box.top) continue;
      }
      items.push(el);
    }
    const step = o.step || 30, base = o.delay || 0;
    items.forEach((el, i) => {
      const kf = o.sheet ? [{ opacity: 0, scale: '0.86' }, { opacity: 1, scale: '1' }] : [{ opacity: 0, translate: '0 14px' }, { opacity: 1, translate: '0 0' }];
      el.animate(kf, { duration: o.sheet ? 380 : 440, delay: base + i * step, easing: o.sheet ? 'cubic-bezier(0.34, 1.3, 0.64, 1)' : EASE.out, fill: 'backwards', id: 'mo-in' });
    });
  }

  /* =========================================================================
     8. CONTADORES QUE RUEDAN (cada cifra es una tira que se traslada)
     Objetivos: .stat b (Recorrido), .wsum .big (Semana), .llama-num b (Tu
     llama) y cualquier [data-mo-roll] de un módulo. Al entrar cuentan desde 0;
     si el número cambia en una vista abierta, ruedan del viejo al nuevo.
     ========================================================================= */
  const ROLL = '.stat b, .wsum .big, .llama-num b, [data-mo-roll]';
  const rolled = new Map();
  function rollIn(scope, entry) {
    if (!scope) return;
    $$(ROLL, scope).forEach((el, i) => {
      if (el.querySelector('mo-odo')) return;
      const tn = el.firstChild;
      if (!tn || tn.nodeType !== 3) return;
      const txt = tn.nodeValue.trim();
      if (!/^\d{1,6}$/.test(txt)) return;
      const to = Number(txt), key = scope.id + '|' + el.className + '|' + (el.parentElement ? el.parentElement.className : '') + '|' + i;
      const prev = rolled.get(key);
      rolled.set(key, to);
      if (!fx('roll')) return;
      if (entry) roll(el, tn, 0, to, true, i * 90);
      else if (prev != null && prev !== to) roll(el, tn, prev, to, false, 0);
    });
  }
  function roll(el, tn, from, to, entry, delay) {
    const ts = String(to), fsRaw = String(from);
    const whole = !entry && fsRaw.length !== ts.length;   /* cambia la cantidad de cifras: rueda el número entero */
    const fs = fsRaw.padStart(ts.length, '0');
    const up = to >= from;
    const wrap = D.createElement('mo-odo'); wrap.setAttribute('aria-hidden', 'true');
    const sr = D.createElement('mo-sr'); sr.textContent = ts;
    const cols = [];
    const addCol = (size, seq) => {
      const col = D.createElement('mo-col');
      const sz = D.createElement('mo-sz'); sz.textContent = size;
      const st = D.createElement('mo-strip');
      (up ? seq : seq.slice().reverse()).forEach(s => { const sp = D.createElement('mo-d'); sp.textContent = s; st.appendChild(sp); });
      col.append(sz, st); wrap.appendChild(col); cols.push({ col, st, len: seq.length });
    };
    if (whole) addCol(ts, [fsRaw, ts]);
    else {
      for (let j = 0; j < ts.length; j++) {
        const b = Number(ts[j]), seq = [];
        if (entry) { const loops = j === ts.length - 1 && ts.length < 4 ? 10 : 0; for (let k = 0; k <= loops + b; k++) seq.push(String(k % 10)); }
        else { let k = Number(fs[j]); seq.push(String(k)); while (k !== b) { k = (k + (up ? 1 : 9)) % 10; seq.push(String(k)); } }
        addCol(ts[j], seq);
      }
    }
    tn.replaceWith(wrap);
    wrap.after(sr);
    const restore = () => { if (wrap.isConnected) wrap.replaceWith(D.createTextNode(ts)); sr.remove(); };
    const H = cols[0].col.getBoundingClientRect().height;
    if (!H) { restore(); return; }
    let left = cols.length;
    const done = () => { if (--left <= 0) restore(); };
    cols.forEach((c, j) => {
      const dist = (c.len - 1) * H;
      if (!dist) { done(); return; }
      const y0 = up ? 0 : -dist, y1 = up ? -dist : 0;
      c.st.style.translate = '0 ' + y1 + 'px';
      const a = c.st.animate([{ translate: '0 ' + y0 + 'px' }, { translate: '0 ' + y1 + 'px' }], {
        duration: entry ? 720 + j * 130 : 460, delay, easing: entry ? EASE.spin : EASE.out, fill: 'backwards', id: 'mo-roll'
      });
      a.onfinish = done; a.oncancel = done;
    });
  }

  /* =========================================================================
     9. CONTROLES SEGMENTADOS: la píldora se desliza al nuevo segmento
     ========================================================================= */
  function onSegClick(btn) {
    const seg = btn.closest('.segc, .fo-seg');
    if (!seg || !moving()) return;
    const old = $('[aria-selected="true"]', seg);
    const host = seg.closest('#focus') || seg.closest('.scr');
    const sel = seg.classList.contains('fo-seg') ? '.fo-seg' : '.segc';
    const from = old && old !== btn ? { x: old.offsetLeft, y: old.offsetTop, w: old.offsetWidth, h: old.offsetHeight } : null;
    raf(() => {
      const s2 = host && host.isConnected ? $(sel, host) : null;
      if (!s2) return;
      const nb = $('[aria-selected="true"]', s2);
      if (from && nb && fx('segments') && Math.abs(nb.offsetLeft - from.x) > 1) {
        const cs = getComputedStyle(nb), pill = D.createElement('mo-pill');
        pill.setAttribute('aria-hidden', 'true');
        Object.assign(pill.style, { left: from.x + 'px', top: from.y + 'px', width: from.w + 'px', height: from.h + 'px', borderRadius: cs.borderRadius, background: cs.backgroundColor, boxShadow: cs.boxShadow });
        s2.prepend(pill); s2.classList.add('mo-seg-gliding');
        const d = nb.offsetLeft - from.x;
        const a = spring(pill, p => ({ translate: (d * p).toFixed(2) + 'px 0' }), { cfg: SPRING.glide });
        const end = () => { pill.remove(); s2.classList.remove('mo-seg-gliding'); };
        a.onfinish = end; a.oncancel = end;
        haptic('tick');
      }
      if (host.id === 'focus') return;
      const body = $('#segBody', host);
      if (body) { stagger(body, { delay: 40 }); rollIn(host, true); }
      else stagger(host, { after: s2, delay: 40 });
    });
  }

  /* =========================================================================
     10. PRESIONAR CON RESORTE
     Botones y tarjetas se hunden según su tamaño y vuelven con un resorte.
     Los que ya tienen :active en el núcleo (.btn, .qa, …) conservan su
     hundimiento CSS y solo suman el rebote al soltar. Usa la propiedad
     `scale`, que se compone con cualquier transform del núcleo.
     ========================================================================= */
  const PRESSABLE = 'button, [role="button"], [role="link"], [data-mo-press]';
  const NOPRESS = '.prac, .lamp-btn, .vs, .tg, .md-coin, [data-mo-nopress]';
  const CORE_ACTIVE = '.btn, .qa, .atile, .keep button, .dw-chk, .heartbtn, .ichk, .fab, .now-go';
  let pressed = null;
  function pressIn(e) {
    if (!fx('press')) return;
    const el = e.target.closest(PRESSABLE);
    if (!el || !phone.contains(el) || el.disabled || el.getAttribute('aria-disabled') === 'true' || el.matches(NOPRESS)) return;
    const w = el.offsetWidth;
    const core = el.matches(CORE_ACTIVE);
    const s = w > 240 ? 0.975 : w > 120 ? 0.96 : w > 60 ? 0.94 : 0.9;
    stop(el, 'mo-press');
    const a = core ? null : el.animate([{ scale: '1' }, { scale: String(s) }], { duration: 110, easing: EASE.out, fill: 'forwards', id: 'mo-press' });
    pressed = { el, s, a, core, w, t0: now(), x: e.clientX, y: e.clientY, id: e.pointerId };
  }
  function pressOut() {
    const p = pressed; if (!p) return;
    pressed = null;
    if (p.a) p.a.cancel();
    if (!p.el.isConnected || !moving()) return;
    if (p.core) {
      const amt = p.w > 240 ? 0.012 : p.w > 120 ? 0.022 : 0.05;
      p.el.animate([{ scale: '1' }, { scale: String(1 + amt), offset: 0.4 }, { scale: String(1 - amt * 0.25), offset: 0.75 }, { scale: '1' }], { duration: 380, easing: 'ease-out', id: 'mo-press' });
      return;
    }
    const k = clamp((now() - p.t0) / 110, 0, 1), cur = 1 + (p.s - 1) * (1 - Math.pow(1 - k, 3));
    spring(p.el, q => ({ scale: (cur + (1 - cur) * q).toFixed(4) }), { cfg: SPRING.press, id: 'mo-press' });
  }

  /* =========================================================================
     11. MANTENER PARA MARCAR (círculos de Hoy): anillo que se llena
     Arranca a los 110 ms (un toque corto no lo muestra) y se completa justo
     cuando el núcleo marca (460 ms, o Lampara.HOLD_MS si existe).
     ========================================================================= */
  let hold = null;
  function holdStart(e) {
    holdCancel();
    if (!can('hold') || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const b = e.target.closest('#pracs .prac'); if (!b) return;
    const orb = $('.orb', b); if (!orb) return;
    const ms = L.HOLD_MS || 460, lead = 110, half = (ms - lead) / 2;
    const el = D.createElement('mo-hold');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<mo-h class="r"><mo-arc></mo-arc></mo-h><mo-h class="l"><mo-arc></mo-arc></mo-h>';
    orb.appendChild(el);
    const an = [
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 70, delay: lead - 20, fill: 'both', id: 'mo-hold' }),
      $('mo-h.r mo-arc', el).animate([{ rotate: '0deg' }, { rotate: '180deg' }], { duration: half, delay: lead, fill: 'both', easing: 'linear', id: 'mo-hold' }),
      $('mo-h.l mo-arc', el).animate([{ rotate: '0deg' }, { rotate: '180deg' }], { duration: half, delay: lead + half, fill: 'both', easing: 'linear', id: 'mo-hold' })
    ];
    hold = { el, an, b, t0: now(), lead, timer: setTimeout(holdFire, ms) };
  }
  function holdFire() {
    const h = hold; hold = null; if (!h) return;
    h.fired = true;
    if (!moving()) { h.el.remove(); return; }
    h.an.forEach(a => a.finish());
    const a = h.el.animate([{ scale: '1', opacity: 1 }, { scale: '1.3', opacity: 0 }], { duration: 360, easing: EASE.out, fill: 'forwards', id: 'mo-hold' });
    a.onfinish = () => h.el.remove();
  }
  function holdCancel(released) {
    const h = hold; hold = null; if (!h) return;
    clearTimeout(h.timer);
    /* rebote del círculo al soltar un toque corto (el núcleo despliega el detalle) */
    if (released && fx('press')) { const orb = $('.orb', h.b); if (orb) orb.animate([{ scale: '1' }, { scale: '1.07', offset: 0.4 }, { scale: '0.985', offset: 0.72 }, { scale: '1' }], { duration: 420, easing: 'ease-out', id: 'mo-press' }); }
    if (!moving() || now() - h.t0 < h.lead + 10) { h.el.remove(); return; }
    h.an.forEach(a => a.pause());
    const a = h.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: EASE.out, fill: 'forwards', id: 'mo-hold' });
    a.onfinish = () => h.el.remove();
  }

  /* =========================================================================
     12. DESTELLO DE LUZ donde tocas algo encendido
     ========================================================================= */
  const LIT = '.prac.on, .now-go, .ahora.done .now-foot button, .qa.fresh, .heartbtn.hit, .medal-t.got, .btn:not(.ghost):not(:disabled), .c-btn, .fab, .kept, .atile[aria-pressed="true"], .atile[aria-checked="true"], .irow.done .ichk, .dw-row.done .dw-chk, .bk.l3, .cday.lit, .wchip[aria-pressed="true"], .wchip[aria-checked="true"], .pr-chips [aria-pressed="true"], .vs.hl, .md-coin, .lamp-btn, [data-mo-lit]';
  const FLAME_LIT = '.btn:not(.colored), .c-btn, .fab, .lamp-btn, .medal-t.fl';
  function glowAt(x, y, color) {
    const p = local(x, y), g = D.createElement('mo-glow');
    if (color) g.style.setProperty('--mo-gc', color);
    g.style.left = p.x.toFixed(1) + 'px'; g.style.top = p.y.toFixed(1) + 'px';
    layer.appendChild(g);
    const a = g.animate([{ opacity: 0.95, scale: '0.25' }, { opacity: 0, scale: '1.35' }], { duration: 620, easing: EASE.out });
    a.onfinish = () => g.remove();
  }
  function glow(e, el) {
    let c = '';
    if (!el.matches(FLAME_LIT) && el.closest('[data-a], .fl')) c = getComputedStyle(el).getPropertyValue('--c').trim();
    glowAt(e.clientX, e.clientY, c);
  }

  /* =========================================================================
     13. LA LÁMPARA: responde al toque y se mece con el giro del teléfono
     (DeviceOrientation; en iOS pide permiso al primer toque de la lámpara)
     o con el puntero en escritorio (se aparta y le dan ráfagas).
     ========================================================================= */
  function lampTouch(btn) {
    const wrap = $('.lamp-wrap', btn) || btn.closest('.lamp-wrap') || btn;
    const flame = $('.flame', wrap), halo = $('.halo-in', wrap);
    haptic('tap');
    if (!fx('lamp') || !flame) return;
    stop(flame, 'mo-lamp');
    flame.animate([{ scale: '1' }, { scale: '1.14 1.26', offset: 0.16 }, { scale: '0.9 0.84', offset: 0.4 }, { scale: '1.05 1.06', offset: 0.66 }, { scale: '1' }], { duration: 780, easing: 'ease-out', id: 'mo-lamp' });
    if (halo) { stop(halo, 'mo-lamp'); halo.animate([{ scale: '1' }, { scale: '1.16', offset: 0.28 }, { scale: '1' }], { duration: 950, easing: EASE.out, id: 'mo-lamp' }); }
    try { L.burst(L.flamePoint(wrap), 5); } catch (err) { /* sin lámpara visible */ }
    if (fx('tilt')) { tilt.v += (Math.random() < 0.5 ? -1 : 1) * 45; tiltKick(); }
  }
  const tilt = { target: 0, x: 0, v: 0, raf: 0, last: 0, gyro: false, asked: false, cx: 0, cxAt: 0 };
  function applyTilt(x) {
    const v = Math.abs(x) < 0.01 ? '' : x.toFixed(2) + 'deg';
    $$('.lamp-wrap .flame').forEach(f => { f.style.rotate = v; });
    const b = $('#medal:not([hidden]) .md-badge');
    if (b) b.style.rotate = v ? 'y ' + (-x * 1.6).toFixed(2) + 'deg' : '';
  }
  function tiltStep(t) {
    const dt = Math.min(0.05, Math.max(0.001, (t - tilt.last) / 1000)); tilt.last = t;
    tilt.v += (-SPRING.sway.k * (tilt.x - tilt.target) - SPRING.sway.c * tilt.v) * dt;
    tilt.x = clamp(tilt.x + tilt.v * dt, -16, 16);
    applyTilt(tilt.x);
    if (Math.abs(tilt.x - tilt.target) < 0.02 && Math.abs(tilt.v) < 0.05) { tilt.raf = 0; tilt.x = tilt.target; applyTilt(tilt.x); return; }
    tilt.raf = raf(tiltStep);
  }
  function tiltKick() { if (!tilt.raf && fx('tilt')) { tilt.last = now(); tilt.raf = raf(tiltStep); } }
  function tiltReset() {
    if (tilt.raf) cancelAnimationFrame(tilt.raf);
    tilt.raf = 0; tilt.x = 0; tilt.v = 0; tilt.target = 0;
    applyTilt(0);
  }
  function onOrient(e) {
    if (e.gamma == null || !fx('tilt')) return;
    tilt.gyro = true;
    tilt.target = clamp(-e.gamma * 0.42, -14, 14);
    tiltKick();
  }
  function enableGyro() {
    const DOE = window.DeviceOrientationEvent;
    if (!DOE || tilt.asked || !can('tilt')) return;
    tilt.asked = true;
    if (typeof DOE.requestPermission === 'function') {
      DOE.requestPermission().then(s => { if (s === 'granted') window.addEventListener('deviceorientation', onOrient, { passive: true }); }).catch(() => { /* sin permiso */ });
    } else window.addEventListener('deviceorientation', onOrient, { passive: true });
  }
  phone.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || tilt.gyro || !fx('tilt') || e.buttons) return;
    if (L.current !== 'hoy' || L.pushView) return;
    const t = now();
    if (t - tilt.cxAt > 600) { const lamp = $('#lampMain .flame') || $('#lampMain'); if (!lamp) return; const r = lamp.getBoundingClientRect(); tilt.cx = r.left + r.width / 2; tilt.cxAt = t; }
    tilt.target = clamp(-(e.clientX - tilt.cx) / 40, -6, 6);
    tilt.v += clamp(-(e.movementX || 0) * 0.7, -18, 18);
    tiltKick();
  }, { passive: true });
  phone.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && !tilt.gyro) { tilt.target = 0; tiltKick(); } }, { passive: true });

  /* =========================================================================
     14. EL BOTÓN ＋: el ícono gira a × al abrir y vuelve al cerrar la hoja;
     un aro de luz se abre desde el botón por debajo de la hoja.
     ========================================================================= */
  let fabOpen = false;
  const fabIcon = () => $('[data-fab] .i');
  function fabOpened(fab) {
    haptic('select');
    if (!fx('fab')) return;
    fabOpen = true;
    const icon = $('.i', fab);
    if (icon) { stop(icon, 'mo-fab'); spring(icon, p => ({ rotate: (135 * p).toFixed(2) + 'deg' }), { cfg: SPRING.bouncy, id: 'mo-fab', fill: 'forwards' }); }
    const c = centerLocal(fab), ring = D.createElement('mo-bloom'); ring.style.left = c.x + 'px'; ring.style.top = c.y + 'px';
    phone.appendChild(ring);
    const a = ring.animate([{ scale: '0.7', opacity: 0.95 }, { scale: '5.2', opacity: 0 }], { duration: 620, easing: EASE.out });
    a.onfinish = () => ring.remove();
    setTimeout(() => { if (fabOpen && sheetWrap && sheetWrap.hidden) fabClosed(); }, 700);
  }
  function fabClosed() {
    if (!fabOpen) return;
    fabOpen = false;
    const icon = fabIcon(); if (!icon) return;
    stop(icon, 'mo-fab');
    if (!moving()) return;
    spring(icon, p => ({ rotate: (135 - 135 * p).toFixed(2) + 'deg' }), { cfg: SPRING.bouncy, id: 'mo-fab' });
  }

  /* =========================================================================
     15. GESTOS
     Un solo motor: en pointerdown se juntan los gestos posibles para ese
     punto; al pasar el umbral (7 px) se decide el eje y uno lo reclama.
     Si no hay gesto, el toque sigue siendo un toque (clicks intactos).
     ========================================================================= */
  const sheetWrap = $('#sheetWrap'), sheetEl = $('#sheet'), sheetBody = $('#sheetBody'), backdrop = $('#backdrop');
  const focusEl = $('#focus'), medalEl = $('#medal'), cumbreEl = $('#cumbre'), bannerEl = $('#banner');
  let G = null, synthetic = false, suppressUntil = 0;

  function candidates(e) {
    const t = e.target, out = [], touchish = e.pointerType !== 'mouse';
    if (bannerEl && bannerEl.contains(t)) { if (can('bannerSwipe') && bannerEl.classList.contains('show')) out.push(bannerGesture()); return out; }
    if (cumbreEl && !cumbreEl.hidden) return out;
    if (medalEl && !medalEl.hidden) { const b = t.closest('.md-badge'); if (b && medalEl.contains(b) && can('coin')) out.push(coinGesture(b)); return out; }
    if (focusEl && !focusEl.hidden) {
      if (can('focusDrag') && focusEl.contains(t) && !isField(t)) {
        const head = t.closest('.fo-top'), sc = t.closest('.fo-scroll');
        if (head || (touchish && (!sc || sc.scrollTop <= 0))) out.push(focusGesture());
      }
      return out;
    }
    if (sheetWrap && !sheetWrap.hidden) {
      if (!sheetEl.contains(t)) return out;
      const b = t.closest('.ach-d .md-badge');
      if (b && can('coin')) out.push(coinGesture(b));
      if (can('sheetDrag') && !isField(t)) {
        const r = sheetEl.getBoundingClientRect(), inHandle = e.clientY - r.top < GESTURE.handle;
        if (inHandle || (touchish && sheetEl.scrollTop <= 0)) out.push(sheetGesture());
      }
      return out;
    }
    if (t.closest('#tabbar')) return out;
    const pv = L.pushView ? $('#v-' + L.pushView) : null;
    if (pv && !pv.hidden) {
      if (pv.contains(t) && can('backSwipe') && !isField(t)) {
        const edge = local(e.clientX, e.clientY).x < GESTURE.edge;
        if (edge || (touchish && !inHScroll(t, pv))) out.push(backGesture(pv));
      }
      return out;
    }
    const view = t.closest('.view');
    if (view && !view.classList.contains('push') && touchish && can('tabSwipe') && !isField(t) && !inHScroll(t, view)) out.push(tabGesture(view));
    return out;
  }

  function onDown(e) {
    if (killed || synthetic) return;
    if (!e.isPrimary) { if (G && G.owner) endGesture(null, true); return; }
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const t = e.target;
    if (!(t instanceof Element) || !phone.contains(t)) { G = null; return; }
    G = { id: e.pointerId, type: e.pointerType, x0: e.clientX, y0: e.clientY, t, owner: null, decided: false, dx: 0, dy: 0, sx: 0, sy: 0, samples: [{ t: e.timeStamp, x: e.clientX, y: e.clientY }] };
    G.cands = candidates(e);
    pressIn(e);
    holdStart(e);
    if (t.closest('#lampBtn, .lamp-btn') && can('lamp')) lampTouch(t.closest('#lampBtn, .lamp-btn'));
    if (fx('glow')) { const lit = t.closest(LIT); if (lit && phone.contains(lit)) glow(e, lit); }
  }
  function onMove(e) {
    if (pressed && e.pointerId === pressed.id && Math.hypot(e.clientX - pressed.x, e.clientY - pressed.y) > 12) pressOut();
    if (!G || e.pointerId !== G.id) return;
    const dx = e.clientX - G.x0, dy = e.clientY - G.y0;
    G.dx = dx; G.dy = dy;
    G.samples.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
    if (G.samples.length > 10) G.samples.shift();
    if (G.owner) { G.owner.move(dx - G.sx, dy - G.sy); return; }
    if (G.decided || !G.cands.length || Math.hypot(dx, dy) < GESTURE.slop) return;
    G.decided = true;
    const ax = Math.abs(dx), ay = Math.abs(dy), b = GESTURE.axisBias;
    const g = G.cands.find(c => c.axis === 'x' ? ax > ay * b && (!c.dir || Math.sign(dx) === c.dir) : ay > ax * b && (!c.dir || Math.sign(dy) === c.dir));
    if (g) claim(g, e);
  }
  function claim(g, e) {
    G.owner = g;
    /* sin salto: el gesto arranca desde el umbral, no desde 0 */
    if (g.axis === 'x') G.sx = Math.sign(G.dx) * Math.min(Math.abs(G.dx), GESTURE.slop);
    else G.sy = Math.sign(G.dy) * Math.min(Math.abs(G.dy), GESTURE.slop);
    HTML.classList.add('mo-drag');
    pressOut(); holdCancel(); cancelCorePress();
    if (e.pointerType !== 'touch') { try { phone.setPointerCapture(e.pointerId); } catch (err) { /* sin captura */ } }
    g.start();
    g.move(G.dx - G.sx, G.dy - G.sy);
  }
  /* si el gesto empezó sobre un círculo de Hoy, se cancela su «mantener» del núcleo */
  function cancelCorePress() {
    const b = G && G.t.closest && G.t.closest('#pracs .prac');
    if (!b) return;
    synthetic = true;
    try { b.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: G.id, pointerType: G.type, isPrimary: true })); } catch (err) { /* nada */ }
    synthetic = false;
  }
  function velocity(s) {
    const last = s[s.length - 1]; let first = last;
    for (let i = s.length - 1; i >= 0; i--) { if (last.t - s[i].t > 100) break; first = s[i]; }
    const dt = last.t - first.t;
    return dt > 0 ? { x: (last.x - first.x) / dt, y: (last.y - first.y) / dt } : { x: 0, y: 0 };
  }
  function onUp(e) {
    if (pressed && e.pointerId === pressed.id) pressOut();
    if (hold) holdCancel(e.type === 'pointerup');
    if (synthetic || !G || e.pointerId !== G.id) return;
    G.samples.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
    endGesture(e, e.type === 'pointercancel');
  }
  function endGesture(e, cancelled) {
    const st = G; G = null;
    HTML.classList.remove('mo-drag');
    if (!st) return;
    const g = st.owner;
    if (!g) { if (!cancelled && !st.decided && e) tapFx(st); return; }
    suppressUntil = now() + 350;
    const v = velocity(st.samples);
    try { if (cancelled) g.cancel(0, 0); else g.end(v.x, v.y, st.dx - st.sx, st.dy - st.sy); } catch (err) { console.error(err); }
  }
  /* toque sin arrastre sobre la moneda: da una vuelta */
  function tapFx(st) {
    const b = st.t.closest && st.t.closest('#medal .md-badge, .ach-d .md-badge');
    if (b && fx('coin')) { const coin = $('.md-coin', b); if (coin) { settleCoin(coin, curAngle(coin), 1.1); haptic('tick'); } }
  }

  D.addEventListener('pointerdown', onDown, { capture: true, passive: true });
  D.addEventListener('pointermove', onMove, { capture: true, passive: true });
  D.addEventListener('pointerup', onUp, { capture: true, passive: true });
  D.addEventListener('pointercancel', onUp, { capture: true, passive: true });
  /* el «mantener» del núcleo se corta si el puntero sale de #pracs: igual el anillo */
  D.addEventListener('pointerout', e => {
    if (!hold || !e.target.closest || !e.target.closest('#pracs')) return;
    const to = e.relatedTarget;
    if (!to || !to.closest || !to.closest('#pracs')) holdCancel();
  }, { capture: true, passive: true });
  /* touchmove activo: solo frena el scroll cuando un gesto ya es nuestro */
  phone.addEventListener('touchmove', e => { if (G && G.owner && e.cancelable) e.preventDefault(); }, { passive: false });
  /* después de un arrastre no se dispara el click del lugar donde soltaste */
  D.addEventListener('click', e => {
    if (e.isTrusted && now() < suppressUntil) { e.stopPropagation(); e.preventDefault(); suppressUntil = 0; return; }
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest('#tabbar .tab')) userNavAt = now();
    const fab = t.closest('[data-fab]');
    if (fab && phone.contains(fab)) fabOpened(fab);
    const seg = t.closest('.segc [data-seg], .segc [data-pseg], .fo-seg [data-mode]');
    if (seg) onSegClick(seg);
    if (t.closest('#lampBtn, .lamp-btn')) enableGyro();
  }, true);

  /* ---------- hoja inferior: arrastrar hacia abajo para cerrar ---------- */
  function sheetGesture() {
    let H = 1, base = 0, y = 0, armed = false, rid = 0;
    const limit = () => Math.min(H * 0.3, 170);
    const paint = () => {
      rid = 0;
      sheetEl.style.translate = '0 ' + y.toFixed(1) + 'px';
      if (backdrop) backdrop.style.filter = y > 0 ? 'opacity(' + (1 - 0.8 * clamp(y / H, 0, 1)).toFixed(3) + ')' : '';
    };
    const flush = () => { if (rid) { cancelAnimationFrame(rid); paint(); } };
    const g = {
      axis: 'y', dir: 1,
      start() { H = sheetEl.offsetHeight || 1; base = curTranslate(sheetEl)[1]; stop(sheetEl); stop(backdrop); sheetEl.style.willChange = 'translate'; },
      move(dx, dy) {
        const raw = base + dy;
        y = raw >= 0 ? raw : -rubber(-raw, 36);
        const a = y > limit(); if (a !== armed) { armed = a; haptic('tick'); }
        if (!rid) rid = raf(paint);
      },
      end(vx, vy) {
        flush(); sheetEl.style.willChange = '';
        const close = (y > limit() && vy > -0.2) || (vy > GESTURE.flick && y > 8);
        if (!close) { g.cancel(vx, vy); return; }
        haptic('snap');
        if (moving()) sheetEl.animate([{ translate: '0 ' + y + 'px' }, { translate: '0 ' + (y + clamp(vy, 0, 4) * 110) + 'px' }], { duration: 260, easing: EASE.out, fill: 'forwards', id: 'mo-sheet' });
        let cleaned = false;
        const clean = () => { if (cleaned) return; cleaned = true; stop(sheetEl); stop(backdrop); sheetEl.style.translate = ''; if (backdrop) backdrop.style.filter = ''; };
        L.closeSheet(clean);
        setTimeout(clean, 1200);
      },
      cancel(vx, vy) {
        if (rid) { cancelAnimationFrame(rid); rid = 0; }
        sheetEl.style.willChange = '';
        const from = y, f0 = backdrop ? backdrop.style.filter : '';
        sheetEl.style.translate = ''; if (backdrop) backdrop.style.filter = '';
        if (!moving() || Math.abs(from) < 0.5) return;
        spring(sheetEl, p => ({ translate: '0 ' + (from * (1 - p)).toFixed(2) + 'px' }), { cfg: SPRING.snap, v0: (vy || 0) * 1000 / -from, id: 'mo-sheet' });
        if (backdrop && f0) backdrop.animate([{ filter: f0 }, { filter: 'opacity(1)' }], { duration: 300, easing: EASE.out, id: 'mo-sheet' });
      }
    };
    return g;
  }

  /* ---------- vistas apiladas: deslizar a la derecha para volver ---------- */
  function backGesture(pv) {
    const PAR = 0.28;
    let W = 1, x = 0, base = 0, under = null, armed = false, rid = 0;
    const paint = () => {
      rid = 0;
      pv.style.translate = x.toFixed(1) + 'px 0';
      if (under) { const p = clamp(x / W, 0, 1); under.style.translate = (-(1 - p) * W * PAR).toFixed(1) + 'px 0'; under.style.opacity = (0.5 + 0.5 * p).toFixed(3); }
    };
    const flush = () => { if (rid) { cancelAnimationFrame(rid); paint(); } };
    const g = {
      axis: 'x', dir: 1,
      start() {
        W = phone.clientWidth || 390; base = curTranslate(pv)[0]; stop(pv);
        under = $('#v-' + L.current);
        if (!under || under === pv || under.hidden) under = null; else stop(under);
        pv.classList.add('mo-swiping'); pv.style.willChange = 'translate';
      },
      move(dx) {
        const raw = base + dx;
        x = raw >= 0 ? raw : -rubber(-raw, 24);
        const a = x > W * 0.33; if (a !== armed) { armed = a; haptic('tick'); }
        if (!rid) rid = raf(paint);
      },
      end(vx) {
        flush();
        const go = (x > W * 0.33 && vx > -0.15) || (vx > 0.35 && x > 12);
        if (!go) { g.cancel(vx); return; }
        haptic('snap');
        const u = under;
        if (moving()) {
          pv.animate([{ translate: x + 'px 0' }, { translate: (x + clamp(vx, 0, 4) * 90) + 'px 0' }], { duration: 300, easing: EASE.out, fill: 'forwards', id: 'mo-back' });
          if (u) u.animate([{ translate: u.style.translate || '0px 0px', opacity: Number(u.style.opacity || 1) }, { translate: '0px 0px', opacity: 1 }], { duration: 300, easing: EASE.out, fill: 'forwards', id: 'mo-back' });
        }
        L.closePush();
        whenHidden(pv, () => {
          stop(pv); pv.style.translate = ''; pv.style.willChange = ''; pv.classList.remove('mo-swiping');
          if (u) { stop(u); u.style.translate = ''; u.style.opacity = ''; }
        }, 900);
      },
      cancel(vx) {
        if (rid) { cancelAnimationFrame(rid); rid = 0; }
        const from = x, u = under;
        pv.style.translate = ''; pv.style.willChange = '';
        const fin = () => { pv.classList.remove('mo-swiping'); if (u) { stop(u); u.style.translate = ''; u.style.opacity = ''; } };
        if (!moving() || Math.abs(from) < 0.5) { fin(); return; }
        const a = spring(pv, p => ({ translate: (from * (1 - p)).toFixed(2) + 'px 0' }), { cfg: SPRING.snap, v0: (vx || 0) * 1000 / -from, id: 'mo-back' });
        a.onfinish = fin; a.oncancel = fin;
      }
    };
    return g;
  }

  /* ---------- pestañas principales: deslizar horizontal para cambiar ---------- */
  function tabGesture(view) {
    const order = tabOrder(), i = order.indexOf(L.current);
    let x = 0, dir = 0, ok = false, armed = false, rid = 0, raw = 0;
    const paint = () => {
      rid = 0;
      view.style.translate = x.toFixed(1) + 'px 0';
      view.style.opacity = (1 - Math.min(0.3, Math.abs(x) / 240)).toFixed(3);
      peekInd(ok ? order[i + dir] : null, ok ? clamp(Math.abs(raw) / 280, 0, 0.42) : 0);
    };
    const g = {
      axis: 'x', dir: 0,
      start() { stop(view); view.style.willChange = 'translate, opacity'; },
      move(dx) {
        raw = dx; dir = dx < 0 ? 1 : -1;
        ok = i >= 0 && !!order[i + dir];
        const a = Math.abs(dx);
        x = Math.sign(dx) * (ok ? rubber(a, 110) : rubber(a, 26));
        const arm = ok && a > 80; if (arm !== armed) { armed = arm; haptic('tick'); }
        if (!rid) rid = raf(paint);
      },
      end(vx, vy, dx) {
        if (rid) { cancelAnimationFrame(rid); paint(); }
        const commit = ok && (Math.abs(dx) > 80 || (Math.abs(vx) > 0.3 && Math.sign(vx) === -dir && Math.abs(dx) > 24));
        if (!commit) { g.cancel(vx); return; }
        swipedView = view; userNavAt = now();
        L.go(order[i + dir]);
        setTimeout(() => { if (swipedView === view) { clearSwipe(view); swipedView = null; placeInd(true); } }, 900);
      },
      cancel(vx) {
        if (rid) { cancelAnimationFrame(rid); rid = 0; }
        const from = x, o0 = Number(view.style.opacity || 1);
        clearSwipe(view);
        placeInd(true);
        if (!moving() || Math.abs(from) < 0.5) return;
        spring(view, p => ({ translate: (from * (1 - p)).toFixed(2) + 'px 0', opacity: (o0 + (1 - o0) * clamp(p, 0, 1)).toFixed(3) }), { cfg: SPRING.snap, v0: (vx || 0) * 1000 / -from, id: 'mo-tabs' });
      }
    };
    return g;
  }

  /* ---------- modo enfoque: deslizar hacia abajo para cerrar ---------- */
  function focusGesture() {
    let H = 1, y = 0, armed = false, rid = 0;
    const limit = () => Math.min(H * 0.22, 150);
    const paint = () => {
      rid = 0;
      focusEl.style.translate = '0 ' + y.toFixed(1) + 'px';
      focusEl.style.opacity = (1 - 0.35 * clamp(y / H, 0, 1)).toFixed(3);
    };
    const g = {
      axis: 'y', dir: 1,
      start() { H = focusEl.offsetHeight || 1; stop(focusEl); focusEl.style.willChange = 'translate, opacity'; },
      move(dx, dy) {
        y = dy >= 0 ? dy : -rubber(-dy, 30);
        const a = y > limit(); if (a !== armed) { armed = a; haptic('tick'); }
        if (!rid) rid = raf(paint);
      },
      end(vx, vy) {
        if (rid) { cancelAnimationFrame(rid); paint(); }
        focusEl.style.willChange = '';
        const close = (y > limit() && vy > -0.2) || (vy > GESTURE.flick && y > 8);
        if (!close) { g.cancel(vx, vy); return; }
        haptic('snap');
        if (moving()) focusEl.animate([{ translate: '0 ' + y + 'px' }, { translate: '0 ' + (y + clamp(vy, 0, 4) * 90) + 'px' }], { duration: 240, easing: EASE.out, fill: 'forwards', id: 'mo-focus' });
        const clean = () => { stop(focusEl); focusEl.style.translate = ''; focusEl.style.opacity = ''; };
        const x = $('.fo-x[data-fclose]', focusEl) || $('[data-fclose]', focusEl);
        if (x) x.click(); else focusEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        whenHidden(focusEl, clean, 900);
      },
      cancel(vx, vy) {
        if (rid) { cancelAnimationFrame(rid); rid = 0; }
        focusEl.style.willChange = '';
        const from = y, o0 = Number(focusEl.style.opacity || 1);
        focusEl.style.translate = ''; focusEl.style.opacity = '';
        if (!moving() || Math.abs(from) < 0.5) return;
        spring(focusEl, p => ({ translate: '0 ' + (from * (1 - p)).toFixed(2) + 'px', opacity: (o0 + (1 - o0) * clamp(p, 0, 1)).toFixed(3) }), { cfg: SPRING.snap, v0: (vy || 0) * 1000 / -from, id: 'mo-focus' });
      }
    };
    return g;
  }

  /* ---------- aviso (banner): deslizar hacia arriba para descartar ---------- */
  function bannerGesture() {
    let y = 0;
    const g = {
      axis: 'y', dir: -1,
      start() { stop(bannerEl); },
      move(dx, dy) { y = dy <= 0 ? dy : rubber(dy, 18); bannerEl.style.translate = '0 ' + y.toFixed(1) + 'px'; },
      end(vx, vy) {
        if (y < -24 || vy < -0.3) {
          haptic('tick');
          bannerEl.classList.remove('show');
          setTimeout(() => { if (!bannerEl.classList.contains('show')) bannerEl.style.translate = ''; }, 620);
          return;
        }
        g.cancel(vx, vy);
      },
      cancel(vx, vy) {
        const from = y; bannerEl.style.translate = '';
        if (!moving() || Math.abs(from) < 0.5) return;
        spring(bannerEl, p => ({ translate: '0 ' + (from * (1 - p)).toFixed(2) + 'px' }), { cfg: SPRING.snap, v0: (vy || 0) * 1000 / -from, id: 'mo-banner' });
      }
    };
    return g;
  }

  /* ---------- medalla: la moneda gira en 3D al arrastrarla ---------- */
  function coinGesture(badge) {
    const coin = $('.md-coin', badge);
    let a0 = 0, a = 0, half = 0;
    return {
      axis: 'x', dir: 0,
      start() { a0 = coin ? curAngle(coin) : 0; a = a0; half = Math.round(a / 180); if (coin) stop(coin, 'mo-coin'); },
      move(dx) {
        if (!coin) return;
        a = a0 + dx * 0.9;
        coin.style.rotate = 'y ' + a.toFixed(1) + 'deg';
        const h = Math.round(a / 180); if (h !== half) { half = h; haptic('tick'); }
      },
      end(vx) { if (coin) settleCoin(coin, a, vx * 0.9); },
      cancel() { if (coin) settleCoin(coin, a, 0); }
    };
  }
  function settleCoin(coin, a, v) {   /* v en grados por ms */
    let target = Math.round(a / 360) * 360;
    if (Math.abs(v) > 0.5) target = (v > 0 ? Math.ceil((a + 1) / 360) : Math.floor((a - 1) / 360)) * 360 + (Math.abs(v) > 1.8 ? Math.sign(v) * 360 : 0);
    stop(coin, 'mo-coin');
    coin.style.rotate = '';
    if (!moving() || Math.abs(target - a) < 0.5) return;
    const d = target - a;
    spring(coin, p => ({ rotate: 'y ' + (a + d * p).toFixed(2) + 'deg' }), { cfg: SPRING.soft, v0: v * 1000 / d, id: 'mo-coin' });
  }

  /* =========================================================================
     16. OBSERVADORES: hojas, vistas apiladas, enfoque, medalla, contadores
     ========================================================================= */
  /* hoja inferior: abrir (asentarse + aparición), reemplazar, cerrar */
  let sheetShown = !!(sheetWrap && !sheetWrap.hidden);
  function onSheetOpen() {
    if (moving()) sheetEl.animate([{ translate: '0 0' }, { translate: '0 0', offset: 0.6 }, { translate: '0 -5px', offset: 0.8 }, { translate: '0 0' }], { duration: 560, easing: 'ease-out', id: 'mo-sheet-in' });
    stagger(sheetBody, { sheet: true, delay: 90, step: 22, max: 14 });
    rollIn(sheetBody, true);
  }
  function onSheetReplace() {
    const r = sheetBody.firstElementChild;
    if (r && moving()) r.animate([{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }], { duration: 280, easing: EASE.out, id: 'mo-in' });
    stagger(sheetBody, { sheet: true, delay: 60, step: 22, max: 14 });
  }
  function onSheetClose() {
    fabClosed();
    if (!G || !G.owner) { stop(sheetEl, 'mo-sheet'); sheetEl.style.translate = ''; if (backdrop) backdrop.style.filter = ''; }
  }
  if (sheetWrap && sheetBody) {
    new MutationObserver(recs => {
      const shown = !sheetWrap.hidden;
      const replaced = recs.some(r => r.type === 'childList' && r.target === sheetBody && r.addedNodes.length);
      if (shown && !sheetShown) onSheetOpen();
      else if (!shown && sheetShown) onSheetClose();
      else if (shown && replaced) onSheetReplace();
      sheetShown = shown;
    }).observe(sheetWrap, { attributes: true, attributeFilter: ['hidden'], childList: true, subtree: true });
  }
  /* vistas apiladas: aparición escalonada al entrar; limpiar al salir */
  ['ficha', 'plan', 'mod'].forEach(n => {
    const v = $('#v-' + n); if (!v) return;
    let was = !v.hidden;
    new MutationObserver(() => {
      const s = !v.hidden;
      if (s && !was) stagger($('.scr', v), { delay: 80 });
      if (!s && was && !(G && G.owner)) { stop(v, 'mo-back'); v.style.translate = ''; v.classList.remove('mo-swiping'); }
      was = s;
    }).observe(v, { attributes: true, attributeFilter: ['hidden'] });
  });
  /* enfoque y medalla: dejar todo en su lugar al cerrarse */
  if (focusEl) new MutationObserver(() => { if (focusEl.hidden) { stop(focusEl, 'mo-focus'); focusEl.style.translate = ''; focusEl.style.opacity = ''; } }).observe(focusEl, { attributes: true, attributeFilter: ['hidden'] });
  if (medalEl) new MutationObserver(() => {
    if (medalEl.hidden) return;
    const b = $('.md-badge', medalEl); if (b) b.style.rotate = '';
    if (tilt.gyro) tiltKick();
  }).observe(medalEl, { attributes: true, attributeFilter: ['hidden'] });
  /* Mi camino: si un número cambia con la vista abierta, rueda */
  const camino = $('#camino');
  if (camino) new MutationObserver(() => rollIn(camino, false)).observe(camino, { childList: true });
  /* barra: indicador sigue a aria-current (sea por toque, por deslizar o por go()) */
  if (tabbar) {
    new MutationObserver(recs => {
      const on = recs.map(r => r.target).find(t => t.getAttribute && t.getAttribute('aria-current') === 'page');
      if (!recs.length) return;
      placeInd(true);
      if (on && fx('indicator')) bounceIcon(on);
    }).observe(tabbar, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
    if (window.ResizeObserver) new ResizeObserver(() => placeInd(false)).observe(tabbar);
  }
  /* movimiento reducido: el núcleo pone/quita .rm en <html> */
  new MutationObserver(() => sync()).observe(HTML, { attributes: true, attributeFilter: ['class'] });
  L.on('reset', () => { rolled.clear(); fabOpen = false; const i = fabIcon(); if (i) { stop(i); } });

  /* =========================================================================
     17. API PÚBLICA E INICIO
     ========================================================================= */
  function cleanupAll() {
    [sheetEl, focusEl, bannerEl].concat($$('.view')).forEach(el => { if (!el) return; stop(el); el.style.translate = ''; el.style.opacity = ''; el.classList.remove('mo-swiping'); });
    if (backdrop) backdrop.style.filter = '';
    holdCancel(); tiltReset();
    delete HTML.dataset.moNav;
  }
  const API = {
    version: 1,
    DUR, EASE, SPRING, HAPTIC, GESTURE, flags: FLAGS,
    get enabled() { return !killed; },
    set(name, value) { if (name in FLAGS) { FLAGS[name] = !!value; sync(); if (!value) cleanupAll(); } return API; },
    off(persist) { killed = true; if (persist) { try { localStorage.setItem('lampara-motion', 'off'); } catch (e) { /* nada */ } } cleanupAll(); sync(); return API; },
    on(persist) { killed = false; if (persist) { try { localStorage.removeItem('lampara-motion'); } catch (e) { /* nada */ } } sync(); return API; },
    haptic, spring, stagger, roll: rollIn, glow: glowAt
  };
  window.LamparaMotion = API;

  sync();
  placeInd(false);
  if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission !== 'function') enableGyro();
  /* la entrada de Hoy la hace el núcleo (heroIntro); aquí no se duplica */
})();
