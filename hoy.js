/* Lámpara v4 · Hoy
   Una sola acción principal (Empezar) y debajo el día: tocar = ver, círculo = marcar, deslizar = atajos. */
(() => {
  const { esc, ic, actIc, av } = L;
  const MIN = { oracion: 10, palabra: 15, meditar: 5, diario: 3, adoracion: 10, mensaje: 5, ayuno: 0, encuentro: 0 };
  const FLOWABLE = ['oracion', 'palabra', 'meditar', 'diario', 'adoracion', 'mensaje', 'ayuno'];
  const canFlow = it => FLOWABLE.includes(it.a) && !it.with;
  const RC = 2 * Math.PI * 33;

  function subOf(it) {
    if (L.isDone(it.id)) return 'Hecho · ' + L.S.done[L.tk()][it.id];
    const parts = [it.h];
    if (it.src === 'p') parts.push(D.NAME[it.a], it.planName);
    else if (it.with) parts.push('con ' + (it.with === 'ER' ? D.LEADER.first : (L.person(it.with) || {}).first || ''));
    else if (it.n) parts.push(it.n);
    return parts.filter(Boolean).join(' · ');
  }
  function row(it) {
    const done = L.isDone(it.id);
    return '<ion-item-sliding data-sl="' + it.id + '"><ion-item button detail="false" data-open="' + it.id + '" data-a="' + it.a + '" class="' + (done ? 'done' : '') + '">' +
      '<div class="aic" slot="start">' + actIc(it.a, done) + '</div>' +
      '<ion-label><h3>' + esc(it.t) + '</h3><p>' + esc(subOf(it)) + '</p></ion-label>' +
      '<button class="chk" slot="end" data-chk="' + it.id + '" aria-label="' + (done ? 'Desmarcar' : 'Marcar hecho') + '"><span>' + ic('checkmark') + '</span></button></ion-item>' +
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
      return L.shell({ title: 'Hoy', end: '<button class="flame-chip" data-camino aria-label="Tu camino">' + L.flameSVG() + '<span class="fc-n"></span></button><button class="me-btn" data-camino aria-label="Tu perfil">' + av('JC', 'Juan Carlos', 32) + '</button>' });
    }
    mount() {
      this.prev = 0;
      L.on('lit', () => { const c = this.querySelector('.flame-chip'); if (c) { c.classList.remove('ignite'); void c.offsetWidth; c.classList.add('ignite'); L.sparks(c, 10); } });
      this.addEventListener('ionSwipe', e => { const o = e.target.querySelector('[data-swdone]') || e.target.closest('[data-swdone]'); if (o) this.mark(o.dataset.swdone, true); });
    }
    render() {
      const t = L.today(), its = L.todayItems(), k = its.filter(i => L.isDone(i.id)).length, n = its.length;
      const pend = its.filter(i => !L.isDone(i.id) && canFlow(i));
      const min = pend.reduce((s, i) => s + MIN[i.a], 0);
      const pct = n ? k / n : 0;
      this.pct = pct;
      const title = n && k === n ? 'Lámpara encendida' : k ? 'Vas ' + k + ' de ' + n : n ? 'Tu tiempo con Dios' : 'Hoy, día libre';
      const sub = n && k === n ? 'Completaste todo lo de hoy' : pend.length ? pend.length + (pend.length === 1 ? ' práctica' : ' prácticas') + (min ? ' · ' + min + ' min' : '') : n ? 'Lo que queda es con otras personas' : 'Nada planeado para hoy';
      const cta = n && k === n ? '' : pend.length ? '<button class="btn" data-start>' + ic('play') + (k ? 'Seguir' : 'Empezar') + '</button>' : '';
      const hero = '<div class="hero"><div class="ring' + (L.litToday() ? ' lit' : '') + '"><svg class="rg" viewBox="0 0 76 76"><circle class="trk" cx="38" cy="38" r="33" fill="none" stroke-width="6"/>' +
        '<circle class="bar" cx="38" cy="38" r="33" fill="none" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + RC.toFixed(1) + '" style="stroke-dashoffset:' + (RC * (1 - this.prev)).toFixed(1) + '"/></svg>' + L.flameSVG() + '</div>' +
        '<div><h2>' + title + '</h2><p>' + sub + '</p></div>' + cta + '</div>';
      const list = n ? '<div class="sec"><h2>Tu día</h2><span class="muted">' + k + ' de ' + n + '</span></div><ion-list inset="true" lines="inset">' + its.map(row).join('') + '</ion-list>' : '';
      const v = D.VERSES[(t.getDate() + t.getMonth()) % D.VERSES.length];
      const verse = '<div class="sec"><h2>Para hoy</h2></div><div class="verse" data-verse><p>' + esc(v.t) + '</p><small>' + esc(v.r) + ic('ellipsis-horizontal') + '</small></div>';
      const ppl = [{ id: D.LEADER.id, name: D.LEADER.name, first: D.LEADER.first, lead: true }].concat(L.S.people).concat([{ id: 'AN', name: 'Ana', first: 'Ana', fam: true }]);
      const stories = '<div class="sec"><h2>Tu gente</h2><button class="more" data-go="personas">Ver todos</button></div><div class="stories">' + ppl.map(p => {
        const cls = p.lead || p.fam ? 'dim' : p.signal === 'hablar' || p.signal === 'cuesta' ? 'talk' : p.share >= 2 && p.dToday > 0 ? 'lit' : 'dim';
        return '<button class="story" data-who="' + p.id + '">' + av(p.id, p.name, 58, cls) + '<small>' + esc(p.first) + '</small></button>';
      }).join('') + '</div>';
      return '<p class="today-date">' + L.longDate(t) + '</p>' + weekHTML() + hero + list +
        '<button class="link add-today" data-addtoday>' + ic('add-circle') + ' Agregar algo a hoy</button>' + verse + stories;
    }
    after() {
      const chip = this.querySelector('.flame-chip');
      if (chip) { chip.classList.toggle('lit', L.litToday()); chip.querySelector('.fc-n').textContent = L.weekLit() + '/' + L.GOAL; }
      const bar = this.pg.querySelector('.ring .bar');
      if (bar) requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.strokeDashoffset = (RC * (1 - this.pct)).toFixed(1); }));
      this.prev = this.pct;
      if (this.just) {
        const it = this.pg.querySelector('[data-open="' + this.just + '"]');
        if (it) { it.querySelector('.chk span').classList.add('pop'); it.querySelector('.aic').classList.add('pop'); L.sparks(it.querySelector('.chk'), 9); }
        this.just = null;
      }
    }
    mark(id, on) {
      const it = L.todayItems().find(i => i.id === id); if (!it) return;
      if (on) this.just = id;
      L.setDone(id, on);
      if (!on) L.toast('Desmarcado', { undo: () => L.setDone(id, true, { quiet: true }) });
    }
    onClick(e) {
      const t = e.target;
      let el;
      if ((el = t.closest('[data-chk]'))) { e.stopPropagation(); this.mark(el.dataset.chk, !L.isDone(el.dataset.chk)); return; }
      if ((el = t.closest('[data-swdone]'))) { this.mark(el.dataset.swdone, true); return; }
      if ((el = t.closest('[data-skip]'))) {
        const id = el.dataset.skip; L.skipToday(id, true);
        L.toast('Lo sacaste de hoy', { undo: () => L.skipToday(id, false) }); return;
      }
      if ((el = t.closest('[data-open]'))) { openItem(el.dataset.open); return; }
      if (t.closest('[data-start]')) { const pend = L.todayItems().filter(i => !L.isDone(i.id) && canFlow(i)); window.Flujo && Flujo.start(pend); return; }
      if ((el = t.closest('[data-day]'))) { openDay(L.fromDk(el.dataset.day)); return; }
      if (t.closest('[data-camino]')) { L.card('page-camino'); return; }
      if (t.closest('[data-verse]')) { verseActions(); return; }
      if ((el = t.closest('[data-who]'))) { whoActions(el.dataset.who, this); return; }
      if ((el = t.closest('[data-go]'))) { L.go(el.dataset.go); return; }
      if (t.closest('[data-addtoday]')) { addToday(); return; }
    }
  }
  L.define('page-hoy', PageHoy);

  /* ---------- detalle de una práctica: qué hacer, para qué, cómo ---------- */
  function openItem(id) {
    const it = L.todayItems().find(i => i.id === id); if (!it) return;
    const done = L.isDone(id), inf = D.INFO[it.a];
    const meta = [D.NAME[it.a], it.h].concat(it.src === 'p' ? [it.planName + ' · día ' + it.day + ' de ' + it.len] : []).join(' · ');
    const withP = it.with ? (it.with === 'ER' ? { id: 'ER', name: D.LEADER.name, first: D.LEADER.first } : L.person(it.with)) : null;
    const go = it.with ? ['chatbubble', 'Escribirle'] : it.a === 'palabra' ? ['book', 'Leer'] : it.a === 'oracion' ? ['heart', 'Orar'] : it.a === 'meditar' ? ['leaf', 'Meditar'] : it.a === 'diario' ? ['create', 'Escribir'] : it.a === 'mensaje' ? ['send', 'Escribir'] : ['play', 'Empezar'];
    const html = '<div data-a="' + it.a + '"><div class="sh-head"><div class="aic">' + actIc(it.a, true) + '</div><div><h2>' + esc(it.t) + '</h2><p>' + esc(meta) + '</p></div></div>' +
      (it.n ? '<div class="note">' + ic('document-text-outline') + '<span>' + esc(it.n) + '</span></div>' : '') +
      (withP ? '<div class="mini-list"><div class="mini">' + av(withP.id, withP.name, 34) + '<div><b>' + esc(withP.name) + '</b><small>' + esc(it.h) + '</small></div></div></div>' : '') +
      '<div class="why"><p>' + esc(inf.why) + '</p><small>' + esc(inf.ref) + '</small></div>' +
      '<div class="steps">' + inf.how.map(s => '<div>' + esc(s) + '</div>').join('') + '</div>' +
      '<div class="row2"><button class="btn ghost" data-m>' + (done ? 'Desmarcar' : ic('checkmark') + 'Hecho') + '</button><button class="btn c" data-g>' + ic(go[0]) + go[1] + '</button></div></div>';
    L.sheet(html, {
      mount: (el, m) => {
        el.querySelector('[data-m]').onclick = () => { m.dismiss(); const p = document.querySelector('page-hoy'); if (p) { if (!done) p.just = id; } L.setDone(id, !done); };
        el.querySelector('[data-g]').onclick = () => {
          m.dismiss();
          if (it.with) { L.toast('Abrimos tu chat con ' + withP.first, { icon: 'chatbubble' }); return; }
          if (canFlow(it)) m.onDidDismiss().then(() => Flujo.start([it])); else L.setDone(id, true);
        };
      }
    });
  }

  /* ---------- un día de la semana ---------- */
  function openDay(d) {
    const n = L.diffDays(d, L.today()), st = L.dayStatus(d), its = L.itemsFor(d), k = L.dk(d);
    if (n === 0) { const c = document.querySelector('page-hoy ion-content'); c && c.scrollToPoint(0, 300, 400); return; }
    const title = L.longDate(d);
    let sub, body;
    if (n > 0) {
      sub = its.length ? its.length + ' planeadas' : 'Nada planeado';
      body = its.map(i => '<div class="mini" data-a="' + i.a + '"><div class="aic">' + actIc(i.a) + '</div><div><b>' + esc(i.t) + '</b><small>' + esc([i.h, i.planName || i.n].filter(Boolean).join(' · ')) + '</small></div></div>').join('');
    } else if (st === 'lit') {
      const done = L.S.done[k];
      const list = done ? its.filter(i => done[i.id]) : its;
      sub = 'Encendido · ' + (done ? Object.keys(done).length : list.length) + ' prácticas';
      body = list.map(i => '<div class="mini" data-a="' + i.a + '"><div class="aic">' + actIc(i.a, true) + '</div><div><b>' + esc(i.t) + '</b><small>' + esc(D.NAME[i.a]) + '</small></div>' + ic('checkmark-circle', 'ok') + '</div>').join('');
    } else {
      sub = st === 'grace' ? 'Día de gracia · la llama siguió' : 'Sin registro · la llama no se apaga';
      body = '<div class="note">' + ic('flame-outline') + '<span>' + (st === 'grace' ? 'Cada semana tienes un día de gracia. Tu racha no se corta.' : 'Vuelve hoy y la llama se aviva.') + '</span></div>';
    }
    L.sheet('<h2 class="sh-title">' + title + '</h2><p class="sh-sub">' + sub + '</p><div class="mini-list">' + body + '</div>' +
      (n > 0 ? '<button class="btn ghost" data-edit>' + ic('create-outline') + 'Cambiar mi semana</button>' : ''), {
      mount: (el, m) => { const b = el.querySelector('[data-edit]'); if (b) b.onclick = () => { m.dismiss(); L.go('planes'); setTimeout(() => L.emit('planes:dia', d.getDay()), 350); }; }
    });
  }

  /* ---------- versículo del día ---------- */
  function verseActions() {
    const t = L.today(), v = D.VERSES[(t.getDate() + t.getMonth()) % D.VERSES.length];
    L.actions(v.r, [
      { text: 'Memorizarlo', icon: 'leaf-outline', handler: () => {
        if (!L.S.memo.some(m => m.r === v.r)) { L.S.memo.push({ r: v.r, t: v.t, lvl: 0 }); L.save(); }
        L.toast('Lo agregaste a «De memoria»', { icon: 'leaf' });
      } },
      { text: 'Compartirlo con mis discípulos', icon: 'paper-plane-outline', handler: () => L.toast('Se lo mandaste a ' + L.S.people.length + ' personas', { icon: 'paper-plane' }) },
      { text: 'Guardarlo en «Lo que me llevo»', icon: 'bookmark-outline', handler: () => { L.S.keeps.unshift({ a: 'palabra', t: v.t, r: v.r, d: L.tk() }); L.save(); L.toast('Guardado', { icon: 'bookmark' }); } }
    ]);
  }

  /* ---------- tocar a alguien: atajos ---------- */
  function whoActions(id, page) {
    const p = L.person(id), lead = id === D.LEADER.id, name = p ? p.first : lead ? D.LEADER.first : 'Ana';
    const btns = [
      { text: 'Orar por ' + name, icon: 'heart-outline', handler: () => { L.S.log.unshift({ who: id, a: 'oracion', d: L.tk() }); L.S.stats.prayOthers++; L.save(); L.toast('Oraste por ' + name, { icon: 'heart' }); L.checkAch(); } },
      { text: 'Escribirle', icon: 'chatbubble-outline', handler: () => { L.S.log.unshift({ who: id, a: 'mensaje', d: L.tk() }); L.save(); L.toast('Le escribiste a ' + name, { icon: 'chatbubble' }); } }
    ];
    if (p) btns.push({ text: 'Ver su día', icon: 'person-circle-outline', handler: () => page.push('page-persona', { pid: id }) });
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
