/* Lights · Hábitos por nivel
   Las rutinas crean hábitos. Cada tipo de práctica (Palabra, Oración, Meditar…) es un hábito con cuatro niveles
   según cuántos días por semana la haces: Semilla (1), Raíz (3), Rama (5) y Fruto (todos los días).
   - Sube: si dos semanas seguidas llegas a la meta de un nivel más alto (sube a ese).
   - En riesgo: si una semana no llegas a la meta de tu nivel, o si lo que tienes programado no alcanza.
   - Lo pierdes: dos semanas seguidas sin llegar bajan un nivel.
   Referencias: Streaks (la meta por semana de cada hábito), Duolingo (las ligas que suben y bajan cada semana),
   Finch (lo que crece). Los nombres de los niveles vienen de Juan 15 (la vid y los pámpanos): sin respaldo de una app. */
(() => {
  const { esc, ic, actIc } = L;
  const LV = [
    { n: 'Sin hábito', t: 0 },
    { n: 'Semilla', t: 1, d: '1 vez por semana' },
    { n: 'Raíz', t: 3, d: '3 veces por semana' },
    { n: 'Rama', t: 5, d: '5 veces por semana' },
    { n: 'Fruto', t: 7, d: 'todos los días' }
  ];
  const DESC = { palabra: 'Leer la Biblia', oracion: 'Orar', meditar: 'Meditar', diario: 'Escribir tu diario', adoracion: 'Adorar', ayuno: 'Ayunar', encuentro: 'Encontrarte con alguien', mensaje: 'Escribir a tu gente' };

  /* un día cuenta para el hábito si hiciste esa práctica (o la anotaste con alguien) */
  const didOn = (a, d) => L.dayDone(d).some(i => i.a === a) || L.S.log.some(x => x.a === a && x.d === L.dk(d));
  const plannedOn = (a, d) => L.dayPlan(d).some(i => i.a === a);
  function weekCount(a, ws) {
    let c = 0;
    for (let i = 0; i < 7; i++) { const d = L.addDays(ws, i); if (L.diffDays(d, L.today()) > 0) break; if (didOn(a, d)) c++; }
    return c;
  }
  /* el hábito de una práctica: se recorre la historia semana por semana */
  function habit(a) {
    const t = L.today(), cur = L.weekStart(t), first = L.firstDay();
    let lv = 0, miss = 0, prev = 0; const hist = [];
    for (let ws = L.weekStart(first); L.diffDays(ws, cur) < 0; ws = L.addDays(ws, 7)) {
      if (L.diffDays(ws, first) < 0) continue;                 /* la primera semana a medias no cuenta */
      const c = weekCount(a, ws); let ev = null;
      const both = Math.min(prev, c);
      let target = 0; LV.forEach((x, k) => { if (k && both >= x.t) target = k; });
      if (target > lv) { lv = target; miss = 0; ev = 'up'; }
      else if (lv && c < LV[lv].t) { miss++; if (miss >= 2) { lv--; miss = 0; ev = 'down'; } }
      else miss = 0;
      hist.push({ ws, c, lv, ev }); prev = c;
    }
    const c = weekCount(a, cur);
    let left = 0, planned = 0;
    for (let i = 0; i < 7; i++) {
      const d = L.addDays(cur, i), n = L.diffDays(d, t);
      if (plannedOn(a, d)) { planned++; if (n > 0 || (n === 0 && !didOn(a, d))) left++; }
    }
    const need = LV[lv].t, nx = LV[lv + 1];
    let state = 'camino', msg = '';
    if (!lv && !c && !planned && !hist.some(h => h.c)) state = 'nunca';
    else if (lv && c >= need) { state = 'ok'; msg = 'Ya cumpliste tu ' + LV[lv].n + ' esta semana.'; }
    else if (lv && planned < need) { state = 'programa'; msg = 'Tu semana tiene ' + planned + (planned === 1 ? ' día' : ' días') + ' y ' + LV[lv].n + ' pide ' + need + '. Programa ' + (need - planned === 1 ? 'uno más' : (need - planned) + ' más') + ' o lo pierdes.'; }
    else if (lv && c + left < need) { state = 'programa'; msg = 'Con lo que queda programado no llegas a ' + need + '. Agrega un día más.'; }
    else if (lv && miss === 1) { state = 'riesgo'; msg = 'La semana pasada no llegaste. Si esta tampoco, baja a ' + LV[lv - 1].n + '.'; }
    else if (lv) msg = 'Te ' + (need - c === 1 ? 'falta 1 día' : 'faltan ' + (need - c) + ' días') + ' para cumplir ' + LV[lv].n + '.';
    else msg = c ? 'Repite la semana que viene y nace tu Semilla.' : 'Una vez esta semana y otra la que viene: nace tu Semilla.';
    /* ¿sube al cerrar esta semana? */
    let next = null;
    if (nx) { let k = lv; LV.forEach((x, j) => { if (j > lv && Math.min(prev, Math.max(c, 0)) >= x.t) k = j; }); next = { lv: lv + 1, n: nx.n, t: nx.t, ready: prev >= nx.t }; if (k > lv) next.now = k; }
    return { a, lv, name: LV[lv].n, c, left, planned, need, miss, state, msg, hist, prev, next };
  }
  const all = () => D.ACTS.map(habit).filter(h => h.state !== 'nunca').sort((x, y) => y.lv - x.lv || y.c - x.c);
  L.habits = all;
  L.habitLV = LV;

  const pips = (lv, c) => '<span class="hb-pips" data-a="' + c + '">' + [1, 2, 3, 4].map(k => '<i class="' + (k <= lv ? 'on' : '') + '"></i>').join('') + '</span>';
  L.habitPips = pips;
  /* los días de esta semana: hecho (lleno), programado (borde), nada */
  function weekDots(h) {
    const ws = L.weekStart(L.today());
    return '<span class="hb-week">' + [0, 1, 2, 3, 4, 5, 6].map(i => {
      const d = L.addDays(ws, i), n = L.diffDays(d, L.today());
      const cls = didOn(h.a, d) ? 'done' : plannedOn(h.a, d) ? (n < 0 ? 'miss' : 'plan') : '';
      return '<i class="' + cls + (n === 0 ? ' now' : '') + '"><b>' + L.DL[d.getDay()] + '</b></i>';
    }).join('') + '</span>';
  }

  class PageHabitos extends L.Page {
    shell() { return L.shell({ title: 'Hábitos', back: '', large: false }); }
    render() {
      const hs = all(), risk = hs.filter(h => h.state === 'programa' || h.state === 'riesgo');
      return '<div class="hb-intro"><div class="hb-ladder">' + LV.slice(1).map((x, k) => '<div><span class="hb-pips">' + [1, 2, 3, 4].map(j => '<i class="' + (j <= k + 1 ? 'on' : '') + '"></i>').join('') + '</span><b>' + x.n + '</b><small>' + x.d + '</small></div>').join('') + '</div>' +
        '<p>Sube cuando llegas dos semanas seguidas. Si una semana no llegas, queda <b>en riesgo</b>; si son dos, <b>baja un nivel</b>. Y si no lo programas, no se puede cumplir.</p></div>' +
        (risk.length ? '<div class="sec"><h2>Cuidar esta semana</h2><span class="muted">' + risk.length + '</span></div>' + risk.map(card).join('') : '') +
        '<div class="sec"><h2>Tus hábitos</h2><span class="muted">' + hs.filter(h => h.lv).length + ' con nivel</span></div>' + hs.filter(h => !risk.includes(h)).map(card).join('') +
        '<button class="btn ghost hb-prog" data-plan>' + ic('calendar') + 'Programar mi semana</button>';
    }
    after() { L.stagger && L.stagger(this.pg); }
    onClick(e) {
      const el = e.target.closest('[data-hb]');
      if (el) { sheet(el.dataset.hb); return; }
      if (e.target.closest('[data-plan]')) { L.go('planes'); }
    }
  }
  function card(h) {
    const st = { ok: ['checkmark-circle', 'Cumplido'], programa: ['calendar', 'Falta programar'], riesgo: ['information-circle', 'En riesgo'], camino: ['trending-up', h.lv ? 'En camino' : 'Naciendo'] }[h.state];
    return '<button class="hb-card st-' + h.state + '" data-a="' + h.a + '" data-hb="' + h.a + '"><span class="aic">' + actIc(h.a, true) + '</span><div class="hb-m"><div class="hb-t"><b>' + esc(D.NAME[h.a]) + '</b>' + pips(h.lv, h.a) + '<em>' + h.name + '</em></div>' +
      weekDots(h) + '<small>' + ic(st[0]) + esc(h.msg) + '</small></div></button>';
  }
  L.define('page-habitos', PageHabitos);

  /* el detalle: la escalera, las últimas semanas y qué hacer */
  function sheet(a) {
    const h = habit(a), last = h.hist.slice(-8);
    const max = 7;
    L.sheet('<div data-a="' + a + '"><div class="sh-head"><div class="aic">' + actIc(a, true) + '</div><div><h2>' + esc(DESC[a] || D.NAME[a]) + '</h2><p>' + h.name + (h.lv ? ' · ' + LV[h.lv].d : '') + '</p></div></div>' +
      '<div class="hb-steps">' + LV.slice(1).map((x, k) => '<div class="' + (k + 1 <= h.lv ? 'got' : '') + (k + 1 === h.lv ? ' cur' : '') + '"><i>' + (k + 1 <= h.lv ? ic('checkmark') : x.t) + '</i><b>' + x.n + '</b><small>' + x.d + '</small></div>').join('') + '</div>' +
      '<p class="hb-msg st-' + h.state + '">' + esc(h.msg) + (h.next && h.next.ready ? ' Si esta semana llegas a ' + h.next.t + ', subes a ' + h.next.n + '.' : '') + '</p>' +
      (last.length ? '<p class="eyebrow">Tus últimas semanas</p><div class="hb-hist">' + last.map(w => '<div class="' + (w.ev || '') + '"><span style="height:' + Math.round((w.c / max) * 100) + '%"></span><small>' + w.c + '</small>' + (w.ev === 'up' ? ic('arrow-up', 'hb-ev') : w.ev === 'down' ? ic('arrow-up', 'hb-ev dn') : '') + '</div>').join('') +
        '<div class="now"><span style="height:' + Math.round((h.c / max) * 100) + '%"></span><small>' + h.c + '</small></div></div>' : '') +
      '<button class="btn" data-go>' + ic('calendar') + (h.state === 'programa' ? 'Programar un día más' : 'Ver mi semana') + '</button></div>', {
      mount: (el, m) => { el.querySelector('[data-go]').onclick = () => { m.dismiss(); L.go('planes'); }; }
    });
  }
  L.habitSheet = sheet;

  /* al empezar una semana: celebrar lo que subió, avisar sin culpa lo que bajó */
  const snapshot = () => { const o = {}; D.ACTS.forEach(a => { o[a] = habit(a).lv; }); return o; };
  function check() {
    const now = snapshot(), was = L.S.habLv;
    L.S.habLv = now; L.save();
    if (!was) return;
    const ups = D.ACTS.filter(a => now[a] > (was[a] || 0)), downs = D.ACTS.filter(a => now[a] < (was[a] || 0));
    if (ups.length) setTimeout(() => celebrate(ups, now), 900);
    if (downs.length) setTimeout(() => L.toast(D.NAME[downs[0]] + ' bajó a ' + LV[now[downs[0]]].n + (downs.length > 1 ? ' y ' + (downs.length - 1) + ' más' : '') + '. Se recupera en dos semanas.', { icon: 'leaf' }), ups.length ? 4000 : 900);
  }
  function celebrate(ups, now) {
    L.full((el, m) => {
      const a = ups[0], lv = now[a];
      el.innerHTML = '<div class="celeb-in hb-celeb" data-a="' + a + '"><div class="hb-big">' + actIc(a, true) + '</div><p class="eyebrow">Nuevo nivel</p><h1>' + esc(D.NAME[a]) + '<br>ahora es <em>' + LV[lv].n + '</em></h1>' +
        '<p class="cv">' + LV[lv].d + ', dos semanas seguidas. «El que permanece en mí, y yo en él, este lleva mucho fruto.»<small>Juan 15:5</small></p>' +
        (ups.length > 1 ? '<p class="wk-note">También subieron: ' + ups.slice(1).map(x => D.NAME[x] + ' (' + LV[now[x]].n + ')').join(', ') + '</p>' : '') + '<button class="btn big" data-close>Amén</button></div>';
      el.querySelector('[data-close]').onclick = () => m.dismiss();
      setTimeout(() => L.sparks(el.querySelector('.hb-big'), 30), 500); L.haptic([20, 60, 30, 60, 40]);
    }, { cls: 'celeb' });
  }
  if (!L.S.habLv) { L.S.habLv = snapshot(); L.save(); }
  L.on('nextDay', d => { if (d.getDay() === 1) check(); });
  L.on('reset', () => { L.S.habLv = snapshot(); L.save(); });

  /* en Hoy: si algo se pierde por no programarlo, una tarjeta lo dice */
  L.ctxCard({
    id: 'habito',
    pri: () => (all().some(h => h.state === 'programa') ? 2.4 : 0),
    html: () => { const h = all().find(x => x.state === 'programa'); return '<div class="ctxc" data-a="' + h.a + '"><div class="ctxc-top"><div class="aic">' + actIc(h.a, true) + '</div><div><p class="eyebrow">Hábito en riesgo</p><b>' + esc(D.NAME[h.a]) + ' · ' + h.name + '</b></div></div><p class="muted">' + esc(h.msg) + '</p><button class="btn sm" data-ctx="habito">' + ic('calendar') + 'Programar</button></div>'; },
    click: () => { const h = all().find(x => x.state === 'programa'); if (h) sheet(h.a); }
  });
})();
