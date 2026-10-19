/* Lámpara v5 · Iglesia (módulo de Personas): el foro de «El Buen Pastor».
   El segmento es un resumen: orar hoy, esta semana y los canales. La profundidad va en páginas propias:
   page-ig-canal, page-ig-hilo, page-ig-grupo y page-ig-evento. Publicar y Normas son hojas.
   Referencias: Church Center (agenda con «Voy», grupos), WhatsApp y Discord (canales, hilos, reacciones).
   Estado en L.S.igl (se crea al primer uso). Acciones con data-ig*, clases con ig-. Detalle en CAMBIOS-iglesia.md. */
(() => {
  const { esc, ic, av } = L;

  /* íconos que el núcleo todavía no tiene (Phosphor 2.1.1, MIT). Pedidos en CAMBIOS-iglesia.md */
  const IGI = {
    'location-outline': '<path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"/>',
    'notifications-off-outline': '<path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L58.82,63.8A79.59,79.59,0,0,0,48,104c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.8a40,40,0,0,0,78.4,0h15.44l19.44,21.38a8,8,0,1,0,11.84-10.76ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a63.65,63.65,0,0,1,6.26-27.62L168.09,184Zm166-4.73a8.13,8.13,0,0,1-2.93.55,8,8,0,0,1-7.44-5.08C196.35,156.19,192,129.75,192,104A64,64,0,0,0,96.43,48.31a8,8,0,0,1-7.9-13.91A80,80,0,0,1,208,104c0,35.35,8.05,58.59,10.52,64.88A8,8,0,0,1,214,179.25Z"/>',
    'pin': '<path d="M235.33,104l-53.47,53.65c4.56,12.67,6.45,33.89-13.19,60A15.93,15.93,0,0,1,157,224c-.38,0-.75,0-1.13,0a16,16,0,0,1-11.32-4.69L96.29,171,53.66,213.66a8,8,0,0,1-11.32-11.32L85,159.71l-48.3-48.3A16,16,0,0,1,38,87.63c25.42-20.51,49.75-16.48,60.4-13.14L152,20.7a16,16,0,0,1,22.63,0l60.69,60.68A16,16,0,0,1,235.33,104Z"/>',
    'hand-heart': '<path d="M230.33,141.06a24.34,24.34,0,0,0-18.61-4.77C230.5,117.33,240,98.48,240,80c0-26.47-21.29-48-47.46-48A47.58,47.58,0,0,0,156,48.75,47.58,47.58,0,0,0,119.46,32C93.29,32,72,53.53,72,80c0,11,3.24,21.69,10.06,33a31.87,31.87,0,0,0-14.75,8.4L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56Zm-10.9,27.15-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9Z"/>',
    'hand-heart-outline': '<path d="M230.33,141.06a24.34,24.34,0,0,0-18.61-4.77C230.5,117.33,240,98.48,240,80c0-26.47-21.29-48-47.46-48A47.58,47.58,0,0,0,156,48.75,47.58,47.58,0,0,0,119.46,32C93.29,32,72,53.53,72,80c0,11,3.24,21.69,10.06,33a31.87,31.87,0,0,0-14.75,8.4L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM119.46,48A31.15,31.15,0,0,1,148.6,67a8,8,0,0,0,14.8,0,31.15,31.15,0,0,1,29.14-19C209.59,48,224,62.65,224,80c0,19.51-15.79,41.58-45.66,63.9l-11.09,2.55A28,28,0,0,0,140,112H100.68C92.05,100.36,88,90.12,88,80,88,62.65,102.41,48,119.46,48ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9Z"/>',
    'prohibit-outline': '<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.56,87.56,0,0,1-20.41,56.28L71.72,60.4A88,88,0,0,1,216,128ZM40,128A87.56,87.56,0,0,1,60.41,71.72L184.28,195.6A88,88,0,0,1,40,128Z"/>',
    'incognito': '<path d="M256,120a8,8,0,0,1-8,8H8a8,8,0,0,1,0-16H35.92l47.5-65.41a16,16,0,0,1,25.31-.72l12.85,14.9.2.23a7.95,7.95,0,0,0,12.44,0l.2-.23,12.85-14.9a16,16,0,0,1,25.31.72L220.08,112H248A8,8,0,0,1,256,120Zm-76,24a36,36,0,0,0-35.77,32H111.77a36,36,0,1,0-1.83,16h36.12A36,36,0,1,0,180,144Z"/>',
    'warning-outline': '<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"/>'
  };
  const ici = (n, cls) => (window.ICONS && ICONS[n]) || !IGI[n] ? ic(n, cls)
    : '<svg class="ico' + (cls ? ' ' + cls : '') + '" viewBox="0 0 256 256" aria-hidden="true">' + IGI[n] + '</svg>';
  const trim = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/[\s,;.:]+\S*$/, '') + '…' : s);

  /* ================= la iglesia ================= */
  const CHURCH = { n: 'El Buen Pastor', place: 'Sajonia, Asunción', members: 214 };
  const CH = [
    { id: 'anuncios', n: 'Anuncios', a: 'mensaje', i: 'megaphone', d: 'De los pastores', cat: 0 },
    { id: 'oracion', n: 'Oración', a: 'oracion', i: 'hands-praying', d: 'Pide oración y avisa que oras', cat: 0 },
    { id: 'testimonios', n: 'Testimonios', a: 'adoracion', i: 'sparkles', d: 'Lo que Dios hizo', cat: 0 },
    { id: 'preguntas', n: 'Preguntas', a: 'palabra', i: 'help-circle', d: 'Biblia y vida · responden los pastores', cat: 0 },
    { id: 'grupos', n: 'Grupos', a: 'encuentro', i: 'people', d: 'Grupos durante la semana', cat: 1 },
    { id: 'eventos', n: 'Eventos', a: 'diario', i: 'calendar', d: 'Anótate y entra en tu semana', cat: 1 },
    { id: 'servicio', n: 'Servicio', a: 'ayuno', i: 'hand-heart', d: 'Manos para servir', cat: 1 }
  ];
  const CHM = {}; CH.forEach(c => { CHM[c.id] = c; });
  /* 23 miembros y Juan Carlos. Pastores: Esteban (te acompaña) y Lidia */
  const M = {
    ER: { n: 'Esteban Rojas', f: 'Esteban', role: 'Pastor' }, LR: { n: 'Lidia Rojas', f: 'Lidia', role: 'Pastora' },
    MD: { n: 'Matías Duarte', f: 'Matías' }, LM: { n: 'Laura Méndez', f: 'Laura' }, RG: { n: 'Raúl González', f: 'Raúl' },
    DM: { n: 'Diego Martínez', f: 'Diego' }, MC: { n: 'Marcos Cabrera', f: 'Marcos' }, PB: { n: 'Pedro Báez', f: 'Pedro' },
    AG: { n: 'Ana Giménez', f: 'Ana' }, TS: { n: 'Tomás Sosa', f: 'Tomás' }, MA: { n: 'María Aguilar', f: 'María' },
    DV: { n: 'Daniel Vera', f: 'Daniel' }, SR: { n: 'Sofía Ramírez', f: 'Sofía' }, LO: { n: 'Lucas Ortega', f: 'Lucas' },
    CV: { n: 'Carmen Villalba', f: 'Carmen' }, NA: { n: 'Nilda Aquino', f: 'Nilda' }, HO: { n: 'Hugo Ortiz', f: 'Hugo' },
    RO: { n: 'Rosa Ortiz', f: 'Rosa' }, FC: { n: 'Fernanda Cáceres', f: 'Fernanda' }, GA: { n: 'Gustavo Ayala', f: 'Gustavo' },
    BN: { n: 'Blanca Núñez', f: 'Blanca' }, JF: { n: 'José Franco', f: 'José' }, VI: { n: 'Valeria Insfrán', f: 'Valeria' }
  };
  const GR = [
    { id: 'hombres', n: 'Grupo de hombres', s: 'Hombres', dow: 4, h: '19:00', place: 'Casa de Raúl · Sajonia', lead: 'JC', now: 'Romanos 8', mem: ['JC', 'RG', 'DM', 'MC', 'PB', 'DV', 'LO', 'JF'] },
    { id: 'jovenes', n: 'Jóvenes', s: 'Jóvenes', dow: 6, h: '18:30', place: 'Templo · Sajonia', lead: 'MD', now: 'Daniel: firmes en Babilonia', mem: ['MD', 'FC', 'TS', 'SR', 'GA', 'VI'] },
    { id: 'matrimonios', n: 'Matrimonios', s: 'Matrimonios', dow: 5, h: '20:00', place: 'Casa de Hugo y Rosa · Villa Morra', lead: 'HO', now: 'Efesios 5', every: 'cada 15 días', mem: ['HO', 'RO', 'DM', 'AG', 'PB'] },
    { id: 'mujeres', n: 'Mujeres', s: 'Mujeres', dow: 2, h: '09:00', place: 'Templo · Sajonia', lead: 'LM', now: 'El libro de Rut', mem: ['LM', 'LR', 'CV', 'NA', 'BN', 'MA', 'AG'] }
  ];
  const GRM = {}; GR.forEach(g => { GRM[g.id] = g; });
  /* reacciones con sentido (sin «me gusta»), según el canal */
  const RX = { amen: ['Amén', 'checkmark'], gracias: ['Gracias', 'heart'], gloria: ['¡Gloria a Dios!', 'sparkles'] };
  const CHRX = { anuncios: ['amen', 'gracias'], testimonios: ['gloria', 'amen'], preguntas: ['gracias'], grupos: ['amen'] };
  const COMPOSE = { oracion: '¿Por qué podemos orar?', testimonios: '¿Qué hizo Dios esta semana?', preguntas: '¿Qué te preguntas?' };
  const TYPES = [
    { k: 'oracion', ch: 'oracion', n: 'Oración', a: 'oracion', i: 'hands-praying', ph: '¿Por qué podemos orar?', anon: true },
    { k: 'testimonios', ch: 'testimonios', n: 'Testimonio', a: 'adoracion', i: 'sparkles', ph: '¿Qué hizo Dios?' },
    { k: 'preguntas', ch: 'preguntas', n: 'Pregunta', a: 'palabra', i: 'help-circle', ph: 'Sobre la Biblia o la vida', anon: true },
    { k: 'grupo', ch: 'grupos', n: 'Grupo', a: 'encuentro', i: 'people', ph: 'Escribe a tu grupo' }
  ];
  /* datos sensibles de terceros: aviso suave, no bloquea */
  const SENS = /\d{3}[\s.-]?\d{3}[\s.-]?\d{3,4}|@[\w-]+\.\w|hospital|sanatorio|cl[ií]nica|diagn[oó]stic|c[aá]ncer|\bvih\b|c[eé]dula|direcci[oó]n/i;
  const WHY = ['Datos de otra persona', 'Falta de respeto', 'Venta o publicidad', 'Otra cosa'];
  /* lo que llega en los días siguientes (Tu camino → Demo → Pasar de día) */
  const POOL = [
    { ch: 'oracion', by: 'GA', h: '06:50', t: 'Por mi familia: nos mudamos el sábado y hay mucho cansancio.', n: 8, thx: 'Gracias, hermano. Ya casi terminamos de embalar.' },
    { ch: 'testimonios', by: 'MC', h: '18:20', t: '¡Me llamaron de la entrevista! Empiezo el lunes. Gracias a todos los que oraron.', link: 'El lunes tengo una entrevista de trabajo', rx: { gloria: 31, amen: 9 }, answers: 'MC' },
    { ch: 'anuncios', by: 'ER', h: '08:00', t: 'Gracias por un domingo hermoso. La colecta para el comedor de Chacarita ya llenó dos cajas.', rx: { amen: 26, gracias: 17 } },
    { ch: 'preguntas', by: 'PB', h: '21:40', t: '¿Cómo oro por alguien que no quiere saber nada de Dios?', rx: { gracias: 4 },
      re: [{ by: 'ER', h: '22:10', t: 'Con constancia y sin discursos. Pídele a Dios oportunidades para servirlo. Lo conversamos el jueves.', ans: true, rx: { gracias: 6 } }] },
    { ch: 'grupos', grp: 'hombres', by: 'RG', h: '20:05', t: 'El jueves seguimos con Romanos 8:28–39. Traigan una pregunta cada uno.', rx: { amen: 5 } },
    { ch: 'servicio', by: 'LR', h: '11:30', t: 'Pintar el aula de los chicos', sv: { plus: 5, h: '08:00', place: 'Templo · Sajonia', need: 5, vol: ['TS'], note: 'Pintura y rodillos los pone la iglesia.' } }
  ];

  /* ================= fechas ================= */
  const T = () => L.today();
  const nd = dow => L.addDays(T(), (dow - T().getDay() + 7) % 7);         /* la próxima vez que cae ese día (hoy incluido) */
  const dd = d => L.diffDays(d, T());
  const ts = p => L.fromDk(p.day).getTime() + L.mins(p.h) * 6e4;
  function when(day, h) {
    const d = L.fromDk(day), n = dd(d);
    if (n === 0) return h || 'ahora';
    if (n === -1) return 'ayer';
    if (n > -7) return L.DS[d.getDay()].toLowerCase();
    return L.short(d);
  }
  const dayLabel = d => { const n = dd(d); return n === 0 ? 'Hoy' : n === 1 ? 'Mañana' : n > 1 && n < 7 ? L.cap(L.DN[d.getDay()]) : L.DS[d.getDay()] + ' ' + L.short(d); };
  const phrase = d => { const n = dd(d); return n === 0 ? 'hoy' : n === 1 ? 'mañana' : 'el ' + L.DN[d.getDay()]; };

  /* ================= estado ================= */
  function seed() {
    const t0 = T(), ago = n => L.dk(L.addDays(t0, -n)), on = (dow, plus) => L.dk(L.addDays(nd(dow), plus || 0));
    let k = 1;
    const P = (ch, by, d, h, t, x) => Object.assign({ id: 's' + (k++), ch, by, day: ago(d), h, t, rx: {}, my: {}, re: [] }, x || {});
    const R = (by, d, h, t, x) => Object.assign({ id: 'r' + (k++), by, day: ago(d), h, t, rx: {}, my: {} }, x || {});
    const posts = [
      P('anuncios', 'ER', 0, '07:30', 'Este domingo celebramos la Santa Cena. Llega diez minutos antes: empezamos orando juntos.', { pin: true, u: true, rx: { amen: 38, gracias: 6 },
        re: [R('CV', 0, '08:02', '¡Amén! Ahí estaremos.', { rx: { amen: 3 } }), R('GA', 0, '08:40', 'El sonido queda listo el sábado.')] }),
      P('anuncios', 'ER', 2, '19:10', '21 días por Asunción: esta semana oramos por Chacarita y Barrio Obrero. La invitación está en Planes.', { go: 'planes', rx: { amen: 22, gracias: 9 } }),
      P('anuncios', 'LR', 4, '10:05', 'Colecta de alimentos no perecederos para el comedor de Chacarita: déjalos en la entrada del templo hasta el sábado.', { rx: { amen: 15, gracias: 12 } }),

      P('oracion', 'JF', 0, '06:40', 'Por mi nieto, que se opera el viernes. Que todo salga bien y que sienta la paz de Dios.', { n: 24,
        thx: 'Gracias, Juan Carlos. Mi nieto ya está más tranquilo.', mod: 'Los pastores quitaron el nombre del hospital para cuidar su privacidad.',
        re: [R('LM', 0, '07:05', 'Orando, don José. Su nieto está en las manos de Dios.', { rx: { amen: 6 } })] }),
      P('oracion', 'BN', 0, '05:55', 'El sábado se cumple un año de la partida de mi esposo. Oren por consuelo para mí y mis hijos.', { n: 42, u: true,
        thx: 'Gracias por acordarte de nosotros. Dios te bendiga.',
        re: [R('LR', 0, '06:30', 'Blanca, el sábado paso a visitarte. Te queremos mucho.', { rx: { amen: 11 } }), R('CV', 0, '07:12', 'Te abrazo, hermana.', { rx: { amen: 4 } })] }),
      P('oracion', null, 1, '23:10', 'Estoy pasando una temporada de mucha ansiedad. Pido oración por paz y por poder descansar.', { anon: true, n: 31,
        thxBy: 'ER', thx: 'Gracias por orar. Le conté que la iglesia está orando.',
        re: [R('ER', 0, '06:15', 'Gracias por animarte a pedir. Filipenses 4:6–7 es para ti hoy. Si quieres conversar, escríbeme.', { rx: { amen: 9 } })] }),
      P('oracion', 'LO', 1, '21:00', 'Quiero bautizarme en los próximos bautismos. Oren para que mi familia lo entienda.', { n: 29, u: true,
        thx: 'Gracias. Ayer mi mamá me preguntó a qué hora es el bautismo.',
        re: [R('ER', 1, '21:30', '¡Qué alegría, Lucas! Oramos por tu familia y te acompañamos.', { rx: { amen: 14 } })] }),
      P('oracion', 'MC', 2, '13:20', 'El lunes tengo una entrevista de trabajo. Hace cuatro meses que busco.', { n: 17, thx: 'Gracias, hermano. Te cuento cómo me fue.' }),
      P('oracion', null, 3, '22:45', 'Por mi matrimonio. Empezamos consejería con los pastores: oren por humildad para los dos.', { anon: true, n: 19,
        thxBy: 'LR', thx: 'Gracias por sostener a este matrimonio en oración.' }),
      P('oracion', 'AG', 6, '18:00', 'Por la escuelita de Chacarita: que este sábado lleguen más chicos.', { n: 36, ans: { t: 'Vinieron 23 chicos', day: ago(2) } }),

      P('testimonios', 'FC', 0, '09:15', 'Volvimos del campamento: nueve chicos piden bautizarse. ¡Gracias por cada oración y cada empanada vendida!', { u: true, rx: { gloria: 64, amen: 20 },
        re: [R('MD', 0, '09:40', '¡Gloria a Dios! Qué semana.', { rx: { amen: 8 } })] }),
      P('testimonios', 'DV', 2, '20:30', 'Primera semana en el trabajo nuevo. La ansiedad no se fue de golpe, pero Filipenses 4:6 me sostiene cada mañana. Gracias a los que oraron.', { link: 'Paz en medio de la ansiedad', rx: { gloria: 27, amen: 11 } }),
      P('testimonios', 'CV', 5, '17:00', 'Hace un mes les pedí oración por mis estudios. El médico dijo que está todo bien. ¡Dios es fiel!', { link: 'Mis estudios médicos', rx: { gloria: 52, amen: 18 },
        re: [R('NA', 5, '17:30', '¡Gloria a Dios, Carmen!'), R('LR', 5, '18:05', 'Lo celebramos el domingo.', { rx: { amen: 6 } })] }),

      P('preguntas', 'TS', 1, '22:10', '¿Cómo sé si es Dios quien me habla o son mis propias ideas?', { u: true, rx: { gracias: 14 },
        re: [R('ER', 0, '07:50', 'Tres preguntas ayudan: ¿concuerda con la Biblia? ¿Te acerca a Jesús y a los demás? ¿Lo confirman hermanos maduros? Lo que viene de Dios se sostiene en el tiempo.', { ans: true, rx: { gracias: 16 } }),
          R('LM', 0, '08:30', 'A mí me ayuda escribirlo y orar una semana antes de decidir.', { rx: { amen: 5 } })] }),
      P('preguntas', null, 3, '23:30', '¿Está mal enojarme con Dios?', { anon: true, rx: { gracias: 21 },
        re: [R('LR', 2, '09:00', 'No es pecado decirle lo que sientes: los Salmos están llenos de eso (mira el Salmo 13). Lo que sana es seguir hablándole. Si quieres, conversamos.', { ans: true, rx: { gracias: 25 } })] }),
      P('preguntas', 'SR', 4, '16:40', '¿Por dónde empiezo a leer los Salmos? Me pierdo.', { rx: { gracias: 8 },
        re: [R('FC', 4, '17:05', 'Yo empecé con el 23, 27, 46 y 91. Uno por día.', { rx: { amen: 3 } }),
          R('ER', 3, '08:00', 'En Planes → Explorar está «Salmos en 30 días»: cinco salmos por día y un versículo para llevar.', { ans: true, rx: { gracias: 6 } })] }),

      P('grupos', 'RG', 1, '20:15', 'El jueves nos juntamos en casa. Traigan su Biblia; el tereré corre por mi cuenta.', { grp: 'hombres', u: true, rx: { amen: 6 },
        re: [R('PB', 1, '20:40', 'Ahí estaré.'), R('LO', 1, '21:02', 'Llevo chipa.', { rx: { amen: 4 } })] }),
      P('grupos', 'JC', 3, '07:00', 'Para el jueves: lean Romanos 8 y traigan un versículo que les haya hablado.', { grp: 'hombres', rx: { amen: 7 } }),
      P('grupos', 'MD', 0, '10:20', 'Este sábado arrancamos Daniel 3: el horno de fuego. Inviten a un amigo.', { grp: 'jovenes', u: true, rx: { amen: 9 },
        re: [R('FC', 0, '10:45', '¡Llevo la guitarra!', { rx: { amen: 3 } })] }),
      P('grupos', 'HO', 2, '21:00', 'El viernes toca Efesios 5:21–33. Los chicos pueden venir: hay quien los cuide.', { grp: 'matrimonios', rx: { amen: 4 },
        re: [R('RO', 2, '21:20', 'Hago sopa paraguaya.')] }),
      P('grupos', 'LM', 1, '18:30', 'El martes a las 9 seguimos con Rut 2. Trae tu Biblia y algo para compartir en el mate.', { grp: 'mujeres', rx: { amen: 8 } }),

      P('eventos', 'ER', 6, '10:00', 'Culto dominical', { ev: { a: 'adoracion', dow: 0, h: '10:00', place: 'Templo · Sajonia', note: 'Este domingo celebramos la Santa Cena.' } }),
      P('eventos', 'LM', 3, '09:00', 'Vigilia de oración', { u: true, ev: { a: 'oracion', date: on(5), h: '22:00', place: 'Templo · Sajonia', note: 'Hasta la medianoche. Trae abrigo y tu Biblia.', n: 26 } }),
      P('eventos', 'ER', 5, '18:30', 'Retiro de hombres «Hierro con hierro»', { ev: { a: 'encuentro', date: on(6, 7), h: '07:00', place: 'Ypacaraí', note: 'Proverbios 27:17. Un sábado entero para afilarnos.', cap: 40, n: 31 },
        re: [R('PB', 2, '19:00', '¿Salimos juntos desde el templo?'), R('ER', 2, '19:20', 'Sí: 6:30 desde el templo. Hay lugar en dos autos.', { rx: { amen: 5 } })] }),
      P('eventos', 'ER', 1, '11:00', 'Bautismos', { ev: { a: 'adoracion', date: on(0, 14), h: '10:00', place: 'Templo · Sajonia', note: 'En el culto. Doce hermanos se bautizan.', n: 120 } }),

      P('servicio', 'AG', 1, '12:00', 'Limpieza del templo', { sv: { date: on(6), h: '08:00', place: 'Templo · Sajonia', need: 6, vol: ['NA', 'GA', 'VI'] } }),
      P('servicio', 'NA', 1, '15:30', 'Cocina para el almuerzo del domingo', { sv: { date: on(0), h: '08:30', place: 'Templo · Sajonia', need: 4, vol: ['NA', 'RO'] } }),
      P('servicio', 'LR', 2, '11:00', 'Llevar a una hermana mayor al culto', { sv: { date: on(0), h: '09:15', place: 'Lambaré', need: 1, vol: [], priv: true } }),
      P('servicio', 'AG', 4, '09:00', 'Maestros para la escuelita de Chacarita', { sv: { date: on(6), h: '15:00', place: 'Chacarita', need: 3, vol: ['AG'], note: 'Niños de 6 a 9 años. Hay material preparado.' } })
    ];
    const imported = {}; (L.S.posts || []).forEach(p => { imported[p.id] = 1; });
    return { v: 1, posts, groups: {}, mutedCh: [], mutedP: [], hidden: [], normsOk: false, reminded: null, day: 0, nextId: 1, imported };
  }
  function st() {
    const S = L.S;
    if (!S.igl || S.igl.v !== 1) S.igl = seed();
    const I = S.igl;
    /* lo que otros módulos publican en L.S.posts (p. ej. «En Testimonios» desde Oración) entra al foro */
    (S.posts || []).forEach(p => {
      if (I.imported[p.id]) return;
      I.imported[p.id] = 1;
      if (p.by === 'JC' && CHM[p.ch]) I.posts.unshift({ id: 'c' + p.id, ch: p.ch, by: 'JC', day: L.tk(), h: L.nowHM(), t: p.t, rx: {}, my: {}, re: [], n: p.ch === 'oracion' ? 0 : undefined });
    });
    return I;
  }
  const find = id => st().posts.find(p => p.id === id);

  /* memoria de la interfaz (no es estado) */
  const fresh = new Set(), revealed = new Set();
  let justPosted = null, justReply = null, gen = 0;
  const later = (ms, fn) => { const g = gen; setTimeout(() => { if (g === gen) { try { fn(); } catch (e) { console.error(e); } } }, L.RM() ? Math.min(ms, 1500) : ms); };
  const commit = () => { L.save(); L.refresh(); };
  /* con la barra de pestañas escondida, el aviso no se ancla a ella (pedido al núcleo) */
  function tst(msg, o) {
    L.toast(msg, o);
    if (!document.querySelector('ion-tabs.notabs')) return;
    const all = document.querySelectorAll('ion-toast'), t = all[all.length - 1];
    if (t && t.positionAnchor === 'tabbar') { t.positionAnchor = undefined; t.position = 'top'; }
  }

  /* ================= quién ve qué ================= */
  const isPastor = id => !!(M[id] && M[id].role);
  const inGroup = gid => { const g = GRM[gid], s = st().groups[gid]; return !!g && (g.mem.includes('JC') ? s !== 'no' : s === 'si'); };
  const members = g => g.mem.filter(id => id !== 'JC' || inGroup(g.id)).concat(!g.mem.includes('JC') && inGroup(g.id) ? ['JC'] : []);
  const myGroups = () => GR.filter(g => inGroup(g.id));
  const visible = p => !p.grp || inGroup(p.grp);
  const isHidden = id => st().hidden.includes(id);
  const isMutedP = x => !!x.by && !x.anon && st().mutedP.includes(x.by) && !revealed.has(x.id);
  const isMutedCh = ch => st().mutedCh.includes(ch);
  const shown = p => visible(p) && !isHidden(p.id) && !isMutedP(p);
  const unread = ch => st().posts.filter(p => p.u && p.ch === ch && shown(p)).length;
  const unreadAll = () => CH.reduce((s, c) => s + (isMutedCh(c.id) ? 0 : unread(c.id)), 0);
  function nm(id) {
    if (id === 'JC') return 'Tú';
    const m = M[id]; if (!m) return id;
    if (m.role) return m.n;
    const w = m.n.split(' '); return w[0] + ' ' + w[w.length - 1][0] + '.';
  }
  const first = id => id === 'JC' ? 'Juan Carlos' : M[id] ? M[id].f : id;
  const fullN = id => id === 'JC' ? 'Juan Carlos Benítez' : (M[id] || {}).n || id;
  const pc = id => ' style="--pc:' + L.avColor(id) + '"';
  const evDate = p => (p.ev.dow != null ? nd(p.ev.dow) : L.fromDk(p.ev.date));
  const svDate = p => L.fromDk(p.sv.date);
  /* ¿ya está en tu rutina a esa hora? (el culto del domingo, los bautismos dentro del culto) */
  function inRoutine(p) {
    const d = evDate(p), w = d.getDay(), k = L.dk(d);
    return L.S.routine.some(r => r.id !== 'ig-' + p.id && r.a === p.ev.a && r.h === p.ev.h && (r.once ? r.once === k : r.days.includes(w)));
  }
  const going = p => !!p.my.go || inRoutine(p);
  const groupInWeek = g => L.S.routine.some(r => r.a === 'encuentro' && r.days && r.days.includes(g.dow) && r.h === g.h);

  /* ================= piezas ================= */
  function avatar(x, size) {
    return x.anon || !x.by ? '<span class="av anon" style="--s:' + size + 'px">' + ici('incognito') + '</span>' : av(x.by, fullN(x.by), size);
  }
  function byline(x, size, p) {
    const anon = x.anon || !x.by;
    const name = anon ? (x.by === 'JC' ? 'Anónimo · tú' : 'Anónimo') : nm(x.by);
    let role = '';
    if (!anon && isPastor(x.by)) role = '<span class="ig-role">' + M[x.by].role + '</span>';
    else if (!anon && p && p.grp && GRM[p.grp].lead === x.by) role = '<span class="ig-role">Líder</span>';
    return '<div class="ig-by">' + avatar(x, size) + '<div class="ig-who"><b class="ig-nm' + (anon ? ' anon' : '') + '"' + (anon ? '' : pc(x.by)) + '>' + esc(name) + '</b>' + role +
      (fresh.has(x.id) ? '<span class="ig-new">Nuevo</span>' : '') + '<small>' + when(x.day, x.h) + '</small></div></div>';
  }
  const prayed = p => p.prayed === L.tk();
  const prayN = p => (p.n || 0) + (p.me ? 1 : 0);
  function prayBtn(p, cls) {
    if (p.by === 'JC') return '<span class="ig-pray mine' + (cls ? ' ' + cls : '') + '">' + ic('hands-praying') + '<span>' + (prayN(p) ? prayN(p) + (prayN(p) === 1 ? ' persona ora' : ' personas oran') + ' contigo' : 'Te avisamos cuando oren') + '</span></span>';
    const on = prayed(p);
    return '<button class="ig-pray' + (on ? ' on' : '') + (cls ? ' ' + cls : '') + '" data-igpray="' + p.id + '" aria-pressed="' + on + '">' + ic(on ? 'hands-praying' : 'hands-praying-outline') +
      '<span>' + (on ? 'Orando' : 'Estoy orando') + '</span><b>' + prayN(p) + '</b></button>';
  }
  function rxBtn(p, k, r) {
    const x = r || p, on = !!x.my[k], n = (x.rx[k] || 0) + (on ? 1 : 0);
    return '<button class="ig-rx' + (on ? ' on' : '') + '" data-igrx="' + p.id + ':' + k + (r ? ':' + r.id : '') + '" aria-pressed="' + on + '">' + ic(RX[k][1]) +
      '<span>' + RX[k][0] + '</span>' + (n ? '<b>' + n + '</b>' : '') + '</button>';
  }
  const rxKeys = p => p.ch === 'oracion' ? (p.ans ? ['gloria', 'amen'] : []) : (CHRX[p.ch] || ['amen']);
  const thxWho = p => p.anon || !p.by ? (p.thxBy || 'ER') : p.by;
  function thxHTML(p) {
    if (!p.thxShown || !p.thx) return '';
    const w = thxWho(p);
    return '<div class="ig-thx">' + av(w, fullN(w), 26) + '<p><b class="ig-nm"' + pc(w) + '>' + esc(first(w)) + '</b> te agradeció<span>«' + esc(p.thx) + '»</span></p></div>';
  }
  const linkTag = t => '<p class="ig-tag" data-a="oracion">' + ic('hands-praying') + '<span>Nació de una oración · «' + esc(trim(t, 40)) + '»</span></p>';
  const ansTag = a => '<p class="ig-tag" data-a="adoracion">' + ic('star') + '<span>Dios respondió' + (a.t ? ' · ' + esc(a.t) : '') + '</span></p>';
  const modNote = t => '<p class="ig-mod">' + ic('shield-checkmark-outline') + '<span>' + esc(t) + '</span></p>';
  const dateTile = (d, big) => '<span class="ig-date' + (big ? ' big' : '') + '"><small>' + (dd(d) === 0 ? 'Hoy' : L.DS[d.getDay()]) + '</small><b>' + d.getDate() + '</b></span>';
  const meta = (d, h, place, extra) => '<p class="ig-meta"><span>' + ic('time-outline') + dayLabel(d) + ' ' + h + (extra || '') + '</span><span>' + ici('location-outline') + esc(place) + '</span></p>';
  function stack(ids, max, size) {
    const s = size || 26;
    return '<span class="ig-stack">' + ids.slice(0, max).map(id => av(id, fullN(id), s)).join('') + (ids.length > max ? '<span class="ig-plus" style="--s:' + s + 'px">+' + (ids.length - max) + '</span>' : '') + '</span>';
  }
  function cupo(n, cap, word) {
    const left = Math.max(0, cap - n);
    return '<div class="ig-cupo"><div class="pbar"><i style="width:' + Math.min(100, n / cap * 100).toFixed(1) + '%"></i></div><small>' + (left ? word + ' ' + left : 'Completo') + '</small></div>';
  }
  const empty = (t, i) => '<div class="empty">' + ic(i || 'chatbubbles-outline') + '<b>' + esc(t || 'Todavía nada por aquí') + '</b></div>';

  /* ---------- tarjetas ---------- */
  function postCard(p) {
    if (isHidden(p.id)) return '<p class="ig-gone">' + ic('flag-outline') + 'Reportaste esto · lo revisan los pastores</p>';
    if (isMutedP(p)) return '<button class="ig-gone" data-igreveal="' + p.id + '">' + ici('notifications-off-outline') + 'De alguien que silenciaste · Ver</button>';
    const nre = p.re.filter(r => !isHidden(r.id)).length;
    let h = '<article class="ig-post' + (p.by === 'JC' ? ' mine' : '') + (p.id === justPosted ? ' just' : '') + '" data-a="' + CHM[p.ch].a + '" data-post="' + p.id + '">';
    if (p.pin) h += '<p class="ig-pinned">' + ici('pin') + 'Fijado por los pastores</p>';
    h += byline(p, 36, p) + '<p class="ig-t">' + esc(p.t) + '</p>';
    if (p.mod) h += modNote(p.mod);
    if (p.link) h += linkTag(p.link);
    if (p.ans) h += ansTag(p.ans);
    if (p.go) h += '<button class="ig-golink" data-iggoto="' + p.go + '">' + ic('calendar-outline') + 'Ver la invitación en Planes' + ic('chevron-forward') + '</button>';
    if (p.ch === 'preguntas') {
      const r = p.re.find(x => x.ans && !isHidden(x.id));
      if (r) h += '<div class="ig-apv"><small>' + ic('star') + (M[r.by].role === 'Pastora' ? 'Responde la pastora ' : 'Responde el pastor ') + M[r.by].f + '</small><p>' + esc(r.t) + '</p></div>';
    }
    h += thxHTML(p);
    h += '<div class="ig-acts">' + (p.ch === 'oracion' && !p.ans ? prayBtn(p) : '') + rxKeys(p).map(k => rxBtn(p, k)).join('') +
      '<span class="ig-rc">' + ic('chatbubble-outline') + (nre || '') + '</span></div></article>';
    return h;
  }
  function goBtn(p) {
    const e = p.ev, on = going(p), full = !!(e.cap && e.n >= e.cap && !on);
    return '<button class="ig-go' + (on ? ' on' : '') + '" data-iggo="' + p.id + '"' + (full ? ' disabled' : '') + ' aria-pressed="' + on + '">' + (on ? ic('checkmark') + 'Vas' : full ? 'Completo' : ic('add') + 'Voy') + '</button>';
  }
  const goN = p => p.ev.n != null ? p.ev.n + (p.my.go ? 1 : 0) : null;
  function evCard(p) {
    if (isHidden(p.id)) return '';
    const e = p.ev, d = evDate(p), n = goN(p);
    return '<article class="ig-evc" data-a="' + e.a + '" data-igev="' + p.id + '">' + (fresh.has(p.id) ? '<span class="ig-new abs">Nuevo</span>' : '') + dateTile(d) + '<div class="ig-evx"><b>' + esc(p.t) + '</b>' +
      meta(d, e.h, e.place.split(' · ')[0], e.dow != null ? ' · cada ' + L.DN[e.dow] : '') + (e.cap ? cupo(n, e.cap, 'Quedan') : '') +
      '<div class="ig-evrow"><span class="ig-goes">' + (e.cap ? n + ' de ' + e.cap : n != null ? n + ' van' : inRoutine(p) ? 'En tu semana' : '') + '</span>' + goBtn(p) + '</div></div></article>';
  }
  function sumoBtn(p) {
    const s = p.sv, mine = s.vol.includes('JC'), full = s.vol.length >= s.need && !mine;
    return '<button class="ig-go' + (mine ? ' on' : '') + '" data-igsumo="' + p.id + '"' + (full ? ' disabled' : '') + ' aria-pressed="' + mine + '">' + (mine ? ic('checkmark') + 'Te sumaste' : full ? 'Completo' : ic('add') + 'Me sumo') + '</button>';
  }
  function svCard(p) {
    if (isHidden(p.id)) return '';
    const s = p.sv, d = svDate(p);
    return '<article class="ig-evc" data-a="ayuno" data-igev="' + p.id + '">' + (fresh.has(p.id) ? '<span class="ig-new abs">Nuevo</span>' : '') + dateTile(d) + '<div class="ig-evx"><b>' + esc(p.t) + '</b>' +
      meta(d, s.h, s.place.split(' · ')[0]) + cupo(s.vol.length, s.need, 'Faltan') +
      '<div class="ig-evrow">' + (s.priv ? '<span class="ig-goes">' + ic('lock-closed-outline') + 'Detalles en privado</span>' : s.vol.length ? stack(s.vol, 4, 24) : '<span class="ig-goes">Sé el primero</span>') + sumoBtn(p) + '</div></div></article>';
  }
  function groupTag(g, hero) {
    const s = st().groups[g.id];
    if (g.lead === 'JC') return '<span class="ig-role on">Lideras</span>';
    if (inGroup(g.id)) return '<span class="ig-role on">Eres parte</span>';
    if (s === 'pedido') return '<span class="ig-role">Pedido enviado</span>';
    return hero ? '' : '<button class="ig-go" data-igjoin="' + g.id + '">' + ic('add') + 'Unirme</button>';
  }
  function groupCard(g) {
    const u = inGroup(g.id) ? st().posts.filter(p => p.grp === g.id && p.u && shown(p)).length : 0;
    return '<article class="ig-grc" data-a="encuentro" data-iggrp="' + g.id + '"><div class="ig-grtop"><span class="ig-gtile">' + ic('people') + '</span><div class="ig-evx"><b>' + esc(g.n) + '</b>' +
      '<p class="ig-meta"><span>' + ic('time-outline') + L.cap(L.DN[g.dow]) + ' ' + g.h + (g.every ? ' · ' + g.every : '') + '</span><span>' + ici('location-outline') + esc(g.place.split(' · ')[0]) + '</span></p></div>' +
      (u ? '<span class="ig-ub">' + u + '</span>' : '') + '</div><p class="ig-now">' + ic('book-outline') + 'Estudian ' + esc(g.now) + '</p>' +
      '<div class="ig-evrow">' + stack(members(g), 5) + groupTag(g) + '</div></article>';
  }

  /* ================= Personas → Iglesia: el resumen ================= */
  function prayToday() {
    return st().posts.filter(p => p.ch === 'oracion' && !p.ans && p.by !== 'JC' && shown(p) && dd(L.fromDk(p.day)) >= -1)
      .sort((a, b) => (prayed(a) - prayed(b)) || ts(b) - ts(a));
  }
  function prayCard(p) {
    return '<article class="ig-pc" data-a="oracion" data-post="' + p.id + '">' +
      '<header>' + avatar(p, 30) + '<b>' + esc(p.anon || !p.by ? 'Anónimo' : nm(p.by)) + '</b><small>' + when(p.day, p.h) + '</small></header>' +
      '<p>' + esc(p.t) + '</p>' + (p.thxShown && p.thx ? '<p class="ig-pc-thx">' + ic('heart') + esc(first(thxWho(p))) + ' te agradeció</p>' : '') +
      '<footer>' + prayBtn(p, 'inv') + (p.re.length ? '<span class="ig-rc">' + ic('chatbubble-outline') + p.re.length + '</span>' : '') + '</footer></article>';
  }
  function weekItems() {
    const out = [];
    myGroups().forEach(g => out.push({ k: 'g', g, d: nd(g.dow), h: g.h }));
    st().posts.filter(p => p.ev && !isHidden(p.id)).forEach(p => { const d = evDate(p), n = dd(d); if (n >= 0 && n <= 13) out.push({ k: 'e', p, d, h: p.ev.h }); });
    return out.sort((x, y) => (x.d - y.d) || L.mins(x.h) - L.mins(y.h));
  }
  function wkCard(x) {
    if (x.k === 'g') return '<div class="ig-wk" data-a="encuentro" data-iggrp="' + x.g.id + '" role="button">' + dateTile(x.d) + '<b>' + esc(x.g.n) + '</b><small>' + x.h + ' · ' + esc(x.g.place.split(' · ')[0]) + '</small>' +
      '<span class="ig-wkst">' + ic('people') + (x.g.lead === 'JC' ? 'Lo lideras' : 'Tu grupo') + '</span></div>';
    const p = x.p;
    return '<div class="ig-wk" data-a="' + p.ev.a + '" data-igev="' + p.id + '" role="button">' + dateTile(x.d) + '<b>' + esc(p.t) + '</b><small>' + x.h + ' · ' + esc(p.ev.place.split(' · ')[0]) + '</small>' + goBtn(p) + '</div>';
  }
  const latest = ch => st().posts.filter(p => p.ch === ch && !p.grp && shown(p)).sort((a, b) => ts(b) - ts(a))[0];
  function chPreview(c) {
    const S = st();
    if (c.id === 'grupos') {
      const g = myGroups(), last = S.posts.filter(p => p.grp && shown(p)).sort((a, b) => ts(b) - ts(a))[0];
      return last ? '<b>' + esc(GRM[last.grp].s) + ' · ' + esc(first(last.by)) + ':</b> ' + esc(last.t) : g.length ? 'Tu grupo: ' + g.map(x => x.s).join(', ') : 'Cuatro grupos durante la semana';
    }
    if (c.id === 'eventos') {
      const e = S.posts.filter(p => p.ev && !isHidden(p.id) && dd(evDate(p)) >= 0).sort((a, b) => evDate(a) - evDate(b))[0];
      return e ? '<b>' + esc(dayLabel(evDate(e))) + ' ' + e.ev.h + ':</b> ' + esc(e.t) : c.d;
    }
    if (c.id === 'servicio') {
      const sv = S.posts.filter(p => p.sv && !isHidden(p.id) && dd(svDate(p)) >= 0), miss = sv.reduce((s, p) => s + Math.max(0, p.sv.need - p.sv.vol.length), 0);
      return miss ? '<b>Faltan ' + miss + ' manos</b> en ' + sv.length + ' necesidades' : 'Todo cubierto. ¡Gracias!';
    }
    const l = latest(c.id);
    return l ? '<b>' + esc(l.anon || !l.by ? 'Anónimo' : first(l.by)) + ':</b> ' + esc(l.t) : esc(c.d);
  }
  function chRow(c) {
    const u = unread(c.id), mu = isMutedCh(c.id);
    const l = c.cat === 0 ? latest(c.id) : null;
    return '<ion-item button detail="false" data-igch="' + c.id + '" data-a="' + c.a + '" class="' + (u ? 'unread' : '') + '"><span class="ig-chic" slot="start">' + ici(c.i) + '</span>' +
      '<ion-label><h3>' + esc(c.n) + (c.id === 'anuncios' ? ic('lock-closed', 'ig-lk') : '') + '</h3><p>' + chPreview(c) + '</p></ion-label>' +
      '<div class="ig-chend" slot="end"><small>' + (l ? when(l.day, l.h) : '') + '</small>' + (mu ? '<span class="ig-ub mut">' + ici('notifications-off-outline') + (u || '') + '</span>' : u ? '<span class="ig-ub">' + u + '</span>' : '') + '</div></ion-item>';
  }
  function segHTML() {
    const pr = prayToday(), wk = weekItems(), left = pr.filter(p => !prayed(p)).length;
    return '<section class="ig-head"><div class="ig-head-top"><span class="ig-logo">' + ic('church') + '</span><div class="ig-hn"><h2>' + CHURCH.n + '</h2><p>' + CHURCH.place + ' · ' + CHURCH.members + ' miembros</p></div>' +
      '<button class="iconbtn" data-ignorms aria-label="Normas de la comunidad">' + ic('shield-checkmark-outline') + '</button></div>' +
      '<button class="ig-prompt" data-igcompose="">' + av('JC', 'Juan Carlos', 30) + '<span class="ig-pt">¿Qué quieres compartir?</span><i>' + ic('add') + '</i></button></section>' +
      (pr.length ? '<div class="sec"><h2>Orar hoy</h2><span class="muted">' + (left ? left + (left === 1 ? ' pedido' : ' pedidos') : 'Oraste por todos') + '</span></div><div class="ig-row' + (pr.length === 1 ? ' one' : '') + '" data-keep="pr">' + pr.map(prayCard).join('') + '</div>' : '') +
      (wk.length ? '<div class="sec"><h2>Esta semana</h2></div><div class="ig-row" data-keep="wk">' + wk.map(wkCard).join('') + '</div>' : '') +
      '<div class="sec"><h2>Conversación</h2></div><ion-list inset="true" lines="inset">' + CH.filter(c => c.cat === 0).map(chRow).join('') + '</ion-list>' +
      '<div class="sec"><h2>Vida de la iglesia</h2></div><ion-list inset="true" lines="inset">' + CH.filter(c => c.cat === 1).map(chRow).join('') + '</ion-list>' +
      '<p class="hint-swipe">' + ic('information-circle-outline') + 'Mantén presionado para responder o reportar</p>';
  }

  /* recordar el desplazamiento horizontal de las filas al redibujar */
  const SCR = new WeakMap();
  function keep(root, save) {
    if (!root) return;
    const rows = root.querySelectorAll('[data-keep]');
    if (save) { const m = {}; rows.forEach(r => { m[r.dataset.keep] = r.scrollLeft; }); SCR.set(root, m); return; }
    const m = SCR.get(root); if (m) rows.forEach(r => { if (m[r.dataset.keep]) r.scrollLeft = m[r.dataset.keep]; });
  }
  /* respuesta visual al reaccionar: el botón salta y su ícono sube */
  function bump(sel, icon) {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
      if (L.RM() || !el.isConnected || !el.offsetParent) return;
      const f = document.createElement('span'); f.className = 'ig-float'; f.innerHTML = icon; el.appendChild(f);
      f.animate([{ transform: 'translate(-50%, 0) scale(.5)', opacity: 0 }, { transform: 'translate(-50%, -22px) scale(1.25)', opacity: 1, offset: 0.35 }, { transform: 'translate(-50%, -46px) scale(1)', opacity: 0 }],
        { duration: 760, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = () => f.remove();
    });
  }
  const pushHere = (tag, props) => { const nav = document.getElementById('nav-' + L.tab()); return nav && nav.push(tag, props); };
  const tabsEl = () => document.querySelector('ion-tabs');

  /* ================= acciones ================= */
  function pray(id) {
    const p = find(id); if (!p || p.ans || p.by === 'JC') return;
    const tk = L.tk();
    if (p.prayed === tk) {
      p.prayed = null; if (p.meDay === tk) { p.me = false; p.meDay = null; }
      L.S.stats.prayOthers = Math.max(0, L.S.stats.prayOthers - 1); commit(); L.haptic(5); return;
    }
    p.prayed = tk; p.u = false;
    if (!p.me) { p.me = true; p.meDay = tk; }
    L.S.stats.prayOthers++;
    commit(); L.haptic(10);
    bump('[data-igpray="' + id + '"]', ic('hands-praying'));
    const who = p.anon || !p.by ? null : p.by;
    tst(who ? 'Le avisamos a ' + first(who) + ' que oras' : 'Estás orando · le avisamos a quien lo pidió', { icon: 'heart' });
    if (!p.thxShown && p.thx) later(4600, () => {
      const q = find(id); if (!q || q.prayed !== L.tk()) return;
      q.thxShown = 1; commit();
      tst(first(thxWho(q)) + ': «' + q.thx + '»', { icon: 'chatbubble' });
    });
    L.checkAch();
  }
  function react(pid, k, rid) {
    const p = find(pid); if (!p || !RX[k]) return;
    const x = rid ? p.re.find(r => r.id === rid) : p; if (!x) return;
    x.my[k] = !x.my[k]; if (!x.my[k]) delete x.my[k];
    commit();
    if (x.my[k]) { L.haptic(6); bump('[data-igrx="' + pid + ':' + k + (rid ? ':' + rid : '') + '"]', ic(RX[k][1])); }
  }
  function setGo(p, on) {
    const e = p.ev, d = evDate(p), rid = 'ig-' + p.id;
    L.S.routine = L.S.routine.filter(r => r.id !== rid);
    p.my.go = on;
    if (on) L.S.routine.push({ id: rid, a: e.a, t: p.t, h: e.h, days: e.dow != null ? [e.dow] : [], once: e.dow != null ? undefined : L.dk(d), n: CHURCH.n + ' · ' + e.place.split(' · ')[0] });
    commit();
  }
  function toggleGo(id) {
    const p = find(id); if (!p || !p.ev) return;
    const e = p.ev, d = evDate(p);
    if (p.my.go) { setGo(p, false); tst('Ya no vas · ' + p.t, { undo: () => setGo(p, true) }); return; }
    if (inRoutine(p)) { tst('Ya está en tu semana: ' + L.DN[d.getDay()] + ' ' + e.h, { icon: 'calendar' }); bump('[data-iggo="' + id + '"]', ic('checkmark')); return; }
    if (e.cap && goN(p) >= e.cap) return;
    setGo(p, true); L.haptic([8, 30, 12]);
    bump('[data-iggo="' + id + '"]', ic('checkmark'));
    const n = dd(d);
    tst('Vas · ' + (n < 7 ? 'agregado a tu ' + L.DN[d.getDay()] : 'en tu semana del ' + L.DN[d.getDay()] + ' ' + d.getDate()) + ' a las ' + e.h, { icon: 'calendar', undo: () => setGo(p, false) });
  }
  function toggleSumo(id) {
    const p = find(id); if (!p || !p.sv) return;
    const s = p.sv, i = s.vol.indexOf('JC');
    if (i >= 0) { s.vol.splice(i, 1); commit(); tst('Ya no estás anotado', { undo: () => { if (!s.vol.includes('JC')) s.vol.push('JC'); commit(); } }); return; }
    if (s.vol.length >= s.need) return;
    s.vol.push('JC'); commit(); L.haptic([8, 30, 12]);
    bump('[data-igsumo="' + id + '"]', ic('checkmark'));
    tst('Te sumaste · ' + p.t, { icon: 'checkmark', undo: () => { const j = s.vol.indexOf('JC'); if (j >= 0) s.vol.splice(j, 1); commit(); } });
    if (!p.my.thx) {
      p.my.thx = 1;
      later(4600, () => { const q = find(id); if (q && q.sv.vol.includes('JC')) tst(first(q.by) + ': «' + (q.sv.priv ? '¡Gracias! Te paso los datos por mensaje.' : '¡Gracias por sumarte! Nos vemos ' + phrase(svDate(q)) + '.') + '»', { icon: 'chatbubble' }); });
    }
  }
  function join(gid) {
    const S = st(), g = GRM[gid]; if (!g || inGroup(gid) || S.groups[gid] === 'pedido') return;
    S.groups[gid] = 'pedido'; commit(); L.haptic(8);
    tst('Le avisamos a ' + first(g.lead) + ', que lidera ' + g.s, { icon: 'paper-plane' });
    later(3200, () => {
      const T2 = st(); if (T2.groups[gid] !== 'pedido') return;
      T2.groups[gid] = 'si';
      let added = false;
      if (!g.every && !groupInWeek(g)) { L.S.routine.push({ id: 'ig-g-' + gid, a: 'encuentro', t: g.n, h: g.h, days: [g.dow], n: CHURCH.n + ' · ' + g.place.split(' · ')[0] }); added = true; }
      commit();
      tst(first(g.lead) + ': «¡Bienvenido! Te espero el ' + L.DN[g.dow] + '.»' + (added ? ' Ya está en tu semana.' : ''), { icon: 'people' });
    });
  }
  function leave(gid) {
    const g = GRM[gid]; if (!g || g.lead === 'JC' || !inGroup(gid)) return;
    L.actions('Salir de ' + g.n, [{ text: 'Salir del grupo', role: 'destructive', handler: () => {
      const S = st(), before = S.groups[gid], rt = L.S.routine.find(r => r.id === 'ig-g-' + gid);
      S.groups[gid] = 'no'; L.S.routine = L.S.routine.filter(r => r.id !== 'ig-g-' + gid); commit();
      tst('Saliste de ' + g.n, { undo: () => { S.groups[gid] = before; if (rt) L.S.routine.push(rt); commit(); } });
    } }], 'Dejas de ver lo que escribe el grupo y sale de tu semana.');
  }
  function remind(gid) {
    const S = st(), g = GRM[gid]; if (S.reminded === L.tk()) return;
    S.reminded = L.tk(); commit(); L.haptic(10);
    bump('[data-igremind]', ic('notifications'));
    tst('Recordatorio enviado a ' + (members(g).length - 1) + ' hombres', { icon: 'notifications', undo: () => { st().reminded = null; commit(); } });
    later(4800, () => tst('Daniel: «Ahí estaré. Llevo a un compañero del trabajo.»', { icon: 'chatbubble' }));
  }
  function reportAsk(pid, rid) {
    L.actions('Reportar', WHY.map(w => ({ text: w, handler: () => report(pid, rid) })), 'No le avisamos a quien lo escribió. Lo revisan los pastores.');
  }
  function report(pid, rid) {
    const S = st(), id = rid || pid; if (S.hidden.includes(id)) return;
    S.hidden.push(id); commit();
    tst('Gracias · lo revisan los pastores', { icon: 'shield-checkmark', undo: () => { st().hidden = st().hidden.filter(x => x !== id); commit(); } });
    later(4800, () => { if (st().hidden.includes(id)) tst('Esteban: «Gracias por cuidar la comunidad. Ya lo estamos viendo.»', { icon: 'shield-checkmark' }); });
  }
  function muteP(who, on) {
    const S = st();
    S.mutedP = S.mutedP.filter(x => x !== who); if (on) S.mutedP.push(who);
    commit();
    if (on) tst('Silenciaste a ' + first(who) + ' · no se entera', { icon: 'eye-off', undo: () => muteP(who, false) });
  }
  function muteCh(ch, on) {
    const S = st();
    S.mutedCh = S.mutedCh.filter(x => x !== ch); if (on) S.mutedCh.push(ch);
    commit();
    tst(on ? 'Silenciaste ' + CHM[ch].n + ' · no suma al punto de Personas' : 'Vuelves a ver los avisos de ' + CHM[ch].n, { icon: on ? 'notifications-off' : 'notifications', undo: () => muteCh(ch, !on) });
  }
  function markRead(ch) { st().posts.forEach(p => { if (p.ch === ch && p.u && shown(p)) p.u = false; }); commit(); }
  function del(pid, rid) {
    const S = st(), p = find(pid); if (!p) return;
    if (rid) {
      const i = p.re.findIndex(r => r.id === rid); if (i < 0) return;
      const [r] = p.re.splice(i, 1); commit();
      tst('Respuesta borrada', { undo: () => { p.re.splice(i, 0, r); commit(); } });
      return;
    }
    const i = S.posts.indexOf(p); S.posts.splice(i, 1); commit();
    tst('Publicación borrada', { undo: () => { st().posts.splice(i, 0, p); commit(); } });
  }
  function answered(id) {
    const p = find(id); if (!p || p.by !== 'JC' || p.ans) return;
    const t = trim(p.t, 60);
    p.ans = { t: '', day: L.tk() };
    L.S.answered.unshift({ who: 'yo', t, d: L.tk() });
    commit(); L.haptic([10, 40, 16]);
    setTimeout(() => { const c = document.querySelector('.ig-ansdone .coin'); if (c) L.sparks(c, 18); }, 250);
    tst('Dios respondió · queda en Oración → Respondidas', { icon: 'star', undo: () => { delete p.ans; L.S.answered = L.S.answered.filter(a => !(a.who === 'yo' && a.t === t && a.d === L.tk())); commit(); } });
  }

  /* ---------- mantener presionado: vista previa, reacciones arriba (WhatsApp) y menú ---------- */
  function postMenu(pid, rid, el, page) {
    const p = find(pid); if (!p) return;
    const x = rid ? p.re.find(r => r.id === rid) : p; if (!x || isHidden(x.id)) return;
    const mine = x.by === 'JC', who = !x.anon && x.by && x.by !== 'JC' ? x.by : null;
    const keys = rid ? [x.ans ? 'gracias' : 'amen'] : p.ch === 'oracion' && !p.ans && !mine ? ['pray'] : rxKeys(p);
    const bar = keys.length ? '<div class="ig-rxbar">' + keys.map(k => k === 'pray'
      ? '<button data-cx="pray" class="' + (prayed(p) ? 'on' : '') + '">' + ic('hands-praying') + (prayed(p) ? 'Orando' : 'Estoy orando') + '</button>'
      : '<button data-cx="' + k + '" class="' + (x.my[k] ? 'on' : '') + '">' + ic(RX[k][1]) + RX[k][0] + '</button>').join('') + '</div>' : '';
    const prev = bar + '<div class="ig-cxp">' + byline(x, 30, p) + '<p>' + esc(trim(x.t, 150)) + '</p></div>';
    const items = [{ text: 'Responder', icon: 'chatbubble-outline', handler: () => replyTo(p, x, page) }];
    if (keys.length) items.push({ text: 'Reaccionar', icon: 'happy-outline', handler: () => L.actions('Reaccionar', keys.map(k => ({ text: k === 'pray' ? 'Estoy orando' : RX[k][0], handler: () => (k === 'pray' ? pray(pid) : react(pid, k, rid)) }))) });
    if (mine && !rid && p.ch === 'oracion' && !p.ans) items.push({ text: 'Dios respondió', icon: 'star-outline', handler: () => answered(pid) });
    if (who && !isPastor(who)) items.push(st().mutedP.includes(who) ? { text: 'Dejar de silenciar a ' + first(who), icon: 'eye-outline', handler: () => muteP(who, false) } : { text: 'Silenciar a ' + first(who), icon: 'eye-off-outline', handler: () => muteP(who, true) });
    if (mine) items.push({ text: rid ? 'Borrar respuesta' : 'Borrar publicación', icon: 'trash-outline', danger: true, handler: () => del(pid, rid) });
    else items.push({ text: 'Reportar', icon: 'flag-outline', danger: true, handler: () => reportAsk(pid, rid) });
    L.context(el, prev, items, CHM[p.ch].a);
    const boxes = document.querySelectorAll('ion-app > .ctx'), box = boxes[boxes.length - 1], rb = box && box.querySelector('.ig-rxbar');
    if (rb) rb.addEventListener('click', e => {
      const b = e.target.closest('[data-cx]'); if (!b) return;
      e.stopPropagation(); b.classList.add('on', 'pop'); L.haptic(8);
      setTimeout(() => { box.querySelector('.ctx-bg').click(); setTimeout(() => (b.dataset.cx === 'pray' ? pray(pid) : react(pid, b.dataset.cx, rid)), 140); }, 220);
    });
  }
  function replyTo(p, x, page) {
    const at = x !== p && x.by && !x.anon && x.by !== 'JC' ? '@' + first(x.by) + ' ' : '';
    if (page && page.pid === p.id && page.focusIn) { page.focusIn(at); return; }
    const host = page && page.push ? page : null, props = { pid: p.id, focus: 1, at };
    const tag = p.ev || p.sv ? 'page-ig-evento' : 'page-ig-hilo';
    if (host) host.push(tag, props); else pushHere(tag, props);
  }
  function chMenu(ch, el) {
    const c = CHM[ch], mu = isMutedCh(ch), u = unread(ch);
    const prev = '<div class="ig-cxch" data-a="' + c.a + '"><span class="ig-chic">' + ici(c.i) + '</span><div><b>' + esc(c.n) + '</b><small>' + esc(c.d) + (mu ? ' · silenciado' : '') + '</small></div></div>';
    const items = [];
    if (u) items.push({ text: 'Marcar como leído', icon: 'checkmark-done', handler: () => markRead(ch) });
    items.push(mu ? { text: 'Activar avisos', icon: 'notifications-outline', handler: () => muteCh(ch, false) } : { text: 'Silenciar canal', icon: 'eye-off-outline', handler: () => muteCh(ch, true) });
    items.push({ text: 'Normas de la comunidad', icon: 'shield-checkmark-outline', handler: () => norms(false) });
    if (el) { L.context(el, prev, items, c.a); return; }
    L.actions(c.n, items.map(i => ({ text: i.text, handler: i.handler })), mu ? 'Silenciado: no suma al punto de Personas' : c.d);
  }

  /* ================= publicar (hoja) ================= */
  function compose(pre, page) {
    const S = st();
    if (!S.normsOk) { norms(true, () => compose(pre, page)); return; }
    const gs = myGroups();
    let cur = TYPES.find(t => t.k === (pre.k === 'grupos' ? 'grupo' : pre.k)) || TYPES[0];
    if (cur.k === 'grupo' && !gs.length) cur = TYPES[0];
    let grp = pre.grp && inGroup(pre.grp) ? pre.grp : (gs[0] || {}).id, anon = false, warned = false;
    const lp = pre.link && find(pre.link), link = lp ? trim(lp.t, 70) : null;
    const html = '<div class="ig-cmp" data-a="' + cur.a + '"><h2 class="sh-title">Publicar</h2><p class="sh-sub">En ' + CHURCH.n + (link ? ' · nació de «' + esc(trim(link, 40)) + '»' : '') + '</p>' +
      '<div class="ig-types">' + TYPES.map(t => '<button class="ig-type" data-a="' + t.a + '" data-k="' + t.k + '"' + (t.k === 'grupo' && !gs.length ? ' disabled' : '') + '>' + ici(t.i) + '<span>' + t.n + '</span></button>').join('') + '</div>' +
      '<div class="chips ig-grps" data-grps>' + gs.map(g => '<button class="chip" data-a="encuentro" data-g="' + g.id + '">' + esc(g.s) + '</button>').join('') + '</div>' +
      '<textarea class="fl-text" rows="4" maxlength="500" data-txt></textarea>' +
      '<div class="ig-anon" data-anonrow><span class="ig-anic">' + ici('incognito') + '</span><div><b>Anónimo</b><small>La iglesia no ve tu nombre. Los pastores sí, para acompañarte.</small></div><ion-toggle data-anon aria-label="Publicar en anónimo"></ion-toggle></div>' +
      '<p class="ig-line" data-line></p><button class="btn c" data-pub disabled>Publicar</button></div>';
    L.sheet(html, { cls: 'ig-sheet', mount: (el, m) => {
      const ta = el.querySelector('[data-txt]'), pub = el.querySelector('[data-pub]'), line = el.querySelector('[data-line]'), row = el.querySelector('[data-anonrow]'), tg = el.querySelector('[data-anon]'), gr = el.querySelector('[data-grps]'), box = el.querySelector('.ig-cmp');
      const sync = () => {
        box.dataset.a = cur.a;
        el.querySelectorAll('[data-k]').forEach(b => b.classList.toggle('on', b.dataset.k === cur.k));
        gr.hidden = !(cur.k === 'grupo' && gs.length > 1);
        gr.querySelectorAll('[data-g]').forEach(b => b.classList.toggle('on', b.dataset.g === grp));
        if (!cur.anon) anon = false;
        row.hidden = !cur.anon; tg.checked = anon;
        ta.placeholder = cur.k === 'grupo' && grp ? 'Escribe a ' + GRM[grp].s : cur.ph;
        const sens = SENS.test(ta.value);
        if (!sens) warned = false;
        line.className = 'ig-line' + (sens ? ' warn' : '');
        line.innerHTML = sens ? ici('warning-outline') + '<span>Cuida a otros: sin teléfonos, direcciones ni datos de salud de terceros.' + (warned ? ' ¿Lo publicas igual?' : '') + '</span>'
          : cur.k === 'grupo' ? ic('lock-closed-outline') + '<span>Solo lo ve ' + (grp ? 'el grupo ' + esc(GRM[grp].s) : 'tu grupo') + '</span>'
          : anon ? ic('eye-outline') + '<span>Lo ve la iglesia, sin tu nombre</span>' : ic('eye-outline') + '<span>Lo ve la iglesia: 214 miembros</span>';
        pub.disabled = !ta.value.trim();
        pub.textContent = warned ? 'Publicar igual' : cur.k === 'grupo' ? 'Enviar al grupo' : 'Publicar en ' + CHM[cur.ch].n;
      };
      ta.addEventListener('input', sync);
      tg.addEventListener('ionChange', e => { anon = !!e.detail.checked; L.haptic(5); sync(); });
      el.addEventListener('click', e => {
        const t = e.target.closest('[data-k]');
        if (t && !t.disabled) { cur = TYPES.find(x => x.k === t.dataset.k); L.haptic(5); sync(); return; }
        const g = e.target.closest('[data-g]'); if (g) { grp = g.dataset.g; sync(); return; }
        if (e.target.closest('[data-pub]') && !pub.disabled) {
          /* aviso suave: la primera vez que hay datos sensibles se avisa y se pide un segundo toque */
          if (SENS.test(ta.value) && !warned) { warned = true; sync(); line.classList.remove('pop'); void line.offsetWidth; line.classList.add('pop'); L.haptic([6, 30, 6]); return; }
          const text = ta.value.trim(), o = cur, a = anon, g2 = grp;
          m.dismiss().then(() => publish(o, text, a, g2, cur.k === 'testimonios' ? link : null, cur.k === 'testimonios' && lp ? lp.id : null, page));
        }
      });
      sync();
      setTimeout(() => ta.focus(), 450);
    } });
  }
  function publish(o, text, anon, grp, link, linkPid, page) {
    const S = st(), id = 'm' + (S.nextId++);
    const p = { id, ch: o.ch, by: 'JC', day: L.tk(), h: L.nowHM(), t: text, rx: {}, my: {}, re: [] };
    if (o.k === 'grupo') p.grp = grp;
    if (anon) p.anon = true;
    if (o.ch === 'oracion') p.n = 0;
    if (link) p.link = link;
    const lp = linkPid && find(linkPid); if (lp) lp.testi = id;
    S.posts.unshift(p);
    justPosted = id; setTimeout(() => { if (justPosted === id) justPosted = null; }, 1600);
    L.haptic([8, 30, 12]);
    const tag = p.grp ? 'page-ig-grupo' : 'page-ig-canal', props = p.grp ? { gid: p.grp } : { ch: p.ch };
    const here = page && page.tagName === tag.toUpperCase() && (p.grp ? page.gid === p.grp : page.ch === p.ch);
    commit();
    let went = null;
    if (here) { const c = page.querySelector('ion-content'); c && c.scrollToTop(300); }
    else went = page && page.push ? page.push(tag, props) : pushHere(tag, props);
    /* el aviso sale cuando terminó de entrar la página, así no se ancla a la barra que se esconde */
    Promise.resolve(went).then(() => tst(p.grp ? 'Enviado a ' + GRM[p.grp].s : 'Publicado en ' + CHM[p.ch].n, { icon: 'checkmark', undo: () => { st().posts = st().posts.filter(x => x.id !== id); if (lp) delete lp.testi; commit(); } }));
    echo(p);
  }
  /* la comunidad responde (simulado y con calma) */
  function echo(p) {
    const id = p.id;
    const add = (by, t, x) => { const q = find(id); if (!q) return null; q.re.push(Object.assign({ id: 'm' + (st().nextId++), by, day: L.tk(), h: L.nowHM(), t, rx: {}, my: {} }, x || {})); return q; };
    if (p.ch === 'oracion') {
      const by = p.anon ? 'ER' : 'LM';
      later(5200, () => { const q = add(by, p.anon ? 'Gracias por confiar. Estoy orando por ti; si quieres hablar, escríbeme.' : 'Orando contigo, Juan Carlos.'); if (!q) return; q.n += 1; commit(); tst(first(by) + ' está orando por tu pedido', { icon: 'heart' }); });
      later(12000, () => { const q = find(id); if (q) { q.n += 4; commit(); } });
    } else if (p.ch === 'testimonios') {
      later(5200, () => { const q = add('ER', '¡Gloria a Dios! Gracias por contarlo.'); if (!q) return; q.rx.gloria = (q.rx.gloria || 0) + 7; q.rx.amen = (q.rx.amen || 0) + 3; commit(); tst('Esteban: «¡Gloria a Dios! Gracias por contarlo.»', { icon: 'sparkles' }); });
    } else if (p.ch === 'preguntas') {
      later(6500, () => { const q = add('ER', 'Buena pregunta. Lo conversamos el martes con calma; mientras, Santiago 1:5: Dios da sabiduría a quien se la pide.', { ans: true }); if (!q) return; commit(); tst('El pastor Esteban respondió tu pregunta', { icon: 'chatbubble' }); });
    } else if (p.grp) {
      const g = GRM[p.grp], by = g.lead === 'JC' ? 'RG' : g.lead;
      later(4500, () => { const q = add(by, 'Amén. Ahí estaremos.'); if (!q) return; q.rx.amen = (q.rx.amen || 0) + 4; commit(); });
    }
  }

  /* ================= normas (hoja) ================= */
  function norms(gate, then) {
    const S = st();
    const rules = [['hands-praying-outline', 'Con gracia', 'Como en la mesa de tu casa.'], ['lock-closed-outline', 'Cuida a otros', 'Sin nombres completos, teléfonos ni salud de terceros.'],
      ['prohibit-outline', 'Sin ventas ni política', 'Tampoco cadenas.'], ['flag-outline', 'Avisa si algo no está bien', 'Mantén presionado y elige Reportar. Los pastores moderan.']];
    const who = [['church', 'Canales', 'La iglesia'], ['people', 'Grupos', 'Solo el grupo'], ['incognito', 'Anónimo', 'Tu nombre, solo los pastores'], ['eye-off', 'Cuándo entras u oras', 'Nadie']];
    const mutedCh = S.mutedCh.map(c => '<button class="chip on" data-a="' + CHM[c].a + '" data-umc="' + c + '">' + esc(CHM[c].n) + ic('close') + '</button>');
    const mutedP = S.mutedP.map(id => '<button class="chip ig-ump" data-ump="' + id + '">' + av(id, fullN(id), 22) + esc(first(id)) + ic('close') + '</button>');
    const html = '<div class="ig-norms"><div class="sh-head"><span class="ig-logo">' + ic('shield-checkmark') + '</span><div><h2>' + (gate ? 'Antes de publicar' : 'Cómo nos cuidamos') + '</h2><p>' + CHURCH.n + ' · cuatro normas</p></div></div>' +
      '<div class="ig-rules">' + rules.map(r => '<div class="ig-rule"><span>' + ici(r[0]) + '</span><div><b>' + r[1] + '</b><small>' + r[2] + '</small></div></div>').join('') + '</div>' +
      (gate ? '' : '<p class="eyebrow ig-lab">Qué ve quién</p><div class="ig-whos">' + who.map(w => '<div><span>' + ici(w[0] + (w[0] === 'incognito' ? '' : '-outline')) + w[1] + '</span><b>' + w[2] + '</b></div>').join('') + '</div>' +
        (mutedCh.length || mutedP.length ? '<p class="eyebrow ig-lab">Silenciaste</p><div class="chips">' + mutedCh.join('') + mutedP.join('') + '</div>' : '')) +
      '<button class="btn" data-ok>' + (gate ? 'Entendido' : 'Listo') + '</button></div>';
    L.sheet(html, { cls: 'ig-sheet', mount: (el, m) => el.addEventListener('click', e => {
      const c = e.target.closest('[data-umc]'); if (c) { muteCh(c.dataset.umc, false); c.remove(); return; }
      const u = e.target.closest('[data-ump]'); if (u) { muteP(u.dataset.ump, false); u.remove(); return; }
      if (e.target.closest('[data-ok]')) {
        if (gate) { st().normsOk = true; L.save(); m.dismiss().then(() => then && then()); } else m.dismiss();
      }
    }) });
  }

  /* ================= toques compartidos ================= */
  function openPost(id, page) { const p = find(id); if (!p) return; page.push(p.ev || p.sv ? 'page-ig-evento' : 'page-ig-hilo', { pid: id }); }
  function handle(e, page) {
    const t = e.target; let el;
    if ((el = t.closest('[data-igpray]'))) { pray(el.dataset.igpray); return true; }
    if ((el = t.closest('[data-igrx]'))) { const [pid, k, rid] = el.dataset.igrx.split(':'); react(pid, k, rid); return true; }
    if ((el = t.closest('[data-iggo]'))) { toggleGo(el.dataset.iggo); return true; }
    if ((el = t.closest('[data-igsumo]'))) { toggleSumo(el.dataset.igsumo); return true; }
    if ((el = t.closest('[data-igjoin]'))) { join(el.dataset.igjoin); return true; }
    if ((el = t.closest('[data-igleave]'))) { leave(el.dataset.igleave); return true; }
    if ((el = t.closest('[data-igremind]'))) { remind(el.dataset.igremind); return true; }
    if ((el = t.closest('[data-igcompose]'))) { compose({ k: el.dataset.igcompose, grp: el.dataset.grp }, page); return true; }
    if (t.closest('[data-ignorms]')) { norms(false); return true; }
    if ((el = t.closest('[data-igreveal]'))) { revealed.add(el.dataset.igreveal); L.refresh(); return true; }
    if ((el = t.closest('[data-iggoto]'))) { L.go(el.dataset.iggoto); return true; }
    if ((el = t.closest('[data-igans]'))) { answered(el.dataset.igans); return true; }
    if ((el = t.closest('[data-igtesti]'))) { compose({ k: 'testimonios', link: el.dataset.igtesti }, page); return true; }
    if ((el = t.closest('[data-igopen]'))) { openPost(el.dataset.igopen, page); return true; }
    if ((el = t.closest('[data-iggrp]'))) { page.push('page-ig-grupo', { gid: el.dataset.iggrp }); return true; }
    if ((el = t.closest('[data-igev]'))) { page.push('page-ig-evento', { pid: el.dataset.igev }); return true; }
    if ((el = t.closest('[data-igch]'))) { page.push('page-ig-canal', { ch: el.dataset.igch }); return true; }
    if ((el = t.closest('[data-post]')) && !t.closest('button')) { openPost(el.dataset.post, page); return true; }
    return false;
  }

  /* ================= páginas ================= */
  /* la barra de pestañas se esconde en canal, hilo, grupo y evento y vuelve con cualquier otra página de una pestaña.
     Los eventos de ciclo de vida de Ionic no burbujean: se escuchan en captura */
  document.addEventListener('ionViewWillEnter', e => {
    const el = e.target, tb = tabsEl();
    if (!tb || !el || !el.closest || !el.closest('ion-tab')) return;
    tb.classList.toggle('notabs', !!el.igNoTabs);
  }, true);
  /* canal, hilo, grupo y evento esconden la barra de pestañas (ion-tabs.notabs) */
  class IgPage extends L.Page {
    mount() {
      this.igNoTabs = true;
      L.press(this, '[data-post], [data-thpost]', el => postMenu(el.dataset.post || el.dataset.thpost, null, el, this));
      L.press(this, '[data-reply]', el => { const [pid, rid] = el.dataset.reply.split(':'); postMenu(pid, rid, el, this); });
      this.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('[data-in]') && !e.isComposing) { e.preventDefault(); this.send(); } });
      this.addEventListener('input', e => { if (e.target.matches('[data-in]')) this.syncIn(); });
      this.init && this.init();
    }
    render() { keep(this.pg, true); return this.body(); }
    after() { keep(this.pg, false); }
    onClick(e) {
      if (e.target.closest('[data-igmenu]')) { this.menu(); return; }
      if (e.target.closest('[data-send]')) { this.send(); return; }
      handle(e, this);
    }
    menu() {}
    /* el campo de abajo: responder o escribir al grupo */
    inputBar(a, ph) {
      return '<ion-footer class="compose ig-foot" data-a="' + a + '"><p class="ig-line warn" data-warn hidden>' + ici('warning-outline') + '<span>Cuida a otros: sin teléfonos, direcciones ni datos de salud de terceros.</span></p>' +
        '<div class="cbar"><input type="text" data-in placeholder="' + esc(ph) + '" enterkeyhint="send" maxlength="400" autocomplete="off"><button class="iconbtn send" data-send aria-label="Enviar" disabled>' + ic('arrow-up') + '</button></div></ion-footer>';
    }
    syncIn() {
      const i = this.querySelector('[data-in]'); if (!i) return;
      const b = this.querySelector('[data-send]'), w = this.querySelector('[data-warn]');
      if (b) b.disabled = !i.value.trim();
      if (w) w.hidden = !SENS.test(i.value);
    }
    focusIn(at) {
      const i = this.querySelector('[data-in]'); if (!i) return;
      if (at && !i.value.startsWith(at)) i.value = at + i.value;
      i.focus(); this.syncIn();
    }
    takeInput() {
      const i = this.querySelector('[data-in]'), t = i ? i.value.trim() : '';
      if (!t) return null;
      i.value = ''; this.syncIn(); return t;
    }
    send() {}
  }
  const footerBtn = (ch, a, ph, grp) => '<ion-footer class="compose ig-foot" data-a="' + a + '"><div class="cbar"><button class="ig-fake" data-igcompose="' + ch + '"' + (grp ? ' data-grp="' + grp + '"' : '') + '>' + av('JC', 'Juan Carlos', 28) + '<span class="ig-pt">' + esc(ph) + '</span></button>' +
    '<button class="iconbtn send" data-igcompose="' + ch + '" aria-label="Publicar">' + ic('add') + '</button></div></ion-footer>';
  function addReply(p, page, text) {
    const S = st(), r = { id: 'm' + (S.nextId++), by: 'JC', day: L.tk(), h: L.nowHM(), t: text, rx: {}, my: {} };
    p.re.push(r); justReply = r.id; setTimeout(() => { if (justReply === r.id) justReply = null; }, 1600);
    commit(); L.haptic(8);
    const c = page.querySelector('ion-content'); c && setTimeout(() => c.scrollToBottom(300), 60);
    tst(SENS.test(text) ? 'Respondiste · cuida los datos de otros' : 'Respondiste', { icon: 'chatbubble', undo: () => { p.re = p.re.filter(x => x.id !== r.id); commit(); } });
    /* eco silencioso: quien escribió dice Amén a tu respuesta */
    if (p.by && p.by !== 'JC' && !p.anon) later(5200, () => { const q = find(p.id), rr = q && q.re.find(x => x.id === r.id); if (rr) { rr.rx.amen = (rr.rx.amen || 0) + 1; commit(); } });
  }
  function replyHTML(p, r) {
    if (isHidden(r.id)) return '<p class="ig-gone">' + ic('flag-outline') + 'Reportaste esta respuesta</p>';
    if (isMutedP(r)) return '<button class="ig-gone" data-igreveal="' + r.id + '">' + ici('notifications-off-outline') + 'De alguien que silenciaste · Ver</button>';
    return '<div class="ig-re' + (r.ans ? ' ofi' : '') + (r.by === 'JC' ? ' mine' : '') + (r.id === justReply ? ' just' : '') + '" data-reply="' + p.id + ':' + r.id + '">' +
      (r.ans ? '<p class="ig-ey">' + ic('star') + (M[r.by].role === 'Pastora' ? 'Respuesta de la pastora' : 'Respuesta del pastor') + '</p>' : '') +
      byline(r, 30, p) + '<p class="ig-rt">' + esc(r.t) + '</p><div class="ig-acts">' + rxBtn(p, r.ans ? 'gracias' : 'amen', r) + '</div></div>';
  }
  function repliesHTML(p, title, none) {
    const res = p.ch === 'preguntas' ? p.re.filter(r => r.ans).concat(p.re.filter(r => !r.ans)) : p.re, n = res.filter(r => !isHidden(r.id)).length;
    return '<div class="sec"><h2>' + title + '</h2><span class="muted">' + (n || '') + '</span></div><div class="ig-res">' + (res.map(r => replyHTML(p, r)).join('') || '<p class="ig-none">' + none + '</p>') + '</div>';
  }
  const gone = () => '<div class="empty">' + ic('chatbubble-outline') + '<b>Esta publicación ya no está</b>Puede que la hayan borrado.</div>';

  /* ---------- un canal ---------- */
  class PageCanal extends IgPage {
    shell() {
      const c = CHM[this.ch];
      const foot = COMPOSE[this.ch] ? footerBtn(this.ch, c.a, COMPOSE[this.ch]) : this.ch === 'anuncios' ? '<ion-footer class="compose ig-foot"><p class="ig-footnote">' + ic('lock-closed-outline') + 'Solo publican los pastores</p></ion-footer>' : '';
      return L.shell({ title: c.n, back: '', large: false, cls: 'ig-pg', end: '<ion-button data-igmenu aria-label="Opciones del canal">' + ic('ellipsis-horizontal') + '</ion-button>' }) + foot;
    }
    init() {
      st().posts.forEach(p => { if (p.u && p.ch === this.ch && !p.grp && shown(p)) fresh.add(p.id); });
      setTimeout(() => { let ch = false; st().posts.forEach(p => { if (p.u && p.ch === this.ch && !p.grp) { p.u = false; ch = true; } }); if (ch) commit(); }, 700);
    }
    menu() { chMenu(this.ch); }
    body() {
      const c = CHM[this.ch], S = st(), mu = isMutedCh(this.ch);
      let list = S.posts.filter(p => p.ch === c.id && !p.grp), count = '';
      let feed;
      if (c.id === 'grupos') { feed = GR.slice().sort((a, b) => inGroup(b.id) - inGroup(a.id)).map(groupCard).join(''); count = 'estás en ' + myGroups().length + ' de ' + GR.length; }
      else if (c.id === 'eventos') { list = list.filter(p => dd(evDate(p)) >= 0).sort((a, b) => evDate(a) - evDate(b)); feed = list.map(evCard).join(''); count = list.length + ' próximos'; }
      else if (c.id === 'servicio') { list = list.filter(p => dd(svDate(p)) >= 0).sort((a, b) => svDate(a) - svDate(b)); feed = list.map(svCard).join(''); count = list.length + ' necesidades'; }
      else {
        list = list.filter(p => p.pin).concat(list.filter(p => !p.pin).sort((a, b) => ts(b) - ts(a)));
        feed = list.map(postCard).join('');
        count = this.ch === 'oracion' ? list.filter(p => !p.ans).length + ' pedidos' : list.length + ' publicaciones';
      }
      return '<div class="ig-banner" data-a="' + c.a + '"><span class="ig-chic big">' + ici(c.i) + '</span><div><h1>' + esc(c.n) + '</h1><p>' + esc(c.d) + ' · ' + count + '</p></div>' +
        (mu ? '<button class="ig-mutepill" data-igmenu>' + ici('notifications-off-outline') + 'Silenciado</button>' : '') + '</div>' +
        (feed || empty('Todavía nada por aquí'));
    }
  }
  L.define('page-ig-canal', PageCanal);

  /* ---------- un hilo: la publicación y sus respuestas ---------- */
  class PageHilo extends IgPage {
    shell() {
      const p = find(this.pid), c = p ? CHM[p.ch] : CHM.oracion, a = p && p.grp ? 'encuentro' : c.a;
      const title = !p ? 'Publicación' : p.grp ? GRM[p.grp].s : { anuncios: 'Anuncio', oracion: 'Pedido de oración', testimonios: 'Testimonio', preguntas: 'Pregunta' }[p.ch] || c.n;
      return L.shell({ title, back: '', large: false, cls: 'ig-pg', end: '<ion-button data-igmenu aria-label="Opciones">' + ic('ellipsis-horizontal') + '</ion-button>' }) + this.inputBar(a, 'Responde con gracia');
    }
    init() {
      const p = find(this.pid); if (p && p.u) { p.u = false; L.save(); setTimeout(L.refresh, 0); }
      if (this.focus) setTimeout(() => this.focusIn(this.at), 620);
    }
    menu() { const p = find(this.pid), el = this.querySelector('[data-thpost]'); if (p && el) postMenu(p.id, null, el, this); }
    send() { const p = find(this.pid), t = p && this.takeInput(); if (t) addReply(p, this, t); }
    body() {
      const p = find(this.pid);
      if (!p || !visible(p)) return gone();
      if (isHidden(p.id)) return '<p class="ig-gone big">' + ic('flag-outline') + 'Reportaste esta publicación · lo revisan los pastores</p>';
      const c = CHM[p.ch], g = p.grp && GRM[p.grp], mine = p.by === 'JC';
      let h = '<article class="ig-th" data-a="' + c.a + '" data-thpost="' + p.id + '"><p class="ig-where">' + ici(g ? 'people' : c.i) + esc(g ? g.n : c.n) + (p.pin ? ' · ' + ici('pin') + 'Fijado' : '') + '</p>' +
        byline(p, 44, p) + '<p class="ig-th-t">' + esc(p.t) + '</p>';
      if (p.mod) h += modNote(p.mod);
      if (p.link) h += linkTag(p.link);
      if (p.go) h += '<button class="ig-golink" data-iggoto="' + p.go + '">' + ic('calendar-outline') + 'Ver la invitación en Planes' + ic('chevron-forward') + '</button>';
      if (p.ch === 'oracion') {
        if (p.ans && mine) h += '<div class="ig-ansdone" data-a="oracion"><span class="coin">' + ic('star') + '</span><b>Dios respondió</b><small>Queda en Oración → Respondidas</small>' +
          (p.testi && find(p.testi) ? '<button class="btn ghost sm" data-igopen="' + p.testi + '">Ver tu testimonio</button>' : '<button class="btn c sm" data-igtesti="' + p.id + '" data-a="adoracion">' + ic('sparkles') + 'Contarlo en Testimonios</button>') + '</div>';
        else if (p.ans) h += ansTag(p.ans);
        else h += prayBtn(p, 'big') + (mine ? '<button class="btn ghost ig-ansbtn" data-igans="' + p.id + '">' + ic('star-outline') + 'Dios respondió</button>' : '');
        h += thxHTML(p);
      }
      const keys = rxKeys(p);
      if (keys.length) h += '<div class="ig-acts big">' + keys.map(k => rxBtn(p, k)).join('') + '</div>';
      h += g ? '<p class="ig-priv">' + ic('lock-closed-outline') + 'Solo lo ve el grupo</p>' : p.anon ? '<p class="ig-priv">' + ici('incognito') + 'Anónimo: solo los pastores saben quién es</p>' : '';
      return '<div data-a="' + c.a + '">' + h + '</article>' + repliesHTML(p, 'Respuestas', 'Todavía sin respuestas. Sé el primero.') + '</div>';
    }
  }
  L.define('page-ig-hilo', PageHilo);

  /* ---------- un grupo ---------- */
  class PageGrupo extends IgPage {
    shell() {
      const g = GRM[this.gid];
      return L.shell({ title: g.s, back: '', large: false, cls: 'ig-pg', end: '<ion-button data-igmenu aria-label="Opciones del grupo">' + ic('ellipsis-horizontal') + '</ion-button>' }) + this.inputBar('encuentro', 'Escribe a ' + g.s);
    }
    init() {
      const g = this.gid;
      if (inGroup(g)) st().posts.forEach(p => { if (p.grp === g && p.u) fresh.add(p.id); });
      setTimeout(() => { let ch = false; if (inGroup(g)) st().posts.forEach(p => { if (p.grp === g && p.u) { p.u = false; ch = true; } }); if (ch) commit(); }, 700);
    }
    after() { super.after(); const f = this.querySelector('ion-footer'); if (f) f.hidden = !inGroup(this.gid); }
    menu() {
      const g = GRM[this.gid], items = [];
      if (g.lead === 'JC') items.push({ text: 'Recordar al grupo', handler: () => remind(g.id) });
      else if (inGroup(g.id)) items.push({ text: 'Salir del grupo', role: 'destructive', handler: () => setTimeout(() => leave(g.id), 300) });
      else items.push({ text: 'Unirme', handler: () => join(g.id) });
      items.push({ text: 'Normas de la comunidad', handler: () => norms(false) });
      L.actions(g.n, items, L.cap(L.DN[g.dow]) + ' ' + g.h + ' · ' + g.place);
    }
    send() {
      const g = this.gid, t = this.takeInput(); if (!t || !inGroup(g)) return;
      const S = st(), id = 'm' + (S.nextId++);
      const p = { id, ch: 'grupos', grp: g, by: 'JC', day: L.tk(), h: L.nowHM(), t, rx: {}, my: {}, re: [] };
      S.posts.unshift(p); justPosted = id; setTimeout(() => { if (justPosted === id) justPosted = null; }, 1600);
      commit(); L.haptic(8);
      const c = this.querySelector('ion-content'); c && c.scrollToPoint(0, (this.querySelector('[data-thread]') || { offsetTop: 0 }).offsetTop - 60, 300);
      tst((SENS.test(t) ? 'Enviado · cuida los datos de otros' : 'Enviado a ' + GRM[g].s), { icon: 'checkmark', undo: () => { st().posts = st().posts.filter(x => x.id !== id); commit(); } });
      echo(p);
    }
    body() {
      const S = st(), g = GRM[this.gid], mine = inGroup(g.id), lead = g.lead === 'JC', d = nd(g.dow), mem = members(g), inWk = groupInWeek(g);
      let h = '<section class="ig-ghero" data-a="encuentro"><span class="ig-gtile big">' + ic('people') + '</span><h1>' + esc(g.n) + '</h1>' +
        '<p class="ig-meta col"><span>' + ic('time-outline') + L.cap(L.DN[g.dow]) + ' ' + g.h + (g.every ? ' · ' + g.every : '') + '</span><span>' + ici('location-outline') + esc(g.place) + '</span><span>' + ic('book-outline') + 'Estudian ' + esc(g.now) + '</span></p>' +
        '<div class="ig-evrow">' + stack(mem, 6, 30) + groupTag(g, true) + '</div></section>';
      h += '<div class="ig-next" data-a="encuentro">' + dateTile(d) + '<div><small>Próximo encuentro</small><b>' + dayLabel(d) + ' ' + g.h + '</b><span>' + esc(g.now) + (lead ? '' : ' · lidera ' + esc(first(g.lead))) + '</span></div>' +
        (mine && inWk ? '<span class="ig-wkst">' + ic('checkmark') + 'En tu semana</span>' : '') + '</div>';
      if (lead) { const done = S.reminded === L.tk(); h += '<button class="btn ghost ig-mt" data-igremind="' + g.id + '"' + (done ? ' disabled' : '') + '>' + ic('notifications-outline') + (done ? 'Recordado hoy' : 'Recordar al grupo') + '</button>'; }
      else if (!mine) { const asked = S.groups[g.id] === 'pedido'; h += '<button class="btn c ig-mt" data-igjoin="' + g.id + '"' + (asked ? ' disabled' : '') + '>' + (asked ? 'Pedido enviado a ' + esc(first(g.lead)) : ic('add') + 'Unirme al grupo') + '</button>'; }
      h += '<div class="sec"><h2>Somos ' + mem.length + '</h2></div><div class="ig-mems">' + mem.map(id => '<span>' + av(id, fullN(id), 46) + '<small>' + esc(id === 'JC' ? 'Tú' : first(id)) + '</small>' + (id === g.lead ? '<i>Líder</i>' : '') + '</span>').join('') + '</div>';
      if (mine) {
        const posts = S.posts.filter(p => p.grp === g.id).sort((a, b) => ts(b) - ts(a));
        h += '<div class="sec" data-thread><h2>Lo que hablamos</h2><span class="muted">' + ic('lock-closed-outline') + ' Solo el grupo</span></div>' + (posts.map(postCard).join('') || empty('Escribe lo primero'));
      } else h += '<p class="ig-priv">' + ic('lock-closed-outline') + 'Lo que escribe el grupo lo ven solo sus miembros</p>';
      return '<div data-a="encuentro">' + h + '</div>';
    }
  }
  L.define('page-ig-grupo', PageGrupo);

  /* ---------- un evento o una necesidad de servicio ---------- */
  class PageEvento extends IgPage {
    shell() {
      const p = find(this.pid), a = p ? (p.ev ? p.ev.a : 'ayuno') : 'diario';
      return L.shell({ title: p && p.sv ? 'Servicio' : 'Evento', back: '', large: false, cls: 'ig-pg', end: '<ion-button data-igmenu aria-label="Opciones">' + ic('ellipsis-horizontal') + '</ion-button>' }) + this.inputBar(a, p && p.sv ? 'Pregunta a quien coordina' : 'Pregunta algo');
    }
    init() { const p = find(this.pid); if (p && p.u) { p.u = false; L.save(); setTimeout(L.refresh, 0); } if (this.focus) setTimeout(() => this.focusIn(this.at), 620); }
    menu() { const p = find(this.pid), el = this.querySelector('[data-thpost]'); if (p && el) postMenu(p.id, null, el, this); }
    send() { const p = find(this.pid), t = p && this.takeInput(); if (t) addReply(p, this, t); }
    body() {
      const p = find(this.pid); if (!p || isHidden(p.id)) return gone();
      let h;
      if (p.ev) {
        const e = p.ev, d = evDate(p), on = going(p), n = goN(p), full = e.cap && n >= e.cap && !on;
        h = '<article class="ig-evd" data-a="' + e.a + '" data-thpost="' + p.id + '"><div class="ig-evtop">' + dateTile(d, true) + '<div><p class="eyebrow">' + esc(CHM.eventos.n) + ' · ' + esc(CHURCH.n) + '</p><h1>' + esc(p.t) + '</h1></div></div>' +
          '<p class="ig-meta col"><span>' + ic('time-outline') + dayLabel(d) + ' · ' + e.h + (e.dow != null ? ' · cada ' + L.DN[e.dow] : '') + '</span><span>' + ici('location-outline') + esc(e.place) + '</span></p>' +
          (e.note ? '<p class="ig-note">' + esc(e.note) + '</p>' : '') + (e.cap ? cupo(n, e.cap, 'Quedan') + '<p class="ig-goes">' + n + ' de ' + e.cap + ' lugares</p>' : n != null ? '<p class="ig-goes">' + n + ' van</p>' : '') +
          '<button class="btn c big ig-gobig' + (on ? ' on' : '') + '" data-iggo="' + p.id + '"' + (full ? ' disabled' : '') + '>' + (on ? ic('checkmark') + 'Vas · está en tu semana' : full ? 'Completo' : ic('add') + 'Voy') + '</button>' +
          '<p class="ig-priv">' + ic('calendar-outline') + (on && !p.my.go ? 'Ya estaba en tu rutina de los ' + L.DN[d.getDay()] + 's' : on ? 'Aparece en Hoy el ' + L.DN[d.getDay()] + ' a las ' + e.h : 'Si vas, entra en tu semana y en Hoy ese día') + '</p>' +
          '<div class="ig-org"><small>Organiza</small>' + byline(p, 32, p) + '</div></article>';
      } else {
        const s = p.sv, d = svDate(p), mine = s.vol.includes('JC'), full = s.vol.length >= s.need && !mine;
        h = '<article class="ig-evd" data-a="ayuno" data-thpost="' + p.id + '"><div class="ig-evtop">' + dateTile(d, true) + '<div><p class="eyebrow">Servicio · ' + esc(CHURCH.n) + '</p><h1>' + esc(p.t) + '</h1></div></div>' +
          '<p class="ig-meta col"><span>' + ic('time-outline') + dayLabel(d) + ' · ' + s.h + '</span><span>' + ici('location-outline') + esc(s.place) + '</span></p>' +
          (s.note ? '<p class="ig-note">' + esc(s.note) + '</p>' : '') + cupo(s.vol.length, s.need, 'Faltan') +
          (s.vol.length ? '<div class="ig-vol">' + stack(s.vol, 6, 30) + '<small>' + (s.vol.length === 1 ? 'se sumó' : 'se sumaron') + '</small></div>' : '') +
          '<button class="btn c big ig-gobig' + (mine ? ' on' : '') + '" data-igsumo="' + p.id + '"' + (full ? ' disabled' : '') + '>' + (mine ? ic('checkmark') + 'Te sumaste' : full ? 'Completo' : ic('add') + 'Me sumo') + '</button>' +
          (s.priv ? '<p class="ig-priv">' + ic('lock-closed-outline') + 'Los datos se comparten solo con quien se suma</p>' : '') +
          '<div class="ig-org"><small>Coordina</small>' + byline(p, 32, p) + '</div></article>';
      }
      return '<div data-a="' + (p.ev ? p.ev.a : 'ayuno') + '">' + h + repliesHTML(p, 'Preguntas', 'Nadie preguntó todavía.') + '</div>';
    }
  }
  L.define('page-ig-evento', PageEvento);

  /* ================= Hoy: tarjeta de contexto ================= */
  function ctxPick() {
    const S = st();
    const evs = S.posts.filter(p => p.ev && !isHidden(p.id) && going(p)).map(p => ({ p, n: dd(evDate(p)) })).filter(x => x.n === 0 || x.n === 1).sort((a, b) => a.n - b.n);
    if (evs.length && evs[0].n === 0) return { k: 'ev', p: evs[0].p, n: 0, pri: 2.5 };
    const mates = new Set(); myGroups().forEach(g => members(g).forEach(id => { if (id !== 'JC') mates.add(id); }));
    const pr = S.posts.filter(p => p.ch === 'oracion' && !p.ans && p.by && !p.anon && mates.has(p.by) && shown(p) && !prayed(p) && dd(L.fromDk(p.day)) >= -1).sort((a, b) => ts(b) - ts(a));
    if (pr.length) return { k: 'pray', p: pr[0], pri: 2.2 };
    if (evs.length) return { k: 'ev', p: evs[0].p, n: 1, pri: 1.6 };
    return null;
  }
  L.ctxCard({
    id: 'iglesia',
    pri: () => { const c = ctxPick(); return c ? c.pri : 0; },
    html: () => {
      const c = ctxPick(); if (!c) return '';
      const p = c.p;
      if (c.k === 'ev') {
        const e = p.ev;
        return '<div class="ctxc ig-ctx" data-a="' + e.a + '"><div class="ctxc-top">' + dateTile(evDate(p)) + '<div><p class="eyebrow">' + CHURCH.n + ' · ' + (c.n === 0 ? 'hoy' : 'mañana') + ' ' + e.h + '</p><b>' + esc(p.t) + '</b></div></div>' +
          '<p class="muted">Vas · ' + esc(e.place) + (e.note ? ' · ' + esc(e.note) : '') + '</p><button class="btn sm" data-ctx="iglesia" data-k="open" data-id="' + p.id + '">' + ic('calendar-outline') + 'Ver el evento</button></div>';
      }
      const g = myGroups().find(x => x.mem.includes(p.by));
      return '<div class="ctxc ig-ctx" data-a="oracion"><div class="ctxc-top">' + av(p.by, fullN(p.by), 44) + '<div><p class="eyebrow">Tu grupo' + (g ? ' · ' + esc(g.s) : '') + '</p><b>' + esc(first(p.by)) + ' pide oración</b></div></div>' +
        '<p class="muted ig-clamp">' + esc(p.t) + '</p><div class="fu-btns"><button class="btn sm" data-ctx="iglesia" data-k="pray" data-id="' + p.id + '">' + ic('hands-praying') + 'Estoy orando</button>' +
        '<button class="btn ghost sm" data-ctx="iglesia" data-k="open" data-id="' + p.id + '">Ver el pedido</button></div></div>';
    },
    click: el => {
      const id = el.dataset.id;
      if (el.dataset.k === 'pray') { L.sparks(el, 12); pray(id); return; }
      const p = find(id); if (p) pushHere(p.ev ? 'page-ig-evento' : 'page-ig-hilo', { pid: id });
    }
  });

  /* ================= pasar de día y reiniciar ================= */
  L.on('nextDay', () => {
    const S = st();
    S.day = (S.day || 0) + 1;
    const x = POOL[S.day - 1]; if (!x) return;
    const p = { id: 'n' + S.day, ch: x.ch, by: x.by, day: L.tk(), h: x.h, t: x.t, rx: Object.assign({}, x.rx || {}), my: {}, re: [], u: true };
    if (x.grp) p.grp = x.grp;
    if (x.ch === 'oracion') { p.n = x.n; p.thx = x.thx; }
    if (x.link) p.link = x.link;
    if (x.re) p.re = x.re.map((r, i) => Object.assign({ id: p.id + 'r' + i, day: L.tk(), rx: {}, my: {} }, L.clone(r)));
    if (x.sv) p.sv = { date: L.dk(L.addDays(T(), x.sv.plus)), h: x.sv.h, place: x.sv.place, need: x.sv.need, vol: x.sv.vol.slice(), note: x.sv.note };
    S.posts.unshift(p);
    if (x.answers) { const q = S.posts.find(o => o.by === x.answers && o.ch === 'oracion' && !o.ans); if (q) q.ans = { t: 'Empieza a trabajar el lunes', day: L.tk() }; }
  });
  L.on('reset', () => { gen++; fresh.clear(); revealed.clear(); justPosted = null; justReply = null; });

  /* ================= registro en Personas ================= */
  L.pseg.iglesia = {
    render(page) { keep(page.pg, true); return segHTML(); },
    after(page) {
      keep(page.pg, false);
      if (!page._igPress) {
        page._igPress = 1;
        /* «Nuevo» dura mientras miras el canal; al volver al resumen se apaga */
        page.addEventListener('ionViewWillEnter', () => fresh.clear());
        L.press(page, '.ig-pc[data-post]', el => { if (page.seg === 'iglesia') postMenu(el.dataset.post, null, el, page); });
        L.press(page, '[data-igch]', el => { if (page.seg === 'iglesia') chMenu(el.dataset.igch, el); });
      }
    },
    badge: () => unreadAll() > 0,
    click: (e, page) => handle(e, page)
  };
  /* para otros módulos: publicar en un canal o abrir algo del foro */
  window.Iglesia = {
    post(ch, text, o) { if (!CHM[ch]) return null; const S = st(), id = 'm' + (S.nextId++); S.posts.unshift(Object.assign({ id, ch, by: 'JC', day: L.tk(), h: L.nowHM(), t: text, rx: {}, my: {}, re: [] }, ch === 'oracion' ? { n: 0 } : {}, o || {})); commit(); return id; },
    open(id) { const p = find(id); if (p) pushHere(p.ev || p.sv ? 'page-ig-evento' : 'page-ig-hilo', { pid: id }); },
    unread: () => unreadAll()
  };
})();
