import React from "react";
import {
  ShieldAlert,
  Scale,
  FileCheck,
  Building,
  AlertOctagon,
  HelpCircle,
  Award,
} from "lucide-react";
import { AnalisisPericialResponsabilidades } from "../types";

interface ForensicAnalysisTabProps {
  analisis: AnalisisPericialResponsabilidades;
  tipoEvento: string;
}

export const ForensicAnalysisTab: React.FC<ForensicAnalysisTabProps> = ({
  analisis,
  tipoEvento,
}) => {
  // Determine badge styling based on responsibility text
  const getResponsibilityBadge = (text: string) => {
    const upper = text.toUpperCase();
    if (upper.includes("RECEPTOR")) {
      return {
        label: "Responsabilidad del RECEPTOR",
        color: "bg-rose-950 text-rose-300 border-rose-800",
      };
    } else if (upper.includes("EMISOR")) {
      return {
        label: "Responsabilidad del EMISOR",
        color: "bg-amber-950 text-amber-300 border-amber-800",
      };
    } else if (upper.includes("COMPARTIDA")) {
      return {
        label: "Responsabilidad COMPARTIDA",
        color: "bg-purple-950 text-purple-300 border-purple-800",
      };
    } else if (upper.includes("NINGUNA") || upper.includes("EJEMPLAR")) {
      return {
        label: "SIN RESPONSABILIDAD (Sin Falla)",
        color: "bg-emerald-950 text-emerald-300 border-emerald-800",
      };
    }
    return {
      label: "Peritaje Técnico en Evaluación",
      color: "bg-slate-800 text-slate-200 border-slate-700",
    };
  };

  const badgeInfo = getResponsibilityBadge(
    analisis.asignacion_responsabilidad_comunicacional
  );

  return (
    <div className="space-y-6">
      {/* Header Banner - Expert Witness Analysis */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-900/40 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 bg-rose-600/20 border border-rose-500/30 text-rose-400 rounded-xl mt-0.5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">
                  Peritaje Técnico de Fallas y Deslinde de Responsabilidad
                </h3>
                <span className="bg-rose-950 text-rose-300 text-[10px] font-mono px-2 py-0.5 rounded border border-rose-800">
                  Peritaje Senior SEP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Análisis probatorio para Auditorías Internas, Agentes del Mercado Eléctrico y Requerimientos de la Autoridad de Fiscalización
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${badgeInfo.color}`}
          >
            {badgeInfo.label}
          </span>
        </div>
      </div>

      {/* Grid: 3 Main Pillars of Failure Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Causa Raíz Comunicacional */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
              <AlertOctagon className="w-4 h-4" />
              <span>1. Causa Raíz Comunicacional</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {analisis.evaluacion_causa_raiz_comunicacional}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            Evalúa la contribución del canal de audio a errores operativos o demoras.
          </div>
        </div>

        {/* Pillar 2: Asignación de Responsabilidad Operativa */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Scale className="w-4 h-4" />
              <span>2. Deslinde de Responsabilidad</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {analisis.asignacion_responsabilidad_comunicacional}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            Determinación pericial basada en la colación y rigor del comando.
          </div>
        </div>

        {/* Pillar 3: Relevancia para Fiscalización y Mercado */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Building className="w-4 h-4" />
              <span>3. Relevancia para Fiscalización</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {analisis.relevancia_para_fiscalizacion_o_agentes}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            Puntos clave para presentar ante la Autoridad de Fiscalización y Control.
          </div>
        </div>
      </div>

      {/* Official Legal & Technical Notice Box */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 flex items-start space-x-3">
        <FileCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <p className="font-bold text-slate-200 mb-1">
            Validez Probatoria para el Comité de Análisis de Fallas
          </p>
          <p className="text-slate-400">
            Este informe pericial extrae elementos fácticos del registro magnetofónico conforme a las normas IEEE Std 1547 / IEC 61850 y Reglamentos Operativos de Interconexión. Garantiza que la trazabilidad de los códigos SCADA y tiempos T-0 sirvan como insumo directo para el informe de falla definitivo.
          </p>
        </div>
      </div>
    </div>
  );
};
