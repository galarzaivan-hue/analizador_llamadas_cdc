import React from "react";
import {
  TrendingUp,
  Award,
  Sparkles,
  Clock,
  Target,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { MejoraContinuaYFeedback } from "../types";

interface ContinuousImprovementTabProps {
  mejora: MejoraContinuaYFeedback;
}

export const ContinuousImprovementTab: React.FC<ContinuousImprovementTabProps> = ({
  mejora,
}) => {
  const m = mejora.metricas_mejora_medible;

  return (
    <div className="space-y-6">
      {/* Metrics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Score Cumplimiento */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Score Cumplimiento Protocolo
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-400">
            {m.score_cumplimiento_protocolo}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Meta del Centro de Control: &gt;90%
          </span>
        </div>

        {/* KPI 2: Índice de Claridad Técnica */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Índice Claridad Técnica
          </span>
          <p className="text-2xl font-bold font-mono text-blue-400">
            {m.indice_claridad_tecnica}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Uso de nomenclatura SCADA
          </span>
        </div>

        {/* KPI 3: Tiempo Perdido por Ambigüedad */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Tiempo Perdido Ambigüedad
          </span>
          <p
            className={`text-2xl font-bold font-mono ${
              m.tiempo_estimado_perdido_por_ambiguedad_seg > 0
                ? "text-rose-400"
                : "text-emerald-400"
            }`}
          >
            {m.tiempo_estimado_perdido_por_ambiguedad_seg} seg
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Retraso en maniobra/restitución
          </span>
        </div>

        {/* KPI 4: Acción Correctiva */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">
              Acción Correctiva Sugerida
            </span>
            <p className="text-xs font-semibold text-amber-300 line-clamp-2">
              {m.accion_correctiva_recomendada}
            </p>
          </div>
        </div>
      </div>

      {/* Senior Engineer Expert Feedback Card */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/50 rounded-xl p-6 shadow-xl">
        <div className="flex items-start space-x-3 mb-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-amber-200">
              Feedback del Ingeniero Senior (+10 Años Operación SEP)
            </h3>
            <p className="text-xs text-amber-400/80">
              Retroalimentación técnica personalizada para capacitación y coaching en el Centro de Control
            </p>
          </div>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed italic">
          "{mejora.feedback_sugerido_al_operador}"
        </div>
      </div>

      {/* Two columns: Fortalezas vs Oportunidades de Mejora */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fortalezas Detectadas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h4 className="font-bold text-sm text-emerald-400 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Fortalezas Detectadas en la Interacción</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {mejora.fortalezas_detectadas.map((fort, i) => (
              <li key={i} className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{fort}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Oportunidades de Mejora */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h4 className="font-bold text-sm text-amber-400 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span>Oportunidades de Mejora para Próximos Turnos</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {mejora.oportunidades_de_mejora.map((op, i) => (
              <li key={i} className="flex items-start space-x-2">
                <Target className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{op}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
