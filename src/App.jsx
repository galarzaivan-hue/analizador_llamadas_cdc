import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  FileText,
  AlertCircle,
  Activity,
  RotateCcw,
  Download,
  Mic,
  MicOff,
  Upload,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Key,
  Radio,
  HelpCircle,
  Award,
  Target,
  Trash2,
  ChevronRight,
  Cpu,
  Layers,
  FileSpreadsheet
} from "lucide-react";

// ==========================================
// 1. CASOS PRECONFIGURADOS SEP (4 CASOS)
// ==========================================
const SAMPLE_CASES = [
  {
    id: "caso-01-falla-500kv",
    title: "Disparo de Línea L-5001 (500 kV) y Deslinde por Ambigüedad de Interruptor",
    category: "Gestión de Falla o Colapso",
    suggestedReport: "ANALISIS_FALLA_RESPONSABILIDAD",
    description: "Análisis pericial de llamada tras el disparo de la Línea 500 kV Cotagaita-Aranjuez. Falta de colación de la nomenclatura del interruptor 502-A.",
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
        justificacion_clasificacion: "Disparo fortuito en sistema troncal 500 kV con desalineación en la colación del código de equipo ('502' en lugar de '502-A'). Se requiere peritaje para deslinde de responsabilidad comunicacional ante la Autoridad de Fiscalización."
      },
      intervinientes: {
        emisor: { nombre_o_rol: "Ing. Mario Vargas - Despachador CNDC", entidad_empresa: "CNDC (Centro Nacional de Despacho de Carga)" },
        receptor: { nombre_o_rol: "Juan Pérez - Operador S/E Cotagaita 500 kV", entidad_empresa: "Empresa Transmisora de Potencia" }
      },
      transcripcion_literal: `Despachador CNDC: "Centro Nacional de Despacho de Carga, habla el Ingeniero Mario Vargas. Buenas tardes."\nOperador Subestación: "Buenas tardes Vargas, habla Juan Pérez, operador de la Subestación Cotagaita 500 kV."\nDespachador CNDC: "Pérez, a las 14:15:22 T-0 detectamos disparo por protección de distancia de la línea 500 kV Cotagaita - Aranjuez. Requiero que confirme señalización en relés y proceda a abrir el interruptor cincuenta cero dos del paño A para aislar barra principal."\nOperador Subestación: "Entendido Vargas. Procedo a verificar el paño. Abriré el interruptor de la línea."\nDespachador CNDC: "Atención Pérez, debe abrir específicamente el 502-A y reportar tensión de barra."\nOperador Subestación: "De acuerdo. Abro interruptor 502."\nDespachador CNDC: "Mencione la hora de ejecución y repita el código exacto 502-A."\nOperador Subestación: "Ejecutado a las 14:18 horas. Se abrió 502. Queda pendiente barra 2."`,
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
          "Colación incompleta por parte del Receptor: omitió la nomenclatura de paño '502-A' repitiendo únicamente '502'.",
          "Falta de confirmación explícita de lectura de tensión en kV antes de autorizar el siguiente paso de maniobra."
        ]
      },
      analisis_pericial_responsabilidades: {
        evaluacion_causa_raiz_comunicacional: "La causa raíz comunicacional fue la falta de rigor en la colación del operador receptor, al no repetir la nomenclatura SCADA completa (502-A) requerida para interruptores de esquema interruptor y medio en 500 kV.",
        asignacion_responsabilidad_comunicacional: "Responsabilidad del RECEPTOR (Operador S/E Cotagaita) por colación deficiente. El Despachador CNDC actuó conforme a protocolo al corregir la omisión en el segundo turno de palabra.",
        relevancia_para_fiscalizacion_o_agentes: "Documento probatorio para la Autoridad de Fiscalización. Demuestra que el CNDC emitió la orden de forma correcta a las 14:15h y que la demora en la normalización de la línea se debió al ciclo de corrección de colación."
      },
      mejora_continua_y_feedback: {
        fortalezas_detectadas: [
          "Monitoreo proactivo y corrección inmediata del Despachador CNDC al detectar la colación incompleta.",
          "Registro preciso de la hora T-0 de actuación de protecciones."
        ],
        oportunidades_de_mejora: [
          "Exigir colación estricta de 3 vías con nomenclatura completa SCADA antes de iniciar la maniobra en físico.",
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
        emisor: { nombre_o_rol: "Ing. Carlos Mendoza - Despachador de Turno CNDC", entidad_empresa: "CNDC" },
        receptor: { nombre_o_rol: "Lic. Roberto Soliz - Operador de Guardia S/E Aranjuez", entidad_empresa: "Empresa de Transmisión Eléctrica" }
      },
      transcripcion_literal: `Despachador CNDC: "Centro Nacional de Despacho de Carga, comunica Despachador de Turno Ing. Carlos Mendoza. Hora 08:00:15."\nOperador Subestación: "Subestación Aranjuez 220 kV, habla Operador de Guardia Lic. Roberto Soliz."\nDespachador CNDC: "Ingeniero Soliz, autorizo inicio de la Solicitud de Maniobra Programada SMP-2026-089 para mantenimiento en Bahía L-204 de 220 kV. Paso 1: Verifique apertura de interruptor 204 y proceda a abrir seccionador de línea 204-1 a las 08:01."\nOperador Subestación: "Confirmado Ing. Mendoza. Solicitud SMP-2026-089. Verifico interruptor 204 abierto en posición cero. Procedo a abrir seccionador de línea 204-1. Hora 08:01:10."\nDespachador CNDC: "Correcta colación Soliz. Aguardo confirmación de posición física del seccionador 204-1."\nOperador Subestación: "Ing. Mendoza, confirmado en campo seccionador 204-1 abierto en las tres fases a las 08:02:40. Tensión cero kV en línea L-204."\nDespachador CNDC: "Recibido y registrado. Excelente trabajo. Puede continuar con el paso 2 de tierras temporales conforme al procedimiento."`,
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
        emisor: { nombre_o_rol: "Ing. Ramos - Despachador CNDC", entidad_empresa: "CNDC" },
        receptor: { nombre_o_rol: "Téc. Luis Agramont - Operador de Central", entidad_empresa: "Empresa Generadora Corani S.A." }
      },
      transcripcion_literal: `Despachador CNDC: "Centro de Despacho CNDC, Ing. Ramos en turno. Hora 18:45:00."\nOperador Planta: "Central Hidroeléctrica Corani, habla operador Técnico Luis Agramont."\nDespachador CNDC: "Ing. Agramont, debido a incremento de demanda en el Sistema Interconectado, solicito aumentar la generación activa de Planta Corani de 60 MW a 100 MW con rampa de 5 MW por minuto. Frecuencia actual 49.88 Hz."\nOperador Planta: "CNDC, recibido. Incrementaremos generación de 60 a 100 megavatios, subiendo 40 megavatios en total a rampa de 5 MW/min. ¿Confirmado?"\nDespachador CNDC: "Afirmativo Agramont. Inicie rampa a partir de las 18:46:00 y notifique al alcanzar los 100 MW."\nOperador Planta: "Entendido CNDC. Iniciamos rampa a las 18:46:00. Reportaremos a los 100 MW."`,
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
        emisor: { nombre_o_rol: "Despachador CNDC", entidad_empresa: "CNDC" },
        receptor: { nombre_o_rol: "Pedro Gutiérrez - Operador de Turno", entidad_empresa: "Empresa Transmisora" }
      },
      transcripcion_literal: `Despachador CNDC: "Urgente, Despacho CNDC. Operador Cotagaita conteste!"\nOperador Subestación: "Aquí Cotagaita, habla operador de turno."\nDespachador CNDC: "Tenemos sobretensión crítica de 242 kV en barra de 220. Conecte de inmediato el Reactor R-101 en barra de 115 para drenar reactivos. Conecte ahora mismo!"\nOperador Subestación: "Recibido. Conecto reactor de la barra."\nDespachador CNDC: "Un momento! Menciones su nombre, confirme si es el R-101 o el R-102 y dé la hora exacta de la maniobra!"\nOperador Subestación: "Habla Pedro Gutierrez. Conecté el reactor R-102 a las 19:12."\nDespachador CNDC: "Gutiérrez, cometió un grave error! Le instruí R-101 en 115kV, no R-102! Desconecte R-102 de inmediato para evitar sobrecarga del transformador!"`,
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
        asignacion_responsabilidad_comunicacional: "RESPONSABILIDAD COMPARTIDA: 60% Receptor (por maniobrar sin colación previa y conectar equipo erróneo) y 40% Emisor (por romper la cadena de mando, no exigir colación previa y transmitir zozobra).",
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

