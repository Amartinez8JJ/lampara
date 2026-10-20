/* Lights · Hoy
   Estructura de YouVersion (versículo del día, prácticas guiadas con su duración, racha chica arriba)
   y el día agrupado por momento como Tiimo. Tocar = ver · círculo = marcar · mantener = menú · deslizar = atajos. */
(() => {
  const { esc, ic, actIc, av } = L;
  const MIN = { oracion: 10, palabra: 15, meditar: 5, diario: 3, adoracion: 10, mensaje: 5, ayuno: 0, encuentro: 0, llamada: 10 };
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
  /* cada práctica es un anillo (Streaks): mantener = completar, tocar = ver qué hacer */
  function ring(it, just, next) {
    const done = L.isDone(it.id), fresh = it.id === just;
    const cls = (done && !fresh ? ' done' : '') + (fresh ? ' filled' : '') + (next ? ' next' : '');
    return '<button class="rbtn' + cls + '" data-ring="' + it.id + '" data-a="' + it.a + '" aria-label="' + esc(it.t) + (done ? ', hecho' : ', mantén presionado para completar') + '">' +
      '<span class="disk"><svg class="rg" viewBox="0 0 96 96"><circle class="trk" cx="48" cy="48" r="44"/><circle class="bar" cx="48" cy="48" r="44"/></svg>' +
      '<span class="core">' + ic(D.ICON[it.a]) + '</span><span class="badge">' + ic('checkmark') + '</span></span>' +
      '<b>' + esc(it.t) + '</b><small>' + (done && !fresh ? 'Hecho' : esc(it.h)) + (it.n ? ic('document-text', 'nmark') : '') + '</small></button>';
  }
  /* ---------- la fogata (propuesta C, elegida el 19/10): cada práctica viaja hasta tu llama y la aviva ----------
     Duolingo (la racha que cambia con los hitos), Finch (la energía sube con cada meta) y Apple Fitness (el anillo del día). */
  const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lvVars = p => '--s:' + (0.34 + 0.66 * p).toFixed(3) + ';--sat:' + (0.12 + 0.88 * p).toFixed(2) + ';--br:' + (0.72 + 0.28 * p).toFixed(2) + ';--go:' + (0.06 + 0.4 * p).toFixed(2) + ';--gs:' + (0.45 + 0.55 * p).toFixed(2);
  const setLv = (z, p) => { lvVars(p).split(';').forEach(x => { const [k, v] = x.split(':'); z.style.setProperty(k, v); }); };
  const capHTML = (k, n) => n && k === n ? '<b>Encendida</b>' : k ? '<b>Se aviva</b>' : '<b>En brasa</b>';
  const inView = el => { const r = el.getBoundingClientRect(); return r.bottom > 40 && r.top < innerHeight - 60; };
  function ember(z, color, o) {
    o = o || {}; const e = document.createElement('i'); e.className = 'fo-em'; const sz = o.size || 3 + Math.random() * 3;
    e.style.width = e.style.height = sz + 'px'; e.style.background = color; e.style.left = (z.clientWidth / 2 - sz / 2 + (Math.random() - 0.5) * (o.w || 60)) + 'px';
    if (o.bottom) e.style.bottom = o.bottom + 'px'; z.appendChild(e);
    const g = -Math.PI / 2 + (Math.random() - 0.5) * (o.spread || 0.5), d = (o.d || 110) + Math.random() * (o.dv || 70);
    e.animate([{ transform: 'translate(0,0) scale(1)', opacity: 0 }, { opacity: o.op || 1, offset: 0.12 }, { transform: 'translate(' + Math.cos(g) * d + 'px,' + Math.sin(g) * d + 'px) scale(.2)', opacity: 0 }],
      { duration: (o.t || 1500) + Math.random() * 800, easing: 'cubic-bezier(.2,.65,.35,1)' }).onfinish = () => e.remove();
  }
  const ringOut = (z, color, sc, dl) => { const r = document.createElement('i'); r.className = 'fo-ring'; r.style.borderColor = color; z.appendChild(r);
    r.animate([{ transform: 'scale(.3)', opacity: 0.9 }, { transform: 'scale(' + sc + ')', opacity: 0 }], { duration: 800, delay: dl || 0, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'backwards' }).onfinish = () => r.remove(); };
  const burst = (z, colors, n, spread) => { for (let i = 0; i < n; i++) ember(z, colors[i % colors.length], { bottom: 70, w: 10, spread, d: 50, dv: 100, t: 700, size: 3 + Math.random() * 5 }); };
  /* la práctica sale del anillo como una bola de su color, con estela, y cae en curva sobre la llama */
  function orb(from, z, color, cb) {
    const a = from.getBoundingClientRect(), b = z.getBoundingClientRect();
    const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, x2 = b.left + b.width / 2, y2 = b.bottom - 66;
    const x1 = (x0 + x2) / 2 + (x0 < x2 ? -50 : 50), y1 = Math.min(y0, y2) - 70;
    const o = document.createElement('i'); o.className = 'fo-orb'; o.style.background = 'radial-gradient(circle, #fff 0 22%, ' + color + ' 62%)'; o.style.boxShadow = '0 0 18px 5px ' + color; document.body.appendChild(o);
    const D = 620, t0 = performance.now(); let last = 0;
    const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    (function step(now) {
      const t = Math.min(1, (now - t0) / D), e = ease(t), u = 1 - e, x = u * u * x0 + 2 * u * e * x1 + e * e * x2, y = u * u * y0 + 2 * u * e * y1 + e * e * y2;
      o.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + (1 - 0.4 * e) + ')';
      if (now - last > 14) { last = now; const tr = document.createElement('i'); tr.className = 'fo-trail'; tr.style.background = color; document.body.appendChild(tr);
        tr.animate([{ transform: 'translate(' + x + 'px,' + y + 'px) scale(1)', opacity: 0.65 }, { transform: 'translate(' + x + 'px,' + (y + 8) + 'px) scale(.15)', opacity: 0 }], { duration: 420, easing: 'ease-out' }).onfinish = () => tr.remove(); }
      if (t < 1) requestAnimationFrame(step); else { o.remove(); cb(); }
    })(t0);
  }
  /* al llegar: la llama se aplasta, rebota, toma un instante el color de la práctica y suelta chispas */
  function impact(z, color) {
    const fi = z.querySelector('.fo-in'); if (!fi) return;
    fi.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.14,.82)', offset: 0.22 }, { transform: 'scale(.93,1.12)', offset: 0.55 }, { transform: 'scale(1.02,.98)', offset: 0.8 }, { transform: 'scale(1)' }], { duration: 700, easing: 'ease-out' });
    fi.animate([{ filter: 'none' }, { filter: 'drop-shadow(0 0 16px ' + color + ') brightness(1.3)', offset: 0.3 }, { filter: 'none' }], { duration: 900 });
    ringOut(z, color, 2.3); burst(z, [color, '#fff'], 14, 1.6); L.haptic([10, 30, 14]);
  }
  /* el día completo: toma aire, se enciende entera con un destello y dos anillos de luz */
  function blaze(z) {
    const fi = z.querySelector('.fo-in'), T = L.TIERS[L.tierOf(L.litDays())]; if (!fi) return;
    fi.animate([{ transform: 'scale(1)' }, { transform: 'scale(.84)', offset: 0.28 }, { transform: 'scale(1.26)', offset: 0.52 }, { transform: 'scale(.96)', offset: 0.78 }, { transform: 'scale(1)' }], { duration: 1150, easing: 'ease-out' });
    setTimeout(() => {
      z.classList.add('blaze'); const f = z.querySelector('.fo-flash'); if (f) f.animate([{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 0 }], { duration: 800 });
      ringOut(z, T.c, 3.6); ringOut(z, T.l, 2.8, 140); burst(z, [T.c, T.l, '#fff'], 40, 2.8); L.haptic([20, 60, 30, 60, 40]);
    }, 320);
  }

  /* ---------- los mosaicos del tablero: cada uno ya dice algo antes de tocarlo (widgets de iOS) ---------- */
  function tiles() {
    const S = L.S, t = L.today();
    const bib = S.plans.find(p => p.id === 'biblia' && !p.paused);
    let lect = '';
    if (bib) {
      const day = Math.max(1, Math.min(bib.len, L.planDay(bib, t))), it = L.todayItems().find(i => i.plan === 'biblia'), p = day / bib.len;
      lect = '<button class="bt" data-acc="page-lectura" data-a="palabra"><span class="bt-k">' + ic('book') + 'Mi lectura</span><span class="bt-ring">' + (L.ringSVG ? L.ringSVG(p, 'var(--palabra)', 15) : '') + '</span>' +
        '<b class="bt-big">' + Math.round(p * 100) + '<small>%</small></b><span class="bt-s">' + (it ? (L.isDone(it.id) ? 'Leíste ' : 'Hoy ') + esc(it.t) : 'Día ' + day + ' de ' + bib.len) + '</span></button>';
    }
    const wk = L.weekDates(t), litN = wk.filter(d => L.dayStatus(d) === 'lit').length;
    const bars = wk.map(d => { const n = L.diffDays(d, t), pl = L.dayPlan(d).length, dn = L.dayDone(d).length;
      const h = n > 0 ? Math.min(1, pl / 6) * 0.6 : pl ? dn / pl : 0;
      return '<i class="' + (n > 0 ? 'f' : n === 0 ? 't' : dn ? 'l' : '') + '" style="height:' + Math.max(12, Math.round(h * 100)) + '%"></i>'; }).join('');
    const sem = '<button class="bt" data-acc="page-semana"><span class="bt-k">' + ic('calendar') + 'Mi semana</span><span class="bt-bars">' + bars + '</span><span class="bt-s"><b>' + litN + ' de 7</b> días · meta ' + L.GOAL + '</span></button>';
    const hs = L.habits ? L.habits() : [], risk = hs.filter(h => h.state === 'programa' || h.state === 'riesgo').length;
    const hab = '<button class="bt wide" data-acc="page-habitos"><span class="bt-k">' + ic('leaf') + 'Tus hábitos' + (risk ? '<em class="bt-risk">' + risk + ' en riesgo</em>' : '') + '</span><span class="bt-habs">' +
      hs.slice(0, 4).map(h => '<span class="bt-h" data-a="' + h.a + '"><span class="aic">' + actIc(h.a, true) + '</span><span><b>' + esc(D.NAME[h.a]) + '</b>' + L.habitPips(h.lv, h.a) + '<small>' + h.name + ' · ' + h.c + '/' + Math.max(h.need, 1) + '</small></span></span>').join('') + '</span></button>';
    const ora = '<button class="bt" data-go="oracion" data-a="oracion"><span class="bt-k">' + ic('hands-praying') + 'Oración</span><b class="bt-big">' + S.pets.length + '</b><span class="bt-s">pedidos · ' + S.answered.length + ' respondidos</span></button>';
    const u = window.Encuentro ? Encuentro.upcoming()[0] : null;
    const prox = u ? '<button class="bt" data-enc="' + u.p.id + '" data-a="encuentro"><span class="bt-k">' + ic('people') + 'Próximo</span><b class="bt-big">' + esc(u.it.h) + '</b><span class="bt-s">' + (u.n === 0 ? 'Hoy' : u.n === 1 ? 'Mañana' : L.cap(L.DN[u.d.getDay()])) + ' · ' + esc(u.p.first) + '</span></button>'
      : '<button class="bt" data-acc="page-resumen"><span class="bt-k">' + ic('trending-up') + 'Resumen</span><b class="bt-big">%</b><span class="bt-s">tu semana y tu mes</span></button>';
    return '<div class="bento">' + lect + sem + hab + ora + prox + '</div>';
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
      return L.shell({ title: 'Hoy', end: '<button class="streak" data-camino aria-label="Tu llama"><span class="fc-f"></span><span class="fc-n"></span></button><button class="me-btn" data-camino aria-label="Tu camino">' + av('JC', 'Juan Carlos', 32) + '</button>' });
    }
    mount() {
      this.prevOn = new Set();
      L.on('lit', () => { const c = this.querySelector('.streak'); if (c) { c.classList.remove('ignite'); void c.offsetWidth; c.classList.add('ignite'); L.sparks(c, 10); } });
      /* mantener presionado un anillo lo llena; si se suelta antes, vuelve */
      const HOLD = 650; let ht = 0, x0 = 0, y0 = 0, holdB = null;
      const cancel = () => { clearTimeout(ht); if (holdB) holdB.classList.remove('holding'); holdB = null; };
      this.addEventListener('pointerdown', e => {
        const b = e.target.closest('[data-ring]'); this.fired = false;
        if (!b || L.isDone(b.dataset.ring)) return;
        holdB = b; x0 = e.clientX; y0 = e.clientY; b.classList.add('holding'); L.haptic(4);
        clearTimeout(ht); ht = setTimeout(() => { this.fired = true; const id = b.dataset.ring; holdB = null; b.classList.remove('holding'); this.mark(id, true); }, HOLD);
      });
      this.addEventListener('pointermove', e => { if (holdB && Math.hypot(e.clientX - x0, e.clientY - y0) > 10) cancel(); });
      ['pointerup', 'pointercancel'].forEach(ev => this.addEventListener(ev, () => { if (!this.fired) cancel(); }));
      this.addEventListener('contextmenu', e => { if (e.target.closest('[data-ring]')) e.preventDefault(); });
      const embers = () => {
        const z = this.pg && this.pg.querySelector('.fo-z'), p = this.lvShown || 0;
        if (z && !document.hidden && !RM() && z.offsetParent && inView(z)) {
          const T = L.TIERS[L.tierOf(L.litDays())];
          if (p) ember(z, Math.random() < 0.5 ? T.c : T.l, { w: 24 + 46 * p, bottom: 64 });
          else if (Math.random() < 0.4) ember(z, '#8a6a4a', { w: 14, d: 34, dv: 26, op: 0.55, size: 3, bottom: 64 });
        }
        setTimeout(embers, p === 1 ? 160 : p ? 840 - 560 * p : 1200);
      };
      embers();
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
        : n && k === n ? '' : n ? '<p class="muted">Lo que queda es con otras personas.</p>' : '<p class="muted">Nada planeado para hoy.</p>';
      /* la llama: crece con lo que vas haciendo hoy y cambia de etapa con los días encendidos */
      const ld = L.litDays(), ti = L.tierOf(ld), T = L.TIERS[ti], NX = L.TIERS[ti + 1], lit = L.litToday();
      const prog = NX ? (ld - T.d) / (NX.d - T.d) : 1;
      /* si viene un orbe en camino, la llama arranca como estaba y crece cuando llega (after) */
      const k0 = this.just && L.isDone(this.just) ? k - 1 : k;
      this.lvTo = n ? k / n : 0;
      const lvFrom = this.just ? (n ? k0 / n : 0) : this.lvShown != null ? this.lvShown : this.lvTo;
      this.capTo = capHTML(k, n);
      const flame = '<div class="fo-z' + (n && k === n && !this.just ? ' blaze' : '') + '" style="--tc:' + T.c + ';' + lvVars(lvFrom) + '"><div class="fo-flash"></div><div class="fo-glow"></div>' +
        '<button class="fo-fl" data-llama aria-label="Tu llama: ' + esc(T.n) + '"><span class="fo-in">' + L.llama(ti) + '</span></button></div>';
      const tier = '<div class="tier fo-tier" style="--tc:' + T.c + '"><span><em>' + esc(T.n) + '</em> · <b>' + ld + '</b> días</span><i><s style="width:' + Math.round(prog * 100) + '%"></s></i><small>' + (NX ? (NX.d - ld === 1 ? 'Falta 1 día' : 'Faltan ' + (NX.d - ld) + ' días') + ' para ' + esc(NX.n) : 'La última llama') + '</small></div>';
      /* lo que sigue (lo de «Ahora» en v3): la próxima pendiente late suave */
      const nx = its.find(i => !L.isDone(i.id));
      /* el tablero (propuesta B, elegida el 20/10): la fogata grande, mosaicos con datos y las prácticas en una fila */
      const tcd = '<div class="tcd fogata ft" style="--tc:' + T.c + '"><div class="ft-l">' + flame + '</div><div class="ft-r"><p class="eyebrow">Tu tiempo con Dios</p><p class="fo-cap">' + capHTML(k0, n) + '</p>' +
        '<p class="ft-sub">' + k + ' de ' + n + (min ? ' · ' + min + ' min' : '') + '</p>' + tier + cta + '</div></div>';
      const bento = tiles();
      /* tus prácticas: una tarjeta con las que siguen apiladas; «Ver mi día» las abre a pantalla completa (dia.js) */
      const pendAll = its.filter(i => !L.isDone(i.id)), stack = (pendAll.length ? pendAll : its).slice(0, 3).reverse();
      const rail = '<div class="sec"><h2>Tus prácticas</h2><button class="more" data-addtoday>' + ic('add') + ' Agregar</button></div>' +
        (n ? '<div class="dy-entry"><button class="dy-stack" data-dia aria-label="Ver mi día">' + stack.map((i, k) => '<i data-a="' + i.a + '" class="s' + (stack.length - 1 - k) + '">' + (k === stack.length - 1 ? (pendAll.length ? '<span>' + ic(D.ICON[i.a]) + '</span><b>' + esc(i.t) + '</b><small>' + esc(i.h) + (i.n ? ' · ' + esc(i.n) : '') + '</small>' : '<span>' + ic('flame') + '</span><b>Día completo</b><small>' + n + ' de ' + n + ' · tu llama está encendida</small>') : '') + '</i>').join('') + '</button>' +
          '<div class="dy-dots">' + its.map(i => '<button data-dia="' + i.id + '" data-a="' + i.a + '" class="' + (L.isDone(i.id) ? 'done' : '') + (nx && i.id === nx.id ? ' next' : '') + '" aria-label="' + esc(i.t) + '">' + ic(L.isDone(i.id) ? 'checkmark' : D.ICON[i.a]) + '</button>').join('') + '</div>' +
          '<button class="btn" data-dia>' + ic('play') + 'Ver mi día' + (pendAll.length && pendAll.length < n ? ' · ' + pendAll.length + ' más' : '') + '</button></div>' : '<p class="muted">Nada planeado para hoy.</p>');
      const ppl = [{ id: D.LEADER.id, name: D.LEADER.name, first: D.LEADER.first, lead: true }].concat(S.people).concat([{ id: 'AN', name: 'Ana', first: 'Ana', fam: true }]);
      return '<p class="today-date">' + L.longDate(t) + (S.focus ? '<span class="focus-chip">' + ic('flag') + esc(S.focus.t) + '</span>' : '') + '</p>' +
        tcd + '<div class="hoy-blk">' + rail + '</div>' + (ctx ? '<div class="hoy-blk">' + ctx.html() + '</div>' : '') +
        '<div class="hoy-blk"><div class="sec"><h2>De un vistazo</h2></div>' + bento + '</div>' +
        (tipSeen() ? '' : '<div class="tip">' + ic('information-circle-outline') + '<span><b>Cómo se usa:</b> mantén presionado un círculo hasta que se llene: la práctica viaja a tu llama. Tócalo para leer qué hacer y tus notas.</span><button class="iconbtn" data-tipx aria-label="Cerrar">' + ic('close') + '</button></div>') +
        '<div class="sec"><h2>Versículo del día</h2></div><div class="verse" data-verse data-a="palabra"><span class="art">' + ic('sh-palabra') + '</span><p class="eyebrow"><b>' + esc(v.r) + '</b></p><p class="vt">«' + esc(v.t) + '»</p>' +
        '<div class="vacts"><button data-vact="keep" class="' + (saved ? 'on' : '') + '">' + ic(saved ? 'bookmark' : 'bookmark-outline') + (saved ? 'Guardado' : 'Guardar') + '</button>' +
        '<button data-vact="memo">' + ic('leaf-outline') + 'Memorizar</button><button data-vact="share">' + ic('paper-plane-outline') + 'Compartir</button></div></div>' +
        '<div class="sec"><h2>Tu gente</h2><button class="more" data-anotar>' + ic('add') + ' Anotar</button></div><div class="stories">' + ppl.map(p => {
          const cls = p.lead || p.fam ? 'dim' : p.signal === 'hablar' || p.signal === 'cuesta' ? 'talk' : p.share >= 2 && p.dToday > 0 ? 'lit' : 'dim';
          return '<button class="story" data-who="' + p.id + '">' + av(p.id, p.name, 56, cls) + '<small>' + esc(p.first) + '</small></button>';
        }).join('') + '</div>';
    }
    after() {
      const chip = this.querySelector('.streak');
      if (chip) {
        const ld = L.litDays(), ti = L.tierOf(ld);
        chip.classList.toggle('lit', L.litToday()); chip.style.setProperty('--tc', L.TIERS[ti].c);
        chip.querySelector('.fc-f').innerHTML = L.llama(ti, { cls: 'll-mini' }); chip.querySelector('.fc-n').textContent = ld;
      }
      /* la fila de prácticas queda donde la dejaste; la primera vez, en la que sigue */
      L.animateRings && L.animateRings(this.pg);
      const rail = this.pg.querySelector('.rail');
      if (rail) {
        const nxr = rail.querySelector('.rbtn.next');
        rail.scrollLeft = this.railX != null ? this.railX : nxr ? Math.max(0, nxr.offsetLeft - 16) : 0;
        rail.addEventListener('scroll', () => { this.railX = rail.scrollLeft; }, { passive: true });
      }
      const z = this.pg.querySelector('.fo-z'), lv = this.lvTo, cap = this.capTo, all = lv === 1;
      const land = (color, hit) => {
        const zz = this.pg.querySelector('.fo-z'); if (!zz) return;
        setLv(zz, lv); this.lvShown = lv;
        const c = this.pg.querySelector('.fo-cap'); if (c) c.innerHTML = cap;
        if (hit) { impact(zz, color); if (all) blaze(zz); } else zz.classList.toggle('blaze', all);
      };
      if (this.just) {
        const id = this.just; this.just = null;
        const b = this.pg.querySelector('[data-ring="' + id + '"]');
        if (b) requestAnimationFrame(() => requestAnimationFrame(() => {
          b.classList.remove('filled'); b.classList.add('done');
          b.querySelector('.core').classList.add('pop');
          b.querySelector('small').textContent = 'Hecho';
          L.sparks(b.querySelector('.disk'), 16);
          const color = getComputedStyle(b).getPropertyValue('--c').trim();
          if (z && !RM() && inView(z) && inView(b)) orb(b.querySelector('.disk'), z, color, () => land(color, true));
          else land(color, !!z && inView(z));
        }));
        else if (z) land('', false);
      } else if (z) requestAnimationFrame(() => requestAnimationFrame(() => land('', false)));
    }
    mark(id, on) {
      if (!L.todayItems().some(i => i.id === id)) return;
      if (on) this.just = id;
      L.setDone(id, on, on ? { anim: 1800 } : undefined);
      if (!on) L.toast('Desmarcado', { undo: () => L.setDone(id, true, { quiet: true }) });
    }
    onClick(e) {
      const t = e.target;
      let el;
      if ((el = t.closest('[data-chk]'))) { e.stopPropagation(); this.mark(el.dataset.chk, !L.isDone(el.dataset.chk)); return; }
      if ((el = t.closest('[data-swdone]'))) { this.mark(el.dataset.swdone, true); return; }
      if ((el = t.closest('[data-skip]'))) { const id = el.dataset.skip; L.skipToday(id, true); L.toast('Lo sacaste de hoy', { undo: () => L.skipToday(id, false) }); return; }
      if ((el = t.closest('[data-ring]'))) { if (this.fired) { this.fired = false; return; } openItem(el.dataset.ring, this); return; }
      if ((el = t.closest('[data-open]'))) { openItem(el.dataset.open, this); return; }
      if ((el = t.closest('[data-ctx]'))) { const c = L.topCtx(); if (c) c.click(el); return; }
      if (t.closest('[data-start]')) { L.openDia(); return; }
      if ((el = t.closest('[data-dia]'))) { L.openDia(el.dataset.dia || null); return; }
      if ((el = t.closest('[data-day]'))) { openDay(L.fromDk(el.dataset.day)); return; }
      if (t.closest('[data-llama]')) { L.llamaSheet(); return; }
      if ((el = t.closest('[data-acc]'))) { this.push(el.dataset.acc); return; }
      if ((el = t.closest('[data-enc]'))) { Encuentro.open(el.dataset.enc); return; }
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
    const go = it.a === 'llamada' ? ['phone', 'Llamar'] : disc ? ['reader-outline', 'Preparar'] : it.with ? ['chatbubble', 'Escribirle'] : it.a === 'palabra' ? ['book', 'Leer'] : it.a === 'oracion' ? ['hands-praying', 'Orar'] : it.a === 'meditar' ? ['leaf', 'Meditar'] : it.a === 'diario' ? ['create', 'Escribir'] : it.a === 'mensaje' ? ['paper-plane', 'Escribir'] : ['play', 'Empezar'];
    const html = '<div data-a="' + it.a + '"><div class="sh-head"><div class="aic">' + actIc(it.a, true) + '</div><div><h2>' + esc(it.t) + '</h2><p>' + esc(meta) + '</p></div></div>' +
      (it.n ? '<div class="note">' + ic('document-text-outline') + '<span>' + esc(it.n) + '</span></div>' : '') +
      (withP ? '<div class="mini-list"><div class="mini">' + av(withP.id, withP.name, 34) + '<div><b>' + esc(withP.name) + '</b><small>' + esc(it.h) + '</small></div></div></div>' : '') +
      '<div class="why"><p>' + esc(inf.why) + '</p><small>' + esc(inf.ref) + '</small></div>' +
      '<div class="steps">' + inf.how.map(s => '<div>' + esc(s) + '</div>').join('') + '</div>' + extras(it) +
      '<div class="row2"><button class="btn ghost" data-m>' + (done ? 'Desmarcar' : ic('checkmark') + 'Hecho') + '</button><button class="btn c" data-g>' + ic(go[0]) + go[1] + '</button></div>' +
      (done ? '' : '<button class="link skip-link" data-skip1>' + ic('moon') + ' Hoy no</button>') + '</div>';
    L.sheet(html, {
      mount: (el, m) => {
        el.querySelector('[data-m]').onclick = () => { m.dismiss(); page ? page.mark(id, !done) : L.setDone(id, !done); };
        const sk = el.querySelector('[data-skip1]');
        if (sk) sk.onclick = () => { m.dismiss(); L.skipToday(id, true); L.toast('Lo sacaste de hoy', { undo: () => L.skipToday(id, false) }); };
        const nb = el.querySelector('[data-note]');
        if (nb) nb.onclick = () => { m.dismiss(); L.prompt('Anotar sobre ' + it.t, { ph: '¿Qué te quedó?' }, v => { L.S.keeps.unshift({ a: it.a, t: v, r: it.src === 'p' ? it.t : '', d: L.tk() }); L.save(); L.refresh(); L.toast('Anotado', { icon: 'create' }); }); };
        el.querySelector('[data-g]').onclick = () => {
          m.dismiss();
          if (it.a === 'llamada') { m.onDidDismiss().then(() => L.llamar(it)); return; }
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
  L.openDay = d => openDay(d);
  function openDay(d) {
    const n = L.diffDays(d, L.today()), st = L.dayStatus(d), its = L.itemsFor(d), k = L.dk(d);
    if (n === 0) return;
    let sub, body;
    if (n > 0) {
      sub = its.length ? its.length + ' planeadas' : 'Nada planeado';
      body = its.map(i => '<div class="mini" data-a="' + i.a + '"><div class="aic">' + actIc(i.a) + '</div><div><b>' + esc(i.t) + '</b><small>' + esc([i.h, i.planName || i.n].filter(Boolean).join(' · ')) + '</small></div></div>').join('');
    } else if (st === 'lit') {
      /* lo que hiciste, a color, y lo que quedó, apagado: lo mismo que cuenta el resumen */
      const plan = L.dayPlan(d), list = L.dayDone(d), ids = new Set(list.map(i => i.id)), left = plan.filter(i => !ids.has(i.id));
      sub = 'Encendido · ' + list.length + (plan.length ? ' de ' + plan.length : '') + ' prácticas';
      body = list.map(i => '<div class="mini" data-a="' + i.a + '"><div class="aic">' + actIc(i.a, true) + '</div><div><b>' + esc(i.t) + '</b><small>' + esc(D.NAME[i.a]) + '</small></div></div>').join('') +
        left.map(i => '<div class="mini left" data-a="' + i.a + '"><div class="aic">' + actIc(i.a) + '</div><div><b>' + esc(i.t) + '</b><small>Quedó para otro día</small></div></div>').join('');
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
      { text: 'Llamarle', icon: 'phone', handler: () => L.llamar(null, id) },
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

  window.Hoy = { openItem, openDay, canFlow, addToday };
})();
