/* Lights · Accesos rápidos
   - El botón + (Threads, Instagram: crear a un toque desde cualquier pestaña): lo frecuente en una grilla que sube en cascada.
   - Mi lectura (YouVersion: el plan con su avance) y Mi semana (Structured: el plan de cada día), que se abren desde Hoy. */
(() => {
  const { esc, ic, actIc } = L;

  /* ---------- el + ---------- */
  const QA = [
    ['diario', 'create', 'Anotar', 'lo que Dios te dijo', () => L.prompt('¿Qué te dijo Dios hoy?', { ph: 'Una frase, un versículo, una idea' }, v => { L.S.keeps.unshift({ a: 'diario', t: v, r: '', d: L.tk() }); L.save(); L.refresh(); L.toast('Anotado', { icon: 'create' }); })],
    ['oracion', 'hands-praying', 'Pedido de oración', 'por ti o por alguien', () => window.Oracion && Oracion.addPet()],
    ['palabra', 'book', 'Seguir leyendo', '', () => { const it = reading(); if (it && !L.isDone(it.id)) Flujo.start([it]); else L.go('hoy'), setTimeout(() => openHere('page-lectura'), 300); }],
    ['brand', 'add-circle', 'Agregar a hoy', 'una práctica solo hoy', () => window.Hoy && Hoy.addToday()],
    ['llamada', 'phone', 'Llamar a alguien', 'para preguntar cómo está', () => L.llamar()],
    ['encuentro', 'people', 'Anotar con alguien', 'oraron, leyeron, hablaron', () => L.anotar()],
    ['meditar', 'leaf', 'Memorizar', 'un versículo', () => L.memorize && L.memorize()]
  ];
  const reading = () => L.todayItems().find(i => i.plan === 'biblia') || L.todayItems().find(i => i.a === 'palabra');
  function openHere(tag) { const nav = document.getElementById('nav-hoy'); if (nav) nav.push(tag); }
  L.openAcceso = openHere;

  function mountFab() {
    const app = document.querySelector('ion-app'); if (!app || app.querySelector('.fab')) return;
    const w = document.createElement('div'); w.className = 'qa-wrap';
    w.innerHTML = '<div class="qa-veil" data-qx></div><div class="qa-grid"><p class="qa-t">¿Qué quieres hacer?</p>' +
      QA.map((q, i) => '<button data-a="' + q[0] + '" data-qa="' + i + '" style="transition-delay:' + i * 35 + 'ms">' + ic(q[1]) + '<span>' + q[2] + '<small data-qs="' + i + '">' + q[3] + '</small></span></button>').join('') + '</div>' +
      '<button class="fab" aria-label="Acciones rápidas">' + ic('add') + '</button>';
    app.appendChild(w);
    const close = () => w.classList.remove('on');
    w.querySelector('.fab').onclick = () => {
      const it = reading(); w.querySelector('[data-qs="2"]').textContent = it ? it.t + (L.isDone(it.id) ? ' · hecho' : '') : 'tu plan de lectura';
      w.classList.toggle('on'); L.haptic(8);
    };
    w.addEventListener('click', e => {
      if (e.target.closest('[data-qx]')) { close(); return; }
      const b = e.target.closest('[data-qa]'); if (!b) return;
      close(); L.haptic(10); setTimeout(QA[+b.dataset.qa][4], 220);
    });
  }
  customElements.whenDefined('ion-app').then(() => setTimeout(mountFab, 300));

  /* ---------- Mi lectura ---------- */
  const ringSVG = (p, c, r) => { const C = 2 * Math.PI * r, s = r * 2 + 12; return '<svg viewBox="0 0 ' + s + ' ' + s + '"><circle cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + r + '" style="stroke:color-mix(in srgb, ' + c + ' 18%, transparent)"/><circle class="bar" cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + r + '" style="stroke:' + c + ';stroke-dasharray:' + C.toFixed(1) + ';stroke-dashoffset:' + C.toFixed(1) + '" data-o="' + (C * (1 - p)).toFixed(1) + '"/></svg>'; };
  L.ringSVG = ringSVG;
  const animateRings = root => requestAnimationFrame(() => requestAnimationFrame(() => root.querySelectorAll('circle.bar[data-o]').forEach(c => { c.style.strokeDashoffset = c.dataset.o; })));
  L.animateRings = animateRings;
  function planInfo(p) {
    const day = Math.max(1, Math.min(p.len, L.planDay(p, L.today())));
    const items = [0, 1, 2, 3].map(k => L.itemsFor(L.addDays(L.today(), k)).filter(i => i.plan === p.id));
    return { day, pct: day / p.len, items };
  }
  class PageLectura extends L.Page {
    shell() { return L.shell({ title: 'Mi lectura', back: '', large: false }); }
    render() {
      const plans = L.S.plans.filter(p => !p.paused), bib = plans.find(p => p.id === 'biblia');
      let head = '';
      if (bib) {
        const x = planInfo(bib), today = x.items[0][0];
        const bi = today ? D.BOOKS.findIndex(b => today.t.startsWith(b[0])) : -1;
        head = '<div class="ml-hero" data-a="palabra"><div class="ml-ring">' + ringSVG(x.pct, 'var(--palabra)', 42) + '<b>' + Math.round(x.pct * 100) + '<small>%</small></b></div><div><h2>' + esc(bib.name) + '</h2><p>Día ' + x.day + ' de ' + bib.len + '</p>' +
          (bi >= 0 ? '<p class="muted">Vas por ' + esc(D.BOOKS[bi][0]) + ' · ' + (bi < D.AT ? 'Antiguo' : 'Nuevo') + ' Testamento</p>' : '') + '</div></div>' +
          (bi >= 0 ? '<div class="ml-books">' + D.BOOKS.map((b, k) => '<i class="' + (k < bi ? 'r' : k === bi ? 'n' : '') + '" title="' + esc(b[0]) + '"></i>').join('') + '</div>' : '') +
          '<div class="ml-list">' + x.items.map((its, k) => its.map(i => row(i, k)).join('')).join('') + '</div>';
      }
      const others = plans.filter(p => p.id !== 'biblia').map(p => {
        const x = planInfo(p), it = x.items[0][0];
        return '<button class="ml-plan" data-a="' + p.acts[0] + '" data-pl="' + p.id + '"><span class="ml-mini">' + ringSVG(x.pct, 'var(--c)', 15) + '</span><div><b>' + esc(p.name) + (p.sub ? ' · ' + esc(p.sub) : '') + '</b><small>Día ' + x.day + ' de ' + p.len + (it ? ' · hoy ' + esc(it.t) : '') + '</small></div>' + (it && !x.items[0].every(i => L.isDone(i.id)) ? '<span class="go">Seguir</span>' : ic('checkmark-circle', 'ok')) + '</button>';
      }).join('');
      return head + (others ? '<div class="sec"><h2>Tus otros planes</h2></div>' + others : '') +
        '<button class="btn ghost" data-explore>' + ic('library') + 'Explorar planes</button>';
    }
    after() { animateRings(this.pg); }
    onClick(e) {
      let el;
      if ((el = e.target.closest('[data-read]'))) { const it = L.todayItems().find(i => i.id === el.dataset.read); if (it) Flujo.start([it]); return; }
      if ((el = e.target.closest('[data-pl]'))) { const its = L.todayItems().filter(i => i.plan === el.dataset.pl && !L.isDone(i.id)); if (its.length) Flujo.start(its); return; }
      if (e.target.closest('[data-explore]')) L.go('planes');
    }
  }
  function row(i, k) {
    const done = k === 0 && L.isDone(i.id);
    const when = ['Hoy', 'Mañana', L.cap(L.DN[L.addDays(L.today(), 2).getDay()]), L.cap(L.DN[L.addDays(L.today(), 3).getDay()])][k];
    return '<div class="ml-row' + (k ? ' later' : '') + (done ? ' done' : '') + '" data-a="' + i.a + '"><span class="aic">' + actIc(i.a, k === 0) + '</span><div><b>' + when + ' · ' + esc(i.t) + '</b><small>' + esc(i.h) + (i.a === 'palabra' ? ' · ' + (D.PLANS.find(p => p.id === i.plan) || {}).min + ' min' : '') + '</small></div>' +
      (k === 0 ? (done ? ic('checkmark-circle', 'ok') : '<button class="go" data-read="' + i.id + '">Leer</button>') : '') + '</div>';
  }
  L.define('page-lectura', PageLectura);

  /* ---------- Mi semana ---------- */
  class PageSemana extends L.Page {
    shell() { return L.shell({ title: 'Mi semana', back: '', large: false }); }
    render() {
      const t = L.today(), days = L.weekDates(t);
      let plan = 0, done = 0, lit = 0;
      const rows = days.map(d => {
        const n = L.diffDays(d, t), its = L.dayPlan(d), dn = new Set(L.dayDone(d).map(i => i.id)), st = L.dayStatus(d);
        if (n <= 0) { plan += its.length; done += its.filter(i => dn.has(i.id)).length; if (st === 'lit') lit++; }
        return '<button class="mw-day' + (n === 0 ? ' now' : n < 0 ? ' past' : '') + ' ' + st + '" data-wd="' + L.dk(d) + '"><span class="mw-dn"><small>' + L.DS[d.getDay()] + '</small><b>' + d.getDate() + '</b></span><span class="mw-chips">' +
          (its.length ? its.map(i => '<span data-a="' + i.a + '" class="' + (dn.has(i.id) ? 'done' : n < 0 ? 'miss' : '') + '">' + ic(D.ICON[i.a]) + esc(i.t.length > 16 ? D.NAME[i.a] : i.t) + '</span>').join('') : '<em>Libre</em>') + '</span>' +
          (st === 'grace' ? ic('sunny', 'mw-st') : '') + '</button>';
      }).join('');
      return '<div class="mw-sum"><div><b>' + lit + '</b><small>de ' + (days.filter(d => L.diffDays(d, t) <= 0).length) + ' días encendidos</small></div><div><b>' + done + '</b><small>de ' + plan + ' prácticas hasta hoy</small></div><div><b>' + L.GOAL + '</b><small>días es tu meta</small></div></div>' +
        '<div class="mw-list">' + rows + '</div>' +
        '<div class="row2"><button class="btn ghost" data-hab>' + ic('leaf') + 'Mis hábitos</button><button class="btn" data-edit>' + ic('calendar') + 'Cambiar mi semana</button></div>';
    }
    after() { L.stagger && L.stagger(this.pg); }
    onClick(e) {
      let el;
      if ((el = e.target.closest('[data-wd]'))) { const d = L.fromDk(el.dataset.wd); if (L.diffDays(d, L.today()) === 0) { this.pop(); return; } L.openDay(d); return; }
      if (e.target.closest('[data-edit]')) { L.go('planes'); return; }
      if (e.target.closest('[data-hab]')) this.push('page-habitos');
    }
  }
  L.define('page-semana', PageSemana);
})();
