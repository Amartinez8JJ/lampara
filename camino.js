/* Lights · Tu camino (se abre desde tu foto o la llama)
   La llama de la semana, logros, los 66 libros, lo que sabes de memoria, lo que te llevas y tu privacidad. */
(() => {
  const { esc, ic, av } = L;
  const BOOK_TOTAL = D.BOOKS.length;

  /* historial como calendario de formas (How We Feel): cada día muestra las formas de lo que hiciste */
  function dayShapes(d) {
    const st = L.dayStatus(d);
    if (st !== 'lit') return { st, acts: [] };
    const acts = L.dayDone(d).map(i => i.a);
    return { st, acts: [...new Set(acts)].slice(0, 4) };
  }
  function streakCard() {
    const t = L.today(), start = L.addDays(L.weekStart(t), -21), days = [];
    for (let i = 0; i < 28; i++) days.push(L.addDays(start, i));
    const cells = days.map(d => { const x = dayShapes(d); return '<div class="cd ' + x.st + (L.same(d, t) ? ' now' : '') + '"><small>' + d.getDate() + '</small><span class="shp">' +
      x.acts.map(a => '<i data-a="' + a + '"></i>').join('') + '</span></div>'; }).join('');
    return '<div class="streak-card"><div class="sc-top"><b>' + L.weekLit() + ' de ' + L.GOAL + ' esta semana</b><span>' + L.S.stats.weeksLit + ' semanas encendidas</span></div>' +
      '<div class="cal">' + L.WEEK.map(w => '<span class="dh">' + L.DL[w] + '</span>').join('') + cells + '</div>' +
      '<p class="fine">' + ic('sunny-outline') + 'La llama nunca se apaga: un día de gracia por semana.</p></div>';
  }
  function achHTML() {
    return '<div class="coins">' + D.ACH.map(a => {
      const got = L.achEarned(a), [v, g] = L.achProg(a);
      return '<button class="coin-b' + (got ? ' got' : '') + '" data-ach="' + a.id + '" data-a="' + (a.a || '') + '"><span class="coin-m' + (a.a ? '' : ' fl') + '">' + ic(a.i) + (got ? '' : '<svg class="prog" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" style="stroke-dasharray:' + (100.5 * v / g).toFixed(1) + ' 101"/></svg>') + '</span><small>' + esc(a.t) + '</small></button>';
    }).join('') + '</div>';
  }
  function booksHTML() {
    const R = L.S.read, full = Math.min(...D.BOOKS.map(b => R[b[0]] || 1));
    const cell = b => { const n = R[b[0]] || 1; return '<i class="bk n' + Math.min(n, 3) + '" title="' + esc(b[0]) + '"></i>'; };
    return '<button class="box pad books" data-books><div class="books-top"><b>Leíste la Biblia ' + (full === 1 ? 'completa una vez' : full + ' veces') + '</b><span class="muted">2ª vuelta: ' + D.BOOKS.filter(b => (R[b[0]] || 1) >= 2).length + ' de ' + BOOK_TOTAL + '</span></div>' +
      '<div class="bgrid"><div>' + D.BOOKS.slice(0, D.AT).map(cell).join('') + '</div><div>' + D.BOOKS.slice(D.AT).map(cell).join('') + '</div></div>' +
      '<div class="legend"><span><i class="bk n1"></i>1 vez</span><span><i class="bk n2"></i>2</span><span><i class="bk n3"></i>3 o más</span>' + ic('chevron-forward', 'chev') + '</div></button>';
  }
  /* tu llama y todas sus etapas: las que ya tuviste a color, las que vienen en silueta */
  function llamaHTML() {
    const ld = L.litDays(), ti = L.tierOf(ld), T = L.TIERS[ti], NX = L.TIERS[ti + 1];
    const prog = NX ? (ld - T.d) / (NX.d - T.d) : 1;
    return '<div class="llama-card" style="--tc:' + T.c + '"><div class="lc-fl">' + L.llama(ti) + '</div><div class="lc-tx"><p class="eyebrow">Tu llama</p><h3>' + esc(T.n) + '</h3>' +
      '<p><b>' + ld + '</b> días encendidos</p><i class="lc-bar"><s style="width:' + Math.round(prog * 100) + '%"></s></i><small>' + (NX ? (NX.d - ld === 1 ? 'Falta 1 día' : 'Faltan ' + (NX.d - ld) + ' días') + ' para ' + esc(NX.n) : 'Llegaste a la última') + '</small></div></div>' +
      '<div class="tiers">' + L.TIERS.map((x, k) => '<div class="tr' + (k <= ti ? ' got' : '') + (k === ti ? ' now' : '') + '" style="--tc:' + x.c + '"><span>' + L.llama(k) + '</span><b>' + esc(x.n) + '</b><small>' + (x.d ? x.d + ' días' : 'el primero') + '</small></div>').join('') + '</div>' +
      '<p class="fine">' + ic('sunny-outline') + 'Los días encendidos nunca bajan: si un día no la prendes, tu llama te espera.</p>';
  }
  L.llamaSheet = () => L.sheet(llamaHTML(), { cls: 'llama-sheet' });
  const stars = l => '<span class="stars">' + [1, 2, 3].map(i => ic(i <= l ? 'star' : 'star-outline')).join('') + '</span>';

  class PageCamino extends L.Page {
    shell() { return L.shell({ title: 'Tu camino', large: false, end: '<ion-button data-close>Listo</ion-button>' }); }
    render() {
      const S = L.S;
      return '<div class="prof me">' + av('JC', D.ME.name, 72, L.litToday() ? 'lit' : 'dim') + '<h1>' + esc(D.ME.name) + '</h1><p class="muted">' + (D.ME.since + S.off) + ' días caminando</p></div>' +
        llamaHTML() +
        L.resumenCard() +
        '<div class="sec"><h2>Tus semanas</h2></div>' + streakCard() + '<button class="addrow" data-repaso>' + ic('ribbon') + 'Repaso de la semana</button>' +
        '<div class="sec"><h2>Logros</h2><span class="muted">' + D.ACH.filter(L.achEarned).length + ' de ' + D.ACH.length + '</span></div>' + achHTML() +
        '<div class="sec"><h2>Tu Biblia</h2></div>' + booksHTML() +
        '<div class="sec"><h2>De memoria</h2><span class="muted">' + S.memo.filter(m => m.lvl >= 3).length + ' versículos</span></div><ion-list inset="true" lines="inset">' + S.memo.map((m, i) => '<ion-item button detail="false" data-memo="' + i + '"><ion-label><h3>' + esc(m.r) + '</h3><p>' + esc(m.t) + '</p></ion-label><span slot="end">' + stars(m.lvl) + '</span></ion-item>').join('') + '</ion-list>' +
        '<div class="sec"><h2>Lo que me llevo</h2><span class="muted">desliza</span></div><div class="journal">' + S.keeps.slice(0, 8).map(k => '<div class="jcard" data-a="' + k.a + '"><span class="k">' + ic(D.ICON[k.a] || 'bookmark') + (k.a === 'diario' ? 'Tu diario' : k.a === 'meditar' ? 'Meditaste' : 'Te llevaste') + '</span><p>' + (k.r ? '«' + esc(k.t) + '»' : esc(k.t)) + '</p><small>' + (k.r ? esc(k.r) + ' · ' : '') + L.cap(L.rel(L.diffDays(L.fromDk(k.d), L.today()))) + '</small></div>').join('') + '</div>' +
        '<div class="sec"><h2>Privacidad</h2></div><ion-list inset="true" lines="inset"><ion-item button detail="true" data-priv><div class="aic" slot="start" data-a="">' + ic('eye-outline') + '</div><ion-label><h3>Qué ve ' + esc(D.LEADER.first) + ' de ti</h3><p>' + D.SHARE[S.myShare].n + ' · ' + D.SHARE[S.myShare].d + '</p></ion-label></ion-item></ion-list>' +
        '<div class="sec"><h2>Apariencia</h2><span class="muted">' + (L.theme.get() === 'auto' ? 'Sigue a tu celular' : '') + '</span></div><div class="theme-opts">' +
          [['auto', 'Automático', 'a'], ['light', 'Claro', 'l'], ['dark', 'Oscuro', 'd']].map(x => '<button class="' + (L.theme.get() === x[0] ? 'on' : '') + '" data-theme="' + x[0] + '"><span class="sw ' + x[2] + '"><i></i></span>' + x[1] + '</button>').join('') + '</div>' +
        '<div class="sec"><h2>Probar la demo</h2></div><div class="row2"><button class="btn ghost" data-next>' + ic('play-forward') + 'Día siguiente</button><button class="btn ghost" data-reset>' + ic('refresh') + 'Reiniciar</button></div>';
    }
    onClick(e) {
      const t = e.target; let el;
      if (t.closest('[data-close]')) { this.closest('ion-modal').dismiss(); return; }
      if ((el = t.closest('[data-ach]'))) { achSheet(D.ACH.find(a => a.id === el.dataset.ach)); return; }
      if (t.closest('[data-books]')) { this.push('page-libros'); return; }
      if (t.closest('[data-resumen]')) { this.push('page-resumen'); return; }
      if ((el = t.closest('[data-memo]'))) { memorize(+el.dataset.memo); return; }
      if (t.closest('[data-priv]')) { this.push('page-lider'); return; }
      if (t.closest('[data-next]')) { L.nextDay(); return; }
      if ((el = t.closest('[data-theme]'))) { L.theme.set(el.dataset.theme); L.haptic(6); return; }
      if (t.closest('[data-repaso]')) { window.Repaso && Repaso.start(); return; }
      if (t.closest('[data-reset]')) { L.actions('¿Reiniciar la demo?', [{ text: 'Reiniciar', role: 'destructive', handler: () => L.reset() }]); return; }
    }
  }
  L.define('page-camino', PageCamino);

  function achSheet(a) {
    const got = L.achEarned(a), [v, g] = L.achProg(a), when = a.w || L.S.earned[a.id];
    L.sheet('<div class="medal" data-a="' + (a.a || '') + '"><div class="coin' + (a.a ? '' : ' fl') + (got ? '' : ' off') + '">' + ic(a.i) + '</div><h2>' + esc(a.t) + '</h2><p class="muted">' + esc(a.d) + '</p>' +
      (got ? '<span class="share-pill">' + ic('checkmark-circle') + (when && when !== 'antes' ? 'Lo lograste el ' + esc(when) : 'Logrado') + '</span>' : '<div class="pbar wide" data-a="' + (a.a || '') + '"><i style="width:' + Math.round(v / g * 100) + '%"></i></div><p class="muted">' + v + ' de ' + g + '</p>') + '</div>');
  }

  /* ---------- los 66 libros, con cuántas veces leíste cada uno ---------- */
  class PageLibros extends L.Page {
    shell() { return L.shell({ title: 'Tu Biblia', back: '' }); }
    render() {
      const R = L.S.read;
      const grid = list => '<div class="blist">' + list.map(b => { const n = R[b[0]] || 1; return '<div class="bcell n' + Math.min(n, 3) + '"><b>' + esc(b[0]) + '</b><small>' + b[1] + ' cap.</small><span>×' + n + '</span></div>'; }).join('') + '</div>';
      return '<div class="sec"><h2>Antiguo Testamento</h2><span class="muted">39 libros</span></div>' + grid(D.BOOKS.slice(0, D.AT)) +
        '<div class="sec"><h2>Nuevo Testamento</h2><span class="muted">27 libros</span></div>' + grid(D.BOOKS.slice(D.AT));
    }
  }
  L.define('page-libros', PageLibros);

  L.memorize = i => memorize(i != null ? i : Math.max(0, L.S.memo.findIndex(m => m.lvl < 3)));
  /* ---------- memorizar: arma el versículo tocando las palabras en orden ---------- */
  function memorize(i) {
    const m = L.S.memo[i];
    const words = m.t.replace(/[.,;:¿?¡!«»]/g, '').split(/\s+/).filter(Boolean).slice(0, 12);
    const shuffled = words.map((w, k) => ({ w, k })).sort(() => Math.random() - 0.5);
    let pos = 0, miss = 0;
    L.sheet('<div data-a="meditar"><p class="eyebrow">' + esc(m.r) + '</p><h2 class="sh-title">Ármalo en orden</h2><div class="built"></div><div class="wbank">' +
      shuffled.map(x => '<button class="chip" data-k="' + x.k + '">' + esc(x.w) + '</button>').join('') + '</div><p class="muted center memo-lvl">' + stars(m.lvl) + '</p></div>', {
      mount: (el, sh) => el.addEventListener('click', e => {
        const b = e.target.closest('[data-k]'); if (!b || b.disabled) return;
        if (+b.dataset.k === pos) {
          b.disabled = true; b.classList.add('used');
          el.querySelector('.built').insertAdjacentHTML('beforeend', '<span class="bw pop">' + esc(words[pos]) + '</span>');
          pos++; L.haptic(6);
          if (pos === words.length) {
            const up = miss <= 1 && m.lvl < 3;
            if (up) m.lvl++;
            L.save(); L.refresh(); L.checkAch();
            el.querySelector('.memo-lvl').innerHTML = stars(m.lvl);
            el.insertAdjacentHTML('beforeend', '<div class="memo-done"><b>' + (miss ? 'Bien, con ' + miss + ' tropiezo' + (miss > 1 ? 's' : '') : '¡Perfecto!') + '</b>' + (up ? '<small>Subiste a ' + m.lvl + ' de 3</small>' : '') + '<button class="btn" data-c>Listo</button></div>');
            el.querySelector('[data-c]').onclick = () => sh.dismiss();
            L.sparks(el.querySelector('.memo-lvl'), 16);
          }
        } else {
          miss++; L.haptic([20, 30, 20]);
          b.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 260 });
        }
      })
    });
  }
})();
