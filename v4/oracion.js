/* Lámpara v4 · Oración
   Pedidos con gestos (deslizar = oré / respondida), «Orar ahora» como tarjetas que se pasan, y lo que Dios respondió. */
(() => {
  const { esc, ic, av } = L;
  const whoName = w => w === 'yo' ? 'Por ti' : w === 'AN' ? 'Ana' : (L.person(w) || {}).first || w;
  const whoFull = w => w === 'yo' ? 'Juan Carlos' : w === 'AN' ? 'Ana' : (L.person(w) || {}).name || w;
  const WHO = [['yo', 'Por mí'], ...D.PEOPLE.map(p => [p.id, p.first]), ['AN', 'Ana']];

  /* seguimiento: si hace dos semanas o más que oras por algo, te pregunta cómo sigue */
  const ago = k => -L.diffDays(L.fromDk(k), L.today());
  function dueFollow() {
    const S = L.S;
    return S.pets.filter(p => p.since && ago(p.since) >= 14 && (!p.check || ago(p.check) >= 14) && !S.asked2[p.id + '@' + L.tk()])
      .sort((a, b) => ago(b.since) - ago(a.since))[0] || null;
  }
  function followHTML(p, ctx) {
    const w = Math.round(ago(p.since) / 7), who = p.who === 'yo' ? '' : ' · ' + whoName(p.who);
    const attr = ctx ? 'data-ctx="seguimiento" ' : '';
    return '<div class="ctxc follow' + (ctx ? '' : ' soft') + '" data-a="oracion"><div class="ctxc-top">' + (p.who === 'yo' ? '<div class="aic">' + ic('person') + '</div>' : av(p.who, whoFull(p.who), 44)) +
      '<div><p class="eyebrow">Seguimiento' + esc(who) + '</p><b>¿Cómo sigue «' + esc(p.t) + '»?</b></div></div>' +
      '<p class="muted">Hace ' + (w === 1 ? 'una semana' : w + ' semanas') + ' que oras por esto · ' + p.n + ' veces' + (p.updates && p.updates.length ? ' · última novedad: ' + esc(p.updates[0].t) : '') + '</p>' +
      '<div class="fu-btns"><button class="btn ghost sm" ' + attr + 'data-fu="keep" data-pid="' + p.id + '">Sigo orando</button><button class="btn ghost sm" ' + attr + 'data-fu="change" data-pid="' + p.id + '">Hubo cambios</button>' +
      '<button class="btn c sm" ' + attr + 'data-fu="yes" data-pid="' + p.id + '">' + ic('star') + 'Dios respondió</button></div></div>';
  }
  function follow(act, id) {
    const S = L.S, p = S.pets.find(x => x.id === id); if (!p) return;
    if (act === 'yes') { answer(id); return; }
    if (act === 'keep') { p.check = L.tk(); L.save(); L.refresh(); L.toast('Seguimos orando. Te pregunto de nuevo en dos semanas', { icon: 'heart' }); return; }
    L.prompt('¿Qué cambió?', { ph: 'Ej: le dieron el alta', ok: 'Anotar' }, v => { p.updates.unshift({ d: L.tk(), t: v }); p.check = L.tk(); L.save(); L.refresh(); L.toast('Anotado en el pedido', { icon: 'create' }); });
  }

  function petRow(p) {
    const today = !!L.S.prayedToday[p.id];
    const lead = p.who === 'yo' ? '<div class="aic" slot="start" data-a="oracion">' + ic('person') + '</div>' : '<div slot="start" class="avs">' + av(p.who, whoFull(p.who), 40) + '</div>';
    return '<ion-item-sliding><ion-item button detail="false" data-pet="' + p.id + '" class="' + (today ? 'prayed' : '') + '">' + lead +
      '<ion-label><h3>' + esc(p.t) + '</h3><p>' + esc(whoName(p.who)) + ' · ' + p.n + (p.n === 1 ? ' vez' : ' veces') + '</p></ion-label>' +
      (today ? '<span class="tag" slot="end" data-a="oracion">' + ic('checkmark') + 'Hoy</span>' : '') + '</ion-item>' +
      '<ion-item-options side="start"><ion-item-option class="o-flame" expandable data-pray="' + p.id + '">' + ic('heart') + 'Oré</ion-item-option></ion-item-options>' +
      '<ion-item-options side="end"><ion-item-option class="o-done" data-answer="' + p.id + '">' + ic('star') + 'Respondida</ion-item-option><ion-item-option class="o-del" data-del="' + p.id + '">' + ic('trash') + '</ion-item-option></ion-item-options></ion-item-sliding>';
  }

  class PageOracion extends L.Page {
    shell() {
      return L.shell({ title: 'Oración', end: '<ion-button data-add aria-label="Nuevo pedido">' + ic('add-circle', 'tb-ic') + '</ion-button>',
        top: '<div class="segw"><ion-segment value="pedidos" data-seg><ion-segment-button value="pedidos"><ion-label>Pedidos</ion-label></ion-segment-button><ion-segment-button value="respondidas"><ion-label>Respondidas</ion-label></ion-segment-button></ion-segment></div>' });
    }
    mount() {
      this.seg = 'pedidos';
      this.addEventListener('ionChange', e => { if (e.target.matches('[data-seg]')) { this.seg = e.detail.value; this.update(); } });
      this.addEventListener('ionSwipe', e => { const o = e.target.querySelector('[data-pray]') || e.target.closest('[data-pray]'); if (o) pray(+o.dataset.pray); });
    }
    render() {
      const S = L.S;
      if (this.seg === 'respondidas') {
        if (!S.answered.length) return '<div class="empty">' + ic('star-outline') + '<b>Todavía nada</b>Cuando Dios responda un pedido, desliza y marca «Respondida».</div>';
        return '<p class="lead-note">Piedras de memoria: lo que Dios hizo.</p><div class="answered">' + S.answered.map(a => '<div class="ans" data-a="oracion"><div class="coin-s">' + ic('star') + '</div><div><b>' + esc(a.t) + '</b><small>' + esc(whoName(a.who)) + ' · ' + L.rel(L.diffDays(L.fromDk(a.d), L.today())) + '</small></div></div>').join('') + '</div>';
      }
      const mine = S.pets.filter(p => p.who === 'yo'), others = S.pets.filter(p => p.who !== 'yo');
      const left = S.pets.filter(p => !S.prayedToday[p.id]).length;
      const fu = dueFollow();
      const hero = (fu ? followHTML(fu) : '') + '<div class="pray-hero" data-a="oracion"><div class="ph-ic">' + ic('hands-praying') + '</div><div><h2>' + (left ? 'Orar ahora' : 'Oraste por todos') + '</h2><p>' + (left ? left + ' pedidos · unos ' + Math.max(1, Math.round(left * 0.5)) + ' min' : 'Hoy no quedó nadie afuera') + '</p></div>' +
        (left ? '<button class="btn c" data-now>' + ic('play') + 'Empezar</button>' : '') + '</div>';
      const list = (title, arr) => arr.length ? '<div class="sec"><h2>' + title + '</h2><span class="muted">' + arr.length + '</span></div><ion-list inset="true" lines="inset">' + arr.map(petRow).join('') + '</ion-list>' : '';
      return hero + list('Por otros', others) + list('Por ti', mine) + '<p class="hint-swipe">' + ic('swap-horizontal') + 'Desliza un pedido para marcarlo</p>';
    }
    onClick(e) {
      const t = e.target; let el;
      if ((el = t.closest('[data-fu]'))) { follow(el.dataset.fu, +el.dataset.pid); return; }
      if ((el = t.closest('[data-pray]'))) { pray(+el.dataset.pray); return; }
      if ((el = t.closest('[data-answer]'))) { answer(+el.dataset.answer); return; }
      if ((el = t.closest('[data-del]'))) { del(+el.dataset.del); return; }
      if ((el = t.closest('[data-pet]'))) { openPet(+el.dataset.pet); return; }
      if (t.closest('[data-now]')) { prayNow(); return; }
      if (t.closest('[data-add]')) { addPet(); return; }
    }
  }
  L.define('page-oracion', PageOracion);

  function pray(id, quiet) {
    const p = L.S.pets.find(x => x.id === id); if (!p) return;
    if (L.S.prayedToday[id]) { if (!quiet) L.toast('Ya oraste por esto hoy'); return; }
    p.n++; L.S.prayedToday[id] = 1;
    if (p.who !== 'yo') L.S.stats.prayOthers++;
    L.save(); L.haptic(10); L.refresh();
    if (!quiet) L.toast('Oraste · ' + p.n + ' veces', { icon: 'heart' });
    L.checkAch();
  }
  function answer(id) {
    const p = L.S.pets.find(x => x.id === id); if (!p) return;
    L.S.pets = L.S.pets.filter(x => x.id !== id);
    L.S.answered.unshift({ who: p.who, t: p.t, d: L.tk() });
    L.save(); L.refresh();
    const other = p.who !== 'yo' && p.who !== 'AN' ? whoName(p.who) : p.who === 'AN' ? 'Ana' : null;
    L.sheet('<div class="medal" data-a="oracion"><div class="coin">' + ic('star') + '</div><p class="eyebrow">Dios respondió</p><h2>' + esc(p.t) + '</h2><p class="muted">Oraste ' + p.n + ' veces. Queda guardado en «Respondidas».</p>' +
      '<button class="btn c" data-close>¡Gloria a Dios!</button><p class="eyebrow tell">Cuéntalo</p><div class="row2">' +
      (other ? '<button class="btn ghost sm" data-tell="who">' + ic('chatbubble') + 'A ' + esc(other) + '</button>' : '<button class="btn ghost sm" data-tell="lider">' + ic('chatbubble') + 'A ' + esc(D.LEADER.first) + '</button>') +
      '<button class="btn ghost sm" data-tell="iglesia">' + ic('sparkles') + 'En Testimonios</button></div></div>',
      { mount: (el, m) => {
        el.addEventListener('click', e => {
          if (e.target.closest('[data-close]')) { m.dismiss(); return; }
          const b = e.target.closest('[data-tell]'); if (!b || b.disabled) return;
          b.disabled = true; L.haptic(8);
          if (b.dataset.tell === 'iglesia') {
            L.S.posts.push({ id: Date.now(), ch: 'testimonios', by: 'JC', w: 0, t: '¡Dios respondió! ' + p.t + '. Gracias a todos los que oraron.', rx: { gloria: 0, amen: 0 } });
            L.save(); L.toast('Publicado en Testimonios', { icon: 'sparkles' });
          } else L.toast('Se lo contaste a ' + (other || D.LEADER.first), { icon: 'chatbubble' });
        });
        setTimeout(() => L.sparks(el.querySelector('.coin'), 22), 300);
      } });
    L.haptic([10, 50, 20]);
    L.checkAch();
  }
  function del(id) {
    const i = L.S.pets.findIndex(x => x.id === id); if (i < 0) return;
    const [p] = L.S.pets.splice(i, 1); L.save(); L.refresh();
    L.toast('Pedido borrado', { undo: () => { L.S.pets.splice(i, 0, p); L.save(); L.refresh(); } });
  }
  function openPet(id) {
    const p = L.S.pets.find(x => x.id === id); if (!p) return;
    const today = !!L.S.prayedToday[id];
    L.sheet('<div data-a="oracion"><div class="sh-head">' + (p.who === 'yo' ? '<div class="aic">' + ic('person') + '</div>' : av(p.who, whoFull(p.who), 52)) + '<div><h2>' + esc(p.t) + '</h2><p>' + esc(whoName(p.who)) + ' · ' + p.n + ' veces</p></div></div>' +
      '<div class="row2"><button class="btn ghost" data-a2="answer">' + ic('star') + 'Respondida</button><button class="btn c" data-a2="pray"' + (today ? ' disabled' : '') + '>' + ic('heart') + (today ? 'Ya oraste hoy' : 'Oré') + '</button></div>' +
      (p.who !== 'yo' ? '<button class="link center-link" data-a2="share">' + ic('people-outline') + ' Pedir oración en la iglesia</button>' : '') + '</div>', {
      mount: (el, m) => el.addEventListener('click', e => {
        const b = e.target.closest('[data-a2]'); if (!b) return;
        m.dismiss();
        if (b.dataset.a2 === 'pray') pray(id);
        if (b.dataset.a2 === 'answer') m.onDidDismiss().then(() => answer(id));
        if (b.dataset.a2 === 'share') L.toast('Publicado en el canal Oración, sin datos personales', { icon: 'people' });
      })
    });
  }
  function addPet() {
    let who = 'yo';
    L.sheet('<h2 class="sh-title">Nuevo pedido</h2><p class="sh-sub">¿Por qué quieres orar?</p><textarea class="fl-text" rows="3" data-txt placeholder="Ej: la entrevista de mañana"></textarea>' +
      '<div class="chips who">' + WHO.map(w => '<button class="chip' + (w[0] === who ? ' on' : '') + '" data-who="' + w[0] + '">' + esc(w[1]) + '</button>').join('') + '</div><button class="btn" data-ok>Agregar</button>', {
      mount: (el, m) => {
        el.addEventListener('click', e => {
          const c = e.target.closest('[data-who]');
          if (c) { who = c.dataset.who; el.querySelectorAll('[data-who]').forEach(x => x.classList.toggle('on', x === c)); return; }
          if (e.target.closest('[data-ok]')) {
            const t = el.querySelector('[data-txt]').value.trim(); if (!t) { el.querySelector('[data-txt]').focus(); return; }
            L.S.pets.unshift({ id: L.S.nextPet++, who, t, n: 0 }); L.save(); L.refresh(); m.dismiss();
            L.toast('Pedido agregado', { icon: 'heart' });
          }
        });
        setTimeout(() => el.querySelector('[data-txt]').focus(), 450);
      }
    });
  }

  /* ---------- orar ahora: una tarjeta por pedido; a la derecha «Oré», a la izquierda «después» ---------- */
  function prayNow() {
    const q = L.S.pets.filter(p => !L.S.prayedToday[p.id]);
    if (!q.length) return;
    let i = 0, prayed = 0;
    L.full((el, m) => {
      el.innerHTML = '<div class="fl-top"><div class="fl-bars">' + q.map(() => '<i><b></b></i>').join('') + '</div><button class="iconbtn" data-x>' + ic('close') + '</button></div>' +
        '<div class="deck" data-a="oracion"></div><div class="deck-act" data-a="oracion"><button class="round ghost" data-later aria-label="Después">' + ic('arrow-undo') + '</button><button class="round c" data-yes aria-label="Oré">' + ic('heart') + '</button></div><p class="deck-hint">Desliza a la derecha cuando ores</p>';
      const deck = el.querySelector('.deck');
      const bars = () => el.querySelectorAll('.fl-bars i').forEach((b, k) => { b.className = k < i ? 'done' : k === i ? 'now' : ''; });
      function cardHTML(p) {
        return '<div class="pc" style="--pcc:' + (p.who === 'yo' ? 'var(--oracion)' : L.avColor(p.who)) + '"><span class="pc-art">' + ic('sh-oracion') + '</span><div class="pc-who">' + (p.who === 'yo' ? '<div class="aic">' + ic('person') + '</div>' : av(p.who, whoFull(p.who), 64)) + '<span>' + esc(p.who === 'yo' ? 'Por ti' : 'Por ' + whoName(p.who)) + '</span></div>' +
          '<h2>' + esc(p.t) + '</h2><p class="muted">' + p.n + ' veces orado</p><div class="pc-stamp yes">Oré</div><div class="pc-stamp no">Después</div></div>';
      }
      function show() {
        bars();
        if (i >= q.length) { done(); return; }
        deck.innerHTML = cardHTML(q[i]) + (q[i + 1] ? '<div class="pc back">' + '</div>' : '');
        const c = deck.querySelector('.pc');
        if (!L.RM()) c.animate([{ transform: 'scale(.92) translateY(12px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' });
        drag(c);
      }
      function go(yes) {
        const c = deck.querySelector('.pc:not(.back)');
        if (yes) { pray(q[i].id, true); prayed++; L.sparks(el.querySelector('[data-yes]'), 10); }
        const out = c.animate([{ transform: c.style.transform || 'none' }, { transform: 'translateX(' + (yes ? 520 : -520) + 'px) rotate(' + (yes ? 18 : -18) + 'deg)', opacity: 0 }], { duration: 300, easing: 'ease-in' });
        out.onfinish = () => { i++; show(); };
      }
      function drag(c) {
        let x0 = null, dx = 0;
        c.addEventListener('pointerdown', e => { x0 = e.clientX; dx = 0; c.setPointerCapture(e.pointerId); c.style.transition = 'none'; });
        c.addEventListener('pointermove', e => {
          if (x0 == null) return;
          dx = e.clientX - x0;
          c.style.transform = 'translateX(' + dx + 'px) rotate(' + dx / 22 + 'deg)';
          c.querySelector('.yes').style.opacity = Math.max(0, Math.min(1, dx / 90));
          c.querySelector('.no').style.opacity = Math.max(0, Math.min(1, -dx / 90));
        });
        const end = () => {
          if (x0 == null) return; x0 = null;
          if (Math.abs(dx) > 90) { go(dx > 0); return; }
          c.style.transition = 'transform .35s cubic-bezier(.34,1.56,.64,1)'; c.style.transform = '';
          c.querySelectorAll('.pc-stamp').forEach(s => { s.style.opacity = 0; });
        };
        c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
      }
      function done() {
        el.querySelector('.deck-act').remove(); el.querySelector('.deck-hint').remove();
        deck.innerHTML = '<div class="fl-end"><div class="coin" data-a="oracion">' + ic('heart') + '</div><h1>' + (prayed ? 'Oraste por ' + prayed : 'Listo') + '</h1><p class="fl-sub">' + (prayed ? 'Cada pedido suma a su cuenta.' : 'Quedan para más tarde.') + '</p><button class="btn c" data-x style="margin-top:28px">Amén</button></div>';
        L.haptic([10, 40, 16]);
        const it = L.todayItems().find(x => x.a === 'oracion' && !L.isDone(x.id));
        if (prayed && it) L.setDone(it.id, true, { quiet: true });
      }
      el.addEventListener('click', e => {
        if (e.target.closest('[data-x]')) { m.dismiss(); return; }
        if (e.target.closest('[data-yes]')) { go(true); return; }
        if (e.target.closest('[data-later]')) { go(false); return; }
      });
      show();
    }, { cls: 'flow', onClose: () => { if (L.allDone()) setTimeout(L.celebrate, 200); } });
  }

  /* en Hoy, si hay un pedido para revisar */
  L.ctxCard({ id: 'seguimiento', pri: () => dueFollow() ? 2 : 0, html: () => followHTML(dueFollow(), true),
    click: el => { L.S.asked2[el.dataset.pid + '@' + L.tk()] = 1; follow(el.dataset.fu, +el.dataset.pid); } });

  window.Oracion = { pray, prayNow, addPet, dueFollow };
})();
