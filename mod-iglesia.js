/* Lámpara · mod-iglesia.js — foro de la iglesia «El Buen Pastor» (dueño: agente Iglesia).
   Personas → Iglesia: canales, hilos a pantalla completa, publicar, grupos, eventos y servicio.
   Hoy: UNA tarjeta compacta (una petición para orar hoy o el próximo evento).
   Estado en Lampara.mstate('iglesia'): clonable, entra en deshacer y reiniciar.
   Acciones con prefijo data-i-*; clases con prefijo ig-. Decisiones en CAMBIOS-iglesia.md. */
(function (L) {
  'use strict';
  if (!L || !L.register) return;

  const ID = 'iglesia';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => L.esc(s == null ? '' : s);
  const trim = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/[\s,;.:]+\S*$/, '') + '…' : s);
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  /* ---------------------------------------------------------------
     Iconos propios (mismo trazo que los del núcleo)
     --------------------------------------------------------------- */
  const IP = {
    church: '<path d="M10 9h4"/><path d="M12 7v5"/><path d="M14 22v-4a2 2 0 0 0-4 0v4"/><path d="M18 22V5.6a1 1 0 0 0-.55-.9l-4.56-2.27a2 2 0 0 0-1.78 0L6.55 4.7a1 1 0 0 0-.55.9V22"/><path d="m18 7 3.45 1.72a1 1 0 0 1 .55.9V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.62a1 1 0 0 1 .55-.9L6 7"/>',
    mega: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    ask: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M9.6 9.2a2.5 2.5 0 0 1 4.9.8c0 1.7-2.5 2.3-2.5 2.3"/><path d="M12 15.8h.01"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2.5"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v2"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    pin: '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    veil: '<path d="M9.9 9.9a3 3 0 1 0 4.2 4.2"/><path d="M10.7 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a13 13 0 0 1-1.7 2.7"/><path d="M6.6 6.6A13.5 13.5 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="m2 2 20 20"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    mute: '<path d="M8.7 3A6 6 0 0 1 18 8a21 21 0 0 0 .6 5"/><path d="M17 17H3s3-2 3-9a4.7 4.7 0 0 1 .3-1.7"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="m2 2 20 20"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    place: '<path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="m5.7 5.7 12.6 12.6"/>'
  };
  const ico = (n, c) => IP[n]
    ? '<svg class="' + (c || 'i') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IP[n] + '</svg>'
    : L.ic(n, c);

  /* ---------------------------------------------------------------
     La iglesia: canales, miembros, grupos
     --------------------------------------------------------------- */
  const CH = [
    { id: 'anuncios', n: 'Anuncios', a: 'mensaje', i: 'mega', d: 'De los pastores' },
    { id: 'oracion', n: 'Oración', a: 'oracion', i: 'oracion', d: 'Ora y avisa que oras' },
    { id: 'testimonios', n: 'Testimonios', a: 'adoracion', i: 'grace', d: 'Lo que Dios hizo' },
    { id: 'preguntas', n: 'Preguntas', a: 'palabra', i: 'ask', d: 'Biblia y vida · responden los pastores' },
    { id: 'grupos', n: 'Grupos', a: 'encuentro', i: 'people', d: 'Células durante la semana' },
    { id: 'eventos', n: 'Eventos', a: 'diario', i: 'cal', d: 'Anótate y va a tu semana' },
    { id: 'servicio', n: 'Servicio', a: 'ayuno', i: 'hand', d: 'Manos para servir' }
  ];
  const CHM = {}; CH.forEach(c => { CHM[c.id] = c; });

  /* 23 miembros + Juan Carlos. Pastores: Esteban (líder de JC) y Lidia. */
  const M = {
    ER: { n: 'Esteban Rojas', f: 'Esteban', role: 'Pastor' },
    LR: { n: 'Lidia Rojas', f: 'Lidia', role: 'Pastora' },
    MD: { n: 'Matías Duarte', f: 'Matías' },
    LM: { n: 'Laura Méndez', f: 'Laura' },
    RG: { n: 'Raúl González', f: 'Raúl' },
    DM: { n: 'Diego Martínez', f: 'Diego' },
    MC: { n: 'Marcos Cabrera', f: 'Marcos' },
    PB: { n: 'Pedro Báez', f: 'Pedro' },
    AG: { n: 'Ana Giménez', f: 'Ana' },
    TS: { n: 'Tomás Sosa', f: 'Tomás' },
    MA: { n: 'María Aguilar', f: 'María' },
    DV: { n: 'Daniel Vera', f: 'Daniel' },
    SR: { n: 'Sofía Ramírez', f: 'Sofía' },
    LO: { n: 'Lucas Ortega', f: 'Lucas' },
    CV: { n: 'Carmen Villalba', f: 'Carmen' },
    NA: { n: 'Nilda Aquino', f: 'Nilda' },
    HO: { n: 'Hugo Ortiz', f: 'Hugo' },
    RO: { n: 'Rosa Ortiz', f: 'Rosa' },
    FC: { n: 'Fernanda Cáceres', f: 'Fernanda' },
    GA: { n: 'Gustavo Ayala', f: 'Gustavo' },
    BN: { n: 'Blanca Núñez', f: 'Blanca' },
    JF: { n: 'José Franco', f: 'José' },
    VI: { n: 'Valeria Insfrán', f: 'Valeria' }
  };
  const GR = [
    { id: 'hombres', n: 'Grupo de hombres', dow: 4, h: '19:00', place: 'Casa de Raúl · Sajonia', lead: 'JC', now: 'Romanos 8', mem: ['JC', 'RG', 'DM', 'MC', 'PB', 'DV', 'LO', 'JF'] },
    { id: 'jovenes', n: 'Jóvenes', dow: 6, h: '18:30', place: 'Templo · Sajonia', lead: 'MD', now: 'Daniel: firmes en Babilonia', mem: ['MD', 'FC', 'TS', 'SR', 'GA', 'VI'] },
    { id: 'matrimonios', n: 'Matrimonios', dow: 5, h: '20:00', place: 'Casa de Hugo y Rosa · Villa Morra', lead: 'HO', now: 'Efesios 5', every: 'cada 15 días', mem: ['HO', 'RO', 'DM', 'AG', 'PB'] },
    { id: 'mujeres', n: 'Mujeres', dow: 2, h: '09:00', place: 'Templo · Sajonia', lead: 'LM', now: 'El libro de Rut', mem: ['LM', 'LR', 'CV', 'NA', 'BN', 'MA', 'AG'] }
  ];
  const GRM = {}; GR.forEach(g => { GRM[g.id] = g; });

  const RX = { amen: ['Amén', 'check'], gracias: ['Gracias', 'star'], gloria: ['¡Gloria a Dios!', 'grace'] };
  const CHRX = { anuncios: ['amen', 'gracias'], testimonios: ['gloria', 'amen'], preguntas: ['gracias'], grupos: ['amen'] };
  const COMPOSE = { oracion: '¿Por qué podemos orar?', testimonios: '¿Qué hizo Dios?', preguntas: '¿Qué te preguntas?' };
  const COPTS = [
    { k: 'oracion', ch: 'oracion', n: 'Oración', a: 'oracion', i: 'oracion', ph: '¿Por qué podemos orar?', anon: true },
    { k: 'testimonios', ch: 'testimonios', n: 'Testimonio', a: 'adoracion', i: 'grace', ph: '¿Qué hizo Dios?' },
    { k: 'preguntas', ch: 'preguntas', n: 'Pregunta', a: 'palabra', i: 'ask', ph: 'Sobre la Biblia o la vida', anon: true },
    { k: 'g:hombres', ch: 'grupos', grp: 'hombres', n: 'Hombres', a: 'encuentro', i: 'people', ph: 'Escribe al grupo' }
  ];
  /* datos sensibles de terceros: aviso suave, no bloquea */
  const SENS = /\d{3}[\s.-]?\d{3}[\s.-]?\d{3,4}|@[\w-]+\.\w|hospital|sanatorio|cl[ií]nica|diagn[oó]stic|c[aá]ncer|\bvih\b|c[eé]dula|direcci[oó]n/i;
  /* lo que llega en los días siguientes («Día siguiente» en el panel) */
  const POOL = [
    ['oracion', 'GA', '06:50', 'Por mi familia: nos mudamos el sábado y hay mucho cansancio.', { n: 8, hoy: true, thx: 'Gracias, hermano. Ya casi terminamos de embalar.' }],
    ['testimonios', 'MC', '18:20', '¡Me llamaron de la entrevista! Empiezo el lunes. Gracias a todos los que oraron.', { link: 'Entrevista de trabajo', rx: { gloria: 31, amen: 9 } }],
    ['anuncios', 'ER', '08:00', 'Gracias por un domingo hermoso. La colecta de abrigos ya llenó dos cajas.', { rx: { amen: 26, gracias: 17 } }],
    ['preguntas', 'PB', '21:40', '¿Cómo oro por alguien que no quiere saber nada de Dios?', { rx: { gracias: 4 } }]
  ];

  /* ---------------------------------------------------------------
     Fechas
     --------------------------------------------------------------- */
  const dk = d => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  const fromDk = s => { const p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
  const mid = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = d => Math.round((mid(d) - mid(L.date)) / 864e5);
  const todayK = () => dk(L.date);
  const nextDow = dow => L.addDays(mid(L.date), (dow - L.date.getDay() + 7) % 7);
  const weekEnd = () => L.addDays(mid(L.date), 6 - L.date.getDay());
  const inWeek = d => dayDiff(d) >= 0 && mid(d) <= weekEnd();
  function when(day, h) {
    const d = fromDk(day), n = dayDiff(d);
    if (n === 0) return h || 'ahora';
    if (n === -1) return 'ayer';
    if (n < 0 && n > -7) return L.DS[d.getDay()].toLowerCase();
    return L.short(d);
  }
  function evLabel(d) {
    const n = dayDiff(d);
    return n === 0 ? 'Hoy' : n === 1 ? 'Mañana' : n > 1 && n < 7 ? L.cap(L.DN[d.getDay()]) : L.DS[d.getDay()] + ' ' + L.short(d);
  }
  const evPhrase = d => { const n = dayDiff(d); return n === 0 ? 'hoy' : n === 1 ? 'mañana' : 'el ' + L.DN[d.getDay()]; };

  /* ---------------------------------------------------------------
     Estado del módulo (dentro de state.mods: deshacer y reiniciar lo cubren)
     --------------------------------------------------------------- */
  function seed() {
    const D = n => dk(L.addDays(L.date, n));
    let k = 1;
    const P = (ch, by, ago, h, t, x) => Object.assign({ id: 's' + (k++), ch, by, day: D(-ago), h, t, rx: {}, my: {}, re: [] }, x || {});
    const R = (by, ago, h, t, x) => Object.assign({ id: 's' + (k++), by, day: D(-ago), h, t, rx: {}, my: {} }, x || {});
    const posts = [
      P('anuncios', 'ER', 0, '07:30', 'Este domingo celebramos la Santa Cena. Llega diez minutos antes: empezamos orando juntos.', { pin: true, u: true, rx: { amen: 38 },
        re: [R('CV', 0, '08:02', '¡Amén! Ahí estaremos.', { rx: { amen: 3 } }), R('GA', 0, '08:40', 'El sonido queda listo el sábado.')] }),
      P('anuncios', 'ER', 2, '19:10', '21 días por Asunción: esta semana oramos por Chacarita y Barrio Obrero. El plan está en Mi camino.', { rx: { amen: 22, gracias: 9 } }),
      P('anuncios', 'LR', 4, '10:05', 'Colecta de abrigos para el invierno: déjalos en la entrada del templo hasta el 31 de mayo.', { rx: { amen: 15, gracias: 12 } }),

      P('oracion', 'JF', 0, '06:40', 'Por mi nieto, que se opera el viernes. Que todo salga bien y que sienta la paz de Dios.', { n: 24, hoy: true,
        thx: 'Gracias, Juan Carlos. Mi nieto ya está más tranquilo.', mod: 'Los pastores quitaron el nombre del hospital para cuidar su privacidad.',
        re: [R('LM', 0, '07:05', 'Orando, don José. Su nieto está en las manos de Dios.', { rx: { amen: 6 } })] }),
      P('oracion', 'BN', 0, '05:55', 'El sábado se cumple un año de la partida de mi esposo. Oren por consuelo para mí y mis hijos.', { n: 42, hoy: true, u: true,
        thx: 'Gracias por acordarte de nosotros. Dios te bendiga.',
        re: [R('LR', 0, '06:30', 'Blanca, el sábado paso a visitarte. Te queremos mucho.', { rx: { amen: 11 } }), R('CV', 0, '07:12', 'Te abrazo, hermana.', { rx: { amen: 4 } })] }),
      P('oracion', null, 1, '23:10', 'Estoy pasando una temporada de mucha ansiedad. Pido oración por paz y por poder descansar.', { anon: true, n: 31, hoy: true,
        thxBy: 'ER', thx: 'Gracias por orar. Le conté que la iglesia está orando.',
        re: [R('ER', 0, '06:15', 'Gracias por animarte a pedir. Filipenses 4:6–7 es para ti hoy. Si quieres conversar, escríbeme.', { rx: { amen: 9 } })] }),
      P('oracion', 'LO', 1, '21:00', 'Quiero bautizarme el 24. Oren para que mi familia lo entienda.', { n: 29, u: true,
        thx: 'Gracias. Ayer mi mamá me preguntó a qué hora es el bautismo.',
        re: [R('ER', 1, '21:30', '¡Qué alegría, Lucas! Oramos por tu familia y te acompañamos.', { rx: { amen: 14 } })] }),
      P('oracion', 'MC', 2, '13:20', 'El lunes tengo una entrevista de trabajo. Hace cuatro meses que busco.', { n: 17, thx: 'Gracias, hermano. El lunes te cuento cómo me fue.' }),
      P('oracion', null, 3, '22:45', 'Por mi matrimonio. Empezamos consejería con los pastores: oren por humildad para los dos.', { anon: true, n: 19,
        thxBy: 'LR', thx: 'Gracias por sostener a este matrimonio en oración.' }),
      P('oracion', 'AG', 6, '18:00', 'Por la escuelita de Chacarita: que este sábado lleguen más chicos.', { n: 36, ans: { t: 'Vinieron 23 chicos. ¡Gracias por orar!', day: D(-2) } }),

      P('testimonios', 'FC', 0, '09:15', 'Volvimos del campamento: nueve chicos se bautizan el 24. ¡Gracias por cada oración y cada empanada vendida!', { u: true, rx: { gloria: 64, amen: 20 },
        re: [R('MD', 0, '09:40', '¡Gloria a Dios! Qué semana.', { rx: { amen: 8 } })] }),
      P('testimonios', 'DV', 2, '20:30', 'Primera semana en el trabajo nuevo. La ansiedad no se fue de golpe, pero Filipenses 4:6 me sostiene cada mañana. Gracias a los que oraron.', { link: 'Paz en medio de la ansiedad', rx: { gloria: 27, amen: 11 } }),
      P('testimonios', 'CV', 5, '17:00', 'Hace un mes les pedí oración por mis estudios. El médico dijo que está todo bien. ¡Dios es fiel!', { link: 'Mis estudios médicos', rx: { gloria: 52, amen: 18 },
        re: [R('NA', 5, '17:30', '¡Gloria a Dios, Carmen!'), R('LR', 5, '18:05', 'Lo celebramos el domingo.', { rx: { amen: 6 } })] }),

      P('preguntas', 'TS', 1, '22:10', '¿Cómo sé si es Dios quien me habla o son mis propias ideas?', { rx: { gracias: 14 },
        re: [R('ER', 0, '07:50', 'Tres preguntas ayudan: ¿concuerda con la Biblia? ¿Te acerca a Jesús y a los demás? ¿Lo confirman hermanos maduros? Lo que viene de Dios se sostiene en el tiempo.', { ans: true, rx: { gracias: 16 } }),
          R('LM', 0, '08:30', 'A mí me ayuda escribirlo y orar una semana antes de decidir.', { rx: { amen: 5 } })] }),
      P('preguntas', null, 3, '23:30', '¿Está mal enojarme con Dios?', { anon: true, rx: { gracias: 21 },
        re: [R('LR', 2, '09:00', 'No es pecado decirle lo que sientes: los Salmos están llenos de eso (mira el Salmo 13). Lo que sana es seguir hablándole. Si quieres, conversamos.', { ans: true, rx: { gracias: 25 } })] }),
      P('preguntas', 'SR', 4, '16:40', '¿Por dónde empiezo a leer los Salmos? Me pierdo.', { rx: { gracias: 8 },
        re: [R('FC', 4, '17:05', 'Yo empecé con el 23, 27, 46 y 91. Uno por día.', { rx: { amen: 3 } }),
          R('ER', 3, '08:00', 'Hay un plan de 30 días en Mi camino → Planes: cinco salmos y un versículo para llevar.', { ans: true, rx: { gracias: 6 } })] }),

      P('grupos', 'RG', 1, '20:15', 'Mañana nos juntamos en casa. Traigan su Biblia; el tereré corre por mi cuenta.', { grp: 'hombres', rx: { amen: 6 },
        re: [R('PB', 1, '20:40', 'Ahí estaré.'), R('LO', 1, '21:02', 'Llevo chipa.', { rx: { amen: 4 } })] }),
      P('grupos', 'JC', 3, '07:00', 'Para el jueves: lean Romanos 8 y traigan un versículo que les haya hablado.', { grp: 'hombres', rx: { amen: 7 } }),

      P('eventos', 'ER', 6, '10:00', 'Culto dominical', { ev: { a: 'adoracion', dow: 0, h: '10:00', place: 'Templo · Sajonia', note: 'Este domingo celebramos la Santa Cena.' }, my: { go: true } }),
      P('eventos', 'LM', 3, '09:00', 'Vigilia de oración', { ev: { a: 'oracion', date: D(1), h: '22:00', place: 'Templo · Sajonia', note: 'Hasta la medianoche. Trae abrigo y tu Biblia.', n: 26 } }),
      P('eventos', 'ER', 5, '18:30', 'Retiro de hombres «Hierro con hierro»', { ev: { a: 'encuentro', date: D(9), h: '07:00', place: 'Ypacaraí', note: 'Proverbios 27:17. Un sábado entero para afilarnos.', cap: 40, n: 31 },
        re: [R('PB', 2, '19:00', '¿Salimos juntos desde el templo?'), R('ER', 2, '19:20', 'Sí: 6:30 desde el templo. Hay lugar en dos autos.', { rx: { amen: 5 } })] }),
      P('eventos', 'ER', 1, '11:00', 'Bautismos', { ev: { a: 'adoracion', date: D(17), h: '10:00', place: 'Templo · Sajonia', note: 'En el culto. Doce hermanos se bautizan.' } }),

      P('servicio', 'AG', 1, '12:00', 'Limpieza del templo', { sv: { date: D(2), h: '08:00', place: 'Templo', need: 6, vol: ['NA', 'GA', 'VI'] } }),
      P('servicio', 'NA', 1, '15:30', 'Cocina para el almuerzo del domingo', { sv: { date: D(3), h: '08:30', place: 'Templo', need: 4, vol: ['NA', 'RO'] } }),
      P('servicio', 'LR', 2, '11:00', 'Llevar a una hermana mayor al culto', { sv: { date: D(3), h: '09:15', place: 'Lambaré', need: 1, vol: [], priv: true } }),
      P('servicio', 'AG', 4, '09:00', 'Maestros para la escuelita de Chacarita', { sv: { date: D(2), h: '15:00', place: 'Chacarita', need: 3, vol: ['AG'], note: 'Niños de 6 a 9 años.' } })
    ];
    return { v: 1, chan: 'anuncios', posts, groups: {}, muted: [], hidden: [], normsOk: false, reminded: null, day: 0, nextId: 1 };
  }
  const st = () => L.mstate(ID, seed);
  const find = id => st().posts.find(p => p.id === id);

  /* memoria de interfaz (no es estado: no entra en deshacer) */
  let nav = [], gen = 0, chipSL = 0, pendingOpen = null, justPosted = null;
  const seen = new Set(), revealed = new Set(), timers = new Set();
  function later(ms, fn) {
    const g = gen;
    const t = setTimeout(() => { timers.delete(t); if (g === gen) { try { fn(); } catch (err) { console.error(err); } } }, L.RM() ? Math.min(ms, 1800) : ms);
    timers.add(t); return t;
  }
  function cancel(t) { if (!t || !timers.has(t)) return false; clearTimeout(t); timers.delete(t); return true; }
  /* avisos con calma: nunca dos encima (al menos 5 s entre uno y otro) */
  let nextWarm = 0;
  function warm(ms, fn) {
    const now = Date.now(), at = Math.max(now + ms, nextWarm);
    nextWarm = at + 5200;
    return later(at - now, fn);
  }

  /* ---------------------------------------------------------------
     Quién ve qué
     --------------------------------------------------------------- */
  const isPastor = id => !!(M[id] && M[id].role);
  const inGroup = gid => { const g = GRM[gid]; return !!g && (g.mem.includes('JC') || st().groups[gid] === 'si'); };
  const members = g => g.mem.concat(st().groups[g.id] === 'si' && !g.mem.includes('JC') ? ['JC'] : []);
  const visible = p => !p.grp || inGroup(p.grp);
  const isHidden = x => st().hidden.includes(x.id);
  const isMuted = x => !!x.by && !x.anon && st().muted.includes(x.by) && !revealed.has(x.id);
  const aOf = p => (p.grp ? 'encuentro' : CHM[p.ch].a);
  function nm(id) {
    if (id === 'JC') return 'Tú';
    const m = M[id]; if (!m) return id;
    if (m.role) return m.n;
    const w = m.n.split(' '); return w[0] + ' ' + w[w.length - 1][0] + '.';
  }
  const callName = id => (M[id] ? (M[id].role ? M[id].role + ' ' + M[id].f : M[id].f) : id);
  function anyUnread() { const S = st(); return S.posts.some(p => p.u && visible(p) && !S.hidden.includes(p.id)); }
  function syncBadge() { try { L.setBadge(ID, anyUnread()); } catch (err) { console.error(err); } }

  /* ---------------------------------------------------------------
     Piezas
     --------------------------------------------------------------- */
  function av(id, size) {
    const s = ' style="--s:' + size + 'px" aria-hidden="true"';
    if (!id) return '<span class="ig-av anon"' + s + '>' + ico('veil') + '</span>';
    const past = isPastor(id);
    return '<span class="ig-av' + (past ? ' past' : '') + (id === 'JC' ? ' me' : '') + '"' + s + '>' + id + (past ? '<i>' + L.ic('star', 'i fillc') + '</i>' : '') + '</span>';
  }
  function byLine(x, size, p) {
    const anon = x.anon || !x.by;
    const name = anon ? (x.by === 'JC' ? 'Anónimo · tú' : 'Anónimo') : nm(x.by);
    let role = '';
    if (!anon && isPastor(x.by)) role = '<span class="ig-role">' + M[x.by].role + '</span>';
    else if (!anon && p && p.grp && GRM[p.grp].lead === x.by) role = '<span class="ig-role lead">Líder</span>';
    const nw = seen.has(x.id) ? '<span class="ig-new">Nuevo</span>' : '';
    return '<div class="ig-by">' + av(anon ? null : x.by, size) + '<span class="ig-who"><b>' + esc(name) + '</b>' + role + '<small>' + when(x.day, x.h) + '</small>' + nw + '</span></div>';
  }
  const openBtn = (p, label) => '<button class="ig-open" type="button" data-i-open="' + p.id + '" aria-label="' + esc(label || 'Abrir: ' + trim(p.t, 60)) + '"></button>';
  /* en lo tuyo no hay botón: ves cuántos oran contigo */
  const prayingPill = p => '<span class="ig-praying" data-a="oracion" data-i-count="' + p.id + '">' + L.ic('oracion') + '<b class="n odo">' + p.n + '</b> orando contigo</span>';
  function prayBtn(p, src) {
    if (p.by === 'JC') return prayingPill(p);
    const t = p.prayedOn === todayK();
    return '<button class="heartbtn ig-pray' + (t ? ' hit' : '') + '" type="button" data-a="oracion" data-i-pray="' + p.id + '"' + (src ? ' data-i-src="' + src + '"' : '') +
      ' aria-pressed="' + t + '" aria-label="' + (t ? 'Oraste hoy' : 'Estoy orando') + ', ' + p.n + ' orando">' + L.ic('oracion') +
      '<span>' + (t ? 'Orando' : 'Estoy orando') + '</span><span class="n odo">' + p.n + '</span></button>';
  }
  function prayBig(p) {
    if (p.by === 'JC') return '<div class="ig-praymine">' + prayingPill(p) + '</div>';
    const t = p.prayedOn === todayK();
    return '<button class="ig-praybig' + (t ? ' hit' : '') + '" type="button" data-i-pray="' + p.id + '" aria-pressed="' + t + '">' + L.ic('oracion') +
      '<span>' + (t ? 'Orando hoy' : 'Estoy orando') + '</span><span class="ig-pc"><b class="n odo">' + p.n + '</b> orando</span></button>';
  }
  function rxBtn(p, k, r) {
    const x = r || p, on = !!x.my[k], n = x.rx[k] || 0;
    return '<button class="ig-rx" type="button" data-i-rx="' + k + '" data-i-id="' + p.id + '"' + (r ? ' data-i-re="' + r.id + '"' : '') + ' aria-pressed="' + on + '">' +
      ico(RX[k][1]) + RX[k][0] + '<span class="n odo">' + (n || '') + '</span></button>';
  }
  function rxKeys(p) {
    if (p.ch === 'oracion') return p.ans ? ['gloria', 'amen'] : [];
    return CHRX[p.grp ? 'grupos' : p.ch] || ['amen'];
  }
  function replyCount(p) {
    const n = p.re.filter(r => !isHidden(r)).length;
    return n ? '<span class="ig-rc">' + L.ic('mensaje') + n + '<span class="sr-only"> respuestas</span></span>' : '';
  }
  const linkTag = t => '<span class="ig-tag" data-a="oracion">' + L.ic('oracion') + '<span>Nació de una oración · «' + esc(trim(t, 38)) + '»</span></span>';
  const ansTag = a => '<span class="ig-tag ans">' + L.ic('star', 'i fillc') + '<span>Dios respondió' + (a.t && a.t !== 'Dios respondió' ? ' · ' + esc(a.t) : '') + '</span></span>';
  const modNote = t => '<p class="ig-mod">' + ico('shield') + esc(t) + '</p>';
  const dateTile = d => '<span class="ig-date"><small>' + L.DS[d.getDay()] + '</small><b>' + d.getDate() + '</b></span>';
  const meta = (d, h, place, extra) => '<p class="ig-meta"><span>' + ico('clock') + evLabel(d) + ' ' + h + (extra || '') + '</span><span>' + ico('place') + esc(place) + '</span></p>';
  const empty = t => '<p class="ig-empty">' + (t || 'Todavía nada por aquí.') + '</p>';
  function swap(el, html) {
    const tmp = document.createElement('div'); tmp.innerHTML = html;
    const n = tmp.firstElementChild, focused = document.activeElement === el;
    el.replaceWith(n); if (focused) n.focus({ preventScroll: true });
    return n;
  }

  /* ---------------------------------------------------------------
     Tarjetas del canal
     --------------------------------------------------------------- */
  function postCard(p) {
    if (isHidden(p)) return '<p class="ig-gone">' + ico('flag') + 'Reportaste esto · lo revisan los pastores</p>';
    if (isMuted(p)) return '<button class="ig-gone" type="button" data-i-reveal="' + p.id + '">' + ico('mute') + 'De alguien que silenciaste · Ver</button>';
    let h = '<article class="ig-card ig-post' + (p.pin ? ' pin' : '') + (p.id === justPosted ? ' ig-just' : '') + '" data-a="' + aOf(p) + '">' + openBtn(p);
    if (p.pin) h += '<p class="ig-pinned">' + ico('pin') + 'Fijado</p>';
    h += byLine(p, 32, p) + '<p class="ig-t">' + esc(p.t) + '</p>';
    if (p.link) h += linkTag(p.link);
    if (p.ans) h += ansTag(p.ans);
    if (p.ch === 'preguntas') {
      const a = p.re.find(r => r.ans && !isHidden(r));
      if (a) h += '<div class="ig-apv"><small>' + L.ic('star', 'i fillc') + 'Responde ' + (M[a.by].role === 'Pastora' ? 'la pastora ' : 'el pastor ') + M[a.by].f + '</small><p>' + esc(a.t) + '</p></div>';
    }
    const acts = (p.ch === 'oracion' && !p.ans ? prayBtn(p) : '') + rxKeys(p).map(k => rxBtn(p, k)).join('');
    h += '<div class="ig-acts">' + acts + replyCount(p) + '</div></article>';
    return h;
  }
  function goBtn(p, big) {
    const on = !!p.my.go, full = !!(p.ev.cap && p.ev.n >= p.ev.cap && !on);
    return '<button class="ig-go' + (big ? ' big' : '') + '" type="button" data-i-go="' + p.id + '" aria-pressed="' + on + '"' + (full ? ' disabled' : '') + '>' +
      (on ? L.ic('check') + 'Vas' : full ? 'Completo' : 'Voy') + '</button>';
  }
  function cupo(n, cap, word) {
    const left = Math.max(0, cap - n);
    return '<div class="ig-cupo"><div class="pbar"><i style="width:' + Math.min(100, n / cap * 100).toFixed(1) + '%"></i></div><small>' + (left ? word + ' ' + left : 'Completo') + '</small></div>';
  }
  function evCard(p) {
    if (isHidden(p)) return '';
    const e = p.ev, d = evDate(p);
    return '<article class="ig-card ig-ev" data-a="diario">' + openBtn(p, 'Abrir: ' + p.t) + dateTile(d) +
      '<div class="ig-evx"><b>' + esc(p.t) + '</b>' + meta(d, e.h, e.place) + (e.note ? '<p class="ig-note">' + esc(e.note) + '</p>' : '') +
      (e.cap ? cupo(e.n, e.cap, 'Quedan') : '') +
      '<div class="ig-evrow"><span class="ig-goes">' + (!e.cap && e.n != null ? e.n + ' van' : e.dow != null ? 'Cada ' + L.DN[e.dow] : '') + '</span>' + goBtn(p) + '</div></div></article>';
  }
  function sumoBtn(p, big) {
    const s = p.sv, mine = s.vol.includes('JC'), full = s.vol.length >= s.need && !mine;
    return '<button class="ig-go' + (big ? ' big' : '') + '" type="button" data-i-sumo="' + p.id + '" aria-pressed="' + mine + '"' + (full ? ' disabled' : '') + '>' +
      (mine ? L.ic('check') + 'Te sumaste' : full ? 'Completo' : 'Me sumo') + '</button>';
  }
  function svCard(p) {
    if (isHidden(p)) return '';
    const s = p.sv, d = svDate(p);
    return '<article class="ig-card ig-ev" data-a="ayuno">' + openBtn(p, 'Abrir: ' + p.t) + dateTile(d) +
      '<div class="ig-evx"><b>' + esc(p.t) + '</b>' + meta(d, s.h, s.place) + (s.note ? '<p class="ig-note">' + esc(s.note) + '</p>' : '') +
      cupo(s.vol.length, s.need, 'Faltan') +
      '<div class="ig-evrow"><span class="ig-goes">' + (s.priv ? ico('lock') + 'Detalles en privado' : '') + '</span>' + sumoBtn(p) + '</div></div></article>';
  }
  function groupTag(g) {
    const S = st();
    return g.lead === 'JC' ? '<span class="ig-role lead">Lideras</span>' : inGroup(g.id) ? '<span class="ig-role lead">Eres parte</span>' : S.groups[g.id] === 'pedido' ? '<span class="ig-role lead">Pedido enviado</span>' : '';
  }
  function groupCard(g) {
    const mem = members(g);
    return '<article class="ig-card ig-grp" data-a="encuentro"><button class="ig-open" type="button" data-i-group="' + g.id + '" aria-label="Abrir ' + esc(g.n) + '"></button>' +
      '<span class="ig-gi">' + L.ic('people') + '</span><div class="ig-evx"><b>' + esc(g.n) + '</b>' +
      '<p class="ig-meta"><span>' + ico('clock') + L.DS[g.dow] + ' ' + g.h + (g.every ? ' · ' + g.every : '') + '</span><span>' + ico('place') + esc(g.place.split(' · ')[0]) + '</span></p>' +
      '<div class="ig-evrow"><span class="ig-avs">' + mem.slice(0, 5).map(id => av(id, 26)).join('') + (mem.length > 5 ? '<span class="ig-plus">+' + (mem.length - 5) + '</span>' : '') + '</span>' + groupTag(g) + '</div></div></article>';
  }

  /* ---------------------------------------------------------------
     Eventos, grupos y la Semana (state.routine), sin duplicar
     --------------------------------------------------------------- */
  const evDate = p => (p.ev.dow != null ? nextDow(p.ev.dow) : fromDk(p.ev.date));
  const svDate = p => fromDk(p.sv.date);
  function sortDay(R) { R.sort((x, y) => String(x.h).localeCompare(String(y.h))); }
  /* 'added' | 'already' | 'later' (un evento único de otra semana entra cuando llega su semana) */
  function addToWeek(p) {
    const e = p.ev, d = evDate(p), dow = d.getDay(), R = L.state.routine[dow], weekly = e.dow != null;
    if (R.some(x => x.ig === p.id || (x.a === e.a && x.h === e.h))) return 'already';
    if (!weekly && !inWeek(d)) return 'later';
    const it = { id: 'ig-' + p.id, a: e.a, t: p.t, h: e.h, n: 'El Buen Pastor · ' + e.place.split(' · ')[0], ig: p.id };
    if (!weekly) it.once = dk(d);
    R.push(it); sortDay(R); L.refreshHoy();
    return 'added';
  }
  function addGroupToWeek(g) {
    if (g.every) return false;
    const R = L.state.routine[g.dow];
    if (R.some(x => x.ig === 'g:' + g.id || (x.a === 'encuentro' && x.h === g.h))) return false;
    R.push({ id: 'ig-g-' + g.id, a: 'encuentro', t: g.n, h: g.h, n: 'El Buen Pastor · ' + g.place.split(' · ')[0], ig: 'g:' + g.id });
    sortDay(R); L.refreshHoy();
    return true;
  }
  function removeFromWeek(tag) {
    const R = L.state.routine; let ch = false;
    Object.keys(R).forEach(d => {
      R[d] = R[d].filter(x => { if (x.ig !== tag) return true; delete L.state.done[x.id]; ch = true; return false; });
    });
    if (ch) L.refreshHoy();
    return ch;
  }
  const weekHas = (dow, a, h) => L.state.routine[dow].some(x => x.a === a && x.h === h);
  /* cada día: se van los únicos que pasaron y entran los de esta semana */
  function syncRoutine() {
    const S = st(), R = L.state.routine; let ch = false;
    Object.keys(R).forEach(d => {
      const n = R[d].length;
      R[d] = R[d].filter(x => !(x.once && dayDiff(fromDk(x.once)) < 0));
      if (R[d].length !== n) ch = true;
    });
    S.posts.forEach(p => { if (p.ev && p.my.go && p.ev.date && inWeek(fromDk(p.ev.date)) && addToWeek(p) === 'added') ch = true; });
    if (ch) L.refreshHoy();
  }
  function nextGathering() {
    const S = st(), list = [];
    GR.filter(g => inGroup(g.id)).forEach(g => list.push({ d: nextDow(g.dow), h: g.h, t: g.n, open: 'g:' + g.id }));
    S.posts.forEach(p => { if (p.ev && p.my.go && !isHidden(p)) { const d = evDate(p); if (dayDiff(d) >= 0) list.push({ d, h: p.ev.h, t: p.t, open: p.id }); } });
    list.sort((x, y) => (x.d - y.d) || x.h.localeCompare(y.h));
    return list[0];
  }

  /* ---------------------------------------------------------------
     Personas → Iglesia
     --------------------------------------------------------------- */
  function headHTML() {
    const nx = nextGathering();
    return '<section class="ig-head" aria-label="El Buen Pastor">' +
      '<div class="ig-head-top"><span class="ig-logo">' + ico('church') + '</span><span class="pn"><b>El Buen Pastor</b><small>Asunción · Pastores Esteban y Lidia</small></span>' +
      '<button class="ig-shield" type="button" data-i-norms aria-label="Normas y privacidad">' + ico('shield') + '</button></div>' +
      (nx ? '<button class="ig-next" type="button" data-i-next="' + nx.open + '" data-a="encuentro"><span class="ic">' + ico('cal') + '</span><span class="tx"><b>' + evLabel(nx.d) + ' ' + nx.h + '</b> · ' + esc(nx.t) + '</span>' + L.ic('next') + '</button>' : '') +
      '</section>';
  }
  function chipsHTML(cur) {
    const S = st();
    return '<div class="ig-chans" role="tablist" aria-label="Canales">' + CH.map(c => {
      const un = S.posts.some(p => p.ch === c.id && p.u && visible(p) && !isHidden(p));
      return '<button class="ig-chip" type="button" role="tab" data-a="' + c.a + '" data-i-chan="' + c.id + '" aria-selected="' + (c.id === cur) + '"><span class="ic">' + ico(c.i) + '</span>' + c.n +
        (un ? '<span class="dot"></span><span class="sr-only">, nuevo</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function composeBar(ch, grp) {
    return '<button class="ig-compose" type="button" data-a="' + (grp ? 'encuentro' : CHM[ch].a) + '" data-i-compose="' + ch + '"' + (grp ? ' data-i-grp="' + grp + '"' : '') + '>' +
      av('JC', 30) + '<span class="t">' + (grp ? 'Escribe al grupo' : COMPOSE[ch]) + '</span><span class="plus">' + L.ic('plus') + '</span></button>';
  }
  function feedHTML(c) {
    const S = st();
    if (c.id === 'grupos') return GR.slice().sort((a, b) => inGroup(b.id) - inGroup(a.id)).map(groupCard).join('');
    let list = S.posts.filter(p => p.ch === c.id && visible(p) && !p.grp);
    if (c.id === 'eventos') return list.filter(p => dayDiff(evDate(p)) >= 0).sort((a, b) => evDate(a) - evDate(b)).map(evCard).join('') || empty();
    if (c.id === 'servicio') return list.filter(p => dayDiff(svDate(p)) >= 0).sort((a, b) => svDate(a) - svDate(b)).map(svCard).join('') || empty();
    list = list.filter(p => p.pin).concat(list.filter(p => !p.pin));
    return list.map(postCard).join('') || empty();
  }
  function render(el) {
    const S = st();
    if (!CHM[S.chan]) S.chan = 'anuncios';
    const c = CHM[S.chan];
    let marked = false;
    S.posts.forEach(p => { if (p.u && p.ch === c.id && visible(p) && !p.grp) { p.u = false; seen.add(p.id); marked = true; } });
    el.innerHTML = '<div class="ig">' + headHTML() + chipsHTML(c.id) +
      '<p class="ig-chead" data-a="' + c.a + '">' + c.d + (c.id === 'anuncios' ? '<span class="r">' + ico('lock') + 'Solo pastores</span>' : '') + '</p>' +
      (COMPOSE[c.id] ? composeBar(c.id) : '') +
      '<div class="ig-feed" id="igFeed">' + feedHTML(c) + '</div></div>';
    justPosted = null;
    const row = $('.ig-chans', el);
    if (row) {
      row.scrollLeft = chipSL;
      const a = $('[aria-selected="true"]', row);
      if (a) {
        if (a.offsetLeft - 18 < row.scrollLeft) row.scrollLeft = a.offsetLeft - 18;
        else if (a.offsetLeft + a.offsetWidth + 18 > row.scrollLeft + row.clientWidth) row.scrollLeft = a.offsetLeft + a.offsetWidth + 18 - row.clientWidth;
      }
      chipSL = row.scrollLeft;
      row.addEventListener('scroll', () => { chipSL = row.scrollLeft; }, { passive: true });
    }
    if (marked) setTimeout(syncBadge, 0);
  }
  function rerenderBody(anim) {
    const b = document.getElementById('modBody');
    if (L.current !== 'personas' || !b || b.dataset.mod !== ID) return;
    render(b);
    if (anim && !L.RM()) { const f = $('#igFeed', b); if (f) f.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 280, easing: EASE }); }
  }
  function setChan(id) {
    const S = st(); if (!CHM[id] || S.chan === id) return;
    S.chan = id; seen.clear();
    L.haptic(5);
    rerenderBody(true);
  }

  /* ---------------------------------------------------------------
     Pantallas apiladas: hilo y grupo (pila propia dentro de openPush)
     --------------------------------------------------------------- */
  const topBar = (back, pid) => '<div class="ig-top"><button class="back" type="button" ' + (back ? 'data-i-back' : 'data-back') + ' aria-label="Volver">' + L.ic('back') + '</button>' +
    (pid ? '<button class="ig-more" type="button" data-i-more="' + pid + '" aria-label="Más opciones">' + ico('more', 'i fillc') + '</button>' : '') + '</div>';
  function replyHTML(p, r) {
    if (isHidden(r)) return '<p class="ig-gone">' + ico('flag') + 'Reportaste esta respuesta</p>';
    if (isMuted(r)) return '<button class="ig-gone" type="button" data-i-reveal="' + r.id + '">' + ico('mute') + 'De alguien que silenciaste · Ver</button>';
    return '<div class="ig-re' + (r.ans ? ' ans' : '') + '" id="re-' + r.id + '">' +
      (r.ans ? '<p class="ig-ey">' + L.ic('star', 'i fillc') + 'Respuesta ' + (M[r.by].role === 'Pastora' ? 'de la pastora' : 'del pastor') + '</p>' : '') +
      '<div class="ig-rh">' + byLine(r, 28, p) + '<button class="ig-dots" type="button" data-i-more="' + p.id + '" data-i-re="' + r.id + '" aria-label="Más opciones">' + ico('more', 'i fillc') + '</button></div>' +
      '<p class="ig-rt">' + esc(r.t) + '</p><div class="ig-acts">' + rxBtn(p, r.ans ? 'gracias' : 'amen', r) + '</div></div>';
  }
  function evDetail(p) {
    const e = p.ev, d = evDate(p);
    return '<div class="ig-evd">' + dateTile(d) + '<div><h1 class="ig-h1 sm">' + esc(p.t) + '</h1>' + meta(d, e.h, e.place, e.dow != null ? ' · cada ' + L.DN[e.dow] : '') + '</div></div>' +
      (e.note ? '<p class="ig-th-note">' + esc(e.note) + '</p>' : '') +
      (e.cap ? cupo(e.n, e.cap, 'Quedan') : e.n != null ? '<p class="ig-goes">' + e.n + ' van</p>' : '') +
      goBtn(p, true) + '<p class="ig-priv">' + L.ic('check') + 'Si vas, entra en tu semana</p>';
  }
  function svDetail(p) {
    const s = p.sv, d = svDate(p);
    return '<div class="ig-evd">' + dateTile(d) + '<div><h1 class="ig-h1 sm">' + esc(p.t) + '</h1>' + meta(d, s.h, s.place) + '</div></div>' +
      (s.note ? '<p class="ig-th-note">' + esc(s.note) + '</p>' : '') + cupo(s.vol.length, s.need, 'Faltan') +
      (s.vol.length ? '<div class="ig-volrow"><span class="ig-avs">' + s.vol.map(id => av(id, 28)).join('') + '</span><small>' + (s.vol.length === 1 ? 'se sumó' : 'se sumaron') + '</small></div>' : '') +
      sumoBtn(p, true) + (s.priv ? '<p class="ig-priv">' + ico('lock') + 'Los datos se comparten solo con quien se suma</p>' : '');
  }
  function threadHTML(p, back) {
    const c = CHM[p.ch], g = p.grp && GRM[p.grp], a = aOf(p), mine = p.by === 'JC';
    let h = topBar(back, p.id) + '<div class="ig-th" data-a="' + a + '">';
    h += '<div class="ig-th-tags"><span class="actchip">' + ico(g ? 'people' : c.i) + esc(g ? g.n : c.n) + '</span>' + (p.pin ? '<span class="ig-pinned">' + ico('pin') + 'Fijado</span>' : '') + '</div>';
    if (p.ev) h += evDetail(p) + '<div class="ig-org"><small>Organiza</small>' + byLine(p, 28, p) + '</div>';
    else if (p.sv) h += svDetail(p) + '<div class="ig-org"><small>Coordina</small>' + byLine(p, 28, p) + '</div>';
    else h += byLine(p, 40, p) + '<p class="ig-th-t">' + esc(p.t) + '</p>';
    if (p.mod) h += modNote(p.mod);
    if (p.link) h += linkTag(p.link);
    if (p.ch === 'oracion' && !p.ans) h += prayBig(p);
    if (p.ans) {
      if (mine) {
        h += '<div class="ig-ansdone"><div class="stone-glow">' + L.ic('star', 'i fillc') + '</div><b>Dios respondió</b><small>Queda en tu memorial</small>' +
          (p.testi && find(p.testi) ? '<button class="btn ghost" type="button" data-i-open="' + p.testi + '">Ver tu testimonio</button>' : '<button class="btn" type="button" data-i-testi="' + p.id + '">' + L.ic('grace') + 'Contar testimonio</button>') + '</div>';
      } else h += ansTag(p.ans);
    } else if (mine && p.ch === 'oracion') h += '<button class="btn ghost" type="button" data-i-answered="' + p.id + '">' + L.ic('star') + 'Dios respondió</button>';
    const keys = rxKeys(p);
    if (keys.length && !p.ev && !p.sv) h += '<div class="ig-acts ig-th-acts">' + keys.map(k => rxBtn(p, k)).join('') + '</div>';
    if (g) h += '<p class="ig-priv">' + ico('lock') + 'Solo lo ve el grupo</p>';
    else if (p.anon) h += '<p class="ig-priv">' + ico('veil') + 'Anónimo: solo los pastores saben quién es</p>';
    const res = p.re, ord = p.ch === 'preguntas' ? res.filter(r => r.ans).concat(res.filter(r => !r.ans)) : res;
    const n = res.filter(r => !isHidden(r)).length;
    h += '<div class="sec-h"><h2>Respuestas</h2><span class="muted">' + (n || '') + '</span></div>';
    h += '<div class="ig-res">' + (ord.map(r => replyHTML(p, r)).join('') || empty('Todavía sin respuestas.')) + '</div>';
    h += '<div class="ig-write"><input class="field" id="igReply" type="text" placeholder="Responde con gracia" autocomplete="off" maxlength="400" aria-label="Tu respuesta" data-i-input="' + p.id + '">' +
      '<button class="ig-send" type="button" data-i-send="' + p.id + '" aria-label="Enviar respuesta" disabled>' + L.ic('send') + '</button></div>';
    return h + '</div>';
  }
  function groupHTML(g) {
    const S = st(), mine = inGroup(g.id), lead = g.lead === 'JC', d = nextDow(g.dow), mem = members(g);
    let h = topBar(false) + '<div class="ig-gv" data-a="encuentro">';
    h += '<div class="ig-ghero"><span class="ig-gic">' + L.ic('people') + '</span><h1 class="ig-h1">' + esc(g.n) + '</h1>' +
      '<p class="ig-sub">' + L.cap(L.DN[g.dow]) + ' ' + g.h + (g.every ? ' · ' + g.every : '') + '</p><p class="ig-sub">' + ico('place') + esc(g.place) + '</p>' + groupTag(g) + '</div>';
    h += '<div class="ig-gnext"><div class="tx"><small>Próximo</small><b>' + evLabel(d) + ' ' + g.h + '</b><span>' + esc(g.now) + '</span></div>' +
      (mine && weekHas(g.dow, 'encuentro', g.h) ? '<span class="ig-wk">' + L.ic('check') + 'En tu semana</span>' : '') + '</div>';
    if (lead) {
      const done = S.reminded === todayK();
      h += '<button class="btn ghost ig-remind" type="button" data-i-remind="' + g.id + '"' + (done ? ' disabled' : '') + '>' + ico('bell') + (done ? 'Recordado hoy' : 'Recordar al grupo') + '</button>';
    } else if (!mine) {
      const asked = S.groups[g.id] === 'pedido';
      h += '<button class="btn" type="button" data-i-join="' + g.id + '"' + (asked ? ' disabled' : '') + '>' + (asked ? 'Pedido enviado a ' + M[g.lead].f : 'Pedir unirme') + '</button>';
    }
    h += '<div class="sec-h"><h2>Somos</h2><span class="muted">' + mem.length + '</span></div><div class="ig-mems">' +
      mem.map(id => '<span class="ig-mem">' + av(id, 44) + '<span>' + (id === 'JC' ? 'Tú' : M[id].f) + '</span></span>').join('') + '</div>';
    if (mine) {
      const posts = S.posts.filter(p => p.grp === g.id);
      if (posts.some(p => p.u)) { posts.forEach(p => { if (p.u) { p.u = false; seen.add(p.id); } }); setTimeout(syncBadge, 0); }
      h += '<p class="ig-priv">' + ico('lock') + 'Solo el grupo ve lo que se escribe aquí</p>' + composeBar('grupos', g.id) +
        '<div class="ig-feed">' + (posts.map(postCard).join('') || empty()) + '</div>';
    } else h += '<p class="ig-priv">' + ico('lock') + 'Lo que escribe el grupo lo ven solo sus miembros</p>';
    return h + '</div>';
  }
  function drawPush(el) {
    const top = nav[nav.length - 1], back = nav.length > 1;
    let html;
    if (top && top.v === 'group' && GRM[top.id]) html = groupHTML(GRM[top.id]);
    else {
      const p = top && find(top.id);
      html = p && visible(p) ? threadHTML(p, back) : topBar(back) + '<p class="dnote">' + L.ic('grace') + 'Esta publicación ya no está.</p>';
    }
    el.innerHTML = '<div class="ig-push">' + html + '</div>';
  }
  const myPushOpen = () => L.pushView === 'mod' && !!$('#modpush .ig-push');
  const viewing = pid => myPushOpen() && nav.length && nav[nav.length - 1].v === 'post' && nav[nav.length - 1].id === pid;
  function redrawPush() {
    if (!myPushOpen()) return;
    const el = $('#modpush'), inp = $('#igReply', el), val = inp ? inp.value : '', foc = inp && document.activeElement === inp, sc = el.scrollTop;
    drawPush(el);
    el.scrollTop = sc;
    const ni = $('#igReply', el);
    if (ni && val) { ni.value = val; const b = $('[data-i-send]', el); if (b) b.disabled = !val.trim(); }
    if (ni && foc) ni.focus({ preventScroll: true });
  }
  function slide(dir) {
    if (L.RM()) return;
    const el = $('#modpush .ig-push');
    if (el) el.animate([{ transform: 'translateX(' + (dir * 40) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: EASE });
  }
  function markRead(id) { const p = find(id); if (p && p.u) { p.u = false; syncBadge(); } }
  function openThread(id) { if (!find(id)) return; nav = [{ v: 'post', id }]; L.openPush(drawPush); markRead(id); }
  function pushThread(id) { if (!find(id)) return; nav.push({ v: 'post', id }); L.openPush(drawPush); slide(1); markRead(id); }
  function openGroup(gid) { if (!GRM[gid]) return; nav = [{ v: 'group', id: gid }]; L.openPush(drawPush); }
  function popNav() { if (nav.length < 2) { L.closePush(); return; } nav.pop(); L.openPush(drawPush); slide(-1); }
  function leaveThread(id) {
    if (!viewing(id)) return;
    if (nav.length > 1) popNav(); else L.closePush();
  }
  /* desde Hoy: ir a Personas → Iglesia y abrir el hilo cuando la vista esté lista */
  function goThread(id) {
    const p = find(id); if (!p) return;
    st().chan = p.ch;
    if (L.current === 'personas') { if (L.pseg !== ID) L.setPseg(ID); else rerenderBody(); openThread(id); return; }
    pendingOpen = id;
    L.setPseg(ID);
  }

  /* refrescar lo que esté a la vista */
  function refreshHoyCard(force) {
    const box = document.getElementById('hoyMods'); if (!box) return;
    if (L.current === 'hoy' && !force) return;
    const el = $('.hoy-mod[data-mod="' + ID + '"]', box);
    if (el) { hoyCard(el); if (!el.innerHTML.trim()) el.remove(); return; }
    const tmp = document.createElement('div'); hoyCard(tmp);
    if (tmp.innerHTML.trim()) L.rerender();
  }
  function refreshViews() { rerenderBody(); redrawPush(); refreshHoyCard(); }

  /* ---------------------------------------------------------------
     Orar: cuenta como oración en Hoy y suma a «por otros»
     --------------------------------------------------------------- */
  function updatePray(p, from) {
    $$('[data-i-pray="' + p.id + '"]').forEach(b => {
      const nb = swap(b, b.classList.contains('ig-praybig') ? prayBig(p) : prayBtn(p, b.dataset.iSrc));
      const n = $('.n', nb); if (n && from !== p.n) L.odo(n, from, p.n, true);
    });
    $$('[data-i-count="' + p.id + '"] .n').forEach(n => { if (from !== p.n) L.odo(n, from, p.n, true); });
  }
  /* cuenta una oración en Hoy con markQuiet. Si «Oración» ya estaba como extra, markQuiet no hace nada
     y el núcleo no revisa logros (Intercesor): se quita y se vuelve a poner para que los revise. */
  function countPrayer() {
    const before = Object.keys(L.state.done), had = L.state.extras.includes('oracion');
    const pending = L.todayItems().some(i => i.a === 'oracion' && !L.isDone(i.id));
    if (had && !pending) L.state.extras.splice(L.state.extras.indexOf('oracion'), 1);
    L.markQuiet('oracion');
    return { item: Object.keys(L.state.done).find(k => !before.includes(k)), extra: !had && L.state.extras.includes('oracion') };
  }
  function pray(id, btn) {
    const p = find(id); if (!p || p.ans) return;
    const tk = todayK();
    if (p.prayedOn === tk) { L.toast('Ya oraste hoy por esto'); L.haptic(4); return; }
    const prev = { n: p.n, me: !!p.me, on: p.prayedOn || null };
    const onHoy = btn.dataset.iSrc === 'hoy' && L.current === 'hoy' && !L.pushView;
    const counted = p.by !== 'JC';
    p.prayedOn = tk;
    if (!p.me) { p.me = true; p.n++; }
    if (counted) L.state.stats.prayOthers++;
    let u = {};
    if (onHoy) {
      /* en Hoy se ve: chispa hasta la llama */
      const it = L.todayItems().find(i => i.a === 'oracion' && !L.isDone(i.id));
      if (it) { L.setItem(it.id, true, false, btn); u.item = it.id; }
      else {
        u.extra = !L.state.extras.includes('oracion');
        L.pop(btn, 'oracion', 10); L.haptic(10); L.sound.note('oracion');
        L.spark(L.centerOf(btn), L.flamePoint($('#lampMain')), L.col('oracion'), () => { const q = find(id); if (q && q.prayedOn === tk) countPrayer(); });
      }
    } else {
      u = countPrayer();
      L.pop(btn, 'oracion', 10); L.haptic(10); L.sound.note('oracion');
    }
    updatePray(p, prev.n);
    L.announce('Estás orando: ' + trim(p.t, 60));
    /* aviso cálido del autor o del pastor, una sola vez por petición */
    let tm = 0;
    if (counted && !p.my.thx) {
      p.my.thx = true;
      const who = p.anon || !p.by ? (p.thxBy || 'ER') : p.by;
      tm = warm(4200, () => { if (find(id)) L.notify(who, callName(who), p.thx || 'Gracias por orar, Juan Carlos.', 'oracion', 0); });
    }
    L.toast(onHoy ? 'Oración anotada' : 'Estás orando' + (p.anon || !p.by ? '' : ' por ' + M[p.by].f), () => {
      const q = find(id); if (!q) return;
      q.n = prev.n; q.me = prev.me; q.prayedOn = prev.on;
      if (counted) L.state.stats.prayOthers = Math.max(0, L.state.stats.prayOthers - 1);
      if (cancel(tm)) q.my.thx = false;
      if (u.item && L.isDone(u.item)) L.setItem(u.item, false, true);
      if (u.extra) { const i = L.state.extras.indexOf('oracion'); if (i >= 0) { L.state.extras.splice(i, 1); L.refreshHoy(); } }
      updatePray(q, q.n);
      if (!onHoy) refreshHoyCard();
    });
    if (!onHoy) refreshHoyCard();
  }

  /* reacciones con sentido: Amén, Gracias, ¡Gloria a Dios! (sin «me gusta») */
  function react(pid, k, rid, btn) {
    const p = find(pid); if (!p || !RX[k]) return;
    const x = rid ? p.re.find(r => r.id === rid) : p; if (!x) return;
    const from = x.rx[k] || 0, on = !x.my[k];
    x.my[k] = on; x.rx[k] = Math.max(0, from + (on ? 1 : -1));
    const nb = swap(btn, rxBtn(p, k, rid ? x : null)), n = $('.n', nb);
    if (n && from && x.rx[k]) L.odo(n, from, x.rx[k], true);
    if (on) { L.pop(nb, k === 'gloria' ? 'adoracion' : aOf(p), k === 'gloria' ? 12 : 8); L.haptic(6); L.sound.note(k === 'gloria' ? 'adoracion' : aOf(p)); }
  }

  /* «Voy»: cupo y Semana, sin duplicar lo que ya está en la rutina */
  function toggleGo(id, btn) {
    const p = find(id); if (!p || !p.ev) return;
    const e = p.ev, d = evDate(p), onHoy = !!btn.closest('#hoyMods');
    const after = () => {
      if (onHoy && L.current === 'hoy') { const q = find(id); $$('#hoyMods [data-i-go="' + id + '"]').forEach(b => swap(b, goBtn(q))); }
      else refreshViews();
    };
    if (p.my.go) {
      p.my.go = false; if (e.n != null) e.n = Math.max(0, e.n - 1);
      const removed = removeFromWeek(p.id);
      after();
      L.toast('Ya no vas', () => { const q = find(id); if (!q || q.my.go) return; q.my.go = true; if (q.ev.n != null) q.ev.n++; if (removed) addToWeek(q); after(); });
      return;
    }
    if (e.cap && e.n >= e.cap) return;
    p.my.go = true; if (e.n != null) e.n++;
    const r = addToWeek(p);
    L.pop(btn, 'diario', 9); L.haptic([8, 30, 12]); L.sound.note(e.a);
    after();
    const msg = r === 'added' ? 'Vas · sumado a tu semana' : r === 'already' ? 'Vas · ya está en tu semana' : 'Vas · entra en tu semana el ' + L.DN[d.getDay()] + ' ' + d.getDate();
    L.toast(msg, () => { const q = find(id); if (!q || !q.my.go) return; q.my.go = false; if (q.ev.n != null) q.ev.n = Math.max(0, q.ev.n - 1); if (r === 'added') removeFromWeek(q.id); after(); });
  }
  function toggleSumo(id, btn) {
    const p = find(id); if (!p || !p.sv) return;
    const s = p.sv, i = s.vol.indexOf('JC');
    if (i >= 0) {
      s.vol.splice(i, 1); refreshViews();
      L.toast('Ya no estás anotado', () => { const q = find(id); if (q && !q.sv.vol.includes('JC')) { q.sv.vol.push('JC'); refreshViews(); } });
      return;
    }
    if (s.vol.length >= s.need) return;
    s.vol.push('JC');
    L.pop(btn, 'ayuno', 9); L.haptic([8, 30, 12]); L.sound.note('ayuno');
    refreshViews();
    let tm = 0;
    if (!p.my.thx) {
      p.my.thx = true;
      tm = warm(3800, () => { const q = find(id); if (q && q.sv.vol.includes('JC')) L.notify(p.by, callName(p.by), s.priv ? '¡Gracias! Te paso los datos por mensaje.' : '¡Gracias por sumarte! Nos vemos ' + evPhrase(svDate(p)) + '.', 'ayuno', 0); });
    }
    L.toast('Te sumaste · ' + p.t, () => {
      const q = find(id); if (!q) return;
      const j = q.sv.vol.indexOf('JC'); if (j >= 0) q.sv.vol.splice(j, 1);
      if (cancel(tm)) q.my.thx = false;
      refreshViews();
    });
  }

  /* ---------------------------------------------------------------
     Grupos: recordar (líder) y pedir unirse
     --------------------------------------------------------------- */
  function remind(gid, btn) {
    const S = st(); if (S.reminded === todayK()) return;
    S.reminded = todayK();
    L.pop(btn, 'encuentro', 9); L.haptic(10); L.sound.note('encuentro');
    redrawPush();
    const tm = warm(3600, () => L.notify('DV', 'Daniel', 'Ahí estaré. Llevo a un compañero del trabajo.', 'encuentro', 0));
    L.toast('Recordatorio enviado al grupo', () => { st().reminded = null; cancel(tm); redrawPush(); });
  }
  function joinGroup(gid) {
    const S = st(), g = GRM[gid]; if (!g || inGroup(gid) || S.groups[gid]) return;
    S.groups[gid] = 'pedido';
    L.haptic(8); refreshViews();
    L.toast('Le avisamos a ' + M[g.lead].f);
    warm(4200, () => {
      const T = st(); if (T.groups[gid] !== 'pedido') return;
      T.groups[gid] = 'si';
      const added = addGroupToWeek(g);
      L.notify(g.lead, callName(g.lead), '¡Bienvenido! Te espero el ' + L.DN[g.dow] + (added ? '. Ya está en tu semana.' : '.'), 'encuentro', 0);
      refreshViews();
    });
  }

  /* ---------------------------------------------------------------
     Responder
     --------------------------------------------------------------- */
  function sendReply(pid) {
    const inp = $('#igReply'); if (!inp) return;
    const t = inp.value.trim(), p = find(pid); if (!t || !p) return;
    const S = st(), r = { id: 'm' + (S.nextId++), by: 'JC', day: todayK(), h: null, t, rx: {}, my: {} };
    p.re.push(r);
    inp.value = '';
    redrawPush();
    const el = document.getElementById('re-' + r.id), sc = $('#modpush');
    if (el && sc) {
      /* solo se desplaza la pantalla apilada, nunca la página */
      sc.scrollTo({ top: Math.max(0, el.offsetTop - sc.clientHeight / 2 + el.offsetHeight / 2), behavior: L.RM() ? 'auto' : 'smooth' });
      if (!L.RM()) el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: EASE });
    }
    L.haptic(8); L.sound.note(aOf(p));
    L.toast(SENS.test(t) ? 'Respondiste · cuida los datos de otros' : 'Respondiste', () => { const q = find(pid); if (!q) return; q.re = q.re.filter(x => x.id !== r.id); redrawPush(); });
    /* eco silencioso: quien escribió dice Amén a tu respuesta */
    if (p.by && p.by !== 'JC' && !p.anon) later(5200, () => {
      const q = find(pid), rr = q && q.re.find(x => x.id === r.id); if (!rr) return;
      rr.rx.amen = (rr.rx.amen || 0) + 1;
      if (viewing(pid)) redrawPush();
    });
  }
  function arrived(q, r) {
    if (viewing(q.id)) {
      redrawPush();
      const el = document.getElementById('re-' + r.id);
      if (el && !L.RM()) el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: EASE });
      return;
    }
    const top = nav[nav.length - 1];
    if (q.grp && myPushOpen() && top && top.v === 'group' && top.id === q.grp) { redrawPush(); return; }
    q.u = true; syncBadge(); rerenderBody();
  }

  /* ---------------------------------------------------------------
     Publicar (hoja)
     --------------------------------------------------------------- */
  function answeredList(extra) {
    const out = [];
    if (extra) out.push(extra);
    st().posts.filter(p => p.by === 'JC' && p.ch === 'oracion' && p.ans).forEach(p => out.push(trim(p.t, 70)));
    (L.state.answered || []).forEach(a => out.push(a.t));
    return Array.from(new Set(out)).slice(0, 6);
  }
  function privLine(o, anon) {
    if (o.grp) return ico('lock') + 'Solo lo ve el grupo de hombres';
    if (anon) return ico('eye') + 'Lo ve la iglesia, sin tu nombre';
    return ico('eye') + 'Lo ve la iglesia';
  }
  function openCompose(ch, grp, linkPid) {
    const S = st();
    if (!S.normsOk) { openNorms(true, () => openCompose(ch, grp, linkPid)); return; }
    let cur = COPTS.find(o => (grp ? o.grp === grp : o.ch === ch && !o.grp)) || COPTS[0];
    let anon = false;
    const lp = linkPid && find(linkPid), first = lp ? trim(lp.t, 70) : null, links = answeredList(first);
    let link = first;
    const html = '<div class="ig-sh"><h2 class="sh-title">Publicar</h2>' +
      '<div class="ig-pick" role="radiogroup" aria-label="Dónde">' + COPTS.map(o => '<button class="ig-chip" type="button" role="radio" data-a="' + o.a + '" data-i-c="' + o.k + '" aria-checked="' + (o === cur) + '"><span class="ic">' + ico(o.i) + '</span>' + o.n + '</button>').join('') + '</div>' +
      '<textarea class="note" id="igText" maxlength="500" aria-label="Tu publicación"></textarea>' +
      '<p class="ig-warn" id="igWarn" hidden>' + ico('lock') + '<span>Cuida a otros: sin teléfonos, direcciones ni datos de salud de terceros.</span></p>' +
      '<div id="igLinks" hidden><p class="flabel">Nació de una oración</p><div class="ig-pick">' +
        links.map((t, i) => '<button class="ig-chip sm" type="button" data-a="oracion" data-i-l="' + i + '" aria-pressed="' + (t === link) + '"><span class="ic">' + L.ic('oracion') + '</span>' + esc(trim(t, 30)) + '</button>').join('') + '</div></div>' +
      '<button class="ig-anon" type="button" role="switch" id="igAnon" aria-checked="false"><span class="ic">' + ico('veil') + '</span><span class="tx"><b>Anónimo</b><small>Solo los pastores verán tu nombre</small></span><span class="ig-sw" aria-hidden="true"></span></button>' +
      '<p class="ig-priv" id="igPriv"></p>' +
      '<button class="btn" type="button" id="igPub" disabled>Publicar</button></div>';
    L.openSheet(html, 'Publicar', root => {
      const ta = $('#igText', root), pub = $('#igPub', root), warn = $('#igWarn', root), an = $('#igAnon', root), lk = $('#igLinks', root), pv = $('#igPriv', root);
      const sync = () => {
        pub.disabled = !ta.value.trim();
        warn.hidden = !SENS.test(ta.value);
        if (!cur.anon) anon = false;
        an.hidden = !cur.anon; an.setAttribute('aria-checked', String(anon));
        lk.hidden = !(cur.ch === 'testimonios' && links.length);
        ta.placeholder = cur.ph;
        pv.innerHTML = privLine(cur, anon);
        pub.textContent = cur.grp ? 'Enviar al grupo' : 'Publicar';
        root.firstElementChild.dataset.a = cur.a;
      };
      ta.addEventListener('input', sync);
      root.onclick = e => {
        const c = e.target.closest('[data-i-c]');
        if (c) { cur = COPTS.find(o => o.k === c.dataset.iC) || cur; $$('[data-i-c]', root).forEach(x => x.setAttribute('aria-checked', String(x === c))); L.haptic(5); sync(); return; }
        const l = e.target.closest('[data-i-l]');
        if (l) { const t = links[Number(l.dataset.iL)]; link = link === t ? null : t; $$('[data-i-l]', root).forEach(x => x.setAttribute('aria-pressed', String(links[Number(x.dataset.iL)] === link))); return; }
        if (e.target.closest('#igAnon')) { anon = !anon; L.haptic(5); sync(); return; }
        if (e.target.closest('#igPub') && !pub.disabled) publish(cur, ta.value.trim(), anon, cur.ch === 'testimonios' ? link : null, cur.ch === 'testimonios' ? linkPid : null);
      };
      sync();
    });
  }
  function publish(o, text, anon, link, linkPid) {
    const S = st(), id = 'm' + (S.nextId++);
    const p = { id, ch: o.ch, by: 'JC', day: todayK(), h: null, t: text, rx: {}, my: {}, re: [] };
    if (o.grp) p.grp = o.grp;
    if (anon) p.anon = true;
    if (o.ch === 'oracion') p.n = 0;
    if (link) p.link = link;
    const lp = linkPid && find(linkPid);
    if (lp) lp.testi = id;
    S.posts.unshift(p);
    if (!o.grp) S.chan = o.ch;
    justPosted = id;
    L.closeSheet(() => {
      if (myPushOpen()) {
        if (o.grp && nav.length && nav[nav.length - 1].v === 'group') { redrawPush(); flash(id); }
        else L.closePush();
      } else if (L.current === 'personas' && L.pseg === ID) { rerenderBody(); }
      else L.setPseg(ID);
      L.haptic([8, 30, 12]); L.sound.note(o.a);
      L.toast(o.grp ? 'Enviado al grupo' : 'Publicado', () => unpublish(id));
      echo(p, o);
    });
  }
  function flash(id) {
    const el = $('[data-i-open="' + id + '"]'), card = el && el.closest('.ig-card');
    if (card && !L.RM()) card.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: EASE });
  }
  const echoes = {};
  function unpublish(id) {
    const S = st(), p = find(id); if (!p) return;
    (echoes[id] || []).forEach(cancel); delete echoes[id];
    S.posts = S.posts.filter(x => x.id !== id);
    S.posts.forEach(x => { if (x.testi === id) delete x.testi; });
    leaveThread(id);
    refreshViews(); syncBadge();
  }
  /* la comunidad responde (simulado y con calma) */
  function echo(p, o) {
    const id = p.id, track = t => { (echoes[id] = echoes[id] || []).push(t); };
    const add = (by, t, x) => {
      const q = find(id); if (!q) return null;
      const r = Object.assign({ id: 'm' + (st().nextId++), by, day: todayK(), h: null, t, rx: {}, my: {} }, x || {});
      q.re.push(r); arrived(q, r); return q;
    };
    if (o.ch === 'oracion') {
      const by = p.anon ? 'ER' : 'LM';
      track(warm(4500, () => {
        const q = add(by, p.anon ? 'Gracias por confiar. Estoy orando por ti; si quieres hablar, escríbeme.' : 'Orando contigo, Juan Carlos.');
        if (!q) return;
        const f = q.n; q.n += 1; updatePray(q, f);
        L.notify(by, callName(by), p.anon ? 'Leyó tu petición y está orando.' : 'Está orando por tu petición.', 'oracion', 0);
      }));
      track(later(12000, () => { const q = find(id); if (!q) return; const f = q.n; q.n += 4; updatePray(q, f); }));
    } else if (o.ch === 'testimonios') {
      track(warm(4200, () => {
        const q = find(id); if (!q) return;
        q.rx.gloria = (q.rx.gloria || 0) + 7; q.rx.amen = (q.rx.amen || 0) + 3;
        add('ER', '¡Gloria a Dios! Gracias por contarlo.');
        L.notify('ER', callName('ER'), '¡Gloria a Dios! Gracias por contarlo.', 'adoracion', 0);
      }));
    } else if (o.ch === 'preguntas') {
      track(warm(6500, () => {
        const q = add('ER', 'Buena pregunta. Lo conversamos el martes con calma; mientras, Santiago 1:5: Dios da sabiduría a quien se la pide.', { ans: true, rx: { gracias: 0 } });
        if (q) L.notify('ER', callName('ER'), 'Respondió tu pregunta.', 'palabra', 0);
      }));
    } else if (o.grp) {
      track(later(4000, () => { const q = add('RG', 'Amén. Ahí estaremos.'); if (q) q.rx.amen = (q.rx.amen || 0) + 4; }));
    }
  }

  /* ---------------------------------------------------------------
     Dios respondió → memorial (núcleo) y testimonio
     --------------------------------------------------------------- */
  function markAnswered(id) {
    const p = find(id); if (!p || p.by !== 'JC' || p.ans) return;
    const mt = trim(p.t, 60);
    p.ans = { t: 'Dios respondió', day: todayK() };
    L.state.answered.unshift({ who: 'yo', t: mt, w: 'hoy' });
    refreshViews();
    const g = $('#modpush .ig-ansdone .stone-glow');
    if (g) {
      if (!L.RM()) g.animate([{ transform: 'scale(0.4)', opacity: 0 }, { transform: 'scale(1.12)', opacity: 1, offset: 0.6 }, { transform: 'scale(1)' }], { duration: 900, easing: EASE });
      L.burst(L.centerOf(g), 14);
    }
    L.sound.seal(); L.haptic([10, 40, 16]);
    L.toast('Dios respondió', () => {
      const q = find(id); if (!q) return;
      delete q.ans;
      const i = L.state.answered.findIndex(a => a.who === 'yo' && a.t === mt && a.w === 'hoy');
      if (i >= 0) L.state.answered.splice(i, 1);
      refreshViews();
    });
  }

  /* ---------------------------------------------------------------
     Cuidar la comunidad: opciones, reportar, silenciar, borrar
     --------------------------------------------------------------- */
  const WHY = ['Datos de otra persona', 'Falta de respeto', 'Venta o publicidad', 'Otra cosa'];
  function openMore(pid, rid) {
    const S = st(), p = find(pid); if (!p) return;
    const x = rid ? p.re.find(r => r.id === rid) : p; if (!x) return;
    const mine = x.by === 'JC', who = !x.anon && x.by && x.by !== 'JC' ? x.by : null, items = [];
    if (mine) items.push(['del', 'trash', rid ? 'Borrar respuesta' : 'Borrar publicación', '']);
    if (mine && !rid && p.ch === 'oracion' && !p.ans) items.push(['ans', 'star', 'Dios respondió', 'Pasa a tu memorial']);
    if (who && !isPastor(who)) items.push(S.muted.includes(who) ? ['unmute', 'mute', 'Dejar de silenciar a ' + M[who].f, ''] : ['mute', 'mute', 'Silenciar a ' + M[who].f, 'No ves lo que publica. No le avisamos.']);
    if (!mine) items.push(['report', 'flag', 'Reportar', 'Lo revisan los pastores']);
    L.openSheet('<div class="ig-sh"><h2 class="sh-title">' + (rid ? 'Respuesta' : 'Publicación') + '</h2><p class="sh-sub">' + esc(trim(x.t, 70)) + '</p><div class="ig-menu">' +
      items.map(it => '<button class="ig-mi" type="button" data-i-mx="' + it[0] + '">' + ico(it[1]) + '<span><b>' + it[2] + '</b>' + (it[3] ? '<small>' + it[3] + '</small>' : '') + '</span></button>').join('') + '</div></div>', 'Opciones', root => {
      root.onclick = e => {
        const b = e.target.closest('[data-i-mx]'); if (!b) return;
        const k = b.dataset.iMx;
        if (k === 'report') { reportStep(root, pid, rid); return; }
        L.closeSheet(() => {
          if (k === 'del') del(pid, rid);
          else if (k === 'ans') { if (!viewing(pid)) openThread(pid); markAnswered(pid); }
          else if (k === 'mute') mute(who);
          else if (k === 'unmute') unmute(who);
        });
      };
    });
  }
  function reportStep(root, pid, rid) {
    let why = null;
    root.innerHTML = '<div class="ig-sh"><h2 class="sh-title">Reportar</h2><p class="sh-sub">No le avisamos a quien lo escribió.</p><div class="ig-menu" role="radiogroup" aria-label="Motivo">' +
      WHY.map((w, i) => '<button class="ig-mi" type="button" role="radio" aria-checked="false" data-i-why="' + i + '">' + ico(i === 0 ? 'lock' : i === 2 ? 'ban' : 'flag') + '<span><b>' + w + '</b></span></button>').join('') +
      '</div><button class="btn" type="button" id="igRep" disabled>Enviar a los pastores</button></div>';
    root.onclick = e => {
      const w = e.target.closest('[data-i-why]');
      if (w) { why = Number(w.dataset.iWhy); $$('[data-i-why]', root).forEach(x => x.setAttribute('aria-checked', String(x === w))); $('#igRep', root).disabled = false; return; }
      if (e.target.closest('#igRep') && why != null) L.closeSheet(() => report(pid, rid, WHY[why]));
    };
  }
  function report(pid, rid) {
    const S = st(), tid = rid || pid;
    if (S.hidden.includes(tid)) return;
    S.hidden.push(tid);
    if (!rid) leaveThread(pid);
    refreshViews(); syncBadge();
    const tm = warm(3800, () => L.notify('ER', callName('ER'), 'Gracias por cuidar la comunidad. Ya lo estamos viendo.', 'mensaje', 0));
    L.toast('Gracias · lo revisan los pastores', () => { const T = st(); T.hidden = T.hidden.filter(x => x !== tid); cancel(tm); refreshViews(); syncBadge(); });
  }
  function mute(who) {
    const S = st(); if (!who || S.muted.includes(who)) return;
    S.muted.push(who); refreshViews();
    L.toast('Silenciaste a ' + M[who].f, () => unmute(who, true));
  }
  function unmute(who, quiet) {
    const S = st(); S.muted = S.muted.filter(x => x !== who); refreshViews();
    if (!quiet) L.toast('Ves de nuevo a ' + M[who].f);
  }
  function del(pid, rid) {
    const S = st(), p = find(pid); if (!p) return;
    if (rid) {
      const i = p.re.findIndex(r => r.id === rid); if (i < 0) return;
      const r = p.re.splice(i, 1)[0];
      redrawPush();
      L.toast('Respuesta borrada', () => { const q = find(pid); if (q) { q.re.splice(i, 0, r); redrawPush(); } });
      return;
    }
    const i = S.posts.indexOf(p);
    (echoes[pid] || []).forEach(cancel); delete echoes[pid];
    S.posts.splice(i, 1);
    leaveThread(pid);
    refreshViews(); syncBadge();
    L.toast('Publicación borrada', () => { const T = st(); if (!T.posts.some(x => x.id === pid)) { T.posts.splice(Math.min(i, T.posts.length), 0, p); refreshViews(); } });
  }

  /* normas: cortas, y qué ve quién */
  function openNorms(gate, after) {
    const S = st();
    const rules = [
      ['oracion', 'Con gracia', 'Como en la mesa de tu casa.'],
      ['lock', 'Cuida a otros', 'Sin nombres completos, teléfonos ni salud de terceros.'],
      ['ban', 'Sin ventas ni política', 'Tampoco cadenas.'],
      ['flag', 'Avisa si algo no está bien', 'Los pastores moderan.']
    ];
    const who = [['church', 'Canales', 'La iglesia'], ['people', 'Grupos', 'Solo el grupo'], ['veil', 'Anónimo', 'Tu nombre, solo pastores'], ['eye', 'Cuándo entras u oras', 'Nadie']];
    const html = '<div class="ig-sh"><div class="ig-nh"><span class="ig-logo">' + ico('shield') + '</span><div><h2 class="sh-title">' + (gate ? 'Antes de publicar' : 'Cómo nos cuidamos') + '</h2><p class="sh-sub">El Buen Pastor · Asunción</p></div></div>' +
      '<div class="ig-rules">' + rules.map(r => '<div class="ig-rule"><span class="ic">' + ico(r[0]) + '</span><span><b>' + r[1] + '</b><small>' + r[2] + '</small></span></div>').join('') + '</div>' +
      (gate ? '' : '<p class="flabel">Qué ve quién</p><div class="card flush ig-whos">' + who.map(w => '<div class="ig-wrow"><span>' + ico(w[0]) + w[1] + '</span><b>' + w[2] + '</b></div>').join('') + '</div>' +
        (S.muted.length ? '<p class="flabel">Silenciaste</p><div class="ig-pick">' + S.muted.map(id => '<button class="ig-chip ig-um" type="button" data-i-um="' + id + '" aria-label="Dejar de silenciar a ' + M[id].f + '">' + av(id, 28) + M[id].f + L.ic('x') + '</button>').join('') + '</div>' : '')) +
      '<button class="btn" type="button" id="igOk">' + (gate ? 'Entendido' : 'Listo') + '</button></div>';
    L.openSheet(html, gate ? 'Antes de publicar' : 'Normas y privacidad', root => {
      root.onclick = e => {
        const u = e.target.closest('[data-i-um]');
        if (u) { unmute(u.dataset.iUm, true); u.remove(); return; }
        if (e.target.closest('#igOk')) { if (gate) { st().normsOk = true; if (after) after(); } else L.closeSheet(); }
      };
    });
  }

  /* ---------------------------------------------------------------
     Hoy: una tarjeta compacta
     --------------------------------------------------------------- */
  function hoyPick() {
    const S = st(), tk = todayK();
    const c = S.posts.filter(p => p.ch === 'oracion' && p.hoy && !p.ans && p.by !== 'JC' && !isHidden(p) && !isMuted(p) && p.prayedOn !== tk && dayDiff(fromDk(p.day)) >= -3);
    if (c.length) return { k: 'pray', p: c[(L.state.dayNum || 0) % c.length] };
    const ev = S.posts.filter(p => p.ev && !p.my.go && !isHidden(p) && dayDiff(evDate(p)) >= 0 && dayDiff(evDate(p)) <= 2).sort((a, b) => evDate(a) - evDate(b))[0];
    return ev ? { k: 'ev', p: ev } : null;
  }
  const hoyTop = (txt) => '<p class="ig-hoy-top"><span class="ig-hoy-lg">' + ico('church') + '</span>El Buen Pastor<em>· ' + txt + '</em></p>';
  function hoyCard(el) {
    const pk = hoyPick();
    if (!pk) { el.innerHTML = ''; return; }
    const p = pk.p;
    if (pk.k === 'pray') {
      el.innerHTML = '<article class="ig-card ig-hoy" data-a="oracion"><button class="ig-open" type="button" data-i-hoy="' + p.id + '" aria-label="Ver la petición en El Buen Pastor"></button>' +
        hoyTop('Ora hoy') + '<p class="ig-hoy-t">' + esc(p.t) + '</p>' +
        '<div class="ig-hoy-b">' + av(p.anon ? null : p.by, 26) + '<small>' + esc(p.anon ? 'Anónimo' : nm(p.by)) + '</small>' + prayBtn(p, 'hoy') + '</div></article>';
    } else {
      const d = evDate(p);
      el.innerHTML = '<article class="ig-card ig-hoy" data-a="diario"><button class="ig-open" type="button" data-i-hoy="' + p.id + '" aria-label="Ver el evento en El Buen Pastor"></button>' +
        hoyTop(evLabel(d) + ' ' + p.ev.h) + '<p class="ig-hoy-t">' + esc(p.t) + '</p>' +
        '<div class="ig-hoy-b"><small>' + ico('place') + esc(p.ev.place) + '</small>' + goBtn(p) + '</div></article>';
    }
  }

  /* ---------------------------------------------------------------
     Delegación de eventos (prefijo data-i-*)
     --------------------------------------------------------------- */
  function onClick(e) {
    const t = e.target;
    if (!t || !t.closest || !t.closest('#phone')) return;
    let el;
    if ((el = t.closest('[data-i-pray]'))) { pray(el.dataset.iPray, el); return; }
    if ((el = t.closest('[data-i-rx]'))) { react(el.dataset.iId, el.dataset.iRx, el.dataset.iRe, el); return; }
    if ((el = t.closest('[data-i-go]'))) { toggleGo(el.dataset.iGo, el); return; }
    if ((el = t.closest('[data-i-sumo]'))) { toggleSumo(el.dataset.iSumo, el); return; }
    if ((el = t.closest('[data-i-send]'))) { sendReply(el.dataset.iSend); return; }
    if ((el = t.closest('[data-i-more]'))) { openMore(el.dataset.iMore, el.dataset.iRe); return; }
    if ((el = t.closest('[data-i-compose]'))) { openCompose(el.dataset.iCompose, el.dataset.iGrp); return; }
    if ((el = t.closest('[data-i-chan]'))) { setChan(el.dataset.iChan); return; }
    if (t.closest('[data-i-norms]')) { openNorms(false); return; }
    if ((el = t.closest('[data-i-next]'))) { const v = el.dataset.iNext; if (v.indexOf('g:') === 0) openGroup(v.slice(2)); else openThread(v); return; }
    if ((el = t.closest('[data-i-group]'))) { openGroup(el.dataset.iGroup); return; }
    if (t.closest('[data-i-back]')) { popNav(); return; }
    if ((el = t.closest('[data-i-answered]'))) { markAnswered(el.dataset.iAnswered); return; }
    if ((el = t.closest('[data-i-testi]'))) { openCompose('testimonios', null, el.dataset.iTesti); return; }
    if ((el = t.closest('[data-i-remind]'))) { remind(el.dataset.iRemind, el); return; }
    if ((el = t.closest('[data-i-join]'))) { joinGroup(el.dataset.iJoin); return; }
    if ((el = t.closest('[data-i-reveal]'))) { revealed.add(el.dataset.iReveal); refreshViews(); return; }
    if ((el = t.closest('[data-i-hoy]'))) { goThread(el.dataset.iHoy); return; }
    if ((el = t.closest('[data-i-open]'))) { const id = el.dataset.iOpen; if (el.closest('#modpush')) pushThread(id); else openThread(id); }
  }
  function onInput(e) {
    if (e.target.id !== 'igReply') return;
    const b = $('[data-i-send="' + e.target.dataset.iInput + '"]'); if (b) b.disabled = !e.target.value.trim();
  }
  function onKey(e) {
    if (e.key === 'Enter' && e.target.id === 'igReply' && !e.isComposing) { e.preventDefault(); sendReply(e.target.dataset.iInput); }
  }
  function onNextDay() {
    const S = st();
    S.day = (S.day || 0) + 1;
    const x = POOL[S.day - 1];
    if (x) {
      S.posts.unshift(Object.assign({ id: 'n' + S.day, ch: x[0], by: x[1], day: todayK(), h: x[2], t: x[3], rx: {}, my: {}, re: [], u: true }, structuredClone(x[4])));
      if (x[1] === 'MC' && x[0] === 'testimonios') { const q = S.posts.find(p => p.by === 'MC' && p.ch === 'oracion' && !p.ans); if (q) q.ans = { t: 'Empieza a trabajar el lunes', day: todayK() }; }
    }
    syncRoutine();
    refreshHoyCard(true);
    syncBadge();
  }

  const MOD = {
    init() {
      document.addEventListener('click', onClick);
      document.addEventListener('input', onInput);
      document.addEventListener('keydown', onKey);
      L.on('reset', () => {
        gen++; timers.forEach(t => clearTimeout(t)); timers.clear();
        nav = []; seen.clear(); revealed.clear(); pendingOpen = null; justPosted = null; chipSL = 0; nextWarm = 0;
        Object.keys(echoes).forEach(k => delete echoes[k]);
        setTimeout(syncBadge, 0);
      });
      L.on('nextDay', onNextDay);
      L.on('render', () => setTimeout(syncBadge, 0));
      L.on('pseg', id => { if (id !== ID) seen.clear(); });
      L.on('tab', v => {
        if (v !== 'personas') seen.clear();
        if (v === 'hoy') refreshHoyCard(true);
        if (v === 'personas' && pendingOpen) { const id = pendingOpen; pendingOpen = null; openThread(id); }
      });
      setTimeout(syncBadge, 0);
    },
    render(el) { render(el); },
    hoyCard(el) { hoyCard(el); }
  };
  L.register(ID, MOD);
})(window.Lampara);
