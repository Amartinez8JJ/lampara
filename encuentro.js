/* Lights · Antes del encuentro
   Antes de verte con un discípulo: cómo viene (según lo que comparte), lo que acordaron, por qué oras y de qué conversar.
   Después: anotas los acuerdos y quedan para la próxima. */
(() => {
  const { esc, ic, actIc, av } = L;

  /* encuentros 1 a 1 de tu rutina en los próximos 7 días */
  function upcoming() {
    const t = L.today(), out = [];
    for (let i = 0; i < 7; i++) {
      const d = L.addDays(t, i);
      L.itemsFor(d).forEach(it => { const p = it.with && L.person(it.with); if (it.a === 'encuentro' && p) out.push({ d, it, p, n: i }); });
    }
    return out;
  }
  const whenLabel = u => (u.n === 0 ? 'Hoy' : u.n === 1 ? 'Mañana' : L.cap(L.DN[u.d.getDay()])) + ' · ' + u.it.h;
  const pushHere = (tag, props) => { const nav = document.getElementById('nav-' + L.tab()); return nav && nav.push(tag, props); };
  /* cómo viene en los últimos 7 días, sin mostrar más de lo que comparte */
  function howHTML(p) {
    const days = []; for (let i = 6; i >= 0; i--) days.push(L.addDays(L.today(), -i));
    const st = days.map(d => L.discStatus(p, d)), lit = st.filter(s => s === 'lit').length;
    const dots = '<div class="hdots">' + days.map((d, i) => '<span class="' + (st[i] === 'lit' ? 'on' : st[i]) + '"><i></i>' + L.DL[d.getDay()] + '</span>').join('') + '</div>';
    if (p.share >= 3) return '<div class="how"><b>' + lit + ' de 7 días encendidos</b><span class="muted">Va por ' + esc(p.plan.name) + ' · ' + p.plan.pct + '%</span></div>' + dots;
    if (p.share === 2) return '<div class="how"><b>' + lit + ' de 7 días encendidos</b><span class="muted">Comparte su ritmo</span></div>' + dots;
    if (p.share === 1) return '<div class="how"><b>Esta semana dice:</b><span class="sig ' + p.signal + '">' + D.SIG[p.signal] + '</span></div>';
    return '<div class="how"><b>No comparte su progreso</b><span class="muted">Pregúntale cómo viene.</span></div>';
  }

  class PageEncuentro extends L.Page {
    shell() { return L.shell({ title: 'Antes del encuentro', back: '', large: false }); }
    mount() { this.used = {}; }
    render() {
      const S = L.S, p = L.person(this.pid), u = upcoming().find(x => x.p.id === p.id);
      const last = p.last, ago = last ? -L.diffDays(L.fromDk(last.d), L.today()) : 0;
      const pets = S.pets.filter(x => x.who === p.id);
      const qs = D.QUESTIONS[p.id] || [];
      return '<div class="prof enc">' + av(p.id, p.name, 72) + '<h1>' + esc(u ? u.it.t : 'Encuentro con ' + p.first) + '</h1>' +
        '<span class="share-pill">' + ic('calendar-outline') + esc(u ? whenLabel(u) : 'Sin fecha') + '</span></div>' +
        '<div class="sec"><h2>Cómo viene</h2></div><div class="box pad">' + howHTML(p) + '</div>' +
        (last ? '<div class="sec"><h2>La última vez</h2><span class="muted">hace ' + ago + ' días</span></div><div class="box pad">' +
          (last.notes ? '<p class="enc-note">' + ic('document-text-outline') + '<span>' + esc(last.notes) + '</span></p>' : '') +
          '<p class="eyebrow">Acordaron · ¿lo cumplió?</p><div class="agrees">' + last.agree.map((a, i) => { const ok = !!S.agreeOk[p.id + ':' + i]; return '<button class="agree' + (ok ? ' on' : '') + '" data-ok="' + i + '"><i>' + ic('checkmark') + '</i>' + esc(a) + '</button>'; }).join('') + '</div></div>' : '') +
        (pets.length ? '<div class="sec"><h2>Oras por</h2></div><div class="box pad"><div class="mini-list">' + pets.map(x => '<div class="mini" data-a="oracion"><div class="aic">' + actIc('oracion', true) + '</div><div><b>' + esc(x.t) + '</b><small>Desde ' + L.rel(L.diffDays(L.fromDk(x.since), L.today())) + ' · ' + x.n + ' veces</small></div></div>').join('') + '</div></div>' : '') +
        (qs.length ? '<div class="sec"><h2>Para conversar</h2><span class="muted">toca las que ya hablaron</span></div><div class="qs">' + qs.map((q, i) => '<button class="q' + (this.used[i] ? ' on' : '') + '" data-q="' + i + '"><span>' + (this.used[i] ? ic('checkmark') : i + 1) + '</span>' + esc(q) + '</button>').join('') + '</div>' : '') +
        '<div class="sticky-act"><button class="btn big" data-end>' + ic('checkmark-done') + 'Terminó el encuentro</button></div>';
    }
    onClick(e) {
      const t = e.target, p = L.person(this.pid); let el;
      if ((el = t.closest('[data-ok]'))) { const k = p.id + ':' + el.dataset.ok; if (L.S.agreeOk[k]) delete L.S.agreeOk[k]; else L.S.agreeOk[k] = 1; L.save(); el.classList.toggle('on'); L.haptic(8); return; }
      if ((el = t.closest('[data-q]'))) { const i = +el.dataset.q; this.used[i] = !this.used[i]; this.update(); L.haptic(6); return; }
      if (t.closest('[data-end]')) { finish(p, this); return; }
    }
  }
  L.define('page-encuentro', PageEncuentro);

  /* después: acuerdos, notas y la próxima vez */
  function finish(p, page) {
    const pick = new Set();
    let next = 7;
    L.sheet('<h2 class="sh-title">¿Cómo les fue con ' + esc(p.first) + '?</h2><p class="sh-sub">Queda para la próxima vez.</p>' +
      '<div class="fld"><span>Acordaron</span><div class="chips agree-sug">' + D.AGREE_SUG.map((a, i) => '<button class="chip" data-s="' + i + '">' + esc(a) + '</button>').join('') + '</div></div>' +
      '<label class="fld"><span>Otro acuerdo</span><input data-own placeholder="Ej: leer Romanos 9"></label>' +
      '<label class="fld"><span>Notas · solo las ves tú</span><textarea class="fl-text" rows="3" data-notes placeholder="Lo que te quedó de la charla"></textarea></label>' +
      '<div class="fld"><span>Próximo encuentro</span><div class="chips"><button class="chip on" data-n="7">En una semana</button><button class="chip" data-n="14">En 15 días</button><button class="chip" data-n="0">Sin fecha</button></div></div>' +
      '<button class="btn" data-save>Guardar</button>', {
      mount: (el, m) => el.addEventListener('click', e => {
        let b;
        if ((b = e.target.closest('[data-s]'))) { const a = D.AGREE_SUG[+b.dataset.s]; if (pick.has(a)) pick.delete(a); else pick.add(a); b.classList.toggle('on'); L.haptic(6); return; }
        if ((b = e.target.closest('[data-n]'))) { next = +b.dataset.n; el.querySelectorAll('[data-n]').forEach(x => x.classList.toggle('on', x === b)); return; }
        if (e.target.closest('[data-save]')) {
          const own = el.querySelector('[data-own]').value.trim(); if (own) pick.add(own);
          const S = L.S;
          p.last = { d: L.tk(), notes: el.querySelector('[data-notes]').value.trim(), agree: [...pick] };
          Object.keys(S.agreeOk).forEach(k => { if (k.startsWith(p.id + ':')) delete S.agreeOk[k]; });
          S.log.unshift({ who: p.id, a: 'encuentro', d: L.tk() });
          const it = L.todayItems().find(i => i.a === 'encuentro' && i.with === p.id && !L.isDone(i.id));
          if (it) L.setDone(it.id, true, { quiet: true });
          L.save(); L.refresh();
          m.dismiss().then(() => {
            page.pop();
            L.sheet('<div class="medal" data-a="encuentro"><div class="coin">' + ic('people') + '</div><p class="eyebrow">Encuentro anotado</p><h2>' + esc(p.first) + ' y tú</h2><p class="muted">' +
              (pick.size ? pick.size + (pick.size === 1 ? ' acuerdo' : ' acuerdos') + ' para la próxima' : 'Queda en su historial') + (next ? ' · te recordamos en ' + (next === 7 ? 'una semana' : '15 días') : '') + '</p><button class="btn c" data-c>Amén</button></div>',
              { mount: (s, mm) => { s.querySelector('[data-c]').onclick = () => mm.dismiss(); setTimeout(() => L.sparks(s.querySelector('.coin'), 18), 300); } });
          });
        }
      })
    });
  }

  /* en Hoy: si hoy o mañana te ves con alguien, la tarjeta de contexto te invita a prepararte */
  L.ctxCard({
    id: 'encuentro',
    pri: () => { const u = upcoming()[0]; return u && u.n <= 1 && !L.isDone(u.it.id) ? (u.n === 0 ? 3 : 1.5) : 0; },
    html: () => { const u = upcoming()[0];
      return '<div class="ctxc" data-a="encuentro"><div class="ctxc-top">' + av(u.p.id, u.p.name, 44) + '<div><p class="eyebrow">' + esc(whenLabel(u)) + '</p><b>' + esc(u.it.t) + '</b></div></div>' +
        '<p class="muted">Mira cómo viene y de qué conversar. Un minuto.</p><button class="btn c sm" data-ctx="encuentro" data-pid="' + u.p.id + '">' + ic('reader-outline') + 'Preparar el encuentro</button></div>'; },
    click: el => pushHere('page-encuentro', { pid: el.dataset.pid })
  });

  window.Encuentro = { upcoming, whenLabel, open: pid => pushHere('page-encuentro', { pid }) };
})();
