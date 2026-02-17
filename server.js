import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// ─── Catálogo de preguntas con categoría y peso ────────────────────────────
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

// ─── Banco de textos por categoría ─────────────────────────────────────────
const RISK_TEXTS = {
  sustancias: {
    risk: 'Conducción bajo efectos de sustancias (alcohol, drogas o medicamentos)',
    rec:  'Nunca manejes después de consumir alcohol, drogas o medicamentos que alteren tu capacidad de reacción. Planifica con anticipación: designa un conductor o usa transporte alternativo.',
  },
  distraccion: {
    risk: 'Distracción al volante por uso del teléfono o dispositivos',
    rec:  'Activa el modo "No molestar mientras manejo" en tu teléfono. Si necesitas usar el GPS o cambiar la música, detente en un lugar seguro antes de hacerlo.',
  },
  velocidad: {
    risk: 'Velocidad inadecuada o sin adaptarse a las condiciones de la vía',
    rec:  'Respeta los límites de velocidad y reduce la marcha ante lluvia, niebla o vías en mal estado. Llegar unos minutos tarde nunca justifica el riesgo.',
  },
  señales: {
    risk: 'Incumplimiento de señales y normas de tránsito',
    rec:  'Las señales de tránsito existen para coordinar el flujo vehicular y proteger vidas. Detenerse completamente en una señal de alto y usar la señal de giro siempre son hábitos que pueden evitar accidentes graves.',
  },
  agresividad: {
    risk: 'Conducta agresiva o intimidatoria hacia otros conductores',
    rec:  'La agresividad al volante eleva el estrés de todos y puede escalar a situaciones peligrosas. Practica la paciencia: el otro conductor posiblemente no lo hizo con intención.',
  },
  cinturon: {
    risk: 'No utilizar el cinturón de seguridad de forma consistente',
    rec:  'El cinturón reduce el riesgo de muerte en accidentes hasta en un 45%. Conviértelo en un hábito automático antes de arrancar, y exígelo también a tus pasajeros.',
  },
  fatiga: {
    risk: 'Manejar en estado de fatiga o somnolencia',
    rec:  'Manejar con sueño tiene efectos similares a hacerlo con alcohol. Si sientes somnolencia, detente, descansa 20 minutos o cede el volante a otra persona.',
  },
  distancia: {
    risk: 'Distancia de seguimiento insuficiente con el vehículo de adelante',
    rec:  'Mantén al menos 2 segundos de distancia con el vehículo de adelante en condiciones normales, y el doble en lluvia o de noche. Esto te da tiempo de reacción real.',
  },
  percepcion: {
    risk: 'Sobreestimación de la capacidad de control sobre el entorno vial',
    rec:  'Ningún conductor puede controlar lo que hacen los demás. Maneja siempre con la guardia puesta, anticipando posibles errores ajenos.',
  },
};

