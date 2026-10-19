/* Lights · Resumen de la semana y del mes
   Qué porcentaje de los días encendiste tu llama y qué porcentaje de tus prácticas hiciste, con el período anterior al lado.
   Referencias:
   - Apple Fitness: el historial de anillos por día y el resumen de tendencias.
   - Informe semanal de Tiempo en pantalla de iOS: la comparación con la semana anterior.
   - Streaks: el porcentaje por hábito.
   Sin respaldo de referencia: «Lo que notamos» en frases, y compartirlo con tu líder (es lo propio del discipulado). */
(() => {
  const { esc, ic, actIc } = L;
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const MOM = [['mañanas', 0, 720], ['tardes', 720, 1140], ['noches', 1140, 1441]];
  const RING = 2 * Math.PI * 42, MINI = 2 * Math.PI * 15;

  /* el período: la semana (de lunes a domingo) o el mes, corrido `off` veces hacia atrás */
  function period(mode, off) {
    const t = L.today();
    if (mode === 'mes') { const a = new Date(t.getFullYear(), t.getMonth() - off, 1); return { a, b: new Date(a.getFullYear(), a.getMonth() + 1, 0) }; }
    const a = L.addDays(L.weekStart(t), -7 * off);
    return { a, b: L.addDays(a, 6) };
  }
  /* los números de un período. Hoy cuenta solo si ya lo encendiste, y de hoy solo lo que ya tocaba: así no castiga a la mañana */
  function stats(a, b) {
    const t = L.today(), now = L.mins(L.nowHM()), first = L.firstDay();
    const r = { days: 0, lit: 0, grace: 0, plan: 0, done: 0, byA: {}, mom: MOM.map(() => [0, 0]), list: [], streak: 0 };
    let run = 0;
    for (let d = a; L.diffDays(d, b) <= 0; d = L.addDays(d, 1)) {
      const n = L.diffDays(d, t);
      if (n > 0 || L.diffDays(d, first) < 0) { r.list.push({ d, out: true, future: n > 0 }); continue; }
      const st = L.dayStatus(d), its = L.dayPlan(d), dn = new Set(L.dayDone(d).map(i => i.id));
      const counted = n === 0 ? its.filter(i => dn.has(i.id) || L.mins(i.h) <= now) : its;
      if (n < 0 || st === 'lit') r.days++;
      if (st === 'lit') { r.lit++; run++; r.streak = Math.max(r.streak, run); }
      else if (st === 'grace') r.grace++;     /* el día de gracia no corta la racha */
      else if (n < 0) run = 0;
      counted.forEach(i => {
        const x = (r.byA[i.a] = r.byA[i.a] || [0, 0]), m = r.mom[Math.max(0, MOM.findIndex(q => L.mins(i.h) >= q[1] && L.mins(i.h) < q[2]))];
        x[1]++; m[1]++; r.plan++;
        if (dn.has(i.id)) { x[0]++; m[0]++; r.done++; }
      });
      r.list.push({ d, st, today: n === 0, its: counted, dn, p: counted.length ? pct(counted.filter(i => dn.has(i.id)).length, counted.length) : st === 'lit' ? 100 : 0 });
    }
    return r;
  }
  const range = (a, b) => a.getMonth() === b.getMonth() ? a.getDate() + ' – ' + b.getDate() + ' de ' + L.MN[b.getMonth()] : a.getDate() + ' de ' + L.MS[a.getMonth()] + ' – ' + b.getDate() + ' de ' + L.MS[b.getMonth()];
  const when = (mode, off) => mode === 'mes' ? ['Este mes', 'El mes pasado'][off] || 'Hace ' + off + ' meses' : ['Esta semana', 'La semana pasada'][off] || 'Hace ' + off + ' semanas';
  const prevName = mode => (mode === 'mes' ? 'el mes pasado' : 'la semana pasada');

  /* un número grande con su anillo (Apple Fitness) y la diferencia con el período anterior */
  function tile(cls, color, p, label, sub, prev, mode) {
    let delta = '';
    if (prev != null) {
      const dd = p - prev;
      delta = '<p class="rs-dl ' + (dd > 0 ? 'up' : dd < 0 ? 'down' : '') + '">' + (dd ? ic('arrow-up') + Math.abs(dd) + (Math.abs(dd) === 1 ? ' punto' : ' puntos') + (dd > 0 ? ' más' : ' menos') + ' que ' : 'Igual que ') + prevName(mode) + '</p>';
    }
    return '<div class="rs-t ' + cls + '" style="--rc:' + color + '"><div class="rs-ring"><svg viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="42"/>' +
      '<circle class="bar" cx="50" cy="50" r="42" style="stroke-dasharray:' + RING.toFixed(1) + ';stroke-dashoffset:' + RING.toFixed(1) + '" data-o="' + (RING * (1 - p / 100)).toFixed(1) + '"/></svg>' +
      '<b><span data-n="' + p + '">0</span><small>%</small></b></div><p class="rs-l">' + label + '</p><p class="rs-s">' + sub + '</p>' + delta + '</div>';
  }
  /* la semana: una barra por día, apilada con el color de cada práctica hecha */
  function weekBars(r) {
    return '<div class="rs-week">' + r.list.map(x => {
      const lab = '<small>' + L.DL[x.d.getDay()] + '</small><i>' + x.d.getDate() + '</i>';
      if (x.out) return '<div class="rs-day out">' + '<div class="rs-bar"></div>' + lab + '</div>';
      const segs = x.its.filter(i => x.dn.has(i.id)).map(i => '<s data-a="' + i.a + '" style="flex-basis:' + (100 / x.its.length).toFixed(2) + '%"></s>').join('');
      const extra = !x.its.length && x.st === 'lit' ? '<s style="flex-basis:100%;background:var(--brand)"></s>' : '';
      return '<button class="rs-day ' + x.st + (x.today ? ' now' : '') + '" data-rday="' + L.dk(x.d) + '"><div class="rs-bar">' + segs + extra + (x.st === 'grace' ? ic('sunny', 'rs-sun') : '') + '</div>' + lab + '</button>';
    }).join('') + '</div>';
  }
  /* el mes: un calendario de anillitos, como el historial de Apple Fitness */
  function monthCal(r, a) {
    const lead = L.WEEK.indexOf(a.getDay());
    return '<div class="rs-cal">' + L.WEEK.map(w => '<span class="dh">' + L.DL[w] + '</span>').join('') + '<span class="sp"></span>'.repeat(lead) +
      r.list.map(x => {
        const n = x.d.getDate();
        if (x.out) return '<div class="rs-c out"><span>' + n + '</span></div>';
        return '<button class="rs-c ' + x.st + (x.today ? ' now' : '') + '" data-rday="' + L.dk(x.d) + '"><svg viewBox="0 0 36 36"><circle class="trk" cx="18" cy="18" r="15"/>' +
          '<circle class="bar" cx="18" cy="18" r="15" style="stroke-dasharray:' + MINI.toFixed(1) + ';stroke-dashoffset:' + MINI.toFixed(1) + '" data-o="' + (MINI * (1 - x.p / 100)).toFixed(1) + '"/></svg><span>' + n + '</span>' + (x.st === 'grace' ? ic('sunny', 'rs-sun') : '') + '</button>';
      }).join('') + '</div>';
  }
  /* el mes semana a semana */
  function weekRows(a, b) {
    const out = [];
    for (let w = L.weekStart(a); L.diffDays(w, b) <= 0; w = L.addDays(w, 7)) {
      const x = L.diffDays(w, a) < 0 ? a : w, y = L.diffDays(L.addDays(w, 6), b) > 0 ? b : L.addDays(w, 6);
      if (L.diffDays(x, L.today()) > 0) break;
      const s = stats(x, y);
      if (!s.days) continue;
      const p = pct(s.done, s.plan), cur = L.diffDays(w, L.weekStart(L.today())) === 0;
      out.push('<div class="rs-wk' + (cur ? ' cur' : '') + '"><span>' + range(x, y).replace(/ de (\w+)$/, ' $1') + '</span><i><s data-w="' + p + '"></s></i><b>' + p + '%</b></div>');
    }
    return out.join('');
  }
  /* por práctica, de la que más planeaste a la que menos */
  function byActivity(r) {
    return Object.entries(r.byA).sort((x, y) => y[1][1] - x[1][1]).map(([a, [d, n]]) => {
      const p = pct(d, n);
      return '<div class="rs-a" data-a="' + a + '"><div class="aic">' + actIc(a, true) + '</div><div class="rs-am"><b>' + esc(D.NAME[a]) + '</b><i><s data-w="' + p + '"></s></i></div><span><b>' + p + '%</b><small>' + d + ' de ' + n + '</small></span></div>';
    }).join('');
  }
  /* lo que se ve en los números, dicho simple y sin culpa */
  function insights(r, mode, off) {
    const out = [], acts = Object.entries(r.byA).filter(x => x[1][1] >= 3).map(([a, [d, n]]) => ({ a, d, n, p: pct(d, n) }));
    const best = acts.slice().sort((x, y) => y.p - x.p || y.n - x.n)[0], low = acts.slice().sort((x, y) => x.p - y.p || y.n - x.n)[0];
    if (best && best.p >= 60) out.push(['trophy', best.a, '<b>' + esc(D.NAME[best.a]) + '</b> fue lo más firme: ' + best.d + ' de ' + best.n + '.']);
    if (low && low !== best && low.p < 70) out.push(['lightbulb', low.a, '<b>' + esc(D.NAME[low.a]) + '</b> es lo que más se te pasa (' + low.d + ' de ' + low.n + '). Probá cambiarle la hora o hacerlo más corto.']);
    const mo = r.mom.map((x, i) => ({ i, p: pct(x[0], x[1]), n: x[1] })).filter(x => x.n >= 3).sort((x, y) => y.p - x.p);
    if (mo.length > 1 && mo[0].p - mo[mo.length - 1].p >= 15) out.push(['clock', '', 'Tus <b>' + MOM[mo[0].i][0] + '</b> son lo más constante (' + mo[0].p + '%); las ' + MOM[mo[mo.length - 1].i][0] + ' cuestan más (' + mo[mo.length - 1].p + '%).']);
    if (r.streak >= 3) out.push(['flame', '', 'Tu racha más larga: <b>' + r.streak + ' días seguidos</b> encendidos.']);
    if (mode === 'semana' && off === 0) {
      const w = L.weekLit();
      out.push(['flag', '', w >= L.GOAL ? 'Llegaste a tu meta de <b>' + L.GOAL + ' días</b> esta semana.' : 'Te ' + (L.GOAL - w === 1 ? 'falta 1 día' : 'faltan ' + (L.GOAL - w) + ' días') + ' para tu meta de ' + L.GOAL + '. Todavía hay tiempo.']);
    }
    if (r.grace) out.push(['sunny', '', 'Usaste ' + (r.grace === 1 ? '1 día de gracia' : r.grace + ' días de gracia') + ': la llama siguió.']);
    return out.slice(0, 4).map(x => '<div class="rs-in"' + (x[1] ? ' data-a="' + x[1] + '"' : '') + '><span class="aic">' + ic(x[0]) + '</span><p>' + x[2] + '</p></div>').join('');
  }

  class PageResumen extends L.Page {
    shell() {
      return L.shell({ title: 'Resumen', back: '', large: false,
        top: '<div class="segw"><ion-segment value="' + (this.mode || 'semana') + '" data-seg><ion-segment-button value="semana"><ion-label>Semana</ion-label></ion-segment-button><ion-segment-button value="mes"><ion-label>Mes</ion-label></ion-segment-button></ion-segment></div>' });
    }
    mount() {
      this.mode = this.mode || 'semana'; this.off = this.off || 0;
      this.addEventListener('ionChange', e => { if (e.target.matches('[data-seg]')) { this.mode = e.detail.value; this.off = 0; this.update(); } });
    }
    render() {
      const { a, b } = period(this.mode, this.off), r = stats(a, b), m = this.mode;
      const pp = period(m, this.off + 1), hasPrev = L.diffDays(pp.a, L.firstDay()) >= -3, pr = hasPrev ? stats(pp.a, pp.b) : null;
      const canBack = L.diffDays(pp.b, L.firstDay()) >= 0;
      const T = L.TIERS[L.tierOf(L.litDays())];
      const dP = pct(r.lit, r.days), aP = pct(r.done, r.plan);
      const title = m === 'mes' ? L.cap(L.MN[a.getMonth()]) + (a.getFullYear() !== L.today().getFullYear() ? ' ' + a.getFullYear() : '') : range(a, b);
      return '<div class="rs-nav"><button class="iconbtn" data-prev aria-label="Anterior"' + (canBack ? '' : ' disabled') + '>' + ic('chevron-back') + '</button>' +
        '<div><b>' + esc(title) + '</b><small>' + when(m, this.off) + (this.off === 0 ? ' · hasta hoy' : '') + '</small></div>' +
        '<button class="iconbtn" data-next aria-label="Siguiente"' + (this.off ? '' : ' disabled') + '>' + ic('chevron-forward') + '</button></div>' +
        '<div class="rs-tiles">' +
          tile('rs-days', T.c, dP, 'de los días con tu llama encendida', r.lit + ' de ' + r.days + ' días' + (r.grace ? ' · ' + r.grace + ' de gracia' : ''), pr && pr.days ? pct(pr.lit, pr.days) : null, m) +
          tile('rs-prac', 'var(--brand)', aP, 'de tus prácticas, hechas', r.done + ' de ' + r.plan + ' prácticas', pr && pr.plan ? pct(pr.done, pr.plan) : null, m) +
        '</div>' +
        (m === 'mes' ? monthCal(r, a) + '<div class="sec"><h2>Semana a semana</h2><span class="muted">prácticas hechas</span></div><div class="rs-wks">' + weekRows(a, b) + '</div>' : weekBars(r)) +
        '<p class="rs-hint">' + ic('information-circle-outline') + 'Toca un día para ver qué hiciste.</p>' +
        '<div class="sec"><h2>Lo que notamos</h2></div><div class="rs-ins">' + insights(r, m, this.off) + '</div>' +
        '<div class="sec"><h2>Por práctica</h2></div><div class="rs-acts">' + (byActivity(r) || '<p class="muted">Nada planeado en este período.</p>') + '</div>' +
        '<div class="rs-foot">' + (m === 'semana' && this.off <= 1 ? '<button class="btn ghost" data-repaso>' + ic('ribbon') + 'Repaso de la semana</button>' : '') +
        '<button class="btn" data-share>' + ic('paper-plane') + 'Compartir con ' + esc(D.LEADER.first) + '</button></div>';
    }
    after() {
      /* los anillos se llenan, los números cuentan y las barras crecen */
      requestAnimationFrame(() => requestAnimationFrame(() => {
        this.pg.querySelectorAll('circle.bar[data-o]').forEach(c => { c.style.strokeDashoffset = c.dataset.o; });
        this.pg.querySelectorAll('s[data-w]').forEach(s => { s.style.width = s.dataset.w + '%'; });
        this.pg.querySelectorAll('.rs-day .rs-bar').forEach((b, i) => setTimeout(() => b.classList.add('in'), 40 * i));
      }));
      this.pg.querySelectorAll('[data-n]').forEach(el => {
        const to = +el.dataset.n, t0 = performance.now();
        const step = now => { const k = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
    }
    onClick(e) {
      const t = e.target; let el;
      if (t.closest('[data-prev]:not([disabled])')) { this.off++; L.haptic(6); this.update(); L.slide && L.slide(this.pg, -1); return; }
      if (t.closest('[data-next]:not([disabled])')) { this.off--; L.haptic(6); this.update(); L.slide && L.slide(this.pg, 1); return; }
      if ((el = t.closest('[data-rday]'))) { const d = L.fromDk(el.dataset.rday); if (L.diffDays(d, L.today()) === 0) { L.toast('Hoy lo ves en tu llama', { icon: 'flame' }); return; } L.openDay && L.openDay(d); return; }
      if (t.closest('[data-repaso]')) { window.Repaso && Repaso.start(); return; }
      if (t.closest('[data-share]')) { share(this); return; }
    }
  }
  L.define('page-resumen', PageResumen);

  /* compartirlo con tu líder: ves antes lo que le llega */
  function share(page) {
    const { a, b } = period(page.mode, page.off), r = stats(a, b), lead = D.LEADER;
    const what = (page.mode === 'mes' ? 'Mi ' + L.MN[a.getMonth()] : 'Mi semana (' + range(a, b) + ')') + ': encendí la llama ' + pct(r.lit, r.days) + '% de los días e hice el ' + pct(r.done, r.plan) + '% de mis prácticas.';
    L.sheet('<h2 class="sh-title">Compartir con ' + esc(lead.first) + '</h2><p class="sh-sub">Le llega como mensaje. Solo los números, sin el detalle de cada día.</p>' +
      '<div class="rs-msg">' + L.av(lead.id, lead.name, 34) + '<p>' + esc(what) + '</p></div><button class="btn" data-send>' + ic('paper-plane') + 'Enviar</button>', {
      mount: (el, m) => { el.querySelector('[data-send]').onclick = () => { m.dismiss(); L.toast('Le mandaste tu resumen a ' + lead.first, { icon: 'paper-plane' }); L.haptic([10, 40, 16]); }; }
    });
  }

  /* la tarjeta chica de Tu camino: esta semana en dos números */
  L.resumenCard = () => {
    const { a, b } = period('semana', 0), r = stats(a, b), T = L.TIERS[L.tierOf(L.litDays())];
    const mini = (p, c, lab) => '<div class="rsm-n" style="--rc:' + c + '"><svg viewBox="0 0 36 36"><circle class="trk" cx="18" cy="18" r="15"/><circle class="bar" cx="18" cy="18" r="15" style="stroke-dasharray:' + MINI.toFixed(1) + ';stroke-dashoffset:' + (MINI * (1 - p / 100)).toFixed(1) + '"/></svg><div><b>' + p + '%</b><small>' + lab + '</small></div></div>';
    return '<button class="rs-mini" data-resumen><div class="rsm-h"><b>Tu resumen</b><span>Esta semana' + ic('chevron-forward') + '</span></div><div class="rsm-row">' +
      mini(pct(r.lit, r.days), T.c, 'de los días') + mini(pct(r.done, r.plan), 'var(--brand)', 'de tus prácticas') + '</div></button>';
  };
})();
