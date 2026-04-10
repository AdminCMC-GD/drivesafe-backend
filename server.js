import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
import jwt from 'jsonwebtoken';

dotenv.config();
console.log('JWT_SECRET presente:', !!process.env.JWT_SECRET);
console.log('ADMIN_PASSWORD presente:', !!process.env.ADMIN_PASSWORD);

const { Pool } = pkg;
const app  = express();
const PORT = process.env.PORT || 3001;

// ─── PostgreSQL ──────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Crear tablas si no existen
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS evaluaciones (
      id          SERIAL PRIMARY KEY,
      nombre      TEXT NOT NULL,
      fecha       TIMESTAMPTZ DEFAULT NOW(),
      total_score INTEGER NOT NULL,
      max_score   INTEGER NOT NULL DEFAULT 80,
      risk_level  TEXT NOT NULL,
      pct         INTEGER NOT NULL,
      summary     TEXT,
      top_risks   JSONB,
      recommendations JSONB,
      answers     JSONB NOT NULL
    );
  `);
  console.log('✅ Tabla evaluaciones lista');
}

initDB().catch(console.error);

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'DELETE'],
}));
app.use(express.json());

// ─── Auth Middleware ─────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const payload = jwt.verify(auth.slice(7), secret);
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// ─── Catálogo de preguntas ───────────────────────────────────────────────────
const QUESTION_META = {
  1:  { category: 'velocidad',    label: 'Exceso de velocidad' },
  2:  { category: 'cinturon',     label: 'No usar cinturón' },
  3:  { category: 'cinturon',     label: 'Pasajeros sin cinturón' },
  4:  { category: 'distancia',    label: 'Conducir muy pegado' },
  5:  { category: 'distraccion',  label: 'Hablar por teléfono' },
  6:  { category: 'distraccion',  label: 'Enviar mensajes de texto' },
  7:  { category: 'agresividad',  label: 'Agresividad vial' },
  8:  { category: 'señales',      label: 'No usar señales de giro' },
  9:  { category: 'señales',      label: 'Cruzar señales de alto' },
  10: { category: 'agresividad',  label: 'Hacer señas de luces agresivas' },
  11: { category: 'fatiga',       label: 'Manejar con cansancio' },
  12: { category: 'sustancias',   label: 'Manejar con alcohol' },
  13: { category: 'sustancias',   label: 'Manejar con drogas recreativas' },
  14: { category: 'sustancias',   label: 'Manejar con medicamentos recetados' },
  15: { category: 'sustancias',   label: 'Manejar con medicamentos de venta libre' },
  16: { category: 'agresividad',  label: 'Freno de golpe intencional' },
  17: { category: 'velocidad',    label: 'No adaptar velocidad al clima' },
  18: { category: 'distraccion',  label: 'Programar GPS en movimiento' },
  19: { category: 'distraccion',  label: 'Cambiar música/climatización' },
  20: { category: 'percepcion',   label: 'Percepción de control total' },
};

const CATEGORY_NAMES = {
  velocidad:   'Velocidad y adaptación',
  cinturon:    'Uso del cinturón de seguridad',
  distancia:   'Distancia de seguridad',
  distraccion: 'Distracción al volante',
  agresividad: 'Agresividad vial',
  señales:     'Respeto a señales de tránsito',
  fatiga:      'Manejo con fatiga',
  sustancias:  'Conducción bajo efectos de sustancias',
  percepcion:  'Autopercepción del riesgo',
};

const RISK_TEXTS = {
  sustancias: {
    risk: 'Conducción bajo efectos de sustancias (alcohol, drogas o medicamentos)',
    rec:  'Nunca manejes después de consumir alcohol, drogas o medicamentos que alteren tu capacidad de reacción.',
  },
  distraccion: {
    risk: 'Distracción al volante por uso del teléfono o dispositivos',
    rec:  'Activa el modo "No molestar mientras manejo" en tu teléfono.',
  },
  velocidad: {
    risk: 'Velocidad inadecuada o sin adaptarse a las condiciones de la vía',
    rec:  'Respeta los límites de velocidad y reduce la marcha ante lluvia o niebla.',
  },
  señales: {
    risk: 'Incumplimiento de señales y normas de tránsito',
    rec:  'Detente completamente en señales de alto y usa siempre la señal de giro.',
  },
  agresividad: {
    risk: 'Conducta agresiva o intimidatoria hacia otros conductores',
    rec:  'Practica la paciencia al volante. La agresividad vial escala situaciones peligrosas.',
  },
  cinturon: {
    risk: 'No utilizar el cinturón de seguridad de forma consistente',
    rec:  'El cinturón reduce el riesgo de muerte hasta en un 45%. Hazlo hábito automático.',
  },
  fatiga: {
    risk: 'Manejar en estado de fatiga o somnolencia',
    rec:  'Si sientes somnolencia, detente y descansa 20 minutos o cede el volante.',
  },
  distancia: {
    risk: 'Distancia de seguimiento insuficiente con el vehículo de adelante',
    rec:  'Mantén al menos 3 segundos de distancia y agrega un segundo extra en condiciones adversas.',
  },
  percepcion: {
    risk: 'Sobreestimación de la capacidad de control sobre el entorno vial',
    rec:  'Ningún conductor puede controlar lo que hacen los demás. Anticipa errores ajenos.',
  },
};

// ─── Motor de análisis ───────────────────────────────────────────────────────
function analyzeAnswers(answers) {
  const totalScore = answers.reduce((sum, a) => sum + a.value, 0);
  const maxScore   = 80;

  let riskLevel;
  if      (totalScore <= 15) riskLevel = 'SEGURO';
  else if (totalScore <= 35) riskLevel = 'PRECAUCION';
  else if (totalScore <= 55) riskLevel = 'RIESGO';
  else                       riskLevel = 'ALTO_RIESGO';

  const categoryScores = {};
  for (const ans of answers) {
    const meta = QUESTION_META[ans.questionId];
    if (!meta) continue;
    if (!categoryScores[meta.category]) categoryScores[meta.category] = { score: 0, count: 0 };
    categoryScores[meta.category].score += ans.value;
    categoryScores[meta.category].count += 1;
  }

  const rankedCategories = Object.entries(categoryScores)
    .map(([cat, data]) => ({ category: cat, average: data.score / data.count, score: data.score }))
    .filter(c => c.average > 0)
    .sort((a, b) => b.average - a.average);

  const topRiskCategories = rankedCategories.slice(0, 3);
  const pct = Math.round((totalScore / maxScore) * 100);

  const summaries = {
    SEGURO:      `Tu perfil muestra hábitos de manejo responsables y conscientes — obteniste ${totalScore} de ${maxScore} puntos (${pct}%), lo que indica un bajo nivel de conductas de riesgo.`,
    PRECAUCION:  `Con ${totalScore} de ${maxScore} puntos (${pct}%), tu perfil muestra un nivel de riesgo moderado al volante.`,
    RIESGO:      `Tu resultado de ${totalScore}/${maxScore} puntos (${pct}%) indica un perfil de riesgo elevado. Varias conductas representan factores activos que aumentan la probabilidad de un accidente.`,
    ALTO_RIESGO: `Con ${totalScore} de ${maxScore} puntos (${pct}%), tu evaluación refleja un perfil de alto riesgo al volante.`,
  };

  const topRisks = topRiskCategories.map(c => RISK_TEXTS[c.category]?.risk || CATEGORY_NAMES[c.category]);
  while (topRisks.length < 3) topRisks.push('Mantener atención constante en el entorno vial');

  const recommendations = topRiskCategories.map(c => RISK_TEXTS[c.category]?.rec || 'Refuerza tus hábitos de manejo defensivo.');
  while (recommendations.length < 3) recommendations.push('Practica la conducción defensiva anticipando acciones de otros conductores.');

  return { summary: summaries[riskLevel], topRisks: topRisks.slice(0, 3), recommendations: recommendations.slice(0, 3), riskLevel, pct };
}

// ─── Rutas públicas ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'DriveSafe IQ API', version: '3.0.0' });
});

app.post('/api/analyze', async (req, res) => {
  const { answers, userName } = req.body;
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Se requiere el array de respuestas.' });
  }
  try {
    const feedback   = analyzeAnswers(answers);
    const totalScore = answers.reduce((sum, a) => sum + a.value, 0);
    const maxScore   = 80;

    // Guardar en base de datos
    if (userName) {
      await pool.query(
        `INSERT INTO evaluaciones (nombre, total_score, max_score, risk_level, pct, summary, top_risks, recommendations, answers)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          userName,
          totalScore,
          maxScore,
          feedback.riskLevel,
          feedback.pct,
          feedback.summary,
          JSON.stringify(feedback.topRisks),
          JSON.stringify(feedback.recommendations),
          JSON.stringify(answers),
        ]
      );
    }

    return res.json({ success: true, feedback, totalScore, maxScore });
  } catch (err) {
    console.error('Error en análisis:', err.message);
    return res.status(500).json({ error: 'Error interno al procesar la encuesta.' });
  }
});

