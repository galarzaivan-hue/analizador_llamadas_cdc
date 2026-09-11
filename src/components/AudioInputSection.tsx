import React, { useState, useRef } from "react";
import {
  Upload,
  Mic,
  Square,
  FileText,
  Play,
  Sparkles,
  Zap,
  AlertCircle,
  CheckCircle2,
  ListFilter,
  Volume2,
} from "lucide-react";
import { SAMPLE_CASES } from "../data/sampleCases";
import { SampleCase, SEPAuditResult } from "../types";

interface AudioInputSectionProps {
  onAnalyzeAudio: (
    audioBase64: string | null,
    mimeType: string,
    transcriptText: string | null,
    customInstruction: string,
    audioFileName?: string
  ) => void;
  onSelectSampleCase: (sample: SampleCase) => void;
  isLoading: boolean;
}

export const AudioInputSection: React.FC<AudioInputSectionProps> = ({
  onAnalyzeAudio,
  onSelectSampleCase,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "record" | "transcript" | "samples">("samples");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("audio/mp3");
  const [transcriptInput, setTranscriptInput] = useState<string>("");
  const [customInstruction, setCustomInstruction] = useState<string>("");

  // Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setMimeType(file.type || "audio/mp3");

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          // Extract base64 portion
          const base64 = resultStr.split(",")[1];
          setAudioBase64(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Live Microphone Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        setMimeType("audio/webm");

        const reader = new FileReader();
        reader.onloadend = () => {
          const resultStr = reader.result as string;
          const base64 = resultStr.split(",")[1];
          setAudioBase64(base64);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("No se pudo acceder al micrófono. Por favor permita el permiso de micrófono.");
      console.error(err);
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "transcript") {
      if (!transcriptInput.trim()) {
        alert("Por favor ingrese la transcripción de la llamada operativa.");
        return;
      }
      onAnalyzeAudio(null, "text/plain", transcriptInput, customInstruction, "Transcripción Manual");
    } else if (activeTab === "upload") {
      if (!audioBase64) {
        alert("Por favor seleccione un archivo de audio.");
        return;
      }
      onAnalyzeAudio(
        audioBase64,
        mimeType,
        null,
        customInstruction,
        selectedFile ? selectedFile.name : "Audio_Subido.mp3"
      );
    } else if (activeTab === "record") {
      if (!audioBase64) {
        alert("Por favor grabe una llamada de audio antes de analizar.");
        return;
      }
      onAnalyzeAudio(
        audioBase64,
        mimeType,
        null,
        customInstruction,
        `Grabacion_Directa_Mic_${recordingTime}s.webm`
      );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden mb-8">
      {/* Tab Navigation */}
      <div className="bg-slate-950/80 border-b border-slate-800 p-2 flex flex-wrap gap-2 text-sm">
        <button
          onClick={() => setActiveTab("samples")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition ${
            activeTab === "samples"
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Casos Reales SEP (Demostración)</span>
        </button>

        <button
          onClick={() => setActiveTab("upload")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition ${
            activeTab === "upload"
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Subir Audio de Llamada</span>
        </button>

        <button
          onClick={() => setActiveTab("record")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition ${
            activeTab === "record"
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Mic className="w-4 h-4 text-emerald-400" />
          <span>Grabar en Vivo</span>
        </button>

        <button
          onClick={() => setActiveTab("transcript")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition ${
            activeTab === "transcript"
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Transcripción de Texto</span>
        </button>
      </div>

      <div className="p-6">
        {/* Tab 1: Real-World Test Cases */}
        {activeTab === "samples" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span>Seleccionar Caso Operativo Preconfigurado</span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-normal">
                    Centro de Control
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Elija un escenario real de operación en tiempo real para evaluar el procesamiento de lenguaje natural y el informe pericial.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_CASES.map((caseItem) => (
                <div
                  key={caseItem.id}
                  onClick={() => onSelectSampleCase(caseItem)}
                  className="bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 rounded-xl p-4 cursor-pointer transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-md border border-blue-800/50">
                        {caseItem.category}
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                          caseItem.suggestedReport === "ANALISIS_FALLA_RESPONSABILIDAD"
                            ? "bg-rose-950/60 text-rose-300 border-rose-800/50"
                            : "bg-emerald-950/60 text-emerald-300 border-emerald-800/50"
                        }`}
                      >
                        {caseItem.suggestedReport === "ANALISIS_FALLA_RESPONSABILIDAD"
                          ? "Peritaje de Falla"
                          : "Protocolo Normativo"}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-100 group-hover:text-blue-300 transition mb-1">
                      {caseItem.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {caseItem.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-blue-400 font-medium group-hover:translate-x-1 transition">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Cargar Caso para Auditoría
                    </span>
                    <span className="text-[11px] text-slate-500">Demo Listo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Upload File */}
        {activeTab === "upload" && (
          <form onSubmit={handleSubmit}>
            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-8 text-center bg-slate-950/40 transition">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="audio-file-input"
              />
              <label htmlFor="audio-file-input" className="cursor-pointer block">
                <div className="w-12 h-12 bg-blue-600/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="font-semibold text-slate-200 text-sm mb-1">
                  {selectedFile ? selectedFile.name : "Haga clic o arrastre un archivo de audio operativo"}
                </p>
                <p className="text-xs text-slate-500">
                  Formatos soportados: MP3, WAV, M4A, OGG, WebM (Grabaciones de telefonía de despacho)
                </p>
              </label>
            </div>

            {selectedFile && (
              <div className="mt-4 p-3 bg-blue-950/30 border border-blue-800/50 rounded-lg flex items-center justify-between text-xs text-blue-300">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-blue-400" />
                  <span>
                    Archivo listo: <strong className="text-white">{selectedFile.name}</strong> (
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            )}

            {/* Custom Instruction */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Instrucción o Enfoque Específico para el Auditor Senior (Opcional):
              </label>
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Ej: Verifique si se cumplió la regla de colación para el seccionador 204-1 en 220kV"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !audioBase64}
              className="mt-5 w-full bg-[#005DAA] hover:bg-[#004B8A] disabled:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-[#005DAA]/30 text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando Auditoría SEP con Inteligencia Artificial...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Iniciar Auditoría y Peritaje de Llamada</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 3: Record Audio Live */}
        {activeTab === "record" && (
          <form onSubmit={handleSubmit}>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center flex flex-col items-center justify-center">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition ${
                  isRecording
                    ? "bg-rose-600 animate-pulse shadow-lg shadow-rose-900/50"
                    : "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400"
                }`}
              >
                <Mic className="w-10 h-10 text-white" />
              </div>

              {isRecording ? (
                <div>
                  <p className="font-mono text-2xl font-bold text-rose-400 mb-2">
                    00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}
                  </p>
                  <p className="text-xs text-slate-400 mb-4">
                    Grabando llamada operativa... Hable claramente imitando emisor y receptor.
                  </p>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-semibold px-6 py-2.5 rounded-lg flex items-center space-x-2 mx-auto text-xs"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Detener Grabación</span>
                  </button>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-slate-200 text-sm mb-1">
                    Grabe directamente una llamada simulada o en vivo
                  </p>
                  <p className="text-xs text-slate-500 mb-4">
                    El sistema capturará el audio de voz y lo enviará al motor pericial NLP.
                  </p>
                  <button
                    type="button"
                    onClick={startRecording}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-lg flex items-center space-x-2 mx-auto text-xs transition shadow-lg shadow-emerald-900/30"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Iniciar Grabación con Micrófono</span>
                  </button>
                </div>
              )}

              {recordedAudioUrl && !isRecording && (
                <div className="mt-6 w-full max-w-md bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <p className="text-xs font-semibold text-emerald-400 mb-2">
                    Grabación lista para auditar:
                  </p>
                  <audio src={recordedAudioUrl} controls className="w-full h-8" />
                </div>
              )}
            </div>

            {/* Custom Instruction */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Instrucción o Enfoque Específico para el Auditor Senior (Opcional):
              </label>
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Ej: Evaluar tono de voz y confirmación de hora en la colación"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !audioBase64}
              className="mt-5 w-full bg-[#005DAA] hover:bg-[#004B8A] disabled:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-[#005DAA]/30 text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando Auditoría SEP con Inteligencia Artificial...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Iniciar Auditoría de Audio Grabado</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 4: Transcript Text Input */}
        {activeTab === "transcript" && (
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Pegue o escriba la Transcripción de la Llamada Telefónica Operativa:
              </label>
              <textarea
                rows={6}
                value={transcriptInput}
                onChange={(e) => setTranscriptInput(e.target.value)}
                placeholder={`Ejemplo:\nDespachador CNDC: "Centro de Despacho, habla Ing. Vargas. Hora 14:15."\nOperador S/E: "Subestación Cotagaita, habla operador Juan Pérez."\nDespachador CNDC: "Pérez, proceda a abrir interruptor 502-A..."`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Custom Instruction */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Instrucción o Enfoque Específico para el Auditor Senior (Opcional):
              </label>
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Ej: Enfocar en la responsabilidad de fiscalización ante la Autoridad"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !transcriptInput.trim()}
              className="mt-5 w-full bg-[#005DAA] hover:bg-[#004B8A] disabled:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-[#005DAA]/30 text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando Transcripción con Inteligencia Artificial...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Auditar Transcripción de Texto</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
