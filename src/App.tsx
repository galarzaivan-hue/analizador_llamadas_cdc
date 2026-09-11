import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CNDCLogo } from "./components/CNDCLogo";
import { AudioInputSection } from "./components/AudioInputSection";
import { AudioPlayerWaveform } from "./components/AudioPlayerWaveform";
import { MetadataCard } from "./components/MetadataCard";
import { ProtocolAuditTab } from "./components/ProtocolAuditTab";
import { ForensicAnalysisTab } from "./components/ForensicAnalysisTab";
import { ContinuousImprovementTab } from "./components/ContinuousImprovementTab";
import { TranscriptView } from "./components/TranscriptView";
import { AuditHistory } from "./components/AuditHistory";
import { HelpModal } from "./components/HelpModal";
import { SampleCase, SEPAuditResult, TipoInformeSugerido } from "./types";
import {
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  FileText,
  AlertCircle,
  Activity,
  Layers,
  RotateCcw,
} from "lucide-react";

export default function App() {
  const [auditResult, setAuditResult] = useState<SEPAuditResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    "protocol" | "forensic" | "improvement" | "transcript"
  >("protocol");
  const [activeReportType, setActiveReportType] = useState<TipoInformeSugerido>(
    "PROTOCOLO_NORMATIVO"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [audioFileName, setAudioFileName] = useState<string>("Llamada_Operativa_SEP.mp3");

  // History State in LocalStorage
  const [auditHistory, setAuditHistory] = useState<SEPAuditResult[]>(() => {
    try {
      const saved = localStorage.getItem("sep_audit_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const saveToHistory = (newResult: SEPAuditResult) => {
    try {
      const updated = [newResult, ...auditHistory.filter((h) => h.id !== newResult.id)].slice(
        0,
        15
      );
      setAuditHistory(updated);
      localStorage.setItem("sep_audit_history", JSON.stringify(updated));
    } catch (e) {
      console.error("Error guardando historial:", e);
    }
  };

  const handleClearHistory = () => {
    if (confirm("¿Desea borrar todo el historial de auditorías guardadas?")) {
      setAuditHistory([]);
      localStorage.removeItem("sep_audit_history");
    }
  };

  // Handle selecting a pre-configured sample case
  const handleSelectSampleCase = (sample: SampleCase) => {
    setErrorMsg(null);
    setAudioFileName(sample.title);
    const resultWithId: SEPAuditResult = {
      ...sample.presetResult,
      id: `audit-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("es-ES"),
      audioFileName: sample.title,
    };
    setAuditResult(resultWithId);
    setActiveReportType(sample.presetResult.clasificacion_informe.tipo_informe_sugerido);

    if (sample.presetResult.clasificacion_informe.tipo_informe_sugerido === "ANALISIS_FALLA_RESPONSABILIDAD") {
      setActiveTab("forensic");
    } else {
      setActiveTab("protocol");
    }

    saveToHistory(resultWithId);
  };

  // Handle Analyzing Audio via API
  const handleAnalyzeAudio = async (
    audioBase64: string | null,
    mimeType: string,
    transcriptText: string | null,
    customInstruction: string,
    fileName?: string
  ) => {
    setIsLoading(true);
    setErrorMsg(null);
    if (fileName) setAudioFileName(fileName);

    const steps = [
      "Procesando audio magnetofónico del Centro de Control...",
      "Extrayendo transcripción literal e identificando intervinientes...",
      "Analizando protocolo de comunicación de 3 vías con IA Senior (+10 años)...",
      "Sintetizando informe pericial y métricas de mejora...",
    ];

    let stepIdx = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setLoadingStep(steps[stepIdx]);
    }, 1500);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audioBase64,
          mimeType,
          transcriptText,
          customInstruction,
        }),
      });

      const data = await response.json();
      clearInterval(stepInterval);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al procesar la auditoría.");
      }

      const newAuditResult: SEPAuditResult = {
        ...data.data,
        id: `audit-${Date.now()}`,
        createdAt: new Date().toLocaleDateString("es-ES"),
        audioFileName: fileName || "Audio_Operativo.mp3",
      };

      setAuditResult(newAuditResult);
      setActiveReportType(
        newAuditResult.clasificacion_informe.tipo_informe_sugerido
      );

      if (
        newAuditResult.clasificacion_informe.tipo_informe_sugerido ===
        "ANALISIS_FALLA_RESPONSABILIDAD"
      ) {
        setActiveTab("forensic");
      } else {
        setActiveTab("protocol");
      }

      saveToHistory(newAuditResult);
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMsg(err.message || "Ocurrió un error inesperado al realizar el análisis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Header Bar */}
      <Header onShowHelp={() => setIsHelpOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-950/80 border border-rose-800 rounded-xl flex items-start space-x-3 text-rose-200 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Error en la Auditoría:</p>
              <p>{errorMsg}</p>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-400 hover:text-rose-200 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input & Case Selector Section */}
        <AudioInputSection
          onAnalyzeAudio={handleAnalyzeAudio}
          onSelectSampleCase={handleSelectSampleCase}
          isLoading={isLoading}
        />

        {/* Loading Overlay State */}
        {isLoading && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center my-8 shadow-2xl flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <Activity className="w-6 h-6 text-blue-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">
              Procesando Auditoría y Peritaje Operativo SEP
            </h3>
            <p className="text-xs text-blue-400 font-mono animate-pulse">
              {loadingStep}
            </p>
          </div>
        )}

        {/* Audit Dashboard Results */}
        {!isLoading && auditResult && (
          <div className="space-y-8 animate-fade-in">
            {/* Audio Waveform Player */}
            <AudioPlayerWaveform
              durationSeconds={auditResult.metadatos_generales.duracion_audio_segundos}
              fileName={auditResult.audioFileName || audioFileName}
            />

            {/* General Metadata & PDF Downloads */}
            <MetadataCard
              result={auditResult}
              activeReportType={activeReportType}
              onSelectReportType={(type) => setActiveReportType(type)}
            />

            {/* Main Section Tab Navigation */}
            <div className="border-b border-slate-800 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setActiveTab("protocol")}
                className={`flex items-center space-x-2 px-5 py-3 font-semibold rounded-t-xl transition border-b-2 ${
                  activeTab === "protocol"
                    ? "border-[#005DAA] bg-slate-900 text-[#1D7FD0] shadow-sm"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#1D7FD0]" />
                <span>Auditoría de Protocolo Normativo</span>
              </button>

              <button
                onClick={() => setActiveTab("forensic")}
                className={`flex items-center space-x-2 px-5 py-3 font-semibold rounded-t-xl transition border-b-2 ${
                  activeTab === "forensic"
                    ? "border-[#E8771A] bg-slate-900 text-[#E8771A] shadow-sm"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-[#E8771A]" />
                <span>Peritaje Técnico de Falla y Responsabilidad</span>
              </button>

              <button
                onClick={() => setActiveTab("improvement")}
                className={`flex items-center space-x-2 px-5 py-3 font-semibold rounded-t-xl transition border-b-2 ${
                  activeTab === "improvement"
                    ? "border-[#F3A100] bg-slate-900 text-[#F3A100] shadow-sm"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <TrendingUp className="w-4 h-4 text-[#F3A100]" />
                <span>Mejora Continua y Feedback (+10 Años)</span>
              </button>

              <button
                onClick={() => setActiveTab("transcript")}
                className={`flex items-center space-x-2 px-5 py-3 font-semibold rounded-t-xl transition border-b-2 ${
                  activeTab === "transcript"
                    ? "border-emerald-500 bg-slate-900 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Transcripción Literal Íntegra</span>
              </button>
            </div>

            {/* Render Selected Tab Content */}
            {activeTab === "protocol" && (
              <ProtocolAuditTab
                evaluacion={auditResult.evaluacion_protocolo}
                extraccion={auditResult.extraccion_utilizable}
              />
            )}

            {activeTab === "forensic" && (
              <ForensicAnalysisTab
                analisis={auditResult.analisis_pericial_responsabilidades}
                tipoEvento={auditResult.metadatos_generales.tipo_evento_operativo}
              />
            )}

            {activeTab === "improvement" && (
              <ContinuousImprovementTab
                mejora={auditResult.mejora_continua_y_feedback}
              />
            )}

            {activeTab === "transcript" && (
              <TranscriptView transcript={auditResult.transcripcion_literal} />
            )}
          </div>
        )}

        {/* Audit History Log */}
        {auditHistory.length > 0 && (
          <div className="mt-12">
            <AuditHistory
              history={auditHistory}
              onSelectAudit={(audit) => {
                setAuditResult(audit);
                setActiveReportType(audit.clasificacion_informe.tipo_informe_sugerido);
                if (audit.clasificacion_informe.tipo_informe_sugerido === "ANALISIS_FALLA_RESPONSABILIDAD") {
                  setActiveTab("forensic");
                } else {
                  setActiveTab("protocol");
                }
              }}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <CNDCLogo variant="horizontal" theme="dark" size="sm" showSubtitle={false} />
            <div className="text-left border-l border-slate-800 pl-3">
              <p className="text-slate-300 font-semibold">
                Comité Nacional de Despacho de Carga
              </p>
              <p className="text-[11px] text-slate-500">
                Sistema Operativo de Auditoría & Peritaje SEP © {new Date().getFullYear()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400 text-[11px]">
            <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">Protocolo Colación 3 Vías</span>
            <span>•</span>
            <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">IEEE 1547 / IEC 61850</span>
            <span>•</span>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="text-[#1D7FD0] hover:underline font-medium"
            >
              Guía Metodológica
            </button>
          </div>
        </div>
      </footer>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
