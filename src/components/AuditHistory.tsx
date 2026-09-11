import React from "react";
import { History, Trash2, ExternalLink, ShieldAlert, CheckCircle, Clock } from "lucide-react";
import { SEPAuditResult } from "../types";

interface AuditHistoryProps {
  history: SEPAuditResult[];
  onSelectAudit: (audit: SEPAuditResult) => void;
  onClearHistory: () => void;
}

export const AuditHistory: React.FC<AuditHistoryProps> = ({
  history,
  onSelectAudit,
  onClearHistory,
}) => {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-base text-white">
            Historial de Auditorías y Peritajes Guardados
          </h3>
          <span className="bg-blue-950 text-blue-300 text-xs px-2 py-0.5 rounded font-mono">
            {history.length}
          </span>
        </div>

        <button
          onClick={onClearHistory}
          className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 px-2.5 py-1.5 rounded hover:bg-slate-800 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpiar Historial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((audit, idx) => {
          const isForensic =
            audit.clasificacion_informe.tipo_informe_sugerido === "ANALISIS_FALLA_RESPONSABILIDAD";

          return (
            <div
              key={audit.id || idx}
              onClick={() => onSelectAudit(audit)}
              className="bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800/90 hover:border-blue-500/50 p-4 rounded-xl cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isForensic
                        ? "bg-rose-950 text-rose-300 border-rose-800"
                        : "bg-blue-950 text-blue-300 border-blue-800"
                    }`}
                  >
                    {isForensic ? "Peritaje Falla" : "Protocolo"}
                  </span>

                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    {audit.mejora_continua_y_feedback.metricas_mejora_medible.score_cumplimiento_protocolo}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-100 group-hover:text-blue-300 transition truncate mb-1">
                  {audit.audioFileName || audit.extraccion_utilizable.subestacion_o_area}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                  {audit.extraccion_utilizable.resumen_ejecutivo_operativo}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{audit.createdAt || audit.metadatos_generales.fecha_hora_estimada}</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
