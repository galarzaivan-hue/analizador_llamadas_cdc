import React, { useState, useEffect } from "react";
import { Activity, ShieldCheck, Zap, Radio, Clock, HelpCircle } from "lucide-react";
import { CNDCLogo } from "./CNDCLogo";

interface HeaderProps {
  onShowHelp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowHelp }) => {
  const [timeString, setTimeString] = useState("");
  const [gridFreq, setGridFreq] = useState("50.00");
  const [systemGrid, setSystemGrid] = useState<"50Hz" | "60Hz">("50Hz");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate slight realistic frequency variation around 50.00 Hz / 60.00 Hz
  useEffect(() => {
    const freqInterval = setInterval(() => {
      const base = systemGrid === "50Hz" ? 50.0 : 60.0;
      const noise = (Math.random() - 0.5) * 0.04;
      setGridFreq((base + noise).toFixed(2));
    }, 2500);
    return () => clearInterval(freqInterval);
  }, [systemGrid]);

  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & CNDC Official Logo Container */}
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-3.5">
            {/* CNDC Stylized Header Text */}
            <CNDCLogo className="py-0.5" />

            <div className="hidden sm:block border-l border-slate-300 pl-3.5">
              <h1 className="font-bold text-sm lg:text-base text-[#005DAA] tracking-tight">
                Analizador de Comunicaciones Operativas
              </h1>
              <p className="text-[11px] text-slate-600 font-medium">
                Sistema de Control & Auditoría SEP
              </p>
            </div>
          </div>

          {onShowHelp && (
            <button
              onClick={onShowHelp}
              className="md:hidden p-2 text-slate-600 hover:text-[#005DAA] rounded-lg hover:bg-slate-100"
              title="Guía Operativa"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Real-time System Gauges & Controls */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end text-xs">
          {/* Frecuencia del Sistema Monitor */}
          <div className="flex items-center space-x-2 bg-[#F4F6F9] px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="text-slate-600 font-medium text-[11px]">Freq Sistema:</span>
            <span className="font-mono font-bold text-emerald-700 text-sm">
              {gridFreq} Hz
            </span>
            <button
              onClick={() => setSystemGrid(systemGrid === "50Hz" ? "60Hz" : "50Hz")}
              className="ml-1 text-[10px] font-bold text-[#005DAA] hover:bg-[#005DAA] hover:text-white bg-slate-200 px-1.5 py-0.5 rounded transition"
              title="Cambiar norma de frecuencia (50Hz / 60Hz)"
            >
              {systemGrid}
            </button>
          </div>

          {/* Reloj de Despacho Operativo */}
          <div className="hidden sm:flex items-center space-x-2 bg-[#F4F6F9] px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-slate-700">
            <Clock className="w-3.5 h-3.5 text-[#005DAA]" />
            <span className="text-[11px] font-semibold">{timeString || "19:17:29"} BOT (UTC-4)</span>
          </div>

          {/* Status Badge */}
          <div className="hidden lg:flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-2.5 py-1.5 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-[10.5px]">Centro de Control CNDC</span>
          </div>

          {onShowHelp && (
            <button
              onClick={onShowHelp}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-[#E8771A] hover:bg-[#D4660B] text-white rounded-lg text-xs font-bold transition shadow-sm"
            >
              <HelpCircle className="w-4 h-4 text-white" />
              <span>Guía</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
