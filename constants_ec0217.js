// ============================================================
// constants_ec0217.js
// Todas las preguntas del diagnóstico EC0217.01
// 186 reactivos divididos en 3 elementos
// Respuestas: true (SÍ) / false (NO)
// ============================================================

export const DIAGNOSTICO_INFO = {
  codigo:    'EC0217.01',
  titulo:    'Impartición de cursos de formación del capital humano',
  subtitulo: 'de manera presencial grupal',
  total:     185,
  tiempo:    '30 minutos aprox.',
};

export const ELEMENTOS = [
  {
    id: 1,
    titulo: 'Elemento 1 de 3',
    descripcion: 'Preparar la sesión / curso de capacitación / formación',
    total: 67,
    secciones: [
      {
        id: 'e1_desemp',
        tipo: 'DESEMPEÑOS',
        preguntaBase: '¿Realiza usted los siguientes DESEMPEÑOS?',
        grupos: [
          {
            encabezado: 'Comprueba la existencia y el funcionamiento de los recursos requeridos para la sesión:',
            preguntas: [
              { id: 'e1_d1', texto: 'Previo a su inicio' },
              { id: 'e1_d2', texto: 'De acuerdo con lo especificado en la lista de verificación de requerimientos del curso' },
              { id: 'e1_d3', texto: 'Realizando pruebas de funcionamiento del equipo' },
              { id: 'e1_d4', texto: 'Corroborando la suficiencia y disposición de: mobiliario, equipo, instalaciones, materiales y servicios necesarios conforme a la lista de verificación' },
              { id: 'e1_d5', texto: 'Verificando la disponibilidad de los recursos/materiales didácticos de acuerdo con el número de participantes/capacitandos y condiciones de interacción' },
            ],
          },
        ],
      },
      {
        id: 'e1_prod',
        tipo: 'PRODUCTOS',
        preguntaBase: '¿Usted obtiene los siguientes PRODUCTOS?',
        grupos: [
          {
            encabezado: 'La lista de verificación de los requerimientos de la sesión/curso elaborada:',
            preguntas: [
              { id: 'e1_p1',  texto: 'Contiene nombre del curso y del facilitador / instructor / capacitador / formador' },
              { id: 'e1_p2',  texto: 'Enuncia fecha / período y lugar(es) en que se lleva a cabo' },
              { id: 'e1_p3',  texto: 'Indica la existencia de: mobiliario, equipo, instalaciones, materiales y servicios, en congruencia con el número de participantes/capacitandos y a sus condiciones de interacción' },
              { id: 'e1_p4',  texto: 'Corresponde con las actividades descritas en el documento de planeación del curso' },
              { id: 'e1_p5',  texto: 'Corresponde con el número de participantes / capacitandos' },
              { id: 'e1_p6',  texto: 'Corresponde con los recursos/materiales didácticos mencionados en el documento de planeación del curso' },
              { id: 'e1_p7',  texto: 'Incluye el apartado de comprobación de medidas de salud / seguridad / higiene / protección civil vigentes aplicables al espacio en donde se realiza el curso' },
            ],
          },
          {
            encabezado: 'El documento de planeación del curso elaborado:',
            preguntas: [
              { id: 'e1_p8',  texto: 'Describe el propósito / beneficio del curso / sesión' },
              { id: 'e1_p9',  texto: 'Describe el perfil de los participantes / capacitandos' },
              { id: 'e1_p10', texto: 'Indica los conocimientos y habilidades que requiere el participante/capacitando para ingresar al curso' },
              { id: 'e1_p11', texto: 'Contiene el objetivo general / resultado de aprendizaje esperado' },
              { id: 'e1_p12', texto: 'Incluye los objetivos particulares/resultados parciales de aprendizaje esperados' },
              { id: 'e1_p13', texto: 'Incluye el nombre del curso' },
              { id: 'e1_p14', texto: 'Incluye el contenido temático' },
              { id: 'e1_p15', texto: 'Considera los momentos de la capacitación / formación: inicio / encuadre / apertura, desarrollo y cierre / clausura' },
              { id: 'e1_p16', texto: 'Indica la duración parcial por módulos / temas / apartados / unidades / etapas y la duración total del curso / sesión' },
              { id: 'e1_p17', texto: 'Indica la duración de cada una de las actividades de enseñanza y de aprendizaje' },
              { id: 'e1_p18', texto: 'Indica las técnicas instruccionales' },
              { id: 'e1_p19', texto: 'Describe las técnicas grupales' },
              { id: 'e1_p20', texto: 'Especifica los recursos / materiales didácticos y equipo de apoyo a utilizar, en congruencia con las condiciones de interacción establecidas' },
              { id: 'e1_p21', texto: 'Describe las actividades a desarrollar por el facilitador / instructor / capacitador / formador y participantes / capacitandos' },
              { id: 'e1_p22', texto: 'Indica la forma de evaluar / verificar el aprendizaje' },
              { id: 'e1_p23', texto: 'Incluye la(s) referencia(s) bibliográfica(s) / fuente(s) de información en la que se sustenta el curso' },
              { id: 'e1_p24', texto: 'Se presenta sin errores ortográficos' },
            ],
          },
          {
            encabezado: 'El objetivo / resultado general de aprendizaje en el documento de planeación del curso redactado:',
            preguntas: [
              { id: 'e1_p25', texto: 'Hace mención del sujeto del aprendizaje: a quién' },
              { id: 'e1_p26', texto: 'Contiene un verbo que hace referencia a la acción que se espera alcanzar como resultado del dominio de aprendizaje cognitivo / psicomotriz / afectivo / relacional-social del curso: qué' },
              { id: 'e1_p27', texto: 'Contiene el objeto sobre el que recae la acción que se espera alcanzar como resultado del aprendizaje en términos de conocimiento / desempeño / producto / actitud-hábito-valor' },
              { id: 'e1_p28', texto: 'Expresa la condición bajo la cual debe darse la acción que se espera alcanzar como resultado del aprendizaje del curso: cómo' },
              { id: 'e1_p29', texto: 'Describe la finalidad / utilidad / beneficio que tiene el aprendizaje esperado (para qué)' },
            ],
          },
          {
            encabezado: 'Los objetivos/resultados particulares de aprendizaje en el documento de planeación del curso redactados:',
            preguntas: [
              { id: 'e1_p30', texto: 'Hace mención del sujeto del aprendizaje: quién' },
              { id: 'e1_p31', texto: 'Contiene un verbo que hace referencia a la acción que se espera alcanzar como resultado del dominio de aprendizaje cognitivo / psicomotriz / afectivo / relacional-social del módulo / tema / apartado / unidad / etapa (qué)' },
              { id: 'e1_p32', texto: 'Contiene el objeto sobre el que recae la acción que se espera alcanzar como resultado del aprendizaje del módulo / tema / apartado / unidad / etapa en términos de conocimiento / desempeño / producto / actitud-hábito-valor' },
              { id: 'e1_p33', texto: 'Expresa la condición bajo la cual debe darse la acción que se espera alcanzar como resultado del aprendizaje del módulo / tema / apartado / unidad / etapa (cómo)' },
              { id: 'e1_p34', texto: 'Son congruentes con el objetivo / resultado general de aprendizaje' },
            ],
          },
          {
            encabezado: 'El contenido temático en el documento de planeación del curso incluido:',
            preguntas: [
              { id: 'e1_p35', texto: 'Corresponde con los objetivos / resultados de aprendizaje del curso' },
              { id: 'e1_p36', texto: 'Presenta una secuencia de lo simple a lo complejo' },
              { id: 'e1_p37', texto: 'Está organizado en formato de tablas' },
            ],
          },
          {
            encabezado: 'Las técnicas de instrucción en el documento de planeación del curso descritas:',
            preguntas: [
              { id: 'e1_p38', texto: 'Corresponden con los objetivos / resultados de aprendizaje' },
              { id: 'e1_p39', texto: 'Corresponden con el contenido temático' },
              { id: 'e1_p40', texto: 'Contienen al menos tres técnicas distintas' },
            ],
          },
          {
            encabezado: 'Las técnicas grupales en el documento de planeación del curso descritas:',
            preguntas: [
              { id: 'e1_p41', texto: 'Corresponden con los objetivos / resultados de aprendizaje' },
              { id: 'e1_p42', texto: 'Corresponden con el contenido temático' },
              { id: 'e1_p43', texto: 'Contienen al menos tres técnicas distintas que promuevan el aprendizaje social / colaborativo' },
            ],
          },
          {
            encabezado: 'Las actividades a desarrollar por el facilitador / instructor / capacitador / formador contenidas en el documento de planeación del curso especificadas:',
            preguntas: [
              { id: 'e1_p44', texto: 'Corresponden con los objetivos/resultados de aprendizaje' },
              { id: 'e1_p45', texto: 'Corresponden con las técnicas instruccionales y grupales establecidas' },
              { id: 'e1_p46', texto: 'Describen lo que debe hacer el participante / capacitando' },
              { id: 'e1_p47', texto: 'Describen la manera de organizar al grupo y su forma de interacción' },
            ],
          },
          {
            encabezado: 'La forma de medir el aprendizaje en el documento de planeación del curso descrita:',
            preguntas: [
              { id: 'e1_p48', texto: 'Corresponden con los objetivos/resultados de aprendizaje' },
              { id: 'e1_p49', texto: 'Corresponden con los contenidos' },
              { id: 'e1_p50', texto: 'Indica el momento de la aplicación' },
              { id: 'e1_p51', texto: 'Indica la técnica e instrumento a emplear' },
            ],
          },
          {
            encabezado: 'La duración en el documento de planeación del curso especificada:',
            preguntas: [
              { id: 'e1_p52', texto: 'Está distribuida acorde con los requerimientos de aprendizaje planteados en el curso en las etapas de inicio, desarrollo y cierre' },
              { id: 'e1_p53', texto: 'Considera el tiempo parcial a emplear en cada actividad descrita en el documento de planeación del curso' },
              { id: 'e1_p54', texto: 'Incluye la sumatoria de los tiempos parciales de acuerdo con el total de horas establecidas en el curso / sesión' },
              { id: 'e1_p55', texto: 'Considera el número total de horas para impartir el curso / sesión' },
            ],
          },
          {
            encabezado: 'Los recursos / materiales didácticos especificados:',
            preguntas: [
              { id: 'e1_p56', texto: 'Corresponden con lo estipulado en el documento de planeación del curso y el contenido temático del curso' },
              { id: 'e1_p57', texto: 'Están diseñados tomando en cuenta el perfil de los participantes / capacitandos' },
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
              { id: 'e1_c1', texto: 'Dominios de aprendizaje: Conductas y acciones de los tipos de dominios de aprendizaje de acuerdo con Benjamín Bloom y la UNESCO (cognitivo/cognoscitivo, psicomotriz, afectivo y relacional-social)' },
              { id: 'e1_c2', texto: 'Elementos básicos de los enfoques de las Teorías del Aprendizaje en la planeación didáctica: Casos de aplicación de los enfoques de las teorías: constructivista, conductista, cognitivista y humanista' },
              { id: 'e1_c3', texto: 'Estilos de aprendizaje en la planeación didáctica de acuerdo con Ned Herrmann, David Kolb, Paul MacLean, Roger Sperry, Howard Gardner y VAK de Richard Bandler y John Grinder' },
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
              { id: 'e1_a1', texto: 'Responsabilidad: Revisa la suficiencia y disposición de los materiales y equipo de acuerdo al espacio y número de participantes/capacitandos y condiciones de interacción establecidas' },
              { id: 'e1_a2', texto: 'Orden: La manera en que integra la información contenida en el documento de planeación del curso de acuerdo a una secuencia de lo general a lo particular' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 2,
    titulo: 'Elemento 2 de 3',
    descripcion: 'Conducir la sesión / curso de capacitación / formación',
    total: 82,
    secciones: [
      {
        id: 'e2_desemp',
        tipo: 'DESEMPEÑOS',
        preguntaBase: '¿Realiza usted los siguientes DESEMPEÑOS?',
        grupos: [
          {
            encabezado: 'Realiza el inicio / encuadre / apertura del curso:',
            preguntas: [
              { id: 'e2_d1',  texto: 'De acuerdo con lo establecido en el documento de planeación del curso' },
              { id: 'e2_d2',  texto: 'Presentándose ante el grupo' },
              { id: 'e2_d3',  texto: 'Presentando los objetivos a los participantes / capacitandos' },
              { id: 'e2_d4',  texto: 'Mencionando la descripción general del desarrollo del curso' },
              { id: 'e2_d5',  texto: 'Mencionando el temario del curso' },
              { id: 'e2_d6',  texto: 'Creando un ambiente participativo a través de preguntas al grupo' },
              { id: 'e2_d7',  texto: 'Haciendo preguntas relacionadas con el contexto / experiencia laboral / personal de los participantes/capacitandos' },
              { id: 'e2_d8',  texto: 'Clarificando el alcance del curso de acuerdo con las expectativas planteadas por los participantes/capacitandos' },
              { id: 'e2_d9',  texto: 'Comentando los beneficios del curso y su relación con la experiencia personal / laboral' },
              { id: 'e2_d10', texto: 'Acordando las reglas de operación, participación y convivencia del curso, acordes a las condiciones de interacción' },
              { id: 'e2_d11', texto: 'Realizando el contrato de aprendizaje de acuerdo con los objetivos / resultados de aprendizaje' },
            ],
          },
          {
            encabezado: 'Emplea la técnica grupal de integración:',
            preguntas: [
              { id: 'e2_d12', texto: 'En el momento definido en el documento de planeación del curso' },
              { id: 'e2_d13', texto: 'Explicando el objetivo de la técnica' },
              { id: 'e2_d14', texto: 'Mencionando el tiempo para realizar la técnica' },
              { id: 'e2_d15', texto: 'Explicando las instrucciones de la técnica' },
              { id: 'e2_d16', texto: 'Incluyendo la actividad de integración con la presentación de los participantes / capacitandos' },
              { id: 'e2_d17', texto: 'Promoviendo la integración de todos los participantes/capacitandos de acuerdo con las condiciones de interacción' },
              { id: 'e2_d18', texto: 'Participando junto con el grupo de acuerdo con las condiciones de interacción' },
              { id: 'e2_d19', texto: 'Controlando el tiempo para realizar la técnica' },
            ],
          },
          {
            encabezado: 'Emplea la técnica instruccional expositiva:',
            preguntas: [
              { id: 'e2_d20', texto: 'Presentando el objetivo / resultados de aprendizaje del contenido temático a exponer' },
              { id: 'e2_d21', texto: 'Realizando una introducción general del contenido temático que promueva el interés de los participantes/capacitandos' },
              { id: 'e2_d22', texto: 'Preguntando a los participantes/capacitandos sobre sus conocimientos previos del contenido temático por abordar' },
              { id: 'e2_d23', texto: 'Desarrollando el contenido de acuerdo con el documento de planeación del curso' },
              { id: 'e2_d24', texto: 'Mencionando las citas / referencias de contenido que provenga de otros autores' },
              { id: 'e2_d25', texto: 'Planteando preguntas dirigidas que verifiquen la comprensión del tema' },
              { id: 'e2_d26', texto: 'Resolviendo dudas de los participantes/capacitandos acerca de los temas expuestos' },
              { id: 'e2_d27', texto: 'Promoviendo que los participantes/capacitandos realicen la síntesis de la exposición, haciendo énfasis en los aspectos sobresalientes del mensaje' },
              { id: 'e2_d28', texto: 'Invitando a los participantes/capacitandos a expresar la utilidad de lo aprendido durante la exposición' },
            ],
          },
          {
            encabezado: 'Emplea la técnica instruccional demostrativa:',
            preguntas: [
              { id: 'e2_d29', texto: 'Presentando la actividad a desarrollar / propósito / beneficios para despertar el interés en los participantes/capacitandos' },
              { id: 'e2_d30', texto: 'Explicando el grado de dominio de lo que se desea lograr al terminar la actividad en términos de procedimiento / desempeño / producto' },
              { id: 'e2_d31', texto: 'Invitando a la participación de todos los miembros del grupo, acorde a las condiciones de interacción' },
              { id: 'e2_d32', texto: 'Ejemplificando la actividad a desarrollar' },
              { id: 'e2_d33', texto: 'Resolviendo dudas sobre la demostración realizada' },
              { id: 'e2_d34', texto: 'Permitiendo que los participantes/capacitandos realicen la práctica' },
              { id: 'e2_d35', texto: 'Supervisando la realización de la actividad' },
              { id: 'e2_d36', texto: 'Atendiendo las dudas que se presentan durante su práctica' },
              { id: 'e2_d37', texto: 'Retroalimentando sobre la práctica' },
              { id: 'e2_d38', texto: 'Recuperando / Preguntando a los participantes/capacitandos acerca de la utilidad de lo aprendido durante la actividad' },
            ],
          },
          {
            encabezado: 'Emplea la técnica diálogo-discusión / debate:',
            preguntas: [
              { id: 'e2_d39', texto: 'Presentando la actividad a desarrollar, el propósito / beneficios para despertar el interés en los participantes/capacitandos' },
              { id: 'e2_d40', texto: 'Mencionando el tema / planteamiento/reto a dialogar / discutir / debatir' },
              { id: 'e2_d41', texto: 'Indicando las instrucciones y tiempos de la actividad, así como las reglas de participación' },
              { id: 'e2_d42', texto: 'Invitando a la participación de todos los miembros del grupo, acorde a las condiciones de interacción' },
              { id: 'e2_d43', texto: 'Resolviendo dudas acerca de la actividad a realizar' },
              { id: 'e2_d44', texto: 'Organizando al grupo en subgrupos' },
              { id: 'e2_d45', texto: 'Abriendo la discusión recordando el tema/planteamiento a dialogar / discutir / debatir' },
              { id: 'e2_d46', texto: 'Propiciando la participación de los equipos' },
              { id: 'e2_d47', texto: 'Moderando la discusión' },
              { id: 'e2_d48', texto: 'Vigilando el cumplimiento de las reglas y tiempos y participación de los miembros del grupo' },
              { id: 'e2_d49', texto: 'Recuperando / Preguntando a los participantes/capacitandos acerca de las conclusiones del diálogo-discusión / debate y utilidad de la actividad' },
            ],
          },
          {
            encabezado: 'Facilita el proceso de aprendizaje del grupo:',
            preguntas: [
              { id: 'e2_d50', texto: 'Recuperando la experiencia previa de los participantes/capacitandos sobre el tema' },
              { id: 'e2_d51', texto: 'Utilizando ejemplos relacionados con los temas tratados' },
              { id: 'e2_d52', texto: 'Utilizando ejemplos relacionados con el contexto de los participantes/capacitandos' },
              { id: 'e2_d53', texto: 'Aclarando los tecnicismos utilizados' },
              { id: 'e2_d54', texto: 'Realizando en conjunto con el grupo al menos una actividad que fomente el aprendizaje a través de la investigación / solución de problemas / descubrimiento / logros / casos' },
              { id: 'e2_d55', texto: 'Dirigiendo la mirada a todos los participantes/capacitandos durante el desarrollo de la sesión / curso, acorde a las condiciones de interacción' },
              { id: 'e2_d56', texto: 'Empleando expresiones faciales/gestos, ademanes, posturas, congruentes con el contenido que se está transmitiendo' },
              { id: 'e2_d57', texto: 'Manteniendo una postura dinámica dentro del espacio de capacitación' },
              { id: 'e2_d58', texto: 'Realizando cambios en el volumen y entonación durante la interacción con el grupo' },
              { id: 'e2_d59', texto: 'Utilizando variantes de tono / modulación lingüística en la comunicación que facilite la comprensión del / de los mensaje(s) a todos los participantes/capacitandos' },
              { id: 'e2_d60', texto: 'Empleando alguna técnica grupal energizante' },
              { id: 'e2_d61', texto: 'Empleando alguna técnica/estrategia para promover emociones positivas vinculadas al aprendizaje' },
              { id: 'e2_d62', texto: 'Brindando retroalimentación positiva en respuesta a las intervenciones de los participantes/capacitandos' },
              { id: 'e2_d63', texto: 'Mencionando a los participantes/capacitandos que los errores / fallas / omisiones que se presentan durante el desarrollo del curso, son oportunidades para fortalecer el aprendizaje' },
              { id: 'e2_d64', texto: 'Recordando al grupo las reglas de operación, participación y convivencia acordadas' },
              { id: 'e2_d65', texto: 'Empleando técnicas para verificar la comprensión de los contenidos' },
              { id: 'e2_d66', texto: 'Preguntando acerca de los conocimientos adquiridos durante los temas tratados' },
              { id: 'e2_d67', texto: 'Promoviendo comentarios / participación acerca de la utilidad de los temas en su vida profesional/laboral y personal' },
              { id: 'e2_d68', texto: 'Preguntando sobre la aplicación de los temas expuestos al contexto de los participantes/capacitandos' },
              { id: 'e2_d69', texto: 'Mencionando los logros alcanzados y lo que falta por abordar' },
            ],
          },
          {
            encabezado: 'Maneja los equipos, recursos / materiales y apoyos didácticos:',
            preguntas: [
              { id: 'e2_d70', texto: 'De acuerdo con lo especificado en el documento de planeación del curso' },
              { id: 'e2_d71', texto: 'Conforme a lo indicado en los manuales / guías de usuario del proveedor / recomendaciones de uso del equipo' },
              { id: 'e2_d72', texto: 'Expresando al grupo que hagan el mejor aprovechamiento de los materiales en aras de promover su uso sustentable' },
              { id: 'e2_d73', texto: 'Permitiendo la visibilidad de los apoyos didácticos a todos los participantes/capacitandos de acuerdo con las características del aula/condiciones de interacción' },
            ],
          },
          {
            encabezado: 'Realiza el cierre del curso:',
            preguntas: [
              { id: 'e2_d74', texto: 'Invitando a los participantes/capacitandos a resumir los contenidos del curso' },
              { id: 'e2_d75', texto: 'Preguntando acerca del logro de las expectativas planteadas por los participantes/capacitandos al inicio del curso' },
              { id: 'e2_d76', texto: 'Preguntando a los participantes/capacitandos acerca de los objetivos/resultados de aprendizaje del curso alcanzados' },
              { id: 'e2_d77', texto: 'Sugiriendo acciones que promuevan la continuidad en el aprendizaje' },
              { id: 'e2_d78', texto: 'Invitando al grupo a formular compromisos de aplicación de lo aprendido' },
              { id: 'e2_d79', texto: 'Empleando alguna técnica grupal de cierre' },
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
              { id: 'e2_c1', texto: 'Dinámica de grupos: Principales características y comportamientos en la dinámica de grupos. Tipos de grupos (silencioso, participativo, indiferente, agresivo). Roles de los participantes/capacitandos (el contreras, el experto, el aliado, el novato)' },
            ],
          },
        ],
      },
      {
        id: 'e2_ahv',
        tipo: 'ACTITUDES / HÁBITOS / VALORES',
        preguntaBase: '¿Presenta las siguientes ACTITUDES / HÁBITOS / VALORES?',
        grupos: [
          {
            encabezado: 'Usted presenta:',
            preguntas: [
              { id: 'e2_a1', texto: 'Responsabilidad: La manera en que mantiene el interés y brinda apoyo a los participantes/capacitandos en el logro de los resultados de aprendizaje' },
              { id: 'e2_a2', texto: 'Tolerancia: La manera en que respeta el ritmo de aprendizaje de cada participante/capacitando y acepta los comentarios del grupo para la mejora continua del curso' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 3,
    titulo: 'Elemento 3 de 3',
    descripcion: 'Evaluar la sesión / curso de capacitación / formación',
    total: 36,
    secciones: [
      {
        id: 'e3_desemp',
        tipo: 'DESEMPEÑOS',
        preguntaBase: '¿Realiza usted los siguientes DESEMPEÑOS?',
        grupos: [
          {
            encabezado: 'Informa a los participantes/capacitandos acerca de la manera en que se evaluará su aprendizaje:',
            preguntas: [
              { id: 'e3_d1', texto: 'Durante el encuadre' },
              { id: 'e3_d2', texto: 'Especificando el momento de aplicación' },
              { id: 'e3_d3', texto: 'Indicando los criterios que se utilizarán' },
              { id: 'e3_d4', texto: 'Mencionando sus beneficios / finalidad / ventaja' },
              { id: 'e3_d5', texto: 'Indicando el tipo y forma de evaluación a realizar, así como el seguimiento en la aplicación de lo aprendido' },
              { id: 'e3_d6', texto: 'Indicando los instrumentos de evaluación a utilizar' },
            ],
          },
          {
            encabezado: 'Aplica la evaluación diagnóstica:',
            preguntas: [
              { id: 'e3_d7',  texto: 'Durante el encuadre' },
              { id: 'e3_d8',  texto: 'De acuerdo con lo establecido en el documento de planeación del curso' },
              { id: 'e3_d9',  texto: 'Mencionando los alcances/propósito/finalidad de la evaluación' },
              { id: 'e3_d10', texto: 'Indicando las instrucciones y el tiempo para realizarla' },
              { id: 'e3_d11', texto: 'Aclarando las dudas que se presentan' },
            ],
          },
          {
            encabezado: 'Aplica las evaluaciones del aprendizaje formativa/intermedia y Sumativa/final:',
            preguntas: [
              { id: 'e3_d12', texto: 'De acuerdo con lo establecido en el documento de planeación del curso' },
              { id: 'e3_d13', texto: 'Mencionando los alcances / propósito / finalidad de la evaluación' },
              { id: 'e3_d14', texto: 'Indicando las instrucciones y el tiempo para realizarla' },
              { id: 'e3_d15', texto: 'Aclarando las dudas que se presenten' },
            ],
          },
          {
            encabezado: 'Aplica el instrumento para evaluar la satisfacción sobre el curso:',
            preguntas: [
              { id: 'e3_d16', texto: 'Mencionando los alcances / propósito / finalidad de la evaluación' },
              { id: 'e3_d17', texto: 'Aclarando las dudas que se presenten' },
              { id: 'e3_d18', texto: 'Indicando las instrucciones de su aplicación' },
            ],
          },
        ],
      },
      {
        id: 'e3_prod',
        tipo: 'PRODUCTOS',
        preguntaBase: '¿Usted obtiene los siguientes PRODUCTOS?',
        grupos: [
          {
            encabezado: 'Los instrumentos de evaluación de aprendizaje aplicados:',
            preguntas: [
              { id: 'e3_p1', texto: 'Contienen el nombre del curso' },
              { id: 'e3_p2', texto: 'Contienen la fecha de aplicación' },
              { id: 'e3_p3', texto: 'Contienen el nombre del participante / capacitando' },
              { id: 'e3_p4', texto: 'Contienen las instrucciones para su resolución' },
              { id: 'e3_p5', texto: 'Presenta los reactivos de acuerdo con los objetivos / resultados de aprendizaje del curso' },
            ],
          },
          {
            encabezado: 'El informe final del curso elaborado:',
            preguntas: [
              { id: 'e3_p6',  texto: 'Incluye nombre del instructor y del curso' },
              { id: 'e3_p7',  texto: 'Incluye fecha de desarrollo del curso' },
              { id: 'e3_p8',  texto: 'Incluye los comentarios del instructor acerca del proceso de aprendizaje y del grupo' },
              { id: 'e3_p9',  texto: 'Especifica de manera descriptiva el nivel de cumplimiento de los objetivos / resultados de aprendizaje y de las expectativas del curso' },
              { id: 'e3_p10', texto: 'Incluye el apartado del plan de seguimiento a los participantes/capacitandos en la aplicación de lo aprendido' },
              { id: 'e3_p11', texto: 'Describe las contingencias / ajustes al plan de sesión que se presentaron y su resolución' },
              { id: 'e3_p12', texto: 'Contiene el resumen de las recomendaciones vertidas por los participantes/capacitandos en la encuesta de satisfacción para la mejora del curso' },
              { id: 'e3_p13', texto: 'Incluye el resultado de las evaluaciones de aprendizaje' },
              { id: 'e3_p14', texto: 'Contiene como anexo el registro de asistencia al curso' },
              { id: 'e3_p15', texto: 'Especifica los avances logrados con relación a los resultados de aprendizaje planeados' },
              { id: 'e3_p16', texto: 'Se presenta sin errores ortográficos' },
              { id: 'e3_p17', texto: 'Elaborado en formato impreso y/o digital, e incluye los gráficos de las evaluaciones de aprendizaje' },
            ],
          },
        ],
      },
      {
        id: 'e3_ahv',
        tipo: 'ACTITUDES / HÁBITOS / VALORES',
        preguntaBase: '¿Presenta las siguientes ACTITUDES / HÁBITOS / VALORES?',
        grupos: [
          {
            encabezado: 'Usted presenta:',
            preguntas: [
              { id: 'e3_a1', texto: 'Responsabilidad: Presenta el informe final del curso dentro del tiempo establecido en el plan de evaluación' },
            ],
          },
        ],
      },
    ],
  },
];

// Helper: obtener todas las preguntas planas con su elementoId
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