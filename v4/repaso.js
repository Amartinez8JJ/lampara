/* Lámpara v4 · Domingo de repaso
   Cerrar la semana en 3 minutos: cómo vino, lo que te llevaste, lo que Dios hizo, la palabra que se repitió y tu foco. */
(() => {
  const { esc, ic } = L;
  /* temas que se reconocen en lo que leíste y guardaste */
  const THEMES = [[/permane/i, 'Permanecer'], [/camino/i, 'Camino'], [/\bam(or|éis|ado|aos|a)\b/i, 'Amor'], [/\bpaz\b/i, 'Paz'], [/fruto|\bvid\b|pámpano/i, 'Fruto'],
    [/\bluz\b|lámpara|lumbrera/i, 'Luz'], [/afan|ansi|cuidado/i, 'Confianza'], [/gozo|alegr/i, 'Gozo'], [/verdad/i, 'Verdad'], [/venci|vencedor/i, 'Victoria']];
  /* la semana que se cierra: el domingo, la actual; el resto de los días, la anterior */
  const target = () => { const t = L.today(); return t.getDay() === 0 ? L.weekStart(t) : L.addDays(L.weekStart(t), -7); };
  const pending = () => { const d = L.today().getDay(); return (d === 0 || d === 1) && !L.S.reviews[L.dk(target())]; };

  function weekData(ws) {
    const S = L.S, days = L.WEEK.map((_, i) => L.addDays(ws, i)), we = L.addDays(ws, 6);
    const inW = k => { const d = L.fromDk(k); return d >= ws && d <= we; };
    const st = days.map(d => L.dayStatus(d));
    const lit = st.filter(s => s === 'lit' || s === 'grace').length;
    const keeps = S.keeps.filter(k => inW(k.d) && k.a !== 'diario').slice(0, 4);
    const lines = S.keeps.filter(k => inW(k.d) && k.a === 'diario');
    const answered = S.answered.filter(a => inW(a.d));
    const prayed = 9 + S.log.filter(x => x.a === 'oracion' && inW(x.d)).length;
    /* lecturas de los planes de esa semana: también cuentan para la palabra */
    const texts = S.keeps.filter(k => inW(k.d)).map(k => k.t);
    days.forEach(d => S.plans.forEach(p => { const n = L.planDay(p, d); if (n >= 1 && n <= p.len && p.seq === 'juan15') { const r = D.SEQ.juan15('meditar', n); if (D.VTXT[r]) texts.push(D.VTXT[r]); } }));
    const score = THEMES.map(([re, w]) => [w, texts.filter(t => re.test(t)).length]).sort((a, b) => b[1] - a[1]);
    const word = score[0][1] ? score[0][0] : 'Gracia';
    return { days, st, lit, keeps, lines, answered, prayed, word, ws, we };
  }

  function start() {
    const w = weekData(target());
    let i = 0, verse = w.keeps[0] ? 0 : -1, focus = L.S.focus && L.S.focus.wk === L.dk(w.ws) ? L.S.focus.t : null, share = L.S.myShare >= 1;
    const range = L.short(w.ws) + ' – ' + L.short(w.we);
    const STEPS = [
      () => '<p class="eyebrow">Tu semana · ' + range + '</p><h1 class="rv-big">' + w.lit + '<small> de 7 días</small></h1>' +
        '<div class="rv-flames">' + w.days.map((d, k) => '<span class="' + w.st[k] + '">' + (w.st[k] === 'lit' ? ic('flame') : '<i></i>') + L.DL[d.getDay()] + '</span>').join('') + '</div>' +
        '<p class="fl-sub">' + (w.lit >= L.GOAL ? 'Llegaste a tu meta de ' + L.GOAL + '. La llama ardió toda la semana.' : 'La llama siguió encendida. Cada día que volviste contó.') + '</p>',
      () => '<p class="eyebrow">Lo que te llevaste</p><h1>' + (w.keeps.length ? 'Elige el versículo de tu semana' : 'Esta semana no guardaste versículos') + '</h1>' +
        (w.keeps.length ? '<div class="rv-keeps">' + w.keeps.map((k, n) => '<button class="rv-keep' + (n === verse ? ' on' : '') + '" data-v="' + n + '" data-a="' + k.a + '"><p>«' + esc(k.t) + '»</p><small>' + esc(k.r || '') + '</small></button>').join('') + '</div>'
          : '<p class="fl-sub">La próxima, al terminar de leer, toca el versículo que te llevas.</p>') +
        (w.lines.length ? '<div class="note">' + ic('create-outline') + '<span>Escribiste: «' + esc(w.lines[0].t) + '»</span></div>' : ''),
      () => '<p class="eyebrow">Lo que Dios hizo</p><h1>' + (w.answered.length ? 'Respondió ' + w.answered.length + (w.answered.length === 1 ? ' oración' : ' oraciones') : 'Seguiste orando') + '</h1>' +
        (w.answered.length ? '<div class="answered">' + w.answered.map(a => '<div class="ans" data-a="oracion"><div class="coin-s">' + ic('star') + '</div><div><b>' + esc(a.t) + '</b></div></div>').join('') + '</div>' : '') +
        '<div class="rv-stat" data-a="oracion"><b class="cnt" data-to="' + w.prayed + '">0</b><span>veces oraste por otros</span></div>' +
        '<div class="rv-stat" data-a="oracion"><b>' + L.S.pets.length + '</b><span>pedidos que sigues sosteniendo</span></div>',
      () => '<p class="eyebrow">Una palabra se repitió</p><div class="rv-word"><span>' + esc(w.word) + '</span></div><p class="fl-sub center">Apareció en lo que leíste y guardaste. Llévala a la semana que empieza.</p>',
      () => '<p class="eyebrow">La semana que viene</p><h1>¿Cuál es tu foco?</h1><div class="rv-focus">' + D.FOCUS.map(f => '<button class="chip' + (f === focus ? ' on' : '') + '" data-f="' + esc(f) + '">' + esc(f) + '</button>').join('') + '</div>' +
        '<button class="rv-share' + (share ? ' on' : '') + '" data-share><span class="tg"><i></i></span><div><b>Contárselo a ' + esc(D.LEADER.first) + '</b><small>Para que ore por tu foco</small></div></button>'
    ];
    L.full((el, m) => {
      const paint = dir => {
        el.innerHTML = '<div class="fl-top"><div class="fl-bars">' + STEPS.map((_, k) => '<i class="' + (k < i ? 'done' : k === i ? 'now' : '') + '"></i>').join('') + '</div><button class="iconbtn" data-x aria-label="Cerrar">' + ic('close') + '</button></div>' +
          '<div class="fl-stage"><div class="fl-body rv" data-a="">' + STEPS[i]() + '</div></div>' +
          '<div class="fl-foot"><button class="btn big" data-n' + (i === STEPS.length - 1 && !focus ? ' disabled' : '') + '>' + (i < STEPS.length - 1 ? 'Seguir' : ic('flag') + 'Cerrar la semana') + '</button>' + (i ? '<button class="link fl-skip" data-b>Atrás</button>' : '') + '</div>';
        if (dir) L.slide(el.querySelector('.fl-body'), dir);
        const c = el.querySelector('.cnt');
        if (c) { const to = +c.dataset.to, t0 = performance.now(); const step = now => { const p = Math.min(1, (now - t0) / 900); c.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }
        if (i === 0) setTimeout(() => el.querySelectorAll('.rv-flames .lit').forEach((s, k) => setTimeout(() => L.sparks(s, 5), k * 90)), 300);
        if (i === 3) setTimeout(() => L.sparks(el.querySelector('.rv-word span'), 22), 250);
      };
      el.addEventListener('click', e => {
        const t = e.target; let b;
        if (t.closest('[data-x]')) { m.dismiss(); return; }
        if ((b = t.closest('[data-v]'))) { verse = +b.dataset.v; el.querySelectorAll('[data-v]').forEach(x => x.classList.toggle('on', x === b)); L.haptic(6); return; }
        if ((b = t.closest('[data-f]'))) { focus = b.dataset.f; el.querySelectorAll('[data-f]').forEach(x => x.classList.toggle('on', x === b)); el.querySelector('[data-n]').disabled = false; L.haptic(6); return; }
        if ((b = t.closest('[data-share]'))) { share = !share; b.classList.toggle('on', share); L.haptic(6); return; }
        if (t.closest('[data-b]')) { i--; paint(-1); return; }
        if (t.closest('[data-n]')) {
          if (i < STEPS.length - 1) { i++; paint(1); return; }
          const S = L.S, wk = L.dk(w.ws);
          S.reviews[wk] = { focus, verse: verse >= 0 ? w.keeps[verse] : null, d: L.tk() };
          S.focus = { t: focus, wk };
          L.save(); L.refresh();
          m.dismiss().then(() => L.sheet('<div class="medal"><div class="coin fl">' + ic('flag') + '</div><p class="eyebrow">Semana cerrada</p><h2>' + esc(focus) + '</h2><p class="muted">Tu foco para esta semana' + (share ? ' · ' + esc(D.LEADER.first) + ' va a orar por esto' : '') + '</p><button class="btn" data-c>Amén</button></div>',
            { mount: (s, mm) => { s.querySelector('[data-c]').onclick = () => mm.dismiss(); setTimeout(() => L.sparks(s.querySelector('.coin'), 22), 300); } }));
        }
      });
      paint(0);
    }, { cls: 'flow' });
  }

  /* en Hoy: domingo y lunes, si la semana todavía no se cerró */
  L.ctxCard({
    id: 'repaso',
    pri: () => pending() ? 4 : 0,
    html: () => '<div class="ctxc fl"><div class="ctxc-top"><div class="aic">' + ic('ribbon') + '</div><div><p class="eyebrow">' + (L.today().getDay() === 0 ? 'Hoy es domingo' : 'La semana pasada') + '</p><b>Cierra tu semana</b></div></div>' +
      '<p class="muted">Lo que te llevaste, lo que Dios hizo y tu foco. Tres minutos.</p><button class="btn sm" data-ctx="repaso">' + ic('play') + 'Empezar el repaso</button></div>',
    click: () => start()
  });

  window.Repaso = { start, pending };
})();
