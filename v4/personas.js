/* Lámpara v4 · Personas
   Tres lugares: Discipulado (a quién acompañas y quién te acompaña), Familia (la mesa y la pareja) e Iglesia (el foro).
   Lo que ves de cada discípulo lo decide él: Nada · Señal · Ritmo · Todo. */
(() => {
  const { esc, ic, actIc, av } = L;
  const SEGS = [['discipulado', 'Discipulado'], ['familia', 'Familia'], ['iglesia', 'Iglesia']];
  const memberName = id => id === 'JC' ? 'Tú' : id === 'anon' ? 'Anónimo' : D.MEMBERS[id] || (L.person(id) || {}).name || id;
  const unread = ch => L.S.posts.filter(p => p.ch === ch && !L.S.seen[p.id] && p.by !== 'JC').length;
  const unreadAll = () => D.CHANNELS.reduce((s, c) => s + unread(c.id), 0);

  /* ---------- discípulos: lo que se ve depende de lo que cada uno comparte ---------- */
  function statusLine(p) {
    const n = L.discItems(p, L.today()).length, k = p.dToday;
    if (p.share >= 3) return k >= n ? 'Completó su día' : k ? 'Hoy va ' + k + ' de ' + n : 'Hoy todavía no empezó';
    if (p.share === 2) return k ? 'Hoy encendió su día' : 'Hoy todavía no';
    if (p.share === 1) return 'Esta semana: ' + D.SIG[p.signal];
    return 'No comparte su progreso';
  }
  function statusEnd(p) {
    const its = L.discItems(p, L.today()), k = p.dToday;
    if (p.share >= 3) return '<span class="ddots" slot="end">' + its.map((it, i) => '<i data-a="' + it.a + '">' + ic(D.ICON[it.a] + (i < k ? '' : '-outline')) + '</i>').join('') + '</span>';
    if (p.share === 2) return '<span class="dflame' + (k ? ' on' : '') + '" slot="end">' + ic('flame') + '</span>';
    if (p.share === 1) return '<span class="sig ' + p.signal + '" slot="end">' + D.SIG[p.signal] + '</span>';
    return '<span class="dlock" slot="end">' + ic('lock-closed') + '</span>';
  }
  const ringOf = p => p.signal === 'hablar' || p.signal === 'cuesta' ? 'talk' : p.share >= 2 && p.dToday > 0 ? 'lit' : 'dim';

  function discipuladoHTML() {
    const S = L.S, ppl = S.people.slice().sort((a, b) => (b.signal !== 'bien') - (a.signal !== 'bien'));
    const sharing = ppl.filter(p => p.share >= 2).length;
    const ups = window.Encuentro ? Encuentro.upcoming() : [];
    return (ups.length ? '<div class="sec"><h2>Esta semana te ves con</h2></div><div class="evs">' + ups.map(u => '<button class="ev" data-prep="' + u.p.id + '"><p class="eyebrow">' + esc(Encuentro.whenLabel(u)) + '</p><b>' + esc(u.it.t) + '</b><small>' + esc(u.p.name) + '</small><span class="chip on">' + ic('reader-outline') + 'Preparar</span></button>').join('') + '</div>' : '') +
      '<div class="sec"><h2>Te acompaña</h2></div><ion-list inset="true" lines="none"><ion-item button detail="true" data-lider>' +
      '<div slot="start" class="avs">' + av(D.LEADER.id, D.LEADER.name, 44) + '</div><ion-label><h3>' + esc(D.LEADER.name) + '</h3><p>' + esc(D.LEADER.role) + ' · ve: ' + D.SHARE[S.myShare].n + '</p></ion-label></ion-item></ion-list>' +
      '<div class="sec"><h2>Acompañas</h2><span class="muted">' + sharing + ' de ' + ppl.length + ' te muestran su día</span></div><ion-list inset="true" lines="inset">' +
      ppl.map(p => '<ion-item-sliding><ion-item button detail="false" data-person="' + p.id + '"><div slot="start" class="avs">' + av(p.id, p.name, 44, ringOf(p)) + '</div>' +
        '<ion-label><h3>' + esc(p.name) + '</h3><p>' + esc(statusLine(p)) + '</p></ion-label>' + statusEnd(p) + '</ion-item>' +
        '<ion-item-options side="start"><ion-item-option class="o-flame" expandable data-qa="oracion:' + p.id + '">' + ic('heart') + 'Oré</ion-item-option></ion-item-options>' +
        '<ion-item-options side="end"><ion-item-option class="o-skip" data-qa="mensaje:' + p.id + '">' + ic('chatbubble') + '</ion-item-option><ion-item-option class="o-done" data-qa="encuentro:' + p.id + '">' + ic('people') + '</ion-item-option></ion-item-options></ion-item-sliding>').join('') +
      '</ion-list><button class="addrow" data-invite>' + ic('person-add-outline') + 'Invitar a alguien a caminar contigo</button>' +
      '<p class="hint-swipe">' + ic('lock-closed-outline') + 'Cada uno decide qué ves de su progreso</p>';
  }

  /* ---------- familia ---------- */
  function familiaHTML() {
    const F = L.S.fam, wk = L.weekDates(L.today());
    const lit = wk.filter(d => F.nights[L.dk(d)]).length;
    const mesa = D.MESAS[F.mesa % D.MESAS.length];
    const q = D.COUPLE_Q[F.q % D.COUPLE_Q.length], ans = F.ans[L.tk()];
    const tonight = !!F.nights[L.tk()];
    return '<div class="home-hero"><div class="hh-top">' + ic('home') + '<div><h2>Casa encendida</h2><p>' + lit + ' de 4 noches juntos esta semana</p></div></div>' +
      '<div class="hdots">' + wk.map(d => '<span class="' + (F.nights[L.dk(d)] ? 'on' : '') + (L.same(d, L.today()) ? ' now' : '') + '"><i></i>' + L.DL[d.getDay()] + '</span>').join('') + '</div></div>' +
      '<div class="sec"><h2>Esta noche en la mesa</h2></div><div class="box pad mesa" data-a="palabra"><p class="eyebrow">' + esc(mesa.r) + '</p><h3>' + esc(mesa.t) + '</h3><p class="muted">Leer · conversar · orar · 10 min</p>' +
      (tonight ? '<button class="btn ghost" disabled>' + ic('checkmark') + 'Hecho esta noche</button>' : '<button class="btn c" data-mesa>' + ic('restaurant') + 'Empezar en la mesa</button>') + '</div>' +
      '<div class="sec"><h2>Ana y tú</h2></div><div class="box pad couple" data-a="adoracion"><p class="eyebrow">Pregunta de hoy</p><h3>' + esc(q) + '</h3>' +
      (ans ? '<div class="bubble">' + esc(ans) + '</div>' : '') +
      '<div class="row2"><button class="btn ghost" data-q-next>' + ic('shuffle') + 'Otra</button><button class="btn c" data-q-ans>' + ic('chatbubble-ellipses') + (ans ? 'Cambiar' : 'Responder') + '</button></div>' +
      '<button class="link center-link" data-couple-pray>' + ic('heart-outline') + ' Orar juntos esta noche</button></div>' +
      '<div class="sec"><h2>En casa</h2></div><ion-list inset="true" lines="inset">' + D.FAMILY.map(f => '<ion-item button detail="false" data-fam="' + f.id + '"><div slot="start" class="avs">' + av(f.id, f.name, 40) + '</div><ion-label><h3>' + esc(f.name) + '</h3><p>' + esc(f.role) + '</p></ion-label>' + ic('ellipsis-horizontal', 'endic') + '</ion-item>').join('') + '</ion-list>';
  }

  /* ---------- iglesia ---------- */
  function nextDate(dow) { const t = L.today(); return L.addDays(t, (dow - t.getDay() + 7) % 7); }
  function iglesiaHTML() {
    const C = D.CHURCH, S = L.S;
    const evs = D.EVENTS.map(e => ({ ...e, d: nextDate(e.dow) })).sort((a, b) => a.d - b.d);
    return '<div class="church"><div class="ch-ic">' + ic('church') + '</div><div><h2>' + esc(C.name) + '</h2><p>' + esc(C.place) + ' · ' + C.members + ' miembros</p></div></div>' +
      '<div class="sec"><h2>Esta semana</h2></div><div class="evs">' + evs.map(e => {
        const n = L.diffDays(e.d, L.today()), on = !!S.going[e.id];
        return '<div class="ev"><p class="eyebrow">' + (n === 0 ? 'Hoy' : n === 1 ? 'Mañana' : L.cap(L.DN[e.d.getDay()])) + ' · ' + e.h + '</p><b>' + esc(e.t) + '</b><small>' + esc(e.place) + '</small>' +
          '<button class="chip' + (on ? ' on' : '') + '" data-going="' + e.id + '">' + ic(on ? 'checkmark' : 'add') + (on ? 'Voy' : 'Ir') + '</button></div>';
      }).join('') + '</div>' +
      '<div class="sec"><h2>Canales</h2></div><ion-list inset="true" lines="inset">' + D.CHANNELS.map(c => {
        const last = S.posts.filter(p => p.ch === c.id).sort((a, b) => a.w - b.w)[0], u = unread(c.id);
        return '<ion-item button detail="false" data-canal="' + c.id + '" data-a="' + c.a + '"><div class="chan-ic" slot="start">' + ic(c.i) + '</div><ion-label><h3>' + esc(c.n) + '</h3><p>' + esc(last ? last.t : c.d) + '</p></ion-label>' +
          (u ? '<ion-badge slot="end" class="ub">' + u + '</ion-badge>' : '<span slot="end" class="ago">' + (last ? L.ago(last.w).replace('hace ', '') : '') + '</span>') + '</ion-item>';
      }).join('') + '</ion-list><p class="hint-swipe">' + ic('shield-checkmark-outline') + 'Solo miembros de ' + esc(C.name) + '</p>';
  }

  class PagePersonas extends L.Page {
    shell() {
      return L.shell({ title: 'Personas', top: '<div class="segw"><ion-segment value="discipulado" data-seg>' + SEGS.map(s => '<ion-segment-button value="' + s[0] + '"><ion-label>' + s[1] + '</ion-label></ion-segment-button>').join('') + '</ion-segment></div>' });
    }
    mount() {
      this.seg = 'discipulado';
      this.addEventListener('ionChange', e => { if (e.target.matches('[data-seg]')) { this.seg = e.detail.value; this.update(); } });
      this.addEventListener('ionSwipe', e => { const o = e.target.querySelector('[data-qa]'); if (o) quick(o.dataset.qa); });
      L.on('personas:seg', s => { this.seg = s; const sg = this.querySelector('[data-seg]'); if (sg) sg.value = s; this.update(); });
    }
    render() { return this.seg === 'familia' ? familiaHTML() : this.seg === 'iglesia' ? iglesiaHTML() : discipuladoHTML(); }
    after() { L.setBadge('personas', unreadAll() > 0); }
    onClick(e) {
      const t = e.target; let el;
      if ((el = t.closest('[data-qa]'))) { quick(el.dataset.qa); return; }
      if ((el = t.closest('[data-prep]'))) { this.push('page-encuentro', { pid: el.dataset.prep }); return; }
      if ((el = t.closest('[data-person]'))) { this.push('page-persona', { pid: el.dataset.person }); return; }
      if (t.closest('[data-lider]')) { this.push('page-lider'); return; }
      if (t.closest('[data-invite]')) { invite(); return; }
      if (t.closest('[data-mesa]')) { mesaFlow(); return; }
      if (t.closest('[data-q-next]')) { L.S.fam.q++; delete L.S.fam.ans[L.tk()]; L.save(); this.update(); return; }
      if (t.closest('[data-q-ans]')) { L.prompt('Tu respuesta', { ph: 'Escribe para Ana', value: L.S.fam.ans[L.tk()] || '' }, v => { L.S.fam.ans[L.tk()] = v; L.save(); L.refresh(); L.toast('Ana lo va a ver esta noche', { icon: 'heart' }); }); return; }
      if (t.closest('[data-couple-pray]')) { L.toast('Te lo recordamos a las 22:00', { icon: 'alarm' }); return; }
      if ((el = t.closest('[data-fam]'))) { famActions(el.dataset.fam); return; }
      if ((el = t.closest('[data-going]'))) { going(el.dataset.going); return; }
      if ((el = t.closest('[data-canal]'))) { this.push('page-canal', { ch: el.dataset.canal }); return; }
    }
  }
  L.define('page-personas', PagePersonas);

  /* atajos: oré / escribí / encuentro */
  function quick(spec) {
    const [a, id] = spec.split(':'), p = L.person(id) || { first: id };
    L.S.log.unshift({ who: id, a, d: L.tk() });
    if (a === 'oracion') L.S.stats.prayOthers++;
    L.save(); L.haptic(10); L.refresh();
    L.toast(a === 'oracion' ? 'Oraste por ' + p.first : a === 'mensaje' ? 'Le escribiste a ' + p.first : 'Anotaste un encuentro con ' + p.first, { icon: D.ICON[a] });
    L.checkAch();
  }
  function invite() {
    L.sheet('<div class="medal"><div class="coin fl">' + ic('person-add') + '</div><h2>Invitar a alguien</h2><p class="muted">Le llega un enlace. Al aceptar, elige qué quiere compartir contigo.</p><button class="btn" data-ok>' + ic('share-outline') + 'Compartir enlace</button></div>',
      { mount: (el, m) => { el.querySelector('[data-ok]').onclick = () => { m.dismiss(); L.toast('Enlace copiado', { icon: 'link' }); }; } });
  }
  function famActions(id) {
    const f = D.FAMILY.find(x => x.id === id);
    L.actions(f.name, [
      { text: 'Orar por ' + f.name, icon: 'heart-outline', handler: () => L.toast('Oraste por ' + f.name, { icon: 'heart' }) },
      { text: 'Mandarle una bendición', icon: 'chatbubble-outline', handler: () => L.toast('Le mandaste una bendición a ' + f.name, { icon: 'chatbubble' }) }
    ]);
  }
  function going(id) {
    const e = D.EVENTS.find(x => x.id === id), S = L.S, d = nextDate(e.dow);
    if (S.going[id]) {
      delete S.going[id]; S.routine = S.routine.filter(r => r.id !== 'ev-' + id);
      L.toast('Ya no vas a ' + e.t);
    } else {
      S.going[id] = 1;
      S.routine.push({ id: 'ev-' + id, a: 'encuentro', t: e.t, h: e.h, days: [], once: L.dk(d), n: e.place });
      L.toast('Agregado a tu semana · ' + L.DN[d.getDay()] + ' ' + e.h, { icon: 'calendar' });
    }
    L.save(); L.refresh();
  }

  /* devocional en la mesa: leer → conversar → orar por turnos */
  function mesaFlow() {
    const mesa = D.MESAS[L.S.fam.mesa % D.MESAS.length];
    const steps = [
      { a: 'palabra', i: 'book', k: 'Leer', h: mesa.t, body: '<p class="eyebrow">' + esc(mesa.r) + '</p><blockquote class="mv">' + esc(mesa.v) + '</blockquote><p class="fl-hint">Que lo lea uno de los chicos en voz alta.</p>' },
      { a: 'encuentro', i: 'chatbubbles', k: 'Conversar', h: 'Hablemos', body: '<div class="pcard"><b>' + ic('happy-outline') + 'Para Tomás y Sofi</b><p>' + esc(mesa.kids) + '</p></div><div class="pcard"><b>' + ic('people-outline') + 'Para los grandes</b><p>' + esc(mesa.big) + '</p></div>' },
      { a: 'oracion', i: 'heart', k: 'Orar', h: 'Oramos por turnos', body: '<div class="turns">' + [['SO', 'Sofi', 'Da gracias por algo lindo de hoy.'], ['TO', 'Tomás', 'Pide por un amigo o por la escuela.'], ['AN', 'Ana', 'Ora por lo que hablaron.'], ['JC', 'Papá', 'Cierra bendiciendo a cada uno por su nombre.']].map(x => '<button class="turn" data-turn>' + av(x[0], x[1], 44) + '<div><b>' + x[1] + '</b><small>' + x[2] + '</small></div><i>' + ic('checkmark') + '</i></button>').join('') + '</div>' }
    ];
    let i = 0;
    L.full((el, m) => {
      const paint = () => {
        const s = steps[i];
        el.innerHTML = '<div class="fl-top"><div class="fl-bars">' + steps.map((_, k) => '<i class="' + (k < i ? 'done' : k === i ? 'now' : '') + '"></i>').join('') + '</div><button class="iconbtn" data-x>' + ic('close') + '</button></div>' +
          '<div class="fl-stage"><div class="fl-body" data-a="' + s.a + '"><div class="fl-head"><div class="aic">' + ic(s.i) + '</div><p class="eyebrow">En familia · ' + s.k + '</p><h1>' + esc(s.h) + '</h1></div>' + s.body + '</div></div>' +
          '<div class="fl-foot" data-a="' + s.a + '"><button class="btn c big" data-n>' + (i < steps.length - 1 ? 'Seguir' : 'Amén') + '</button></div>';
      };
      el.addEventListener('click', e => {
        if (e.target.closest('[data-x]')) { m.dismiss(); return; }
        const tb = e.target.closest('[data-turn]'); if (tb) { tb.classList.toggle('on'); L.haptic(8); return; }
        if (e.target.closest('[data-n]')) {
          if (i < steps.length - 1) { i++; paint(); return; }
          L.S.fam.nights[L.tk()] = 1; L.S.fam.mesa++; L.save(); L.refresh();
          m.dismiss().then(() => L.sheet('<div class="medal"><div class="coin fl">' + ic('home') + '</div><p class="eyebrow">Casa encendida</p><h2>Una noche más juntos</h2><p class="muted">' + L.weekDates(L.today()).filter(d => L.S.fam.nights[L.dk(d)]).length + ' de 4 esta semana</p><button class="btn" data-c>Amén</button></div>',
            { mount: (s, mm) => { s.querySelector('[data-c]').onclick = () => mm.dismiss(); setTimeout(() => L.sparks(s.querySelector('.coin'), 20), 300); } }));
        }
      });
      paint();
    }, { cls: 'flow' });
  }

  /* ---------- un discípulo ---------- */
  function weekRows(p) {
    return L.weekDates(L.today()).map(d => {
      const its = L.discItems(p, d), done = L.discDone(p, d), st = L.discStatus(p, d), n = L.diffDays(d, L.today());
      const off = n < 0 && st !== 'lit';
      const body = off ? '<span class="wtag">' + ic(st === 'grace' ? 'sunny-outline' : 'flame-outline') + (st === 'grace' ? 'Día de gracia' : 'Sin registro') + '</span>'
        : its.map((it, i) => '<i class="wi' + (done[i] ? ' on' : '') + '" data-a="' + it.a + '">' + ic(D.ICON[it.a] + (done[i] ? '' : '-outline')) + '</i>').join('') + (its.some(x => x.with) ? '<span class="tag">Contigo</span>' : '');
      return '<button class="drow' + (n === 0 ? ' now' : n < 0 ? ' past' : '') + '" data-dday="' + L.dk(d) + '"><span class="dd"><b>' + L.DS[d.getDay()] + '</b><span>' + d.getDate() + '</span></span><span class="dits">' + body + '</span>' +
        '<span class="dn">' + (off ? '' : (n <= 0 ? done.filter(Boolean).length + '/' : '') + its.length) + '</span></button>';
    }).join('');
  }
  function locked(p, what) {
    return '<div class="box pad locked"><div class="lk">' + ic('lock-closed') + '</div><b>' + esc(p.first) + ' no comparte ' + what + '</b><p class="muted">Puedes pedírselo. Si acepta, lo verás acá.</p>' +
      '<button class="btn ghost sm" data-ask' + (L.S.asked[p.id] ? ' disabled' : '') + '>' + (L.S.asked[p.id] ? 'Pedido enviado' : 'Pedir permiso') + '</button></div>';
  }
  class PagePersona extends L.Page {
    shell() { this.p = L.person(this.pid); return L.shell({ title: this.p.first, back: '', large: false }); }
    mount() { this.tab = 'hoy'; }
    render() {
      const p = L.person(this.pid), its = L.discItems(p, L.today()), k = p.dToday;
      const head = '<div class="prof">' + av(p.id, p.name, 84, ringOf(p)) + '<h1>' + esc(p.name) + '</h1><p class="muted">' + esc(p.since) + ' · ' + esc(p.focus) + '</p>' +
        '<span class="share-pill">' + ic(p.share ? 'eye-outline' : 'eye-off-outline') + 'Comparte: ' + D.SHARE[p.share].n + '</span></div>' +
        '<div class="qacts">' + [['oracion', 'heart', 'Orar'], ['mensaje', 'chatbubble', 'Escribir'], ['encuentro', 'people', 'Encuentro'], ['diario', 'create', 'Nota']].map(x => '<button data-a="' + x[0] + '" data-q="' + x[0] + '"><span>' + ic(x[1]) + '</span>' + x[2] + '</button>').join('') + '</div>';
      const up = window.Encuentro && Encuentro.upcoming().find(u => u.p.id === p.id);
      const prep = up ? '<button class="addrow" data-prep>' + ic('reader-outline') + 'Preparar · ' + esc(Encuentro.whenLabel(up)) + '</button>' : '';
      const seg = prep + '<div class="sec"></div><div class="fl-seg three">' + [['hoy', 'Hoy'], ['semana', 'Semana'], ['historial', 'Historial']].map(x => '<button class="' + (this.tab === x[0] ? 'on' : '') + '" data-tab="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
      let body = '';
      if (this.tab === 'hoy') {
        if (p.share >= 3) {
          body = '<div class="box pad"><div class="today-sum"><b>' + (k >= its.length ? 'Completó su día' : k ? 'Va ' + k + ' de ' + its.length : 'Todavía no empezó') + '</b><span class="muted">' + esc(p.plan.name) + ' · ' + p.plan.pct + '%</span></div>' +
            '<div class="pbar" data-a="palabra"><i style="width:' + p.plan.pct + '%"></i></div><div class="mini-list">' +
            its.map((it, i) => '<div class="mini" data-a="' + it.a + '"><div class="aic">' + actIc(it.a, i < k) + '</div><div><b>' + esc(it.t) + '</b><small>' + it.h + (it.with ? ' · contigo' : '') + '</small></div>' + (i < k ? ic('checkmark-circle', 'ok') : '<span class="muted sm">pendiente</span>') + '</div>').join('') + '</div></div>';
        } else if (p.share === 2) {
          body = '<div class="box pad center"><span class="bigflame' + (k ? ' on' : '') + '">' + ic('flame') + '</span><b class="bigline">' + (k ? 'Hoy encendió su día' : 'Hoy todavía no') + '</b><p class="muted">Comparte su ritmo, no el detalle.</p></div>';
        } else if (p.share === 1) {
          body = '<div class="box pad center"><span class="sig big ' + p.signal + '">' + D.SIG[p.signal] + '</span><p class="muted">Así dice que está esta semana.</p></div>';
        } else body = locked(p, 'su progreso');
      } else if (this.tab === 'semana') {
        if (p.share >= 3) body = '<p class="lead-note">Lo que tiene planeado, día por día.</p><div class="drows">' + weekRows(p) + '</div>';
        else if (p.share === 2) body = '<div class="box pad"><p class="lead-note">Qué días encendió esta semana.</p><div class="hdots big">' + L.weekDates(L.today()).map(d => { const st = L.discStatus(p, d); return '<span class="' + (st === 'lit' ? 'on' : st) + (L.same(d, L.today()) ? ' now' : '') + '"><i></i>' + L.DL[d.getDay()] + '</span>'; }).join('') + '</div></div>';
        else body = locked(p, 'su semana');
      } else {
        const mine = L.S.log.filter(x => x.who === p.id).map(x => ({ a: x.a, t: D.NAME[x.a], n: L.diffDays(L.fromDk(x.d), L.today()) }));
        const all = mine.concat(p.log.map(x => ({ a: x.a, t: x.t, n: -x.w })));
        body = '<div class="box pad"><div class="mini-list">' + all.map(x => '<div class="mini" data-a="' + x.a + '"><div class="aic">' + actIc(x.a, true) + '</div><div><b>' + esc(x.t) + '</b><small>' + L.cap(L.rel(x.n)) + '</small></div></div>').join('') + '</div></div>';
      }
      const pets = L.S.pets.filter(x => x.who === p.id);
      const petsHTML = pets.length ? '<div class="sec"><h2>Oras por</h2></div><div class="box pad"><div class="mini-list">' + pets.map(x => '<div class="mini" data-a="oracion"><div class="aic">' + ic('heart') + '</div><div><b>' + esc(x.t) + '</b><small>' + x.n + ' veces</small></div>' +
        '<button class="chip' + (L.S.prayedToday[x.id] ? ' on' : '') + '" data-a="oracion" data-pp="' + x.id + '">' + (L.S.prayedToday[x.id] ? 'Hoy' : 'Oré') + '</button></div>').join('') + '</div></div>' : '';
      return head + seg + body + petsHTML + '<p class="hint-swipe">' + ic('lock-closed-outline') + 'Lo decide ' + esc(p.first) + '. Puede cambiarlo cuando quiera.</p>';
    }
    onClick(e) {
      const t = e.target, p = L.person(this.pid); let el;
      if (t.closest('[data-prep]')) { this.push('page-encuentro', { pid: p.id }); return; }
      if ((el = t.closest('[data-tab]'))) { this.tab = el.dataset.tab; this.update(); return; }
      if ((el = t.closest('[data-q]'))) {
        const a = el.dataset.q;
        if (a === 'diario') { L.prompt('Nota sobre ' + p.first, { ph: 'Solo la ves tú' }, v => { p.log.unshift({ a: 'diario', t: v, w: 0 }); L.save(); this.update(); L.toast('Nota guardada', { icon: 'create' }); }); return; }
        quick(a + ':' + p.id); el.querySelector('span').classList.add('pop'); return;
      }
      if ((el = t.closest('[data-dday]'))) { discDay(p, L.fromDk(el.dataset.dday)); return; }
      if (t.closest('[data-ask]')) {
        L.S.asked[p.id] = 1; L.save(); this.update(); L.toast('Le pediste permiso a ' + p.first, { icon: 'paper-plane' });
        setTimeout(() => { p.share = 3; L.save(); L.refresh(); L.toast(p.first + ' aceptó: ahora ves su día y su semana', { icon: 'eye' }); }, 3500);
        return;
      }
      if ((el = t.closest('[data-pp]'))) { window.Oracion && Oracion.pray(+el.dataset.pp); return; }
    }
  }
  L.define('page-persona', PagePersona);

  function discDay(p, d) {
    if (p.share < 3) return;
    const its = L.discItems(p, d), done = L.discDone(p, d), n = L.diffDays(d, L.today()), st = L.discStatus(p, d);
    const off = n < 0 && st !== 'lit';
    L.sheet('<h2 class="sh-title">' + L.longDate(d) + '</h2><p class="sh-sub">' + esc(p.first) + ' · ' + (off ? (st === 'grace' ? 'Día de gracia' : 'Sin registro') : n > 0 ? its.length + ' planeadas' : done.filter(Boolean).length + ' de ' + its.length + ' hechas') + '</p>' +
      '<div class="mini-list">' + its.map((it, i) => '<div class="mini" data-a="' + it.a + '"><div class="aic">' + actIc(it.a, done[i]) + '</div><div><b>' + esc(it.t) + '</b><small>' + it.h + (it.with ? ' · contigo' : '') + '</small></div>' + (done[i] ? ic('checkmark-circle', 'ok') : '') + '</div>').join('') + '</div>' +
      '<p class="lock-note">' + ic('lock-closed-outline') + 'Lo ves porque ' + esc(p.first) + ' comparte «Todo»</p>');
  }

  /* ---------- tu líder y lo que ve de ti ---------- */
  class PageLider extends L.Page {
    shell() { return L.shell({ title: D.LEADER.first, back: '', large: false }); }
    render() {
      const S = L.S, lv = S.myShare, its = L.todayItems(), k = L.doneCount();
      const preview = lv >= 3 ? 'Hoy ' + k + ' de ' + its.length + ' · ve tu semana' : lv === 2 ? (L.litToday() ? 'Hoy encendió su día' : 'Hoy todavía no') : lv === 1 ? 'Esta semana: ' + D.SIG[S.mySignal || 'bien'] : 'No comparte su progreso';
      return '<div class="prof">' + av(D.LEADER.id, D.LEADER.name, 84) + '<h1>' + esc(D.LEADER.name) + '</h1><p class="muted">' + esc(D.LEADER.role) + ' · te acompaña</p><span class="share-pill">' + ic('calendar-outline') + 'Próximo: ' + esc(D.LEADER.next) + '</span></div>' +
        '<div class="qacts">' + [['mensaje', 'chatbubble', 'Escribir'], ['oracion', 'heart', 'Pedir oración'], ['encuentro', 'calendar', 'Agendar']].map(x => '<button data-a="' + x[0] + '" data-lq="' + x[0] + '"><span>' + ic(x[1]) + '</span>' + x[2] + '</button>').join('') + '</div>' +
        '<div class="sec"><h2>Tu señal esta semana</h2></div><div class="chips sigs">' + Object.keys(D.SIG).map(s => '<button class="chip sig-c ' + s + ((S.mySignal || 'bien') === s ? ' on' : '') + '" data-sig="' + s + '">' + D.SIG[s] + '</button>').join('') + '</div>' +
        '<div class="sec"><h2>Qué ve ' + esc(D.LEADER.first) + ' de ti</h2></div><div class="opts">' + D.SHARE.map((s, i) => '<button class="opt' + (i === lv ? ' on' : '') + '" data-share="' + i + '"><span class="radio"></span><div><b>' + s.n + '</b><small>' + s.d + '</small></div></button>').join('') + '</div>' +
        '<div class="preview"><p class="eyebrow">Así te ve</p><div class="mini">' + av('JC', 'Juan Carlos', 40, lv >= 2 && L.litToday() ? 'lit' : 'dim') + '<div><b>Juan Carlos</b><small>' + esc(preview) + '</small></div></div></div>';
    }
    onClick(e) {
      const t = e.target; let el;
      if ((el = t.closest('[data-share]'))) { L.S.myShare = +el.dataset.share; L.save(); L.refresh(); L.haptic(8); return; }
      if ((el = t.closest('[data-sig]'))) { L.S.mySignal = el.dataset.sig; L.save(); L.refresh(); if (el.dataset.sig === 'hablar') L.toast('Esteban recibe tu señal y te escribe', { icon: 'chatbubble' }); return; }
      if ((el = t.closest('[data-lq]'))) {
        const a = el.dataset.lq;
        if (a === 'oracion') { L.prompt('Pedir oración a Esteban', { ph: '¿Por qué quieres que ore?' , ok: 'Enviar' }, () => L.toast('Esteban va a orar por ti', { icon: 'heart' })); return; }
        L.toast(a === 'mensaje' ? 'Abrimos tu chat con Esteban' : 'Le propusiste el martes 19:00', { icon: a === 'mensaje' ? 'chatbubble' : 'calendar' });
      }
    }
  }
  L.define('page-lider', PageLider);

  /* ---------- un canal del foro ---------- */
  class PageCanal extends L.Page {
    shell() {
      this.c = D.CHANNELS.find(x => x.id === this.ch);
      return '<ion-header translucent="true"><ion-toolbar><ion-buttons slot="start"><ion-back-button text="" default-href="#"></ion-back-button></ion-buttons><ion-title>' + esc(this.c.n) + '</ion-title></ion-toolbar></ion-header>' +
        '<ion-content fullscreen="true"><div class="pg canal" data-a="' + this.c.a + '"></div></ion-content>' +
        '<ion-footer class="compose"><div class="cbar"><input type="text" placeholder="' + (this.ch === 'oracion' ? '¿Por qué podemos orar?' : 'Escribe al canal') + '" data-in enterkeyhint="send"><button class="iconbtn send" data-send aria-label="Enviar">' + ic('arrow-up') + '</button></div></ion-footer>';
    }
    mount() {
      this.addEventListener('ionViewWillEnter', () => document.querySelector('ion-tabs').classList.add('notabs'));
      this.addEventListener('ionViewWillLeave', () => document.querySelector('ion-tabs').classList.remove('notabs'));
      this.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('[data-in]')) this.send(); });
      setTimeout(() => { L.S.posts.forEach(p => { if (p.ch === this.ch) L.S.seen[p.id] = 1; }); L.save(); L.refresh(); }, 600);
    }
    render() {
      const S = L.S, posts = S.posts.filter(p => p.ch === this.ch).sort((a, b) => a.w - b.w);
      return '<p class="lead-note">' + esc(this.c.d) + '</p>' + posts.map(p => {
        let act = '';
        if (this.ch === 'oracion') {
          const on = !!S.praying[p.id];
          act = '<button class="pray-btn' + (on ? ' on' : '') + '" data-praying="' + p.id + '">' + ic(on ? 'heart' : 'heart-outline') + (on ? 'Estás orando' : 'Estoy orando') + '<b>' + ((p.pray || 0) + (on ? 1 : 0)) + '</b></button>';
        } else {
          const keys = Object.keys(p.rx || { amen: 0 });
          act = '<div class="rxs">' + keys.map(k => { const on = !!S.rx[p.id + ':' + k]; return '<button class="rx' + (on ? ' on' : '') + '" data-rx="' + p.id + ':' + k + '">' + D.RX[k] + ' <b>' + ((p.rx[k] || 0) + (on ? 1 : 0)) + '</b></button>'; }).join('') + '</div>';
        }
        const replies = (p.replies || []).map(r => '<div class="reply">' + av(r.by, memberName(r.by), 28) + '<div><b>' + esc(memberName(r.by)) + '</b><p>' + esc(r.t) + '</p></div></div>').join('');
        return '<article class="post' + (p.by === 'JC' ? ' mine' : '') + '"><header>' + (p.by === 'anon' ? '<span class="av anon" style="--s:36px">' + ic('person') + '</span>' : av(p.by, memberName(p.by), 36)) +
          '<div><b>' + esc(memberName(p.by)) + '</b><small>' + (p.w ? L.ago(p.w) : 'ahora') + '</small></div></header><p>' + esc(p.t) + '</p>' + act + replies + '</article>';
      }).join('');
    }
    send() {
      const inp = this.querySelector('[data-in]'), t = inp.value.trim(); if (!t) return;
      L.S.posts.push({ id: Date.now(), ch: this.ch, by: 'JC', w: 0, t, rx: this.ch === 'oracion' ? undefined : { amen: 0 }, pray: 0 });
      inp.value = ''; L.save(); this.update(); L.haptic(8);
      L.toast(this.ch === 'oracion' ? 'Publicado. Te avisamos cuando oren' : 'Publicado', { icon: 'checkmark' });
    }
    onClick(e) {
      const t = e.target; let el;
      if (t.closest('[data-send]')) { this.send(); return; }
      if ((el = t.closest('[data-praying]'))) {
        const id = el.dataset.praying, S = L.S;
        if (S.praying[id]) delete S.praying[id]; else { S.praying[id] = 1; S.stats.prayOthers++; L.toast('Le avisamos que oras', { icon: 'heart' }); L.checkAch(); }
        L.save(); this.update(); L.haptic(8); return;
      }
      if ((el = t.closest('[data-rx]'))) { const k = el.dataset.rx; if (L.S.rx[k]) delete L.S.rx[k]; else L.S.rx[k] = 1; L.save(); this.update(); L.haptic(6); return; }
    }
  }
  L.define('page-canal', PageCanal);
})();