// ==========================================
// 2. GENERADOR DE PDFS AUTÓNOMO (jsPDF)
// ==========================================
export function downloadSEPAuditPDF(result, forceReportType) {
  const isForensic = (forceReportType || result.clasificacion_informe?.tipo_informe_sugerido) === "ANALISIS_FALLA_RESPONSABILIDAD";
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const cndcBlue = [0, 93, 170];
  const cndcOrange = [232, 119, 26];
  const primaryColor = isForensic ? [180, 40, 40] : cndcBlue;
  const darkNeutral = [28, 42, 57];
  const lightBg = [244, 246, 249];
  const borderGray = [220, 226, 235];

  // Encabezado institucional CNDC (Fondo blanco, texto azul y naranja)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 32, "F");

  // 1. Texto principal "CNDC"
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(cndcBlue[0], cndcBlue[1], cndcBlue[2]);
  doc.text("CNDC", 14, 15);

  // 2. Subtexto "Comité Nacional de Despacho de Carga"
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(cndcOrange[0], cndcOrange[1], cndcOrange[2]);
  doc.text("Comité Nacional de Despacho de Carga", 42, 15);

  // Título del informe
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkNeutral[0], darkNeutral[1], darkNeutral[2]);
  doc.text(
    isForensic
      ? "PERITAJE TÉCNICO Y DESLINDE DE RESPONSABILIDAD (SEP)"
      : "AUDITORÍA DE PROTOCOLO DE COMUNICACIÓN NORMATIVA (SEP)",
    14,
    23
  );

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("Sistema de Control y Evaluación de Comunicaciones Operativas", 14, 28);
  doc.text(`Fecha de Emisión: ${new Date().toLocaleString("es-ES")}`, 135, 28);

  // Línea divisoria inferior naranja
  doc.setFillColor(cndcOrange[0], cndcOrange[1], cndcOrange[2]);
  doc.rect(14, 31, 182, 1.5, "F");

  let currentY = 38;

  // Banner informativo
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(14, currentY, 182, 18, 2, 2, "FD");

  doc.setTextColor(darkNeutral[0], darkNeutral[1], darkNeutral[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(
    `TIPO DE EVENTO: ${(result.metadatos_generales?.tipo_evento_operativo || "OPERACIÓN SEP").toUpperCase()}`,
    18,
    currentY + 6
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(
    `Score Protocolo: ${result.mejora_continua_y_feedback?.metricas_mejora_medible?.score_cumplimiento_protocolo || "N/A"} | Claridad: ${result.mejora_continua_y_feedback?.metricas_mejora_medible?.indice_claridad_tecnica || "N/A"} | Calidad Audio: ${result.metadatos_generales?.calidad_audio || "Media"}`,
    18,
    currentY + 12
  );

  currentY += 24;

  // Sección 1: Metadatos e Intervinientes
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("1. METADATOS GENERALES E INTERVINIENTES OPERATIVOS", 14, currentY);
  currentY += 4;

  autoTable(doc, {
    startY: currentY,
    theme: "grid",
    headStyles: {
      fillColor: cndcBlue,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    styles: { fontSize: 8, cellPadding: 2, lineColor: [220, 221, 225], lineWidth: 0.2 },
    alternateRowStyles: { fillColor: [244, 246, 249] },
    head: [["Parámetro", "Detalle Extraído", "Intervinientes", "Organización / Entidad"]],
    body: [
      [
        "Fecha / Hora Estimada",
        result.metadatos_generales?.fecha_hora_estimada || "N/A",
        `EMISOR: ${result.intervinientes?.emisor?.nombre_o_rol || "Despachador CNDC"}`,
        result.intervinientes?.emisor?.entidad_empresa || "CNDC",
      ],
      [
        "Duración Audio / Evento",
        `${result.metadatos_generales?.duracion_audio_segundos || 60} segundos`,
        `RECEPTOR: ${result.intervinientes?.receptor?.nombre_o_rol || "Operador de Guardia"}`,
        result.intervinientes?.receptor?.entidad_empresa || "Empresa Agente SEP",
      ],
      [
        "Calidad de Grabación",
        result.metadatos_generales?.calidad_audio || "Media",
        "Clasificación Sugerida",
        result.clasificacion_informe?.tipo_informe_sugerido || "PROTOCOLO_NORMATIVO",
      ],
    ],
  });

  currentY = doc.lastAutoTable.finalY + 8;

  // Sección 2: Extracción Técnica Utilizable
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("2. EXTRACCIÓN DE INFORMACIÓN TÉCNICA UTILIZABLE (SCADA / SEP)", 14, currentY);
  currentY += 4;

  autoTable(doc, {
    startY: currentY,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 2.2 },
    body: [
      ["Subestación / Área Eléctrica:", result.extraccion_utilizable?.subestacion_o_area || "No especificada"],
      ["Equipo / Componente SCADA:", result.extraccion_utilizable?.equipo_componente || "No especificado"],
      ["Acción Operativa Instruida:", result.extraccion_utilizable?.accion_operativa || "No especificada"],
      ["Parámetros Técnicos (kV/MW/Hz):", result.extraccion_utilizable?.parametros_tecnicos || "No registrados"],
      ["Hora Mencionada en Llamada:", result.extraccion_utilizable?.hora_instruccion_mencionada || "No registrada"],
      [
        "Confirmación por Colación Correcta:",
        result.extraccion_utilizable?.confirmacion_colacion_correcta
          ? "SÍ - CUMPLIDO RIGUROSAMENTE"
          : "NO - DESVIACIÓN O INCOMPLETA",
      ],
    ],
  });

  currentY = doc.lastAutoTable.finalY + 6;

  // Resumen ejecutivo
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, currentY, 182, 16, 1.5, 1.5, "F");
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkNeutral[0], darkNeutral[1], darkNeutral[2]);
  doc.text("Resumen Ejecutivo Operativo:", 17, currentY + 5);
  doc.setFont("helvetica", "normal");
  const splitResumen = doc.splitTextToSize(
    result.extraccion_utilizable?.resumen_ejecutivo_operativo || "Sin resumen disponible.",
    176
  );
  doc.text(splitResumen, 17, currentY + 10);

  currentY += 22;

  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // Sección 3: Protocolo o Peritaje de Falla
  if (isForensic) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("3. ANÁLISIS PERICIAL DE CAUSA RAÍZ Y ASIGNACIÓN DE RESPONSABILIDADES", 14, currentY);
    currentY += 4;

    autoTable(doc, {
      startY: currentY,
      theme: "grid",
      headStyles: { fillColor: [180, 40, 40], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
      styles: { fontSize: 8.5, cellPadding: 3 },
      head: [["Eje de Evaluación Pericial", "Análisis y Deslinde Técnico"]],
      body: [
        ["Evaluación Causa Raíz Comunicacional", result.analisis_pericial_responsabilidades?.evaluacion_causa_raiz_comunicacional || "N/A"],
        ["Asignación de Responsabilidad Operativa", result.analisis_pericial_responsabilidades?.asignacion_responsabilidad_comunicacional || "N/A"],
        ["Relevancia para Fiscalización / Agentes", result.analisis_pericial_responsabilidades?.relevancia_para_fiscalizacion_o_agentes || "N/A"],
      ],
    });
    currentY = doc.lastAutoTable.finalY + 8;
  } else {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("3. EVALUACIÓN DE CUMPLIMIENTO DEL PROTOCOLO DE 3 VÍAS", 14, currentY);
    currentY += 4;

    const p = result.evaluacion_protocolo || {};
    autoTable(doc, {
      startY: currentY,
      theme: "grid",
      headStyles: { fillColor: [20, 80, 150], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 2.5 },
      head: [["Criterio del Protocolo de Operación", "Estado", "Puntos Cumplidos / Desviaciones"]],
      body: [
        ["Cordialidad y Saludo Formal", p.cumplimiento_cordialidad ? "CUMPLIDO" : "NO CUMPLIDO", (p.puntos_cumplidos || []).join("; ") || "Sin observaciones"],
        ["Mensaje Directo a Operación", p.mensaje_directo_a_operacion ? "CUMPLIDO" : "NO CUMPLIDO", "Sin conversación fuera de protocolo"],
        ["Identificación Emisor/Receptor", p.identificacion_emisor_receptor ? "CUMPLIDO" : "NO CUMPLIDO", "Nombres y roles declarados"],
        ["Instrucción SCADA Clara", p.instruccion_clara_y_sin_ambiguedad ? "CUMPLIDO" : "NO CUMPLIDO", "Especificación unívoca del componente"],
        ["Colación Obligatoria (3 Vías)", p.colacion_confirmacion_completa ? "CUMPLIDO" : "NO CUMPLIDO", (p.desviaciones_normativas || []).join("; ") || "Colación validada correctamente"],
      ],
    });
    currentY = doc.lastAutoTable.finalY + 8;
  }

  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // Sección 4: Mejora Continua y Métricas
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("4. MEJORA CONTINUA, FEEDBACK Y MÉTRICAS DE CONTROL", 14, currentY);
  currentY += 4;

  const m = result.mejora_continua_y_feedback?.metricas_mejora_medible || {};
  autoTable(doc, {
    startY: currentY,
    theme: "grid",
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2.5 },
    head: [["Métrica Medible", "Valor / Indicador", "Acción Correctiva Sugerida"]],
    body: [
      ["Score Cumplimiento Protocolo", m.score_cumplimiento_protocolo || "0%", m.accion_correctiva_recomendada || "Capacitación de turno"],
      ["Índice de Claridad Técnica", m.indice_claridad_tecnica || "0%", "Retroalimentación en turno"],
      ["Tiempo Perdido por Ambigüedad", `${m.tiempo_estimado_perdido_por_ambiguedad_seg || 0} seg`, "Optimización de maniobra"],
    ],
  });
  currentY = doc.lastAutoTable.finalY + 6;

  // Caja de feedback senior
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(14, currentY, 182, 20, 1.5, 1.5, "FD");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 83, 9);
  doc.text("Feedback del Ingeniero Senior (+10 Años de Operación SEP):", 17, currentY + 5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  const splitFeedback = doc.splitTextToSize(
    result.mejora_continua_y_feedback?.feedback_sugerido_al_operador || "Mantener disciplina estricta de colación.",
    176
  );
  doc.text(splitFeedback, 17, currentY + 10);

  // Footer en todas las páginas
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(148, 163, 184);
    doc.text(`Auditoría y Peritaje Operativo SEP - Página ${i} de ${pageCount}`, 14, 287);
    doc.text("Documento confidencial CNDC / Agentes SEP", 130, 287);
  }

  const filename = `${isForensic ? "Informe_Pericial_Falla" : "Informe_Auditoria_Protocolo"}_SEP_${Date.now()}.pdf`;
  doc.save(filename);
}

