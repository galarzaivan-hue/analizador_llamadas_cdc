import { SampleCase } from "../types";

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: "caso-01-falla-500kv",
    title: "Disparo de Línea L-5001 (500 kV) y Deslinde por Ambigüedad de Interruptor",
    category: "Gestión de Falla o Colapso",
    suggestedReport: "ANALISIS_FALLA_RESPONSABILIDAD",
    description: "Análisis pericial de llamada tras el disparo de la Línea de 500 kV Cotagaita-Aranjuez. Hubo falta de colación de la nomenclatura del interruptor 502-A.",
    transcriptText: `Despachador CNDC: "Centro Nacional de Despacho de Carga, habla el Ingeniero Mario Vargas. Buenas tardes."
Operador Subestación: "Buenas tardes Vargas, habla Juan Pérez, operador de la Subestación Cotagaita 500 kV."
Despachador CNDC: "Pérez, a las 14:15:22 T-0 detectamos disparo por protección de distancia de la línea 500 kV Cotagaita - Aranjuez. Requiero que confirme señalización en relés y proceda a abrir el interruptor cincuenta cero dos del paño A para aislar barra principal."
Operador Subestación: "Entendido Vargas. Procedo a verificar el paño. Abriré el interruptor de la línea."
Despachador CNDC: "Atención Pérez, debe abrir específicamente el 502-A y reportar tensión de barra."
Operador Subestación: "De acuerdo. Abro interruptor 502."
Despachador CNDC: "Mencione la hora de ejecución y repita el código exacto 502-A."
Operador Subestación: "Ejecutado a las 14:18 horas. Se abrió 502. Queda pendiente barra 2."`,
    presetResult: {
      metadatos_generales: {
        fecha_hora_estimada: "2026-07-24 14:15:22",
        tipo_evento_operativo: "Gestión de Falla o Colapso",
        duracion_audio_segundos: 68,
        calidad_audio: "Alta"
      },
      clasificacion_informe: {
        tipo_informe_sugerido: "ANALISIS_FALLA_RESPONSABILIDAD",
        justificacion_clasificacion: "Existió un disparo fortuito en sistema troncal de 500 kV con desalineación en la colación del código de equipo (mencionó '502' en lugar de '502-A'). Se requiere peritaje para deslinde de responsabilidad comunicacional ante la Autoridad de Fiscalización."
      },
      intervinientes: {
        emisor: {
          nombre_o_rol: "Ing. Mario Vargas - Despachador CNDC",
          entidad_empresa: "CNDC (Centro Nacional de Despacho de Carga)"
        },
        receptor: {
          nombre_o_rol: "Juan Pérez - Operador S/E Cotagaita 500 kV",
          entidad_empresa: "Empresa Transmisora de Potencia"
        }
      },
      transcripcion_literal: `Despachador CNDC: "Centro Nacional de Despacho de Carga, habla el Ingeniero Mario Vargas. Buenas tardes."
Operador Subestación: "Buenas tardes Vargas, habla Juan Pérez, operador de la Subestación Cotagaita 500 kV."
Despachador CNDC: "Pérez, a las 14:15:22 T-0 detectamos disparo por protección de distancia de la línea 500 kV Cotagaita - Aranjuez. Requiero que confirme señalización en relés y proceda a abrir el interruptor cincuenta cero dos del paño A para aislar barra principal."
Operador Subestación: "Entendido Vargas. Procedo a verificar el paño. Abriré el interruptor de la línea."
Despachador CNDC: "Atención Pérez, debe abrir específicamente el 502-A y reportar tensión de barra."
Operador Subestación: "De acuerdo. Abro interruptor 502."
Despachador CNDC: "Mencione la hora de ejecución y repita el código exacto 502-A."
Operador Subestación: "Ejecutado a las 14:18 horas. Se abrió 502. Queda pendiente barra 2."`,
      extraccion_utilizable: {
        subestacion_o_area: "Subestación Cotagaita 500 kV - Área Sur",
        equipo_componente: "Línea 500 kV Cotagaita - Aranjuez / Interruptor 502-A",
        accion_operativa: "Apertura de interruptor 502-A y aislamiento de Barra Principal 1",
        parametros_tecnicos: "Nivel de Tensión: 500 kV. Hora de evento disparo: 14:15:22 T-0",
        hora_instruccion_mencionada: "14:18:00 (mencionada de forma aproximada)",
        instruccion_emito_claramente: true,
        confirmacion_colacion_correcta: false,
        resumen_ejecutivo_operativo: "A las 14:15:22 se produjo el disparo de la L-500kV por protección de distancia. El CNDC instruyó la apertura explícita del interruptor 502-A. El operador de S/E colacionó omitiendo el sufijo 'A' ('abro interruptor 502'), generando riesgo de apertura en bahía adyacente."
      },
      evaluacion_protocolo: {
        cumplimiento_cordialidad: true,
        mensaje_directo_a_operacion: true,
        identificacion_emisor_receptor: true,
        instruccion_clara_y_sin_ambiguedad: false,
        colacion_confirmacion_completa: false,
        puntos_cumplidos: [
          "Identificación mutua de Emisor y Receptor al inicio de la llamada.",
          "Mención explícita del evento de disparo y tiempo T-0 de relés.",
          "CNDC reiteró la necesidad del código unívoco del componente."
        ],
        desviaciones_normativas: [
          "Colación incompleta por parte del Receptor: omitió la nomenclatura de fase/paño '502-A' repitiendo únicamente '502'.",
          "Falta de confirmación explícita de lectura de tensión en kV antes de autorizar el siguiente paso de maniobra."
        ]
      },
      analisis_pericial_responsabilidades: {
        evaluacion_causa_raiz_comunicacional: "La causa raíz comunicacional fue la falta de rigor en la colación del operador receptor, al no repetir la nomenclatura SCADA completa (502-A) requerida para interruptores de esquema interruptor y medio en 500 kV.",
        asignacion_responsabilidad_comunicacional: "Responsabilidad del RECEPTOR (Operador S/E Cotagaita) por colación deficiente. El Despachador CNDC actuó conforme a protocolo al corregir la omisión en el segundo turno de palabra.",
        relevancia_para_fiscalizacion_o_agentes: "Documento probatorio para la Autoridad de Fiscalización de Electricidad. Demuestra que el CNDC emitió la orden de forma correcta a las 14:15h y que la demora en la normalización de la línea se debió al ciclo de corrección de colación."
      },
      mejora_continua_y_feedback: {
        fortalezas_detectadas: [
          "Monitoreo proactivo y corrección inmediata del Despachador CNDC al detectar la colación incompleta.",
          "Registro preciso de la hora T-0 de actuación de protecciones."
        ],
        oportunidades_de_mejora: [
          "Exigir colación estricta de 3 vías con nomenclatura completa SCADA antes de iniciar la maniobra en física.",
          "Confirmación de parámetros eléctricos de retorno (kV en barra) en tiempo real."
        ],
        feedback_sugerido_al_operador: "Estimado operador: En subestaciones de 500 kV con configuración de interruptor y medio, omitir la letra del paño (ej. decir '502' en lugar de '502-A') puede derivar en la apertura de un equipo bajo carga incorrecto. Aplique colación textual idéntica a la recibida.",
        metricas_mejora_medible: {
          score_cumplimiento_protocolo: "72%",
          indice_claridad_tecnica: "80%",
          tiempo_estimado_perdido_por_ambiguedad_seg: 160,
          accion_correctiva_recomendada: "Capacitación intensiva en técnica de Colación Obligatoria de 3 Vías para personal de S/E Cotagaita."
        }
      }
    }
  },
  {
    id: "caso-02-maniobra-programada",
    title: "Maniobra Programada: Mantenimiento de Bahía L-204 en S/E Aranjuez 220 kV",
    category: "Maniobra Programada",
    suggestedReport: "PROTOCOLO_NORMATIVO",
    description: "Auditoría de protocolo de comunicación estandarizado para descargo de bahía L-204, apertura de seccionadores e instalación de tierras temporales.",
    transcriptText: `Despachador CNDC: "Centro Nacional de Despacho de Carga, comunica Despachador de Turno Ing. Carlos Mendoza. Hora 08:00:15."
Operador Subestación: "Subestación Aranjuez 220 kV, habla Operador de Guardia Lic. Roberto Soliz."
Despachador CNDC: "Ingeniero Soliz, autorizo inicio de la Solicitud de Maniobra Programada SMP-2026-089 para mantenimiento en Bahía L-204 de 220 kV. Paso 1: Verifique apertura de interruptor 204 y proceda a abrir seccionador de línea 204-1 a las 08:01."
Operador Subestación: "Confirmado Ing. Mendoza. Solicitud SMP-2026-089. Verifico interruptor 204 abierto en posición cero. Procedo a abrir seccionador de línea 204-1. Hora 08:01:10."
Despachador CNDC: "Correcta colación Soliz. Aguardo confirmación de posición física del seccionador 204-1."
Operador Subestación: "Ing. Mendoza, confirmado en campo seccionador 204-1 abierto en las tres fases a las 08:02:40. Tensión cero kV en línea L-204."
Despachador CNDC: "Recibido y registrado. Excelente trabajo. Puede continuar con el paso 2 de tierras temporales conforme al procedimiento."`,
    presetResult: {
      metadatos_generales: {
        fecha_hora_estimada: "2026-07-24 08:00:15",
        tipo_evento_operativo: "Maniobra Programada",
        duracion_audio_segundos: 52,
        calidad_audio: "Alta"
      },
      clasificacion_informe: {
        tipo_informe_sugerido: "PROTOCOLO_NORMATIVO",
        justificacion_clasificacion: "Cumplimiento normativo impecable de protocolo de comunicación de maniobras programadas en alta tensión (220 kV). Corresponde emisión de Certificado de Auditoría Normativa Estándar."
      },
      intervinientes: {
        emisor: {
          nombre_o_rol: "Ing. Carlos Mendoza - Despachador de Turno CNDC",
          entidad_empresa: "CNDC"
        },
        receptor: {
          nombre_o_rol: "Lic. Roberto Soliz - Operador de Guardia S/E Aranjuez",
          entidad_empresa: "Empresa de Transmisión Eléctrica"
        }
      },
      transcripcion_literal: `Despachador CNDC: "Centro Nacional de Despacho de Carga, comunica Despachador de Turno Ing. Carlos Mendoza. Hora 08:00:15."
Operador Subestación: "Subestación Aranjuez 220 kV, habla Operador de Guardia Lic. Roberto Soliz."
Despachador CNDC: "Ingeniero Soliz, autorizo inicio de la Solicitud de Maniobra Programada SMP-2026-089 para mantenimiento en Bahía L-204 de 220 kV. Paso 1: Verifique apertura de interruptor 204 y proceda a abrir seccionador de línea 204-1 a las 08:01."
Operador Subestación: "Confirmado Ing. Mendoza. Solicitud SMP-2026-089. Verifico interruptor 204 abierto en posición cero. Procedo a abrir seccionador de línea 204-1. Hora 08:01:10."
Despachador CNDC: "Correcta colación Soliz. Aguardo confirmación de posición física del seccionador 204-1."
Operador Subestación: "Ing. Mendoza, confirmado en campo seccionador 204-1 abierto en las tres fases a las 08:02:40. Tensión cero kV en línea L-204."
Despachador CNDC: "Recibido y registrado. Excelente trabajo. Puede continuar con el paso 2 de tierras temporales conforme al procedimiento."`,
      extraccion_utilizable: {
        subestacion_o_area: "Subestación Aranjuez 220 kV",
        equipo_componente: "Bahía L-204 / Seccionador de Línea 204-1 / Interruptor 204",
        accion_operativa: "Verificación de apertura de interruptor 204 y apertura de seccionador de línea 204-1",
        parametros_tecnicos: "Nivel de Tensión: 220 kV. Tensión en línea: 0 kV. Solicitud SMP-2026-089",
        hora_instruccion_mencionada: "08:00:15 / Exec: 08:01:10 / Conf: 08:02:40",
        instruccion_emito_claramente: true,
        confirmacion_colacion_correcta: true,
        resumen_ejecutivo_operativo: "Ejecución perfecta de la instrucción de descargo SMP-2026-089 en la bahía L-204 de 220 kV. Colación completa en tres vías, confirmando cero kV en la línea antes de autorizar puesta a tierra."
      },
      evaluacion_protocolo: {
        cumplimiento_cordialidad: true,
        mensaje_directo_a_operacion: true,
        identificacion_emisor_receptor: true,
        instruccion_clara_y_sin_ambiguedad: true,
        colacion_confirmacion_completa: true,
        puntos_cumplidos: [
          "Identificación mutua con nombres completos y roles operativos.",
          "Mención explícita del número de solicitud programada (SMP-2026-089).",
          "Colación exacta de la orden (colación de 3 vías completa).",
          "Mención de horas precisas de autorización y ejecución.",
          "Verificación explícita de parámetro eléctrico de seguridad (0 kV en línea)."
        ],
        desviaciones_normativas: []
      },
      analisis_pericial_responsabilidades: {
        evaluacion_causa_raiz_comunicacional: "No se identifican fallas ni riesgos comunicacionales. La llamada sigue al 100% las recomendaciones internacionales de IEEE/IEC para operación de sistemas de potencia.",
        asignacion_responsabilidad_comunicacional: "Ninguna. Actuación ejemplar de ambas partes.",
        relevancia_para_fiscalizacion_o_agentes: "Registro idóneo para auditorías normativas de cumplimiento de Reglamento de Operación del Mercado."
      },
      mejora_continua_y_feedback: {
        fortalezas_detectadas: [
          "Uso impecable de la técnica de 3-way communication (instrucción - colación - confirmación).",
          "Precisión en la indicación de tiempos e identificación de equipos SCADA."
        ],
        oportunidades_de_mejora: [
          "Mantener este nivel de disciplina operativa en situaciones de alta presión o fallas intempestivas."
        ],
        feedback_sugerido_al_operador: "Felicitaciones a ambos operadores. La colación exacta del código SMP y la verificación explícita de tensión nula reflejan el más alto estándar de seguridad operativa en SEP.",
        metricas_mejora_medible: {
          score_cumplimiento_protocolo: "100%",
          indice_claridad_tecnica: "100%",
          tiempo_estimado_perdido_por_ambiguedad_seg: 0,
          accion_correctiva_recomendada: "Difundir este audio como patrón modelo de capacitación en el Centro de Control de Operaciones."
        }
      }
    }
  },
  {
    id: "caso-03-despacho-economico",
    title: "Despacho Económico: Incremento de Potencia +40 MW en Planta Corani por Rampas de Demanda",
    category: "Despacho Económico",
    suggestedReport: "PROTOCOLO_NORMATIVO",
    description: "Instrucción de despacho en tiempo real para incremento de generación hidráulica para soporte de frecuencia del sistema en hora de punta.",
    transcriptText: `Despachador CNDC: "Centro de Despacho CNDC, Ing. Ramos en turno. Hora 18:45:00."
Operador Planta: "Central Hidroeléctrica Corani, habla operador Técnico Luis Agramont."
Despachador CNDC: "Ing. Agramont, debido a incremento de demanda en el Sistema Interconectado, solicito aumentar la generación activa de Planta Corani de 60 MW a 100 MW con rampa de 5 MW por minuto. Frecuencia actual 49.88 Hz."
Operador Planta: "CNDC, recibido. Incrementaremos generación de 60 a 100 megavatios, subiendo 40 megavatios en total a rampa de 5 MW/min. ¿Confirmado?"
Despachador CNDC: "Afirmativo Agramont. Inicie rampa a partir de las 18:46:00 y notifique al alcanzar los 100 MW."
Operador Planta: "Entendido CNDC. Iniciamos rampa a las 18:46:00. Reportaremos a los 100 MW."`,
    presetResult: {
      metadatos_generales: {
        fecha_hora_estimada: "2026-07-24 18:45:00",
        tipo_evento_operativo: "Despacho Económico",
        duracion_audio_segundos: 45,
        calidad_audio: "Alta"
      },
      clasificacion_informe: {
        tipo_informe_sugerido: "PROTOCOLO_NORMATIVO",
        justificacion_clasificacion: "Operación de Despacho Económico y Regulación Secundaria de Frecuencia (AGC/Manual). Cumple parámetros normativos de instrucción de despacho."
      },
      intervinientes: {
        emisor: {
          nombre_o_rol: "Ing. Ramos - Despachador CNDC",
          entidad_empresa: "CNDC"
        },
        receptor: {
          nombre_o_rol: "Téc. Luis Agramont - Operador de Central",
          entidad_empresa: "Empresa Generadora Corani S.A."
        }
      },
      transcripcion_literal: `Despachador CNDC: "Centro de Despacho CNDC, Ing. Ramos en turno. Hora 18:45:00."
Operador Planta: "Central Hidroeléctrica Corani, habla operador Técnico Luis Agramont."
Despachador CNDC: "Ing. Agramont, debido a incremento de demanda en el Sistema Interconectado, solicito aumentar la generación activa de Planta Corani de 60 MW a 100 MW con rampa de 5 MW por minuto. Frecuencia actual 49.88 Hz."
Operador Planta: "CNDC, recibido. Incrementaremos generación de 60 a 100 megavatios, subiendo 40 megavatios en total a rampa de 5 MW/min. ¿Confirmado?"
Despachador CNDC: "Afirmativo Agramont. Inicie rampa a partir de las 18:46:00 y notifique al alcanzar los 100 MW."
Operador Planta: "Entendido CNDC. Iniciamos rampa a las 18:46:00. Reportaremos a los 100 MW."`,
      extraccion_utilizable: {
        subestacion_o_area: "Central Hidroeléctrica Corani",
        equipo_componente: "Unidades Generadoras G1 y G2 Planta Corani",
        accion_operativa: "Incremento de generación activa (MW) por rampa",
        parametros_tecnicos: "Potencia Inicial: 60 MW, Potencia Final: 100 MW (+40 MW). Rampa: 5 MW/min. Frecuencia SEP: 49.88 Hz",
        hora_instruccion_mencionada: "18:45:00 (Inicio Rampa: 18:46:00)",
        instruccion_emito_claramente: true,
        confirmacion_colacion_correcta: true,
        resumen_ejecutivo_operativo: "Instrucción de despacho económico para restaurar la frecuencia de 49.88 Hz a 50.00 Hz. Se incrementa la generación de Corani en 40 MW a rampa de 5 MW/min. Comunicación fluida y precisa."
      },
      evaluacion_protocolo: {
        cumplimiento_cordialidad: true,
        mensaje_directo_a_operacion: true,
        identificacion_emisor_receptor: true,
        instruccion_clara_y_sin_ambiguedad: true,
        colacion_confirmacion_completa: true,
        puntos_cumplidos: [
          "Identificación de actores y unidades operativas.",
          "Cuantificación exacta de deltas de potencia (MW) y gradientes de rampa (MW/min).",
          "Diagnóstico de causa raíz del sistema (frecuencia en 49.88 Hz)."
        ],
        desviaciones_normativas: []
      },
      analisis_pericial_responsabilidades: {
        evaluacion_causa_raiz_comunicacional: "Llamada sin desviaciones. Adecuada coordinación de despacho económico.",
        asignacion_responsabilidad_comunicacional: "Ninguna. Despacho transparente.",
        relevancia_para_fiscalizacion_o_agentes: "Soporte probatorio del cumplimiento de ofertas de rampa de generación presentadas al Mercado Eléctrico."
      },
      mejora_continua_y_feedback: {
        fortalezas_detectadas: [
          "Inclusión del valor de frecuencia del sistema (49.88 Hz) para contextualizar la urgencia operativa al generador."
        ],
        oportunidades_de_mejora: [
          "Estar atentos al monitoreo de aportes reactivos (MVAr) si la tensión de barra varía por el incremento de flujo activo."
        ],
        feedback_sugerido_al_operador: "Muy buen manejo. Comunicar el estado de frecuencia ayuda a que el operador de planta entienda la prioridad técnica.",
        metricas_mejora_medible: {
          score_cumplimiento_protocolo: "96%",
          indice_claridad_tecnica: "98%",
          tiempo_estimado_perdido_por_ambiguedad_seg: 0,
          accion_correctiva_recomendada: "Continuar monitoreo automático vía SCADA."
        }
      }
    }
  },
  {
    id: "caso-04-emergencia-reactor",
    title: "Emergencia por Sobrevoltaje: Conexión intempestiva de Reactor R-115 kV y Error de Nomenclatura",
    category: "Control Tensión",
    suggestedReport: "ANALISIS_FALLA_RESPONSABILIDAD",
    description: "Peritaje de llamada de emergencia por sobretensión en Subestación Cotagaita (242 kV / 121 kV) con ambigüedad en la confirmación del reactor.",
    transcriptText: `Despachador CNDC: "Urgente, Despacho CNDC. Operador Cotagaita conteste!"
Operador Subestación: "Aquí Cotagaita, habla operador de turno."
Despachador CNDC: "Tenemos sobretensión crítica de 242 kV en barra de 220. Conecte de inmediato el Reactor R-101 en barra de 115 para drenar reactivos. Conecte ahora mismo!"
Operador Subestación: "Recibido. Conecto reactor de la barra."
Despachador CNDC: "Un momento! Menciones su nombre, confirme si es el R-101 o el R-102 y dé la hora exacta de la maniobra!"
Operador Subestación: "Habla Pedro Gutierrez. Conecté el reactor R-102 a las 19:12."
Despachador CNDC: "Gutiérrez, cometió un grave error! Le instruí R-101 en 115kV, no R-102! Desconecte R-102 de inmediato para evitar sobrecarga del transformador!"`,
    presetResult: {
      metadatos_generales: {
        fecha_hora_estimada: "2026-07-24 19:11:45",
        tipo_evento_operativo: "Control Tensión",
        duracion_audio_segundos: 58,
        calidad_audio: "Media"
      },
      clasificacion_informe: {
        tipo_informe_sugerido: "ANALISIS_FALLA_RESPONSABILIDAD",
        justificacion_clasificacion: "Maniobra incorrecta por error de colación e inobservancia del protocolo de identificación en emergencia por sobretensión. Se requiere Informe Pericial de Asignación de Responsabilidades."
      },
      intervinientes: {
        emisor: {
          nombre_o_rol: "Despachador CNDC",
          entidad_empresa: "CNDC"
        },
        receptor: {
          nombre_o_rol: "Pedro Gutiérrez - Operador de Turno",
          entidad_empresa: "Empresa Transmisora"
        }
      },
      transcripcion_literal: `Despachador CNDC: "Urgente, Despacho CNDC. Operador Cotagaita conteste!"
Operador Subestación: "Aquí Cotagaita, habla operador de turno."
Despachador CNDC: "Tenemos sobretensión crítica de 242 kV en barra de 220. Conecte de inmediato el Reactor R-101 en barra de 115 para drenar reactivos. Conecte ahora mismo!"
Operador Subestación: "Recibido. Conecto reactor de la barra."
Despachador CNDC: "Un momento! Menciones su nombre, confirme si es el R-101 o el R-102 y dé la hora exacta de la maniobra!"
Operador Subestación: "Habla Pedro Gutierrez. Conecté el reactor R-102 a las 19:12."
Despachador CNDC: "Gutiérrez, cometió un grave error! Le instruí R-101 en 115kV, no R-102! Desconecte R-102 de inmediato para evitar sobrecarga del transformador!"`,
      extraccion_utilizable: {
        subestacion_o_area: "Subestación Cotagaita 220/115 kV",
        equipo_componente: "Reactor R-101 (Instruido) / Reactor R-102 (Conectado por error)",
        accion_operativa: "Conexión de reactor por sobretensión de 242 kV",
        parametros_tecnicos: "Tensión de barra: 242 kV (Sobretensión > 1.1 p.u.). Horas: 19:12",
        hora_instruccion_mencionada: "19:12 (mencionada con posterioridad a la maniobra)",
        instruccion_emito_claramente: false,
        confirmacion_colacion_correcta: false,
        resumen_ejecutivo_operativo: "Ante una sobretensión de 242 kV, el CNDC dio orden precipitada omitiendo saludo/identificación inicial. El operador ejecutó la maniobra sin colacionar el código del reactor, conectando por error el R-102 en lugar del R-101 instruido."
      },
      evaluacion_protocolo: {
        cumplimiento_cordialidad: false,
        mensaje_directo_a_operacion: true,
        identificacion_emisor_receptor: false,
        instruccion_clara_y_sin_ambiguedad: false,
        colacion_confirmacion_completa: false,
        puntos_cumplidos: [
          "Identificación del problema técnico (sobretensión de 242 kV)."
        ],
        desviaciones_normativas: [
          "El emisor no realizó presentación formal ni verificación de identidad del interlocutor al iniciar la llamada.",
          "El emisor emitió la orden con tono de apremio que indujo la ejecución precipitada sin previa colación.",
          "El receptor ejecutó la maniobra antes de colacionar y confirmar el código unívoco del equipo.",
          "El receptor conectó un equipo distinto al solicitado (R-102 en lugar de R-101)."
        ]
      },
      analisis_pericial_responsabilidades: {
        evaluacion_causa_raiz_comunicacional: "Falla comunicacional compartida en situación de stress/emergencia. El emisor rompió el protocolo de seguridad ordenando 'conecte ahora mismo' sin exigir colación previa. El receptor actuó a ciegas conectando el equipo equivocado.",
        asignacion_responsabilidad_comunicacional: "RESPONSABILIDAD COMPARTIDA: 60% Receptor (por maniobrar sin colación previa y conectar equipo erróneo) y 40% Emisor (por romper la cadena de mando, no exigir colación previa a la ejecución y transmitir zozobra).",
        relevancia_para_fiscalizacion_o_agentes: "Informe de alta relevancia para el Comité de Análisis de Fallas. Expone la necesidad de blindar el protocolo de 3 vías incluso durante emergencias críticas de voltaje."
      },
      mejora_continua_y_feedback: {
        fortalezas_detectadas: [
          "Detección rápida de la inconsistencia por parte del CNDC antes de producir un daño permanente en el transformador."
        ],
        oportunidades_de_mejora: [
          "Prohibir tajantemente la ejecución de maniobras antes de recibir la confirmación de colación del CNDC, sin importar la gravedad aparente del evento.",
          "Capacitación en control del stress operativo durante emergencias en tiempo real."
        ],
        feedback_sugerido_al_operador: "En situaciones de tensión o sobrevoltaje extremo, la prisa es el enemigo #1 de la seguridad de la vida humana y de los activos. NUNCA cierre un interruptor o seccionador sin haber escuchado la confirmación de su colación por parte del Despachador.",
        metricas_mejora_medible: {
          score_cumplimiento_protocolo: "35%",
          indice_claridad_tecnica: "50%",
          tiempo_estimado_perdido_por_ambiguedad_seg: 320,
          accion_correctiva_recomendada: "Sanción pedagógica y re-certificación obligatoria en Protocolos de Operación en Emergencias para el turno de S/E Cotagaita."
        }
      }
    }
  }
];
