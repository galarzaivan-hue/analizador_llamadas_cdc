import React from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  User,
  Clock,
  Radio,
  Download,
  Building2,
  ShieldAlert,
} from "lucide-react";
import { SEPAuditResult, TipoInformeSugerido } from "../types";
import { generateSEPAuditPDF } from "../utils/pdfGenerator";

interface MetadataCardProps {
  result: SEPAuditResult;
  onSelectReportType?: (type: TipoInformeSugerido) => void;
  activeReportType?: TipoInformeSugerido;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({
  result,
  onSelectReportType,
  activeReportType,
}) => {
  const currentType = activeReportType || result.clasificacion_informe.tipo_informe_sugerido;
  const isForensic = currentType === "ANALISIS_FALLA_RESPONSABILIDAD";

  const handleDownloadPDF = (type: TipoInformeSugerido) => {
    generateSEPAuditPDF(result, type);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6 mb-8">
      {/* Header with Classification Badge & PDF Downloads */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 ${
                isForensic
                  ? "bg-rose-950/80 text-rose-300 border border-rose-800/80"
                  : "bg-[#005DAA]/20 text-[#1D7FD0] border border-[#005DAA]/50"
              }`}
            >
              {isForensic ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Informe Pericial de Falla y Responsabilidad</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-[#1D7FD0]" />
                  <span>Informe CNDC de Protocolo Normativo</span>
                </>
              )}
            </span>

            <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700 font-medium">
              {result.metadatos_generales.tipo_evento_operativo}
            </span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            Análisis Operativo de Comunicación en Tiempo Real
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            {result.clasificacion_informe.justificacion_clasificacion}
          </p>
        </div>

        {/* PDF Export Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={() => handleDownloadPDF("PROTOCOLO_NORMATIVO")}
            className="flex-1 lg:flex-none flex items-center justify-center space-x-2 bg-[#005DAA]/20 hover:bg-[#005DAA]/40 text-[#1D7FD0] border border-[#005DAA]/60 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition"
            title="Descargar versión PDF CNDC de Verificación de Protocolo"
          >
            <Download className="w-3.5 h-3.5 text-[#1D7FD0]" />
            <span>PDF CNDC Protocolo</span>
          </button>

          <button
            onClick={() => handleDownloadPDF("ANALISIS_FALLA_RESPONSABILIDAD")}
            className="flex-1 lg:flex-none flex items-center justify-center space-x-2 bg-rose-900/40 hover:bg-rose-800/60 text-rose-200 border border-rose-800 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition"
            title="Descargar versión PDF Pericial de Falla y Responsabilidad"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span>PDF Peritaje Falla</span>
          </button>
        </div>
      </div>

      {/* Grid Details: Metadatos & Intervinientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Metadato 1: Fecha y Hora */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Fecha y Hora Estimada</span>
          </div>
          <p className="font-mono text-sm font-semibold text-slate-100">
            {result.metadatos_generales.fecha_hora_estimada}
          </p>
        </div>

        {/* Metadato 2: Duración y Calidad Audio */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Duración y Calidad</span>
          </div>
          <p className="font-mono text-sm font-semibold text-slate-100">
            {result.metadatos_generales.duracion_audio_segundos}s | Calidad:{" "}
            <span
              className={
                result.metadatos_generales.calidad_audio === "Alta"
                  ? "text-emerald-400"
                  : "text-amber-400"
              }
            >
              {result.metadatos_generales.calidad_audio}
            </span>
          </p>
        </div>

        {/* Interviniente Emisor */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
            <User className="w-4 h-4 text-blue-400" />
            <span>Emisor (Llamante)</span>
          </div>
          <p className="font-semibold text-xs text-white truncate">
            {result.intervinientes.emisor.nombre_o_rol}
          </p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3 text-slate-500" />
            <span>{result.intervinientes.emisor.entidad_empresa}</span>
          </p>
        </div>

        {/* Interviniente Receptor */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Receptor (Atención)</span>
          </div>
          <p className="font-semibold text-xs text-white truncate">
            {result.intervinientes.receptor.nombre_o_rol}
          </p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3 text-slate-500" />
            <span>{result.intervinientes.receptor.entidad_empresa}</span>
          </p>
        </div>
      </div>

      {/* Switch View Mode Selector */}
      {onSelectReportType && (
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Enfoque de Análisis Activo en Pantalla:</span>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onSelectReportType("PROTOCOLO_NORMATIVO")}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                currentType === "PROTOCOLO_NORMATIVO"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Auditoría Normativa
            </button>
            <button
              onClick={() => onSelectReportType("ANALISIS_FALLA_RESPONSABILIDAD")}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                currentType === "ANALISIS_FALLA_RESPONSABILIDAD"
                  ? "bg-rose-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Peritaje de Falla y Deslinde
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
