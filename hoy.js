/* Lámpara v4 · Hoy
   Estructura de YouVersion (versículo del día, prácticas guiadas con su duración, racha chica arriba)
   y el día agrupado por momento como Tiimo. Tocar = ver · círculo = marcar · mantener = menú · deslizar = atajos. */
(() => {
  const { esc, ic, actIc, av } = L;
  const MIN = { oracion: 10, palabra: 15, meditar: 5, diario: 3, adoracion: 10, mensaje: 5, ayuno: 0, encuentro: 0 };
  const FLOWABLE = ['oracion', 'palabra', 'meditar', 'diario', 'adoracion', 'mensaje', 'ayuno'];
  const canFlow = it => FLOWABLE.includes(it.a) && !it.with;
  const CHK = '<span><svg class="ck" viewBox="0 0 24 24"><path d="M6 12.5l4 4L18 8"/></svg></span>';
  const MOMENTS = [['Mañana', 'sunny-outline', 0, 720], ['Tarde', 'cafe-outline', 720, 1140], ['Noche', 'moon-outline', 1140, 1441]];
  const tipSeen = () => { try { return localStorage.getItem('lampara-tip-hoy') === '1'; } catch (e) { return true; } };
  const verseOfDay = () => { const t = L.today(); return D.VERSES[(t.getDate() + t.getMonth()) % D.VERSES.length]; };

  function withName(it) { return it.with === 'ER' ? D.LEADER.first : (L.person(it.with) || {}).first || ''; }
  function subOf(it) {
    if (L.isDone(it.id)) return 'Hecho · ' + L.S.done[L.tk()][it.id];
    const parts = [it.h];
    if (MIN[it.a]) parts.push(MIN[it.a] + ' min');
    if (it.src === 'p') parts.push(it.planName);
    else if (it.with) parts.push('con ' + withName(it));
    else if (it.n) parts.push(it.n);
    return parts.filter(Boolean).join(' · ');
  }
  function row(it, just) {
    const done = L.isDone(it.id) && it.id !== just;
    return '<ion-item-sliding><ion-item button detail="false" data-open="' + it.id + '" data-a="' + it.a + '" class="' + (done ? 'done' : '') + '">' +
      '<div class="aic" slot="start">' + actIc(it.a, done) + '</div>' +
      '<ion-label><h3>' + esc(it.t) + '</h3><p>' + esc(subOf(it)) + '</p></ion-label>' +
      '<button class="chk" slot="end" data-chk="' + it.id + '" aria-label="' + (done ? 'Desmarcar' : 'Marcar hecho') + '">' + CHK + '</button></ion-item>' +
      '<ion-item-options side="start"><ion-item-option class="o-done" expandable data-swdone="' + it.id + '">' + ic('checkmark') + '</ion-item-option></ion-item-options>' +
      '<ion-item-options side="end"><ion-item-option class="o-skip" data-skip="' + it.id + '">Hoy no</ion-item-option></ion-item-options></ion-item-sliding>';
  }
  function weekHTML() {
    const t = L.today();
    return '<div class="week">' + L.weekDates(t).map(d => {
      const st = L.dayStatus(d), isT = L.same(d, t);
      const pips = st === 'future' ? L.itemsFor(d).slice(0, 4).map(i => '<i data-a="' + i.a + '"></i>').join('') : '';
      return '<button class="wd ' + st + (isT ? ' now' : '') + '" data-day="' + L.dk(d) + '"><small>' + L.DL[d.getDay()] + '</small><span class="dot">' + d.getDate() + '</span><span class="pips">' + pips + '</span></button>';
    }).join('') + '</div>';
  }

  class PageHoy extends L.Page {
    shell() {
      return L.shell({ title: 'Hoy', end: '<button class="streak" data-camino aria-label="Tu racha">' + ic('flame') + '<span class="fc-n"></span></button><button class="me-btn" data-camino aria-label="Tu camino">' + av('JC', 'Juan Carlos', 32) + '</button>' });
    }
    mount() {
      this.prevOn = new Set();
      L.on('lit', () => { const c = this.querySelector('.streak'); if (c) { c.classList.remove('ignite'); void c.offsetWidth; c.classList.add('ignite'); L.sparks(c, 10); } });
      this.addEventListener('ionSwipe', e => { const o = e.target.querySelector('[data-swdone]') || e.target.closest('[data-swdone]'); if (o) this.mark(o.dataset.swdone, true); });
      L.press(this, '[data-open]', el => menu(el.dataset.open, el, this));
    }
    render() {
      const S = L.S, t = L.today(), its = L.todayItems(), k = its.filter(i => L.isDone(i.id)).length, n = its.length;
      const pend = its.filter(i => !L.isDone(i.id) && canFlow(i));
      const min = pend.reduce((s, i) => s + MIN[i.a], 0);
      const v = verseOfDay(), saved = S.keeps.some(x => x.r === v.r);
      const ctx = L.topCtx();
      /* la barra de colores arranca como estaba y se completa en after(): así se anima */
      this.onNow = new Set(its.filter(i => L.isDone(i.id)).map(i => i.id));
      const cta = pend.length ? '<button class="btn" data-start>' + ic('play') + (k ? 'Seguir · ' + pend.length + ' más' : 'Empezar') + '</button>'
        : n && k === n ? '<div class="done-line">' + ic('lampara') + 'Tu lámpara está encendida</div>' : n ? '<p class="muted">Lo que queda es con otras personas.</p>' : '<p class="muted">Nada planeado para hoy.</p>';
      /* lo que sigue (la tarjeta «Ahora» de v3): la próxima práctica pendiente, a un toque */
      const nx = its.find(i => !L.isDone(i.id));
      const nextRow = nx && pend.length ? '<button class="nextrow" data-open="' + nx.id + '" data-a="' + nx.a + '"><span class="aic">' + actIc(nx.a) + '</span><span class="nr-t"><small>' + (L.mins(nx.h) < new Date().getHours() * 60 + new Date().getMinutes() ? 'Te quedó' : 'Sigue') + ' · ' + esc(nx.h) + '</small><b>' + esc(nx.t) + '</b></span>' + ic('chevron-forward', 'chev') + '</button>' : '';
      const tcd = '<div class="tcd"><div class="tcd-top"><h2>Tu tiempo con Dios</h2><span>' + k + ' de ' + n + (min ? ' · ' + min + ' min' : '') + '</span></div>' +
        (n ? '<div class="segbar">' + its.map(i => '<i data-a="' + i.a + '" data-seg="' + i.id + '" class="' + (this.prevOn.has(i.id) && this.onNow.has(i.id) ? 'on' : '') + '"></i>').join('') + '</div>' : '') + nextRow + cta + '</div>';
      const groups = MOMENTS.map(([name, icon, a, b]) => {
        const g = its.filter(i => L.mins(i.h) >= a && L.mins(i.h) < b);
        return g.length ? '<p class="moment">' + ic(icon) + name + '</p><ion-list inset="true" lines="inset">' + g.map(i => row(i, this.just)).join('') + '</ion-list>' : '';
      }).join('');
      const ppl = [{ id: D.LEADER.id, name: D.LEADER.name, first: D.LEADER.first, lead: true }].concat(S.people).concat([{ id: 'AN', name: 'Ana', first: 'Ana', fam: true }]);
      return '<p class="today-date">' + L.longDate(t) + (S.focus ? '<span class="focus-chip">' + ic('flag') + esc(S.focus.t) + '</span>' : '') + '</p>' + weekHTML() +
        (ctx ? ctx.html() : '') +
        '<div class="verse" data-verse data-a="palabra"><span class="art">' + ic('sh-palabra') + '</span><p class="eyebrow">Versículo del día · <b>' + esc(v.r) + '</b></p><p class="vt">«' + esc(v.t) + '»</p>' +
        '<div class="vacts"><button data-vact="keep" class="' + (saved ? 'on' : '') + '">' + ic(saved ? 'bookmark' : 'bookmark-outline') + (saved ? 'Guardado' : 'Guardar') + '</button>' +
        '<button data-vact="memo">' + ic('leaf-outline') + 'Memorizar</button><button data-vact="share">' + ic('paper-plane-outline') + 'Compartir</button></div></div>' +
        '<div class="sec"></div>' + tcd + groups +
        (tipSeen() ? '' : '<div class="tip">' + ic('information-circle-outline') + '<span><b>Atajos:</b> mantén presionada una práctica para ver opciones, o deslízala a la derecha para marcarla.</span><button class="iconbtn" data-tipx aria-label="Cerrar">' + ic('close') + '</button></div>') +
        '<button class="link add-today" data-addtoday>' + ic('add-circle') + ' Agregar algo a hoy</button>' +
        '<div class="sec"><h2>Tu gente</h2><button class="more" data-anotar>' + ic('add') + ' Anotar</button></div><div class="stories">' + ppl.map(p => {
          const cls = p.lead || p.fam ? 'dim' : p.signal === 'hablar' || p.signal === 'cuesta' ? 'talk' : p.share >= 2 && p.dToday > 0 ? 'lit' : 'dim';
          return '<button class="story" data-who="' + p.id + '">' + av(p.id, p.name, 56, cls) + '<small>' + esc(p.first) + '</small></button>';
        }).join('') + '</div>';
    }
    after() {
      const chip = this.querySelector('.streak');
      if (chip) { chip.classList.toggle('lit', L.litToday()); chip.querySelector('.fc-n').textContent = L.weekLit(); }
      const onNow = this.onNow;
      requestAnimationFrame(() => requestAnimationFrame(() => this.pg.querySelectorAll('.segbar i').forEach(s => s.classList.toggle('on', onNow.has(s.dataset.seg)))));
      this.prevOn = onNow;
      if (this.just) {
        const id = this.just; this.just = null;
        const it = this.pg.querySelector('[data-open="' + id + '"]');
        if (it) requestAnimationFrame(() => {
          it.classList.add('done');
          const a = L.todayItems().find(x => x.id === id);
          if (a) it.querySelector('.aic').innerHTML = actIc(a.a, true);
          it.querySelector('.aic').classList.add('pop');
          const s = it.querySelector('.chk span'); s.classList.add('pop', 'ripple');
          L.sparks(it.querySelector('.chk'), 8);
        });
      }
    }
    mark(id, on) {
      if (!L.todayItems().some(i => i.id === id)) return;
      if (on) this.just = id;
      L.setDone(id, on);
      if (!on) L.toast('Desmarcado', { undo: () => L.setDone(id, true, { quiet: true }) });
    }
    onClick(e) {
      const t = e.target;
      let el;
      if ((el = t.closest('[data-chk]'))) { e.stopPropagation(); this.mark(el.dataset.chk, !L.isDone(el.dataset.chk)); return; }
      if ((el = t.closest('[data-swdone]'))) { this.mark(el.dataset.swdone, true); return; }
      if ((el = t.closest('[data-skip]'))) { const id = el.dataset.skip; L.skipToday(id, true); L.toast('Lo sacaste de hoy', { undo: () => L.skipToday(id, false) }); return; }
      if ((el = t.closest('[data-open]'))) { openItem(el.dataset.open, this); return; }
      if ((el = t.closest('[data-ctx]'))) { const c = L.topCtx(); if (c) c.click(el); return; }
      if (t.closest('[data-start]')) { Flujo.start(L.todayItems().filter(i => !L.isDone(i.id) && canFlow(i))); return; }
      if ((el = t.closest('[data-day]'))) { openDay(L.fromDk(el.dataset.day)); return; }
      if (t.closest('[data-camino]')) { L.card('page-camino'); return; }
      if ((el = t.closest('[data-vact]'))) { verseAct(el.dataset.vact); return; }
      if ((el = t.closest('[data-who]'))) { whoActions(el.dataset.who, this); return; }
      if ((el = t.closest('[data-go]'))) { L.go(el.dataset.go); return; }
      if (t.closest('[data-addtoday]')) { addToday(); return; }
      if (t.closest('[data-anotar]')) { L.anotar(); return; }
      if (t.closest('[data-tipx]')) { try { localStorage.setItem('lampara-tip-hoy', '1'); } catch (e2) {} const tp = this.pg.querySelector('.tip'); if (tp) tp.remove(); return; }
    }
  }
  L.define('page-hoy', PageHoy);

  /* ---------- mantener presionado: vista previa y acciones ---------- */
  function menu(id, el, page) {
    const it = L.todayItems().find(i => i.id === id); if (!it) return;
    const done = L.isDone(id), inf = D.INFO[it.a];
    const items = [];
    if (canFlow(it) && !done) items.push({ text: 'Empezar ahora', icon: 'play', handler: () => Flujo.start([it]) });
    items.push({ text: done ? 'Desmarcar' : 'Marcar hecho', icon: done ? 'close' : 'checkmark', handler: () => page.mark(id, !done) });
    items.push({ text: 'Ver detalle', icon: 'information-circle-outline', handler: () => openItem(id, page) });
    items.push({ text: 'Hoy no', icon: 'moon-outline', danger: true, handler: () => { L.skipToday(id, true); L.toast('Lo sacaste de hoy', { undo: () => L.skipToday(id, false) }); } });
    L.context(el, '<div class="cp"><div class="aic">' + actIc(it.a, true) + '</div><div><b>' + esc(it.t) + '</b><small>' + esc(subOf(it)) + '</small></div></div><div class="why"><p>' + esc(inf.why) + '</p><small>' + esc(inf.ref) + '</small></div>', items, it.a);
  }

  /* ---------- detalle de una práctica: qué hacer, para qué, cómo ---------- */
  function openItem(id, page) {
    const it = L.todayItems().find(i => i.id === id); if (!it) return;
    const done = L.isDone(id), inf = D.INFO[it.a];
    const meta = [D.NAME[it.a], it.h].concat(MIN[it.a] ? [MIN[it.a] + ' min'] : []).concat(it.src === 'p' ? [it.planName + ' · día ' + it.day + ' de ' + it.len] : []).join(' · ');
    const disc = it.with && L.person(it.with);
    const withP = it.with ? (it.with === 'ER' ? { id: 'ER', name: D.LEADER.name } : L.person(it.with)) : null;
    const go = disc ? ['reader-outline', 'Preparar'] : it.with ? ['chatbubble', 'Escribirle'] : it.a === 'palabra' ? ['book', 'Leer'] : it.a === 'oracion' ? ['hands-praying', 'Orar'] : it.a === 'meditar' ? ['leaf', 'Meditar'] : it.a === 'diario' ? ['create', 'Escribir'] : it.a === 'mensaje' ? ['paper-plane', 'Escribir'] : ['play', 'Empezar'];
    const html = '<div data-a="' + it.a + '"><div class="sh-head"><div class="aic">' + actIc(it.a, true) + '</div><div><h2>' + esc(it.t) + '</h2><p>' + esc(meta) + '</p></div></div>' +
      (it.n ? '<div class="note">' + ic('document-text-outline') + '<span>' + esc(it.n) + '</span></div>' : '') +
      (withP ? '<div class="mini-list"><div class="mini">' + av(withP.id, withP.name, 34) + '<div><b>' + esc(withP.name) + '</b><small>' + esc(it.h) + '</small></div></div></div>' : '') +
      '<div class="why"><p>' + esc(inf.why) + '</p><small>' + esc(inf.ref) + '</small></div>' +
      '<div class="steps">' + inf.how.map(s => '<div>' + esc(s) + '</div>').join('') + '</div>' + extras(it) +
      '<div class="row2"><button class="btn ghost" data-m>' + (done ? 'Desmarcar' : ic('checkmark') + 'Hecho') + '</button><button class="btn c" data-g>' + ic(go[0]) + go[1] + '</button></div></div>';
    L.sheet(html, {
      mount: (el, m) => {
        el.querySelector('[data-m]').onclick = () => { m.dismiss(); page ? page.mark(id, !done) : L.setDone(id, !done); };
        const nb = el.querySelector('[data-note]');
        if (nb) nb.onclick = () => { m.dismiss(); L.prompt('Anotar sobre ' + it.t, { ph: '¿Qué te quedó?' }, v => { L.S.keeps.unshift({ a: it.a, t: v, r: it.src === 'p' ? it.t : '', d: L.tk() }); L.save(); L.refresh(); L.toast('Anotado', { icon: 'create' }); }); };
        el.querySelector('[data-g]').onclick = () => {
          m.dismiss();
          if (disc) { m.onDidDismiss().then(() => Encuentro.open(it.with)); return; }
          if (it.with) { L.toast('Abrimos tu chat con ' + withP.name.split(' ')[0], { icon: 'chatbubble' }); return; }
          if (canFlow(it)) m.onDidDismiss().then(() => Flujo.start([it])); else L.setDone(id, true);
        };
      }
    });
  }

  /* lo anotado hoy, con quién la haces y qué toca mañana (el despliegue de v3) */
  function extras(it) {
    const rows = [];
    const notes = L.S.keeps.filter(k => k.d === L.tk() && k.a === it.a);
    notes.slice(0, 2).forEach(k => rows.push('<div class="mini"><span class="aic">' + ic('create-outline') + '</span><div><b>«' + esc(k.t) + '»</b><small>Anotaste hoy</small></div></div>'));
    if (it.src === 'p') {
      const p = L.S.plans.find(x => x.id === it.plan);
      const others = (p && p.people || []).filter(x => x !== 'JC');
      if (others.length) rows.push('<div class="mini">' + L.av(others[0], (L.person(others[0]) || { name: D.MEMBERS[others[0]] || others[0] }).name, 26) + '<div><b>Juntos</b><small>' + esc(others.map(x => (L.person(x) || { first: (D.MEMBERS[x] || x).split(' ')[0] }).first).join(', ')) + ' también ' + (others.length > 1 ? 'lo hacen' : 'lo hace') + ' hoy</small></div></div>');
      if (p && it.day < it.len) rows.push('<div class="mini"><span class="aic">' + actIc(it.a) + '</span><div><b>Mañana</b><small>' + esc(D.SEQ[p.seq](it.a, it.day + 1)) + '</small></div></div>');
    }
    return (rows.length ? '<div class="mini-list">' + rows.join('') + '</div>' : '') + '<button class="link center-link note-link" data-note>' + ic('create-outline') + ' Anotar algo de esto</button>';
  }

  /* ---------- un día de la semana ---------- */
  function openDay(d) {
    const n = L.diffDays(d, L.today()), st = L.dayStatus(d), its = L.itemsFor(d), k = L.dk(d);
    if (n === 0) return;
    let sub, body;
    if (n > 0) {
      sub = its.length ? its.length + ' planeadas' : 'Nada planeado';
      body = its.map(i => '<div class="mini" data-a="' + i.a + '"><div class="aic">' + actIc(i.a) + '</div><div><b>' + esc(i.t) + '</b><small>' + esc([i.h, i.planName || i.n].filter(Boolean).join(' · ')) + '</small></div></div>').join('');
    } else if (st === 'lit') {
      const done = L.S.done[k], list = done ? its.filter(i => done[i.id]) : its;
      sub = 'Encendido · ' + list.length + ' prácticas';
      body = list.map(i => '<div class="mini" data-a="' + i.a + '"><div class="aic">' + actIc(i.a, true) + '</div><div><b>' + esc(i.t) + '</b><small>' + esc(D.NAME[i.a]) + '</small></div></div>').join('');
    } else {
      sub = st === 'grace' ? 'Día de gracia · la llama siguió' : 'Sin registro · la llama no se apaga';
      body = '<div class="note">' + ic('flame-outline') + '<span>' + (st === 'grace' ? 'Cada semana tienes un día de gracia. Tu racha no se corta.' : 'Vuelve hoy y la llama se aviva.') + '</span></div>';
    }
    L.sheet('<h2 class="sh-title">' + L.longDate(d) + '</h2><p class="sh-sub">' + sub + '</p><div class="mini-list">' + body + '</div>' +
      (n > 0 ? '<button class="btn ghost" data-edit>' + ic('create-outline') + 'Cambiar mi semana</button>' : ''), {
      mount: (el, m) => { const b = el.querySelector('[data-edit]'); if (b) b.onclick = () => { m.dismiss(); L.go('planes'); setTimeout(() => L.emit('planes:dia', d.getDay()), 350); }; }
    });
  }

  /* ---------- versículo del día ---------- */
  function verseAct(a) {
    const v = verseOfDay(), S = L.S;
    if (a === 'keep') {
      const i = S.keeps.findIndex(x => x.r === v.r);
      if (i >= 0) S.keeps.splice(i, 1); else { S.keeps.unshift({ a: 'palabra', t: v.t, r: v.r, d: L.tk() }); L.haptic(8); }
      L.save(); L.refresh(); if (i < 0) L.toast('Guardado en «Lo que me llevo»', { icon: 'bookmark' }); return;
    }
    if (a === 'memo') { if (!S.memo.some(m => m.r === v.r)) { S.memo.push({ r: v.r, t: v.t, lvl: 0 }); L.save(); } L.toast('Lo agregaste a «De memoria»', { icon: 'leaf' }); return; }
    L.actions('Compartir ' + v.r, [
      { text: 'A mis discípulos', icon: 'people-outline', handler: () => L.toast('Se lo mandaste a ' + S.people.length + ' personas', { icon: 'paper-plane' }) },
      { text: 'A Ana', icon: 'heart-outline', handler: () => L.toast('Se lo mandaste a Ana', { icon: 'paper-plane' }) },
      { text: 'Al grupo de hombres', icon: 'chatbubbles-outline', handler: () => L.toast('Publicado en el grupo', { icon: 'paper-plane' }) }
    ]);
  }

  /* ---------- tocar a alguien: atajos ---------- */
  function whoActions(id, page) {
    const p = L.person(id), lead = id === D.LEADER.id, name = p ? p.first : lead ? D.LEADER.first : 'Ana';
    const btns = [
      { text: 'Orar por ' + name, icon: 'heart-outline', handler: () => { L.S.log.unshift({ who: id, a: 'oracion', d: L.tk() }); L.S.stats.prayOthers++; L.save(); L.toast('Oraste por ' + name, { icon: 'heart' }); L.checkAch(); } },
      { text: 'Escribirle', icon: 'chatbubble-outline', handler: () => { L.S.log.unshift({ who: id, a: 'mensaje', d: L.tk() }); L.save(); L.toast('Le escribiste a ' + name, { icon: 'chatbubble' }); } }
    ];
    if (p) btns.push({ text: 'Ver su día y su semana', icon: 'person-circle-outline', handler: () => page.push('page-persona', { pid: id }) });
    if (lead) btns.push({ text: 'Qué ve ' + name + ' de ti', icon: 'eye-outline', handler: () => page.push('page-lider') });
    if (id === 'AN') btns.push({ text: 'Ir a Familia', icon: 'home-outline', handler: () => { L.go('personas'); setTimeout(() => L.emit('personas:seg', 'familia'), 300); } });
    const sub = p ? (p.share >= 3 ? 'Hoy ' + p.dToday + ' de ' + L.discItems(p, L.today()).length : p.share === 2 ? (p.dToday ? 'Hoy encendió su día' : 'Hoy todavía no') : p.share === 1 ? 'Esta semana: ' + D.SIG[p.signal] : 'No comparte su progreso') : '';
    L.actions(lead ? D.LEADER.name : p ? p.name : 'Ana', btns, sub);
  }

  /* ---------- agregar algo solo para hoy ---------- */
  function addToday() {
    const tiles = D.ACTS.map(a => '<button class="tile" data-a="' + a + '" data-add="' + a + '"><span class="aic">' + actIc(a, true) + '</span>' + D.NAME[a] + '</button>').join('');
    L.sheet('<h2 class="sh-title">Agregar a hoy</h2><p class="sh-sub">Solo para hoy. Para todas las semanas, usa Planes.</p><div class="tiles">' + tiles + '</div>', {
      mount: (el, m) => el.addEventListener('click', e => {
        const b = e.target.closest('[data-add]'); if (!b) return;
        const a = b.dataset.add, id = 'x' + Date.now();
        const n = new Date(); n.setHours(n.getHours() + 1, 0);
        L.S.routine.push({ id, a, t: D.NAME[a], h: String(n.getHours()).padStart(2, '0') + ':00', days: [], once: L.tk() });
        L.save(); L.refresh(); m.dismiss();
        L.toast(D.NAME[a] + ' agregado a hoy', { undo: () => { L.S.routine = L.S.routine.filter(r => r.id !== id); L.save(); L.refresh(); } });
      })
    });
  }

  window.Hoy = { openItem, openDay, canFlow };
})();