// ─── Ruta de Login Admin ────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  const token = jwt.sign({ role: 'admin' }, secret, { expiresIn: '8h' });
  return res.json({ token });
});

// ─── Rutas Admin (protegidas) ────────────────────────────────────────────────
app.get('/api/admin/evaluaciones', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, fecha, total_score, max_score, risk_level, pct
       FROM evaluaciones ORDER BY fecha DESC`
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/evaluaciones/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM evaluaciones WHERE id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/evaluaciones/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM evaluaciones WHERE id = $1', [req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/stats', requireAuth, async (req, res) => {
  try {
    const { rows: total }  = await pool.query('SELECT COUNT(*) as total FROM evaluaciones');
    const { rows: byRisk } = await pool.query(
      `SELECT risk_level, COUNT(*) as count FROM evaluaciones GROUP BY risk_level`
    );
    const { rows: recent } = await pool.query(
      `SELECT nombre, risk_level, total_score, fecha FROM evaluaciones ORDER BY fecha DESC LIMIT 5`
    );
    const { rows: avgScore } = await pool.query(
      `SELECT ROUND(AVG(total_score),1) as avg FROM evaluaciones`
    );
    return res.json({
      total: parseInt(total[0].total),
      byRisk,
      recent,
      avgScore: parseFloat(avgScore[0].avg) || 0,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Export CSV
app.get('/api/admin/export/csv', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, fecha, total_score, max_score, risk_level, pct FROM evaluaciones ORDER BY fecha DESC`
    );
    const headers = 'ID,Nombre,Fecha,Puntuación,Máximo,Nivel de Riesgo,Porcentaje\n';
    const csv = rows.map(r =>
      `${r.id},"${r.nombre}","${new Date(r.fecha).toLocaleString('es-MX')}",${r.total_score},${r.max_score},${r.risk_level},${r.pct}%`
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="evaluaciones-cmc.csv"');
    return res.send('\uFEFF' + headers + csv); // BOM para Excel
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
// ============================================================
// AGREGAR ESTO AL server.js EXISTENTE
// Pega todo este bloque ANTES de la línea: app.listen(PORT, ...)
// ============================================================

// ─── Tablas EC0217 y EC0301 ─────────────────────────────────────────────────
async function initDBDiagnosticos() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ec0217_evaluaciones (
      id              SERIAL PRIMARY KEY,
      -- Datos generales
      nombre          TEXT NOT NULL,
      correo          TEXT NOT NULL,
      empresa         TEXT,
      sector          TEXT,
      ciudad          TEXT NOT NULL,
      estado          TEXT NOT NULL,
      fecha           TIMESTAMPTZ DEFAULT NOW(),
      -- Resultados globales
      total_si        INTEGER NOT NULL,
      total_reactivos INTEGER NOT NULL DEFAULT 185,
      porcentaje      NUMERIC(5,2) NOT NULL,
      recomendacion   TEXT NOT NULL,   -- 'EVALUARSE' | 'ASESORARSE'
      -- Desglose por elemento (SÍes por elemento)
      elem1_si        INTEGER NOT NULL,
      elem1_total     INTEGER NOT NULL DEFAULT 67,
      elem2_si        INTEGER NOT NULL,
      elem2_total     INTEGER NOT NULL DEFAULT 82,
      elem3_si        INTEGER NOT NULL,
      elem3_total     INTEGER NOT NULL DEFAULT 36,
      -- Respuestas completas
      answers         JSONB NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ec0301_evaluaciones (
      id              SERIAL PRIMARY KEY,
      -- Datos generales
      nombre          TEXT NOT NULL,
      correo          TEXT NOT NULL,
      empresa         TEXT,
      sector          TEXT,
      ciudad          TEXT NOT NULL,
      estado          TEXT NOT NULL,
      fecha           TIMESTAMPTZ DEFAULT NOW(),
      -- Resultados globales
      total_si        INTEGER NOT NULL,
      total_reactivos INTEGER NOT NULL DEFAULT 145,
      porcentaje      NUMERIC(5,2) NOT NULL,
      recomendacion   TEXT NOT NULL,   -- 'EVALUARSE' | 'ASESORARSE'
      -- Desglose por elemento
      elem1_si        INTEGER NOT NULL,
      elem1_total     INTEGER NOT NULL DEFAULT 52,
      elem2_si        INTEGER NOT NULL,
      elem2_total     INTEGER NOT NULL DEFAULT 33,
      elem3_si        INTEGER NOT NULL,
      elem3_total     INTEGER NOT NULL DEFAULT 60,
      -- Respuestas completas
      answers         JSONB NOT NULL
    );
  `);

  console.log('✅ Tablas EC0217 y EC0301 listas');
}

initDBDiagnosticos().catch(console.error);

// ─── Datos de México: Estados y ciudades principales ─────────────────────────
// (Usados por el frontend para los selects — también disponibles como API)
const MEXICO_ESTADOS = [
  { estado: 'Aguascalientes',       ciudades: ['Aguascalientes', 'Jesús María', 'Calvillo'] },
  { estado: 'Baja California',      ciudades: ['Tijuana', 'Mexicali', 'Ensenada', 'Tecate', 'Rosarito'] },
  { estado: 'Baja California Sur',  ciudades: ['La Paz', 'Los Cabos', 'Comondú', 'Loreto'] },
  { estado: 'Campeche',             ciudades: ['Campeche', 'Ciudad del Carmen', 'Champotón'] },
  { estado: 'Chiapas',              ciudades: ['Tuxtla Gutiérrez', 'San Cristóbal de las Casas', 'Tapachula', 'Comitán', 'Palenque'] },
  { estado: 'Chihuahua',            ciudades: ['Chihuahua', 'Ciudad Juárez', 'Delicias', 'Cuauhtémoc', 'Hidalgo del Parral'] },
  { estado: 'Ciudad de México',     ciudades: ['Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán', 'Cuajimalpa', 'Cuauhtémoc', 'GAM', 'Iztacalco', 'Iztapalapa', 'Magdalena Contreras', 'Miguel Hidalgo', 'Milpa Alta', 'Tláhuac', 'Tlalpan', 'Venustiano Carranza', 'Xochimilco'] },
  { estado: 'Coahuila',             ciudades: ['Saltillo', 'Torreón', 'Monclova', 'Piedras Negras', 'Acuña'] },
  { estado: 'Colima',               ciudades: ['Colima', 'Manzanillo', 'Tecomán', 'Villa de Álvarez'] },
  { estado: 'Durango',              ciudades: ['Durango', 'Gómez Palacio', 'Lerdo', 'Santiago Papasquiaro'] },
  { estado: 'Estado de México',     ciudades: ['Toluca', 'Ecatepec', 'Naucalpan', 'Tlalnepantla', 'Nezahualcóyotl', 'Chimalhuacán', 'Texcoco', 'Tultitlán', 'Cuautitlán Izcalli'] },
  { estado: 'Guanajuato',           ciudades: ['León', 'Irapuato', 'Celaya', 'Salamanca', 'Guanajuato', 'San Miguel de Allende', 'Silao'] },
  { estado: 'Guerrero',             ciudades: ['Acapulco', 'Chilpancingo', 'Iguala', 'Zihuatanejo', 'Taxco'] },
  { estado: 'Hidalgo',              ciudades: ['Pachuca', 'Tulancingo', 'Tula de Allende', 'Tizayuca'] },
  { estado: 'Jalisco',              ciudades: ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Puerto Vallarta', 'Lagos de Moreno', 'Tepatitlán'] },
  { estado: 'Michoacán',            ciudades: ['Morelia', 'Zamora', 'Uruapan', 'Lázaro Cárdenas', 'Apatzingán'] },
  { estado: 'Morelos',              ciudades: ['Cuernavaca', 'Jiutepec', 'Cuautla', 'Temixco', 'Yautepec'] },
  { estado: 'Nayarit',              ciudades: ['Tepic', 'Bahía de Banderas', 'Santiago Ixcuintla'] },
  { estado: 'Nuevo León',           ciudades: ['Monterrey', 'San Nicolás de los Garza', 'Guadalupe', 'Apodaca', 'General Escobedo', 'Santa Catarina', 'San Pedro Garza García'] },
  { estado: 'Oaxaca',               ciudades: ['Oaxaca de Juárez', 'Salina Cruz', 'Juchitán', 'Tuxtepec', 'Huatulco'] },
  { estado: 'Puebla',               ciudades: ['Puebla', 'Tehuacán', 'San Andrés Cholula', 'Atlixco', 'Izúcar de Matamoros'] },
  { estado: 'Querétaro',            ciudades: ['Querétaro', 'San Juan del Río', 'Corregidora', 'El Marqués'] },
  { estado: 'Quintana Roo',         ciudades: ['Cancún', 'Playa del Carmen', 'Chetumal', 'Cozumel', 'Tulum'] },
  { estado: 'San Luis Potosí',      ciudades: ['San Luis Potosí', 'Ciudad Valles', 'Matehuala', 'Rioverde'] },
  { estado: 'Sinaloa',              ciudades: ['Culiacán', 'Mazatlán', 'Los Mochis', 'Guasave', 'Navolato'] },
  { estado: 'Sonora',               ciudades: ['Hermosillo', 'Ciudad Obregón', 'Nogales', 'San Luis Río Colorado', 'Guaymas'] },
  { estado: 'Tabasco',              ciudades: ['Villahermosa', 'Cárdenas', 'Macuspana', 'Comalcalco', 'Paraíso'] },
  { estado: 'Tamaulipas',           ciudades: ['Reynosa', 'Matamoros', 'Nuevo Laredo', 'Tampico', 'Victoria', 'Altamira'] },
  { estado: 'Tlaxcala',             ciudades: ['Tlaxcala', 'Apizaco', 'Huamantla', 'Chiautempan'] },
  { estado: 'Veracruz',             ciudades: ['Xalapa', 'Veracruz', 'Coatzacoalcos', 'Córdoba', 'Orizaba', 'Poza Rica', 'Minatitlán', 'Tuxpan', 'Papantla'] },
  { estado: 'Yucatán',              ciudades: ['Mérida', 'Valladolid', 'Progreso', 'Kanasín', 'Umán'] },
  { estado: 'Zacatecas',            ciudades: ['Zacatecas', 'Fresnillo', 'Guadalupe', 'Jerez'] },
];

const SECTORES_INDUSTRIALES = [
  'Agricultura, ganadería y pesca',
  'Minería y extracción',
  'Manufactura / Industria',
  'Construcción',
  'Electricidad, gas y agua',
  'Comercio al por mayor',
  'Comercio al por menor',
  'Transporte y logística',
  'Tecnologías de la información',
  'Telecomunicaciones',
  'Servicios financieros y seguros',
  'Servicios inmobiliarios',
  'Educación y capacitación',
  'Salud y servicios médicos',
  'Hotelería y turismo',
  'Alimentos y bebidas',
  'Automotriz',
  'Petróleo, gas y petroquímica',
  'Farmacéutico y biotecnología',
  'Aeroespacial y defensa',
  'Textil y confección',
  'Química e industria básica',
  'Gobierno y sector público',
  'Organización sin fines de lucro / ONG',
  'Consultoría y servicios profesionales',
  'Medios de comunicación y entretenimiento',
  'Deporte y recreación',
  'Seguridad privada',
  'Protección civil y emergencias',
  'Otro (especificar)',
];

// Endpoint para que el frontend obtenga los catálogos
app.get('/api/catalogos', (req, res) => {
  res.json({ estados: MEXICO_ESTADOS, sectores: SECTORES_INDUSTRIALES });
});

// ─── Motor de análisis EC0217 ─────────────────────────────────────────────────
// answers = [{ elementoId: 1|2|3, questionId: 'e1_d1', value: true|false }, ...]
function analizarEC0217(answers) {
  const ELEM_TOTALES = { 1: 67, 2: 83, 3: 36 };
  const TOTAL = 185;

  const siPorElem = { 1: 0, 2: 0, 3: 0 };
  let totalSi = 0;

  for (const a of answers) {
    if (a.value === true) {
      siPorElem[a.elementoId] = (siPorElem[a.elementoId] || 0) + 1;
      totalSi++;
    }
  }

  const porcentaje = parseFloat(((totalSi / TOTAL) * 100).toFixed(2));
  const recomendacion = porcentaje >= 90 ? 'EVALUARSE' : 'ASESORARSE';

  const mensajes = {
    EVALUARSE:   `Obtuviste ${totalSi} de ${TOTAL} respuestas afirmativas (${porcentaje}%). Tu nivel de competencia cumple con los criterios requeridos. Se te recomienda proceder a EVALUARTE con un Centro Evaluador o Evaluador Independiente acreditado ante el CONOCER.`,
    ASESORARSE:  `Obtuviste ${totalSi} de ${TOTAL} respuestas afirmativas (${porcentaje}%). Existen áreas de oportunidad en tu desempeño como instructor. Se te sugiere ASESORARTE con un Centro Evaluador o Evaluador Independiente antes de presentar tu evaluación de competencia.`,
  };

  // Detectar elementos débiles (menos del 90% en ese elemento)
  const elementosDebiles = [];
  const nombresElementos = {
    1: 'Preparar la sesión / curso de capacitación',
    2: 'Conducir la sesión / curso de capacitación',
    3: 'Evaluar la sesión / curso de capacitación',
  };
  for (const [elemId, total] of Object.entries(ELEM_TOTALES)) {
    const si = siPorElem[elemId] || 0;
    const pct = (si / total) * 100;
    if (pct < 90) {
      elementosDebiles.push({ elemento: nombresElementos[elemId], porcentaje: pct.toFixed(1) });
    }
  }

  return {
    totalSi,
    totalReactivos: TOTAL,
    porcentaje,
    recomendacion,
    mensaje: mensajes[recomendacion],
    elementosDebiles,
    desglose: {
      elem1: { si: siPorElem[1] || 0, total: ELEM_TOTALES[1] },
      elem2: { si: siPorElem[2] || 0, total: ELEM_TOTALES[2] },
      elem3: { si: siPorElem[3] || 0, total: ELEM_TOTALES[3] },
    },
  };
}

// ─── Motor de análisis EC0301 ─────────────────────────────────────────────────
function analizarEC0301(answers) {
  const ELEM_TOTALES = { 1: 52, 2: 33, 3: 60 };
  const TOTAL = 145;

  const siPorElem = { 1: 0, 2: 0, 3: 0 };
  let totalSi = 0;

  for (const a of answers) {
    if (a.value === true) {
      siPorElem[a.elementoId] = (siPorElem[a.elementoId] || 0) + 1;
      totalSi++;
    }
  }

  const porcentaje = parseFloat(((totalSi / TOTAL) * 100).toFixed(2));
  const recomendacion = porcentaje >= 90 ? 'EVALUARSE' : 'ASESORARSE';

  const mensajes = {
    EVALUARSE:   `Obtuviste ${totalSi} de ${TOTAL} respuestas afirmativas (${porcentaje}%). Tu nivel de competencia en diseño de cursos cumple con los criterios requeridos. Se te recomienda proceder a EVALUARTE con un Centro Evaluador acreditado ante el CONOCER.`,
    ASESORARSE:  `Obtuviste ${totalSi} de ${TOTAL} respuestas afirmativas (${porcentaje}%). Hay áreas de mejora en tu competencia de diseño. Se te sugiere ASESORARTE con un Centro Evaluador o Evaluador Independiente antes de presentar tu evaluación.`,
  };

  const elementosDebiles = [];
  const nombresElementos = {
    1: 'Diseñar cursos de formación',
    2: 'Diseñar instrumentos de evaluación',
    3: 'Diseñar manuales del curso',
  };
  for (const [elemId, total] of Object.entries(ELEM_TOTALES)) {
    const si = siPorElem[elemId] || 0;
    const pct = (si / total) * 100;
    if (pct < 90) {
      elementosDebiles.push({ elemento: nombresElementos[elemId], porcentaje: pct.toFixed(1) });
    }
  }

  return {
    totalSi,
    totalReactivos: TOTAL,
    porcentaje,
    recomendacion,
    mensaje: mensajes[recomendacion],
    elementosDebiles,
    desglose: {
      elem1: { si: siPorElem[1] || 0, total: ELEM_TOTALES[1] },
      elem2: { si: siPorElem[2] || 0, total: ELEM_TOTALES[2] },
      elem3: { si: siPorElem[3] || 0, total: ELEM_TOTALES[3] },
    },
  };
}

// ─── Rutas EC0217 ────────────────────────────────────────────────────────────
app.post('/api/ec0217/analyze', async (req, res) => {
  const { datosGenerales, answers } = req.body;

  if (!datosGenerales?.nombre || !datosGenerales?.correo || !datosGenerales?.ciudad || !datosGenerales?.estado) {
    return res.status(400).json({ error: 'Faltan datos generales requeridos.' });
  }
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Se requiere el array de respuestas.' });
  }

  try {
    const resultado = analizarEC0217(answers);
    const { nombre, correo, empresa, sector, ciudad, estado } = datosGenerales;

    await pool.query(
      `INSERT INTO ec0217_evaluaciones
        (nombre, correo, empresa, sector, ciudad, estado,
         total_si, total_reactivos, porcentaje, recomendacion,
         elem1_si, elem1_total, elem2_si, elem2_total, elem3_si, elem3_total, answers)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
      [
        nombre, correo, empresa || null, sector || null, ciudad, estado,
        resultado.totalSi, resultado.totalReactivos, resultado.porcentaje, resultado.recomendacion,
        resultado.desglose.elem1.si, resultado.desglose.elem1.total,
        resultado.desglose.elem2.si, resultado.desglose.elem2.total,
        resultado.desglose.elem3.si, resultado.desglose.elem3.total,
        JSON.stringify(answers),
      ]
    );

    return res.json({ success: true, resultado });
  } catch (err) {
    console.error('Error EC0217:', err.message);
    return res.status(500).json({ error: 'Error interno al procesar el diagnóstico.' });
  }
});

