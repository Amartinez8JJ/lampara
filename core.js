/* Lámpara v4 · núcleo
   Ionic 8 (modo iOS) hace la navegación, las hojas y los gestos; acá vive el estado y las ayudas comunes. */
(() => {
  /* ================= fechas ================= */
  const mid = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const dk = d => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  const fromDk = s => { const p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
  const same = (a, b) => dk(a) === dk(b);
  const diffDays = (a, b) => Math.round((mid(a) - mid(b)) / 864e5);
  const DN = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const DS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const DL = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const MN = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const MS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const WEEK = [1, 2, 3, 4, 5, 6, 0];                     /* la semana empieza el lunes */
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const short = d => d.getDate() + ' ' + MS[d.getMonth()];
  const longDate = d => cap(DN[d.getDay()]) + ' ' + d.getDate() + ' de ' + MN[d.getMonth()];
  const weekStart = d => addDays(mid(d), -((d.getDay() + 6) % 7));
  const weekDates = d => WEEK.map((_, i) => addDays(weekStart(d), i));
  const mins = h => { const m = /(\d{1,2}):(\d{2})/.exec(h || ''); return m ? +m[1] * 60 + +m[2] : 1440; };
  const nowHM = () => { const n = new Date(); return String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0'); };
  function rel(n) {                                       /* n = días respecto de hoy */
    if (n === 0) return 'hoy';
    if (n === -1) return 'ayer';
    if (n > -7 && n < 0) return 'hace ' + -n + ' días';
    return short(addDays(today(), n));
  }
  const ago = m => m < 60 ? 'hace ' + Math.max(1, m) + ' min' : m < 1440 ? 'hace ' + Math.round(m / 60) + ' h' : 'hace ' + Math.round(m / 1440) + ' d';

  /* ================= ayudas de HTML ================= */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /* íconos incrustados (icons.js): aparecen al instante y no parpadean al redibujar */
  const ic = (n, cls) => window.ICONS && ICONS[n]
    ? '<svg class="ico' + (cls ? ' ' + cls : '') + '" viewBox="' + (window.ICONS_VB || '0 0 512 512') + '" aria-hidden="true">' + ICONS[n] + '</svg>'
    : '<ion-icon name="' + n + '"' + (cls ? ' class="' + cls + '"' : '') + ' aria-hidden="true"></ion-icon>';
  const actIc = (a, filled) => ic(D.ICON[a] + (filled ? '' : '-outline'));
  const hueOf = id => { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  const ini = name => name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  /* avatares de color pleno: cada persona toma un color de la paleta */
  const AVC = ['palabra', 'oracion', 'diario', 'meditar', 'mensaje', 'adoracion', 'encuentro', 'ayuno'];
  const avColor = id => 'var(--' + AVC[hueOf(id) % AVC.length] + ')';
  function av(id, name, size, cls) {
    const s = size || 40;
    return '<span class="av ' + (cls || '') + '" style="--s:' + s + 'px;--avc:' + avColor(id) + '"><b>' + esc(ini(name || id)) + '</b></span>';
  }
  let fid = 0;
  const flameSVG = cls => { const g = 'fg' + (++fid);
    return '<svg class="' + (cls || 'flm') + '" viewBox="0 0 24 32" aria-hidden="true"><defs><radialGradient id="' + g + '" cx="50%" cy="75%" r="70%"><stop offset="0" stop-color="#fff4c8"/><stop offset=".42" stop-color="#ffc35a"/><stop offset="1" stop-color="#ff6f2a"/></radialGradient></defs>' +
      '<path fill="url(#' + g + ')" d="M12 1c1.5 5 8 8.5 8 17.5C20 25.5 16.5 31 12 31c-4.8 0-8-4-8-9 0-4.5 2.5-7 4-9.5.6 2.5 1.6 3.9 3 4.3C10 11 11.5 5 12 1Z"/>' +
      '<path fill="#fff6d2" opacity=".9" d="M12 30c-2.4 0-4-2-4-4.5 0-2.5 2-4 3-6.5 1 2 4.8 3.5 4.8 6.6 0 2.6-1.6 4.4-3.8 4.4Z"/></svg>'; };

  /* ================= estado ================= */
  const KEY = 'lampara-v5';
  const clone = o => JSON.parse(JSON.stringify(o));
  /* cómo vino cada discípulo los últimos 14 días (L encendido, G gracia, E pábilo) */
  const DPAST = { MA: 'LLGLLLLLLGLLLL', DV: 'LELLLLGLLELLLL', SR: 'LGEELGLLEEGLLE', LO: 'LLLLLLLLLLLLLL' };
  const DTODAY = { MA: 2, DV: 1, SR: 0, LO: 2 };
  function fresh() {
    const t0 = mid(new Date());
    const hist = {};
    for (let i = 1; i <= 120; i++) hist[dk(addDays(t0, -i))] = i % 11 === 5 ? 'grace' : i % 23 === 9 ? 'ember' : 'lit';
    const people = clone(D.PEOPLE).map(p => {
      p.hist = {}; [...DPAST[p.id]].forEach((c, i) => { p.hist[dk(addDays(t0, -(i + 1)))] = c === 'L' ? 'lit' : c === 'G' ? 'grace' : 'ember'; });
      p.dToday = DTODAY[p.id];
      const l = D.LAST[p.id]; p.last = l ? { d: dk(addDays(t0, l.w)), notes: l.notes, agree: l.agree.slice() } : null;
      return p;
    });
    return {
      v: 5, real: dk(t0), base: dk(t0), off: 0,
      done: {}, skip: {}, kept: {},
      routine: clone(D.ROUTINE),
      plans: D.PLANS.map(p => Object.assign(clone(p), { start: dk(p.start === 'year' ? new Date(t0.getFullYear(), 0, 1) : addDays(t0, p.start)) })),
      invites: clone(D.INVITES),
      people, myShare: 2, asked: {},
      log: [],
      pets: D.PETS.map(p => Object.assign(clone(p), { since: dk(addDays(t0, p.since)), check: p.check ? dk(addDays(t0, p.check)) : null, updates: [] })), answered: D.ANSWERED.map(a => Object.assign(clone(a), { d: dk(addDays(t0, a.w)) })), nextPet: 7, prayedToday: {},
      keeps: D.KEEPS.map(k => Object.assign(clone(k), { d: dk(addDays(t0, k.w)) })),
      memo: clone(D.MEMO), read: clone(D.READ),
      hist, earned: {},
      stats: { prayOthers: 64, paper: 0, diary: 21, weeksLit: 38 },
      posts: clone(D.POSTS), rx: {}, praying: {}, going: {},
      fam: { nights: { [dk(addDays(t0, -2))]: 1, [dk(addDays(t0, -4))]: 1 }, mesa: 0, q: 0, ans: {} },
      seen: {}, reviews: {}, focus: null, agreeOk: {}, asked2: {}
    };
  }
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  if (!S || S.v !== 5 || S.real !== dk(new Date())) S = fresh();      /* prototipo: cada día real arranca limpio */
  let saveT = 0;
  const save = () => { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }, 120); };
  const today = () => addDays(fromDk(S.base), S.off);
  const tk = () => dk(today());

  /* ================= lo del día ================= */
  const planDay = (p, d) => diffDays(d, fromDk(p.start)) + 1;
  function itemsFor(d) {
    const w = d.getDay(), k = dk(d), out = [];
    S.routine.forEach(r => {
      if (r.once ? r.once === k : r.days.includes(w)) out.push({ id: r.id, a: r.a, t: r.t, h: r.h, n: r.n, with: r.with, src: 'r' });
    });
    S.plans.forEach(p => {
      if (p.paused) return;
      const day = planDay(p, d);
      if (day < 1 || day > p.len || (p.days && !p.days.includes(w))) return;
      p.acts.forEach((a, i) => out.push({ id: 'p:' + p.id + ':' + a, a, t: p.seq === 'propio' ? p.name + ' · día ' + day : D.SEQ[p.seq](a, day), h: p.time, plan: p.id, planName: p.name, day, len: p.len, src: 'p', ord: i }));
    });
    return out.sort((x, y) => mins(x.h) - mins(y.h) || (x.ord || 0) - (y.ord || 0));
  }
  const todayItems = () => itemsFor(today()).filter(it => !(S.skip[tk()] || []).includes(it.id));
  const isDone = id => !!(S.done[tk()] && S.done[tk()][id]);
  const doneCount = () => todayItems().filter(it => isDone(it.id)).length;
  const litToday = () => doneCount() > 0 || Object.keys(S.done[tk()] || {}).length > 0;
  const allDone = () => { const its = todayItems(); return its.length > 0 && its.every(it => isDone(it.id)); };
  function dayStatus(d) {
    const n = diffDays(d, today());
    if (n === 0) return litToday() ? 'lit' : 'today';
    if (n > 0) return 'future';
    const k = dk(d);
    if (S.done[k] && Object.keys(S.done[k]).length) return 'lit';
    return S.hist[k] || 'ember';
  }
  const GOAL = 5;
  const weekLit = () => weekDates(today()).filter(d => ['lit', 'grace'].includes(dayStatus(d))).length;

  function setDone(id, on, o) {
    o = o || {};
    const k = tk(), wasLit = litToday(), wasAll = allDone(), wk0 = weekLit();
    S.done[k] = S.done[k] || {};
    if (on) S.done[k][id] = o.at || nowHM(); else delete S.done[k][id];
    emit(on ? 'itemDone' : 'itemUndone', id);
    if (on && o.paper) S.stats.paper++;
    save(); refresh();
    if (!on) return;
    haptic(12);
    if (!wasLit && litToday() && !o.quiet) {
      emit('lit');
      toast('Encendiste tu día · ' + weekLit() + ' de ' + GOAL + ' esta semana', { icon: 'flame' });
    }
    if (!wasAll && allDone() && !o.quiet) setTimeout(celebrate, 380);
    const wkKey = dk(weekStart(today()));
    S.summit = S.summit || {};
    if (wk0 < GOAL && weekLit() >= GOAL && !S.summit[wkKey]) { S.summit[wkKey] = 1; save(); setTimeout(summitWhenFree, 1200); }
    checkAch();
  }
  function skipToday(id, on) {
    const k = tk(); S.skip[k] = S.skip[k] || [];
    if (on) S.skip[k].push(id); else S.skip[k] = S.skip[k].filter(x => x !== id);
    save(); refresh();
  }

  /* discípulos: lo que tienen planeado y cómo vienen (cada uno decide qué se ve) */
  const person = id => S.people.find(p => p.id === id);
  const discItems = (p, d) => D.DWEEK[p.id] ? D.DWEEK[p.id](d.getDay()) : [];
  function discDone(p, d) {
    const its = discItems(p, d), n = diffDays(d, today());
    if (n === 0) return its.map((_, i) => i < p.dToday);
    if (n > 0) return its.map(() => false);
    const st = p.hist[dk(d)];
    return its.map((_, i) => st === 'lit' && (i < its.length - 1 || d.getDate() % 2 === 0));
  }
  function discStatus(p, d) {
    const n = diffDays(d, today());
    if (n === 0) return p.dToday > 0 ? 'lit' : 'today';
    if (n > 0) return 'future';
    return p.hist[dk(d)] || 'ember';
  }

  /* ================= logros ================= */
  function achProg(a) {
    if (!a.goal) return [1, 1];
    const v = { weeksLit: S.stats.weeksLit, prayOthers: S.stats.prayOthers, answered: S.answered.length, memo: S.memo.filter(m => m.lvl >= 3).length, paper: S.stats.paper, diary: S.stats.diary }[a.key];
    return [Math.min(v, a.goal), a.goal];
  }
  const achEarned = a => !!(a.w || S.earned[a.id]) || (a.goal && achProg(a)[0] >= a.goal);
  /* los logros que ya estaban cumplidos al empezar no se celebran de nuevo */
  D.ACH.forEach(a => { if (a.goal && !a.w && !S.earned[a.id] && achProg(a)[0] >= a.goal) S.earned[a.id] = 'antes'; });
  const medalQ = [];
  function checkAch() {
    D.ACH.forEach(a => {
      if (a.w || S.earned[a.id] || !a.goal) return;
      const [v, g] = achProg(a);
      if (v >= g) { S.earned[a.id] = short(today()); save(); medalQ.push(a); }
    });
    if (medalQ.length) setTimeout(drainMedals, 900);
  }
  /* una celebración por vez: espera a que no haya nada abierto */
  function drainMedals() {
    if (!medalQ.length) return;
    if (document.querySelector('ion-modal, ion-action-sheet, ion-alert')) { setTimeout(drainMedals, 700); return; }
    medal(medalQ.shift());
  }
  function medal(a) {
    sheet('<div class="medal" data-a="' + (a.a || '') + '"><div class="coin' + (a.a ? '' : ' fl') + '">' + ic(a.i) + '</div><p class="eyebrow">Nuevo logro</p><h2>' + esc(a.t) + '</h2><p class="muted">' + esc(a.d) + '</p>' +
      '<button class="btn" data-close>Amén</button></div>', { cls: 'medal-sheet', onClose: () => setTimeout(drainMedals, 400), mount: (el, m) => { el.querySelector('[data-close]').onclick = () => m.dismiss(); setTimeout(() => sparks(el.querySelector('.coin'), 18), 350); } });
    haptic([10, 40, 18]);
  }

  /* ================= eventos y repintado ================= */
  const BUS = {};
  const on = (ev, fn) => { (BUS[ev] = BUS[ev] || []).push(fn); };
  const emit = (ev, x) => (BUS[ev] || []).forEach(fn => { try { fn(x); } catch (e) { console.error(e); } });
  const PAGES = new Set();
  function refresh() { PAGES.forEach(p => { if (p.isConnected) p.update(); else PAGES.delete(p); }); emit('refresh'); }

  /* ================= páginas (custom elements que Ionic navega) ================= */
  class Page extends HTMLElement {
    connectedCallback() {
      if (this._on) return;
      this._on = true;
      this.innerHTML = this.shell();
      this.pg = this.querySelector('.pg');
      this.addEventListener('click', e => this.onClick && this.onClick(e));
      this.mount && this.mount();
      this.update();
      PAGES.add(this);
    }
    update() { if (!this.pg) return; this.pg.innerHTML = this.render(); this.after && this.after(); }
    push(tag, props) { const nav = this.closest('ion-nav'); return nav && nav.push(tag, props); }
    pop() { const nav = this.closest('ion-nav'); return nav && nav.pop(); }
  }
  /* cabecera iOS: título grande que se achica al bajar */
  function shell(o) {
    const end = o.end ? '<ion-buttons slot="end">' + o.end + '</ion-buttons>' : '';
    const start = o.back !== undefined ? '<ion-buttons slot="start"><ion-back-button text="' + esc(o.back) + '" default-href="#"></ion-back-button></ion-buttons>' : (o.start ? '<ion-buttons slot="start">' + o.start + '</ion-buttons>' : '');
    const large = o.large !== false;
    return '<ion-header translucent="true"><ion-toolbar>' + start + '<ion-title>' + esc(o.title) + '</ion-title>' + end + '</ion-toolbar></ion-header>' +
      '<ion-content fullscreen="true">' + (large ? '<ion-header collapse="condense"><ion-toolbar><ion-title size="large">' + esc(o.title) + '</ion-title></ion-toolbar></ion-header>' : '') +
      (o.top || '') + '<div class="pg' + (o.cls ? ' ' + o.cls : '') + '"></div></ion-content>';
  }
  const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };

  /* ================= capas: hojas, tarjetas, avisos ================= */
  const app = () => document.querySelector('ion-app');
  /* Ionic devuelve el overlay a su lugar justo después de cerrarlo: lo sacamos un instante más tarde */
  const gone = el => setTimeout(() => el.remove(), 60);
  /* hoja que se arrastra; su altura inicial se ajusta al contenido */
  function sheet(html, o) {
    o = o || {};
    const meas = document.createElement('div');
    meas.className = 'sh-in sh-measure ' + (o.cls || '');
    meas.innerHTML = html;
    document.body.appendChild(meas);
    const hgt = meas.offsetHeight + 30;
    meas.remove();
    const f = Math.round(Math.min(0.93, Math.max(0.28, hgt / window.innerHeight)) * 100) / 100;
    const m = document.createElement('ion-modal');
    m.className = 'sheet ' + (o.cls || '');
    m.focusTrap = false;
    m.breakpoints = f < 0.9 ? [0, f, 0.93] : [0, 0.93];
    m.initialBreakpoint = f < 0.9 ? f : 0.93;
    m.handleBehavior = 'cycle';
    m.innerHTML = '<ion-content><div class="sh-in ' + (o.cls || '') + '">' + html + '</div></ion-content>';
    app().appendChild(m);
    m.addEventListener('didDismiss', () => { gone(m); o.onClose && o.onClose(); emit('sheet', false); });
    const el = m.querySelector('.sh-in');
    o.mount && o.mount(el, m);
    m.present();
    emit('sheet', true);
    return m;
  }
  /* tarjeta a pantalla casi completa (estilo iOS) con su propia navegación */
  function card(tag, props, o) {
    const m = document.createElement('ion-modal');
    m.className = 'card ' + ((o && o.cls) || '');
    m.focusTrap = false;
    m.presentingElement = document.querySelector('ion-tabs');
    const nav = document.createElement('ion-nav');
    m.appendChild(nav);
    app().appendChild(m);
    m.addEventListener('didDismiss', () => gone(m));
    /* Ionic mueve el contenido al abrir; la página se carga después de ese movimiento y antes de la animación,
       así existe cuando Ionic busca su contenido para el gesto de cerrar */
    m.addEventListener('ionModalWillPresent', () => { const n = m.querySelector('ion-nav'); n.rootParams = props || {}; n.root = tag; }, { once: true });
    m.present();
    return m;
  }
  /* pantalla completa (el modo «Empezar», la celebración) */
  function full(build, o) {
    const m = document.createElement('ion-modal');
    m.className = 'full ' + ((o && o.cls) || '');
    m.focusTrap = false;
    m.innerHTML = '<div class="full-in"></div>';
    app().appendChild(m);
    m.addEventListener('didDismiss', () => { gone(m); o && o.onClose && o.onClose(); });
    build(m.querySelector('.full-in'), m);
    m.present();
    return m;
  }
  function toast(msg, o) {
    o = o || {};
    const t = document.createElement('ion-toast');
    t.message = msg; t.duration = o.undo ? 4200 : 2300; t.cssClass = 'tst';
    /* con una pantalla completa o tarjeta abierta, el aviso va arriba para no tapar su botón */
    if (document.querySelector('ion-modal.full, ion-modal.card')) t.position = 'top';
    else { t.position = 'bottom'; if (document.getElementById('tabbar') && !document.querySelector('ion-tabs.notabs')) t.positionAnchor = 'tabbar'; }
    if (o.icon) t.icon = o.icon;
    if (o.undo) t.buttons = [{ text: 'Deshacer', handler: o.undo }];
    app().appendChild(t);
    t.addEventListener('didDismiss', () => gone(t));
    document.querySelectorAll('ion-toast').forEach(x => { if (x !== t) x.dismiss(); });
    t.present();
  }
  function actions(header, buttons, sub) {
    const a = document.createElement('ion-action-sheet');
    a.header = header; if (sub) a.subHeader = sub;
    a.buttons = buttons.concat([{ text: 'Cancelar', role: 'cancel' }]);
    app().appendChild(a);
    a.addEventListener('didDismiss', () => gone(a));
    a.present();
  }
  function prompt(header, o, done) {
    const a = document.createElement('ion-alert');
    a.header = header; if (o.msg) a.message = o.msg;
    a.inputs = [{ name: 'v', type: o.type || 'text', placeholder: o.ph || '', value: o.value || '' }];
    a.buttons = [{ text: 'Cancelar', role: 'cancel' }, { text: o.ok || 'Guardar', handler: v => { const s = (v.v || '').trim(); if (s) done(s); } }];
    app().appendChild(a);
    a.addEventListener('didDismiss', () => gone(a));
    a.present();
  }
  const haptic = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
  const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* chispas que salen de un elemento (solo transform/opacity) */
  function sparks(el, n) {
    if (!el || RM()) return;
    const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let i = 0; i < (n || 14); i++) {
      const s = document.createElement('i');
      s.className = 'spark';
      s.style.left = cx + 'px'; s.style.top = cy + 'px';
      document.body.appendChild(s);
      const ang = Math.random() * Math.PI * 2, dist = 30 + Math.random() * 50;
      s.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + Math.cos(ang) * dist + 'px), calc(-50% + ' + Math.sin(ang) * dist + 'px)) scale(.2)', opacity: 0 }],
        { duration: 520 + Math.random() * 320, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => s.remove();
    }
  }

  /* ================= interacción ================= */
  /* mantener presionado (sin moverse) → fn(el); el click que sigue se ignora */
  function press(root, sel, fn) {
    let t = 0, x = 0, y = 0, el = null, fired = false;
    root.addEventListener('pointerdown', e => {
      fired = false;
      el = e.target.closest(sel); if (!el || e.target.closest('[data-chk], button.chk')) { el = null; return; }
      x = e.clientX; y = e.clientY; fired = false;
      clearTimeout(t); t = setTimeout(() => { fired = true; haptic(14); fn(el); }, 430);
    });
    const cancel = () => clearTimeout(t);
    root.addEventListener('pointermove', e => { if (el && Math.hypot(e.clientX - x, e.clientY - y) > 8) cancel(); });
    root.addEventListener('pointerup', cancel); root.addEventListener('pointercancel', cancel);
    root.addEventListener('click', e => { if (fired) { e.stopPropagation(); e.preventDefault(); fired = false; } }, true);
    root.addEventListener('contextmenu', e => { if (e.target.closest(sel)) e.preventDefault(); });
  }
  /* menú contextual estilo iOS: la tarjeta se levanta, el fondo se desenfoca y aparecen las acciones */
  function context(fromEl, previewHTML, items, dataA) {
    const r = fromEl.getBoundingClientRect(), host = app(), hr = host.getBoundingClientRect();
    const box = document.createElement('div');
    box.className = 'ctx';
    box.innerHTML = '<div class="ctx-bg"></div><div class="ctx-card"' + (dataA ? ' data-a="' + dataA + '"' : '') + '>' + previewHTML + '</div><div class="ctx-menu">' +
      items.map((it, i) => '<button data-i="' + i + '" class="' + (it.danger ? 'danger' : '') + '">' + esc(it.text) + (it.icon ? ic(it.icon) : '') + '</button>').join('') + '</div>';
    host.appendChild(box);
    const card = box.querySelector('.ctx-card'), menu = box.querySelector('.ctx-menu');
    const top = Math.min(Math.max(r.top - hr.top, 70), hr.height - card.offsetHeight - menu.offsetHeight - 40);
    card.style.top = top + 'px'; menu.style.top = (top + card.offsetHeight + 10) + 'px';
    const close = () => { box.classList.add('out'); setTimeout(() => box.remove(), 220); };
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-i]');
      if (b) { close(); setTimeout(() => items[+b.dataset.i].handler(), 120); return; }
      if (!e.target.closest('.ctx-card')) close();
    });
    requestAnimationFrame(() => box.classList.add('in'));
  }
  /* aparición escalonada (solo transform/opacity) */
  function stagger(root, sel) {
    if (!root || RM()) return;
    [...root.querySelectorAll(sel || ':scope > *')].slice(0, 12).forEach((el, i) =>
      el.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: i * 35, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }));
  }
  /* cambio de sección con dirección */
  function slide(root, dir) {
    if (!root || RM() || !dir) return;
    root.animate([{ opacity: 0, transform: 'translateX(' + (dir * 28) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 340, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
  /* tarjetas de contexto para Hoy: aparece solo la más importante */
  const CTX = [];
  const ctxCard = c => CTX.push(c);
  function topCtx() { let best = null, bp = 0; CTX.forEach(c => { const p = c.pri(); if (p > bp) { bp = p; best = c; } }); return best; }

  /* ================= celebración: una sola grande, cuando completas el día ================= */
  function celebrate() {
    if (document.querySelector('ion-modal.celeb')) return;
    const v = D.VERSES[0];
    full((el, m) => {
      const wk = weekDates(today()).map(d => { const st = dayStatus(d), isT = same(d, today()); return '<span class="cw ' + st + (isT ? ' now' : '') + '"><i></i>' + DL[d.getDay()] + '</span>'; }).join('');
      el.innerHTML = '<div class="celeb-in"><span class="lampa">' + ic('lampara') + '</span>' +
        '<h1>Tu lámpara<br>está encendida</h1><p class="cv">«' + esc(v.t) + '»<small>' + esc(v.r) + '</small></p>' +
        '<div class="cweek">' + wk + '</div><p class="wk-note">' + weekLit() + ' de ' + GOAL + ' días esta semana</p>' +
        '<button class="btn big" data-close>Amén</button></div>';
      el.querySelector('[data-close]').onclick = () => m.dismiss();
      haptic([12, 60, 20, 60, 30]);
    }, { cls: 'celeb' });
  }

  /* la meta de la semana (5 de 7): una celebración propia, cuando no hay nada abierto */
  function summitWhenFree() {
    if (document.querySelector('ion-modal, ion-action-sheet, ion-alert')) { setTimeout(summitWhenFree, 700); return; }
    full((el, m) => {
      const wk = weekDates(today()).map(d => { const st = dayStatus(d); return '<span class="cw ' + st + '"><i></i>' + DL[d.getDay()] + '</span>'; }).join('');
      el.innerHTML = '<div class="celeb-in"><span class="lampa">' + ic('flame') + '</span><h1>Semana<br>encendida</h1><p class="cv">Llegaste a ' + GOAL + ' de 7 días. «La senda de los justos es como la luz de la aurora, que va en aumento.»<small>Proverbios 4:18</small></p>' +
        '<div class="cweek">' + wk + '</div><p class="wk-note">' + (S.stats.weeksLit + 1) + ' semanas encendidas este año</p><button class="btn big" data-close>Amén</button></div>';
      el.querySelector('[data-close]').onclick = () => m.dismiss();
      haptic([12, 60, 20, 60, 30]);
    }, { cls: 'celeb' });
  }

  /* ================= demo: pasar al día siguiente ================= */
  function nextDay() {
    const t = today(), k = dk(t);
    const weekHadGrace = weekDates(t).some(d => diffDays(d, t) < 0 && dayStatus(d) === 'grace');
    S.hist[k] = litToday() ? 'lit' : (weekHadGrace ? 'ember' : 'grace');
    S.people.forEach((p, i) => {
      p.hist[k] = p.dToday > 0 ? 'lit' : (Object.values(p.hist).slice(-6).includes('grace') ? 'ember' : 'grace');
      const n = discItems(p, addDays(t, 1)).length;
      p.dToday = Math.min(n, (S.off + i) % 4 === 3 ? 0 : 1);
    });
    if (t.getDay() === 0 && weekLit() >= GOAL) S.stats.weeksLit++;
    S.off++;
    S.prayedToday = {};
    save(); emit('nextDay', today()); refresh();
    toast(longDate(today()), { icon: 'sunny' });
  }
  function reset() { S = fresh(); try { localStorage.removeItem(KEY); } catch (e) {} emit('reset'); refresh(); toast('Demo reiniciada'); }

  /* ================= pestañas ================= */
  let curTab = 'hoy';
  function initTabs() {
    const tabs = document.querySelector('ion-tabs');
    if (!tabs) return;
    document.querySelectorAll('ion-tab-button [data-tbi]').forEach(s => { const n = s.dataset.tbi; s.innerHTML = ic(n + '-outline', 'off') + ic(n, 'on'); });
    tabs.addEventListener('ionTabsDidChange', e => {
      curTab = e.detail.tab; emit('tab', curTab);
      const s = document.querySelector('ion-tab-button[tab="' + curTab + '"] [data-tbi]');
      if (s && !RM()) s.animate([{ transform: 'scale(.8)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    });
    /* tocar la pestaña en la que ya estás: vuelve al inicio, como en iOS */
    document.addEventListener('ionTabButtonClick', e => {
      if (e.detail.tab !== curTab) return;
      const nav = document.getElementById('nav-' + curTab);
      if (!nav) return;
      nav.canGoBack().then(b => {
        if (b) nav.popToRoot();
        else { const c = nav.querySelector('ion-content'); c && c.scrollToTop(300); }
      });
    });
  }
  const go = tab => document.querySelector('ion-tabs').select(tab);
  const tab = () => curTab;
  function setBadge(id, onOff) { const b = document.getElementById('badge-' + id); if (b) b.hidden = !onOff; }

  window.L = {
    /* fechas */ mid, addDays, dk, fromDk, same, diffDays, DN, DS, DL, MN, MS, WEEK, cap, short, longDate, weekStart, weekDates, mins, nowHM, rel, ago,
    /* html */ esc, ic, actIc, av, avColor, ini, hueOf, flameSVG,
    /* tema: automático según el celular, o fijo */ theme: { get: () => (window.LamparaTema ? LamparaTema.get() : 'auto'), set: v => { window.LamparaTema && LamparaTema.set(v); refresh(); } },
    /* estado */ get S() { return S; }, save, today, tk, clone,
    /* día */ itemsFor, todayItems, isDone, doneCount, litToday, allDone, dayStatus, weekLit, GOAL, setDone, skipToday, planDay,
    /* personas */ person, discItems, discDone, discStatus,
    /* logros */ achProg, achEarned, checkAch, medal,
    /* módulos de Personas (familia.js, iglesia.js) */ pseg: {},
    /* ui */ press, context, stagger, slide, ctxCard, topCtx, Page, shell, define, refresh, on, emit, sheet, card, full, toast, actions, prompt, haptic, sparks, RM, celebrate, go, tab, setBadge,
    /* demo */ nextDay, reset
  };
  document.addEventListener('DOMContentLoaded', initTabs);
  if (document.readyState !== 'loading') initTabs();
})();
