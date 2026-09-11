import React, { useState } from "react";
import { FileText, Copy, Check, Search, Hash, Zap } from "lucide-react";

interface TranscriptViewProps {
  transcript: string;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to highlight technical entities
  const formatLineWithTags = (line: string) => {
    if (!line) return line;

    // Separate speaker prefix from message
    const parts = line.split(":");
    if (parts.length > 1) {
      const speaker = parts[0];
      const message = parts.slice(1).join(":");

      return (
        <span>
          <strong className="text-blue-300 font-semibold">{speaker}:</strong>
          <span className="text-slate-200 ml-1.5">{message}</span>
        </span>
      );
    }

    return <span className="text-slate-200">{line}</span>;
  };

  const lines = transcript.split("\n").filter((l) => l.trim().length > 0);
  const filteredLines = searchTerm
    ? lines.filter((l) => l.toLowerCase().includes(searchTerm.toLowerCase()))
    : lines;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-base text-white">
            Transcripción Literal Completa e Íntegra de la Llamada Operativa
          </h3>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar término..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transcript Text Lines */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 font-mono text-xs space-y-3 max-h-96 overflow-y-auto">
        {filteredLines.length > 0 ? (
          filteredLines.map((line, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/40 transition flex items-start space-x-3"
            >
              <span className="text-slate-600 font-bold shrink-0 text-[10px]">
                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
              </span>
              <div className="flex-1 leading-relaxed">{formatLineWithTags(line)}</div>
            </div>
          ))
        ) : (
          <p className="text-slate-500 italic p-4 text-center">
            No se encontraron coincidencia con el término de búsqueda.
          </p>
        )}
      </div>
    </div>
  );
};
