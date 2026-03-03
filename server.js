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

app.listen(PORT, () => {
  console.log(`✅ DriveSafe IQ API v3 corriendo en puerto ${PORT}`);
});
