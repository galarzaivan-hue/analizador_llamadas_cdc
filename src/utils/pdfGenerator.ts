import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SEPAuditResult, TipoInformeSugerido } from "../types";
import { CNDC_LOGO_BASE64 } from "../assets/cndcLogoData";

export function generateSEPAuditPDF(
  result: SEPAuditResult,
  targetTypeOverride?: TipoInformeSugerido
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const activeType = targetTypeOverride || result.clasificacion_informe.tipo_informe_sugerido;
  const isForensic = activeType === "ANALISIS_FALLA_RESPONSABILIDAD";

  // Color Palette - Official CNDC Institutional Palette
  const cndcBlue = [0, 93, 170]; // #005DAA - Official CNDC Primary Blue
  const cndcOrange = [232, 119, 26]; // #E8771A - Official CNDC Secondary Orange
  const cndcYellow = [243, 161, 0]; // #F3A100 - Official CNDC Accent Yellow
  const primaryColor = isForensic ? [180, 40, 40] : cndcBlue; // Forensic Red or CNDC Blue
  const darkNeutral = [28, 42, 57];
  const lightBg = [244, 246, 249];
  const borderGray = [220, 226, 235];

  let currentY = 12;

  // Header Container
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 32, "F");

  // 1. Texto principal: "CNDC" (en negrita, color Azul #005DAA)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(cndcBlue[0], cndcBlue[1], cndcBlue[2]);
  doc.text("CNDC", 14, 15);

  // 2. Subtexto: "Comité Nacional de Despacho de Carga" (color Naranja #E8771A)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(cndcOrange[0], cndcOrange[1], cndcOrange[2]);
  doc.text("Comité Nacional de Despacho de Carga", 42, 15);

  // Report Description Title
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
  doc.setTextColor(100, 116, 139);
  doc.text("Sistema de Control y Evaluación de Comunicaciones Operativas", 14, 28);
  doc.text(`Fecha de Emisión: ${new Date().toLocaleString("es-ES")}`, 135, 28);

  // 3. Línea horizontal divisoria inferior en color Naranja (#E8771A)
  doc.setFillColor(cndcOrange[0], cndcOrange[1], cndcOrange[2]);
  doc.rect(14, 31, 182, 1.5, "F");

  currentY = 38;

  // Watermark or Official Tag
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(14, currentY, 182, 18, 2, 2, "FD");

  doc.setTextColor(darkNeutral[0], darkNeutral[1], darkNeutral[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(
    `TIPO DE EVENTO: ${result.metadatos_generales.tipo_evento_operativo.toUpperCase()}`,
    18,
    currentY + 6
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(
    `Score Protocolo: ${result.mejora_continua_y_feedback.metricas_mejora_medible.score_cumplimiento_protocolo} | Claridad Técnica: ${result.mejora_continua_y_feedback.metricas_mejora_medible.indice_claridad_tecnica} | Calidad Audio: ${result.metadatos_generales.calidad_audio}`,
    18,
    currentY + 12
  );

  currentY += 24;

  // Section 1: Metadatos & Intervinientes
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("1. METADATOS GENERALES E INTERVINIENTES OPERATIVOS", 14, currentY);
  currentY += 4;

  autoTable(doc, {
    startY: currentY,
    theme: "grid",
    headStyles: {
      fillColor: cndcBlue as [number, number, number],
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
        result.metadatos_generales.fecha_hora_estimada,
        `EMISOR: ${result.intervinientes.emisor.nombre_o_rol}`,
        result.intervinientes.emisor.entidad_empresa,
      ],
      [
        "Duración Audio / Evento",
        `${result.metadatos_generales.duracion_audio_segundos} segundos`,
        `RECEPTOR: ${result.intervinientes.receptor.nombre_o_rol}`,
        result.intervinientes.receptor.entidad_empresa,
      ],
      [
        "Calidad de Grabación",
        result.metadatos_generales.calidad_audio,
        "Clasificación Sugerida",
        result.clasificacion_informe.tipo_informe_sugerido,
      ],
    ],
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Section 2: Extracción Técnica Utilizable
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("2. EXTRACCIÓN DE INFORMACIÓN TÉCNICA UTILIZABLE (SEP)", 14, currentY);
  currentY += 4;

  autoTable(doc, {
    startY: currentY,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 2.5 },
    body: [
      ["Subestación / Area Eléctrica:", result.extraccion_utilizable.subestacion_o_area],
      ["Equipo / Componente SCADA:", result.extraccion_utilizable.equipo_componente],
      ["Acción Operativa Instruida:", result.extraccion_utilizable.accion_operativa],
      ["Parámetros Técnicos (kV/MW/Hz):", result.extraccion_utilizable.parametros_tecnicos],
      ["Hora Mencionada en Llamada:", result.extraccion_utilizable.hora_instruccion_mencionada],
      [
        "Confirmación por Colación Correcta:",
        result.extraccion_utilizable.confirmacion_colacion_correcta
          ? "SÍ - CUMPLIDO RIGUROSAMENTE"
          : "NO - DESVIACIÓN O INCOMPLETA",
      ],
    ],
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Resumen Ejecutivo Operativo
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, currentY, 182, 16, 1.5, 1.5, "F");
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkNeutral[0], darkNeutral[1], darkNeutral[2]);
  doc.text("Resumen Ejecutivo de Operación:", 17, currentY + 5);
  doc.setFont("helvetica", "normal");
  const splitResumen = doc.splitTextToSize(
    result.extraccion_utilizable.resumen_ejecutivo_operativo,
    176
  );
  doc.text(splitResumen, 17, currentY + 10);

  currentY += 22;

  // Page break check if necessary
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // Section 3: Specific Report Focus
  if (isForensic) {
    // ANALISIS PERICIAL DE FALLAS Y RESPONSABILIDADES
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(
      "3. ANÁLISIS PERICIAL DE CAUSA RAÍZ Y ASIGNACIÓN DE RESPONSABILIDADES",
      14,
      currentY
    );
    currentY += 4;

    autoTable(doc, {
      startY: currentY,
      theme: "grid",
      headStyles: {
        fillColor: [180, 40, 40],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      styles: { fontSize: 8.5, cellPadding: 3 },
      head: [["Eje de Evaluación Pericial", "Análisis y Deslinde Técnico"]],
      body: [
        [
          "Evaluación Causa Raíz Comunicacional",
          result.analisis_pericial_responsabilidades.evaluacion_causa_raiz_comunicacional,
        ],
        [
          "Asignación de Responsabilidad Operativa",
          result.analisis_pericial_responsabilidades.asignacion_responsabilidad_comunicacional,
        ],
        [
          "Relevancia para Fiscalización / Agentes del Mercado",
          result.analisis_pericial_responsabilidades.relevancia_para_fiscalizacion_o_agentes,
        ],
      ],
    });
    currentY = (doc as any).lastAutoTable.finalY + 8;
  } else {
    // PROTOCOLO NORMATIVO DE COMUNICACIONES
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("3. EVALUACIÓN DE CUMPLIMIENTO DEL PROTOCOLO DE 3 VÍAS", 14, currentY);
    currentY += 4;

    const p = result.evaluacion_protocolo;
    autoTable(doc, {
      startY: currentY,
      theme: "grid",
      headStyles: {
        fillColor: [20, 80, 150],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      styles: { fontSize: 8, cellPadding: 2.5 },
      head: [["Criterio del Protocolo de Operación", "Estado", "Puntos Cumplidos / Desviaciones"]],
      body: [
        [
          "Cordialidad y Presentación Formal",
          p.cumplimiento_cordialidad ? "CUMPLIDO" : "NO CUMPLIDO",
          p.puntos_cumplidos.join("; ") || "Sin observaciones negativas",
        ],
        [
          "Mensaje Directo al Proceso Operativo",
          p.mensaje_directo_a_operacion ? "CUMPLIDO" : "NO CUMPLIDO",
          "Sin conversación irrelevante o fuera de protocolo",
        ],
        [
          "Identificación Unívoca Emisor/Receptor",
          p.identificacion_emisor_receptor ? "CUMPLIDO" : "NO CUMPLIDO",
          "Nombres, roles y subestaciones declaradas",
        ],
        [
          "Instrucción Clara y Nomenclatura SCADA",
          p.instruccion_clara_y_sin_ambiguedad ? "CUMPLIDO" : "NO CUMPLIDO",
          "Especificación exacta de código de equipo",
        ],
        [
          "Colación Obligatoria (3-Way Communication)",
          p.colacion_confirmacion_completa ? "CUMPLIDO" : "NO CUMPLIDO",
          p.desviaciones_normativas.join("; ") || "Colación recibida y validada de forma perfecta",
        ],
      ],
    });
    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // Section 4: Mejora Continua, Feedback & Métricas
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("4. MEJORA CONTINUA, FEEDBACK Y MÉTRICAS DE CONTROL", 14, currentY);
  currentY += 4;

  const m = result.mejora_continua_y_feedback.metricas_mejora_medible;
  autoTable(doc, {
    startY: currentY,
    theme: "grid",
    headStyles: {
      fillColor: [51, 65, 85],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    styles: { fontSize: 8, cellPadding: 2.5 },
    head: [["Métrica Medible", "Valor / Indicador", "Acción Correctiva Sugerida"]],
    body: [
      ["Score Cumplimiento Protocolo", m.score_cumplimiento_protocolo, m.accion_correctiva_recomendada],
      ["Índice de Claridad Técnica", m.indice_claridad_tecnica, "Retroalimentación en turno"],
      [
        "Tiempo Perdido por Ambigüedad",
        `${m.tiempo_estimado_perdido_por_ambiguedad_seg} segundos`,
        "Optimización de tiempos de respuesta en Centro de Control",
      ],
    ],
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Feedback del Especialista Senior (+10 años)
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(14, currentY, 182, 22, 1.5, 1.5, "FD");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 83, 9);
  doc.text("Feedback Experto del Ingeniero Senior (+10 Años Operación SEP):", 17, currentY + 5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);

  const splitFeedback = doc.splitTextToSize(
    result.mejora_continua_y_feedback.feedback_sugerido_al_operador,
    176
  );
  doc.text(splitFeedback, 17, currentY + 10);

  currentY += 28;

  // Section 5: Transcripción Literal Registrada
  if (currentY < 235) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(cndcBlue[0], cndcBlue[1], cndcBlue[2]);
    doc.text("5. TRANSCRIPCIÓN LITERAL REGISTRADA DE LA LLAMADA", 14, currentY);
    currentY += 4;

    const transcriptText =
      result.transcripcion_literal.length > 700
        ? result.transcripcion_literal.substring(0, 700) + "... [Texto completado en el visor web]"
        : result.transcripcion_literal;

    const splitTranscript = doc.splitTextToSize(transcriptText, 174);
    const boxHeight = Math.max(20, splitTranscript.length * 3.8 + 6);

    // Box background #F4F6F9
    doc.setFillColor(244, 246, 249);
    doc.rect(14, currentY, 182, boxHeight, "F");

    // Left thick border in CNDC Orange #E8771A (4pt / 1.5mm width)
    doc.setFillColor(cndcOrange[0], cndcOrange[1], cndcOrange[2]);
    doc.rect(14, currentY, 2, boxHeight, "F");

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(28, 42, 57);
    doc.text(splitTranscript, 19, currentY + 5);
  }

  // Footer & Signatures
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(148, 163, 184);

    doc.text(
      `Auditoría y Peritaje Operativo SEP - Página ${i} de ${pageCount}`,
      14,
      287
    );
    doc.text("Documento confidencial para uso exclusivo del CNDC / Agentes SEP", 115, 287);
  }

  const fileName = `${isForensic ? "In_Pericial_Falla" : "In_Auditoria_Protocolo"}_SEP_${Date.now()}.pdf`;
  doc.save(fileName);
}
