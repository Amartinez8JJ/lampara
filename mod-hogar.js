/* Lámpara · mod-hogar.js — Hogar: familia y pareja (dueño: agente Hogar).
 *
 * Se muestra en Personas → Hogar (render) y con una tarjeta en Hoy (hoyCard).
 * - La lámpara de casa: se enciende con lo que hacen JUNTOS. Lo de cada uno
 *   solo suma si esa persona lo elige, y nunca se ve el contenido.
 * - Devocional en la mesa (pantalla completa, 10 min, turnos con nombres).
 * - Noche de familia semanal (se suma a la rutina del núcleo sin duplicar).
 * - Ana y tú: orar juntos guiado, gratitud mutua, mazo de preguntas,
 *   peticiones de los dos y memorial.
 * - Los chicos: álbum de figuritas propio y versículo de la semana con juego.
 * Estado: Lampara.mstate('hogar'). Acciones: data-h-act (+ data-h-id).
 */
(function (L) {
  'use strict';
  if (!L || !L.register) return;

  const ic = L.ic, esc = L.esc;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const GOAL = 4;                         /* días juntos por semana: «casa encendida» */
  const NOCHE_ID = 'hg-noche';            /* id del ítem de rutina que agrega Hogar */
  const FLAME = 'M6 15.5C2.6 15.5 1 13 1.5 10.4 2.1 7.6 4.6 6.2 5.4 1 7.6 4.3 10.7 6.8 10.6 10.6 10.5 13.4 8.7 15.5 6 15.5Z';

  /* ================================================================
     La familia
     ================================================================ */
  const FAM = {
    JC: { name: 'Juan Carlos', mesa: 'Papá' },
    AN: { name: 'Ana', mesa: 'Mamá' },
    TO: { name: 'Tomás', mesa: 'Tomás', age: 12 },
    SO: { name: 'Sofi', mesa: 'Sofi', age: 7 }
  };
  const FAM_IDS = ['JC', 'AN', 'TO', 'SO'];
  const KIDS = ['TO', 'SO'];
  const isKid = id => KIDS.indexOf(id) >= 0;
  const BODA = { y: 2012, m: 4, d: 12 };

  /* figuritas del álbum (una historia, un color de actividad) */
  const FIG = {
    arca: { t: 'El arca', r: 'Génesis 6', a: 'encuentro', d: '<path d="M3 15h18l-2.5 5h-13z"/><path d="M7 15v-4h10v4"/><path d="M6 11l6-4 6 4"/>' },
    arcoiris: { t: 'El arcoíris', r: 'Génesis 9', a: 'mensaje', d: '<path d="M3 18a9 9 0 0 1 18 0"/><path d="M6.5 18a5.5 5.5 0 0 1 11 0"/><path d="M10 18a2 2 0 0 1 4 0"/>' },
    corona: { t: 'David', r: '1 Samuel 17', a: 'ayuno', d: '<path d="M4 19h16"/><path d="M5 16 4 7l4.5 3.5L12 5l3.5 5.5L20 7l-1 9z"/>' },
    leones: { t: 'Daniel', r: 'Daniel 6', a: 'oracion', d: '<circle cx="12" cy="13" r="4.5"/><path d="M12 3.5v2M5.3 6.3l1.4 1.4M18.7 6.3l-1.4 1.4M3.5 13h2M18.5 13h2M6 19l1.5-1.5M18 19l-1.5-1.5"/><path d="M10.5 14.6h3"/>' },
    tormenta: { t: 'La tormenta', r: 'Marcos 4', a: 'palabra', d: '<path d="M2 19c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0"/><path d="M5 14h14l-2 3H7z"/><path d="M12 14V4l5 6.5h-5"/>' },
    panes: { t: 'Panes y peces', r: 'Juan 6', a: 'diario', d: '<path d="M3 12c3.5-4.5 9.5-5 13 0-3.5 5-9.5 4.5-13 0z"/><path d="M16 12l5-3.5v7z"/><circle cx="7.5" cy="11.2" r=".6"/>' },
    oveja: { t: 'La oveja perdida', r: 'Lucas 15', a: 'adoracion', d: '<path d="M8 16.5a3 3 0 0 1-.6-5.9 3.6 3.6 0 0 1 6.6-1.7 3.2 3.2 0 0 1 4.6 3.2 2.7 2.7 0 0 1-1.1 4.4z"/><path d="M10 16.5v3M15 16.5v3"/><circle cx="5.5" cy="11.5" r="2"/>' },
    pastor: { t: 'El buen pastor', r: 'Salmo 23', a: 'meditar', d: '<path d="M14.5 21.5V7.5a4.5 4.5 0 0 0-9 0v1.5"/><path d="M5.5 9a1 1 0 0 0 1.6.8"/>' }
  };
  const FIG_IDS = ['arca', 'arcoiris', 'corona', 'leones', 'tormenta', 'panes', 'oveja', 'pastor'];
  const fig = (id, cls) => '<svg class="' + (cls || 'i') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + FIG[id].d + '</svg>';

  /* devocionales en la mesa: pasaje corto (RV1960), pregunta para chicos y para grandes */
  const MESAS = [
    { t: 'La tormenta se calma', r: 'Marcos 4:37–39', fig: 'tormenta', vs: [
      ['37', 'Pero se levantó una gran tempestad de viento, y echaba las olas en la barca, de tal manera que ya se anegaba.'],
      ['38', 'Y él estaba en la popa, durmiendo sobre un cabezal; y le despertaron, y le dijeron: Maestro, ¿no tienes cuidado que perecemos?'],
      ['39', 'Y levantándose, reprendió al viento, y dijo al mar: Calla, enmudece. Y cesó el viento, y se hizo grande bonanza.']],
      kids: '¿Qué cosas te dan miedo? ¿Qué hizo Jesús con la tormenta?',
      big: '¿Qué tormenta tenemos hoy como familia? ¿Cómo se ve confiar en que Él va en la barca?' },
    { t: 'Cinco panes y dos peces', r: 'Juan 6:9, 11', fig: 'panes', vs: [
      ['9', 'Aquí está un muchacho, que tiene cinco panes de cebada y dos pececillos; mas ¿qué es esto para tantos?'],
      ['11', 'Y tomó Jesús aquellos panes, y habiendo dado gracias, los repartió entre los discípulos, y los discípulos entre los que estaban recostados; asimismo de los peces, cuanto querían.']],
      kids: 'El muchacho compartió lo que tenía. ¿Qué podrías compartir tú esta semana?',
      big: '¿Qué tenemos «poco» que podríamos poner en las manos de Jesús?' },
    { t: 'La oveja que se perdió', r: 'Lucas 15:4–6', fig: 'oveja', vs: [
      ['4', '¿Qué hombre de vosotros, teniendo cien ovejas, si pierde una de ellas, no deja las noventa y nueve en el desierto, y va tras la que se perdió, hasta encontrarla?'],
      ['5', 'Y cuando la encuentra, la pone sobre sus hombros gozoso;'],
      ['6', 'y al llegar a casa, reúne a sus amigos y vecinos, diciéndoles: Gozaos conmigo, porque he encontrado mi oveja que se había perdido.']],
      kids: '¿Cómo se habrá sentido la oveja cuando el pastor la encontró?',
      big: '¿A quién conocemos que necesita que lo busquen con ese amor?' },
    { t: 'Daniel oraba siempre', r: 'Daniel 6:10, 22', fig: 'leones', vs: [
      ['10', 'Cuando Daniel supo que el edicto había sido firmado, entró en su casa, y abiertas las ventanas de su cámara que daban hacia Jerusalén, se arrodillaba tres veces al día, y oraba y daba gracias delante de su Dios, como lo solía hacer antes.'],
      ['22', 'Mi Dios envió su ángel, el cual cerró la boca de los leones, para que no me hiciesen daño.']],
      kids: 'Daniel oraba aunque tenía miedo. ¿Cuándo te gusta orar a ti?',
      big: '¿Qué costumbre de fe queremos que los chicos nos vean sostener?' },
    { t: 'Una promesa en el cielo', r: 'Génesis 9:13, 15', fig: 'arcoiris', vs: [
      ['13', 'Mi arco he puesto en las nubes, el cual será por señal del pacto entre mí y la tierra.'],
      ['15', 'Y me acordaré del pacto mío, que hay entre mí y vosotros y todo ser viviente de toda carne.']],
      kids: '¿Qué promesa de Dios te gusta más?',
      big: '¿Qué promesas de Dios vimos cumplirse en esta casa?' }
  ];
  /* quién ora en la mesa: empieza el más chico; el último cierra */
  const PRAY_BASE = ['SO', 'TO', 'AN', 'JC'];
  const PRAY = { SO: 'Da gracias por algo lindo de hoy.', TO: 'Pide por un amigo o por tu escuela.', AN: 'Ora por lo que hablamos en la mesa.', JC: 'Pide por la semana de la familia.' };
  const PRAY_LAST = 'Cierra bendiciendo a cada uno por su nombre.';

  /* versículo de la semana: tres palabras escondidas */
  const VERSOS = [
    { t: 'Jehová es mi pastor; nada me faltará.', r: 'Salmo 23:1', fig: 'pastor', rounds: [
      { pre: 'Jehová es mi ', ans: 'pastor', post: '; nada me faltará.', opts: ['rey', 'pastor', 'escudo'] },
      { pre: 'Jehová es mi pastor; nada me ', ans: 'faltará', post: '.', opts: ['faltará', 'pasará', 'asustará'] },
      { pre: '', ans: 'Jehová', post: ' es mi pastor; nada me faltará.', opts: ['Moisés', 'David', 'Jehová'] }] },
    { t: 'En el día que temo, yo en ti confío.', r: 'Salmo 56:3', fig: 'arca', rounds: [
      { pre: 'En el día que ', ans: 'temo', post: ', yo en ti confío.', opts: ['juego', 'temo', 'duermo'] },
      { pre: 'En el día que temo, yo en ti ', ans: 'confío', post: '.', opts: ['confío', 'pienso', 'corro'] },
      { pre: 'En el ', ans: 'día', post: ' que temo, yo en ti confío.', opts: ['río', 'mar', 'día'] }] }
  ];

  /* pareja */
  const CAT = { nos: { t: 'Nosotros', a: 'adoracion' }, fe: { t: 'Fe', a: 'palabra' }, sue: { t: 'Sueños', a: 'meditar' }, fam: { t: 'Familia', a: 'encuentro' } };
  const QS = [
    { c: 'nos', t: '¿Qué recuerdo nuestro te hace sonreír?' },
    { c: 'fe', t: '¿Qué está haciendo Dios en ti en este tiempo?' },
    { c: 'fam', t: '¿Qué ves de Dios en Tomás y en Sofi?' },
    { c: 'sue', t: 'Si pudiéramos servir juntos en algo, ¿qué sería?' },
    { c: 'nos', t: '¿Cuándo te sentiste más amado o amada por mí este mes?' },
    { c: 'fe', t: '¿Qué versículo te sostuvo últimamente?' },
    { c: 'fam', t: '¿Qué tradición queremos que los chicos recuerden?' },
    { c: 'sue', t: '¿Dónde te imaginas que estaremos en diez años?' },
    { c: 'nos', t: '¿Qué podría hacer esta semana para alivianarte?' },
    { c: 'fe', t: '¿Cómo podemos orar mejor juntos?' },
    { c: 'fam', t: '¿Qué necesita nuestra casa en esta etapa?' },
    { c: 'sue', t: '¿Qué sueño tuyo todavía no te animaste a contarme?' }
  ];
  const SUGS = ['tu paciencia', 'cómo cuidas a los chicos', 'que oraste por mí', 'tu risa'];
  const ANA_GRAT = ['que me hiciste reír cuando estaba cansada.', 'que oraste por mí antes de mi reunión.', 'cómo abrazas a Sofi cuando tiene miedo de noche.', 'que me escuchaste sin mirar el celular.'];
  const ANA_REPLY = ['«¡Gracias, amor! Me alegraste el día.»', '«Me hizo bien leer eso. Te amo.»', '«Gracias por verlo. Hoy oro por ti.»'];
  const NOCHE_IDEAS = ['Hacer chipa juntos y dar gracias', 'Juegos de mesa y una oración corta', 'Tereré en el patio: lo mejor de la semana', 'Película y una pregunta al final'];

  /* qué enciende la lámpara de casa. solo = aporte personal elegido (chispa, no día) */
  const LUZ = {
    mesa: { a: 'encuentro', icon: 'encuentro', t: 'Devocional en la mesa' },
    noche: { a: 'encuentro', icon: 'encuentro', t: 'Noche de familia' },
    culto: { a: 'adoracion', icon: 'adoracion', t: 'Culto en familia' },
    pareja: { a: 'oracion', icon: 'oracion', t: 'Ana y tú oraron juntos' },
    grat: { a: 'adoracion', icon: 'star', t: 'Gratitud en pareja' },
    charla: { a: 'mensaje', icon: 'mensaje', t: 'Una charla de a dos' },
    verso: { a: 'meditar', icon: 'meditar', t: 'Versículo en familia' },
    ana: { a: 'oracion', icon: 'oracion', t: 'Ana sumó su oración', solo: true },
    'yo-oracion': { a: 'oracion', icon: 'oracion', t: 'Sumaste tu oración', solo: true },
    'yo-palabra': { a: 'palabra', icon: 'palabra', t: 'Sumaste tu lectura', solo: true }
  };
  const SHARE = [{ k: 'oracion', t: 'Tu oración del día', d: 'Se ve «oró», nada más' }, { k: 'palabra', t: 'Tu lectura del día', d: 'Se ve «leyó», nada más' }];
  const MK = { resp: { a: 'oracion', icon: 'star', lbl: 'Dios respondió' }, hito: { a: 'diario', icon: 'diario' }, boda: { a: 'adoracion', icon: 'oracion' } };

  /* logros del hogar */
  const ACH = [
    { id: 'mesa1', a: 'encuentro', icon: 'encuentro', t: 'Primera mesa', d: 'Su primer devocional en familia', h: 'Hagan el devocional en la mesa', prog: s => [s.mesas, 1] },
    { id: 'siete', a: 'oracion', icon: 'oracion', t: 'Siete juntos', d: 'Una semana orando en pareja', h: 'Oren juntos con el plan', prog: s => [s.plan.done, 7] },
    { id: 'casa', a: null, icon: 'flame', t: 'Casa encendida', d: 'Cuatro días juntos en una semana', h: 'Un momento juntos, cuatro días', prog: s => [litDays(s), GOAL] },
    { id: 'corazon', a: 'meditar', icon: 'meditar', t: 'De corazón', d: 'Tomás y Sofi jugaron el versículo', h: 'Que cada uno juegue el versículo', prog: s => [KIDS.filter(k => s.kids[k].played).length, 2] },
    { id: 'gracias', a: 'adoracion', icon: 'star', t: 'Diez gracias', d: 'Gratitudes que le llegaron a Ana', h: 'Agradece algo de Ana', prog: s => [s.grat.sent, 10] }
  ];

  /* ================================================================
     Estado (dentro de state.mods.hogar: entra en deshacer y reiniciar)
     ================================================================ */
  function init() {
    const k = n => L.key(L.addDays(L.date, n));
    return {
      luces: [{ d: k(-4), k: 'culto' }, { d: k(-3), k: 'ana' }, { d: k(-2), k: 'pareja' }, { d: k(-2), k: 'grat' }, { d: k(-1), k: 'ana' }],
      share: { oracion: false, palabra: false },
      mesas: 0, mesaIdx: 0,
      noche: { dow: 5, h: '19:30' },
      plan: { len: 30, done: 6, last: null },
      grat: { sent: 4, lastSent: null, pool: 0,
        unread: { t: 'cómo te sentaste con Tomás a hacer la tarea, sin apuro.' },
        log: [{ from: 'JC', t: 'tu paciencia con Sofi en las tareas.', w: k(-2), seen: true }, { from: 'AN', t: 'que oraste por mamá antes del hospital.', w: k(-3) }] },
      qi: 0, talked: 0,
      pets: [{ id: 1, t: 'Sabiduría con Tomás en la adolescencia', n: 9 }, { id: 2, t: 'La salud de la mamá de Ana', n: 14 }, { id: 3, t: 'El presupuesto de este año', n: 5 }],
      nextPet: 4,
      memo: [
        { k: 'resp', t: 'Sofi se adaptó a su colegio nuevo', w: 'mar 2026' },
        { k: 'resp', t: 'El trabajo de Ana en la escuela', w: 'feb 2026' },
        { k: 'hito', t: 'Dios nos dio la casa en Luque', w: '2023' },
        { k: 'hito', t: 'Nació Sofi', w: '2019' },
        { k: 'hito', t: 'Nació Tomás', w: '2014' },
        { k: 'boda', t: 'Nos casamos', w: '12 may 2012' }],
      kids: { TO: { figs: ['arca', 'arcoiris', 'corona', 'leones', 'panes'], rep: 1, stars: 14, played: false },
              SO: { figs: ['arca', 'arcoiris', 'corona'], rep: 0, stars: 9, played: false } },
      verseIdx: 0,
      earned: {}
    };
  }
  const S = () => L.mstate('hogar', init);
  function restoreM(s) { const all = L.state; all.mods = all.mods || {}; all.mods.hogar = s; syncBadge(); refresh(); }

  /* estado de pantalla (no entra en deshacer) */
  const ui = { tab: 'familia', grat: '' };
  let mesa = null, orar = null, juego = null, lastPct = 0, uid = 0;
  const medalQ = [];

  /* ================================================================
     Ayudas
     ================================================================ */
  const today = () => L.key(L.date);
  const weekKeys = () => { const d = L.date, s = L.addDays(d, -d.getDay()); return [0, 1, 2, 3, 4, 5, 6].map(i => L.key(L.addDays(s, i))); };
  const isSolo = k => !!(LUZ[k] && LUZ[k].solo);
  function litDays(st) { return weekKeys().filter(k => st.luces.some(x => x.d === k && !isSolo(x.k))).length; }
  const lampP = st => Math.min(1, litDays(st) / GOAL);
  const hasLight = (st, k) => st.luces.some(x => x.k === k && x.d === today());
  function addLight(k) { const st = S(); if (hasLight(st, k)) return false; st.luces.push({ d: today(), k }); return true; }
  function kLabel(k) {
    if (!/^\d+-\d+$/.test(k)) return k;
    if (k === today()) return 'hoy';
    if (k === L.key(L.addDays(L.date, -1))) return 'ayer';
    const p = k.split('-'); return p[1] + ' ' + L.MS[Number(p[0]) - 1];
  }
  function dayName(k) { const i = weekKeys().indexOf(k); return k === today() ? 'Hoy' : i >= 0 ? L.DS[i] : kLabel(k); }
  function aniv() {
    const t = L.date, t0 = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    let a = new Date(t.getFullYear(), BODA.m, BODA.d);
    if (a < t0) a = new Date(t.getFullYear() + 1, BODA.m, BODA.d);
    return { days: Math.round((a - t0) / 864e5), years: a.getFullYear() - BODA.y, label: BODA.d + ' ' + L.MS[BODA.m] };
  }
  const names = ids => { const n = ids.map(i => FAM[i].mesa); return n.length > 1 ? n.slice(0, -1).join(', ') + ' y ' + n[n.length - 1] : (n[0] || ''); };
  const fav = (id, size, cls) => '<span class="hg-av' + (cls ? ' ' + cls : '') + '" style="--s:' + (size || 32) + 'px" aria-hidden="true">' + id + '</span>';
  const pushEl = () => document.getElementById('modpush');
  const ideaOfWeek = () => { const d = L.date, y0 = new Date(d.getFullYear(), 0, 1); return NOCHE_IDEAS[Math.floor((d - y0) / 864e5 / 7) % NOCHE_IDEAS.length]; };

  function ringHTML(f, inner, big) {
    const r = big ? 54 : 22, sw = big ? 8 : 5, b = (r + sw) * 2, c = b / 2, C = 2 * Math.PI * r;
    return '<span class="hg-ring' + (big ? ' hg-big' : '') + '"><svg viewBox="0 0 ' + b + ' ' + b + '"><circle class="trk" cx="' + c + '" cy="' + c + '" r="' + r + '" stroke-width="' + sw + '"/>' +
      '<circle class="val" cx="' + c + '" cy="' + c + '" r="' + r + '" stroke-width="' + sw + '" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - f)).toFixed(1) + '" data-c="' + C.toFixed(1) + '"/></svg><span>' + inner + '</span></span>';
  }

  /* la lámpara de casa: una casa con una lámpara en la mesa; --p (0..1) la enciende */
  const LAMP_BODY = 'M38 72 C38 52 70 44 100 45 C122 46 138 50 150 54 L174 52 C182 52 184 62 176 64 L152 70 C144 84 122 92 96 92 C64 92 38 88 38 72 Z';
  function flameSVG(u) {
    return '<svg viewBox="0 0 28 64" aria-hidden="true"><defs>' +
      '<linearGradient id="' + u + 'o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd27a" stop-opacity="0"/><stop offset=".25" stop-color="#ffc35a" stop-opacity=".55"/><stop offset=".7" stop-color="#ff9a33" stop-opacity=".9"/><stop offset="1" stop-color="#e2611c" stop-opacity=".9"/></linearGradient>' +
      '<linearGradient id="' + u + 'm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7a8" stop-opacity="0"/><stop offset=".3" stop-color="#ffd682" stop-opacity=".9"/><stop offset="1" stop-color="#ffb347"/></linearGradient>' +
      '<linearGradient id="' + u + 'c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0" stop-opacity=".2"/><stop offset=".4" stop-color="#fff6dc"/><stop offset="1" stop-color="#ffe9b0"/></linearGradient></defs>' +
      '<path d="M14 62 C3 58 1 44 7 32 C10 25 12 16 14 2 C17 15 22 24 24 34 C27 47 24 59 14 62 Z" fill="url(#' + u + 'o)"/>' +
      '<path d="M14 61 C7 58 6 48 10 39 C12 34 13 28 14 20 C16 28 19 34 20 41 C22 50 20 59 14 61 Z" fill="url(#' + u + 'm)"/>' +
      '<path d="M14 60 C10 59 9 53 11 48 C12 45 13.5 42 14 38 C15 43 17 46 17.5 50 C18 55 17 59 14 60 Z" fill="url(#' + u + 'c)"/>' +
      '<ellipse cx="14" cy="59.5" rx="3.6" ry="2.2" fill="#8ab8ff" opacity=".45"/></svg>';
  }
  function lampHTML(p, cls) {
    const u = 'hgl' + (++uid);
    return '<span class="hg-lamp' + (cls ? ' ' + cls : '') + '" style="--p:' + p.toFixed(3) + '" aria-hidden="true"><span class="hg-halo"></span>' +
      '<svg class="hg-house" viewBox="0 0 160 120"><defs>' +
        '<radialGradient id="' + u + 'g" cx="104" cy="86" r="88" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffd27e" stop-opacity=".62"/><stop offset=".45" stop-color="#ffb24a" stop-opacity=".16"/><stop offset="1" stop-color="#ffb24a" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="' + u + 'k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6a3c"/><stop offset=".55" stop-color="#6a4424"/><stop offset="1" stop-color="#3a2414"/></linearGradient></defs>' +
        '<path class="hg-in" d="M30 52 L80 15 L130 52 V116 H30 Z" fill="url(#' + u + 'g)"/>' +
        '<path class="hg-roof" d="M16 61 L80 13 L144 61"/><path class="hg-wall" d="M30 51 V116 H130 V51"/>' +
        '<path class="hg-table" d="M42 106 H122 M52 106 V116 M112 106 V116"/>' +
        '<g transform="translate(32 67.4) scale(.42)">' +
          '<path d="M40 66 C22 64 18 48 30 44 C38 42 44 50 44 57" fill="none" stroke="url(#' + u + 'k)" stroke-width="6" stroke-linecap="round"/>' +
          '<path d="' + LAMP_BODY + '" fill="url(#' + u + 'k)"/>' +
          '<ellipse cx="96" cy="49" rx="13" ry="3.4" fill="#22140a"/><ellipse cx="172" cy="53.5" rx="5" ry="1.8" fill="#170c04"/></g>' +
      '</svg><span class="hg-flame"><span class="hg-fla"><span class="hg-flb">' + flameSVG(u) + '</span></span></span></span>';
  }

  /* logros: se marcan al momento; se muestran cuando no tapan una pantalla de Hogar */
  function checkAch(defer) {
    const st = S();
    ACH.forEach(a => {
      if (st.earned[a.id]) return;
      const pr = a.prog(st);
      if (pr[0] >= pr[1]) { st.earned[a.id] = L.short(L.date); medalQ.push(a); }
    });
    if (!defer) flushMedals();
  }
  function flushMedals() {
    while (medalQ.length) {
      const a = medalQ.shift();
      L.celebrate(() => L.showMedal({ a: a.a, coin: ic(a.icon), times: 0, eyebrow: 'Logro del hogar', title: a.t, desc: a.d }));
    }
  }
  function syncBadge() { L.setBadge('hogar', !!S().grat.unread); }

  /* noche de familia en la rutina del núcleo (un solo ítem, nunca duplicado) */
  function nocheDow() { const R = L.state.routine; for (let d = 0; d < 7; d++) if ((R[d] || []).some(x => x.id === NOCHE_ID)) return d; return -1; }
  function placeNoche(dow) {
    const R = L.state.routine, st = S();
    for (let d = 0; d < 7; d++) if (R[d]) R[d] = R[d].filter(x => x.id !== NOCHE_ID);
    if (dow < 0) delete L.state.done[NOCHE_ID];
    else R[dow].push({ id: NOCHE_ID, a: 'encuentro', t: 'Noche de familia', h: st.noche.h, n: 'Mesa, juego y oración' });
    L.refreshHoy();
  }
  /* el devocional cuenta como práctica: marca la noche de familia si toca hoy;
     si hay otro encuentro pendiente (p. ej. el grupo de hombres) no lo «roba»:
     suma un ítem del día, ya hecho, que se limpia al pasar de día */
  function countPractice(title) {
    const items = L.todayItems();
    const mine = items.find(i => i.id.indexOf('hg-') === 0 && !L.isDone(i.id));
    if (mine) { L.setItem(mine.id, true, true); return; }
    const once = 'hg-mesa-' + today();
    if (items.some(i => i.id === once)) return;
    if (!items.some(i => i.a === 'encuentro' && !L.isDone(i.id))) { L.markQuiet('encuentro'); return; }
    L.state.routine[L.date.getDay()].push({ id: once, a: 'encuentro', t: title, h: 'En familia', once: today() });
    L.refreshHoy();
    L.setItem(once, true, true);
  }

  /* ================================================================
     Personas → Hogar
     ================================================================ */
  const TABS = [['familia', 'Familia'], ['pareja', 'Ana y tú'], ['chicos', 'Los chicos']];
  function render(el) {
    const st = S(), typing = document.activeElement && document.activeElement.id === 'hgGrat';
    el.innerHTML = homeHTML(st) + unreadHTML(st) +
      '<div class="segc hg-tabs" role="tablist" aria-label="Hogar">' + TABS.map(t => '<button type="button" role="tab" data-h-act="tab" data-h-id="' + t[0] + '" aria-selected="' + (ui.tab === t[0]) + '">' + t[1] + '</button>').join('') + '</div>' +
      '<div class="hg-pane">' + (ui.tab === 'pareja' ? parejaHTML(st) : ui.tab === 'chicos' ? chicosHTML(st) : familiaHTML(st)) + '</div>';
    if (ui.tab === 'pareja') {
      bindDeck(el); bindGrat(el);
      if (typing) { const i = $('#hgGrat', el); if (i) i.focus({ preventScroll: true }); }
    }
  }
  /* vuelve a dibujar solo lo de Hogar (cuerpo y tarjeta de Hoy) */
  function refresh() {
    const body = document.getElementById('modBody');
    if (body && body.dataset.mod === 'hogar') render(body);
    const hc = $('#hoyMods .hoy-mod[data-mod="hogar"]');
    if (hc) hoyCard(hc);
  }

  function homeHTML(st) {
    const n = litDays(st), wk = weekKeys(), ti = wk.indexOf(today());
    const days = wk.map((k, i) => {
      const lit = st.luces.some(x => x.d === k && !isSolo(x.k)), sp = st.luces.some(x => x.d === k && isSolo(x.k));
      return '<li class="hg-wd' + (lit ? ' lit' : '') + (i === ti ? ' today' : '') + (i > ti ? ' future' : '') + '"><span aria-hidden="true">' + L.DL[i] + '</span>' +
        '<i aria-hidden="true"><svg viewBox="0 0 12 16"><path d="' + FLAME + '"/></svg>' + (sp ? '<b></b>' : '') + '</i>' +
        '<span class="hg-sr">' + L.cap(L.DN[i]) + (lit ? ': juntos' : '') + (sp ? ', con una chispa' : '') + '</span></li>';
    }).join('');
    return '<section class="hg-home" aria-label="La lámpara de casa">' +
      '<button class="hg-home-btn" type="button" data-h-act="casa" aria-label="La lámpara de casa: ' + n + ' de ' + GOAL + ' días juntos esta semana. Ver qué la enciende">' +
        lampHTML(lampP(st)) +
        '<span class="hg-home-tx"><small>La lámpara de casa</small><b>' + (n >= GOAL ? 'Casa encendida' : n + ' de ' + GOAL + ' días juntos') + '</b>' +
        '<span class="hg-fam">' + FAM_IDS.map(id => fav(id, 28)).join('') + '</span></span>' + ic('next') + '</button>' +
      '<ol class="hg-week" aria-label="Esta semana">' + days + '</ol></section>';
  }
  function unreadHTML(st) {
    if (!st.grat.unread) return '';
    return '<button class="hg-unread" type="button" data-a="adoracion" data-h-act="g-read">' + fav('AN', 34) +
      '<span class="pn"><b>Ana te dejó una gratitud</b><small>Toca para leerla</small></span><span class="hg-uic">' + ic('star', 'i fillc') + '</span></button>';
  }

  /* --- Familia --- */
  function familiaHTML(st) {
    const M = MESAS[st.mesaIdx], done = hasLight(st, 'mesa'), nd = nocheDow(), on = nd >= 0, dow = on ? nd : st.noche.dow;
    const nocheHoy = on && nd === L.date.getDay() && !L.isDone(NOCHE_ID);
    const resume = mesa && mesa.day === today() && !mesa.fin && mesa.step > 0;
    const mesaCard = '<section class="hg-mesa" data-a="encuentro" aria-label="Devocional en la mesa">' +
      '<span class="hg-k">' + ic('encuentro') + 'Devocional en la mesa</span>' +
      (done ? '<h3>Hoy ya se encendió</h3><p class="hg-meta">Próximo: ' + M.t + '</p>'
            : '<h3>' + M.t + '</h3><p class="hg-meta">' + M.r + ' · 10 min · para todos</p>') +
      '<div class="hg-flow">' + [['palabra', 'Leer'], ['encuentro', 'Conversar'], ['oracion', 'Orar']].map(x => '<span class="actchip" data-a="' + x[0] + '">' + ic(x[0]) + x[1] + '</span>').join('') + '</div>' +
      (done ? '<p class="hg-done">' + ic('check') + 'Hecho hoy · +1 luz en casa</p>'
            : '<button class="btn" type="button" data-h-act="mesa">' + ic('flame') + (resume ? 'Seguir donde quedaron' : 'Empezar') + '</button>') +
      '</section>';
    const noche = '<div class="sec-h"><h2>Noche de familia</h2><span class="muted">' + (on ? 'En tu rutina' : 'Una vez por semana') + '</span></div>' +
      '<div class="card hg-noche" data-a="encuentro"><div class="hg-row"><span class="hg-ico">' + ic('encuentro') + '</span>' +
        '<span class="pn"><b>Cada ' + L.DN[dow] + '</b><small>' + st.noche.h + ' · mesa, juego y oración</small></span>' +
        '<button class="hg-switch" type="button" role="switch" aria-checked="' + on + '" aria-label="En mi rutina" data-h-act="noche"><span></span></button></div>' +
        '<p class="hg-idea"><b>Idea</b>' + ideaOfWeek() + '</p>' +
        '<div class="hg-days" role="radiogroup" aria-label="Día de la semana">' + L.DL.map((l, i) => '<button type="button" role="radio" aria-checked="' + (i === dow) + '" aria-label="' + L.DN[i] + '" data-h-act="noche-day" data-h-id="' + i + '">' + l + '</button>').join('') + '</div>' +
        (nocheHoy && !done ? '<button class="btn colored hg-sm" type="button" data-h-act="mesa">Es hoy · empezar en la mesa</button>' : '') +
      '</div>';
    const got = ACH.filter(a => st.earned[a.id]).length;
    const ach = '<div class="sec-h"><h2>Logros del hogar</h2><span class="muted">' + got + ' de ' + ACH.length + '</span></div>' +
      '<div class="hg-ach">' + ACH.map(a => achTile(st, a)).join('') + '</div>';
    return mesaCard + noche + ach;
  }
  function achTile(st, a) {
    const pr = a.prog(st), got = !!st.earned[a.id], f = got ? 1 : Math.min(1, pr[0] / pr[1]);
    return '<button class="hg-at' + (got ? ' got' : '') + (a.a ? '' : ' fl') + '" type="button"' + (a.a ? ' data-a="' + a.a + '"' : '') + ' data-h-act="ach" data-h-id="' + a.id + '" style="--pr:' + f.toFixed(3) + '">' +
      '<span class="hg-at-r"><span class="hg-at-i">' + ic(a.icon) + '</span></span><b>' + a.t + '</b><small>' + (got ? st.earned[a.id] : Math.min(pr[0], pr[1]) + ' de ' + pr[1]) + '</small></button>';
  }

  /* --- Ana y tú --- */
  function parejaHTML(st) {
    const av = aniv(), pl = st.plan, prayed = pl.last === today();
    const head = '<div class="hg-couple"><span class="hg-pair">' + fav('AN', 42) + fav('JC', 42) + '</span>' +
      '<span class="pn"><b>Ana y tú</b><small>Solo ustedes dos</small></span>' +
      (av.days <= 30 ? '<span class="hg-aniv" data-a="adoracion">' + ic('oracion') + (av.days === 0 ? '¡Hoy, ' + av.years + ' años!' : av.years + ' años en ' + av.days + ' d') + '</span>' : '') + '</div>';
    const plan = '<div class="card hg-plan" data-a="oracion"><div class="hg-row">' + ringHTML(pl.done / pl.len, ic('oracion')) +
      '<span class="pn"><b>30 días orando juntos</b><small>' + (prayed ? 'Hoy ya oraron · día ' + pl.done + ' de ' + pl.len : 'Día ' + (pl.done + 1) + ' de ' + pl.len + ' · empieza ' + (pl.done % 2 ? 'tú' : 'Ana')) + '</small></span></div>' +
      '<button class="btn ' + (prayed ? 'ghost' : 'colored') + '" type="button" data-h-act="orar">' + ic('oracion') + (prayed ? 'Orar otra vez' : 'Orar juntos') + '</button></div>';
    const log = st.grat.log.slice(0, 2).map(g => '<div class="hg-gl">' + fav(g.from, 28) + '<p><b>' + (g.from === 'AN' ? 'Ana' : 'Tú') + '</b>«' + esc(g.t) + '»</p>' +
      '<small>' + kLabel(g.w) + (g.from === 'JC' ? (g.seen ? ' · leída' : ' · enviada') : '') + '</small></div>').join('');
    const grat = '<div class="sec-h"><h2>Gratitud</h2><span class="muted">' + st.grat.sent + ' enviadas</span></div>' +
      '<div class="card hg-grat" data-a="adoracion">' + log +
        '<label class="hg-glbl" for="hgGrat">Hoy agradezco de ti…</label>' +
        '<div class="hg-gw"><input id="hgGrat" type="text" maxlength="120" autocomplete="off" placeholder="algo que viste hoy" value="' + esc(ui.grat) + '">' +
        '<button type="button" class="hg-send" data-h-act="g-send" aria-label="Enviar a Ana" disabled>' + ic('send') + '</button></div>' +
        '<div class="hg-sugs">' + SUGS.map((s, i) => '<button type="button" data-h-act="g-sug" data-h-id="' + i + '">' + s + '</button>').join('') + '</div></div>';
    const deck = '<div class="sec-h"><h2>Para conversar</h2><span class="muted">' + (st.talked ? st.talked + ' conversadas' : 'Desliza') + '</span></div>' + deckHTML(st);
    const pets = '<div class="sec-h"><h2>Peticiones de los dos</h2><span class="muted">' + st.pets.length + '</span></div>' +
      (st.pets.length ? '<div class="card flush">' + st.pets.map(p => '<div class="hg-pet" data-a="oracion"><span class="hg-pi">' + ic('oracion') + '</span>' +
        '<span class="pn"><b>' + esc(p.t) + '</b><small>' + (p.n ? 'Oraron ' + p.n + (p.n > 1 ? ' veces' : ' vez') : 'Nueva') + '</small></span>' +
        '<button class="hg-ans" type="button" data-h-act="p-ans" data-h-id="' + p.id + '" aria-label="Dios respondió: ' + esc(p.t) + '">' + ic('star') + 'Respondió</button></div>').join('') + '</div>' : '') +
      '<button class="addrow" type="button" data-h-act="p-new">' + ic('plus') + 'Nueva petición</button>';
    const memo = '<div class="sec-h"><h2>Memorial</h2><span class="muted">Lo que Dios hizo</span></div><ul class="card flush hg-memo">' +
      '<li class="hg-mi next" data-a="adoracion"><span class="hg-mic">' + ic('oracion') + '</span><span class="pn"><b>' + av.years + ' años de casados</b><small>' + av.label + (av.days ? ' · en ' + av.days + (av.days > 1 ? ' días' : ' día') : ' · hoy') + '</small></span></li>' +
      st.memo.map(x => { const k = MK[x.k] || MK.hito; return '<li class="hg-mi" data-a="' + k.a + '"><span class="hg-mic">' + ic(k.icon) + '</span><span class="pn"><b>' + esc(x.t) + '</b><small>' + (k.lbl ? k.lbl + ' · ' : '') + kLabel(x.w) + '</small></span></li>'; }).join('') + '</ul>';
    return head + plan + grat + deck + pets + memo;
  }
  function deckHTML(st) {
    const n = QS.length, idx = [0, 1, 2].map(i => (st.qi + i) % n);
    return '<div class="hg-deck" data-mo-noswipe>' + [2, 1, 0].map(pos => {
      const qi = idx[pos], q = QS[qi], c = CAT[q.c];
      return '<div class="hg-q ' + (pos ? 'n' + pos : 'hg-top') + '" data-a="' + c.a + '"' + (pos ? ' aria-hidden="true"' : ' role="group" aria-label="Pregunta ' + (qi + 1) + ' de ' + n + '"') + '>' +
        '<span class="hg-qc">' + c.t + '</span><p>' + esc(q.t) + '</p><span class="hg-qn">' + (qi + 1) + ' de ' + n + '</span>' +
        (pos ? '' : '<span class="hg-stamp hg-l" aria-hidden="true">Otra</span><span class="hg-stamp hg-r" aria-hidden="true">La conversamos</span>') + '</div>';
    }).join('') + '</div>' +
      '<div class="two hg-two"><button class="btn ghost" type="button" data-h-act="q-skip">Otra</button>' +
      '<button class="btn colored" type="button" data-a="encuentro" data-h-act="q-ok">' + ic('check') + 'La conversamos</button></div>';
  }
  function bindDeck(el) {
    const card = $('.hg-q.hg-top', el); if (!card) return;
    let id = null, x0 = 0, dx = 0;
    card.addEventListener('pointerdown', e => { if (e.button) return; id = e.pointerId; x0 = e.clientX; dx = 0; try { card.setPointerCapture(id); } catch (err) { /* sin captura */ } card.classList.add('drag'); });
    card.addEventListener('pointermove', e => {
      if (e.pointerId !== id) return;
      dx = e.clientX - x0;
      card.style.transform = 'translateX(' + dx.toFixed(0) + 'px) rotate(' + (dx / 18).toFixed(2) + 'deg)';
      card.style.setProperty('--sw', Math.max(-1, Math.min(1, dx / 90)).toFixed(2));
    });
    const end = e => {
      if (e.pointerId !== id) return;
      id = null; card.classList.remove('drag');
      if (Math.abs(dx) > 80) swipe(dx > 0 ? 1 : -1, card);
      else { card.style.transform = ''; card.style.setProperty('--sw', 0); }
    };
    card.addEventListener('pointerup', end); card.addEventListener('pointercancel', end);
  }
  function swipe(dir, card) {
    card = card || $('#modBody .hg-q.hg-top');
    const done = () => {
      const st = S();
      if (dir > 0) {
        st.talked++;
        const lit = addLight('charla');
        L.sound.note('encuentro'); L.haptic(8);
        L.toast(lit ? 'La conversaron · +1 luz en casa' : 'La conversaron');
      }
      st.qi = (st.qi + 1) % QS.length;
      refresh();
      const top = $('#modBody .hg-q.hg-top');
      if (top && !L.RM()) top.animate([{ transform: 'translateY(10px) scale(0.95)', opacity: 0.7 }, { transform: 'none', opacity: 1 }], { duration: 300, easing: EASE });
    };
    if (!card || L.RM()) { done(); return; }
    const from = card.style.transform || 'none';
    card.animate([{ transform: from }, { transform: 'translateX(' + (dir * 420) + 'px) rotate(' + (dir * 22) + 'deg)', opacity: 0 }], { duration: 280, easing: 'cubic-bezier(0.55, 0, 1, 0.45)', fill: 'forwards' }).onfinish = done;
  }
  function bindGrat(el) {
    const inp = $('#hgGrat', el), b = $('[data-h-act="g-send"]', el); if (!inp || !b) return;
    const upd = () => { ui.grat = inp.value; b.disabled = !inp.value.trim(); };
    inp.addEventListener('input', upd);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter' && inp.value.trim()) { e.preventDefault(); ACT['g-send'](null, b); } });
    upd();
  }

  /* --- Los chicos --- */
  function chicosHTML(st) {
    const V = VERSOS[st.verseIdx];
    const verse = '<section class="hg-verse" data-a="meditar" aria-label="Versículo de la semana"><span class="hg-k">' + ic('meditar') + 'Versículo de la semana</span>' +
      '<p class="hg-vt">«' + V.t + '»</p><p class="hg-vr">' + V.r + '</p>' +
      '<button class="btn colored" type="button" data-h-act="juego">' + ic('star', 'i fillc') + 'Jugar</button></section>';
    const kids = KIDS.map(k => {
      const kd = st.kids[k];
      return '<button class="hg-kid" type="button" data-h-act="album" data-h-id="' + k + '" aria-label="Álbum de ' + FAM[k].name + ': ' + kd.figs.length + ' de 8 figuritas">' +
        '<span class="hg-kid-top">' + fav(k, 42) + '<span class="pn"><b>' + FAM[k].name + '</b><small>' + FAM[k].age + ' años · ★ ' + kd.stars + '</small></span><span class="hg-cnt">' + kd.figs.length + '/8</span></span>' +
        '<span class="hg-alb">' + FIG_IDS.map(f => { const on = kd.figs.indexOf(f) >= 0; return '<span class="hg-fg' + (on ? ' on' : '') + '" data-a="' + FIG[f].a + '">' + (on ? fig(f) : '') + '</span>'; }).join('') + '</span>' +
        (kd.played ? '<span class="hg-ok">' + ic('check') + 'Jugó el versículo</span>' : '') + '</button>';
    }).join('');
    return verse + '<div class="sec-h"><h2>Sus álbumes</h2><span class="muted">Cada uno a su ritmo</span></div><div class="hg-kids">' + kids + '</div>' +
      '<p class="hg-priv">' + ic('grace') + 'Sin rankings ni comparaciones. Las figuritas se ganan en la mesa y con el versículo.</p>';
  }

  /* ================================================================
     Tarjeta en Hoy
     ================================================================ */
  function hoyCard(el) {
    const st = S(), av = aniv(), done = hasLight(st, 'mesa'), nd = nocheDow();
    const nocheHoy = nd === L.date.getDay() && !L.isDone(NOCHE_ID);
    let t = 'La lámpara de casa', sub, act = null, lbl = '';
    if (st.grat.unread) { sub = 'Ana te dejó una gratitud'; act = 'g-read'; lbl = 'Leer'; }
    else if (av.days === 0) { t = 'Hoy cumplen ' + av.years + ' años'; sub = 'Ana y tú · ' + av.label; act = 'orar'; lbl = 'Orar juntos'; }
    else if (!done) { sub = nocheHoy ? 'Hoy: noche de familia' : 'Devocional en la mesa · 10 min'; act = 'mesa'; lbl = 'Empezar'; }
    else { t = 'La casa quedó encendida'; sub = litDays(st) + ' de ' + GOAL + ' días juntos esta semana'; }
    el.innerHTML = '<div class="hg-hoy">' +
      '<button class="hg-hoy-main" type="button" data-h-act="open" aria-label="Abrir Hogar. ' + esc(t + ': ' + sub) + '">' + lampHTML(lampP(st), 'hg-xs') +
        '<span class="pn"><b>' + t + '</b><small>' + sub + '</small></span>' + (act ? '' : ic('next')) + '</button>' +
      (act ? '<button class="hg-pill" type="button" data-h-act="' + act + '">' + lbl + '</button>' : '') + '</div>';
  }

  /* ================================================================
     Pantalla completa (vía openPush)
     ================================================================ */
  function frame(o) {
    const pct = Math.round(Math.max(0, Math.min(1, o.prog || 0)) * 100);
    return '<section class="hg-full' + (o.a ? '' : ' fl') + '"' + (o.a ? ' data-a="' + o.a + '"' : '') + ' data-mo-noswipe aria-label="' + esc(o.title) + '">' +
      '<div class="hg-ftop">' + (o.back === false ? '<span></span>' : '<button class="hg-x" type="button" data-back aria-label="Salir">' + ic('x') + '</button>') +
        '<div class="hg-ftt"><b>' + o.title + '</b><small>' + (o.sub || '') + '</small></div><span></span></div>' +
      '<div class="hg-fprog" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' +
      '<div class="hg-fbody' + (o.center === false ? '' : ' center') + '">' + o.body + '</div>' +
      '<div class="hg-ffoot">' + o.foot + '</div></section>';
  }
  function paint(el, html, enter) {
    el.innerHTML = html;
    const bar = $('.hg-fprog i', el);
    if (bar) {
      const to = bar.style.width;
      if (!L.RM()) { bar.style.width = lastPct + '%'; void bar.offsetWidth; bar.style.width = to; }
      lastPct = parseFloat(to) || 0;
    }
    if (enter && !L.RM()) { const b = $('.hg-fbody', el); if (b) b.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: EASE }); }
  }
  const chip = (id, on, act, radio) => '<button class="hg-chip" type="button" data-h-act="' + act + '" data-h-id="' + id + '" ' + (radio ? 'role="radio" aria-checked' : 'aria-pressed') + '="' + on + '">' + fav(id, 40) + FAM[id].mesa + '</button>';

  /* --- Devocional en la mesa --- */
  function newMesa() {
    const st = S();
    return { day: today(), idx: st.mesaIdx, start: st.mesas, step: 0, present: FAM_IDS.slice(), reader: 'TO', turn: 0, fin: false, figs: [], p1: 0, days: 0, animated: false, busy: false };
  }
  const mesaSteps = m => ['quien', 'leer'].concat(m.present.some(isKid) ? ['chicos'] : [], m.present.some(x => !isKid(x)) ? ['grandes'] : [], ['orar', 'fin']);
  function prayOrder(m) {
    const base = PRAY_BASE.filter(x => m.present.indexOf(x) >= 0), s = m.start % Math.max(1, base.length);
    return base.slice(s).concat(base.slice(0, s));
  }
  function defaultReader(m) { return m.present.indexOf('TO') >= 0 ? 'TO' : m.present.indexOf('AN') >= 0 ? 'AN' : m.present[0]; }
  function openMesa() {
    if (!mesa || mesa.day !== today() || mesa.fin) mesa = newMesa();
    lastPct = 0;
    L.openPush(el => drawMesa(el, false));
  }
  function drawMesa(el, enter) {
    el = el || pushEl(); if (!mesa || !el) return;
    const st = S(), m = mesa, M = MESAS[m.idx], steps = mesaSteps(m), s = steps[m.step], n = steps.length - 2;
    let a = 'encuentro', body = '', foot = '', back = true, center = true;
    const next = lbl => '<button class="btn colored" type="button" data-h-act="m-next">' + lbl + ic('next') + '</button>';
    if (s === 'quien') {
      a = null;
      body = lampHTML(lampP(st), 'hg-lg') + '<h2 class="hg-h">' + M.t + '</h2><p class="hg-sub">' + M.r + ' · ≈ 10 min</p>' +
        '<p class="hg-lbl">¿Quién está en la mesa?</p><div class="hg-who">' + FAM_IDS.map(id => chip(id, m.present.indexOf(id) >= 0, 'm-who')).join('') + '</div>' +
        (m.present.length ? '<p class="hg-lbl">Lee</p><div class="hg-who" role="radiogroup" aria-label="Quién lee">' + m.present.map(id => chip(id, m.reader === id, 'm-reader', true)).join('') + '</div>' : '');
      foot = '<button class="btn" type="button" data-h-act="m-next"' + (m.present.length ? '' : ' disabled') + '>' + ic('flame') + 'Encender y empezar</button>';
    } else if (s === 'leer') {
      a = 'palabra'; center = false;
      body = '<p class="hg-eye">' + fav(m.reader, 26) + 'Lee ' + FAM[m.reader].mesa + ', en voz alta</p><h2 class="hg-h hg-l">' + M.t + '</h2><p class="hg-ref">' + M.r + '</p>' +
        '<div class="hg-read">' + M.vs.map(v => '<p><sup>' + v[0] + '</sup>' + esc(v[1]) + '</p>').join('') + '</div><p class="hg-src">Reina-Valera 1960</p>';
      foot = next('Siguiente');
    } else if (s === 'chicos' || s === 'grandes') {
      const kids = s === 'chicos';
      a = kids ? 'encuentro' : 'mensaje';
      const first = kids ? m.present.filter(isKid).sort((x, y) => FAM[x].age - FAM[y].age)[0] : (m.present.indexOf('AN') >= 0 ? 'AN' : m.present.find(x => !isKid(x)));
      body = (kids ? '<span class="hg-stk hg-s" data-a="' + FIG[M.fig].a + '">' + fig(M.fig) + '</span>' : '') +
        '<span class="hg-tag">' + ic(kids ? 'encuentro' : 'mensaje') + (kids ? 'Para los chicos' : 'Para los grandes') + '</span>' +
        '<p class="hg-ask">' + esc(kids ? M.kids : M.big) + '</p>' +
        (first ? '<p class="hg-eye hg-c">Empieza ' + fav(first, 26) + FAM[first].mesa + '</p>' : '') +
        '<p class="hg-hint">Sin respuestas correctas. Escuchen sin corregir.</p>';
      foot = next('Siguiente');
    } else if (s === 'orar') {
      a = 'oracion';
      const ord = prayOrder(m), who = ord[m.turn], last = m.turn === ord.length - 1;
      body = '<div class="hg-turn">' + fav(who, 92, 'hg-big') + '</div><p class="hg-name">Ora ' + FAM[who].mesa + '</p>' +
        '<p class="hg-ask hg-s">' + (last && ord.length > 1 ? PRAY_LAST : PRAY[who]) + '</p>' +
        '<div class="hg-turns" aria-label="Turno ' + (m.turn + 1) + ' de ' + ord.length + '">' + ord.map((id, i) => '<span class="hg-tn' + (i < m.turn ? ' done' : i === m.turn ? ' now' : '') + '">' + (i < m.turn ? ic('check') : id) + '</span>').join('') + '</div>';
      foot = '<button class="btn colored" type="button" data-h-act="m-next">Amén' + (last ? '' : ' · sigue ' + FAM[ord[m.turn + 1]].mesa) + '</button>';
    } else {
      a = null; back = false;
      const nu = m.figs.filter(x => !x.had).map(x => x.k), rep = m.figs.filter(x => x.had).map(x => x.k), F = FIG[M.fig];
      body = lampHTML(m.animated ? m.p1 : 0, 'hg-lg') + '<h2 class="hg-h">La casa quedó encendida</h2>' +
        '<p class="hg-sub">' + (m.days >= GOAL ? '¡Casa encendida esta semana!' : m.days + ' de ' + GOAL + ' días juntos esta semana') + '</p>' +
        '<div class="hg-fin-fam">' + m.present.map(id => fav(id, 34)).join('') + '</div>' +
        (m.figs.length ? '<div class="hg-win" data-a="' + F.a + '"><span class="hg-fg on">' + fig(M.fig) + '</span><span class="pn"><b>' +
          (nu.length ? names(nu) + (nu.length > 1 ? ' ganaron' : ' ganó') + ' una figurita' : 'Figurita repetida') + '</b><small>«' + F.t + '»' +
          (rep.length && nu.length ? ' · repetida para ' + names(rep) : rep.length ? ' · para ' + names(rep) : '') + '</small></span></div>' : '');
      foot = '<button class="btn" type="button" data-h-act="m-close">Amén</button>';
    }
    paint(el, frame({ a, title: 'Devocional en la mesa', sub: s === 'quien' ? 'Para todos' : s === 'fin' ? M.t : 'Paso ' + m.step + ' de ' + n, prog: m.step / (steps.length - 1), body, foot, back, center }), enter);
    if (s === 'fin') animateFin(el);
  }
  function finishMesa() {
    const st = S(), m = mesa, M = MESAS[m.idx];
    m.fin = true;
    st.mesas++; st.mesaIdx = (m.idx + 1) % MESAS.length;
    m.figs = m.present.filter(isKid).map(k => { const kd = st.kids[k], had = kd.figs.indexOf(M.fig) >= 0; if (had) kd.rep++; else kd.figs.push(M.fig); return { k, had }; });
    addLight('mesa');
    m.days = litDays(st); m.p1 = lampP(st);
    countPractice('Devocional en la mesa');
    checkAch(true);
  }
  /* cierre: una chispa de cada uno enciende la lámpara de casa */
  function animateFin(el) {
    const m = mesa, lamp = $('.hg-full .hg-lamp', el), flame = lamp && $('.hg-flame', lamp), avs = $$('.hg-fin-fam .hg-av', el);
    if (!lamp || m.animated) return;
    m.animated = true;
    const win = $('.hg-win', el);
    if (L.RM()) { lamp.style.setProperty('--p', m.p1.toFixed(3)); L.sound.chord(); return; }
    if (win) win.style.opacity = '0';
    avs.forEach((av, i) => setTimeout(() => {
      if (!document.contains(av)) return;
      L.spark(L.centerOf(av), L.centerOf(flame), '#ffc95e', () => {
        if (!document.contains(flame)) return;
        lamp.style.setProperty('--p', (Math.max(0.25, m.p1) * (i + 1) / avs.length).toFixed(3));
        L.burst(L.centerOf(flame), 4); L.sound.note(L.ORDER[i % 8]); L.haptic(8);
        if (i === avs.length - 1) {
          lamp.style.setProperty('--p', m.p1.toFixed(3));
          setTimeout(() => { if (document.contains(flame)) L.confetti(flame, 'encuentro'); }, 260);
          L.sound.chord(); L.haptic([10, 40, 20]);
          if (win) { win.style.opacity = ''; win.animate([{ opacity: 0, transform: 'translateY(10px) scale(0.96)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 380, easing: EASE, fill: 'backwards' }); }
        }
      });
    }, 520 + i * 300));
  }

  /* --- Orar juntos (pareja) --- */
  function newOrar() {
    const st = S(), first = st.plan.done % 2 ? 'JC' : 'AN', second = first === 'AN' ? 'JC' : 'AN';
    return { step: 0, sel: [], first, fin: false, before: st.plan.done, animated: false,
      seq: [{ w: first, k: 'gracias' }, { w: second, k: 'gracias' }, { w: first, k: 'pedir' }, { w: second, k: 'pedir' }, { w: 'both', k: 'bendecir' }] };
  }
  function openOrar() {
    if (!orar || orar.fin) orar = newOrar();
    lastPct = 0;
    L.openPush(el => drawOrar(el, false));
  }
  function drawOrar(el, enter) {
    el = el || pushEl(); if (!orar || !el) return;
    const st = S(), o = orar, pl = st.plan, total = o.seq.length + 1;
    let body, foot, back = true;
    const who = w => w === 'JC' ? 'Tu turno' : w === 'AN' ? 'Turno de Ana' : 'Los dos';
    if (o.step === 0) {
      body = '<div class="hg-turn"><span class="hg-pair hg-big">' + fav('AN', 78) + fav('JC', 78) + '</span></div><h2 class="hg-h">Orar juntos</h2><p class="hg-sub">≈ 5 min · por turnos</p>' +
        '<p class="hg-eye hg-c">Empieza ' + fav(o.first, 26) + (o.first === 'AN' ? 'Ana' : 'tú') + '</p>';
      foot = '<button class="btn colored" type="button" data-h-act="o-next">' + ic('oracion') + 'Empezar</button>';
    } else if (!o.fin) {
      const t = o.seq[o.step - 1], nx = o.seq[o.step];
      const K = { gracias: 'Agradecer', pedir: 'Pedir', bendecir: 'Bendecir' }[t.k];
      const P = t.k === 'gracias' ? (t.w === 'AN' ? 'Ana da gracias por algo de hoy… y por ti.' : 'Da gracias por algo de hoy… y por Ana.')
        : t.k === 'pedir' ? (t.w === 'AN' ? 'Ana ora por:' : 'Ora por:') : 'Mírense y díganse:';
      body = '<div class="hg-turn">' + (t.w === 'both' ? '<span class="hg-pair">' + fav('AN', 64) + fav('JC', 64) + '</span>' : fav(t.w, 92, 'hg-big')) + '</div>' +
        '<p class="hg-step">' + K + '</p><p class="hg-name">' + who(t.w) + '</p><p class="hg-ask hg-s">' + P + '</p>' +
        (t.k === 'pedir' ? '<div class="hg-pets">' + st.pets.map(p => '<button type="button" data-h-act="o-pet" data-h-id="' + p.id + '" aria-pressed="' + (o.sel.indexOf(p.id) >= 0) + '">' + esc(p.t) + '</button>').join('') + '</div>' : '') +
        (t.k === 'bendecir' ? '<p class="hg-bless">«Jehová te bendiga, y te guarde.»<small>Números 6:24</small></p>' : '') +
        '<div class="hg-dots" aria-hidden="true">' + o.seq.map((x, i) => '<i class="' + (i < o.step ? 'on' : '') + '"></i>').join('') + '</div>';
      foot = '<button class="btn colored" type="button" data-h-act="o-next">' + (nx ? 'Amén · ' + (nx.w === 'both' ? 'los dos' : nx.w === 'JC' ? 'sigues tú' : 'sigue Ana') : 'Amén') + '</button>';
    } else {
      back = false;
      body = '<div class="hg-fin-ring">' + ringHTML((o.animated ? pl.done : o.before) / pl.len, '<b>' + pl.done + '</b><small>de ' + pl.len + '</small>', true) + '</div>' +
        '<h2 class="hg-h">' + (pl.done === pl.len ? '¡Treinta días juntos!' : pl.done % 7 === 0 ? (pl.done === 7 ? 'Una semana juntos' : (pl.done / 7) + ' semanas juntos') : 'Oraron juntos') + '</h2>' +
        '<p class="hg-sub">' + (o.sel.length ? 'Por ' + o.sel.length + (o.sel.length > 1 ? ' peticiones' : ' petición') + ' · ' : '') + '+1 luz en casa</p>';
      foot = '<button class="btn colored" type="button" data-h-act="o-close">Amén</button>';
    }
    paint(el, frame({ a: 'oracion', title: 'Orar juntos', sub: 'Día ' + Math.min(pl.len, o.fin ? pl.done : pl.done + 1) + ' de ' + pl.len, prog: o.fin ? 1 : o.step / total, body, foot, back }), enter);
    if (o.fin && !o.animated) {
      o.animated = true;
      const v = $('.hg-full .hg-ring .val', el);
      if (v) {
        const C = Number(v.dataset.c), to = (C * (1 - pl.done / pl.len)).toFixed(1);
        if (L.RM()) v.setAttribute('stroke-dashoffset', to);
        else setTimeout(() => { v.setAttribute('stroke-dashoffset', to); L.pop($('.hg-full .hg-ring', el), 'oracion', 12); L.sound.chord(); L.haptic([8, 30, 12]); }, 380);
      }
    }
  }
  function finishOrar() {
    const st = S(), o = orar;
    o.fin = true; o.before = st.plan.done;
    if (st.plan.last !== today()) { st.plan.done = Math.min(st.plan.len, st.plan.done + 1); st.plan.last = today(); }
    o.sel.forEach(id => { const p = st.pets.find(x => x.id === id); if (p) p.n++; });
    addLight('pareja');
    L.markQuiet('oracion');
    checkAch(true);
  }

  /* --- Juego del versículo (chicos) --- */
  function openJuego(who) {
    juego = { who: who || null, r: 0, ok: 0, fin: false, had: false, lock: false, shown: false };
    lastPct = 0;
    L.openPush(el => drawJuego(el, false));
  }
  function drawJuego(el, enter) {
    el = el || pushEl(); if (!juego || !el) return;
    const st = S(), V = VERSOS[st.verseIdx], j = juego;
    let body, foot, back = true, sub = V.r;
    const stars = '<div class="hg-stars" role="img" aria-label="' + j.ok + ' de 3 estrellas">' + [0, 1, 2].map(i => '<i class="' + (i < j.ok ? 'on' : '') + '">' + ic('star', 'i fillc') + '</i>').join('') + '</div>';
    if (!j.who) {
      body = '<p class="hg-vcard">«' + V.t + '»<small>' + V.r + '</small></p><p class="hg-lbl">¿Quién juega?</p>' +
        '<div class="hg-kpick">' + KIDS.map(k => '<button class="hg-kp" type="button" data-h-act="j-who" data-h-id="' + k + '">' + fav(k, 58) + '<b>' + FAM[k].name + '</b><small>' + (st.kids[k].played ? 'Ya jugó · otra vez' : FAM[k].age + ' años') + '</small></button>').join('') + '</div>';
      foot = '<p class="hg-hint">Tres palabras escondidas. Sin apuro.</p>';
    } else if (!j.fin) {
      const R = V.rounds[j.r];
      sub = 'Juega ' + FAM[j.who].name + ' · ' + (j.r + 1) + ' de 3';
      body = stars + '<p class="hg-vbig">' + esc(R.pre) + '<span class="hg-blank"> </span>' + esc(R.post) + '</p><p class="hg-hint" id="hgJHint" aria-live="polite">¿Qué palabra falta?</p>';
      foot = '<div class="hg-opts">' + R.opts.map((w, i) => '<button class="hg-opt" type="button" data-h-act="j-opt" data-h-id="' + i + '">' + w + '</button>').join('') + '</div>';
    } else {
      const F = FIG[V.fig], kd = st.kids[j.who], other = KIDS.find(k => k !== j.who);
      back = false; sub = 'Juega ' + FAM[j.who].name;
      body = stars + '<div class="hg-stk-w" data-a="' + F.a + '"><span class="hg-stk">' + fig(V.fig) + '</span></div>' +
        '<p class="hg-step">' + (j.had ? 'Repetida · para cambiar' : '¡Figurita nueva!') + '</p><h2 class="hg-h">' + F.t + '</h2>' +
        '<p class="hg-sub">+3 estrellas para ' + FAM[j.who].name + ' · ★ ' + kd.stars + '</p>';
      foot = other && !st.kids[other].played
        ? '<div class="two"><button class="btn ghost" type="button" data-h-act="j-again" data-h-id="' + other + '">Juega ' + FAM[other].name + '</button><button class="btn colored" type="button" data-h-act="j-close">Listo</button></div>'
        : '<button class="btn colored" type="button" data-h-act="j-close">Listo</button>';
    }
    paint(el, frame({ a: 'meditar', title: 'Versículo de la semana', sub, prog: !j.who ? 0 : j.fin ? 1 : j.r / 3, body, foot, back }), enter);
    if (j.fin && !j.shown) {
      j.shown = true;
      const stk = $('.hg-stk', el);
      if (stk && !L.RM()) {
        stk.animate([{ transform: 'scale(0.2) rotate(-30deg)', opacity: 0 }, { transform: 'scale(1.12) rotate(6deg)', opacity: 1, offset: 0.65 }, { transform: 'none' }], { duration: 820, easing: EASE });
        setTimeout(() => { if (document.contains(stk)) L.confetti(stk, FIG[V.fig].a); }, 380);
      }
      L.sound.seal(); setTimeout(() => L.sound.chord(), 260); L.haptic([10, 40, 20]);
    }
  }
  function finishJuego() {
    const st = S(), V = VERSOS[st.verseIdx], j = juego, kd = st.kids[j.who];
    j.fin = true; j.had = kd.figs.indexOf(V.fig) >= 0;
    if (j.had) kd.rep++; else kd.figs.push(V.fig);
    kd.stars += 3; kd.played = true;
    addLight('verso');
    checkAch(true);
  }

  /* ================================================================
     Hojas
     ================================================================ */
  function casaHTML() {
    const st = S(), wk = weekKeys(), n = litDays(st);
    const rows = st.luces.filter(x => wk.indexOf(x.d) >= 0).sort((a, b) => wk.indexOf(b.d) - wk.indexOf(a.d));
    return '<div class="hg-casa fl">' + lampHTML(lampP(st), 'hg-md') +
      '<h2 class="sh-title">La lámpara de casa</h2><p class="sh-sub">Se enciende con lo que hacen juntos.</p>' +
      '<p class="flabel">Esta semana · ' + n + ' de ' + GOAL + ' días juntos</p><div class="hg-feed">' +
      (rows.length ? rows.map(x => { const k = LUZ[x.k] || LUZ.mesa; return '<div class="hg-fr' + (k.solo ? ' solo' : '') + '" data-a="' + k.a + '"><span class="hg-fi">' + ic(k.icon) + '</span><span class="hg-ft">' + k.t + (k.solo ? ' <em>chispa</em>' : '') + '</span><small>' + dayName(x.d) + '</small></div>'; }).join('')
        : '<p class="hg-tiny">Todavía nada esta semana.</p>') + '</div>' +
      '<p class="flabel">Lo que tú sumas</p>' +
      SHARE.map(s => '<button class="hg-sw" type="button" role="switch" aria-checked="' + !!st.share[s.k] + '" data-h-act="share" data-h-id="' + s.k + '"><span class="hg-fi" data-a="' + s.k + '">' + ic(s.k) + '</span><span class="pn"><b>' + s.t + '</b><small>' + s.d + '</small></span><span class="hg-knob" aria-hidden="true"></span></button>').join('') +
      '<p class="hg-priv">' + ic('grace') + 'Tus notas, peticiones y lecturas no se ven. Solo suma lo que eliges, y sin detalle.</p>' +
      '<p class="hg-priv2">Ana eligió sumar su oración · los chicos suman el versículo</p></div>';
  }
  function openCasa() { L.openSheet(casaHTML(), 'La lámpara de casa', root => { root._redraw = () => { root.innerHTML = casaHTML(); }; }); }
  function openAch(id) {
    const st = S(), a = ACH.find(x => x.id === id); if (!a) return;
    const pr = a.prog(st), got = st.earned[id], pct = Math.round(Math.min(1, pr[0] / pr[1]) * 100);
    L.openSheet('<div class="hg-achd' + (a.a ? '' : ' fl') + '"' + (a.a ? ' data-a="' + a.a + '"' : '') + '><span class="hg-coin' + (got ? ' got' : '') + '">' + ic(a.icon) + '</span>' +
      '<h2 class="sh-title">' + a.t + '</h2><p class="sh-sub">' + a.d + '</p>' +
      (got ? '<p class="hg-done">' + ic('check') + 'Logrado · ' + got + '</p>'
           : '<div class="pbar"><i style="width:' + pct + '%"></i></div><p class="hg-tiny">' + Math.min(pr[0], pr[1]) + ' de ' + pr[1] + ' · ' + a.h + '</p>') + '</div>', a.t);
  }
  function openAlbum(k) {
    const st = S(), kd = st.kids[k]; if (!kd) return;
    L.openSheet('<div class="hg-album"><div class="hg-ah">' + fav(k, 52) + '<div><h2 class="sh-title">Álbum de ' + FAM[k].name + '</h2>' +
      '<p class="sh-sub">' + kd.figs.length + ' de 8 · ★ ' + kd.stars + (kd.rep ? ' · ' + kd.rep + (kd.rep > 1 ? ' repetidas' : ' repetida') : '') + '</p></div></div>' +
      '<div class="hg-agrid">' + FIG_IDS.map(f => { const on = kd.figs.indexOf(f) >= 0; return '<div class="hg-ag" data-a="' + FIG[f].a + '"><span class="hg-fg' + (on ? ' on' : '') + '">' + (on ? fig(f) : '?') + '</span><b>' + (on ? FIG[f].t : 'Por descubrir') + '</b><small>' + FIG[f].r + '</small></div>'; }).join('') + '</div>' +
      '<p class="hg-priv">' + ic('grace') + 'Se ganan en la mesa y con el versículo. Cada uno a su ritmo.</p></div>', 'Álbum de ' + FAM[k].name);
  }
  function openGratRead() {
    const st = S(), u = st.grat.unread; if (!u) return;
    st.grat.log.unshift({ from: 'AN', t: u.t, w: today() }); st.grat.log = st.grat.log.slice(0, 6); st.grat.unread = null;
    syncBadge(); refresh();
    L.openSheet('<div class="hg-gread" data-a="adoracion">' + fav('AN', 64) + '<p class="hg-geye">Ana · hoy</p><p class="hg-gq"><span>Hoy agradezco de ti…</span>«' + esc(u.t.replace(/\.$/, '')) + '»</p>' +
      '<button class="btn colored" type="button" data-h-act="g-reply">' + ic('send') + 'Agradecerle también</button></div>', 'Gratitud de Ana', root => {
      if (!L.RM()) { const q = $('.hg-gq', root); if (q) q.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 120, easing: EASE, fill: 'backwards' }); }
    });
    L.sound.note('adoracion');
  }
  function openNewPet() {
    L.openSheet('<div data-a="oracion"><h2 class="sh-title">Nueva petición</h2><p class="sh-sub">Solo la ven Ana y tú.</p>' +
      '<textarea class="note" id="hgPetIn" maxlength="90" placeholder="¿Por qué oran los dos?"></textarea>' +
      '<button class="btn colored" type="button" id="hgPetSave" disabled>Guardar</button></div>', 'Nueva petición', root => {
      const t = $('#hgPetIn', root), b = $('#hgPetSave', root);
      t.addEventListener('input', () => { b.disabled = !t.value.trim(); });
      b.addEventListener('click', () => {
        const v = t.value.trim(); if (!v) return;
        const st = S(); st.pets.unshift({ id: st.nextPet++, t: v, n: 0 });
        L.closeSheet(() => { refresh(); L.toast('Guardada · solo ustedes dos'); });
      });
    });
  }

  /* ================================================================
     Acciones (un solo listener delegado, prefijo data-h-*)
     ================================================================ */
  const ACT = {
    open() { ui.tab = 'familia'; L.setPseg('hogar'); },
    tab(id) { if (ui.tab === id) return; ui.tab = id; refresh(); L.haptic(6); },
    casa() { openCasa(); },
    share(id) {
      const st = S(); st.share[id] = !st.share[id];
      if (st.share[id]) {
        const did = L.todayItems().some(i => i.a === id && L.isDone(i.id)) || (L.state.extras || []).indexOf(id) >= 0;
        if (did && addLight('yo-' + id)) L.toast('Sumaste una chispa a la casa');
      } else st.luces = st.luces.filter(x => !(x.k === 'yo-' + id && x.d === today()));
      L.haptic(6); L.redrawSheet(); refresh();
    },
    ach(id) { openAch(id); },
    album(id) { openAlbum(id); },

    /* devocional en la mesa */
    mesa() { openMesa(); },
    'm-who'(id) {
      const m = mesa; if (!m || m.step) return;
      const i = m.present.indexOf(id);
      if (i >= 0) m.present.splice(i, 1); else m.present = FAM_IDS.filter(x => x === id || m.present.indexOf(x) >= 0);
      if (m.present.indexOf(m.reader) < 0) m.reader = defaultReader(m);
      L.haptic(6); drawMesa(null, false);
    },
    'm-reader'(id) { if (!mesa || mesa.step) return; mesa.reader = id; L.haptic(6); drawMesa(null, false); },
    'm-next'() {
      const m = mesa; if (!m || m.busy || m.fin) return;
      const steps = mesaSteps(m), s = steps[m.step];
      if (s === 'orar') {
        const ord = prayOrder(m);
        if (m.turn < ord.length - 1) { m.turn++; L.sound.pray(); L.haptic(6); drawMesa(null, true); return; }
      }
      const advance = () => {
        m.busy = false; m.step++;
        if (steps[m.step] === 'fin') finishMesa();
        L.sound.note(steps[m.step] === 'orar' ? 'oracion' : 'encuentro');
        drawMesa(null, true);
      };
      if (s === 'quien' && !L.RM()) {
        const lamp = $('.hg-full .hg-lamp', pushEl());
        if (lamp) {
          m.busy = true; lamp.style.setProperty('--p', '1');
          L.burst(L.centerOf($('.hg-flame', lamp)), 8); L.sound.chord(); L.haptic([8, 30, 12]);
          setTimeout(() => { if (mesa === m) advance(); }, 700);
          return;
        }
      }
      advance();
    },
    'm-close'() {
      mesa = null;
      L.closePush();
      if (!medalQ.length) L.toast('Devocional en familia · +1 luz en casa');
      setTimeout(flushMedals, L.RM() ? 0 : 380);
      refresh();
    },

    /* noche de familia */
    noche() {
      const st = S(), was = nocheDow();
      if (was >= 0) { placeNoche(-1); L.toast('Quitada de tu rutina', () => { placeNoche(was); refresh(); }); }
      else { placeNoche(st.noche.dow); L.toast('En tu rutina · cada ' + L.DN[st.noche.dow], () => { placeNoche(-1); refresh(); }); }
      L.haptic(8); refresh();
    },
    'noche-day'(id) {
      const st = S(), d = Number(id); if (st.noche.dow === d && nocheDow() === d) return;
      const was = nocheDow();
      st.noche.dow = d;
      if (was >= 0) { placeNoche(d); L.toast('Noche de familia · cada ' + L.DN[d], () => { st.noche.dow = was; placeNoche(was); refresh(); }); }
      L.haptic(6); refresh();
    },

    /* pareja */
    orar() { openOrar(); },
    'o-next'() {
      const o = orar; if (!o || o.fin) return;
      o.step++;
      if (o.step > o.seq.length) finishOrar();
      L.sound.note('oracion'); L.haptic(6);
      drawOrar(null, true);
    },
    'o-pet'(id, b) {
      const o = orar; if (!o) return;
      const n = Number(id), i = o.sel.indexOf(n);
      if (i >= 0) o.sel.splice(i, 1); else { o.sel.push(n); L.pop(b, 'oracion', 6); L.haptic(6); }
      b.setAttribute('aria-pressed', String(o.sel.indexOf(n) >= 0));
    },
    'o-close'() {
      const st = S(); orar = null;
      L.closePush();
      if (!medalQ.length) L.toast('Oraron juntos · día ' + st.plan.done + ' de ' + st.plan.len);
      setTimeout(flushMedals, L.RM() ? 0 : 380);
      refresh();
    },
    'g-sug'(id) {
      const inp = $('#hgGrat'); if (!inp) return;
      inp.value = SUGS[Number(id)] || ''; inp.dispatchEvent(new Event('input')); inp.focus({ preventScroll: true });
    },
    'g-send'(id, b) {
      const inp = $('#hgGrat'); if (!inp) return;
      const v = inp.value.trim().replace(/^hoy agradezco de ti[:,…. ]*/i, ''); if (!v) return;
      const st = S(), s0 = structuredClone(st), item = { from: 'JC', t: v, w: today(), id: Date.now() };
      st.grat.log.unshift(item); st.grat.log = st.grat.log.slice(0, 6);
      st.grat.sent++; st.grat.lastSent = today();
      addLight('grat'); ui.grat = '';
      if (b) L.pop(b, 'adoracion', 10);
      L.sound.note('adoracion'); L.haptic(8);
      refresh();
      L.toast('Le llegó a Ana', () => { ui.grat = v; restoreM(s0); });
      const reply = ANA_REPLY[st.grat.sent % ANA_REPLY.length];
      setTimeout(() => {
        const it = S().grat.log.find(x => x.id === item.id); if (!it) return;
        it.seen = true; L.notify('AN', 'Ana', reply, 'adoracion', 0); refresh();
      }, L.RM() ? 1200 : 2600);
      checkAch();
    },
    'g-read'() { openGratRead(); },
    'g-reply'() {
      L.closeSheet(() => {
        ui.tab = 'pareja';
        if (L.current === 'personas' && L.pseg === 'hogar') refresh(); else L.setPseg('hogar');
        setTimeout(() => { const i = $('#hgGrat'); if (i) { i.scrollIntoView({ block: 'center', behavior: L.RM() ? 'auto' : 'smooth' }); i.focus({ preventScroll: true }); } }, 480);
      });
    },
    'q-skip'() { swipe(-1); },
    'q-ok'() { swipe(1); },
    'p-ans'(id, b) {
      const st = S(), s0 = structuredClone(st), p = st.pets.find(x => x.id === Number(id)); if (!p) return;
      L.pop(b, 'oracion', 12); L.sound.seal(); L.haptic([6, 30, 10]);
      st.pets = st.pets.filter(x => x !== p);
      st.memo.unshift({ k: 'resp', t: p.t, w: today() });
      refresh();
      L.toast('Al memorial: Dios respondió', () => restoreM(s0));
    },
    'p-new'() { openNewPet(); },

    /* chicos */
    juego() { openJuego(null); },
    'j-who'(id) { if (!juego) return; juego.who = id; L.haptic(6); drawJuego(null, true); },
    'j-opt'(id, b) {
      const j = juego; if (!j || j.lock || j.fin) return;
      const V = VERSOS[S().verseIdx], R = V.rounds[j.r], el = pushEl();
      if (R.opts[Number(id)] === R.ans) {
        j.lock = true; j.ok++;
        b.classList.add('ok'); L.pop(b, 'meditar', 10); L.sound.note('meditar'); L.haptic(8);
        const bl = $('.hg-blank', el); if (bl) { bl.textContent = R.ans; bl.classList.add('ok'); }
        const s = $$('.hg-stars i', el)[j.ok - 1];
        if (s) { s.classList.add('on'); if (!L.RM()) s.animate([{ transform: 'scale(0.3) rotate(-40deg)' }, { transform: 'scale(1.4)', offset: 0.6 }, { transform: 'none' }], { duration: 600, easing: EASE }); }
        const h = $('#hgJHint', el); if (h) h.textContent = '¡Muy bien!';
        setTimeout(() => {
          if (juego !== j) return;
          j.lock = false; j.r++;
          if (j.r >= 3) finishJuego();
          drawJuego(null, true);
        }, L.RM() ? 300 : 800);
      } else {
        b.classList.add('miss'); L.haptic([20]);
        if (!L.RM()) b.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 260 });
        const h = $('#hgJHint', el); if (h) h.textContent = 'Casi. Prueba otra.';
      }
    },
    'j-again'(id) { openJuego(id); },
    'j-close'() { juego = null; L.closePush(); setTimeout(flushMedals, L.RM() ? 0 : 380); refresh(); }
  };

  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('[data-h-act]');
    if (!b) return;
    const phone = document.getElementById('phone');
    if (!phone || !phone.contains(b)) return;
    const f = ACT[b.dataset.hAct];
    if (f) f(b.dataset.hId, b, e);
  });

  /* ================================================================
     Eventos del núcleo
     ================================================================ */
  L.on('itemDone', it => {
    if (!it) return;
    const st = S(); let ch = false;
    if (it.id === NOCHE_ID && !hasLight(st, 'mesa')) ch = addLight('noche') || ch;
    if (it.a === 'oracion' && st.share.oracion) ch = addLight('yo-oracion') || ch;
    if (it.a === 'palabra' && st.share.palabra) ch = addLight('yo-palabra') || ch;
    if (ch) { refresh(); checkAch(L.pushView === 'mod'); }
  });
  L.on('nextDay', () => {
    const st = S(), R = L.state.routine, prev = L.key(L.addDays(L.date, -1));
    for (let d = 0; d < 7; d++) if (R[d]) R[d] = R[d].filter(x => !x.once);       /* el devocional suelto era de ayer */
    const keep = {}; for (let i = 0; i < 15; i++) keep[L.key(L.addDays(L.date, -i))] = 1;
    st.luces = st.luces.filter(x => keep[x.d]);
    if (L.date.getDay() !== 6) st.luces.push({ d: today(), k: 'ana' });           /* Ana eligió sumar su oración */
    if (L.date.getDay() === 0) { KIDS.forEach(k => { st.kids[k].played = false; }); st.verseIdx = (st.verseIdx + 1) % VERSOS.length; }
    if (st.grat.lastSent === prev && !st.grat.unread) { st.grat.unread = { t: ANA_GRAT[st.grat.pool % ANA_GRAT.length] }; st.grat.pool++; }
    mesa = null; orar = null; juego = null;
    syncBadge(); refresh();
    if (medalQ.length) flushMedals();
  });
  L.on('reset', () => { mesa = orar = juego = null; ui.tab = 'familia'; ui.grat = ''; medalQ.length = 0; syncBadge(); });
  L.on('render', syncBadge);
  L.on('tab', () => { if (medalQ.length && L.pushView !== 'mod') flushMedals(); });

  L.register('hogar', {
    init() { syncBadge(); },
    render,
    hoyCard
  });
})(window.Lampara);