// ─── Rutas EC0301 ────────────────────────────────────────────────────────────
app.post('/api/ec0301/analyze', async (req, res) => {
  const { datosGenerales, answers } = req.body;

  if (!datosGenerales?.nombre || !datosGenerales?.correo || !datosGenerales?.ciudad || !datosGenerales?.estado) {
    return res.status(400).json({ error: 'Faltan datos generales requeridos.' });
  }
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Se requiere el array de respuestas.' });
  }

  try {
    const resultado = analizarEC0301(answers);
    const { nombre, correo, empresa, sector, ciudad, estado } = datosGenerales;

    await pool.query(
      `INSERT INTO ec0301_evaluaciones
        (nombre, correo, empresa, sector, ciudad, estado,
         total_si, total_reactivos, porcentaje, recomendacion,
         elem1_si, elem1_total, elem2_si, elem2_total, elem3_si, elem3_total, answers)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
      [
        nombre, correo, empresa || null, sector || null, ciudad, estado,
        resultado.totalSi, resultado.totalReactivos, resultado.porcentaje, resultado.recomendacion,
        resultado.desglose.elem1.si, resultado.desglose.elem1.total,
        resultado.desglose.elem2.si, resultado.desglose.elem2.total,
        resultado.desglose.elem3.si, resultado.desglose.elem3.total,
        JSON.stringify(answers),
      ]
    );

    return res.json({ success: true, resultado });
  } catch (err) {
    console.error('Error EC0301:', err.message);
    return res.status(500).json({ error: 'Error interno al procesar el diagnóstico.' });
  }
});

// ─── Rutas Admin ampliadas para EC0217 y EC0301 ──────────────────────────────

// Listado EC0217
app.get('/api/admin/ec0217', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, correo, empresa, sector, ciudad, estado, fecha,
              total_si, total_reactivos, porcentaje, recomendacion,
              elem1_si, elem2_si, elem3_si
       FROM ec0217_evaluaciones ORDER BY fecha DESC`
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Detalle EC0217
app.get('/api/admin/ec0217/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM ec0217_evaluaciones WHERE id = $1`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Eliminar EC0217
app.delete('/api/admin/ec0217/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM ec0217_evaluaciones WHERE id = $1', [req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Listado EC0301
app.get('/api/admin/ec0301', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, correo, empresa, sector, ciudad, estado, fecha,
              total_si, total_reactivos, porcentaje, recomendacion,
              elem1_si, elem2_si, elem3_si
       FROM ec0301_evaluaciones ORDER BY fecha DESC`
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Detalle EC0301
app.get('/api/admin/ec0301/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM ec0301_evaluaciones WHERE id = $1`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Eliminar EC0301
app.delete('/api/admin/ec0301/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM ec0301_evaluaciones WHERE id = $1', [req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Stats globales ampliadas (DriveSafe + EC0217 + EC0301)
app.get('/api/admin/stats/global', requireAuth, async (req, res) => {
  try {
    const [ds, e17, e301] = await Promise.all([
      pool.query('SELECT COUNT(*) as total, ROUND(AVG(total_score),1) as avg FROM evaluaciones'),
      pool.query('SELECT COUNT(*) as total, ROUND(AVG(porcentaje),1) as avg, COUNT(*) FILTER (WHERE recomendacion=\'EVALUARSE\') as aptos FROM ec0217_evaluaciones'),
      pool.query('SELECT COUNT(*) as total, ROUND(AVG(porcentaje),1) as avg, COUNT(*) FILTER (WHERE recomendacion=\'EVALUARSE\') as aptos FROM ec0301_evaluaciones'),
    ]);
    return res.json({
      drivesafe: { total: parseInt(ds.rows[0].total), avgScore: parseFloat(ds.rows[0].avg) || 0 },
      ec0217:    { total: parseInt(e17.rows[0].total), avgPct: parseFloat(e17.rows[0].avg) || 0, aptos: parseInt(e17.rows[0].aptos) },
      ec0301:    { total: parseInt(e301.rows[0].total), avgPct: parseFloat(e301.rows[0].avg) || 0, aptos: parseInt(e301.rows[0].aptos) },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Export CSV EC0217
app.get('/api/admin/ec0217/export/csv', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, correo, empresa, sector, ciudad, estado, fecha,
              total_si, total_reactivos, porcentaje, recomendacion,
              elem1_si, elem2_si, elem3_si
       FROM ec0217_evaluaciones ORDER BY fecha DESC`
    );
    const headers = 'ID,Nombre,Correo,Empresa,Sector,Ciudad,Estado,Fecha,SÍes,Total,Porcentaje,Recomendación,Elem1 SÍ,Elem2 SÍ,Elem3 SÍ\n';
    const csv = rows.map(r =>
      `${r.id},"${r.nombre}","${r.correo}","${r.empresa||''}","${r.sector||''}","${r.ciudad}","${r.estado}","${new Date(r.fecha).toLocaleString('es-MX')}",${r.total_si},${r.total_reactivos},${r.porcentaje}%,${r.recomendacion},${r.elem1_si},${r.elem2_si},${r.elem3_si}`
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="ec0217-diagnosticos.csv"');
    return res.send('\uFEFF' + headers + csv);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Export CSV EC0301
app.get('/api/admin/ec0301/export/csv', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, correo, empresa, sector, ciudad, estado, fecha,
              total_si, total_reactivos, porcentaje, recomendacion,
              elem1_si, elem2_si, elem3_si
       FROM ec0301_evaluaciones ORDER BY fecha DESC`
    );
    const headers = 'ID,Nombre,Correo,Empresa,Sector,Ciudad,Estado,Fecha,SÍes,Total,Porcentaje,Recomendación,Elem1 SÍ,Elem2 SÍ,Elem3 SÍ\n';
    const csv = rows.map(r =>
      `${r.id},"${r.nombre}","${r.correo}","${r.empresa||''}","${r.sector||''}","${r.ciudad}","${r.estado}","${new Date(r.fecha).toLocaleString('es-MX')}",${r.total_si},${r.total_reactivos},${r.porcentaje}%,${r.recomendacion},${r.elem1_si},${r.elem2_si},${r.elem3_si}`
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="ec0301-diagnosticos.csv"');
    return res.send('\uFEFF' + headers + csv);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ============================================================
// FIN DEL BLOQUE — pega todo esto ANTES de app.listen(PORT,...)
// ============================================================
app.listen(PORT, () => {
  console.log(`✅ DriveSafe IQ API v3 corriendo en puerto ${PORT}`);
});
