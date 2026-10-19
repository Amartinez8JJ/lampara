/* Lámpara v4 · Empezar
   Tu tiempo con Dios paso a paso, como historias: una práctica por pantalla, un botón para seguir. */
(() => {
  const { esc, ic, actIc } = L;
  let st = null;
  const SONGS = ['Cuán grande es Él', 'Sublime gracia', 'Santo, santo, santo'];
  const DIARY_SEEDS = ['Hoy aprendí que ', 'Gracias por ', 'Te pido que '];

  function start(items, o) {
    o = o || {};
    if (!items || !items.length) return;
    L.full((el, m) => {
      st = { items, i: 0, m, el, timers: [], o };
      el.innerHTML = '<div class="fl-top"><div class="fl-bars">' + items.map(it => '<i data-a="' + it.a + '"></i>').join('') + '</div>' +
        '<button class="iconbtn fl-x" data-x aria-label="Cerrar">' + ic('close') + '</button></div><div class="fl-stage"><div class="fl-body"></div></div><div class="fl-foot"></div>';
      el.addEventListener('click', onClick);
      el.addEventListener('input', onInput);
      show(0, 0);
    }, { cls: 'flow', onClose: () => { stopTimers(); st = null; } });
  }
  const cur = () => st.items[st.i];
  function stopTimers() { if (st) { st.timers.forEach(t => clearInterval(t)); st.timers = []; } }
  function bars() {
    st.el.querySelectorAll('.fl-bars i').forEach((b, k) => { b.className = k < st.i ? 'done' : k === st.i ? 'now' : ''; });
  }

  /* ---------- cada paso ---------- */
  function head(it, title, sub) {
    return '<div class="fl-head"><div class="aic">' + actIc(it.a, true) + '</div><p class="eyebrow">' + esc(D.NAME[it.a]) + (it.planName ? ' · ' + esc(it.planName) : '') + '</p><h1>' + esc(title) + '</h1>' + (sub ? '<p class="fl-sub">' + esc(sub) + '</p>' : '') + '</div>';
  }
  const STEP = {
    oracion(it) {
      const pets = L.S.pets.slice(0, 6);
      return head(it, 'Hablemos con Dios', it.n) +
        '<div class="pcard"><b>' + ic('sunny-outline') + 'Gracias</b><p>Empieza por lo bueno de ayer y de hoy.</p></div>' +
        '<div class="pcard"><b>' + ic('people-outline') + 'Por otros</b><p>Toca cada pedido cuando ores por él.</p><div class="chips">' +
        pets.map(p => '<button class="chip pet" data-pet="' + p.id + '">' + esc(p.who === 'yo' ? p.t : (L.person(p.who) || { first: '' }).first + ' · ' + p.t) + '</button>').join('') + '</div></div>' +
        '<div class="pcard"><b>' + ic('person-outline') + 'Por ti</b><p>Entrégale lo que hoy te preocupa.</p></div>';
    },
    palabra(it) {
      const txt = D.TEXT[it.t];
      st.mode = st.mode || (txt ? 'app' : 'papel');
      const seg = '<div class="fl-seg"><button class="' + (st.mode === 'app' ? 'on' : '') + '" data-mode="app">Leer aquí</button><button class="' + (st.mode === 'papel' ? 'on' : '') + '" data-mode="papel">En mi Biblia</button></div>';
      let body;
      if (st.mode === 'app' && txt) {
        body = '<p class="fl-hint">Toca el versículo que te llevas hoy.</p><div class="reader">' + txt.map(v => '<p class="vs' + (st.keep === v[0] ? ' on' : '') + '" data-vs="' + v[0] + '"><sup>' + v[0].split(':')[1] + '</sup>' + esc(v[1]) + '</p>').join('') + '</div>' +
          '<p class="fl-hint small">Texto de muestra (RVR1960). En la app final, el capítulo completo.</p>';
      } else if (st.mode === 'app') {
        body = '<div class="note">' + ic('information-circle-outline') + '<span>Este pasaje todavía no está en la app de prueba. Léelo en tu Biblia.</span></div>';
      } else {
        const s = st.sw || 0;
        body = '<div class="paper"><p class="eyebrow">Abre tu Biblia en</p><h2>' + esc(it.t) + '</h2>' +
          '<button class="watch' + (st.swOn ? ' on' : '') + '" data-watch><span class="wt">' + mmss(s) + '</span><small>' + (st.swOn ? 'Pausar' : s ? 'Seguir' : 'Tocar para medir') + '</small></button></div>';
      }
      return head(it, it.t, it.src === 'p' ? 'Día ' + it.day + ' de ' + it.len : '') + seg + body;
    },
    meditar(it) {
      const ref = it.t, v = D.VTXT[ref] || (D.VERSES.find(x => x.r === ref) || D.VERSES[0]).t;
      const words = v.replace(/[.,;:¿?¡!«»]/g, '').split(/\s+/).filter(w => w.length > 3);
      const dur = st.dur || 3;
      const left = st.left == null ? dur * 60 : st.left;
      const C = 2 * Math.PI * 54;
      return head(it, ref) + '<blockquote class="mv">' + esc(v) + '</blockquote>' +
        '<div class="medi"><div class="mring' + (st.mOn ? ' on' : '') + '"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" class="trk"/><circle cx="60" cy="60" r="54" class="bar" stroke-dasharray="' + C.toFixed(1) + '" style="stroke-dashoffset:' + (C * (left / (dur * 60))).toFixed(1) + '"/></svg>' +
        '<button data-mtoggle><b class="mt">' + mmss(left) + '</b><small>' + (st.mOn ? 'En silencio' : left < dur * 60 ? 'Seguir' : 'Empezar') + '</small></button></div>' +
        '<div class="chips center">' + [2, 3, 5, 10].map(n => '<button class="chip' + (n === dur ? ' on' : '') + '" data-dur="' + n + '">' + n + ' min</button>').join('') + '</div></div>' +
        '<p class="fl-hint">¿Qué palabra se te queda?</p><div class="chips words">' + [...new Set(words)].slice(0, 10).map(w => '<button class="chip' + (st.word === w ? ' on' : '') + '" data-word="' + esc(w) + '">' + esc(w) + '</button>').join('') + '</div>';
    },
    diario(it) {
      return head(it, it.t === 'Diario' ? 'Una línea de hoy' : it.t, it.n || '¿Qué te dijo Dios hoy?') +
        '<textarea class="fl-text" data-diary rows="5" placeholder="Escribe aquí…">' + esc(st.diary || '') + '</textarea>' +
        '<div class="chips">' + DIARY_SEEDS.map(s => '<button class="chip" data-seed="' + esc(s) + '">' + esc(s.trim()) + '…</button>').join('') + '</div>';
    },
    mensaje(it) {
      st.to = st.to || L.S.people.map(p => p.id);
      const v = D.VERSES[L.today().getDate() % D.VERSES.length];
      return head(it, it.t, it.n) + '<div class="msg-prev"><p>«' + esc(v.t) + '» ' + esc(v.r) + '</p><small>¿Cómo puedo orar por ti esta semana?</small></div>' +
        '<div class="to-list">' + L.S.people.map(p => '<button class="to' + (st.to.includes(p.id) ? ' on' : '') + '" data-to="' + p.id + '">' + L.av(p.id, p.name, 40) + '<span>' + esc(p.first) + '</span><i>' + ic('checkmark') + '</i></button>').join('') + '</div>';
    },
    adoracion(it) {
      return head(it, it.t === 'Adoración' ? 'Mira a Dios' : it.t, it.n) +
        '<div class="pcard"><b>' + ic('musical-notes-outline') + 'Canta o escucha</b><div class="chips">' + SONGS.map(s => '<button class="chip" data-song>' + esc(s) + '</button>').join('') + '</div></div>' +
        '<div class="pcard"><b>' + ic('sparkles-outline') + 'Agradece tres cosas</b><p>En voz alta, sin apuro.</p></div>';
    },
    ayuno(it) {
      return head(it, it.t, 'Hasta las ' + it.h) + '<div class="pcard"><b>' + ic('water-outline') + 'Toma agua</b><p>Y en cada comida que dejas, ora.</p></div>' +
        (it.n ? '<div class="pcard"><b>' + ic('heart-outline') + 'Ayunas por</b><p>' + esc(it.n) + '</p></div>' : '');
    }
  };
  const PRIMARY = { oracion: 'Amén', palabra: 'Terminé de leer', meditar: 'Listo', diario: 'Guardar', mensaje: 'Enviar', adoracion: 'Listo', ayuno: 'Lo estoy haciendo' };
  const mmss = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

  function show(i, dir) {
    stopTimers();
    st.i = i; st.mode = null; st.keep = null; st.sw = 0; st.swOn = false; st.dur = 3; st.left = null; st.mOn = false; st.word = null; st.diary = ''; st.to = null;
    bars();
    paint(dir);
  }
  function paint(dir) {
    const it = cur(), body = st.el.querySelector('.fl-body'), foot = st.el.querySelector('.fl-foot');
    body.setAttribute('data-a', it.a); foot.setAttribute('data-a', it.a);
    body.innerHTML = STEP[it.a](it);
    const lbl = it.a === 'mensaje' ? 'Enviar a ' + (st.to || []).length : PRIMARY[it.a];
    foot.innerHTML = '<button class="btn c big" data-next>' + ic('checkmark') + lbl + '</button><button class="link fl-skip" data-skip>Saltar por ahora</button>';
    if (dir && !L.RM()) body.animate([{ transform: 'translateX(' + (dir * 40) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
    if (dir) st.el.querySelector('.fl-stage').scrollTop = 0;
  }
  const repaint = () => { const y = st.el.querySelector('.fl-stage').scrollTop; paint(0); st.el.querySelector('.fl-stage').scrollTop = y; };

  function complete() {
    const it = cur();
    if (it.a === 'palabra') {
      if (st.keep) {
        const v = (D.TEXT[it.t] || []).find(x => x[0] === st.keep);
        if (v) { L.S.keeps.unshift({ a: 'palabra', t: v[1], r: it.t.split(' ')[0] + ' ' + v[0], d: L.tk() }); L.toast('Te llevas ' + it.t.split(' ')[0] + ' ' + v[0], { icon: 'bookmark' }); }
      }
      if (st.mode === 'papel') L.S.stats.paper++;
    }
    if (it.a === 'meditar' && st.word) L.S.keeps.unshift({ a: 'meditar', t: st.word, r: it.t, d: L.tk() });
    if (it.a === 'diario' && st.diary.trim()) { L.S.keeps.unshift({ a: 'diario', t: st.diary.trim(), d: L.tk() }); L.S.stats.diary++; }
    if (it.a === 'mensaje') L.toast('Enviado a ' + st.to.length + ' personas', { icon: 'paper-plane' });
    L.setDone(it.id, true, { quiet: true });
    const b = st.el.querySelectorAll('.fl-bars i')[st.i];
    L.sparks(st.el.querySelector('[data-next]'), 10);
    next(b);
  }
  function next() {
    if (st.i + 1 < st.items.length) { show(st.i + 1, 1); return; }
    finish();
  }
  function finish() {
    stopTimers();
    const m = st.m;
    if (L.allDone()) { m.dismiss().then(() => setTimeout(L.celebrate, 60)); return; }
    const left = L.todayItems().filter(i => !L.isDone(i.id));
    bars(); st.el.querySelectorAll('.fl-bars i').forEach(b => { b.className = 'done'; });
    st.el.querySelector('.fl-body').removeAttribute('data-a');
    st.el.querySelector('.fl-body').innerHTML = '<div class="fl-end"><div class="coin fl">' + ic('checkmark') + '</div><h1>Listo por ahora</h1><p class="fl-sub">' + (L.litToday() ? 'Tu día ya está encendido.' : '') + '</p>' +
      (left.length ? '<p class="eyebrow">Te queda</p><div class="mini-list">' + left.map(i => '<div class="mini" data-a="' + i.a + '"><div class="aic">' + actIc(i.a) + '</div><div><b>' + esc(i.t) + '</b><small>' + esc(i.h) + '</small></div></div>').join('') + '</div>' : '') + '</div>';
    st.el.querySelector('.fl-foot').innerHTML = '<button class="btn big" data-x>Cerrar</button>';
  }

  function onClick(e) {
    const t = e.target;
    let el;
    if (t.closest('[data-x]')) { st.m.dismiss(); return; }
    if (t.closest('[data-next]')) { complete(); return; }
    if (t.closest('[data-skip]')) { next(); return; }
    if ((el = t.closest('[data-pet]'))) {
      if (el.classList.contains('on')) return;
      el.classList.add('on', 'pop'); L.haptic(8);
      const p = L.S.pets.find(x => String(x.id) === el.dataset.pet);
      if (p) { p.n++; if (p.who !== 'yo') L.S.stats.prayOthers++; L.S.prayedToday[p.id] = 1; L.save(); }
      return;
    }
    if ((el = t.closest('[data-mode]'))) { st.mode = el.dataset.mode; stopTimers(); st.swOn = false; repaint(); return; }
    if ((el = t.closest('[data-vs]'))) { st.keep = st.keep === el.dataset.vs ? null : el.dataset.vs; L.haptic(6); st.el.querySelectorAll('.vs').forEach(v => v.classList.toggle('on', v.dataset.vs === st.keep)); return; }
    if (t.closest('[data-watch]')) {
      st.swOn = !st.swOn; stopTimers();
      if (st.swOn) st.timers.push(setInterval(() => { st.sw++; const w = st.el.querySelector('.wt'); if (w) w.textContent = mmss(st.sw); }, 1000));
      repaint(); return;
    }
    if ((el = t.closest('[data-dur]'))) { st.dur = +el.dataset.dur; st.left = null; st.mOn = false; stopTimers(); repaint(); return; }
    if (t.closest('[data-mtoggle]')) {
      st.mOn = !st.mOn; stopTimers();
      if (st.left == null) st.left = st.dur * 60;
      if (st.mOn) st.timers.push(setInterval(() => {
        st.left = Math.max(0, st.left - 1);
        const C = 2 * Math.PI * 54, bar = st.el.querySelector('.mring .bar'), mt = st.el.querySelector('.mt');
        if (bar) bar.style.strokeDashoffset = (C * (st.left / (st.dur * 60))).toFixed(1);
        if (mt) mt.textContent = mmss(st.left);
        if (!st.left) { stopTimers(); st.mOn = false; L.haptic([20, 80, 20]); repaint(); }
      }, 1000));
      repaint(); return;
    }
    if ((el = t.closest('[data-word]'))) { st.word = st.word === el.dataset.word ? null : el.dataset.word; L.haptic(6); st.el.querySelectorAll('[data-word]').forEach(w => w.classList.toggle('on', w.dataset.word === st.word)); return; }
    if ((el = t.closest('[data-seed]'))) { const ta = st.el.querySelector('[data-diary]'); ta.value = (ta.value ? ta.value.trim() + ' ' : '') + el.dataset.seed; st.diary = ta.value; ta.focus(); return; }
    if ((el = t.closest('[data-to]'))) {
      const id = el.dataset.to; st.to = st.to.includes(id) ? st.to.filter(x => x !== id) : st.to.concat(id);
      el.classList.toggle('on'); L.haptic(6);
      const b = st.el.querySelector('[data-next]'); b.lastChild.textContent = 'Enviar a ' + st.to.length; b.disabled = !st.to.length; return;
    }
    if ((el = t.closest('[data-song]'))) { st.el.querySelectorAll('[data-song]').forEach(s => s.classList.toggle('on', s === el)); return; }
  }
  function onInput(e) { if (e.target.matches('[data-diary]')) st.diary = e.target.value; }

  window.Flujo = { start };
})();
