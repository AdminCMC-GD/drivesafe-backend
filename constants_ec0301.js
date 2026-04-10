// ============================================================
// constants_ec0301.js
// Todas las preguntas del diagnóstico EC0301
// 145 reactivos divididos en 3 elementos
// Respuestas: true (SÍ) / false (NO)
// ============================================================

export const DIAGNOSTICO_INFO = {
  codigo:    'EC0301',
  titulo:    'Diseño de cursos de formación del capital humano',
  subtitulo: 'de manera presencial grupal, sus instrumentos de evaluación y manuales del curso',
  total:     145,
  tiempo:    '30 minutos aprox.',
};

export const ELEMENTOS = [
  {
    id: 1,
    titulo: 'Elemento 1 de 3',
    descripcion: 'Diseñar cursos de formación del capital humano de manera presencial grupal',
    total: 52,
    secciones: [
      {
        id: 'e1_prod',
        tipo: 'PRODUCTOS',
        preguntaBase: '¿Usted obtiene los siguientes PRODUCTOS?',
        grupos: [
          {
            encabezado: 'La carta descriptiva elaborada:',
            preguntas: [
              { id: 'e1_p1',  texto: 'Se presenta en formato digital y/o impreso' },
              { id: 'e1_p2',  texto: 'Indica el nombre del curso' },
              { id: 'e1_p3',  texto: 'Contiene el campo para registrar el nombre de la persona que diseñó el curso' },
              { id: 'e1_p4',  texto: 'Contiene el campo para registrar la(s) fecha(s) de impartición del curso' },
              { id: 'e1_p5',  texto: 'Describe los requisitos de ingreso de los participantes' },
              { id: 'e1_p6',  texto: 'Indica el número de participantes' },
              { id: 'e1_p7',  texto: 'Contiene los objetivos de aprendizaje' },
              { id: 'e1_p8',  texto: 'Especifica los momentos de capacitación' },
              { id: 'e1_p9',  texto: 'Describe el contenido del curso' },
              { id: 'e1_p10', texto: 'Especifica las técnicas de instrucción' },
              { id: 'e1_p11', texto: 'Especifica las técnicas grupales' },
              { id: 'e1_p12', texto: 'Describe las actividades del proceso de instrucción-aprendizaje' },
              { id: 'e1_p13', texto: 'Describe las estrategias de evaluación de los aprendizajes' },
              { id: 'e1_p14', texto: 'Refiere los materiales didácticos a utilizar' },
              { id: 'e1_p15', texto: 'Establece los tiempos programados para el desarrollo de las actividades' },
              { id: 'e1_p16', texto: 'Se presenta sin errores ortográficos' },
            ],
          },
          {
            encabezado: 'El objetivo general del curso redactado:',
            preguntas: [
              { id: 'e1_p17', texto: 'Determina el sujeto de aprendizaje' },
              { id: 'e1_p18', texto: 'Indica la conducta, producto, y/o actitud de aprendizaje a alcanzar por el participante' },
              { id: 'e1_p19', texto: 'Especifica las condiciones de operación' },
              { id: 'e1_p20', texto: 'Especifica los límites de tiempo, calidad, exactitud y/o criterio aceptable' },
            ],
          },
          {
            encabezado: 'Los objetivos particulares y/o específicos elaborados:',
            preguntas: [
              { id: 'e1_p21', texto: 'Determinan el sujeto de aprendizaje' },
              { id: 'e1_p22', texto: 'Indican la conducta, producto, y/o actitud de aprendizaje a alcanzar por el participante' },
              { id: 'e1_p23', texto: 'Especifican las condiciones de operación' },
              { id: 'e1_p24', texto: 'Especifican los límites de tiempo, calidad, exactitud y/o criterio aceptable' },
              { id: 'e1_p25', texto: 'Son congruentes con los temas del curso' },
              { id: 'e1_p26', texto: 'Son congruentes con las características de los participantes' },
            ],
          },
          {
            encabezado: 'Los temas y subtemas definidos:',
            preguntas: [
              { id: 'e1_p27', texto: 'Son congruentes entre sí' },
              { id: 'e1_p28', texto: 'Corresponden con los objetivos de aprendizaje' },
              { id: 'e1_p29', texto: 'Se desarrollan en una secuencia de lo simple a lo complejo' },
            ],
          },
          {
            encabezado: 'Las técnicas de instrucción seleccionadas:',
            preguntas: [
              { id: 'e1_p30', texto: 'Corresponden con los objetivos de aprendizaje' },
              { id: 'e1_p31', texto: 'Corresponden con los requisitos de ingreso de los participantes' },
              { id: 'e1_p32', texto: 'Corresponden con el número de participantes' },
            ],
          },
          {
            encabezado: 'Las técnicas grupales seleccionadas:',
            preguntas: [
              { id: 'e1_p33', texto: 'Están planeadas para favorecer la dinámica secuencial del proceso instrucción-aprendizaje' },
              { id: 'e1_p34', texto: 'Corresponden con el perfil del grupo' },
              { id: 'e1_p35', texto: 'Corresponden con el número de participantes' },
            ],
          },
          {
            encabezado: 'Las actividades del proceso de instrucción-aprendizaje definidas:',
            preguntas: [
              { id: 'e1_p36', texto: 'Corresponden con el nivel de ejecución de los objetivos' },
              { id: 'e1_p37', texto: 'Son congruentes con los temas del curso' },
              { id: 'e1_p38', texto: 'Corresponden con el perfil del grupo' },
              { id: 'e1_p39', texto: 'Especifican el desarrollo de las técnicas empleadas' },
            ],
          },
          {
            encabezado: 'Las estrategias de evaluación determinadas:',
            preguntas: [
              { id: 'e1_p40', texto: 'Corresponden con los objetivos de aprendizaje' },
              { id: 'e1_p41', texto: 'Contienen los criterios de evaluación a utilizar' },
              { id: 'e1_p42', texto: 'Contienen los instrumentos que se aplicarán en los tres momentos de la evaluación: Diagnóstica, formativa y sumativa' },
              { id: 'e1_p43', texto: 'Menciona los instrumentos a utilizar' },
              { id: 'e1_p44', texto: 'Describen las evidencias que el participante deberá demostrar como resultado del aprendizaje' },
            ],
          },
          {
            encabezado: 'Los materiales didácticos seleccionados:',
            preguntas: [
              { id: 'e1_p45', texto: 'Corresponden con las actividades de la carta descriptiva' },
              { id: 'e1_p46', texto: 'Son congruentes con las características de los participantes' },
              { id: 'e1_p47', texto: 'Corresponden con los temas del curso' },
            ],
          },
        ],
      },
      {
        id: 'e1_conoc',
        tipo: 'CONOCIMIENTOS',
        preguntaBase: '¿Cuenta con los siguientes CONOCIMIENTOS?',
        grupos: [
          {
            encabezado: 'Cuenta con conocimientos en los siguientes temas:',
            preguntas: [
              { id: 'e1_c1', texto: 'Principios de las siguientes teorías del aprendizaje: Conductismo, Cognitivismo, Constructivismo, Humanismo' },
              { id: 'e1_c2', texto: 'Principios de educación de adultos: Necesidad de saber, Disposición para aprender, Motivación para aprender, Recuperación de la experiencia, Desaprendizaje, Aplicación práctica en la vida real' },
              { id: 'e1_c3', texto: 'Descripción de las siguientes técnicas instruccionales: Expositiva, Diálogo/discusión, Demostración/ejecución' },
              { id: 'e1_c4', texto: 'Descripción de las siguientes técnicas grupales: Rompehielo, Energetizante, Cierre' },
            ],
          },
        ],
      },
      {
        id: 'e1_ahv',
        tipo: 'ACTITUDES / HÁBITOS / VALORES',
        preguntaBase: '¿Presenta las siguientes ACTITUDES / HÁBITOS / VALORES?',
        grupos: [
          {
            encabezado: 'Usted presenta:',
            preguntas: [
              { id: 'e1_a1', texto: 'Orden: La manera en que se presentan los temas y subtemas de lo simple a lo complejo' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 2,
    titulo: 'Elemento 2 de 3',
    descripcion: 'Diseñar instrumentos para la evaluación de cursos de formación del capital humano de manera presencial grupal',
    total: 33,
    secciones: [
      {
        id: 'e2_prod',
        tipo: 'PRODUCTOS',
        preguntaBase: '¿Usted obtiene los siguientes PRODUCTOS?',
        grupos: [
          {
            encabezado: 'Los instrumentos de evaluación elaborados:',
            preguntas: [
              { id: 'e2_p1',  texto: 'Indican el nombre del curso' },
              { id: 'e2_p2',  texto: 'Contienen espacio para registrar el nombre del instructor' },
              { id: 'e2_p3',  texto: 'Contienen espacio para registrar el nombre del participante' },
              { id: 'e2_p4',  texto: 'Contienen espacio para registrar la fecha de aplicación' },
              { id: 'e2_p5',  texto: 'Detallan las instrucciones de aplicación' },
              { id: 'e2_p6',  texto: 'Contienen los reactivos de evaluación' },
              { id: 'e2_p7',  texto: 'Incluyen las claves de respuestas para el evaluador y/o instructor' },
              { id: 'e2_p8',  texto: 'Corresponden con las estrategias de evaluación mencionadas en la carta descriptiva' },
              { id: 'e2_p9',  texto: 'Se presenta en formato digital y/o impreso' },
              { id: 'e2_p10', texto: 'Se presentan sin errores ortográficos' },
            ],
          },
          {
            encabezado: 'Las instrucciones de aplicación de los instrumentos de evaluación elaboradas:',
            preguntas: [
              { id: 'e2_p11', texto: 'Establecen las condiciones de aplicación' },
              { id: 'e2_p12', texto: 'Establecen los tiempos para la evaluación' },
              { id: 'e2_p13', texto: 'Contienen las indicaciones para el participante' },
              { id: 'e2_p14', texto: 'Contienen las indicaciones para el evaluador' },
            ],
          },
          {
            encabezado: 'Los reactivos del instrumento de evaluación elaborados:',
            preguntas: [
              { id: 'e2_p15', texto: 'Corresponden con los objetivos de aprendizaje' },
              { id: 'e2_p16', texto: 'Son congruentes con el tipo de instrumento' },
              { id: 'e2_p17', texto: 'Verifican una sola evidencia y/o característica' },
              { id: 'e2_p18', texto: 'Son medibles' },
              { id: 'e2_p19', texto: 'Indican su valor' },
            ],
          },
          {
            encabezado: 'Las claves de respuestas para el evaluador elaboradas:',
            preguntas: [
              { id: 'e2_p20', texto: 'Contienen las respuestas definidas como correctas' },
              { id: 'e2_p21', texto: 'Indican la ponderación de cada reactivo' },
              { id: 'e2_p22', texto: 'Señalan el puntaje total esperado' },
            ],
          },
          {
            encabezado: 'El instrumento para la evaluación de satisfacción del curso diseñado:',
            preguntas: [
              { id: 'e2_p23', texto: 'Contiene el espacio para registrar el nombre del curso' },
              { id: 'e2_p24', texto: 'Contiene espacio para registrar el nombre de instructor' },
              { id: 'e2_p25', texto: 'Enuncia las instrucciones generales de aplicación' },
              { id: 'e2_p26', texto: 'Señala la escala de estimación del nivel de satisfacción del curso' },
              { id: 'e2_p27', texto: 'Incluye los reactivos sobre las características del evento' },
              { id: 'e2_p28', texto: 'Incluye los reactivos sobre el contenido del curso' },
              { id: 'e2_p29', texto: 'Incluye los reactivos sobre los materiales didácticos empleados' },
              { id: 'e2_p30', texto: 'Incluye los reactivos sobre el desempeño del instructor' },
              { id: 'e2_p31', texto: 'Contiene espacios para el registro de comentarios' },
            ],
          },
        ],
      },
      {
        id: 'e2_conoc',
        tipo: 'CONOCIMIENTOS',
        preguntaBase: '¿Cuenta con los siguientes CONOCIMIENTOS?',
        grupos: [
          {
            encabezado: 'Cuenta con conocimientos en los siguientes temas:',
            preguntas: [
              { id: 'e2_c1', texto: 'Definición de validez y confiabilidad de los instrumentos de evaluación' },
              { id: 'e2_c2', texto: 'Características de los siguientes tipos de instrumentos de evaluación: De habilidades y destrezas, De conocimiento' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 3,
    titulo: 'Elemento 3 de 3',
    descripcion: 'Diseñar manuales del curso de formación del capital humano de manera presencial grupal',
    total: 60,
    secciones: [
      {
        id: 'e3_prod',
        tipo: 'PRODUCTOS',
        preguntaBase: '¿Usted obtiene los siguientes PRODUCTOS?',
        grupos: [
          {
            encabezado: 'El manual del participante elaborado:',
            preguntas: [
              { id: 'e3_p1',  texto: 'Incluye nombre del curso' },
              { id: 'e3_p2',  texto: 'Menciona el nombre de la persona que diseñó el curso' },
              { id: 'e3_p3',  texto: 'Contiene el índice del curso' },
              { id: 'e3_p4',  texto: 'Contiene la presentación del manual' },
              { id: 'e3_p5',  texto: 'Contiene la introducción' },
              { id: 'e3_p6',  texto: 'Señala el objetivo general del curso acorde a la carta descriptiva' },
              { id: 'e3_p7',  texto: 'Señala los objetivos particulares y/o específicos del curso acordes a la carta descriptiva' },
              { id: 'e3_p8',  texto: 'Desglosa los temas' },
              { id: 'e3_p9',  texto: 'Indica las fuentes de información documental o tomadas de la internet' },
              { id: 'e3_p10', texto: 'Se presenta en formato digital y/o impreso' },
              { id: 'e3_p11', texto: 'Se presenta sin errores ortográficos' },
            ],
          },
          {
            encabezado: 'La presentación del manual del participante elaborada:',
            preguntas: [
              { id: 'e3_p12', texto: 'Contiene la bienvenida al participante' },
              { id: 'e3_p13', texto: 'Ofrece recomendaciones acerca de la forma de utilizar el manual' },
              { id: 'e3_p14', texto: 'Describe la organización del manual' },
            ],
          },
          {
            encabezado: 'La introducción del manual del participante desarrollada:',
            preguntas: [
              { id: 'e3_p15', texto: 'Contiene un resumen de los temas' },
              { id: 'e3_p16', texto: 'Señala el beneficio que el curso aportará a los participantes' },
              { id: 'e3_p17', texto: 'Establece el enfoque didáctico del curso' },
              { id: 'e3_p18', texto: 'Es congruente con el objetivo de aprendizaje' },
            ],
          },
          {
            encabezado: 'Los temas desarrollados del manual del participante:',
            preguntas: [
              { id: 'e3_p19', texto: 'Corresponden con la carta descriptiva' },
              { id: 'e3_p20', texto: 'Son congruentes con los objetivos de aprendizaje' },
              { id: 'e3_p21', texto: 'Mencionan los objetivos particulares y/o específicos' },
              { id: 'e3_p22', texto: 'Están desarrollados de lo simple a lo complejo' },
              { id: 'e3_p23', texto: 'Describen las actividades necesarias para el desarrollo del tema' },
              { id: 'e3_p24', texto: 'Contienen las síntesis y/o conclusiones del contenido de los temas' },
              { id: 'e3_p25', texto: 'Incluyen una forma de evaluación por tema' },
            ],
          },
          {
            encabezado: 'Las fuentes de información documental o tomadas de la internet, del manual del participante:',
            preguntas: [
              { id: 'e3_p26', texto: 'Corresponden con los objetivos del curso' },
              { id: 'e3_p27', texto: 'Especifican el nombre del autor' },
              { id: 'e3_p28', texto: 'Señalan el año de publicación y/o la fecha de acceso al documento' },
              { id: 'e3_p29', texto: 'Indican el título de la obra' },
              { id: 'e3_p30', texto: 'Refieren la editorial y/o la URL' },
              { id: 'e3_p31', texto: 'Señalan el país de origen de la obra' },
            ],
          },
          {
            encabezado: 'El manual del instructor elaborado:',
            preguntas: [
              { id: 'e3_p32', texto: 'Incluye el nombre del curso' },
              { id: 'e3_p33', texto: 'Incluye el nombre de la persona que diseñó el curso' },
              { id: 'e3_p34', texto: 'Contiene el índice' },
              { id: 'e3_p35', texto: 'Cuenta con una introducción' },
              { id: 'e3_p36', texto: 'Incluye la carta descriptiva' },
              { id: 'e3_p37', texto: 'Describe los requerimientos del lugar de capacitación' },
              { id: 'e3_p38', texto: 'Contiene las sugerencias para desarrollar los temas' },
              { id: 'e3_p39', texto: 'Incluye los instrumentos de evaluación' },
              { id: 'e3_p40', texto: 'Incluye la clave de respuestas de los cuestionarios' },
              { id: 'e3_p41', texto: 'Señala las fuentes de información documental y/o tomadas de la internet' },
              { id: 'e3_p42', texto: 'Se presenta digitalizado y/o impreso' },
              { id: 'e3_p43', texto: 'Se presenta sin errores ortográficos' },
            ],
          },
          {
            encabezado: 'La introducción del manual del instructor elaborada:',
            preguntas: [
              { id: 'e3_p44', texto: 'Explica el propósito del manual' },
              { id: 'e3_p45', texto: 'Expone la estructura del curso' },
              { id: 'e3_p46', texto: 'Expone la modalidad del curso: Presencial, en línea, tutorado, autodidacta, mixto' },
            ],
          },
          {
            encabezado: 'Los requerimientos del lugar de capacitación elaborados:',
            preguntas: [
              { id: 'e3_p47', texto: 'Señalan las características del lugar de capacitación' },
              { id: 'e3_p48', texto: 'Mencionan el material de apoyo a utilizar' },
              { id: 'e3_p49', texto: 'Especifican el equipo necesario para desarrollar el curso' },
              { id: 'e3_p50', texto: 'Proporcionan las recomendaciones de uso del material de apoyo' },
            ],
          },
          {
            encabezado: 'Los temas del manual del instructor:',
            preguntas: [
              { id: 'e3_p51', texto: 'Corresponden con los mencionados en la carta descriptiva' },
              { id: 'e3_p52', texto: 'Ofrecen sugerencias de los apoyos necesarios para la explicación de cada tema' },
              { id: 'e3_p53', texto: 'Describen las técnicas, actividades y/o ejemplos para el desarrollo de cada tema' },
              { id: 'e3_p54', texto: 'Describen formas, criterios y tiempos de evaluación para cada tema' },
            ],
          },
          {
            encabezado: 'Las fuentes de información documental y/o de internet del manual del instructor integradas:',
            preguntas: [
              { id: 'e3_p55', texto: 'Corresponden con los objetivos del curso' },
              { id: 'e3_p56', texto: 'Especifican el nombre del autor' },
              { id: 'e3_p57', texto: 'Señalan el año de publicación y/o la fecha de acceso al documento' },
              { id: 'e3_p58', texto: 'Indican el título de la obra' },
              { id: 'e3_p59', texto: 'Refieren la editorial y/o la URL' },
              { id: 'e3_p60', texto: 'Señalan el país de origen de la obra' },
            ],
          },
        ],
      },
    ],
  },
];

export function getAllPreguntas() {
  const result = [];
  for (const elem of ELEMENTOS) {
    for (const seccion of elem.secciones) {
      for (const grupo of seccion.grupos) {
        for (const p of grupo.preguntas) {
          result.push({ ...p, elementoId: elem.id, tipo: seccion.tipo });
        }
      }
    }
  }
  return result;
}