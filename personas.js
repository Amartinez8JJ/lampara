/* Lights · Personas
   Tres lugares: Discipulado (a quién acompañas y quién te acompaña), Familia (la mesa y la pareja) e Iglesia (el foro).
   Lo que ves de cada discípulo lo decide él: Nada · Señal · Ritmo · Todo. */
(() => {
  const { esc, ic, actIc, av } = L;
  const SEGS = [['discipulado', 'Discipulado'], ['familia', 'Familia'], ['iglesia', 'Iglesia']];

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
    if (p.share >= 3) return '<span class="ddots" slot="end">' + its.map((it, i) => '<i data-a="' + it.a + '" class="' + (i < k ? 'on' : '') + '"></i>').join('') + '</span>';
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

  class PagePersonas extends L.Page {
    shell() {
      return L.shell({ title: 'Personas', end: '<ion-button data-anotar aria-label="Anotar">' + ic('add-circle', 'tb-ic') + '</ion-button>', top: '<div class="segw"><ion-segment value="discipulado" data-seg>' + SEGS.map(s => '<ion-segment-button value="' + s[0] + '"><ion-label>' + s[1] + '</ion-label></ion-segment-button>').join('') + '</ion-segment></div>' });
    }
    mount() {
      this.seg = 'discipulado';
      this.addEventListener('ionChange', e => { if (e.target.matches('[data-seg]')) { this.seg = e.detail.value; this.update(); } });
      this.addEventListener('ionSwipe', e => { const o = e.target.querySelector('[data-qa]'); if (o) quick(o.dataset.qa); });
      L.on('personas:seg', s => { this.seg = s; const sg = this.querySelector('[data-seg]'); if (sg) sg.value = s; this.update(); });
    }
    /* Familia e Iglesia son módulos aparte (familia.js, iglesia.js) que se registran en L.pseg */
    render() { const m = L.pseg[this.seg]; return m ? m.render(this) : discipuladoHTML(); }
    after() { const m = L.pseg[this.seg]; m && m.after && m.after(this); L.setBadge('personas', Object.values(L.pseg).some(x => x.badge && x.badge())); }
    onClick(e) {
      const t = e.target; let el;
      if (t.closest('[data-anotar]')) { anotar(); return; }
      const mod = L.pseg[this.seg]; if (mod && mod.click && mod.click(e, this)) return;
      if ((el = t.closest('[data-qa]'))) { quick(el.dataset.qa); return; }
      if ((el = t.closest('[data-prep]'))) { this.push('page-encuentro', { pid: el.dataset.prep }); return; }
      if ((el = t.closest('[data-person]'))) { this.push('page-persona', { pid: el.dataset.person }); return; }
      if (t.closest('[data-lider]')) { this.push('page-lider'); return; }
      if (t.closest('[data-invite]')) { invite(); return; }
    }
  }
  L.define('page-personas', PagePersonas);

  /* atajos: oré / escribí / encuentro */
  function quick(spec) {
    const [a, id] = spec.split(':'), p = L.person(id) || { first: id };
    L.S.log.unshift({ who: id, a, d: L.tk() });
    if (a === 'oracion') L.S.stats.prayOthers++;
    L.save(); L.haptic(10); L.refresh();
    L.toast(a === 'oracion' ? 'Oraste por ' + p.first : a === 'mensaje' ? 'Le escribiste a ' + p.first : 'Anotaste un encuentro con ' + p.first, { icon: { oracion: 'heart', mensaje: 'chatbubble', encuentro: 'people', palabra: 'book' }[a] || 'checkmark' });
    L.checkAch();
  }
  /* Anotar (el «＋ Anotar» de v3): con quién y qué hiciste, en dos toques */
  const LOGA = [['oracion', 'Oré'], ['mensaje', 'Mensaje'], ['encuentro', 'Encuentro'], ['palabra', 'Estudio']];
  function anotar(pre) {
    const who = new Set(pre ? [pre] : []), what = new Set();
    const ppl = L.S.people.map(p => [p.id, p.first, p.name]).concat([[D.LEADER.id, D.LEADER.first, D.LEADER.name], ['AN', 'Ana', 'Ana'], ['TO', 'Tomás', 'Tomás'], ['SO', 'Sofi', 'Sofi']]);
    L.sheet('<h2 class="sh-title">Anotar</h2><p class="sh-sub">¿Con quién y qué hiciste?</p>' +
      '<div class="who-pick">' + ppl.map(p => '<button class="' + (who.has(p[0]) ? 'on' : '') + '" data-w="' + p[0] + '">' + av(p[0], p[2], 46) + '<small>' + esc(p[1]) + '</small></button>').join('') + '</div>' +
      '<div class="tiles what-pick">' + LOGA.map(x => '<button class="tile" data-a="' + x[0] + '" data-x="' + x[0] + '"><span class="aic">' + actIc(x[0], true) + '</span>' + x[1] + '</button>').join('') + '</div>' +
      '<label class="fld"><input data-note placeholder="Nota (opcional)"></label><button class="btn" data-save disabled>Anotar</button>', {
      mount: (el, m) => {
        const ok = () => { el.querySelector('[data-save]').disabled = !(who.size && what.size); };
        el.addEventListener('click', e => {
          let b;
          if ((b = e.target.closest('[data-w]'))) { const id = b.dataset.w; who.has(id) ? who.delete(id) : who.add(id); b.classList.toggle('on'); L.haptic(6); ok(); return; }
          if ((b = e.target.closest('[data-x]'))) { const a = b.dataset.x; what.has(a) ? what.delete(a) : what.add(a); b.classList.toggle('on'); L.haptic(6); ok(); return; }
          if (e.target.closest('[data-save]')) {
            const note = el.querySelector('[data-note]').value.trim(), S = L.S, added = [];
            who.forEach(w => what.forEach(a => { const x = { who: w, a, d: L.tk(), note }; S.log.unshift(x); added.push(x); if (a === 'oracion') S.stats.prayOthers++; }));
            L.save(); L.refresh(); m.dismiss(); L.checkAch();
            const names = [...who].map(w => (ppl.find(p => p[0] === w) || [0, w])[1]);
            L.toast('Anotado con ' + (names.length > 2 ? names.slice(0, 2).join(', ') + ' y ' + (names.length - 2) + ' más' : names.join(' y ')), { icon: 'checkmark', undo: () => { S.log = S.log.filter(x => !added.includes(x)); L.save(); L.refresh(); } });
          }
        });
      }
    });
  }
  L.anotar = anotar;
  /* animar (de v3): le llega tu ánimo y a veces responde */
  const CHEER_BACK = { MA: 'María: ¡Gracias! Hoy me costó, esto me ayuda.', DV: 'Daniel: Gracias, hermano. Orá por mi jueves.', SR: 'Sofía: Gracias por acordarte de mí.', LO: 'Lucas: ¡Amén! Ya voy por Juan 5.' };
  function cheer(p, btn) {
    const S = L.S; S.cheered = S.cheered || {};
    if (S.cheered[p.id + '@' + L.tk()]) { L.toast('Ya le mandaste ánimo hoy'); return; }
    S.cheered[p.id + '@' + L.tk()] = 1; S.log.unshift({ who: p.id, a: 'mensaje', d: L.tk(), note: 'Ánimo' }); L.save();
    L.sparks(btn, 12); L.haptic([8, 30, 10]); L.toast('Le mandaste ánimo a ' + p.first, { icon: 'sparkles' });
    setTimeout(() => L.toast(CHEER_BACK[p.id] || p.first + ': ¡Gracias!', { icon: 'chatbubble' }), 2600);
  }
  function invite() {
    L.sheet('<div class="medal"><div class="coin fl">' + ic('person-add') + '</div><h2>Invitar a alguien</h2><p class="muted">Le llega un enlace. Al aceptar, elige qué quiere compartir contigo.</p><button class="btn" data-ok>' + ic('share-outline') + 'Compartir enlace</button></div>',
      { mount: (el, m) => { el.querySelector('[data-ok]').onclick = () => { m.dismiss(); L.toast('Enlace copiado', { icon: 'link' }); }; } });
  }
  /* ---------- un discípulo ---------- */
  function weekRows(p) {
    return L.weekDates(L.today()).map(d => {
      const its = L.discItems(p, d), done = L.discDone(p, d), st = L.discStatus(p, d), n = L.diffDays(d, L.today());
      const off = n < 0 && st !== 'lit';
      const body = off ? '<span class="wtag">' + ic(st === 'grace' ? 'sunny-outline' : 'flame-outline') + (st === 'grace' ? 'Día de gracia' : 'Sin registro') + '</span>'
        : its.map((it, i) => '<i class="wi' + (done[i] ? ' on' : '') + '" data-a="' + it.a + '">' + ic(D.ICON[it.a]) + '</i>').join('') + (its.some(x => x.with) ? '<span class="tag">Contigo</span>' : '');
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
        '<div class="qacts">' + [['oracion', 'heart', 'Orar'], ['adoracion', 'sparkles', 'Animar'], ['mensaje', 'chatbubble', 'Escribir'], ['diario', 'create', 'Nota']].map(x => '<button data-a="' + x[0] + '" data-q="' + x[0] + '"><span>' + ic(x[1]) + '</span>' + x[2] + '</button>').join('') + '</div>';
      /* cuándo se vieron y se escribieron por última vez (lo mide al líder, no al discípulo) */
      const lastOf = a => { const mine = L.S.log.find(x => x.who === p.id && x.a === a); if (mine) return -L.diffDays(L.fromDk(mine.d), L.today()); const seed = p.log.find(x => x.a === a); return seed ? seed.w : null; };
      const pill = (a, label) => { const n = lastOf(a); return n == null ? '' : '<span class="share-pill" data-a="' + a + '"><i class="pdot"></i>' + label + ' ' + (n === 0 ? 'hoy' : n === 1 ? 'ayer' : 'hace ' + n + ' días') + '</span>'; };
      const contact = '<div class="contact-pills">' + pill('encuentro', 'Se vieron') + pill('mensaje', 'Le escribiste') + '</div>';
      const shared = L.S.plans.filter(x => (x.people || []).includes(p.id));
      const together = shared.length ? '<div class="sec"><h2>Planes juntos</h2></div>' + shared.map(x => '<div class="box pad together" data-a="' + x.acts[0] + '"><span class="aic">' + actIc(x.acts[0], true) + '</span><div><b>' + esc(x.name) + '</b><small>Día ' + Math.min(x.len, Math.max(1, L.planDay(x, L.today()))) + ' de ' + x.len + ' · los dos</small></div></div>').join('') : '';
      const up = window.Encuentro && Encuentro.upcoming().find(u => u.p.id === p.id);
      const prep = up ? '<button class="addrow" data-prep>' + ic('reader-outline') + 'Preparar · ' + esc(Encuentro.whenLabel(up)) + '</button>' : '';
      const seg = contact + prep + '<div class="sec"></div><div class="fl-seg three">' + [['hoy', 'Hoy'], ['semana', 'Semana'], ['historial', 'Historial']].map(x => '<button class="' + (this.tab === x[0] ? 'on' : '') + '" data-tab="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
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
      return head + seg + body + together + petsHTML + '<p class="hint-swipe">' + ic('lock-closed-outline') + 'Lo decide ' + esc(p.first) + '. Puede cambiarlo cuando quiera.</p>';
    }
    onClick(e) {
      const t = e.target, p = L.person(this.pid); let el;
      if (t.closest('[data-prep]')) { this.push('page-encuentro', { pid: p.id }); return; }
      if ((el = t.closest('[data-tab]'))) { this.tab = el.dataset.tab; this.update(); return; }
      if ((el = t.closest('[data-q]'))) {
        const a = el.dataset.q;
        if (a === 'adoracion') { cheer(p, el); return; }
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

})();
