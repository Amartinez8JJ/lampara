/* Lights · Tu día en historias (propuesta A, elegida el 20/10)
   Tus prácticas a pantalla completa, de a una, con su color: la hora, la nota, el versículo y los pasos.
   Se desliza hacia arriba. A la izquierda, una vela: cada práctica encendida la derrite un tramo y su llama sube.
   Mantener el botón blanco enciende la práctica: una ola de luz sube, queda el sello «HECHO» y pasa sola a la siguiente.
   Referencias: TikTok (el deslizar vertical de a una pantalla), las historias de Instagram (el avance a la vista,
   acá es una vela) y Hallow (la práctica a pantalla completa). La vela, la ola de luz y el sello son propios. */
(() => {
  const { esc, ic } = L;
  const MIN = { oracion: 10, palabra: 15, meditar: 5, diario: 3, adoracion: 10, mensaje: 5, ayuno: 0, encuentro: 0, llamada: 10 };
  const HOLD = 650;
  const verse = r => D.VERSES.find(v => v.r === r) || (D.MEMO || []).find(v => v.r === r);
  const withName = it => it.with === 'ER' ? D.LEADER.first : (L.person(it.with) || {}).first || '';

  function card(it, i, n) {
    const inf = D.INFO[it.a] || {}, done = L.isDone(it.id);
    const q = verse(it.t) || verse(inf.ref);
    const meta = [it.h, MIN[it.a] ? MIN[it.a] + ' min' : '', (i + 1) + ' de ' + n].filter(Boolean).join(' · ');
    const sub = it.src === 'p' ? it.planName + ' · día ' + it.day + ' de ' + it.len : it.with ? 'con ' + withName(it) : D.NAME[it.a];
    const go = it.a === 'llamada' ? 'Llamar' : it.with && L.person(it.with) ? 'Preparar' : it.with ? 'Escribir' : 'Empezar';
    return '<section class="dy-st' + (done ? ' done' : '') + '" data-a="' + it.a + '" data-id="' + it.id + '" data-i="' + i + '">' +
      '<span class="dy-art">' + ic(D.ICON[it.a]) + '</span><span class="dy-light"></span><span class="dy-stamp">HECHO</span>' +
      '<p class="dy-ey">' + ic('time') + esc(meta) + '</p><h2>' + esc(it.t) + '</h2><p class="dy-sub">' + esc(sub) + '</p>' +
      (it.n ? '<div class="dy-note">' + ic('document-text') + '<span>' + esc(it.n) + '</span></div>' : '') +
      (q ? '<blockquote>«' + esc(q.t) + '»<small>' + esc(q.r) + '</small></blockquote>' : inf.why ? '<blockquote>' + esc(inf.why) + '<small>' + esc(inf.ref || '') + '</small></blockquote>' : '') +
      '<ol>' + (inf.how || []).map(h => '<li>' + esc(h) + '</li>').join('') + '</ol>' +
      '<div class="dy-acts">' +
        '<button data-go>' + '<span>' + ic(it.a === 'llamada' ? 'phone' : it.with ? 'people' : 'play') + '</span>' + go + '</button>' +
        '<button data-note><span>' + ic('create') + '</span>Anotar</button>' +
        (done ? '' : '<button data-skip><span>' + ic('moon') + '</span>Hoy no</button>') +
        '<button class="dy-lit" data-lit aria-label="Mantén presionado para encender"><svg class="rg" viewBox="0 0 74 74"><circle cx="37" cy="37" r="34"/></svg><span>' + ic(done ? 'checkmark' : 'flame') + '</span>' + (done ? 'Hecho' : 'Mantén') + '</button>' +
      '</div>' + (i === 0 ? '<p class="dy-hint">Desliza hacia arriba</p>' : '') + '</section>';
  }
  function endCard() {
    const its = L.todayItems(), k = its.filter(i => L.isDone(i.id)).length, ld = L.litDays(), ti = L.tierOf(ld), T = L.TIERS[ti];
    const all = its.length && k === its.length;
    return '<section class="dy-st dy-end" style="--tc:' + T.c + '"><div class="cglow"></div><span class="dy-bigf">' + L.llama(ti, { cls: 'big' }) + '</span>' +
      '<h2>' + (all ? 'Tu llama está encendida' : k ? 'Tu llama se aviva' : 'Tu llama te espera') + '</h2>' +
      '<p>' + k + ' de ' + its.length + ' prácticas · ' + ld + ' días encendidos · ' + esc(T.n) + '</p><button class="btn" data-close>Volver a Hoy</button></section>';
  }

  function open(startId) {
    const its = L.todayItems(); if (!its.length) { L.toast('Nada planeado para hoy'); return; }
    const n = its.length, ti = L.tierOf(L.litDays());
    L.full((el, m) => {
      el.innerHTML = '<div class="dy-feed">' + its.map((it, i) => card(it, i, n)).join('') + endCard() + '</div>' +
        '<div class="dy-candle"><div class="dy-wax">' + its.map(() => '<i></i>').join('') + '</div><span class="dy-cf">' + L.llama(ti) + '</span></div>' +
        '<button class="dy-x" data-close aria-label="Cerrar">' + ic('close') + '</button>';
      const feed = el.querySelector('.dy-feed'), cf = el.querySelector('.dy-cf'), wax = el.querySelectorAll('.dy-wax i');
      const paint = () => { const k = its.filter(i => L.isDone(i.id)).length; cf.style.bottom = (k / n * 100) + '%'; wax.forEach((w, i) => w.classList.toggle('on', i < k)); };
      paint();
      /* cada pantalla entra con su texto escalonado; la vela marca en cuál estás */
      const io = new IntersectionObserver(es => es.forEach(e => {
        const on = e.isIntersecting && e.intersectionRatio > 0.6; e.target.classList.toggle('in', on);
        if (on) { const i = +e.target.dataset.i; wax.forEach((w, k) => w.classList.toggle('cur', k === i)); el.classList.toggle('at-end', e.target.classList.contains('dy-end')); if (e.target.classList.contains('dy-end')) L.sparks(e.target.querySelector('.dy-bigf'), 24); }
      }), { root: feed, threshold: [0.6] });
      feed.querySelectorAll('.dy-st').forEach(s => io.observe(s));
      /* arranca en la que sigue */
      const first = startId ? its.findIndex(i => i.id === startId) : its.findIndex(i => !L.isDone(i.id));
      const toFirst = () => { const s = feed.querySelector('[data-i="' + Math.max(0, first) + '"]'); if (s && first > 0 && !feed.dataset.moved) feed.scrollTop = s.offsetTop; };
      requestAnimationFrame(toFirst); m.addEventListener('ionModalWillPresent', toFirst); m.addEventListener('ionModalDidPresent', () => { toFirst(); feed.dataset.moved = 1; });
      /* mantener = encender */
      let t = 0, holdB = null;
      const cancel = () => { clearTimeout(t); if (holdB) holdB.classList.remove('holding'); holdB = null; };
      el.addEventListener('pointerdown', e => {
        const b = e.target.closest('[data-lit]'); if (!b) return;
        const st = b.closest('.dy-st'); if (st.classList.contains('done')) return;
        holdB = b; b.classList.add('holding'); L.haptic(4);
        t = setTimeout(() => {
          holdB = null; b.classList.remove('holding');
          const id = st.dataset.id; L.setDone(id, true, { quiet: true });
          st.classList.add('burn', 'done'); b.querySelector('span').innerHTML = ic('checkmark'); b.lastChild.textContent = 'Hecho';
          const sk = st.querySelector('[data-skip]'); if (sk) sk.remove();
          L.haptic([12, 50, 24]); L.sparks(b, 20);
          setTimeout(() => { paint(); L.sparks(cf, 10); }, 450);
          setTimeout(() => { const nx = st.nextElementSibling; if (nx) feed.scrollTo({ top: nx.offsetTop, behavior: 'smooth' }); if (nx && nx.classList.contains('dy-end')) nx.outerHTML = endCard(), feed.querySelectorAll('.dy-end').forEach(s => io.observe(s)); }, 1050);
        }, HOLD);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(v => el.addEventListener(v, e => { if (v !== 'pointerleave' || e.target === el) cancel(); }));
      el.addEventListener('pointermove', e => { if (holdB && !holdB.contains(document.elementFromPoint(e.clientX, e.clientY))) cancel(); });
      el.addEventListener('contextmenu', e => e.preventDefault());
      el.addEventListener('click', e => {
        const tg = e.target, st = tg.closest('.dy-st'), it = st && its.find(i => i.id === st.dataset.id);
        if (tg.closest('[data-close]')) { m.dismiss(); return; }
        if (!it) return;
        if (tg.closest('[data-go]')) {
          if (it.a === 'llamada') { m.dismiss().then(() => L.llamar(it)); return; }
          const p = it.with && L.person(it.with);
          if (p) { m.dismiss().then(() => window.Encuentro && Encuentro.open(it.with)); return; }
          if (it.with) { L.toast('Abrimos tu chat con ' + withName(it), { icon: 'chatbubble' }); return; }
          m.dismiss().then(() => Flujo.start([it])); return;
        }
        if (tg.closest('[data-note]')) { L.prompt('Anotar sobre ' + it.t, { ph: '¿Qué te quedó?' }, v => { L.S.keeps.unshift({ a: it.a, t: v, r: it.src === 'p' ? it.t : '', d: L.tk() }); L.save(); L.refresh(); L.toast('Anotado', { icon: 'create' }); }); return; }
        if (tg.closest('[data-skip]')) { L.skipToday(it.id, true); L.toast('Lo sacaste de hoy', { undo: () => L.skipToday(it.id, false) }); st.classList.add('skipped'); setTimeout(() => { const nx = st.nextElementSibling; if (nx) feed.scrollTo({ top: nx.offsetTop, behavior: 'smooth' }); }, 400); }
      });
    }, { cls: 'dia' });
  }
  L.openDia = open;
})();
