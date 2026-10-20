/* Lights · Llamar a alguien (21/10, pedido del user)
   Una práctica y un hábito propios, distinta de Encuentro: el encuentro es la reunión preparada; la llamada es corta,
   a cualquiera, para preguntarle cómo está. Tres pasos en una hoja:
   1. ¿A quién? Primero a quien hace más que no hablas (Apple: «Mantenerse en contacto» de Contactos; Dex y Clay, los CRM personales).
   2. Para la charla: tres preguntas y el botón de llamar.
   3. ¿Cómo te fue? Una palabra, una nota y, si pidió oración, queda como pedido.
   Cuenta para el hábito «Llamada» (Semilla, Raíz, Rama, Fruto) aunque no esté programada. */
(() => {
  const { esc, ic, av } = L;
  const ASK = ['¿Cómo estás, de verdad?', '¿Qué es lo más difícil de esta semana?', '¿Por qué puedo orar por ti?'];
  const HOW = [['bien', 'Está bien', 'happy'], ['cuesta', 'Le cuesta algo', 'leaf'], ['ora', 'Pidió oración', 'hands-praying']];

  function people() {
    const S = L.S, t = L.today();
    const base = S.people.map(p => ({ id: p.id, name: p.name, first: p.first, rel: 'Discípulo' }))
      .concat([{ id: D.LEADER.id, name: D.LEADER.name, first: D.LEADER.first, rel: 'Te acompaña' }, { id: 'AN', name: 'Ana', first: 'Ana', rel: 'Tu esposa' },
        { id: 'TO', name: 'Tomás', first: 'Tomás', rel: 'Amigo' }, { id: 'SO', name: 'Sofi', first: 'Sofi', rel: 'Iglesia' }, { id: 'PA', name: 'Papá', first: 'Papá', rel: 'Familia' }]);
    /* hace cuánto no hablan: lo anotado (llamada, encuentro, mensaje) o, si no hay nada, un número fijo del ejemplo */
    return base.map(p => {
      const last = S.log.filter(x => x.who === p.id && ['llamada', 'encuentro', 'mensaje'].includes(x.a)).map(x => L.diffDays(L.fromDk(x.d), t)).sort((a, b) => b - a)[0];
      const ago = last != null ? -last : { MA: 2, DV: 6, SR: 11, LO: 4, ER: 3, AN: 0, TO: 19, SO: 9, PA: 13 }[p.id] ?? 7;
      return Object.assign(p, { ago });
    }).sort((a, b) => b.ago - a.ago);
  }
  const agoTxt = n => n === 0 ? 'hoy' : n === 1 ? 'ayer' : 'hace ' + n + ' días';

  /* it: la práctica de hoy (si viene de la rutina); pid: si ya se sabe a quién */
  function llamar(it, pid) {
    let who = pid || null, how = null;
    const step1 = () => '<h2 class="sh-title">¿A quién llamas?</h2><p class="sh-sub">Primero, a quien hace más que no hablas.</p><div class="ll-list">' +
      people().map(p => '<button class="ll-p" data-p="' + p.id + '">' + av(p.id, p.name, 44) + '<div><b>' + esc(p.name) + '</b><small>' + esc(p.rel) + '</small></div><span class="ll-ago' + (p.ago >= 10 ? ' far' : '') + '">' + agoTxt(p.ago) + '</span></button>').join('') + '</div>';
    const step2 = p => '<div class="ll-who">' + av(p.id, p.name, 64) + '<div><p class="eyebrow">Llamar a</p><h2 class="sh-title">' + esc(p.name) + '</h2><small>Hablaron ' + agoTxt(p.ago) + '</small></div></div>' +
      '<p class="eyebrow">Para la charla</p><ol class="ll-ask">' + ASK.map(q => '<li>' + q + '</li>').join('') + '</ol>' +
      '<div class="ll-verse" data-a="llamada">«La congoja en el corazón del hombre lo abate; mas la buena palabra lo alegra.»<small>Proverbios 12:25</small></div>' +
      '<div class="row2"><button class="btn ghost" data-back>Otra persona</button><button class="btn" data-call data-a="llamada">' + ic('phone') + 'Llamar</button></div>';
    const step3 = p => '<div class="ll-who">' + av(p.id, p.name, 52) + '<div><p class="eyebrow">Hablaste con ' + esc(p.first) + '</p><h2 class="sh-title">¿Cómo te fue?</h2></div></div>' +
      '<div class="ll-how">' + HOW.map(h => '<button data-how="' + h[0] + '">' + ic(h[2]) + h[1] + '</button>').join('') + '</div>' +
      '<label class="fld"><input data-note placeholder="Algo para recordar (opcional)"></label>' +
      '<div class="ll-pet" hidden><label class="fld"><input data-pet placeholder="¿Por qué oras por ' + esc(p.first) + '?"></label></div>' +
      '<button class="btn" data-save data-a="llamada">' + ic('checkmark') + 'Guardar</button>';
    const p0 = who && people().find(p => p.id === who);
    L.sheet('<div class="ll" data-a="llamada">' + (p0 ? step2(p0) : step1()) + '</div>', {
      cls: 'll-sheet',
      mount: (el, m) => {
        const box = el.querySelector('.ll');
        const show = html => { box.innerHTML = html; box.animate([{ opacity: 0, transform: 'translateX(18px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' }); };
        const person = () => people().find(p => p.id === who);
        box.addEventListener('click', e => {
          let b;
          if ((b = e.target.closest('[data-p]'))) { who = b.dataset.p; L.haptic(6); show(step2(person())); return; }
          if (e.target.closest('[data-back]')) { who = null; show(step1()); return; }
          if (e.target.closest('[data-call]')) {
            const p = person(); L.haptic([10, 40, 10]);
            /* en la app real abre el teléfono (tel:); en el prototipo se simula y se pasa a «¿Cómo te fue?» */
            L.toast('Llamando a ' + p.first + '…', { icon: 'call' });
            b = e.target.closest('[data-call]'); b.classList.add('ll-ringing'); b.innerHTML = ic('phone') + 'Llamando…';
            setTimeout(() => { show(step3(p)); m.setCurrentBreakpoint && m.setCurrentBreakpoint(0.93); }, 1600); return;
          }
          if ((b = e.target.closest('[data-how]'))) {
            how = b.dataset.how; box.querySelectorAll('[data-how]').forEach(x => x.classList.toggle('on', x === b)); L.haptic(6);
            const pet = box.querySelector('.ll-pet'); pet.hidden = how !== 'ora'; if (how === 'ora') setTimeout(() => pet.querySelector('input').focus(), 50);
            return;
          }
          if (e.target.closest('[data-save]')) {
            const p = person(), S = L.S, note = box.querySelector('[data-note]').value.trim(), pt = (box.querySelector('[data-pet]') || {}).value;
            S.log.unshift({ who: p.id, a: 'llamada', d: L.tk(), note, how });
            if (how === 'ora' && pt && pt.trim()) S.pets.unshift({ id: S.nextPet++, who: S.people.some(x => x.id === p.id) || p.id === 'AN' ? p.id : 'yo', t: (S.people.some(x => x.id === p.id) || p.id === 'AN' ? '' : p.first + ': ') + pt.trim(), n: 0 });
            L.save(); m.dismiss();
            const todayCall = it || L.todayItems().find(i => i.a === 'llamada' && !L.isDone(i.id));
            if (todayCall && !L.isDone(todayCall.id)) L.setDone(todayCall.id, true); else { L.refresh(); L.checkAch && L.checkAch(); }
            L.toast('Llamaste a ' + p.first + (how === 'ora' && pt ? ' · pedido agregado' : ''), { icon: 'call' });
          }
        });
      }
    });
  }
  L.llamar = llamar;
})();
