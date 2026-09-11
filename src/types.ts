/**
 * Types for Power System (SEP) Operational Call Audit & Forensic Analysis
 */

export type TipoEventoOperativo = 
  | "Maniobra Programada"
  | "Maniobra Emergencia"
  | "Despacho Económico"
  | "Control Tensión"
  | "Gestión de Falla o Colapso"
  | "Restitución";

export type CalidadAudio = "Alta" | "Media" | "Baja";

export type TipoInformeSugerido = "PROTOCOLO_NORMATIVO" | "ANALISIS_FALLA_RESPONSABILIDAD";

export interface MetadatosGenerales {
  fecha_hora_estimada: string;
  tipo_evento_operativo: string;
  duracion_audio_segundos: number;
  calidad_audio: string;
}

export interface ClasificacionInforme {
  tipo_informe_sugerido: TipoInformeSugerido;
  justificacion_clasificacion: string;
}

export interface IntervinienteInfo {
  nombre_o_rol: string;
  entidad_empresa: string;
}

export interface Intervinientes {
  emisor: IntervinienteInfo;
  receptor: IntervinienteInfo;
}

export interface ExtraccionUtilizable {
  subestacion_o_area: string;
  equipo_componente: string;
  accion_operativa: string;
  parametros_tecnicos: string;
  hora_instruccion_mencionada: string;
  instruccion_emito_claramente: boolean;
  confirmacion_colacion_correcta: boolean;
  resumen_ejecutivo_operativo: string;
}

export interface EvaluacionProtocolo {
  cumplimiento_cordialidad: boolean;
  mensaje_directo_a_operacion: boolean;
  identificacion_emisor_receptor: boolean;
  instruccion_clara_y_sin_ambiguedad: boolean;
  colacion_confirmacion_completa: boolean;
  puntos_cumplidos: string[];
  desviaciones_normativas: string[];
}

export interface AnalisisPericialResponsabilidades {
  evaluacion_causa_raiz_comunicacional: string;
  asignacion_responsabilidad_comunicacional: string; // Emisor / Receptor / Compartida / Ninguna + Explicacion
  relevancia_para_fiscalizacion_o_agentes: string;
}

export interface MetricasMejoraMedible {
  score_cumplimiento_protocolo: string; // e.g. "85%"
  indice_claridad_tecnica: string; // e.g. "90%"
  tiempo_estimado_perdido_por_ambiguedad_seg: number;
  accion_correctiva_recomendada: string;
}

export interface MejoraContinuaYFeedback {
  fortalezas_detectadas: string[];
  oportunidades_de_mejora: string[];
  feedback_sugerido_al_operador: string;
  metricas_mejora_medible: MetricasMejoraMedible;
}

export interface SEPAuditResult {
  id?: string;
  createdAt?: string;
  audioFileName?: string;
  metadatos_generales: MetadatosGenerales;
  clasificacion_informe: ClasificacionInforme;
  intervinientes: Intervinientes;
  transcripcion_literal: string;
  extraccion_utilizable: ExtraccionUtilizable;
  evaluacion_protocolo: EvaluacionProtocolo;
  analisis_pericial_responsabilidades: AnalisisPericialResponsabilidades;
  mejora_continua_y_feedback: MejoraContinuaYFeedback;
}

export interface SampleCase {
  id: string;
  title: string;
  category: TipoEventoOperativo;
  suggestedReport: TipoInformeSugerido;
  description: string;
  audioUrl?: string; // Data URL or synthetic audio
  transcriptText: string;
  presetResult: SEPAuditResult;
}
