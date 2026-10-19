/* Lámpara v4 · Planes
   Mis planes (con invitaciones), Mi semana (rutina editable) y Explorar. Cada plan dice en qué consiste antes de unirte. */
(() => {
  const { esc, ic, actIc, av } = L;
  const ORDER_WEEK = L.WEEK;   /* lunes primero */
  const fmtDays = ds => !ds || ds.length === 7 ? 'Todos los días' : ds.join() === '1,2,3,4,5' ? 'Lunes a viernes' : ds.slice().sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)).map(d => L.DS[d]).join(' · ');
  const nameOf = id => id === 'JC' ? 'Tú' : id === 'BP' ? D.CHURCH.name : (L.person(id) || {}).first || (D.MEMBERS[id] || id).split(' ')[0];
  const fullOf = id => id === 'BP' ? 'Buen Pastor' : (L.person(id) || {}).name || D.MEMBERS[id] || id;
  const actRow = acts => '<span class="acts">' + acts.map(a => '<i data-a="' + a + '">' + ic(D.ICON[a]) + '</i>').join('') + '</span>';  /* círculos llenos chicos */
  const findAny = id => L.S.plans.find(p => p.id === id) || L.S.invites.find(p => p.id === id) || D.TEMPLATES.find(p => p.id === id);
  const kindOf = id => L.S.plans.some(p => p.id === id) ? 'mine' : L.S.invites.some(p => p.id === id) ? 'invite' : 'tpl';

  /* portada de arte plano con las formas de sus actividades (en lugar de ilustraciones como Hallow) */
  function cover(p) {
    const h = L.hueOf(p.id), a = p.acts, all = D.ACTS;
    const s2 = a[1] || all[h % all.length], s3 = all[(h >> 3) % all.length];
    const others = all.filter(x => x !== a[0]), c1 = others[h % others.length], c2 = others[(h + 3) % others.length];
    const tint = (svg, c) => svg.replace('<svg class="ico', '<svg style="color:var(--' + c + ')" class="ico');
    return '<div class="cover" data-a="' + a[0] + '">' + tint(ic(D.SHAPE[s2], 's1'), c1) + tint(ic(D.SHAPE[a[0]], 's2'), c2) + ic(D.SHAPE[s3], 's3') + '</div>';
  }
  function planCard(p) {
    const day = Math.min(p.len, Math.max(1, L.planDay(p, L.today()))), pct = Math.round((day - 1) / p.len * 100);
    const todayT = p.acts.map(a => D.SEQ[p.seq](a, day))[0];
    return '<button class="plan" data-plan="' + p.id + '" data-a="' + p.acts[0] + '">' + cover(p) + '<div class="plan-body"><div class="plan-top">' + actRow(p.acts) + '<span class="muted">Día ' + day + ' de ' + p.len + '</span></div>' +
      '<h3>' + esc(p.name) + (p.sub ? ' <small>' + esc(p.sub) + '</small>' : '') + '</h3><p class="muted">Hoy: ' + esc(todayT) + '</p>' +
      '<div class="pbar"><i style="width:' + pct + '%"></i></div>' +
      (p.people && p.people.length ? '<div class="ppl">' + p.people.map(id => av(id, fullOf(id), 26)).join('') + '<small>con ' + p.people.map(nameOf).join(', ') + '</small></div>' : '') + '</div></button>';
  }
  function inviteCard(p) {
    return '<div class="invite" data-a="' + p.acts[0] + '">' + cover(p) + '<div class="inv-body"><div class="inv-from">' + av(p.from, fullOf(p.from), 34) + '<span><b>' + esc(nameOf(p.from)) + '</b> te invita' + (p.group !== nameOf(p.from) ? ' · ' + esc(p.group) : '') + '</span></div>' +
      '<h3>' + esc(p.name) + '</h3><p class="muted">' + esc(p.desc) + '</p><div class="meta">' + actRow(p.acts) + '<span>' + p.len + ' días · ' + p.min + ' min · ' + fmtDays(p.days) + '</span></div>' +
      '<div class="row2"><button class="btn ghost" data-plan="' + p.id + '">En qué consiste</button><button class="btn c" data-join="' + p.id + '">Unirme</button></div></div></div>';
  }

  class PagePlanes extends L.Page {
    shell() {
      return L.shell({ title: 'Planes', end: '<ion-button data-new aria-label="Crear plan">' + ic('add-circle', 'tb-ic') + '</ion-button>',
        top: '<div class="segw"><ion-segment value="mios" data-seg><ion-segment-button value="mios"><ion-label>Mis planes</ion-label></ion-segment-button><ion-segment-button value="semana"><ion-label>Mi semana</ion-label></ion-segment-button><ion-segment-button value="explorar"><ion-label>Explorar</ion-label></ion-segment-button></ion-segment></div>' });
    }
    mount() {
      this.seg = 'mios';
      this.addEventListener('ionChange', e => { if (e.target.matches('[data-seg]')) { this.seg = e.detail.value; this.update(); } });
      L.on('planes:dia', dow => { this.seg = 'semana'; const s = this.querySelector('[data-seg]'); if (s) s.value = 'semana'; this.update(); this.push('page-dia', { dow }); });
    }
    render() {
      const S = L.S;
      if (this.seg === 'semana') {
        return '<p class="lead-note">Tu rutina se repite cada semana. Los planes suman lo suyo solos.</p><div class="drows">' + L.weekDates(L.today()).map(d => {
          const its = L.itemsFor(d), n = L.diffDays(d, L.today());
          return '<button class="drow' + (n === 0 ? ' now' : '') + '" data-dow="' + d.getDay() + '"><span class="dd"><b>' + L.DS[d.getDay()] + '</b><span>' + d.getDate() + '</span></span><span class="dits">' +
            its.map(it => '<i class="wi" data-a="' + it.a + '">' + ic(D.ICON[it.a]) + '</i>').join('') + '</span><span class="dn">' + its.length + ic('chevron-forward', 'chev') + '</span></button>';
        }).join('') + '</div>';
      }
      if (this.seg === 'explorar') {
        return '<div class="tpls">' + D.TEMPLATES.map(t => '<button class="tpl" data-plan="' + t.id + '" data-a="' + t.acts[0] + '">' + cover(t) + '<div class="tpl-b"><span class="tag">' + esc(t.tag) + '</span><b>' + esc(t.name) + '</b><small>' + t.len + ' días · ' + t.min + ' min</small></div></button>').join('') + '</div>' +
          '<button class="addrow" data-new>' + ic('add-circle-outline') + 'Crear tu propio plan</button>';
      }
      return (S.invites.length ? '<div class="sec"><h2>Te invitaron</h2><span class="muted">' + S.invites.length + '</span></div>' + S.invites.map(inviteCard).join('') : '') +
        '<div class="sec"><h2>En curso</h2><span class="muted">' + S.plans.length + '</span></div>' + (S.plans.length ? S.plans.map(planCard).join('') : '<div class="empty">' + ic('calendar-outline') + '<b>Sin planes</b>Explora uno o crea el tuyo.</div>') +
        '<button class="addrow" data-new>' + ic('add-circle-outline') + 'Crear un plan</button>';
    }
    onClick(e) {
      const t = e.target; let el;
      if ((el = t.closest('[data-join]'))) { join(el.dataset.join); return; }
      if ((el = t.closest('[data-plan]'))) { this.push('page-plan', { pid: el.dataset.plan }); return; }
      if ((el = t.closest('[data-dow]'))) { this.push('page-dia', { dow: +el.dataset.dow }); return; }
      if (t.closest('[data-new]')) { L.card('page-crear'); return; }
    }
  }
  L.define('page-planes', PagePlanes);

  function join(id, withIds) {
    const S = L.S, inv = S.invites.find(p => p.id === id), tpl = D.TEMPLATES.find(p => p.id === id);
    const src = inv || tpl; if (!src) return;
    const p = Object.assign(L.clone(src), { start: L.tk(), time: src.time || '07:00', people: inv ? inv.people.slice(0, 3) : (withIds || []) });
    delete p.from; delete p.count;
    S.plans.push(p);
    if (inv) S.invites = S.invites.filter(x => x.id !== id);
    L.save(); L.refresh();
    L.sheet('<div class="medal" data-a="' + p.acts[0] + '"><div class="coin">' + ic(D.ICON[p.acts[0]]) + '</div><p class="eyebrow">Plan nuevo</p><h2>' + esc(p.name) + '</h2><p class="muted">Empieza hoy. Ya está en tu día y en tu semana.</p><button class="btn c" data-c>Vamos</button></div>',
      { mount: (el, m) => { el.querySelector('[data-c]').onclick = () => m.dismiss(); setTimeout(() => L.sparks(el.querySelector('.coin'), 18), 300); } });
  }

  /* ---------- en qué consiste un plan ---------- */
  class PagePlan extends L.Page {
    shell() { this.p = findAny(this.pid); return L.shell({ title: this.p.name, back: '', large: false }); }
    render() {
      const p = findAny(this.pid) || this.p, kind = kindOf(this.pid);
      const day = kind === 'mine' ? Math.min(p.len, Math.max(1, L.planDay(p, L.today()))) : 0;
      const days = [];
      const from = kind === 'mine' ? Math.max(1, day - 1) : 1;
      for (let d = from; d < from + 5 && d <= p.len; d++) days.push(d);
      const head = '<div class="phead" data-a="' + p.acts[0] + '">' + cover(p) + '<div class="phead-b">' +
        (kind === 'invite' ? '<p class="eyebrow">' + esc(nameOf(p.from)) + ' te invita</p>' : kind === 'mine' ? '<p class="eyebrow">En curso · día ' + day + ' de ' + p.len + '</p>' : '<p class="eyebrow">' + esc(p.tag || 'Plan') + '</p>') +
        '<h1>' + esc(p.name) + '</h1>' + (p.sub ? '<p class="muted">' + esc(p.sub) + '</p>' : '') +
        '<div class="pmeta"><span>' + ic('calendar-outline') + p.len + ' días</span><span>' + ic('time-outline') + p.min + ' min</span><span>' + ic('repeat') + fmtDays(p.days) + '</span></div></div></div>';
      const what = '<div class="sec"><h2>En qué consiste</h2></div><p class="pdesc">' + esc(p.desc) + '</p><div class="box pad"><div class="mini-list">' + (p.what || []).map((w, i) => '<div class="mini" data-a="' + (p.acts[i] || p.acts[0]) + '"><div class="aic">' + actIc(p.acts[i] || p.acts[0], true) + '</div><div><b>' + esc(w) + '</b></div></div>').join('') + '</div></div>';
      const cada = '<div class="sec"><h2>' + (kind === 'mine' ? 'Estos días' : 'Los primeros días') + '</h2></div><div class="box pad"><div class="mini-list">' + days.map(d => {
        const st = kind === 'mine' ? (d < day ? 'done' : d === day ? 'now' : '') : '';
        return '<div class="mini dayrow ' + st + '"><span class="dnum">' + (st === 'done' ? ic('checkmark') : d) + '</span><div><b>' + esc(p.acts.map(a => D.SEQ[p.seq](a, d)).join(' · ')) + '</b><small>' + (st === 'now' ? 'Hoy' : 'Día ' + d) + '</small></div></div>';
      }).join('') + '</div></div>';
      const ppl = p.people && p.people.length ? '<div class="sec"><h2>Con quién</h2><span class="muted">' + (p.count ? p.count + ' personas' : p.people.length) + '</span></div><div class="ppl big">' + p.people.map(id => '<span>' + av(id, fullOf(id), 44) + '<small>' + esc(nameOf(id)) + '</small></span>').join('') + '</div>' : '';
      const acts = kind === 'invite' ? '<div class="row2 sticky-act"><button class="btn ghost" data-no>Ahora no</button><button class="btn c" data-yes>Unirme</button></div>'
        : kind === 'tpl' ? '<div class="sticky-act"><button class="btn c" data-yes>' + ic('play') + 'Empezar este plan</button><button class="link center-link" data-with>' + ic('people-outline') + ' Empezarlo con alguien</button></div>'
        : '<div class="sticky-act row2"><button class="btn ghost" data-invite>' + ic('person-add-outline') + 'Invitar</button><button class="btn ghost" data-leave>' + ic('exit-outline') + 'Dejar</button></div>';
      return head + what + cada + ppl + acts;
    }
    onClick(e) {
      const t = e.target;
      if (t.closest('[data-yes]')) { join(this.pid); this.pop(); return; }
      if (t.closest('[data-no]')) { L.S.invites = L.S.invites.filter(x => x.id !== this.pid); L.save(); L.refresh(); this.pop(); L.toast('Le avisamos con cariño'); return; }
      if (t.closest('[data-with]')) {
        L.actions('¿Con quién?', L.S.people.map(p => ({ text: p.first, handler: () => { join(this.pid, [p.id]); this.pop(); L.toast('Le mandamos la invitación a ' + p.first, { icon: 'paper-plane' }); } })));
        return;
      }
      if (t.closest('[data-invite]')) { L.actions('Invitar a', L.S.people.map(p => ({ text: p.first, handler: () => L.toast('Invitaste a ' + p.first, { icon: 'paper-plane' }) }))); return; }
      if (t.closest('[data-leave]')) {
        L.actions('¿Dejar «' + this.p.name + '»?', [{ text: 'Dejar el plan', role: 'destructive', handler: () => {
          const i = L.S.plans.findIndex(p => p.id === this.pid), [p] = L.S.plans.splice(i, 1); L.save(); L.refresh(); this.pop();
          L.toast('Dejaste el plan', { undo: () => { L.S.plans.splice(i, 0, p); L.save(); L.refresh(); } });
        } }], 'Tu avance queda guardado');
      }
    }
  }
  L.define('page-plan', PagePlan);

  /* ---------- un día de tu semana: rutina editable ---------- */
  class PageDia extends L.Page {
    shell() { return L.shell({ title: L.cap(L.DN[this.dow]), back: '' }); }
    render() {
      const S = L.S, rs = S.routine.filter(r => !r.once && r.days.includes(this.dow)).sort((a, b) => L.mins(a.h) - L.mins(b.h));
      const d = L.addDays(L.weekStart(L.today()), (this.dow + 6) % 7);
      const fromPlans = L.itemsFor(d).filter(i => i.src === 'p');
      return '<div class="sec"><h2>Tu rutina</h2><span class="muted">cada ' + L.DN[this.dow] + '</span></div>' +
        (rs.length ? '<ion-list inset="true" lines="inset">' + rs.map(r => '<ion-item-sliding><ion-item button detail="false" data-edit="' + r.id + '" data-a="' + r.a + '"><div class="aic" slot="start">' + actIc(r.a) + '</div><ion-label><h3>' + esc(r.t) + '</h3><p>' + esc(r.h + ' · ' + fmtDays(r.days)) + '</p></ion-label></ion-item>' +
          '<ion-item-options side="end"><ion-item-option class="o-del" data-rm="' + r.id + '">' + ic('trash') + '</ion-item-option></ion-item-options></ion-item-sliding>').join('') + '</ion-list>' : '<div class="empty">' + ic('sunny-outline') + '<b>Día libre</b>Agrega algo si quieres.</div>') +
        '<button class="addrow" data-addr>' + ic('add-circle-outline') + 'Agregar práctica</button>' +
        (fromPlans.length ? '<div class="sec"><h2>De tus planes</h2></div><div class="box pad"><div class="mini-list">' + fromPlans.map(i => '<div class="mini" data-a="' + i.a + '"><div class="aic">' + actIc(i.a) + '</div><div><b>' + esc(i.t) + '</b><small>' + esc(i.h + ' · ' + i.planName) + '</small></div></div>').join('') + '</div></div>' : '');
    }
    onClick(e) {
      const t = e.target; let el;
      if ((el = t.closest('[data-rm]'))) {
        const S = L.S, i = S.routine.findIndex(r => r.id === el.dataset.rm), r = S.routine[i];
        if (r.days.length > 1) { r.days = r.days.filter(x => x !== this.dow); L.toast('Lo sacaste de los ' + L.DN[this.dow], { undo: () => { r.days.push(this.dow); L.save(); L.refresh(); } }); }
        else { S.routine.splice(i, 1); L.toast('Práctica borrada', { undo: () => { S.routine.splice(i, 0, r); L.save(); L.refresh(); } }); }
        L.save(); L.refresh(); return;
      }
      if ((el = t.closest('[data-edit]'))) { editRoutine(L.S.routine.find(r => r.id === el.dataset.edit), this.dow); return; }
      if (t.closest('[data-addr]')) { editRoutine(null, this.dow); return; }
    }
  }
  L.define('page-dia', PageDia);

  /* agregar o cambiar una práctica de la rutina */
  function editRoutine(r, dow) {
    const isNew = !r;
    const v = r ? L.clone(r) : { id: 'r' + Date.now(), a: 'oracion', t: '', h: '07:00', days: [dow] };
    const html = '<h2 class="sh-title">' + (isNew ? 'Nueva práctica' : 'Cambiar práctica') + '</h2><p class="sh-sub">Se repite los días que elijas.</p>' +
      '<div class="tiles small">' + D.ACTS.map(a => '<button class="tile' + (a === v.a ? ' on' : '') + '" data-a="' + a + '" data-act="' + a + '"><span class="aic">' + actIc(a, true) + '</span>' + D.NAME[a] + '</button>').join('') + '</div>' +
      '<label class="fld"><span>Nombre</span><input data-t value="' + esc(v.t) + '" placeholder="' + D.NAME[v.a] + '"></label>' +
      '<label class="fld"><span>Hora</span><input data-h type="time" value="' + esc(/^\d{2}:\d{2}$/.test(v.h) ? v.h : '07:00') + '"></label>' +
      '<div class="fld"><span>Días</span><div class="daychips">' + ORDER_WEEK.map(d => '<button class="dchip' + (v.days.includes(d) ? ' on' : '') + '" data-d="' + d + '">' + L.DL[d] + '</button>').join('') + '</div></div>' +
      '<button class="btn" data-save>' + (isNew ? 'Agregar' : 'Guardar') + '</button>';
    L.sheet(html, {
      mount: (el, m) => el.addEventListener('click', e => {
        let b;
        if ((b = e.target.closest('[data-act]'))) { v.a = b.dataset.act; el.querySelectorAll('[data-act]').forEach(x => x.classList.toggle('on', x === b)); el.querySelector('[data-t]').placeholder = D.NAME[v.a]; return; }
        if ((b = e.target.closest('[data-d]'))) { const d = +b.dataset.d; v.days = v.days.includes(d) ? v.days.filter(x => x !== d) : v.days.concat(d); b.classList.toggle('on'); return; }
        if (e.target.closest('[data-save]')) {
          if (!v.days.length) { L.toast('Elige al menos un día'); return; }
          v.t = el.querySelector('[data-t]').value.trim() || D.NAME[v.a]; v.h = el.querySelector('[data-h]').value || '07:00';
          const S = L.S;
          if (isNew) S.routine.push(v); else Object.assign(S.routine.find(x => x.id === v.id), v);
          L.save(); L.refresh(); m.dismiss(); L.toast(isNew ? 'Agregado a tu semana' : 'Guardado', { icon: 'checkmark' });
        }
      })
    });
  }

  /* ---------- crear un plan propio ---------- */
  class PageCrear extends L.Page {
    shell() { return L.shell({ title: 'Nuevo plan', large: false, start: '<ion-button data-cancel>Cancelar</ion-button>' }); }
    mount() { this.v = { name: '', acts: ['palabra'], len: 21, days: [0, 1, 2, 3, 4, 5, 6], h: '07:00', people: [] }; this.addEventListener('input', e => { if (e.target.matches('[data-name]')) this.v.name = e.target.value; this.sum(); }); }
    render() {
      const v = this.v;
      return '<label class="fld big"><span>Nombre</span><input data-name value="' + esc(v.name) + '" placeholder="Ej: Hechos en 21 días"></label>' +
        '<div class="fld"><span>Qué incluye</span><div class="tiles small">' + D.ACTS.filter(a => a !== 'encuentro').map(a => '<button class="tile' + (v.acts.includes(a) ? ' on' : '') + '" data-a="' + a + '" data-act="' + a + '"><span class="aic">' + actIc(a, true) + '</span>' + D.NAME[a] + '</button>').join('') + '</div></div>' +
        '<div class="fld"><span>Cuántos días</span><div class="chips">' + [7, 21, 30, 40].map(n => '<button class="chip' + (v.len === n ? ' on' : '') + '" data-len="' + n + '">' + n + '</button>').join('') + '</div></div>' +
        '<div class="fld"><span>Qué días</span><div class="daychips">' + ORDER_WEEK.map(d => '<button class="dchip' + (v.days.includes(d) ? ' on' : '') + '" data-d="' + d + '">' + L.DL[d] + '</button>').join('') + '</div></div>' +
        '<label class="fld"><span>Hora</span><input type="time" data-h value="' + v.h + '"></label>' +
        '<div class="fld"><span>Con quién</span><div class="chips">' + L.S.people.map(p => '<button class="chip' + (v.people.includes(p.id) ? ' on' : '') + '" data-who="' + p.id + '">' + esc(p.first) + '</button>').join('') + '</div></div>' +
        '<p class="sum muted"></p><button class="btn" data-create>Crear plan</button>';
    }
    after() { this.sum(); }
    sum() {
      const v = this.v, s = this.querySelector('.sum'); if (!s) return;
      s.textContent = v.len + ' días · ' + fmtDays(v.days).toLowerCase() + ' · ' + v.acts.length + (v.acts.length === 1 ? ' práctica' : ' prácticas') + ' por día' + (v.people.length ? ' · con ' + v.people.map(nameOf).join(', ') : '');
      const b = this.querySelector('[data-create]'); if (b) b.disabled = !v.acts.length || !v.days.length;
    }
    onClick(e) {
      const t = e.target, v = this.v; let el;
      if (t.closest('[data-cancel]')) { this.closest('ion-modal').dismiss(); return; }
      if ((el = t.closest('[data-act]'))) { const a = el.dataset.act; v.acts = v.acts.includes(a) ? v.acts.filter(x => x !== a) : v.acts.concat(a); el.classList.toggle('on'); this.sum(); return; }
      if ((el = t.closest('[data-len]'))) { v.len = +el.dataset.len; this.querySelectorAll('[data-len]').forEach(x => x.classList.toggle('on', x === el)); this.sum(); return; }
      if ((el = t.closest('[data-d]'))) { const d = +el.dataset.d; v.days = v.days.includes(d) ? v.days.filter(x => x !== d) : v.days.concat(d); el.classList.toggle('on'); this.sum(); return; }
      if ((el = t.closest('[data-who]'))) { const id = el.dataset.who; v.people = v.people.includes(id) ? v.people.filter(x => x !== id) : v.people.concat(id); el.classList.toggle('on'); this.sum(); return; }
      if (t.closest('[data-create]')) {
        v.h = this.querySelector('[data-h]').value || '07:00';
        const name = v.name.trim() || 'Mi plan';
        L.S.plans.push({ id: 'pl' + Date.now(), name, acts: v.acts.slice(), len: v.len, days: v.days.length === 7 ? undefined : v.days.slice(), start: L.tk(), time: v.h, min: 5 + v.acts.length * 5, seq: 'propio', people: v.people.slice(),
          desc: 'Un plan tuyo de ' + v.len + ' días.', what: v.acts.map(a => D.NAME[a] + ' cada día') });
        L.save(); L.refresh();
        this.closest('ion-modal').dismiss();
        L.toast('«' + name + '» empieza hoy' + (v.people.length ? ' · invitaste a ' + v.people.map(nameOf).join(', ') : ''), { icon: 'sparkles' });
      }
    }
  }
  L.define('page-crear', PageCrear);
})();
