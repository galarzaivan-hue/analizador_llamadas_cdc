import React from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  ListCheck,
  ShieldCheck,
  Activity,
  Layers,
} from "lucide-react";
import { EvaluacionProtocolo, ExtraccionUtilizable } from "../types";

interface ProtocolAuditTabProps {
  evaluacion: EvaluacionProtocolo;
  extraccion: ExtraccionUtilizable;
}

export const ProtocolAuditTab: React.FC<ProtocolAuditTabProps> = ({
  evaluacion,
  extraccion,
}) => {
  const checklistItems = [
    {
      title: "1. Cordialidad y Saludo Formal Operativo",
      desc: "Trato profesional respetuoso sin coloquialismos indebidos",
      passed: evaluacion.cumplimiento_cordialidad,
    },
    {
      title: "2. Mensaje Directo al Proceso Operativo",
      desc: "Enfoque exclusivo en la maniobra o despacho sin conversaciones ajenas",
      passed: evaluacion.mensaje_directo_a_operacion,
    },
    {
      title: "3. Identificación Clara de Emisor y Receptor",
      desc: "Declaración explícita de nombres, roles y centros de control o plantas",
      passed: evaluacion.identificacion_emisor_receptor,
    },
    {
      title: "4. Instrucción Clara e Identificación Unívoca del Equipo",
      desc: "Uso de código exacto SCADA (ej: 502-A, 204-1, R-101) y parámetros (kV, MW)",
      passed: evaluacion.instruccion_clara_y_sin_ambiguedad,
    },
    {
      title: "5. Confirmación Obligatoria (Colación / 3-Way Communication)",
      desc: "Repetición textual inmediata de la orden recibida por parte del receptor",
      passed: evaluacion.colacion_confirmacion_completa,
    },
  ];

  const totalPassed = checklistItems.filter((item) => item.passed).length;
  const percentage = Math.round((totalPassed / checklistItems.length) * 100);

  return (
    <div className="space-y-6">
      {/* Overview Score Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl border ${
              percentage >= 80
                ? "bg-emerald-950/80 border-emerald-800 text-emerald-400"
                : percentage >= 50
                ? "bg-amber-950/80 border-amber-800 text-amber-400"
                : "bg-rose-950/80 border-rose-800 text-rose-400"
            }`}
          >
            {percentage}%
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">
              Índice de Cumplimiento Normativo de Protocolo
            </h3>
            <p className="text-xs text-slate-400">
              Evaluación de 5 pilares obligatorios de comunicación operativa en el SEP
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px]">Criterios Aprobados</span>
            <span className="text-emerald-400 font-bold text-base">
              {totalPassed} / {checklistItems.length}
            </span>
          </div>

          <div className="bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px]">Colación de 3 Vías</span>
            <span
              className={`font-bold text-sm ${
                evaluacion.colacion_confirmacion_completa
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {evaluacion.colacion_confirmacion_completa ? "CORRECTA" : "CON ERRORES"}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Checklist Verification */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ListCheck className="w-5 h-5 text-blue-400" />
          <span>Matriz de Verificación de Protocolo de Comunicación</span>
        </h3>

        <div className="space-y-3">
          {checklistItems.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition ${
                item.passed
                  ? "bg-emerald-950/20 border-emerald-900/50"
                  : "bg-rose-950/20 border-rose-900/50"
              }`}
            >
              <div className="flex items-start space-x-3">
                {item.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                )}
                <div>
                  <h4
                    className={`font-semibold text-sm ${
                      item.passed ? "text-slate-100" : "text-rose-200"
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md border shrink-0 ${
                  item.passed
                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                    : "bg-rose-950 text-rose-300 border-rose-800"
                }`}
              >
                {item.passed ? "CUMPLIDO" : "NO CUMPLIDO"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Technical Data Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span>Datos Técnicos Extraídos de la Charla Operativa</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Subestación / Área Eléctrica
            </span>
            <p className="text-xs font-bold text-slate-100">
              {extraccion.subestacion_o_area}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Equipo / Código SCADA
            </span>
            <p className="text-xs font-mono font-bold text-blue-400">
              {extraccion.equipo_componente}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Acción Operativa Instruida
            </span>
            <p className="text-xs font-bold text-emerald-400">
              {extraccion.accion_operativa}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Parámetros Técnicos (kV / MW / Hz)
            </span>
            <p className="text-xs font-mono font-semibold text-slate-200">
              {extraccion.parametros_tecnicos}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Hora de Instrucción Mencionada
            </span>
            <p className="text-xs font-mono font-bold text-amber-400">
              {extraccion.hora_instruccion_mencionada}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Colación de 3 Vías
            </span>
            <p
              className={`text-xs font-bold ${
                extraccion.confirmacion_colacion_correcta
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {extraccion.confirmacion_colacion_correcta
                ? "Verificada Correctamente"
                : "Deficiente o Incompleta"}
            </p>
          </div>
        </div>
      </div>

      {/* Two columns: Fulfilled Points vs Deviations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Puntos Cumplidos */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h4 className="font-bold text-sm text-emerald-400 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Puntos de Protocolo Cumplidos Exitosamente</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {evaluacion.puntos_cumplidos.length > 0 ? (
              evaluacion.puntos_cumplidos.map((pt, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))
            ) : (
              <p className="text-slate-500 italic">No se registraron puntos de protocolo cumplidos.</p>
            )}
          </ul>
        </div>

        {/* Desviaciones Normativas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h4 className="font-bold text-sm text-rose-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Desviaciones Normativas Encontradas</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {evaluacion.desviaciones_normativas.length > 0 ? (
              evaluacion.desviaciones_normativas.map((desv, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{desv}</span>
                </li>
              ))
            ) : (
              <p className="text-emerald-400/80 font-medium italic">
                ¡Ninguna desviación registrada! Protocolo seguido al 100%.
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