// ==========================================
// 3. COMPONENTE PRINCIPAL APP
// ==========================================
export default function App() {
  // Configuración de Gemini API Key
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("cndc_gemini_api_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Vista principal: "audit" o "manual"
  const [viewMode, setViewMode] = useState("audit"); // "audit" | "manual"

  // Telemetría CNDC en tiempo real (Frecuencia nominal SIN Bolivia 50.00 Hz)
  const [gridFreq, setGridFreq] = useState("50.00");
  const [currentTime, setCurrentTime] = useState("");

  // Pestañas de entrada
  const [inputTab, setInputTab] = useState("samples"); // "samples" | "upload" | "record" | "text"
  const [selectedSampleId, setSelectedSampleId] = useState("caso-01-falla-500kv");
  const [customText, setCustomText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [audioBase64, setAudioBase64] = useState(null);
  const [audioMime, setAudioMime] = useState("audio/mp3");

  // Grabación con micrófono
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Estado de análisis
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [auditResult, setAuditResult] = useState(SAMPLE_CASES[0].presetResult);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState("protocol"); // "protocol" | "forensic" | "improvement" | "transcript"

  // Historial en localStorage
  const [auditHistory, setAuditHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("cndc_audit_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reloj CNDC y fluctuación realista de frecuencia SIN Bolivia (50.00 Hz)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("es-ES", { timeZone: "America/La_Paz" }));
      // Leve fluctuación estocástica de frecuencia normal (49.98 - 50.02 Hz) fijada en 50.00 Hz nominal
      const delta = (Math.random() - 0.5) * 0.04;
      setGridFreq((50.00 + delta).toFixed(2));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Guardar API Key
  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem("cndc_gemini_api_key", newKey);
  };

  // Guardar en historial
  const saveResultToHistory = (result, label) => {
    const item = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString("es-ES"),
      title: label || result.extraccion_utilizable?.accion_operativa || "Auditoría Operativa",
      score: result.mejora_continua_y_feedback?.metricas_mejora_medible?.score_cumplimiento_protocolo || "0%",
      type: result.clasificacion_informe?.tipo_informe_sugerido || "PROTOCOLO_NORMATIVO",
      result
    };
    const updated = [item, ...auditHistory.filter((h) => h.id !== item.id)].slice(0, 10);
    setAuditHistory(updated);
    try {
      localStorage.setItem("cndc_audit_history", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Cargar caso de prueba
  const handleSelectSample = (sample) => {
    setSelectedSampleId(sample.id);
    setAuditResult(sample.presetResult);
    setActiveAnalysisTab(
      sample.presetResult.clasificacion_informe.tipo_informe_sugerido === "ANALISIS_FALLA_RESPONSABILIDAD"
        ? "forensic"
        : "protocol"
    );
    saveResultToHistory(sample.presetResult, sample.title);
  };

  // Manejo de subida de archivo
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setAudioMime(file.type || "audio/mp3");

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      setAudioBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  // Manejo de grabación
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioMime("audio/webm");
        setUploadedFile(new File([blob], "Grabacion_Operativa_SEP.webm", { type: "audio/webm" }));
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          setAudioBase64(base64);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
    } catch (err) {
      setErrorMsg("No se pudo acceder al micrófono: " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Ejecución de análisis con Gemini (@google/genai o Backend)
  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setLoadingMessage("Iniciando peritaje y auditoría de comunicación SEP...");

    try {
      let analysisJson = null;

      // Opción 1: Si hay API Key de Google AI Studio configurada por el usuario
      if (apiKey && apiKey.trim().length > 10) {
        setLoadingMessage("Conectando con Gemini 2.5 Flash / 1.5 Pro vía @google/genai...");
        const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

        const systemPrompt = `ROL Y EXPERIENCIA:
Eres un Ingeniero Senior con más de 10 años de experiencia en Operación en Tiempo Real de Sistemas Eléctricos de Potencia (SEP), Coordinación de Maniobras, Despacho Económico y Análisis de Fallas en Centros de Control (CNDC), y experto en Procesamiento de Lenguaje Natural (NLP) aplicado a auditoría de protocolos de comunicación operativa y peritaje técnico de fallas.

Debes analizar la grabación o transcripción de la llamada operativa y devolver ESTRICTAMENTE un objeto JSON válido con la siguiente estructura exacta:
{
  "metadatos_generales": {
    "fecha_hora_estimada": "YYYY-MM-DD HH:MM:SS",
    "tipo_evento_operativo": "Gestión de Falla o Colapso | Maniobra Programada | Despacho Económico | Control Tensión",
    "duracion_audio_segundos": 60,
    "calidad_audio": "Alta | Media | Baja"
  },
  "clasificacion_informe": {
    "tipo_informe_sugerido": "PROTOCOLO_NORMATIVO | ANALISIS_FALLA_RESPONSABILIDAD",
    "justificacion_clasificacion": "Justificación técnica rigurosa"
  },
  "intervinientes": {
    "emisor": { "nombre_o_rol": "Nombre/Cargo", "entidad_empresa": "Empresa/CNDC" },
    "receptor": { "nombre_o_rol": "Nombre/Cargo", "entidad_empresa": "Empresa/S/E" }
  },
  "transcripcion_literal": "Transcripción textual completa",
  "extraccion_utilizable": {
    "subestacion_o_area": "S/E identificada",
    "equipo_componente": "Código SCADA unívoco",
    "accion_operativa": "Acción requerida",
    "parametros_tecnicos": "kV, MW, Hz o T-0",
    "hora_instruccion_mencionada": "HH:MM:SS",
    "instruccion_emito_claramente": true,
    "confirmacion_colacion_correcta": false,
    "resumen_ejecutivo_operativo": "Resumen técnico sintético"
  },
  "evaluacion_protocolo": {
    "cumplimiento_cordialidad": true,
    "mensaje_directo_a_operacion": true,
    "identificacion_emisor_receptor": true,
    "instruccion_clara_y_sin_ambiguedad": true,
    "colacion_confirmacion_completa": false,
    "puntos_cumplidos": ["Punto 1", "Punto 2"],
    "desviaciones_normativas": ["Desviación 1"]
  },
  "analisis_pericial_responsabilidades": {
    "evaluacion_causa_raiz_comunicacional": "Causa raíz técnica",
    "asignacion_responsabilidad_comunicacional": "Responsabilidad asignada",
    "relevancia_para_fiscalizacion_o_agentes": "Impacto ante la Autoridad"
  },
  "mejora_continua_y_feedback": {
    "fortalezas_detectadas": ["Fortaleza 1"],
    "oportunidades_de_mejora": ["Oportunidad 1"],
    "feedback_sugerido_al_operador": "Consejo experto del Ingeniero Senior (+10 años)",
    "metricas_mejora_medible": {
      "score_cumplimiento_protocolo": "85%",
      "indice_claridad_tecnica": "90%",
      "tiempo_estimado_perdido_por_ambiguedad_seg": 45,
      "accion_correctiva_recomendada": "Acción concreta"
    }
  }
}`;

        const contents = [];
        if (audioBase64) {
          contents.push({
            inlineData: {
              data: audioBase64,
              mimeType: audioMime || "audio/mp3",
            },
          });
        }
        const textPayload = customText.trim()
          ? `TRANSCRIPCIÓN DE ENTRADA A AUDITAR:\n${customText}`
          : "Analiza el audio operativo adjunto del Centro de Control SEP.";
        contents.push(textPayload);

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
          },
        });

        const rawText = response.text || "";
        analysisJson = JSON.parse(rawText);
      } else {
        // Opción 2: Backend proxy (/api/analyze)
        setLoadingMessage("Procesando auditoría mediante el servidor seguro...");
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioBase64: audioBase64 || null,
            mimeType: audioMime,
            transcriptText: customText || null,
            customInstruction: "",
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "No se pudo completar el análisis en el servidor.");
        }
        analysisJson = data.data;
      }

      setAuditResult(analysisJson);
      saveResultToHistory(analysisJson, uploadedFile?.name || "Auditoría Directa");
      setActiveAnalysisTab(
        analysisJson.clasificacion_informe?.tipo_informe_sugerido === "ANALISIS_FALLA_RESPONSABILIDAD"
          ? "forensic"
          : "protocol"
      );
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.message || "Error al procesar el análisis. Verifique su API Key de Google AI Studio o use un caso de prueba."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* ========================================================
          1. ENCABEZADO INSTITUCIONAL CNDC Y BARRA DE TELEMETRÍA
         ======================================================== */}
      <header className="bg-white border-b border-slate-200 text-slate-800 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo institucional CNDC en texto estilizado */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3.5">
              <div className="inline-flex flex-col select-none">
                <div className="flex items-baseline space-x-2">
                  <span className="font-black text-2xl sm:text-3xl tracking-tight text-[#005DAA]">
                    CNDC
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-[#E8771A]">
                    Comité Nacional de Despacho de Carga
                  </span>
                </div>
                <div className="h-[2px] w-full bg-[#E8771A] mt-0.5" />
              </div>

              <div className="hidden sm:block border-l border-slate-300 pl-3.5">
                <h1 className="font-bold text-sm lg:text-base text-[#005DAA] tracking-tight">
                  Analizador de Comunicaciones Operativas
                </h1>
                <p className="text-[11px] text-slate-600 font-medium">
                  Sistema de Control & Auditoría SEP
                </p>
              </div>
            </div>

            {/* Selector de Vistas Móvil */}
            <div className="md:hidden flex items-center space-x-1">
              <button
                onClick={() => setViewMode(viewMode === "audit" ? "manual" : "audit")}
                className="p-2 text-slate-600 hover:text-[#005DAA] rounded-lg hover:bg-slate-100"
                title="Cambiar a Guía"
              >
                <BookOpen className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Telemetría y Controles en Tiempo Real */}
          <div className="flex flex-wrap items-center justify-end gap-2 text-xs w-full md:w-auto">
            {/* Monitor de Frecuencia (SIN Bolivia - 50.00 Hz Nominal) */}
            <div className="flex items-center space-x-2 bg-[#F4F6F9] px-3 py-1.5 rounded-lg border border-slate-200">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="text-slate-600 font-medium text-[11px]">Freq SIN:</span>
              <span className="font-mono font-bold text-emerald-700 text-sm">{gridFreq} Hz</span>
              <span className="text-[10px] font-semibold text-[#005DAA] bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 rounded">
                50.00 Hz Nom.
              </span>
            </div>

            {/* Reloj del Centro de Control CNDC */}
            <div className="hidden sm:flex items-center space-x-2 bg-[#F4F6F9] px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-slate-700">
              <Clock className="w-3.5 h-3.5 text-[#005DAA]" />
              <span className="text-[11px] font-semibold">{currentTime || "12:00:00"} Hora CNDC (UTC-4)</span>
            </div>

            {/* Estado Centro de Control */}
            <div className="hidden lg:flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-2.5 py-1.5 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-[10.5px]">Centro de Control CNDC Active</span>
            </div>

            {/* Botón de API Key */}
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                apiKey
                  ? "bg-blue-50 text-[#005DAA] border-blue-200 hover:bg-blue-100"
                  : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 animate-pulse"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{apiKey ? "API Key Configurada" : "Ingresar API Key"}</span>
            </button>

            {/* Navegación Principal */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode("audit")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                  viewMode === "audit"
                    ? "bg-[#005DAA] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Procesador & Auditoría
              </button>
              <button
                onClick={() => setViewMode("manual")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                  viewMode === "manual"
                    ? "bg-[#005DAA] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Manual & Guía
              </button>
            </div>
          </div>
        </div>

        {/* Barra desplegable para ingresar la API Key de Google AI Studio */}
        {showKeyInput && (
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <Key className="w-4 h-4 text-[#005DAA]" />
                <span className="font-semibold">Google AI Studio API Key:</span>
                <span className="text-slate-500 hidden md:inline">
                  (Permite procesar audios y transcripciones con el modelo Gemini oficial)
                </span>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 w-full sm:w-72 focus:outline-none focus:border-[#005DAA]"
                />
                <button
                  onClick={() => setShowKeyInput(false)}
                  className="px-3 py-1.5 bg-[#005DAA] text-white rounded font-semibold hover:bg-[#004A88]"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          2. VISTA CONDICIONAL: MANUAL DE USUARIO O AUDITORÍA
         ======================================================== */}
      {viewMode === "manual" ? (
        <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-[#005DAA]/20 text-[#1D7FD0] rounded-xl">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Manual de Usuario & Guía Metodológica CNDC
                </h2>
                <p className="text-sm text-slate-400">
                  Operación de Sistemas Eléctricos de Potencia (SEP), Auditoría de Comunicaciones y Deslinde Pericial
                </p>
              </div>
            </div>

            <div className="space-y-8 mt-6 text-sm text-slate-300 leading-relaxed">
              {/* Sección 1 */}
              <section className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/60">
                <h3 className="font-bold text-base text-white flex items-center space-x-2 mb-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>1. Configuración de API Key de Google AI Studio</span>
                </h3>
                <p className="mb-2">
                  Para utilizar el motor de Inteligencia Artificial en vivo de Google (Gemini 2.5 Flash / 1.5 Pro):
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Ingrese a <strong className="text-white">aistudio.google.com</strong> y genere su API Key gratuita.</li>
                  <li>Haga clic en el botón <strong className="text-white">"Ingresar API Key"</strong> en la barra superior.</li>
                  <li>Pegue su clave y presione "Guardar". La clave se almacena de forma segura en su navegador localmente.</li>
                </ol>
              </section>

              {/* Sección 2 */}
              <section className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/60">
                <h3 className="font-bold text-base text-white flex items-center space-x-2 mb-2">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>2. Modos de Entrada de Información</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-white text-xs uppercase text-[#E8771A] mb-1">A. Casos Reales SEP</h4>
                    <p className="text-xs text-slate-400">
                      Incluye 4 escenarios preconfigurados (falla 500 kV, mantenimiento 220 kV, despacho hidráulico y sobretensión con reactor) para demostraciones inmediatas sin consumir saldo.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-white text-xs uppercase text-[#E8771A] mb-1">B. Subir Audio (.wav, .mp3, .m4a)</h4>
                    <p className="text-xs text-slate-400">
                      Cargue grabaciones magnetofónicas de las líneas de despacho para transcripción automática y auditoría profunda.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-white text-xs uppercase text-[#E8771A] mb-1">C. Grabar en Vivo (Micrófono)</h4>
                    <p className="text-xs text-slate-400">
                      Capture simulaciones en sala de control mediante WebRTC MediaRecorder con cronómetro y análisis en tiempo real.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-white text-xs uppercase text-[#E8771A] mb-1">D. Transcripción de Texto</h4>
                    <p className="text-xs text-slate-400">
                      Pegue directamente las bitácoras o minutas de llamadas para una evaluación inmediata del protocolo de 3 vías.
                    </p>
                  </div>
                </div>
              </section>

              {/* Sección 3 */}
              <section className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/60">
                <h3 className="font-bold text-base text-white flex items-center space-x-2 mb-2">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span>3. Protocolo de Colación de 3 Vías (IEEE / IEC 61850)</span>
                </h3>
                <p className="mb-2 text-slate-300">
                  La operación de sistemas troncales exige que ninguna maniobra se ejecute sin completar el ciclo estricto de 3 vías:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-blue-950/40 border border-blue-800/50 rounded-lg">
                    <strong className="text-blue-300">Vía 1 (Emisión):</strong> El Despachador CNDC emite la orden con código unívoco SCADA, nivel de tensión, subestación y hora.
                  </div>
                  <div className="p-2.5 bg-amber-950/40 border border-amber-800/50 rounded-lg">
                    <strong className="text-amber-300">Vía 2 (Colación/Repetición):</strong> El Operador de Subestación repite textualmente la orden completa sin abreviar códigos de equipos.
                  </div>
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/50 rounded-lg">
                    <strong className="text-emerald-300">Vía 3 (Confirmación y Autorización):</strong> El Despachador confirma que la colación fue exacta antes de autorizar la apertura/cierre físico.
                  </div>
                </div>
              </section>

              {/* Sección 4 */}
              <section className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/60">
                <h3 className="font-bold text-base text-white flex items-center space-x-2 mb-2">
                  <Download className="w-4 h-4 text-rose-400" />
                  <span>4. Emisión de Informes Ejecutivos en PDF</span>
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  El sistema genera dos documentos en formato oficial CNDC listos para presentar ante el Comité de Operación del Mercado o la Autoridad Regulatoria:
                </p>
                <ul className="list-disc list-inside mt-2 text-xs text-slate-400 space-y-1">
                  <li><strong className="text-white">Informe de Protocolo Normativo (PDF):</strong> Certifica el apego al reglamento de despacho, puntuación de claridad técnica y recomendaciones pedagógicas.</li>
                  <li><strong className="text-white">Informe Pericial de Falla y Deslinde (PDF):</strong> Documento técnico forense que identifica la causa raíz comunicacional, cuantifica el tiempo perdido por ambigüedad y desglosa porcentualmente la responsabilidad operativa entre emisor y receptor.</li>
                </ul>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700 text-center">
              <button
                onClick={() => setViewMode("audit")}
                className="px-6 py-2.5 bg-[#005DAA] hover:bg-[#004A88] text-white font-bold rounded-xl shadow-lg transition"
              >
                Volver al Procesador de Auditoría
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* ========================================================
            3. VISTA PRINCIPAL DE PROCESADOR & AUDITORÍA OPERATIVA
           ======================================================== */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
          {/* SECCIÓN DE ENTRADA */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-[#E8771A]" />
                  <span>Ingreso de Comunicaciones del Centro de Control</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Seleccione una llamada grabada, use un caso de prueba o grabe con micrófono en sala
                </p>
              </div>

              {/* Selector de pestañas de entrada */}
              <div className="flex flex-wrap gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700 text-xs">
                <button
                  onClick={() => setInputTab("samples")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    inputTab === "samples" ? "bg-[#005DAA] text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Casos Reales SEP
                </button>
                <button
                  onClick={() => setInputTab("upload")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    inputTab === "upload" ? "bg-[#005DAA] text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Subir Audio
                </button>
                <button
                  onClick={() => setInputTab("record")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    inputTab === "record" ? "bg-[#005DAA] text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Grabar en Vivo
                </button>
                <button
                  onClick={() => setInputTab("text")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    inputTab === "text" ? "bg-[#005DAA] text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Transcripción
                </button>
              </div>
            </div>

            {/* CONTENIDO DE PESTAÑAS DE ENTRADA */}
            {inputTab === "samples" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {SAMPLE_CASES.map((caseItem) => (
                  <button
                    key={caseItem.id}
                    onClick={() => handleSelectSample(caseItem)}
                    className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      selectedSampleId === caseItem.id
                        ? "bg-[#005DAA]/15 border-[#005DAA] ring-1 ring-[#005DAA]"
                        : "bg-slate-900/50 border-slate-700 hover:border-slate-600 hover:bg-slate-900"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-[#E8771A] border border-slate-700">
                          {caseItem.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Demo</span>
                      </div>
                      <h3 className="font-bold text-xs text-white line-clamp-2 mb-1">
                        {caseItem.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {caseItem.description}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                      <span className="text-emerald-400 font-semibold">
                        Score: {caseItem.presetResult.mejora_continua_y_feedback.metricas_mejora_medible.score_cumplimiento_protocolo}
                      </span>
                      <span className="text-xs text-[#1D7FD0] font-bold">Cargar →</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {inputTab === "upload" && (
              <div className="pt-2">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 hover:border-[#005DAA] rounded-xl p-8 cursor-pointer bg-slate-900/40 transition">
                  <Upload className="w-10 h-10 text-[#005DAA] mb-3" />
                  <span className="text-sm font-semibold text-white">
                    {uploadedFile ? uploadedFile.name : "Seleccione un archivo de audio operativo"}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">Formatos: .wav, .mp3, .m4a, .webm (Max 25MB)</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {inputTab === "record" && (
              <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700 text-center space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${isRecording ? "bg-red-500 animate-ping" : "bg-slate-600"}`} />
                  <span className="font-mono text-xl font-bold text-white">
                    {Math.floor(recordingSeconds / 60)}:{String(recordingSeconds % 60).padStart(2, "0")} seg
                  </span>
                </div>
                <div className="flex justify-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center space-x-2 transition shadow-lg"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Iniciar Grabación</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl flex items-center space-x-2 transition shadow-lg"
                    >
                      <MicOff className="w-4 h-4" />
                      <span>Detener y Preparar</span>
                    </button>
                  )}
                </div>
                {uploadedFile && !isRecording && (
                  <p className="text-xs text-emerald-400 font-semibold">
                    Grabación capturada exitosamente: {uploadedFile.name}
                  </p>
                )}
              </div>
            )}

            {inputTab === "text" && (
              <div className="space-y-2 pt-2">
                <textarea
                  rows={5}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder='Despachador CNDC: "Centro Nacional de Despacho, autorizo apertura de interruptor 502..."'
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-[#005DAA]"
                />
              </div>
            )}

            {/* BOTÓN DE ACCIÓN DE ANÁLISIS */}
            {(inputTab === "upload" || inputTab === "record" || inputTab === "text") && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunAnalysis}
                  disabled={isLoading || (!uploadedFile && !customText.trim())}
                  className="px-6 py-2.5 bg-[#E8771A] hover:bg-[#D4660B] disabled:opacity-50 text-white font-bold rounded-xl flex items-center space-x-2 shadow-lg transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isLoading ? "Auditoría en Curso..." : "Ejecutar Peritaje con IA"}</span>
                </button>
              </div>
            )}

            {/* Mensaje de carga o error */}
            {isLoading && (
              <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl flex items-center space-x-3 text-xs text-blue-300">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span>{loadingMessage}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center space-x-3 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* ========================================================
              4. PANEL DE ANÁLISIS EN PANTALLA (4 PESTAÑAS DEDICADAS)
             ======================================================== */}
          {auditResult && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
              {/* Encabezado del Peritaje */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 bg-[#005DAA] text-white text-[10px] font-extrabold rounded uppercase tracking-wider">
                      {auditResult.metadatos_generales?.tipo_evento_operativo || "OPERACIÓN SEP"}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-700 text-slate-300 text-[10px] font-semibold rounded">
                      {auditResult.metadatos_generales?.fecha_hora_estimada || "Tiempo Real"}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[10px] font-bold rounded">
                      Score: {auditResult.mejora_continua_y_feedback?.metricas_mejora_medible?.score_cumplimiento_protocolo || "100%"}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-xl font-black text-white">
                    {auditResult.extraccion_utilizable?.accion_operativa || "Auditoría de Comunicación en Centro de Control"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {auditResult.clasificacion_informe?.justificacion_clasificacion || ""}
                  </p>
                </div>

                {/* BOTONES DE DESCARGA PDF */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => downloadSEPAuditPDF(auditResult, "PROTOCOLO_NORMATIVO")}
                    className="px-3.5 py-2 bg-[#005DAA] hover:bg-[#004A88] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Informe de Protocolo (PDF)</span>
                  </button>
                  <button
                    onClick={() => downloadSEPAuditPDF(auditResult, "ANALISIS_FALLA_RESPONSABILIDAD")}
                    className="px-3.5 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Informe Pericial de Falla (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Selector de las 4 Pestañas de Análisis */}
              <div className="flex flex-wrap gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
                <button
                  onClick={() => setActiveAnalysisTab("protocol")}
                  className={`px-4 py-2 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                    activeAnalysisTab === "protocol"
                      ? "bg-[#005DAA] text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>A. Protocolo Normativo</span>
                </button>
                <button
                  onClick={() => setActiveAnalysisTab("forensic")}
                  className={`px-4 py-2 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                    activeAnalysisTab === "forensic"
                      ? "bg-rose-700 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>B. Peritaje de Falla & Responsabilidad</span>
                </button>
                <button
                  onClick={() => setActiveAnalysisTab("improvement")}
                  className={`px-4 py-2 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                    activeAnalysisTab === "improvement"
                      ? "bg-[#E8771A] text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>C. Mejora Continua (+10 Años)</span>
                </button>
                <button
                  onClick={() => setActiveAnalysisTab("transcript")}
                  className={`px-4 py-2 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                    activeAnalysisTab === "transcript"
                      ? "bg-slate-700 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>D. Transcripción Literal</span>
                </button>
              </div>

              {/* CONTENIDO PESTAÑA A: PROTOCOLO NORMATIVO */}
              {activeAnalysisTab === "protocol" && (
                <div className="space-y-6">
                  {/* Tarjetas de Verificación de Protocolo */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                      {
                        label: "Cordialidad",
                        val: auditResult.evaluacion_protocolo?.cumplimiento_cordialidad,
                        desc: "Saludo formal y respeto"
                      },
                      {
                        label: "Mensaje Directo",
                        val: auditResult.evaluacion_protocolo?.mensaje_directo_a_operacion,
                        desc: "Sin desviaciones coloquiales"
                      },
                      {
                        label: "Identificación Actores",
                        val: auditResult.evaluacion_protocolo?.identificacion_emisor_receptor,
                        desc: "Nombres y roles declarados"
                      },
                      {
                        label: "Nomenclatura SCADA",
                        val: auditResult.evaluacion_protocolo?.instruccion_clara_y_sin_ambiguedad,
                        desc: "Código de equipo unívoco"
                      },
                      {
                        label: "Colación 3 Vías",
                        val: auditResult.evaluacion_protocolo?.colacion_confirmacion_completa,
                        desc: "Repetición estricta y validada"
                      }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          item.val
                            ? "bg-emerald-950/20 border-emerald-800/60"
                            : "bg-red-950/20 border-red-800/60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-white">{item.label}</span>
                          {item.val ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                        <span
                          className={`inline-block mt-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            item.val ? "bg-emerald-900/60 text-emerald-300" : "bg-red-900/60 text-red-300"
                          }`}
                        >
                          {item.val ? "Conforme" : "Desviación"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Datos extraídos de la operación */}
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/70 space-y-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider text-[#1D7FD0]">
                      Extracción Técnica Utilizable en Tiempo Real
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Subestación / Área:</span>
                        <span className="font-semibold text-white">
                          {auditResult.extraccion_utilizable?.subestacion_o_area || "N/A"}
                        </span>
                      </div>
                      <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Equipo / Componente SCADA:</span>
                        <span className="font-semibold text-amber-300">
                          {auditResult.extraccion_utilizable?.equipo_componente || "N/A"}
                        </span>
                      </div>
                      <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Parámetros Técnicos:</span>
                        <span className="font-semibold text-white">
                          {auditResult.extraccion_utilizable?.parametros_tecnicos || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Puntos cumplidos y desviaciones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-emerald-950/20 border border-emerald-800/50 p-4 rounded-xl space-y-2">
                      <h4 className="font-bold text-emerald-300 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Puntos Conformes de Protocolo</span>
                      </h4>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {(auditResult.evaluacion_protocolo?.puntos_cumplidos || []).map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-950/20 border border-red-800/50 p-4 rounded-xl space-y-2">
                      <h4 className="font-bold text-red-300 flex items-center space-x-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>Desviaciones Normativas Detectadas</span>
                      </h4>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {(auditResult.evaluacion_protocolo?.desviaciones_normativas || []).length > 0 ? (
                          auditResult.evaluacion_protocolo.desviaciones_normativas.map((dev, i) => (
                            <li key={i}>{dev}</li>
                          ))
                        ) : (
                          <li className="text-slate-400">Sin desviaciones registradas. Protocolo impecable.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTENIDO PESTAÑA B: PERITAJE DE FALLA & RESPONSABILIDAD */}
              {activeAnalysisTab === "forensic" && (
                <div className="space-y-6">
                  {/* Dictamen de Asignación de Responsabilidad */}
                  <div className="p-5 bg-red-950/30 border border-red-700/60 rounded-xl space-y-3">
                    <div className="flex items-center space-x-2 text-red-400">
                      <ShieldAlert className="w-5 h-5" />
                      <h3 className="font-bold text-sm uppercase tracking-wider">
                        Dictamen Pericial de Asignación de Responsabilidad Operativa
                      </h3>
                    </div>
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      {auditResult.analisis_pericial_responsabilidades?.asignacion_responsabilidad_comunicacional ||
                        "Sin asignación de culpa requerida."}
                    </p>
                  </div>

                  {/* Causa Raíz Comunicacional */}
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-2 text-xs">
                    <h4 className="font-bold text-[#E8771A] uppercase tracking-wider text-[11px]">
                      Evaluación Forense de Causa Raíz Comunicacional
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      {auditResult.analisis_pericial_responsabilidades?.evaluacion_causa_raiz_comunicacional ||
                        "Operación limpia sin causa raíz de riesgo identificada."}
                    </p>
                  </div>

                  {/* Relevancia Regulatoria */}
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-2 text-xs">
                    <h4 className="font-bold text-blue-400 uppercase tracking-wider text-[11px]">
                      Relevancia para la Autoridad de Fiscalización y Agentes del Mercado
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      {auditResult.analisis_pericial_responsabilidades?.relevancia_para_fiscalizacion_o_agentes ||
                        "Documento probatorio para archivo normativo."}
                    </p>
                  </div>
                </div>
              )}

              {/* CONTENIDO PESTAÑA C: MEJORA CONTINUA Y FEEDBACK (+10 AÑOS) */}
              {activeAnalysisTab === "improvement" && (
                <div className="space-y-6">
                  {/* Tarjetas de Métricas */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700">
                      <span className="text-xs text-slate-400 block mb-1">Score Cumplimiento Protocolo</span>
                      <span className="text-2xl font-black text-emerald-400">
                        {auditResult.mejora_continua_y_feedback?.metricas_mejora_medible?.score_cumplimiento_protocolo || "0%"}
                      </span>
                    </div>
                    <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700">
                      <span className="text-xs text-slate-400 block mb-1">Índice de Claridad Técnica</span>
                      <span className="text-2xl font-black text-blue-400">
                        {auditResult.mejora_continua_y_feedback?.metricas_mejora_medible?.indice_claridad_tecnica || "0%"}
                      </span>
                    </div>
                    <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700">
                      <span className="text-xs text-slate-400 block mb-1">Tiempo Perdido por Ambigüedad</span>
                      <span className="text-2xl font-black text-amber-400">
                        {auditResult.mejora_continua_y_feedback?.metricas_mejora_medible?.tiempo_estimado_perdido_por_ambiguedad_seg || 0} s
                      </span>
                    </div>
                  </div>

                  {/* Cuadro Destacado: Feedback del Ingeniero Senior */}
                  <div className="p-5 bg-amber-950/25 border-l-4 border-[#E8771A] rounded-xl bg-slate-900/80 space-y-2">
                    <div className="flex items-center space-x-2 text-[#E8771A]">
                      <Award className="w-5 h-5" />
                      <h4 className="font-bold text-sm uppercase tracking-wider">
                        Feedback del Ingeniero Senior (+10 Años de Operación en Tiempo Real SEP)
                      </h4>
                    </div>
                    <p className="text-slate-200 text-sm italic leading-relaxed">
                      "{auditResult.mejora_continua_y_feedback?.feedback_sugerido_al_operador || "Sin feedback registrado."}"
                    </p>
                  </div>

                  {/* Fortalezas y Oportunidades de Mejora */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-2">
                      <h5 className="font-bold text-emerald-400 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Fortalezas Operativas Detectadas</span>
                      </h5>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {(auditResult.mejora_continua_y_feedback?.fortalezas_detectadas || []).map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-2">
                      <h5 className="font-bold text-amber-400 flex items-center space-x-1.5">
                        <Target className="w-4 h-4" />
                        <span>Oportunidades de Mejora para Próximos Turnos</span>
                      </h5>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {(auditResult.mejora_continua_y_feedback?.oportunidades_de_mejora || []).map((o, i) => (
                          <li key={i}>{o}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTENIDO PESTAÑA D: TRANSCRIPCIÓN LITERAL */}
              {activeAnalysisTab === "transcript" && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Registro Magnetofónico / Transcripción Literal de la Llamada
                  </h3>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-700 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {auditResult.transcripcion_literal || "No se proporcionó transcripción literal."}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              5. PANEL INFERIOR: HISTORIAL DE PERITAJES (LOCALSTORAGE)
             ======================================================== */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#005DAA]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Historial de Peritajes Guardados Localmente
                </h3>
              </div>
              {auditHistory.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("¿Borrar historial guardado?")) {
                      setAuditHistory([]);
                      localStorage.removeItem("cndc_audit_history");
                    }
                  }}
                  className="text-xs text-slate-400 hover:text-red-400 flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpiar Historial</span>
                </button>
              )}
            </div>

            {auditHistory.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No hay peritajes guardados todavía. Los análisis ejecutados se archivarán automáticamente aquí.
              </p>
            ) : (
              <div className="divide-y divide-slate-700/60">
                {auditHistory.map((item) => (
                  <div
                    key={item.id}
                    className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-700/20 px-2 rounded-lg transition"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                        Score: {item.score}
                      </span>
                      <button
                        onClick={() => {
                          setAuditResult(item.result);
                          window.scrollTo({ top: 400, behavior: "smooth" });
                        }}
                        className="text-xs text-[#1D7FD0] hover:underline font-semibold"
                      >
                        Ver Detalles →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* PIE DE PÁGINA */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="inline-flex flex-col select-none text-left">
              <span className="font-bold text-sm text-[#005DAA]">CNDC</span>
              <span className="text-[10px] text-[#E8771A]">Comité Nacional de Despacho de Carga</span>
            </div>
            <div className="border-l border-slate-800 pl-3 text-left">
              <p className="text-slate-400 font-semibold text-[11px]">
                Sistema de Auditoría de Comunicaciones Operativas SEP © {new Date().getFullYear()}
              </p>
              <p className="text-[10px] text-slate-500">
                Norma Técnica IEEE / IEC 61850 / Colación Obligatoria de 3 Vías
              </p>
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Desarrollado para Centros de Control de Energía Eléctrica
          </div>
        </div>
      </footer>
    </div>
  );
}
