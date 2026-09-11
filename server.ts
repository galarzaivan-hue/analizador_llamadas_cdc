import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "SEP Operational Call Audit API" });
  });

  // Main Analysis Endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY non configurée. Veuillez configurer la clé d'API.",
        });
      }

      const { audioBase64, mimeType, transcriptText, customInstruction } = req.body;

      if (!audioBase64 && !transcriptText) {
        return res.status(400).json({
          error: "Se requiere un archivo de audio en base64 o una transcripción de texto.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `
ROL Y EXPERIENCIA:
Eres un Ingeniero Senior con más de 10 años de experiencia en Operación en Tiempo Real de Sistemas Eléctricos de Potencia (SEP), Coordinación de Maniobras, Despacho Económico y Análisis de Fallas en Centros de Control (CNDC, Transmisoras, Generadoras, Distribuidoras), además de ser un experto en Procesamiento de Lenguaje Natural (NLP) aplicado a la auditoría de protocolos de comunicación operativa y peritaje técnico de fallas.

PROPÓSITO DE TU ANÁLISIS:
Procesas la grabación o transcripción de la llamada operativa con dos finalidades principales:
1. VERIFICACIÓN DE PROTOCOLO DE COMUNICACIÓN (Auditoría de cumplimiento normativo):
   Verifica: cordialidad, mensaje directo al proceso de la operación, identificación clara de Emisor y Receptor, registro/mención de hora determinada, identificación unívoca del componente/equipo (SCADA / nomenclatura SEP), y confirmación obligatoria (colación / 3-way communication) por parte del receptor.

2. ANÁLISIS DE EVENTOS, FALLAS Y ASIGNACIÓN DE RESPONSABILIDADES:
   Peritaje técnico para análisis de fallas complejas, reconstrucción de la secuencia de eventos y deslinde de responsabilidades operativas. Este análisis es utilizado para auditorías internas, requerimientos de Agentes del Mercado Eléctrico o la Autoridad de Fiscalización y Control.

REGLAS DE EVALUACIÓN:
- Extrae la información con máximo rigor técnico (kV, MW, MVAr, Hz, nomenclatura de interruptores como 500kV, 220kV, 115kV, seccionadores, transformadores, reactores).
- Analiza si existió ambigüedad o falta de colación que pudiera provocar un error de maniobra o retrasar la restitución.
- Clasifica el tipo de informe sugerido ("PROTOCOLO_NORMATIVO" si es maniobra/despacho estándar, o "ANALISIS_FALLA_RESPONSABILIDAD" si hubo evento, disparo, colapso, error o discrepancia).
- Evalúa el score de cumplimiento (0 a 100%), índice de claridad técnica (0 a 100%), estimación de tiempo perdido por ambigüedad en segundos y acciones correctivas.
`;

      const contents: any[] = [];

      if (audioBase64) {
        contents.push({
          inlineData: {
            mimeType: mimeType || "audio/mp3",
            data: audioBase64,
          },
        });
        contents.push({
          text: `Analiza el audio adjunto de la llamada operativa SEP.
Si el audio tiene conversación hablada, realiza primero la transcripción literal e íntegra del audio en el campo "transcripcion_literal", y luego completa rigurosamente toda la extracción técnica y evaluación pericial.
${customInstruction ? `Instrucción adicional del usuario: ${customInstruction}` : ""}`,
        });
      } else {
        contents.push({
          text: `Analiza la siguiente transcripción literal de llamada operativa de Centro de Control SEP:
---
${transcriptText}
---
${customInstruction ? `Instrucción adicional del usuario: ${customInstruction}` : ""}`,
        });
      }

      // Define strict JSON Schema matching the prompt
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          metadatos_generales: {
            type: Type.OBJECT,
            properties: {
              fecha_hora_estimada: { type: Type.STRING },
              tipo_evento_operativo: { type: Type.STRING },
              duracion_audio_segundos: { type: Type.NUMBER },
              calidad_audio: { type: Type.STRING },
            },
            required: [
              "fecha_hora_estimada",
              "tipo_evento_operativo",
              "duracion_audio_segundos",
              "calidad_audio",
            ],
          },
          clasificacion_informe: {
            type: Type.OBJECT,
            properties: {
              tipo_informe_sugerido: { type: Type.STRING },
              justificacion_clasificacion: { type: Type.STRING },
            },
            required: ["tipo_informe_sugerido", "justificacion_clasificacion"],
          },
          intervinientes: {
            type: Type.OBJECT,
            properties: {
              emisor: {
                type: Type.OBJECT,
                properties: {
                  nombre_o_rol: { type: Type.STRING },
                  entidad_empresa: { type: Type.STRING },
                },
                required: ["nombre_o_rol", "entidad_empresa"],
              },
              receptor: {
                type: Type.OBJECT,
                properties: {
                  nombre_o_rol: { type: Type.STRING },
                  entidad_empresa: { type: Type.STRING },
                },
                required: ["nombre_o_rol", "entidad_empresa"],
              },
            },
            required: ["emisor", "receptor"],
          },
          transcripcion_literal: { type: Type.STRING },
          extraccion_utilizable: {
            type: Type.OBJECT,
            properties: {
              subestacion_o_area: { type: Type.STRING },
              equipo_componente: { type: Type.STRING },
              accion_operativa: { type: Type.STRING },
              parametros_tecnicos: { type: Type.STRING },
              hora_instruccion_mencionada: { type: Type.STRING },
              instruccion_emito_claramente: { type: Type.BOOLEAN },
              confirmacion_colacion_correcta: { type: Type.BOOLEAN },
              resumen_ejecutivo_operativo: { type: Type.STRING },
            },
            required: [
              "subestacion_o_area",
              "equipo_componente",
              "accion_operativa",
              "parametros_tecnicos",
              "hora_instruccion_mencionada",
              "instruccion_emito_claramente",
              "confirmacion_colacion_correcta",
              "resumen_ejecutivo_operativo",
            ],
          },
          evaluacion_protocolo: {
            type: Type.OBJECT,
            properties: {
              cumplimiento_cordialidad: { type: Type.BOOLEAN },
              mensaje_directo_a_operacion: { type: Type.BOOLEAN },
              identificacion_emisor_receptor: { type: Type.BOOLEAN },
              instruccion_clara_y_sin_ambiguedad: { type: Type.BOOLEAN },
              colacion_confirmacion_completa: { type: Type.BOOLEAN },
              puntos_cumplidos: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              desviaciones_normativas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              "cumplimiento_cordialidad",
              "mensaje_directo_a_operacion",
              "identificacion_emisor_receptor",
              "instruccion_clara_y_sin_ambiguedad",
              "colacion_confirmacion_completa",
              "puntos_cumplidos",
              "desviaciones_normativas",
            ],
          },
          analisis_pericial_responsabilidades: {
            type: Type.OBJECT,
            properties: {
              evaluacion_causa_raiz_comunicacional: { type: Type.STRING },
              asignacion_responsabilidad_comunicacional: { type: Type.STRING },
              relevancia_para_fiscalizacion_o_agentes: { type: Type.STRING },
            },
            required: [
              "evaluacion_causa_raiz_comunicacional",
              "asignacion_responsabilidad_comunicacional",
              "relevancia_para_fiscalizacion_o_agentes",
            ],
          },
          mejora_continua_y_feedback: {
            type: Type.OBJECT,
            properties: {
              fortalezas_detectadas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              oportunidades_de_mejora: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              feedback_sugerido_al_operador: { type: Type.STRING },
              metricas_mejora_medible: {
                type: Type.OBJECT,
                properties: {
                  score_cumplimiento_protocolo: { type: Type.STRING },
                  indice_claridad_tecnica: { type: Type.STRING },
                  tiempo_estimado_perdido_por_ambiguedad_seg: {
                    type: Type.NUMBER,
                  },
                  accion_correctiva_recomendada: { type: Type.STRING },
                },
                required: [
                  "score_cumplimiento_protocolo",
                  "indice_claridad_tecnica",
                  "tiempo_estimado_perdido_por_ambiguedad_seg",
                  "accion_correctiva_recomendada",
                ],
              },
            },
            required: [
              "fortalezas_detectadas",
              "oportunidades_de_mejora",
              "feedback_sugerido_al_operador",
              "metricas_mejora_medible",
            ],
          },
        },
        required: [
          "metadatos_generales",
          "clasificacion_informe",
          "intervinientes",
          "transcripcion_literal",
          "extraccion_utilizable",
          "evaluacion_protocolo",
          "analisis_pericial_responsabilidades",
          "mejora_continua_y_feedback",
        ],
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.2,
        },
      });

      const jsonText = response.text?.trim() || "";
      const resultData = JSON.parse(jsonText);

      res.json({
        success: true,
        data: resultData,
      });
    } catch (error: any) {
      console.error("Error en /api/analyze:", error);
      res.status(500).json({
        error: error.message || "Error procesando el análisis de la llamada operativa.",
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor de Auditoría Operativa SEP iniciado en http://0.0.0.0:${PORT}`);
  });
}

startServer();