// ─── Motor de análisis ──────────────────────────────────────────────────────
function analyzeAnswers(answers) {
  const totalScore = answers.reduce((sum, a) => sum + a.value, 0);
  const maxScore   = 80; // 20 preguntas × 4 puntos

  // Determinar nivel de riesgo
  let riskLevel;
  if      (totalScore <= 15) riskLevel = 'SEGURO';
  else if (totalScore <= 35) riskLevel = 'PRECAUCION';
  else if (totalScore <= 55) riskLevel = 'RIESGO';
  else                       riskLevel = 'ALTO_RIESGO';

  // Puntaje por categoría
  const categoryScores = {};
  for (const ans of answers) {
    const meta = QUESTION_META[ans.questionId];
    if (!meta) continue;
    if (!categoryScores[meta.category]) categoryScores[meta.category] = { score: 0, count: 0 };
    categoryScores[meta.category].score += ans.value;
    categoryScores[meta.category].count += 1;
  }

  // Calcular promedio por categoría y ordenar de mayor a menor
  const rankedCategories = Object.entries(categoryScores)
    .map(([cat, data]) => ({
      category: cat,
      average:  data.score / data.count,
      score:    data.score,
    }))
    .filter(c => c.average > 0)
    .sort((a, b) => b.average - a.average);

  // Top 3 riesgos más altos
  const topRiskCategories = rankedCategories.slice(0, 3);

  // Preguntas con puntaje más alto (para mencionar en el resumen)
  const highScoreAnswers = answers
    .filter(a => a.value >= 3)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  // ── Generar resumen personalizado ─────────────────────────────────────────
  const pct = Math.round((totalScore / maxScore) * 100);

  const summaries = {
    SEGURO: `Tu perfil muestra hábitos de manejo responsables y conscientes — obteniste ${totalScore} de ${maxScore} puntos (${pct}%), lo que indica un bajo nivel de conductas de riesgo. Esto refleja un compromiso real con tu seguridad y la de quienes te rodean en la vía. Aun así, siempre hay oportunidad de reforzar algún hábito puntual para mantener ese estándar.`,

    PRECAUCION: `Con ${totalScore} de ${maxScore} puntos (${pct}%), tu perfil muestra un nivel de riesgo moderado al volante. Tienes buenas bases como conductor, pero existen algunas conductas que, si se repiten con frecuencia, pueden aumentar significativamente las probabilidades de un incidente. Identificarlas y trabajarlas puede marcar una gran diferencia en tu seguridad diaria.`,

    RIESGO: `Tu resultado de ${totalScore}/${maxScore} puntos (${pct}%) indica un perfil de riesgo elevado. Varias de tus conductas al volante representan factores de riesgo activos que aumentan la probabilidad de estar involucrado en un accidente. Es importante tomar acción concreta sobre los puntos identificados — pequeños cambios de hábito pueden tener un impacto enorme en tu seguridad y la de los demás.`,

    ALTO_RIESGO: `Con ${totalScore} de ${maxScore} puntos (${pct}%), tu evaluación refleja un perfil de alto riesgo al volante. Diversas conductas registradas en esta encuesta están directamente asociadas a los principales factores de accidentes de tránsito en México. Te recomendamos revisar con seriedad cada uno de los puntos identificados y considerar una capacitación en seguridad vial. Manejar de forma segura es una responsabilidad que compartimos todos.`,
  };

  const summary = summaries[riskLevel];

  // ── Top 3 riesgos como textos ──────────────────────────────────────────────
  const topRisks = topRiskCategories.map(c => {
    const text = RISK_TEXTS[c.category];
    return text ? text.risk : CATEGORY_NAMES[c.category];
  });

  // Asegurarse de tener siempre 3 elementos
  while (topRisks.length < 3) {
    topRisks.push('Mantener atención constante en el entorno vial');
  }

  // ── Recomendaciones correspondientes ─────────────────────────────────────
  const recommendations = topRiskCategories.map(c => {
    const text = RISK_TEXTS[c.category];
    return text ? text.rec : 'Refuerza tus hábitos de manejo defensivo en esta área.';
  });

  while (recommendations.length < 3) {
    recommendations.push('Practica la conducción defensiva anticipando las acciones de otros conductores.');
  }

  return {
    summary,
    topRisks:        topRisks.slice(0, 3),
    recommendations: recommendations.slice(0, 3),
    riskLevel,
  };
}

// ─── Rutas ──────────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'DriveSafe IQ API', version: '2.0.0' });
});

app.post('/api/analyze', (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Se requiere el array de respuestas (answers).' });
  }

  try {
    const feedback   = analyzeAnswers(answers);
    const totalScore = answers.reduce((sum, a) => sum + a.value, 0);
    const maxScore   = 80;

    return res.json({ success: true, feedback, totalScore, maxScore });
  } catch (err) {
    console.error('Error en análisis:', err.message);
    return res.status(500).json({ error: 'Error interno al procesar la encuesta.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ DriveSafe IQ API corriendo en puerto ${PORT}`);
});
