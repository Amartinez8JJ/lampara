/* Lights · datos de ejemplo
   Texto bíblico: Reina-Valera 1960, versículos sueltos de muestra (licencia pendiente para producción). */
window.D = (() => {
  /* ---------- actividades: un color por actividad, misma intensidad (OKLCH L .79 C .13) ---------- */
  const ACTS = ['oracion', 'palabra', 'meditar', 'diario', 'adoracion', 'ayuno', 'encuentro', 'llamada', 'mensaje'];
  const NAME = { oracion: 'Oración', palabra: 'Palabra', meditar: 'Meditar', diario: 'Diario', adoracion: 'Adoración', ayuno: 'Ayuno', encuentro: 'Encuentro', llamada: 'Llamada', mensaje: 'Mensaje' };
  /* cada actividad: glifo blanco relleno en un círculo de su color (dirección «Anillos»: Streaks + Apple Journal) */
  const ICON = { oracion: 'hands-praying', palabra: 'book', meditar: 'water', diario: 'create', adoracion: 'musical-notes', ayuno: 'hourglass', encuentro: 'people', llamada: 'phone', mensaje: 'chatbubble-ellipses' };
  /* formas planas por actividad: solo para arte (portadas de planes), no como ícono */
  const SHAPE = { oracion: 'sh-oracion', palabra: 'sh-palabra', meditar: 'sh-meditar', diario: 'sh-diario', adoracion: 'sh-adoracion', ayuno: 'sh-ayuno', encuentro: 'sh-encuentro', llamada: 'sh-mensaje', mensaje: 'sh-mensaje' };
  const INFO = {
    oracion: { why: 'Hablar con Dios antes que con el mundo.', ref: 'Filipenses 4:6', how: ['Empieza dando gracias', 'Nombra a las personas', 'Termina en silencio'] },
    /* 21/10, pedido del user: llamar a alguien para conversar y preguntarle cómo está (no es un encuentro: es corto y a cualquiera) */
    llamada: { why: 'La congoja en el corazón del hombre lo abate; mas la buena palabra lo alegra.', ref: 'Proverbios 12:25', how: ['Elige a quién llamar', 'Pregúntale cómo está de verdad', 'Ofrécele orar por algo concreto'] },
    palabra: { why: 'Su palabra alumbra el paso de hoy.', ref: 'Salmo 119:105', how: ['Lee despacio', 'Elige un versículo', '¿Qué me pide hoy?'] },
    meditar: { why: 'Quedarte con una frase hasta que baje al corazón.', ref: 'Josué 1:8', how: ['Léela tres veces', 'Quédate en silencio', 'Guarda una palabra'] },
    diario: { why: 'Escribir lo que Dios hace para no olvidarlo.', ref: 'Salmo 103:2', how: ['Una línea alcanza', '¿Qué me dijo hoy?', '¿Qué le respondo?'] },
    adoracion: { why: 'Mirarlo a Él antes que a los problemas.', ref: 'Salmo 95:6', how: ['Canta una canción', 'Agradece tres cosas', 'Lee un salmo en voz alta'] },
    ayuno: { why: 'Dejar algo para tener más hambre de Dios.', ref: 'Mateo 6:17–18', how: ['Toma agua', 'Ora en cada comida que dejas', 'No hace falta contarlo'] },
    encuentro: { why: 'La fe se vive acompañado.', ref: 'Hebreos 10:24–25', how: ['Escucha más de lo que hablas', 'Lleva tu Biblia', 'Terminen orando juntos'] },
    mensaje: { why: 'Una palabra a tiempo sostiene a alguien.', ref: 'Proverbios 25:11', how: ['Un versículo y una pregunta', 'Pregunta cómo orar por él', 'No esperes respuesta'] }
  };

  /* ---------- versículos ---------- */
  const VERSES = [
    { t: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.', r: 'Salmo 119:105' },
    { t: 'Nuevas son cada mañana; grande es tu fidelidad.', r: 'Lamentaciones 3:23' },
    { t: 'La senda de los justos es como la luz de la aurora, que va en aumento hasta que el día es perfecto.', r: 'Proverbios 4:18' },
    { t: 'Yo soy la luz del mundo; el que me sigue, no andará en tinieblas, sino que tendrá la luz de la vida.', r: 'Juan 8:12' },
    { t: 'Estad quietos, y conoced que yo soy Dios.', r: 'Salmo 46:10' },
    { t: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.', r: 'Mateo 11:28' },
    { t: 'Jehová es mi pastor; nada me faltará.', r: 'Salmo 23:1' }
  ];
  /* versículos completos para meditar y memorizar */
  const VTXT = {
    'Juan 13:34': 'Un mandamiento nuevo os doy: Que os améis unos a otros; como yo os he amado, que también os améis unos a otros.',
    'Juan 14:6': 'Jesús le dijo: Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí.',
    'Juan 14:27': 'La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.',
    'Juan 15:4': 'Permaneced en mí, y yo en vosotros. Como el pámpano no puede llevar fruto por sí mismo, si no permanece en la vid, así tampoco vosotros, si no permanecéis en mí.',
    'Juan 15:16': 'No me elegisteis vosotros a mí, sino que yo os elegí a vosotros, y os he puesto para que vayáis y llevéis fruto, y vuestro fruto permanezca.',
    'Juan 16:33': 'Estas cosas os he hablado para que en mí tengáis paz. En el mundo tendréis aflicción; pero confiad, yo he vencido al mundo.',
    'Juan 17:21': 'Para que todos sean uno; como tú, oh Padre, en mí, y yo en ti, que también ellos sean uno en nosotros; para que el mundo crea que tú me enviaste.',
    'Filipenses 4:6': 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.',
    'Salmo 46:10': 'Estad quietos, y conoced que yo soy Dios.'
  };
  /* pasajes con texto para leer en la app */
  const TEXT = {
    'Juan 13': [['13:1', 'Antes de la fiesta de la pascua, sabiendo Jesús que su hora había llegado para que pasase de este mundo al Padre, como había amado a los suyos que estaban en el mundo, los amó hasta el fin.'],
      ['13:14', 'Pues si yo, el Señor y el Maestro, he lavado vuestros pies, vosotros también debéis lavaros los pies los unos a los otros.'],
      ['13:34', 'Un mandamiento nuevo os doy: Que os améis unos a otros; como yo os he amado, que también os améis unos a otros.'],
      ['13:35', 'En esto conocerán todos que sois mis discípulos, si tuviereis amor los unos con los otros.']],
    'Juan 14:1–14': [['14:1', 'No se turbe vuestro corazón; creéis en Dios, creed también en mí.'],
      ['14:2', 'En la casa de mi Padre muchas moradas hay; si así no fuera, yo os lo hubiera dicho; voy, pues, a preparar lugar para vosotros.'],
      ['14:6', 'Jesús le dijo: Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí.'],
      ['14:9', 'El que me ha visto a mí, ha visto al Padre.']],
    'Juan 14:15–31': [['14:15', 'Si me amáis, guardad mis mandamientos.'],
      ['14:16', 'Y yo rogaré al Padre, y os dará otro Consolador, para que esté con vosotros para siempre.'],
      ['14:27', 'La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.']],
    'Juan 15:1–17': [
      ['15:1', 'Yo soy la vid verdadera, y mi Padre es el labrador.'],
      ['15:2', 'Todo pámpano que en mí no lleva fruto, lo quitará; y todo aquel que lleva fruto, lo limpiará, para que lleve más fruto.'],
      ['15:3', 'Ya vosotros estáis limpios por la palabra que os he hablado.'],
      ['15:4', 'Permaneced en mí, y yo en vosotros. Como el pámpano no puede llevar fruto por sí mismo, si no permanece en la vid, así tampoco vosotros, si no permanecéis en mí.'],
      ['15:5', 'Yo soy la vid, vosotros los pámpanos; el que permanece en mí, y yo en él, éste lleva mucho fruto; porque separados de mí nada podéis hacer.'],
      ['15:7', 'Si permanecéis en mí, y mis palabras permanecen en vosotros, pedid todo lo que queréis, y os será hecho.'],
      ['15:9', 'Como el Padre me ha amado, así también yo os he amado; permaneced en mi amor.'],
      ['15:11', 'Estas cosas os he hablado, para que mi gozo esté en vosotros, y vuestro gozo sea cumplido.'],
      ['15:12', 'Este es mi mandamiento: Que os améis unos a otros, como yo os he amado.'],
      ['15:13', 'Nadie tiene mayor amor que este, que uno ponga su vida por sus amigos.'],
      ['15:15', 'Ya no os llamaré siervos, porque el siervo no sabe lo que hace su señor; pero os he llamado amigos, porque todas las cosas que oí de mi Padre, os las he dado a conocer.'],
      ['15:16', 'No me elegisteis vosotros a mí, sino que yo os elegí a vosotros, y os he puesto para que vayáis y llevéis fruto, y vuestro fruto permanezca.']],
    'Juan 15:18–27': [['15:18', 'Si el mundo os aborrece, sabed que a mí me ha aborrecido antes que a vosotros.'],
      ['15:19', 'Si fuerais del mundo, el mundo amaría lo suyo; pero porque no sois del mundo, antes yo os elegí del mundo, por eso el mundo os aborrece.'],
      ['15:26', 'Pero cuando venga el Consolador, a quien yo os enviaré del Padre, el Espíritu de verdad, el cual procede del Padre, él dará testimonio acerca de mí.'],
      ['15:27', 'Y vosotros daréis testimonio también, porque habéis estado conmigo desde el principio.']],
    'Juan 16': [['16:13', 'Pero cuando venga el Espíritu de verdad, él os guiará a toda la verdad.'],
      ['16:22', 'También vosotros ahora tenéis tristeza; pero os volveré a ver, y se gozará vuestro corazón, y nadie os quitará vuestro gozo.'],
      ['16:33', 'Estas cosas os he hablado para que en mí tengáis paz. En el mundo tendréis aflicción; pero confiad, yo he vencido al mundo.']],
    'Juan 17': [['17:3', 'Y esta es la vida eterna: que te conozcan a ti, el único Dios verdadero, y a Jesucristo, a quien has enviado.'],
      ['17:17', 'Santifícalos en tu verdad; tu palabra es verdad.'],
      ['17:21', 'Para que todos sean uno; como tú, oh Padre, en mí, y yo en ti, que también ellos sean uno en nosotros; para que el mundo crea que tú me enviaste.']]
  };

  /* ---------- la Biblia: 66 libros con sus capítulos ---------- */
  const BOOKS = [['Génesis', 50], ['Éxodo', 40], ['Levítico', 27], ['Números', 36], ['Deuteronomio', 34], ['Josué', 24], ['Jueces', 21], ['Rut', 4], ['1 Samuel', 31], ['2 Samuel', 24], ['1 Reyes', 22], ['2 Reyes', 25], ['1 Crónicas', 29], ['2 Crónicas', 36], ['Esdras', 10], ['Nehemías', 13], ['Ester', 10], ['Job', 42], ['Salmos', 150], ['Proverbios', 31], ['Eclesiastés', 12], ['Cantares', 8], ['Isaías', 66], ['Jeremías', 52], ['Lamentaciones', 5], ['Ezequiel', 48], ['Daniel', 12], ['Oseas', 14], ['Joel', 3], ['Amós', 9], ['Abdías', 1], ['Jonás', 4], ['Miqueas', 7], ['Nahúm', 3], ['Habacuc', 3], ['Sofonías', 3], ['Hageo', 2], ['Zacarías', 14], ['Malaquías', 4],
    ['Mateo', 28], ['Marcos', 16], ['Lucas', 24], ['Juan', 21], ['Hechos', 28], ['Romanos', 16], ['1 Corintios', 16], ['2 Corintios', 13], ['Gálatas', 6], ['Efesios', 6], ['Filipenses', 4], ['Colosenses', 4], ['1 Tesalonicenses', 5], ['2 Tesalonicenses', 3], ['1 Timoteo', 6], ['2 Timoteo', 4], ['Tito', 3], ['Filemón', 1], ['Hebreos', 13], ['Santiago', 5], ['1 Pedro', 5], ['2 Pedro', 3], ['1 Juan', 5], ['2 Juan', 1], ['3 Juan', 1], ['Judas', 1], ['Apocalipsis', 22]];
  const AT = 39;
  const TOTAL_CH = BOOKS.reduce((s, b) => s + b[1], 0);
  /* capítulo n (0..1188) → [libro, capítulo] */
  function chapterAt(n) {
    for (const [b, c] of BOOKS) { if (n < c) return [b, n + 1]; n -= c; }
    return ['Apocalipsis', 22];
  }
  /* lectura del día d (1..365) de la Biblia en un año */
  function bibleDay(d) {
    const a = Math.floor((d - 1) * TOTAL_CH / 365), z = Math.max(a, Math.floor(d * TOTAL_CH / 365) - 1);
    const [b1, c1] = chapterAt(a), [b2, c2] = chapterAt(z);
    if (b1 !== b2) return b1 + ' ' + c1 + ' – ' + b2 + ' ' + c2;
    return b1 + ' ' + c1 + (c2 !== c1 ? '–' + c2 : '');
  }

  /* ---------- planes ---------- */
  const JUAN = ['Juan 13', 'Juan 14:1–14', 'Juan 14:15–31', 'Juan 15:1–17', 'Juan 15:18–27', 'Juan 16', 'Juan 17'];
  const JUANM = ['Juan 13:34', 'Juan 14:6', 'Juan 14:27', 'Juan 15:4', 'Juan 15:16', 'Juan 16:33', 'Juan 17:21'];
  const BARRIOS = ['Sajonia', 'Recoleta', 'Villa Morra', 'San Vicente', 'Trinidad', 'Lambaré', 'Barrio Obrero', 'Chacarita', 'Las Mercedes', 'Mburucuyá'];
  /* qué toca el día d de cada plan, por actividad */
  const SEQ = {
    biblia: (a, d) => bibleDay(d),
    juan15: (a, d) => a === 'palabra' ? JUAN[d - 1] : JUANM[d - 1],
    romanos: (a, d) => a === 'palabra' ? 'Romanos ' + Math.ceil(d * 16 / 30) : 'Por el grupo de hombres',
    ciudad: (a, d) => a === 'oracion' ? 'Por ' + BARRIOS[(d - 1) % BARRIOS.length] : 'Ayuno parcial',
    salmos: (a, d) => a === 'palabra' ? 'Salmos ' + (d * 5 - 4) + '–' + (d * 5) : 'Un versículo del día',
    juan21: (a, d) => 'Juan ' + d,
    daniel: (a, d) => a === 'ayuno' ? 'Ayuno de Daniel' : 'Daniel ' + Math.min(12, Math.ceil(d * 12 / 21)),
    gratitud: (a, d) => a === 'diario' ? 'Tres gracias' : 'Dar gracias',
    proverbios: (a, d) => 'Proverbios ' + d,
    propio: (a, d) => NAME[a] + ' · día ' + d
  };
  /* cada plan dice en qué consiste: qué haces, cuánto dura, con quién */
  const PLANS = [
    { id: 'biblia', name: 'Biblia en un año', acts: ['palabra'], len: 365, start: 'year', time: '06:35', min: 18, seq: 'biblia', people: [],
      desc: 'Toda la Escritura en un año: unos tres capítulos por día.', what: ['Lees la porción del día', 'Puedes leer en la app o en tu Biblia'] },
    { id: 'juan15', name: 'Permanecer', sub: 'Juan 13–17', acts: ['palabra', 'meditar'], len: 7, start: -3, time: '06:50', min: 15, seq: 'juan15', people: ['MA'],
      desc: 'Las últimas palabras de Jesús a los suyos. Una lectura y un versículo para quedarte.', what: ['Lees un pasaje de Juan 13–17', 'Meditas un versículo', 'Lo comentas con María'] }
  ];
  const INVITES = [
    { id: 'romanos', name: 'Romanos en 30 días', acts: ['palabra', 'oracion'], len: 30, days: [1, 2, 3, 4, 5], time: '05:45', min: 20, seq: 'romanos', from: 'ER', group: 'Grupo de hombres',
      people: ['ER', 'RG', 'DM', 'MC', 'PB'], note: 'Lo conversamos el jueves',
      desc: 'Un capítulo por día y cinco minutos orando por el grupo.', what: ['Lunes a viernes, un capítulo', 'Cinco minutos por el grupo', 'Lo charlan el jueves a las 19:00'] },
    { id: 'ciudad', name: '21 días por Asunción', acts: ['oracion', 'ayuno'], len: 21, days: [0, 1, 2, 3, 4, 5, 6], time: '12:00', min: 10, seq: 'ciudad', from: 'BP', group: 'El Buen Pastor',
      people: ['ER', 'LM', 'AG', 'TS'], count: 48,
      desc: 'Cada día un barrio de la ciudad y una necesidad concreta.', what: ['Oras por un barrio distinto cada día', 'Un ayuno parcial los miércoles', 'Toda la iglesia, 48 personas'] }
  ];
  const TEMPLATES = [
    { id: 'salmos', name: 'Salmos en 30 días', acts: ['palabra', 'meditar'], len: 30, min: 15, seq: 'salmos', desc: 'Cinco salmos por día y un versículo para llevar.', what: ['Lees cinco salmos', 'Te quedas con un versículo'], tag: 'Para empezar' },
    { id: 'juan21', name: 'Evangelio de Juan', acts: ['palabra'], len: 21, min: 12, seq: 'juan21', desc: 'Un capítulo por día para conocer a Jesús.', what: ['Un capítulo por día', 'Ideal para alguien nuevo'], tag: 'Para empezar' },
    { id: 'gratitud', name: 'Gratitud', acts: ['diario', 'oracion'], len: 7, min: 5, seq: 'gratitud', desc: 'Una semana anotando tres gracias por día.', what: ['Tres gracias en tu diario', 'Una oración corta'], tag: 'Una semana' },
    { id: 'proverbios', name: 'Proverbios del mes', acts: ['palabra'], len: 31, min: 8, seq: 'proverbios', desc: 'El capítulo del número de la fecha.', what: ['Un capítulo por día', 'Sabiduría para la semana'], tag: 'Sabiduría' },
    { id: 'daniel', name: 'Ayuno de Daniel', acts: ['ayuno', 'oracion'], len: 21, min: 20, seq: 'daniel', desc: 'Veintiún días de ayuno parcial y oración con el libro de Daniel.', what: ['Ayuno parcial cada día', 'Lees Daniel', 'Oras por una causa'], tag: 'Con la iglesia' }
  ];

  /* ---------- rutina semanal (days: 0 = domingo … 6 = sábado) ---------- */
  const ROUTINE = [
    { id: 'r1', a: 'oracion', t: 'Oración', h: '06:15', days: [1, 2, 3, 4, 5], n: 'Por María, Daniel y papá' },
    { id: 'r2', a: 'oracion', t: 'Oración', h: '07:30', days: [0, 6] },
    { id: 'r3', a: 'mensaje', t: 'Escribir a mis discípulos', h: '12:30', days: [1], n: 'Un versículo para cada uno' },
    { id: 'r4', a: 'encuentro', t: 'Con Esteban', h: '19:00', days: [2], n: 'Lleva tus preguntas de la semana', with: 'ER' },
    { id: 'r5', a: 'ayuno', t: 'Ayuno parcial', h: '15:00', days: [3], n: 'Por Sofía y su familia' },
    { id: 'r6', a: 'encuentro', t: 'Grupo de hombres', h: '19:00', days: [4], n: 'Romanos 8 · casa de Raúl' },
    { id: 'r7', a: 'diario', t: 'Examen del día', h: '22:00', days: [4, 5], n: 'Gratitud, confesión, entrega' },
    { id: 'r8', a: 'adoracion', t: 'Culto', h: '10:00', days: [0], n: 'El Buen Pastor' },
    { id: 'r9', a: 'encuentro', t: 'Café con María', h: '17:00', days: [6], with: 'MA' },
    { id: 'r10', a: 'encuentro', t: 'Reunión con Lucas', h: '18:00', days: [2], with: 'LO', n: 'Evangelio de Juan' },
    { id: 'r11', a: 'llamada', t: 'Llamar a alguien', h: '20:30', days: [2, 4, 6], n: 'Preguntarle cómo está' }
  ];

  /* ---------- personas ---------- */
  const ME = { id: 'JC', name: 'Juan Carlos Benítez', first: 'Juan Carlos', since: 247 };
  const LEADER = { id: 'ER', name: 'Esteban Rojas', first: 'Esteban', role: 'Pastor', next: 'Martes 19:00' };
  const PEOPLE = [
    { id: 'MA', name: 'María Aguilar', first: 'María', since: 'Desde ene 2025', focus: 'Romanos 8', share: 3, signal: 'bien', plan: { name: 'Romanos 8', pct: 62 },
      log: [{ a: 'mensaje', t: 'Salmo 139', w: 3 }, { a: 'palabra', t: 'Estudiamos Romanos 8:18–25', w: 3 }, { a: 'encuentro', t: 'Café con Lucía', w: 11 }] },
    { id: 'DV', name: 'Daniel Vera', first: 'Daniel', since: 'Desde sep 2024', focus: 'Filipenses 4', share: 2, signal: 'bien', plan: { name: 'Filipenses', pct: 75 },
      log: [{ a: 'oracion', t: 'Por su trabajo nuevo', w: 1 }, { a: 'encuentro', t: 'Café · su ansiedad', w: 5 }] },
    { id: 'SR', name: 'Sofía Ramírez', first: 'Sofía', since: 'Desde mar 2025', focus: 'Salmos', share: 1, signal: 'cuesta', plan: { name: 'Salmos', pct: 18 },
      log: [{ a: 'mensaje', t: '¿Cómo va tu semana?', w: 1 }, { a: 'encuentro', t: 'Visita en su casa', w: 28 }] },
    { id: 'LO', name: 'Lucas Ortega', first: 'Lucas', since: 'Nuevo creyente', focus: 'Evangelio de Juan', share: 0, signal: 'bien', plan: { name: 'Evangelio de Juan', pct: 19 },
      log: [{ a: 'encuentro', t: 'Reunión de los martes', w: 6 }, { a: 'palabra', t: 'Juan 3', w: 6 }] }
  ];
  const SHARE = [
    { n: 'Nada', d: 'No compartes tu progreso.' },
    { n: 'Señal', d: 'Solo cómo estás esta semana.' },
    { n: 'Ritmo', d: 'Qué días encendiste, sin el detalle.' },
    { n: 'Todo', d: 'Tus prácticas del día y de la semana.' }
  ];
  const SIG = { bien: 'Bien', cuesta: 'Me cuesta', hablar: 'Necesito hablar' };
  /* lo que cada discípulo tiene planeado según el día (0 = domingo); with = lo hace contigo */
  const DWEEK = {
    MA: d => [{ a: 'oracion', t: 'Oración', h: '06:30' },
      ...(d >= 1 && d <= 5 ? [{ a: 'palabra', t: ['', 'Romanos 8:1–11', 'Romanos 8:12–17', 'Romanos 8:18–27', 'Romanos 8:28–39', 'Repaso de Romanos 8'][d], h: '07:00' }] : []),
      ...(d === 2 || d === 4 ? [{ a: 'diario', t: 'Una línea', h: '22:00' }] : []),
      ...(d === 0 ? [{ a: 'adoracion', t: 'Culto', h: '10:00' }] : []),
      ...(d === 6 ? [{ a: 'encuentro', t: 'Café con Juan Carlos', h: '17:00', with: true }] : [])],
    DV: d => [{ a: 'oracion', t: 'Oración', h: '06:15' },
      ...(d >= 1 && d <= 5 ? [{ a: 'palabra', t: 'Filipenses ' + ['', '2', '3:1–11', '3:12–21', '4:4–9', '4:10–23'][d], h: '06:40' }] : []),
      ...(d === 4 ? [{ a: 'encuentro', t: 'Grupo de hombres', h: '19:00', with: true }] : []),
      ...(d === 1 || d === 3 ? [{ a: 'meditar', t: 'Filipenses 4:6', h: '21:30' }] : []),
      ...(d === 0 ? [{ a: 'adoracion', t: 'Culto', h: '10:00' }] : [])],
    SR: d => [{ a: 'oracion', t: 'Oración', h: '07:00' },
      ...(d >= 1 && d <= 5 ? [{ a: 'palabra', t: 'Salmo ' + [0, 23, 25, 26, 27, 28][d], h: '07:20' }] : []),
      ...(d === 0 ? [{ a: 'adoracion', t: 'Culto', h: '10:00' }] : [])],
    LO: d => [...(d >= 1 ? [{ a: 'palabra', t: 'Juan ' + d, h: '07:00' }] : []), { a: 'oracion', t: 'Oración', h: '07:15' },
      ...(d === 1 || d === 4 ? [{ a: 'meditar', t: 'Juan 3:16', h: '21:00' }] : []),
      ...(d === 2 ? [{ a: 'encuentro', t: 'Reunión con Juan Carlos', h: '18:00', with: true }] : []),
      ...(d === 0 ? [{ a: 'adoracion', t: 'Culto', h: '10:00' }] : [])]
  };

  /* ---------- encuentros: la última vez, lo que acordaron y de qué conversar ---------- */
  const LAST = {
    MA: { w: -7, notes: 'Le preocupa el cambio de trabajo. Lloró hablando de su mamá.', agree: ['Leer Romanos 8 completo', 'Una línea de diario por día'] },
    LO: { w: -6, notes: 'Preguntó por el bautismo. Está leyendo solo por primera vez.', agree: ['Leer Juan 4 a 6', 'Venir el domingo al culto'] },
    DV: { w: -5, notes: 'La ansiedad lo despierta de noche.', agree: ['Memorizar Filipenses 4:6'] },
    SR: { w: -28, notes: 'Visita en su casa. Está cansada.', agree: ['Llamarla esta semana'] }
  };
  const QUESTIONS = {
    MA: ['¿Qué versículo de Romanos 8 te sostuvo esta semana?', '¿Cómo sigue tu mamá? ¿Cómo oramos?', '¿Dónde viste a Dios en la clínica?'],
    LO: ['¿Qué te llamó la atención de Juan 4?', '¿Qué piensas del bautismo hoy?', '¿Cómo te va orando solo?'],
    DV: ['¿Cuándo te ganó la ansiedad esta semana?', '¿Ya sabes Filipenses 4:6 de memoria?', '¿Qué necesitas del grupo?'],
    SR: ['¿Cómo estás de verdad?', '¿Qué te está costando más?', '¿Cómo te puedo ayudar esta semana?']
  };
  const AGREE_SUG = ['Leer el próximo capítulo', 'Orar juntos por teléfono', 'Memorizar un versículo', 'Venir al grupo el jueves', 'Escribir una línea por día'];
  /* lo que puedes elegir como foco al cerrar la semana */
  const FOCUS = ['Orar por mi familia', 'Leer con constancia', 'Descansar en Dios', 'Servir a alguien', 'Memorizar un versículo', 'Acompañar mejor a los míos'];

  /* ---------- oración ---------- */
  const PETS = [
    { id: 1, who: 'MA', t: 'Trabajo nuevo en la clínica', n: 12, since: -30, check: -9 },
    { id: 2, who: 'yo', t: 'Decisiones del trabajo', n: 9, since: -10 },
    { id: 3, who: 'DV', t: 'Paz en medio de la ansiedad', n: 5, since: -6 },
    { id: 4, who: 'MA', t: 'Sanidad de su mamá', n: 8, since: -21 },
    { id: 5, who: 'SR', t: 'Su familia', n: 3, since: -16, check: -15 },
    { id: 6, who: 'yo', t: 'Salud de papá', n: 14, since: -45, check: -12 }
  ];
  const ANSWERED = [{ who: 'LO', t: 'Que Lucas ame la Palabra', w: -24 }, { who: 'yo', t: 'Trabajo para Daniel', w: -41 }];

  /* ---------- familia ---------- */
  const FAMILY = [
    { id: 'AN', name: 'Ana', role: 'Esposa' },
    { id: 'TO', name: 'Tomás', role: '12 años' },
    { id: 'SO', name: 'Sofi', role: '7 años' }
  ];
  const MESAS = [
    { t: 'La tormenta se calma', r: 'Marcos 4:37–39', v: 'Y levantándose, reprendió al viento, y dijo al mar: Calla, enmudece. Y cesó el viento, y se hizo grande bonanza.',
      kids: '¿Qué te da miedo? ¿Qué hizo Jesús con la tormenta?', big: '¿Qué tormenta tenemos hoy como familia?' },
    { t: 'Cinco panes y dos peces', r: 'Juan 6:9', v: 'Aquí está un muchacho, que tiene cinco panes de cebada y dos pececillos; mas ¿qué es esto para tantos?',
      kids: '¿Qué podrías compartir tú esta semana?', big: '¿Qué tenemos «poco» que podríamos poner en sus manos?' },
    { t: 'La oveja que se perdió', r: 'Lucas 15:4', v: '¿Qué hombre de vosotros, teniendo cien ovejas, si pierde una de ellas, no deja las noventa y nueve en el desierto, y va tras la que se perdió, hasta encontrarla?',
      kids: '¿Cómo se sintió la oveja cuando el pastor la encontró?', big: '¿A quién conocemos que necesita que lo busquen?' }
  ];
  const COUPLE_Q = ['¿Por qué estás agradecida esta semana?', '¿Cómo puedo orar por ti hoy?', '¿Qué te gustaría que hagamos juntos este mes?', '¿Qué te está enseñando Dios últimamente?'];

  /* ---------- iglesia ---------- */
  const CHURCH = { name: 'El Buen Pastor', place: 'Sajonia, Asunción', members: 214 };
  const MEMBERS = { ER: 'Esteban Rojas', LR: 'Lidia Rojas', MD: 'Matías Duarte', LM: 'Laura Méndez', RG: 'Raúl González', DM: 'Diego Martínez', MC: 'Marcos Cabrera', PB: 'Pedro Báez', AG: 'Ana Giménez', TS: 'Tomás Sosa', GA: 'Gustavo Ayala', CV: 'Carmen Villalba', HO: 'Hugo Ortiz', FC: 'Fernanda Cáceres', BP: 'El Buen Pastor' };
  const CHANNELS = [
    { id: 'anuncios', n: 'Anuncios', a: 'mensaje', i: 'megaphone', d: 'De los pastores' },
    { id: 'oracion', n: 'Oración', a: 'oracion', i: 'heart', d: 'Pide y avisa que oras' },
    { id: 'testimonios', n: 'Testimonios', a: 'adoracion', i: 'sparkles', d: 'Lo que Dios hizo' },
    { id: 'preguntas', n: 'Preguntas', a: 'palabra', i: 'help-circle', d: 'Biblia y vida' },
    { id: 'hombres', n: 'Grupo de hombres', a: 'encuentro', i: 'people', d: 'Jueves 19:00 · casa de Raúl' }
  ];
  /* w = minutos atrás */
  const POSTS = [
    { id: 1, ch: 'anuncios', by: 'ER', w: 90, t: 'Este domingo celebramos la Santa Cena. Llega 10 minutos antes.', rx: { amen: 34, gracias: 12 } },
    { id: 2, ch: 'anuncios', by: 'LR', w: 1500, t: 'La colecta de abrigos sigue hasta el sábado. Traelos al templo.', rx: { amen: 21 } },
    { id: 3, ch: 'oracion', by: 'GA', w: 40, t: 'Por mi familia: nos mudamos el sábado y hay mucho cansancio.', pray: 8 },
    { id: 4, ch: 'oracion', by: 'CV', w: 300, t: 'Mi mamá entra a cirugía el miércoles. Gracias por orar.', pray: 23 },
    { id: 5, ch: 'oracion', by: 'anon', w: 720, t: 'Por mi matrimonio. Estamos pasando un tiempo difícil.', pray: 31 },
    { id: 6, ch: 'testimonios', by: 'MC', w: 200, t: '¡Me llamaron de la entrevista! Empiezo el lunes. Gracias a todos los que oraron.', rx: { gloria: 31, amen: 9 } },
    { id: 7, ch: 'preguntas', by: 'PB', w: 600, t: '¿Cómo oro por alguien que no quiere saber nada de Dios?', replies: [{ by: 'ER', t: 'Con constancia y sin discursos. Pídele a Dios oportunidades para servirlo. Lo charlamos el jueves.' }] },
    { id: 8, ch: 'hombres', by: 'RG', w: 120, t: 'El jueves seguimos con Romanos 8:28–39. Traigan una pregunta cada uno.', rx: { amen: 6 } }
  ];
  const RX = { amen: 'Amén', gracias: 'Gracias', gloria: '¡Gloria a Dios!' };
  const EVENTS = [
    { id: 'e1', t: 'Culto de jóvenes', dow: 6, h: '18:30', place: 'Templo' },
    { id: 'e2', t: 'Santa Cena', dow: 0, h: '10:00', place: 'Templo' },
    { id: 'e3', t: 'Colecta de abrigos', dow: 5, h: '08:00', place: 'Templo' }
  ];

  /* ---------- camino: logros, memoria, lo que te llevas ---------- */
  const MEMO = [
    { r: 'Salmo 119:105', t: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.', lvl: 3 },
    { r: 'Juan 14:6', t: 'Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí.', lvl: 3 },
    { r: 'Filipenses 4:13', t: 'Todo lo puedo en Cristo que me fortalece.', lvl: 3 },
    { r: 'Filipenses 4:6', t: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.', lvl: 2 },
    { r: 'Juan 15:5', t: 'Yo soy la vid, vosotros los pámpanos; el que permanece en mí, y yo en él, éste lleva mucho fruto.', lvl: 1 }
  ];
  const KEEPS = [
    { a: 'palabra', t: 'Yo soy el camino, y la verdad, y la vida', r: 'Juan 14:6', w: -2 },
    { a: 'diario', t: 'Permanecer no es esfuerzo, es estar pegado.', w: -2 },
    { a: 'palabra', t: 'Que os améis unos a otros', r: 'Juan 13:34', w: -3 }
  ];
  /* veces que leíste cada libro (la Biblia completa en 2025, segunda vuelta en curso) */
  const READ = { 'Génesis': 2, 'Éxodo': 2, 'Levítico': 2, 'Números': 2, 'Deuteronomio': 2, 'Josué': 2, 'Jueces': 2, 'Rut': 2, '1 Samuel': 2, 'Mateo': 2, 'Marcos': 2, 'Lucas': 2, 'Juan': 3, 'Romanos': 2, 'Efesios': 2, 'Filipenses': 3, 'Santiago': 2, '1 Juan': 2, 'Salmos': 2, 'Proverbios': 3 };
  const ACH = [
    { id: 'biblia', a: 'palabra', i: 'book', t: 'Biblia completa', d: 'Los 66 libros', w: '31 dic 2025' },
    { id: 'evangelios', a: 'palabra', i: 'book', t: 'Cuatro evangelios', d: 'Mateo, Marcos, Lucas y Juan', w: '20 feb' },
    { id: 'pastor', a: 'encuentro', i: 'people', t: 'Pastor', d: 'Acompañas a cuatro personas', w: '2 mar' },
    { id: 'gracia', a: null, i: 'sunny', t: 'Gracia', d: 'Volviste después de un día sin registro', w: '9 abr' },
    { id: 'semanas20', a: null, i: 'flame', t: 'Veinte semanas', d: 'Semanas encendidas en el año', goal: 20, key: 'weeksLit' },
    { id: 'intercesor', a: 'oracion', i: 'heart', t: 'Intercesor', d: 'Cien oraciones por otros', goal: 100, key: 'prayOthers' },
    { id: 'testigo', a: 'oracion', i: 'star', t: 'Testigo', d: 'Cinco oraciones contestadas', goal: 5, key: 'answered' },
    { id: 'memoria5', a: 'meditar', i: 'leaf', t: 'Cinco de memoria', d: 'Versículos que ya sabes', goal: 5, key: 'memo' },
    { id: 'papel', a: 'palabra', i: 'library', t: 'Biblia en mano', d: 'Leíste en tu Biblia de papel', goal: 1, key: 'paper' },
    { id: 'diario30', a: 'diario', i: 'create', t: 'Lo que Dios hace', d: 'Treinta líneas en tu diario', goal: 30, key: 'diary' }
  ];

  return { SHAPE, LAST, QUESTIONS, AGREE_SUG, FOCUS, ACTS, NAME, ICON, INFO, VERSES, VTXT, TEXT, BOOKS, AT, bibleDay, SEQ, PLANS, INVITES, TEMPLATES, ROUTINE, ME, LEADER, PEOPLE, SHARE, SIG, DWEEK, PETS, ANSWERED,
    FAMILY, MESAS, COUPLE_Q, CHURCH, MEMBERS, CHANNELS, POSTS, RX, EVENTS, MEMO, KEEPS, READ, ACH };
})();
