/* Lámpara v5 · Familia (módulo de Personas)
   Una columna: la casa encendida (4 noches juntos por semana), el devocional en la mesa, Ana y tú, los chicos
   (álbum de figuritas y versículo de la semana), la noche de familia y los logros del hogar.
   Referencias: Paired (pregunta del día con la respuesta del otro escondida hasta que respondes, «juntos hace»,
   fechas especiales) y Bible App for Kids (una medalla por historia, estrellas por ronda, premios con progreso).
   Se registra en L.pseg.familia. Páginas propias: page-fam-pareja y page-fam-album.
   Pantalla completa (L.full + clases fl-*): la mesa y el juego del versículo. Detalle en CAMBIOS-familia.md. */
(() => {
  const { esc, ic, actIc, av } = L;
  const GOAL = 4;                       /* noches juntos por semana */
  const NOCHE_ID = 'fam-noche';         /* ítem de rutina de la noche de familia */

  /* ================= la familia ================= */
  const FAM = {
    JC: { name: 'Juan Carlos', mesa: 'Papá', age: 41 },
    AN: { name: 'Ana', mesa: 'Mamá', age: 39 },
    TO: { name: 'Tomás', mesa: 'Tomás', age: 12 },
    SO: { name: 'Sofi', mesa: 'Sofi', age: 7 }
  };
  const IDS = ['JC', 'AN', 'TO', 'SO'], KIDS = ['TO', 'SO'];
  const isKid = id => KIDS.includes(id);
  const col = id => L.avColor(id);
  const fav = (id, s, cls) => av(id, FAM[id].name, s, cls);
  const names = ids => { const n = ids.map(i => FAM[i].mesa); return n.length > 1 ? n.slice(0, -1).join(', ') + ' y ' + n[n.length - 1] : (n[0] || ''); };

  /* ================= figuritas: una historia, un color de actividad, una forma plana ================= */
  const CUT = ' style="fill:var(--c)"';
  const WAVE = '<path d="M5 42c3-2.4 6.3-2.4 9.5 0s6.5 2.4 9.5 0 6.3-2.4 9.5 0 6.5 2.4 9.5 0" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>';
  const MANE = Array.from({ length: 10 }, (_, k) => { const a = k * Math.PI / 5; return '<circle cx="' + (24 + 12.5 * Math.cos(a)).toFixed(1) + '" cy="' + (24 + 12.5 * Math.sin(a)).toFixed(1) + '" r="5.6"/>'; }).join('');
  const FIG = {
    arca: { n: 1, t: 'El arca de Noé', r: 'Génesis 6', a: 'encuentro', d: 'Noé construye el arca y Dios cuida a su familia.',
      g: '<path d="M13 21 24 12.5 35 21z"/><path d="M15 21h18v7H15z"/><path d="M21.5 23h5v3.2h-5z"' + CUT + '/><path d="M6 28h36l-5.5 9h-25z"/>' + WAVE },
    arcoiris: { n: 2, t: 'El arcoíris', r: 'Génesis 9', a: 'mensaje', d: 'Dios pone su arco en las nubes como señal de su promesa.',
      g: '<g fill="none" stroke="currentColor" stroke-width="4.4" stroke-linecap="round"><path d="M8 35a16 16 0 0 1 32 0"/><path d="M14.5 35a9.5 9.5 0 0 1 19 0" opacity=".7"/><path d="M21 35a3 3 0 0 1 6 0" opacity=".45"/></g><circle cx="8" cy="38" r="4.2"/><circle cx="13" cy="39" r="3"/><circle cx="40" cy="38" r="4.2"/><circle cx="35" cy="39" r="3"/>' },
    corona: { n: 3, t: 'David y Goliat', r: '1 Samuel 17', a: 'ayuno', d: 'David vence al gigante confiando en Dios y no en la espada.',
      g: '<path d="M8.5 33 6.5 15.5l9.5 7.5L24 10.5 32 23l9.5-7.5-2 17.5z"/><rect x="8.5" y="35.5" width="31" height="4.5" rx="1.5"/><circle cx="24" cy="27" r="2.5"' + CUT + '/><circle cx="15" cy="28.5" r="1.8"' + CUT + '/><circle cx="33" cy="28.5" r="1.8"' + CUT + '/>' },
    leones: { n: 4, t: 'Daniel y los leones', r: 'Daniel 6', a: 'oracion', d: 'Daniel sigue orando y Dios cierra la boca de los leones.',
      g: '<g opacity=".55">' + MANE + '<circle cx="24" cy="24" r="13"/></g><circle cx="24" cy="25" r="9.5"/><circle cx="20.5" cy="23" r="1.5"' + CUT + '/><circle cx="27.5" cy="23" r="1.5"' + CUT + '/><path d="M21.6 27h4.8L24 29.8z"' + CUT + '/>' },
    tormenta: { n: 5, t: 'La tormenta', r: 'Marcos 4', a: 'palabra', d: 'Jesús se levanta, reprende al viento y el mar se calma.',
      g: '<path d="M25 8v20h12z"/><path d="M22.5 12.5V28H13z" opacity=".7"/><path d="M9 30h30l-5 7H14z"/><path d="M38.5 4 34 11.5h4L35.5 18l7-9h-4l2.5-5z"/>' + WAVE },
    panes: { n: 6, t: 'Panes y peces', r: 'Juan 6', a: 'diario', d: 'Un muchacho comparte su merienda y Jesús alimenta a una multitud.',
      g: '<path d="M7 18c5.5-7 17-7 22.5 0-5.5 7-17 7-22.5 0z"/><path d="M28.5 18 37 12v12z"/><circle cx="13" cy="17" r="1.6"' + CUT + '/><rect x="8" y="28" width="15" height="10" rx="5"/><rect x="25" y="28" width="15" height="10" rx="5"/><path d="M13.5 30.5 11.5 35.5M18 30.5 16 35.5M30.5 30.5 28.5 35.5M35 30.5 33 35.5" fill="none" stroke-width="1.8" stroke-linecap="round" style="stroke:var(--c)"/>' },
    oveja: { n: 7, t: 'La oveja perdida', r: 'Lucas 15', a: 'adoracion', d: 'El pastor deja las noventa y nueve y busca a la que se perdió.',
      g: '<circle cx="17.5" cy="25" r="6.5"/><circle cx="24" cy="20.5" r="7"/><circle cx="31.5" cy="21.5" r="6.5"/><circle cx="35.5" cy="27.5" r="5.8"/><circle cx="26" cy="29" r="7.5"/><ellipse cx="9.5" cy="21.5" rx="4.6" ry="5.6" opacity=".6"/><rect x="18.5" y="33" width="3" height="8" rx="1.5" opacity=".6"/><rect x="30" y="33" width="3" height="8" rx="1.5" opacity=".6"/>' },
    pastor: { n: 8, t: 'El buen pastor', r: 'Salmo 23', a: 'meditar', d: 'Dios cuida a los suyos como un pastor a sus ovejas.',
      g: '<path d="M21 43V15.5a7.5 7.5 0 0 0-15 0V18" fill="none" stroke="currentColor" stroke-width="4.6" stroke-linecap="round"/><circle cx="32" cy="33" r="4.6"/><circle cx="37" cy="30.5" r="4.8"/><circle cx="41" cy="34" r="4.2"/><circle cx="36" cy="36.5" r="4.6"/><ellipse cx="27.6" cy="30.5" rx="3.2" ry="3.9" opacity=".6"/><rect x="31.5" y="38" width="2.4" height="5.5" rx="1.2" opacity=".6"/><rect x="38.5" y="38" width="2.4" height="5.5" rx="1.2" opacity=".6"/>' }
  };
  const FIG_IDS = Object.keys(FIG);
  const glyph = f => '<svg class="fam-g" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">' + FIG[f].g + '</svg>';
  const stk = (f, cls, s) => '<span class="fam-stk' + (cls ? ' ' + cls : '') + '" data-a="' + FIG[f].a + '"' + (s ? ' style="--s:' + s + 'px"' : '') + '>' + glyph(f) + '</span>';

  /* ================= la mesa: pasaje (RVR1960), una pregunta para chicos y otra para grandes ================= */
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
      ['22', 'Mi Dios envió su ángel, el cual cerró la boca de los leones, para que no me hiciesen daño, porque ante él fui hallado inocente; y aun delante de ti, oh rey, yo no he hecho nada malo.']],
      kids: 'Daniel oraba aunque tenía miedo. ¿Cuándo te gusta orar a ti?',
      big: '¿Qué costumbre de fe queremos que los chicos nos vean sostener?' },
    { t: 'Una promesa en el cielo', r: 'Génesis 9:13, 15', fig: 'arcoiris', vs: [
      ['13', 'Mi arco he puesto en las nubes, el cual será por señal del pacto entre mí y la tierra.'],
      ['15', 'Y me acordaré del pacto mío, que hay entre mí y vosotros y todo ser viviente de toda carne; y no habrá más diluvio de aguas para destruir toda carne.']],
      kids: '¿Qué promesa de Dios te gusta más?',
      big: '¿Qué promesas de Dios vimos cumplirse en esta casa?' }
  ];
  /* oración por turnos: empieza el más chico; el último cierra bendiciendo */
  const PRAY = { SO: 'Da gracias por algo lindo de hoy.', TO: 'Pide por un amigo o por tu escuela.', AN: 'Ora por lo que hablamos en la mesa.', JC: 'Pide por la semana de la familia.' };
  const PRAY_LAST = 'Cierra bendiciendo a cada uno por su nombre.';

  /* ================= versículo de la semana: cada ronda esconde más palabras ================= */
  const VERSOS = [
    { t: 'Jehová es mi pastor; nada me faltará.', r: 'Salmo 23:1', fig: 'pastor', rounds: [
      [{ i: 3, o: ['rey', 'pastor', 'escudo'] }],
      [{ i: 0, o: ['Moisés', 'Jehová', 'David'] }, { i: 6, o: ['pasará', 'asustará', 'faltará'] }],
      [{ i: 0, o: ['Jehová', 'Señor', 'Rey'] }, { i: 3, o: ['amigo', 'padre', 'pastor'] }, { i: 6, o: ['faltará', 'sobrará', 'olvidará'] }]] },
    { t: 'En el día que temo, Yo en ti confío.', r: 'Salmo 56:3', fig: 'arca', rounds: [
      [{ i: 4, o: ['juego', 'temo', 'duermo'] }],
      [{ i: 2, o: ['río', 'mar', 'día'] }, { i: 8, o: ['confío', 'pienso', 'corro'] }],
      [{ i: 2, o: ['día', 'año', 'mes'] }, { i: 4, o: ['canto', 'temo', 'como'] }, { i: 8, o: ['espero', 'descanso', 'confío'] }]] }
  ];

  /* ================= Ana y tú: una pregunta por día (Ana ya respondió; la ves cuando respondes tú) ================= */
  const CAT = { nos: { t: 'Nosotros', a: 'adoracion' }, fe: { t: 'Fe', a: 'palabra' }, sue: { t: 'Sueños', a: 'meditar' }, fam: { t: 'Familia', a: 'encuentro' } };
  const QS = [
    { c: 'nos', t: '¿Qué recuerdo nuestro te hace sonreír?', ana: 'La noche que se cortó la luz y cenamos con velas en el patio, los cuatro.' },
    { c: 'fe', t: '¿Qué está haciendo Dios en ti en este tiempo?', ana: 'Me está enseñando a no cargar sola con todo. Lo estoy aprendiendo contigo.' },
    { c: 'fam', t: '¿Qué ves de Dios en Tomás y en Sofi?', ana: 'La ternura de Sofi con los más chicos y la honestidad de Tomás, aunque le cueste.' },
    { c: 'sue', t: 'Si pudiéramos servir juntos en algo, ¿qué sería?', ana: 'Recibir matrimonios jóvenes en casa, con chipa y tereré.' },
    { c: 'nos', t: '¿Cuándo te sentiste más cuidado o cuidada por mí este mes?', ana: 'Cuando te quedaste con los chicos para que yo fuera a ver a mamá.' },
    { c: 'fe', t: '¿Qué versículo te sostuvo últimamente?', ana: '«Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.» 1 Pedro 5:7' },
    { c: 'fam', t: '¿Qué tradición queremos que los chicos recuerden?', ana: 'Orar antes de comer aunque haya visitas, y los domingos con los abuelos.' },
    { c: 'sue', t: '¿Dónde te imaginas que estaremos en diez años?', ana: 'Con Tomás en la facultad, nosotros más tranquilos y la casa siempre abierta.' },
    { c: 'nos', t: '¿Qué podría hacer esta semana para alivianarte?', ana: 'Ayudar a Sofi con la tarea el miércoles, que tengo reunión.' },
    { c: 'fe', t: '¿Cómo podemos orar mejor juntos?', ana: 'Más corto pero todos los días. Antes de dormir, aunque estemos cansados.' },
    { c: 'fam', t: '¿Qué necesita nuestra casa en esta etapa?', ana: 'Menos pantallas en la cena y más preguntas como estas.' },
    { c: 'sue', t: '¿Qué sueño tuyo todavía no te animaste a contarme?', ana: 'Volver a estudiar música. Te lo cuento bien el sábado.' }
  ];
  const PAST = [
    { w: -1, c: 'fe', q: '¿Cómo puedo orar por ti esta semana?', me: 'Por la reunión del jueves con el directorio.', ana: 'Por paciencia con mamá, que sigue internada.' },
    { w: -2, c: 'nos', q: '¿Qué fue lo mejor de tu semana?', me: 'El sábado a la tarde, los cuatro en la plaza.', ana: 'Que Sofi ya no llora al entrar al colegio.' }
  ];
  const NOCHE_IDEAS = ['Chipa casera y dar gracias por la semana', 'Juegos de mesa y una oración corta', 'Tereré en el patio: lo mejor y lo difícil de la semana', 'Película y una pregunta al final'];

  /* ================= logros del hogar ================= */
  const ACH = [
    { id: 'mesa1', a: 'encuentro', i: 'restaurant', t: 'Primera mesa', d: 'Su primer devocional en familia', p: f => [f.mesas, 1] },
    { id: 'casa', a: '', i: 'home', t: 'Casa encendida', d: 'Cuatro noches juntos en una semana', p: f => [Math.min(nightsOf(f), GOAL), GOAL] },
    { id: 'siete', a: 'oracion', i: 'hands-praying', t: 'Siete juntos', d: 'Ana y tú oraron juntos siete veces', p: f => [Math.min(f.pray.n, 7), 7] },
    { id: 'corazon', a: 'meditar', i: 'leaf', t: 'De corazón', d: 'Tomás y Sofi jugaron el versículo', p: f => [KIDS.filter(k => f.verse.played[k]).length, 2] },
    { id: 'diez', a: 'adoracion', i: 'chatbubbles', t: 'Diez preguntas', d: 'Diez preguntas respondidas de a dos', p: f => [Math.min(f.qa, 10), 10] },
    { id: 'album', a: 'ayuno', i: 'star', t: 'Álbum completo', d: 'Las ocho figuritas en un álbum', p: f => [Math.max(...KIDS.map(k => Object.keys(f.album[k].figs).length)), 8] }
  ];

  /* ================= estado (dentro de L.S.fam; se inicializa perezoso) ================= */
  function F() {
    const f = L.S.fam;
    if (!f.v5) {
      const t0 = L.today(), k = n => L.dk(L.addDays(t0, n));
      Object.assign(f, {
        v5: 1, mesas: 0, mesaDone: {},
        album: { TO: { figs: { arca: k(-61), arcoiris: k(-47), corona: k(-33), leones: k(-19), panes: k(-6) }, rep: 1 },
                 SO: { figs: { arca: k(-61), arcoiris: k(-47), corona: k(-33) }, rep: 0 } },
        verse: { wk: L.dk(L.weekStart(t0)), idx: 0, played: {} },
        pray: { n: 5, days: { [k(-1)]: 1, [k(-3)]: 1 } },
        qa: 7, noche: { dow: 5, h: '19:30' }, earned: {}
      });
      ACH.forEach(a => { const [v, g] = a.p(f); if (v >= g) f.earned[a.id] = 'antes'; });
    }
    const wk = L.dk(L.weekStart(L.today()));
    if (f.verse.wk !== wk) f.verse = { wk, idx: (f.verse.idx + 1) % VERSOS.length, played: {} };
    return f;
  }
  const nightOf = (f, k) => !!(f.nights[k] || (L.S.done[k] && L.S.done[k][NOCHE_ID]));
  const nightsOf = f => L.weekDates(L.today()).filter(d => nightOf(f, L.dk(d))).length;
  const nightOn = k => nightOf(F(), k);
  const weekNights = () => nightsOf(F());
  const mesaIdx = () => ((F().mesa % MESAS.length) + MESAS.length) % MESAS.length;
  const doneTonight = () => F().mesaDone[L.tk()] != null;
  const hasFig = (k, f) => !!F().album[k].figs[f];
  const count = k => Object.keys(F().album[k].figs).length;
  const qIdx = () => F().q % QS.length;
  const nocheItem = () => L.S.routine.find(r => r.id === NOCHE_ID);
  const nocheToday = () => L.todayItems().some(i => i.id === NOCHE_ID);
  const daysTo = (mo, d) => { const t = L.today(); let x = new Date(t.getFullYear(), mo, d); if (L.diffDays(x, t) < 0) x = new Date(t.getFullYear() + 1, mo, d); return L.diffDays(x, t); };
  function married() {                      /* casados el 12/05/2012 */
    const t = L.today();
    let y = t.getFullYear() - 2012, m = t.getMonth() - 4, d = t.getDate() - 12;
    if (d < 0) { m--; d += new Date(t.getFullYear(), t.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const left = daysTo(4, 12);
    return { y, m, d, left, nextN: left === 0 ? y : y + 1 };
  }
  const weekNo = () => Math.floor(L.diffDays(L.today(), new Date(L.today().getFullYear(), 0, 1)) / 7);
  function source(f) {
    const mi = MESAS.findIndex(M => M.fig === f), vi = VERSOS.findIndex(V => V.fig === f);
    if (mi >= 0) return { mesa: mi, txt: 'Se gana en la mesa con «' + MESAS[mi].t + '».', short: 'En la mesa' };
    if (vi >= 0) return { verse: vi, txt: 'Se gana jugando el versículo ' + VERSOS[vi].r + (vi === F().verse.idx ? ', el de esta semana.' : '. Llega en otra semana.'), short: 'Con el versículo' };
    return { txt: 'Llega con una próxima historia.', short: 'Muy pronto' };
  }

  /* ================= efectos después de redibujar (solo en lo que se ve) ================= */
  const fx = {};
  function fxSet(k, v) { fx[k] = v; setTimeout(() => { delete fx[k]; }, 120); }
  const shown = el => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight; };
  function applyFx(root) {
    if (!root) return;
    if (fx.night) { const b = root.querySelector('[data-fnight="' + fx.night + '"] span'); if (shown(b)) { b.classList.add('pop'); L.sparks(b, 10); } }
    if (fx.reveal) {
      const b = root.querySelector('.fq-b.ana');
      if (shown(b) && !L.RM()) { b.animate([{ opacity: 0, transform: 'translateY(10px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 120, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' }); setTimeout(() => L.sparks(b.querySelector('p'), 12), 380); }
    }
  }

  /* ================= celebraciones en cola: una por vez, cuando no hay nada abierto ================= */
  const Q = []; let qT = 0;
  function queue(fn) { Q.push(fn); clearTimeout(qT); qT = setTimeout(drain, 450); }
  function drain() {
    if (!Q.length) return;
    if (document.querySelector('ion-modal, ion-action-sheet, ion-alert, .ctx')) { clearTimeout(qT); qT = setTimeout(drain, 500); return; }
    Q.shift()();
  }
  const pushHere = (tag, props) => { const nav = document.getElementById('nav-' + L.tab()); return nav && nav.push(tag, props); };
  function medalSheet(html) {
    L.sheet(html, {
      mount: (el, m) => {
        el.addEventListener('click', e => {
          const t = e.target; let b;
          if (t.closest('[data-c]')) { m.dismiss(); return; }
          if ((b = t.closest('[data-fsalbum]'))) { const kid = b.dataset.fsalbum; m.dismiss().then(() => pushHere('page-fam-album', { kid })); return; }
          if ((b = t.closest('[data-fsnext]'))) { const kid = b.dataset.fsnext; m.dismiss().then(() => juego(kid)); return; }
        });
        setTimeout(() => L.sparks(el.querySelector('.coin'), 22), 320);
        L.haptic([10, 40, 18]);
      },
      onClose: () => { clearTimeout(qT); qT = setTimeout(drain, 400); }
    });
  }
  const house = (lit, cls) => '<svg class="fam-house' + (cls ? ' ' + cls : '') + '" viewBox="0 0 64 64" aria-hidden="true"><path class="h-b" d="M42 10h7v14h-7z"/><path class="h-b" d="M4 31 32 7l28 24z"/><path class="h-b" d="M11 28h42v30H11z"/>' +
    [[16, 33], [40, 33], [16, 45], [40, 45]].map((w, i) => '<rect class="' + (i < lit ? 'h-l' : 'h-w') + '" x="' + w[0] + '" y="' + w[1] + '" width="8" height="8" rx="1.5"/>').join('') + '<path class="h-d" d="M28 45h8v13h-8z"/></svg>';
  /* figurita ganada (en la mesa o con el versículo) */
  function winSheet(r) {
    const G = FIG[r.fig];
    if (!r.got.length && !r.rep.length) { nightSheet(r.nights); return; }
    const lines = [];
    if (r.got.length) lines.push(names(r.got) + (r.got.length > 1 ? ' la pegaron en su álbum' : ' la pegó en su álbum'));
    if (r.rep.length) lines.push('Repetida para ' + names(r.rep) + ': queda para cambiar');
    medalSheet('<div class="medal fam-win" data-a="' + G.a + '"><div class="coin fam-coin">' + glyph(r.fig) + '</div><p class="eyebrow">' + (r.got.length ? 'Figurita nueva' : 'Figurita repetida') + ' · Nº ' + G.n + '</p><h2>' + esc(G.t) + '</h2><p class="muted">' + esc(lines.join('. ')) + '.</p>' +
      (r.src === 'mesa' ? '<p class="fam-lit">' + ic('flame') + 'La noche quedó encendida · ' + Math.min(r.nights, GOAL) + ' de ' + GOAL + '</p>' : '') +
      '<div class="row2"><button class="btn ghost" data-fsalbum="' + (r.got[0] || r.rep[0]) + '">' + ic('grid') + 'Ver el álbum</button>' +
      (r.next ? '<button class="btn c" data-fsnext="' + r.next + '">Juega ' + FAM[r.next].name + '</button>' : '<button class="btn c" data-c>Amén</button>') + '</div></div>');
  }
  function nightSheet(n) {
    medalSheet('<div class="medal" data-a=""><div class="coin fl">' + ic('flame') + '</div><p class="eyebrow">Noche encendida</p><h2>Una noche más juntos</h2><p class="muted">' + Math.min(n, GOAL) + ' de ' + GOAL + ' noches esta semana</p><button class="btn" data-c>Amén</button></div>');
  }
  function casaSheet() {
    const f = F(), first = !f.earned.casa;
    if (first) { f.earned.casa = L.short(L.today()); L.save(); }
    medalSheet('<div class="medal" data-a=""><div class="coin fl fam-coin">' + house(4) + '</div><p class="eyebrow">' + (first ? 'Nuevo logro del hogar' : 'Meta de la semana') + '</p><h2>Casa encendida</h2><p class="muted">Cuatro noches juntos esta semana.</p>' +
      '<p class="fam-quote">«Pero yo y mi casa serviremos a Jehová.»<small>Josué 24:15</small></p><button class="btn" data-c>Amén</button></div>');
  }
  function achSheet(a, isNew) {
    const f = F(), got = !!f.earned[a.id], [v, g] = a.p(f), when = f.earned[a.id];
    const html = '<div class="medal" data-a="' + a.a + '"><div class="coin' + (a.a ? '' : ' fl') + (got ? '' : ' off') + '">' + ic(a.i) + '</div>' + (isNew ? '<p class="eyebrow">Nuevo logro del hogar</p>' : '') +
      '<h2>' + esc(a.t) + '</h2><p class="muted">' + esc(a.d) + '</p>' +
      (got ? (isNew ? '<button class="btn' + (a.a ? ' c' : '') + '" data-c>Amén</button>' : '<span class="share-pill">' + ic('checkmark-circle') + (when && when !== 'antes' ? 'Lo lograron el ' + esc(when) : 'Logrado') + '</span>')
        : '<div class="pbar wide" data-a="' + a.a + '"><i style="width:' + Math.round(v / g * 100) + '%"></i></div><p class="muted">' + v + ' de ' + g + '</p>') + '</div>';
    if (isNew) medalSheet(html); else L.sheet(html);
  }
  /* logros: se marcan al momento y se celebran en cola ('casa' se celebra con su propia hoja) */
  function checkAch() {
    const f = F(); let any = false;
    ACH.forEach(a => {
      if (f.earned[a.id] || a.id === 'casa') return;
      const [v, g] = a.p(f);
      if (v >= g) { f.earned[a.id] = L.short(L.today()); any = true; queue(() => achSheet(a, true)); }
    });
    if (any) L.save();
  }
  /* la casa se celebra cuando la semana cruza la meta, venga de donde venga (la mesa, tocar una noche, Hoy) */
  let lastN = null;
  L.on('refresh', () => {
    const n = weekNights();
    if (lastN !== null && lastN < GOAL && n >= GOAL) queue(casaSheet);
    lastN = n;
    checkAch();
  });
  L.on('reset', () => { lastN = null; Q.length = 0; });
  L.on('nextDay', () => { const f = F(); f.q++; lastN = null; L.save(); });

  /* ================= Personas → Familia ================= */
  function casaHTML() {
    const n = weekNights(), full = n >= GOAL, t = L.today();
    const days = L.weekDates(t).map(d => {
      const k = L.dk(d), on = nightOn(k), dd = L.diffDays(d, t);
      return '<button class="fh-n' + (on ? ' on' : '') + (dd === 0 ? ' now' : '') + (dd > 0 ? ' fut' : '') + '" data-fnight="' + k + '"' + (dd > 0 ? ' disabled' : '') +
        ' aria-label="' + L.cap(L.DN[d.getDay()]) + (on ? ', noche juntos' : '') + '"><small>' + L.DL[d.getDay()] + '</small><span>' + (on ? ic('flame') : d.getDate()) + '</span></button>';
    }).join('');
    return '<section class="fam-casa' + (full ? ' full' : '') + '"><div class="fh-top">' + house(Math.min(n, GOAL)) +
      '<div><h2>Casa encendida</h2><p>' + (full ? '¡Meta cumplida! ' + n + ' noches juntos' : n + ' de ' + GOAL + ' noches juntos esta semana') + '</p></div></div>' +
      '<div class="fh-week">' + days + '</div>' + (n ? '' : '<p class="fh-hint">' + ic('flame-outline') + 'Toca las noches en que estuvieron juntos</p>') + '</section>';
  }
  function mesaHTML() {
    const done = doneTonight(), i = done ? F().mesaDone[L.tk()] : mesaIdx(), M = MESAS[i], G = FIG[M.fig];
    const win = KIDS.filter(k => !hasFig(k, M.fig));
    return '<div class="sec"><h2>Esta noche en la mesa</h2>' + (done ? '' : '<button class="more" data-fpick>Otra historia</button>') + '</div>' +
      '<div class="fam-mesa box' + (done ? ' done' : '') + '" data-a="encuentro">' + stk(M.fig, 'fm-art') +
      '<p class="eyebrow">' + (done ? ic('checkmark-circle') + 'Hecho esta noche' : esc(M.r) + ' · 10 min') + '</p><h3>' + esc(M.t) + '</h3>' +
      '<div class="fm-steps">' + [['palabra', 'Leer'], ['encuentro', 'Conversar'], ['oracion', 'Orar']].map(x => '<span data-a="' + x[0] + '">' + actIc(x[0], done) + x[1] + '</span>').join('') + '</div>' +
      (done ? '<p class="fm-next">Mañana: <b>' + esc(MESAS[mesaIdx()].t) + '</b></p>'
        : (win.length ? '<p class="fm-win">' + stk(M.fig, '', 30) + '<span>' + names(win) + (win.length > 1 ? ' ganan' : ' gana') + ' <b>' + esc(G.t) + '</b></span></p>' : '') +
          '<button class="btn c" data-fmesa>' + ic('restaurant') + 'Empezar en la mesa</button>') + '</div>';
  }
  const bubble = (id, t) => '<div class="fq-b ' + (id === 'JC' ? 'me' : 'ana') + '" style="--bc:' + col(id) + '">' + (id === 'AN' ? fav('AN', 28) : '') + '<p>' + esc(t) + '</p></div>';
  function qHTML(q, mine) {
    const c = CAT[q.c];
    return '<div class="fq"><span class="tag" data-a="' + c.a + '">' + c.t + '</span><p class="fq-q">' + esc(q.t) + '</p>' +
      (mine ? '<button class="fq-mine" data-fans aria-label="Cambiar tu respuesta">' + bubble('JC', mine) + '</button>' + bubble('AN', q.ana)
        : '<div class="fq-lock">' + fav('AN', 28) + '<span><b>Ana ya respondió</b><i></i><i></i></span>' + ic('lock-closed') + '</div>' +
          '<div class="fq-acts"><button class="btn ghost sm" data-fotra>' + ic('shuffle') + 'Otra</button><button class="btn c" data-fans>' + ic('chatbubble-ellipses') + 'Responder y ver</button></div>') + '</div>';
  }
  function parejaHTML() {
    const m = married(), f = F(), prayed = !!f.pray.days[L.tk()];
    return '<div class="sec"><h2>Ana y tú</h2><button class="more" data-fpareja>Ver todo</button></div>' +
      '<div class="fam-pareja box" data-a="adoracion"><button class="fp-head" data-fpareja><span class="fp-avs">' + fav('AN', 40) + fav('JC', 40) + '</span>' +
      '<span class="fp-t"><b>' + m.y + ' años casados</b><small>' + (m.left === 0 ? '¡Hoy es su aniversario!' : 'Faltan ' + m.left + ' días para los ' + m.nextN) + '</small></span>' + ic('chevron-forward', 'endic') + '</button>' +
      qHTML(QS[qIdx()], f.ans[L.tk()]) +
      '<button class="link fp-pray" data-forar>' + ic(prayed ? 'heart' : 'heart-outline') + (prayed ? 'Hoy oraron juntos' : 'Orar juntos esta noche') + '</button></div>';
  }
  function kidCard(k) {
    const n = count(k);
    return '<button class="fk" data-falbum="' + k + '" style="--kc:' + col(k) + '"><span class="fk-top">' + fav(k, 38) + '<span><b>' + FAM[k].name + '</b><small>' + FAM[k].age + ' años</small></span></span>' +
      '<span class="fk-grid">' + FIG_IDS.map(f => hasFig(k, f) ? stk(f) : '<i class="fk-e"></i>').join('') + '</span>' +
      '<span class="fk-n"><b>' + n + '</b> de 8 figuritas</span></button>';
  }
  function verseCard() {
    const f = F(), V = VERSOS[f.verse.idx], words = V.t.split(' '), hide = V.rounds[0][0].i;
    const txt = words.map((w, i) => i === hide ? '<span class="fj-blank" style="width:' + (strip(w).length * 0.55 + 0.6).toFixed(1) + 'em"></span>' + esc(tail(w)) : esc(w)).join(' ');
    return '<div class="fam-verse box" data-a="meditar"><p class="eyebrow">Versículo de la semana · ' + esc(V.r) + '</p><p class="fv-t">«' + txt + '»</p>' +
      '<div class="fv-foot"><span class="fv-kids">' + KIDS.map(k => { const on = !!f.verse.played[k]; return '<span class="fv-k' + (on ? ' on' : '') + '">' + fav(k, 30) + (on ? '<i>' + ic('checkmark') + '</i>' : '') + '</span>'; }).join('') +
      '<small>' + (KIDS.every(k => f.verse.played[k]) ? 'Ya jugaron los dos' : 'Premio: ' + esc(FIG[V.fig].t)) + '</small></span>' +
      '<button class="btn c sm" data-fjuego>' + ic('play') + 'Jugar</button></div></div>';
  }
  function chicosHTML() {
    return '<div class="sec"><h2>Los chicos</h2><span class="muted">Cada uno a su ritmo</span></div><div class="fam-kids">' + KIDS.map(kidCard).join('') + '</div>' + verseCard();
  }
  function nocheHTML() {
    const f = F(), it = nocheItem(), on = !!it, dow = on ? it.days[0] : f.noche.dow;
    const today = on && dow === L.today().getDay();
    const idea = NOCHE_IDEAS[weekNo() % NOCHE_IDEAS.length];
    return '<div class="sec"><h2>Noche de familia</h2><span class="muted">' + (on ? 'En tu semana' : 'Una vez por semana') + '</span></div>' +
      '<div class="fam-noche box' + (on ? ' on' : '') + '" data-a="encuentro"><button class="fn-row" data-fnoche role="switch" aria-checked="' + on + '"><span class="aic">' + actIc('encuentro', on) + '</span>' +
      '<span class="fn-t"><b>Cada ' + L.DN[dow] + ' · ' + f.noche.h + '</b><small>' + (on ? 'Aparece en Hoy ese día' : 'Agrégala a Hoy cada semana') + '</small></span><span class="tg"><i></i></span></button>' +
      '<div class="fn-days">' + L.WEEK.map(w => '<button class="' + (w === dow ? 'on' : '') + '" data-fdia="' + w + '" aria-label="' + L.DN[w] + '">' + L.DL[w] + '</button>').join('') + '</div>' +
      '<p class="fn-idea">' + ic('sparkles') + '<span><b>Idea para esta semana</b>' + esc(idea) + '</span></p>' +
      (today && !doneTonight() ? '<button class="btn c fn-go" data-fmesa>' + ic('restaurant') + 'Es hoy · empezar en la mesa</button>' : '') + '</div>';
  }
  function logrosHTML() {
    const f = F(), got = ACH.filter(a => f.earned[a.id]).length;
    return '<div class="sec"><h2>Logros del hogar</h2><span class="muted">' + got + ' de ' + ACH.length + '</span></div><div class="coins fam-coins">' + ACH.map(a => {
      const on = !!f.earned[a.id], [v, g] = a.p(f);
      return '<button class="coin-b' + (on ? ' got' : '') + '" data-fach="' + a.id + '" data-a="' + a.a + '"><span class="coin-m' + (a.a ? '' : ' fl') + '">' + ic(a.i) +
        (on || !v ? '' : '<svg class="prog" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" style="stroke-dasharray:' + (100.5 * v / g).toFixed(1) + ' 101"/></svg>') + '</span><small>' + esc(a.t) + '</small></button>';
    }).join('') + '</div>';
  }
  const segHTML = () => '<div class="fam">' + casaHTML() + mesaHTML() + parejaHTML() + chicosHTML() + nocheHTML() + logrosHTML() + '</div>';

  /* ================= acciones ================= */
  function toggleNight(k) {
    const f = F();
    if (f.nights[k]) { delete f.nights[k]; L.haptic(6); }
    else if (nightOn(k)) { L.toast('Esa noche se marcó desde Hoy'); return; }
    else { f.nights[k] = 1; L.haptic(10); fxSet('night', k); }
    L.save(); L.refresh();
  }
  function pickMesa() {
    const cur = mesaIdx();
    L.actions('¿Qué historia esta noche?', MESAS.map((M, i) => ({ text: M.t + (i === cur ? ' · elegida' : ''), handler: () => { F().mesa = i; L.save(); L.refresh(); L.haptic(6); } })),
      'Cada una trae su figurita para el álbum');
  }
  function answer() {
    const k = L.tk(), q = QS[qIdx()];
    L.prompt('Tu respuesta', { msg: q.t, ph: 'Escribe para Ana', value: F().ans[k] || '', ok: 'Enviar' }, v => {
      const f = F(), first = !f.ans[k];
      f.ans[k] = v;
      if (first) { f.qa++; fxSet('reveal', 1); }
      L.save(); L.refresh();
      if (first) L.toast('Ya puedes ver lo que respondió Ana', { icon: 'heart' });
    });
  }
  function otraQ() { const f = F(); if (f.ans[L.tk()]) return; f.q++; L.haptic(6); L.save(); L.refresh(); }
  function orarSheet() {
    const f = F(), first = f.pray.n % 2 ? 'JC' : 'AN', second = first === 'AN' ? 'JC' : 'AN';
    const who = id => id === 'JC' ? 'Tú' : 'Ana';
    const T = [[first, who(first) + (first === 'JC' ? ' agradeces' : ' agradece'), 'Por algo de hoy… y por el otro.'], [second, who(second) + (second === 'JC' ? ' pides' : ' pide'), 'Por la semana de Tomás y Sofi.'], ['both', 'Los dos bendicen', '«Jehová te bendiga, y te guarde.» Números 6:24']];
    L.sheet('<div class="fam-orar" data-a="oracion"><div class="sh-head"><span class="fp-avs">' + fav('AN', 44) + fav('JC', 44) + '</span><div><h2>Orar juntos</h2><p>5 min · por turnos · empieza ' + (first === 'AN' ? 'Ana' : 'tú') + '</p></div></div>' +
      '<div class="turns">' + T.map(x => '<button class="turn" data-turn>' + (x[0] === 'both' ? '<span class="fp-avs sm">' + fav('AN', 30) + fav('JC', 30) + '</span>' : fav(x[0], 40)) + '<div><b>' + x[1] + '</b><small>' + esc(x[2]) + '</small></div><i>' + ic('checkmark') + '</i></button>').join('') + '</div>' +
      '<button class="btn c" data-amen>' + ic('hands-praying') + 'Amén</button></div>', {
      mount: (el, m) => el.addEventListener('click', e => {
        const t = e.target.closest('[data-turn]');
        if (t) { t.classList.toggle('on'); L.haptic(8); return; }
        if (e.target.closest('[data-amen]')) { m.dismiss(); prayed(); }
      })
    });
  }
  function prayed() {
    const f = F(), k = L.tk();
    if (!f.pray.days[k]) { f.pray.days[k] = 1; f.pray.n++; }
    L.save(); L.refresh();
    L.toast('Oraron juntos · ' + f.pray.n + ' veces', { icon: 'heart' });
  }
  function addNoche(dow) {
    L.S.routine = L.S.routine.filter(r => r.id !== NOCHE_ID);
    L.S.routine.push({ id: NOCHE_ID, a: 'encuentro', t: 'Noche de familia', h: F().noche.h, days: [dow], n: 'La mesa, un juego y oración' });
  }
  function nocheToggle() {
    const f = F(), it = nocheItem();
    if (it) { L.S.routine = L.S.routine.filter(r => r.id !== NOCHE_ID); L.toast('La sacaste de tu semana', { undo: () => { addNoche(it.days[0]); L.save(); L.refresh(); } }); }
    else { addNoche(f.noche.dow); L.toast('En tu semana · cada ' + L.DN[f.noche.dow] + ' ' + f.noche.h, { icon: 'calendar' }); }
    L.haptic(8); L.save(); L.refresh();
  }
  function nocheDay(w) { const f = F(); if (f.noche.dow === w) return; f.noche.dow = w; if (nocheItem()) addNoche(w); L.haptic(6); L.save(); L.refresh(); }
  /* lo que comparten el segmento y las páginas propias */
  function act(e, page) {
    const t = e.target; let el;
    if ((el = t.closest('[data-fnight]'))) { toggleNight(el.dataset.fnight); return true; }
    if (t.closest('[data-fmesa]')) { mesaFlow(); return true; }
    if (t.closest('[data-fpick]')) { pickMesa(); return true; }
    if (t.closest('[data-fpareja]')) { page.push('page-fam-pareja'); return true; }
    if (t.closest('[data-fans]')) { answer(); return true; }
    if (t.closest('[data-fotra]')) { otraQ(); return true; }
    if (t.closest('[data-forar]')) { orarSheet(); return true; }
    if ((el = t.closest('[data-falbum]'))) { page.push('page-fam-album', { kid: el.dataset.falbum }); return true; }
    if (t.closest('[data-fjuego]')) { juego(); return true; }
    if ((el = t.closest('[data-fdia]'))) { nocheDay(+el.dataset.fdia); return true; }
    if (t.closest('[data-fnoche]')) { nocheToggle(); return true; }
    if ((el = t.closest('[data-fach]'))) { achSheet(ACH.find(a => a.id === el.dataset.fach)); return true; }
    return false;
  }

  /* ================= página: Ana y tú (Paired: juntos hace, fechas especiales, pregunta del día, historial) ================= */
  function dateRow(d, mo, t, sub, a) {
    const n = daysTo(mo, d);
    return '<div class="fd-row" data-a="' + a + '"><span class="fd-tile"><b>' + d + '</b><small>' + L.MS[mo] + '</small></span><span class="fd-t"><b>' + esc(t) + '</b><small>' + esc(sub) + '</small></span>' +
      '<span class="fd-left">' + (n === 0 ? '¡Hoy!' : n === 1 ? 'Mañana' : 'en ' + n + ' días') + '</span></div>';
  }
  class PageFamPareja extends L.Page {
    shell() { return L.shell({ title: 'Ana y tú', back: '', large: false }); }
    render() {
      const f = F(), m = married(), wk = L.weekDates(L.today()), prayedT = !!f.pray.days[L.tk()];
      const unit = (n, a, b) => n === 1 ? a : b;
      return '<div class="prof fam-prof"><span class="fp-avs big">' + fav('AN', 76) + fav('JC', 76) + '</span><h1>Ana y tú</h1><p class="muted">Casados el 12 de mayo de 2012</p></div>' +
        '<div class="fam-together" data-a="adoracion"><p class="eyebrow">Juntos hace</p><div>' +
        [[m.y, unit(m.y, 'año', 'años')], [m.m, unit(m.m, 'mes', 'meses')], [m.d, unit(m.d, 'día', 'días')]].map(x => '<span><b>' + x[0] + '</b><small>' + x[1] + '</small></span>').join('') + '</div></div>' +
        '<div class="sec"><h2>Pregunta de hoy</h2><span class="muted">' + f.qa + ' respondidas</span></div><div class="fam-pareja box" data-a="adoracion">' + qHTML(QS[qIdx()], f.ans[L.tk()]) + '</div>' +
        '<div class="sec"><h2>Orar juntos</h2><span class="muted">' + f.pray.n + ' veces</span></div><div class="box pad fam-pray" data-a="oracion"><div class="fo-week">' + wk.map(d => {
          const k = L.dk(d), on = !!f.pray.days[k];
          return '<span class="' + (on ? 'on' : '') + (L.same(d, L.today()) ? ' now' : '') + '"><i>' + (on ? ic('heart') : '') + '</i>' + L.DL[d.getDay()] + '</span>';
        }).join('') + '</div><button class="btn ' + (prayedT ? 'ghost' : 'c') + '" data-forar>' + ic('hands-praying') + (prayedT ? 'Orar otra vez' : 'Orar juntos') + '</button></div>' +
        '<div class="sec"><h2>Fechas especiales</h2></div><div class="box fam-dates">' + dateRow(12, 4, 'Aniversario de bodas', 'Cumplen ' + m.nextN + ' años', 'adoracion') + dateRow(3, 11, 'Cumpleaños de Ana', 'Cumple 40', 'ayuno') + '</div>' +
        '<div class="sec"><h2>Antes</h2><span class="muted">Lo que se respondieron</span></div>' + PAST.map(p => '<div class="fam-past box" data-a="' + CAT[p.c].a + '"><p class="eyebrow">' + L.cap(L.rel(p.w)) + ' · ' + CAT[p.c].t + '</p><p class="fp-q">' + esc(p.q) + '</p>' + bubble('JC', p.me) + bubble('AN', p.ana) + '</div>').join('') +
        '<p class="hint-swipe">' + ic('lock-closed-outline') + 'Solo lo ven Ana y tú</p>';
    }
    after() { applyFx(this.pg); }
    onClick(e) { act(e, this); }
  }
  L.define('page-fam-pareja', PageFamPareja);

  /* ================= página: álbum de figuritas (Bible App for Kids: una medalla por historia) ================= */
  class PageFamAlbum extends L.Page {
    shell() { this.kid = this.kid || 'TO'; return L.shell({ title: 'Álbum de figuritas', back: '', large: false }); }
    render() {
      const f = F(), k = this.kid, a = f.album[k], n = count(k);
      return '<div class="fa-kids">' + KIDS.map(id => '<button class="fa-kid' + (id === k ? ' on' : '') + '" data-fkid="' + id + '" style="--kc:' + col(id) + '">' + fav(id, 40) + '<span><b>' + FAM[id].name + '</b><small>' + count(id) + ' de 8</small></span></button>').join('') + '</div>' +
        '<div class="fa-head" style="--kc:' + col(k) + '"><div class="fa-sum"><b>' + n + '<small> de 8</small></b><span>' + (n === 8 ? '¡Álbum completo!' : 'Faltan ' + (8 - n)) + (a.rep ? ' · ' + a.rep + (a.rep > 1 ? ' repetidas' : ' repetida') : '') + '</span></div>' +
        '<div class="fa-bar"><i style="width:' + Math.round(n / 8 * 100) + '%"></i></div></div>' +
        '<div class="fa-grid">' + FIG_IDS.map(id => {
          const G = FIG[id];
          return hasFig(k, id) ? '<button class="fa-slot on" data-ffig="' + id + '" data-a="' + G.a + '"><span class="fa-n">' + G.n + '</span>' + glyph(id) + '<b>' + esc(G.t) + '</b><small>' + esc(G.r) + '</small></button>'
            : '<button class="fa-slot" data-ffig="' + id + '"><span class="fa-n">' + G.n + '</span><span class="fa-lock">' + ic('lock-closed') + '</span><b>' + esc(G.t) + '</b><small>' + source(id).short + '</small></button>';
        }).join('') + '</div><p class="hint-swipe">' + ic('star-outline') + 'Se ganan en la mesa y con el versículo. Sin rankings.</p>';
    }
    onClick(e) {
      const t = e.target; let el;
      if ((el = t.closest('[data-fkid]'))) { if (this.kid !== el.dataset.fkid) { this.kid = el.dataset.fkid; this.update(); L.haptic(6); } return; }
      if ((el = t.closest('[data-ffig]'))) { figSheet(this.kid, el.dataset.ffig); return; }
      act(e, this);
    }
  }
  L.define('page-fam-album', PageFamAlbum);
  function figSheet(k, id) {
    const G = FIG[id], when = F().album[k].figs[id];
    if (when) {
      L.sheet('<div class="medal" data-a="' + G.a + '"><div class="coin fam-coin">' + glyph(id) + '</div><p class="eyebrow">Nº ' + G.n + ' · ' + esc(G.r) + '</p><h2>' + esc(G.t) + '</h2><p class="muted">' + esc(G.d) + '</p>' +
        '<span class="share-pill">' + fav(k, 20) + esc(FAM[k].name) + ' la ganó el ' + L.short(L.fromDk(when)) + '</span></div>');
      return;
    }
    const src = source(id), f = F();
    const btn = src.mesa != null ? '<button class="btn c" data-a="encuentro" data-fset="' + src.mesa + '">' + ic('restaurant') + (mesaIdx() === src.mesa && !doneTonight() ? 'Empezar en la mesa' : 'Hacerla esta noche') + '</button>'
      : src.verse != null && src.verse === f.verse.idx ? '<button class="btn c" data-a="meditar" data-fplay>' + ic('play') + 'Jugar el versículo</button>' : '';
    L.sheet('<div class="medal"><div class="coin off">' + ic('lock-closed') + '</div><p class="eyebrow">Nº ' + G.n + ' · por descubrir</p><h2>' + esc(G.t) + '</h2><p class="muted">' + esc(src.txt) + '</p>' + btn + '</div>', {
      mount: (el, m) => el.addEventListener('click', e => {
        const b = e.target.closest('[data-fset]');
        if (b) {
          const i = +b.dataset.fset, now = mesaIdx() === i && !doneTonight();
          m.dismiss().then(() => { if (now) { mesaFlow(); return; } F().mesa = i; L.save(); L.refresh(); L.toast('Esta noche: ' + MESAS[i].t, { icon: 'restaurant' }); });
          return;
        }
        if (e.target.closest('[data-fplay]')) m.dismiss().then(() => juego(k));
      })
    });
  }

  /* ================= pantalla completa: devocional en la mesa ================= */
  function mesaFlow() {
    if (document.querySelector('ion-modal.fam-flow')) return;
    const idx = mesaIdx(), M = MESAS[idx];
    const st = { i: 0, present: IDS.slice(), reader: 'TO', turn: 0 };
    const steps = () => ['quien', 'leer'].concat(st.present.some(isKid) ? ['chicos'] : [], st.present.some(x => !isKid(x)) ? ['grandes'] : [], ['orar']);
    const order = () => st.present.slice().sort((a, b) => FAM[a].age - FAM[b].age);
    const A = { quien: 'encuentro', leer: 'palabra', chicos: 'encuentro', grandes: 'mensaje', orar: 'oracion' };
    L.full((el, m) => {
      const paint = dir => {
        const ss = steps(), s = ss[st.i];
        let body, foot;
        const next = lbl => '<button class="btn c big" data-fn>' + lbl + '</button>';
        if (s === 'quien') {
          body = '<div class="fl-head">' + stk(M.fig, 'fm-hero', 72) + '<p class="eyebrow">En familia · 10 min</p><h1>' + esc(M.t) + '</h1><p class="fl-sub">' + esc(M.r) + '</p></div>' +
            '<p class="fam-lbl">¿Quién está en la mesa?</p><div class="to-list">' + IDS.map(id => '<button class="to' + (st.present.includes(id) ? ' on' : '') + '" data-fwho="' + id + '" style="--c:' + col(id) + '">' + fav(id, 44) + '<span>' + FAM[id].mesa + '</span><i>' + ic('checkmark') + '</i></button>').join('') + '</div>' +
            (st.present.length ? '<p class="fam-lbl">Lee en voz alta</p><div class="chips">' + st.present.map(id => '<button class="chip' + (st.reader === id ? ' on' : '') + '" data-freader="' + id + '" style="--c:' + col(id) + '">' + FAM[id].mesa + '</button>').join('') + '</div>' : '');
          foot = '<button class="btn c big" data-fn' + (st.present.length ? '' : ' disabled') + '>' + ic('flame') + 'Encender y empezar</button>';
        } else if (s === 'leer') {
          body = '<div class="fl-head"><div class="aic">' + actIc('palabra', true) + '</div><p class="eyebrow">Leer · ' + esc(M.r) + '</p><h1>' + esc(M.t) + '</h1></div>' +
            '<p class="fam-who">' + fav(st.reader, 28) + '<span>Lee <b>' + FAM[st.reader].mesa + '</b>, en voz alta</span></p>' +
            '<div class="reader">' + M.vs.map(v => '<p class="vs"><sup>' + v[0] + '</sup>' + esc(v[1]) + '</p>').join('') + '</div><p class="fl-hint small">Reina-Valera 1960</p>';
          foot = next('Seguir');
        } else if (s === 'chicos' || s === 'grandes') {
          const kids = s === 'chicos', grp = st.present.filter(x => kids === isKid(x)), who = grp.slice().sort((x, y) => FAM[x].age - FAM[y].age)[0];
          body = '<div class="fl-head">' + (kids ? stk(M.fig, 'fm-hero', 72) : '<div class="aic">' + actIc('mensaje', true) + '</div>') +
            '<p class="eyebrow">Conversar · ' + (kids ? 'para ' + names(grp) : 'para los grandes') + '</p></div><blockquote class="mv">' + esc(kids ? M.kids : M.big) + '</blockquote>' +
            '<p class="fam-who">' + fav(who, 28) + '<span>Empieza <b>' + FAM[who].mesa + '</b></span></p><div class="note">' + ic('chatbubbles-outline') + '<span>Sin respuestas correctas. Escuchen sin corregir.</span></div>';
          foot = next('Seguir');
        } else {
          const ord = order(), who = ord[st.turn], last = st.turn === ord.length - 1;
          body = '<div class="fam-turn">' + fav(who, 112) + '<p class="eyebrow">Oramos por turnos · ' + (st.turn + 1) + ' de ' + ord.length + '</p><h1>Ora ' + FAM[who].mesa + '</h1>' +
            '<p class="fam-ask">' + esc(last && ord.length > 1 ? PRAY_LAST : PRAY[who]) + '</p></div>' +
            '<div class="fam-order">' + ord.map((id, i) => '<span class="' + (i < st.turn ? 'done' : i === st.turn ? 'now' : '') + '" style="--c:' + col(id) + '">' + (i < st.turn ? ic('checkmark') : esc(L.ini(FAM[id].name))) + '</span>').join('') + '</div>';
          foot = next(last ? ic('hands-praying') + 'Amén' : 'Amén · sigue ' + FAM[ord[st.turn + 1]].mesa);
        }
        el.innerHTML = '<div class="fl-top"><div class="fl-bars">' + ss.map((x, k) => '<i data-a="' + A[x] + '" class="' + (k < st.i ? 'done' : k === st.i ? 'now' : '') + '"></i>').join('') + '</div><button class="iconbtn" data-fx aria-label="Cerrar">' + ic('close') + '</button></div>' +
          '<div class="fl-stage"><div class="fl-body" data-a="' + A[s] + '">' + body + '</div></div><div class="fl-foot" data-a="' + A[s] + '">' + foot + '</div>';
        if (dir && !L.RM()) el.querySelector('.fl-body').animate([{ transform: 'translateX(' + (dir * 40) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
      };
      el.addEventListener('click', e => {
        const t = e.target; let b;
        if (t.closest('[data-fx]')) { m.dismiss(); return; }
        if ((b = t.closest('[data-fwho]'))) {
          const id = b.dataset.fwho;
          st.present = st.present.includes(id) ? st.present.filter(x => x !== id) : IDS.filter(x => x === id || st.present.includes(x));
          if (!st.present.includes(st.reader)) st.reader = st.present.includes('TO') ? 'TO' : st.present.includes('AN') ? 'AN' : st.present[0];
          L.haptic(6); paint(0); return;
        }
        if ((b = t.closest('[data-freader]'))) { st.reader = b.dataset.freader; L.haptic(6); paint(0); return; }
        if (t.closest('[data-fn]')) {
          const ss = steps(), s = ss[st.i];
          if (s === 'orar' && st.turn < order().length - 1) { st.turn++; L.haptic(8); paint(1); return; }
          if (st.i < ss.length - 1) { st.i++; L.haptic(8); paint(1); return; }
          finishMesa(st.present, idx);
          m.dismiss();
        }
      });
      paint(0);
    }, { cls: 'flow fam-flow' });
  }
  /* lo hecho en la mesa cuenta en Hoy: marca la noche de familia si toca hoy; si no, suma un ítem del día ya hecho */
  function countPractice() {
    if (L.todayItems().some(i => i.id === NOCHE_ID)) { if (!L.isDone(NOCHE_ID)) L.setDone(NOCHE_ID, true, { quiet: true }); return; }
    const id = 'fam-mesa-' + L.tk();
    if (!L.S.routine.some(r => r.id === id)) L.S.routine.push({ id, a: 'encuentro', t: 'Devocional en la mesa', h: L.nowHM(), days: [], once: L.tk(), n: 'En familia' });
    if (!L.isDone(id)) L.setDone(id, true, { quiet: true });
  }
  function finishMesa(present, idx) {
    const f = F(), k = L.tk(), M = MESAS[idx], got = [], rep = [];
    f.nights[k] = 1; f.mesas++; f.mesaDone[k] = idx; f.mesa = idx + 1;
    present.filter(isKid).forEach(id => { const a = f.album[id]; if (a.figs[M.fig]) { a.rep++; rep.push(id); } else { a.figs[M.fig] = k; got.push(id); } });
    queue(() => winSheet({ fig: M.fig, got, rep, src: 'mesa', nights: weekNights() }));
    countPractice();
    L.save(); L.refresh();
  }

  /* ================= pantalla completa: versículo de la semana con palabras escondidas ================= */
  const strip = w => w.replace(/[.,;:]+$/, ''), tail = w => w.slice(strip(w).length);
  function juego(who) {
    if (document.querySelector('ion-modal.fam-flow')) return;
    const f = F(), V = VERSOS[f.verse.idx], words = V.t.split(' ');
    const j = { who: who || null, r: 0, b: 0, lock: false, done: false, hint: '', okAt: -1, star: false };
    L.full((el, m) => {
      const verse = (R, b) => '<p class="fj-v">' + words.map((w, i) => {
        const bi = R ? R.findIndex(x => x.i === i) : -1;
        if (bi < 0) return esc(w);
        if (bi < b) return '<span class="fj-w' + (bi === j.okAt ? ' pop' : '') + '">' + esc(strip(w)) + '</span>' + esc(tail(w));
        return '<span class="fj-blank' + (bi === b ? ' now' : '') + '" style="width:' + (strip(w).length * 0.55 + 0.7).toFixed(1) + 'em"></span>' + esc(tail(w));
      }).join(' ') + '</p>';
      const stars = n => '<div class="fj-stars">' + [0, 1, 2].map(i => '<i class="' + (i < n ? 'on' : '') + (i === n - 1 && j.star ? ' pop' : '') + '">' + ic(i < n ? 'star' : 'star-outline') + '</i>').join('') + '</div>';
      const paint = dir => {
        let body, foot;
        if (!j.who) {
          body = '<div class="fl-head"><div class="aic">' + actIc('meditar', true) + '</div><p class="eyebrow">Versículo de la semana · ' + esc(V.r) + '</p><h1>¿Quién juega?</h1><p class="fl-sub">Tres rondas. Cada vez se esconden más palabras.</p></div>' +
            '<div class="fj-kids">' + KIDS.map(k => '<button class="fj-kid" data-fkid="' + k + '" style="--kc:' + col(k) + '">' + fav(k, 64) + '<b>' + FAM[k].name + '</b><small>' + (f.verse.played[k] ? 'Ya jugó · otra vez' : FAM[k].age + ' años') + '</small></button>').join('') + '</div>' +
            '<p class="fam-prize">' + stk(V.fig, '', 34) + '<span>Premio: la figurita <b>' + esc(FIG[V.fig].t) + '</b></span></p>';
          foot = '<p class="fl-hint fj-foothint">Juegan de a uno. El resto de la familia ayuda.</p>';
        } else if (!j.done) {
          const R = V.rounds[j.r], cur = R[j.b], full = j.b >= R.length;
          body = '<p class="eyebrow fj-eye">' + fav(j.who, 26) + 'Juega ' + FAM[j.who].name + ' · ronda ' + (j.r + 1) + ' de 3</p>' + stars(j.r + (full ? 1 : 0)) + verse(R, j.b) +
            '<p class="fj-hint">' + esc(j.hint || '¿Qué palabra falta?') + '</p>';
          foot = '<div class="fj-opts">' + (cur ? cur.o : V.rounds[j.r][R.length - 1].o).map(w => '<button class="fj-opt" data-fo="' + esc(w) + '"' + (full ? ' disabled' : '') + '>' + esc(w) + '</button>').join('') + '</div>';
        } else {
          body = '<div class="fj-end">' + stars(3) + '<h1>¡De memoria!</h1><p class="fj-v done">«' + esc(V.t) + '»</p><p class="fj-ref">' + esc(V.r) + '</p><div class="note">' + ic('people-outline') + '<span>Ahora díganlo todos juntos, en voz alta.</span></div></div>';
          foot = '<button class="btn c big" data-fwin>' + ic('star') + 'Recibir la figurita</button>';
        }
        el.innerHTML = '<div class="fl-top"><div class="fl-bars">' + [0, 1, 2].map(i => '<i data-a="meditar" class="' + (j.done || i < j.r ? 'done' : j.who && i === j.r ? 'now' : '') + '"></i>').join('') + '</div><button class="iconbtn" data-fx aria-label="Cerrar">' + ic('close') + '</button></div>' +
          '<div class="fl-stage"><div class="fl-body fj" data-a="meditar">' + body + '</div></div><div class="fl-foot" data-a="meditar">' + foot + '</div>';
        if (dir && !L.RM()) el.querySelector('.fl-body').animate([{ transform: 'translateX(' + (dir * 40) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
        j.okAt = -1; j.star = false;
      };
      el.addEventListener('click', e => {
        const t = e.target; let b;
        if (t.closest('[data-fx]')) { m.dismiss(); return; }
        if ((b = t.closest('[data-fkid]'))) { j.who = b.dataset.fkid; L.haptic(8); paint(1); return; }
        if ((b = t.closest('[data-fo]'))) {
          if (j.lock || b.disabled) return;
          const R = V.rounds[j.r], cur = R[j.b];
          if (b.dataset.fo === strip(words[cur.i])) {
            j.okAt = j.b; j.b++; L.haptic(10);
            if (j.b >= R.length) {
              j.lock = true; j.star = true; j.hint = j.r < 2 ? '¡Ronda completa! Ahora se esconden más.' : '¡Lo sabe de memoria!';
              paint(0);
              L.sparks(el.querySelector('.fj-stars i.pop'), 14);
              setTimeout(() => { j.lock = false; j.r++; j.b = 0; j.hint = ''; if (j.r >= 3) j.done = true; paint(1); if (j.done) L.sparks(el.querySelector('.fj-stars'), 18); }, 950);
              return;
            }
            j.hint = '¡Eso! ¿Y la que sigue?';
            paint(0);
          } else {
            b.disabled = true; b.classList.add('miss'); L.haptic([20]);
            if (!L.RM()) b.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 260 });
            const h = el.querySelector('.fj-hint'); if (h) h.textContent = 'Casi. Prueba otra.';
          }
          return;
        }
        if (t.closest('[data-fwin]')) { finishJuego(j.who, V); m.dismiss(); }
      });
      paint(0);
    }, { cls: 'flow fam-flow' });
  }
  function finishJuego(who, V) {
    const f = F(), a = f.album[who], had = !!a.figs[V.fig];
    if (had) a.rep++; else a.figs[V.fig] = L.tk();
    f.verse.played[who] = L.tk();
    queue(() => winSheet({ fig: V.fig, got: had ? [] : [who], rep: had ? [who] : [], src: 'verse', next: KIDS.find(x => x !== who && !F().verse.played[x]) }));
    L.save(); L.refresh();
  }

  /* ================= registro en Personas ================= */
  L.pseg.familia = {
    render(page) { page._famIn = !(page.pg && page.pg.querySelector('.fam')); return segHTML(); },
    after(page) {
      if (page._famIn) { page._famIn = false; L.stagger(page.pg.querySelector('.fam')); }
      applyFx(page.pg);
    },
    /* el punto en la pestaña solo por algo que te llegó: Ana respondió la pregunta de hoy y tú todavía no */
    badge: () => !F().ans[L.tk()],
    click: (e, page) => act(e, page)
  };

  /* ================= tarjeta de contexto en Hoy: desde la tarde, si esta noche todavía no se hizo ================= */
  L.ctxCard({
    id: 'familia',
    pri: () => {
      if (doneTonight() || nightOn(L.tk())) return 0;
      const h = new Date().getHours();
      if (nocheToday() && h >= 17) return 2.5;
      return h >= 18 ? 2.2 : 0;
    },
    html: () => {
      const M = MESAS[mesaIdx()], win = KIDS.filter(k => !hasFig(k, M.fig));
      return '<div class="ctxc fam-ctx" data-a="encuentro"><div class="ctxc-top">' + stk(M.fig, '', 44) + '<div><p class="eyebrow">' + (nocheToday() ? 'Hoy es noche de familia' : 'Esta noche en la mesa') + ' · 10 min</p><b>' + esc(M.t) + '</b></div></div>' +
        '<p class="muted">Leer, conversar y orar por turnos.' + (win.length ? ' ' + names(win) + (win.length > 1 ? ' ganan' : ' gana') + ' una figurita.' : '') + '</p>' +
        '<button class="btn c sm" data-ctx="familia">' + ic('restaurant') + 'Empezar en la mesa</button></div>';
    },
    click: () => mesaFlow()
  });

  window.Familia = { mesa: mesaFlow, juego, F };
})();
