import React from "react";
import { X, ShieldCheck, Zap, AlertTriangle, BookOpen, CheckCircle2 } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-800">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Guía de Auditoría de Protocolos Operativos SEP
            </h2>
            <p className="text-xs text-slate-400">
              Metodología Senior (+10 Años Operación en Tiempo Real)
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-blue-400 text-sm mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>1. Los 5 Pilares de la Comunicación de 3 Vías</span>
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>
                <strong>Cordialidad Operativa:</strong> Saludo respetuoso identificando el centro de control o planta.
              </li>
              <li>
                <strong>Mensaje Directo a Operación:</strong> Evitar dispersión o charla ajena al despacho.
              </li>
              <li>
                <strong>Identificación de Partes:</strong> Nombre completo y rol de emisor y receptor.
              </li>
              <li>
                <strong>Identificación Unívoca del Equipo:</strong> Uso de nomenclatura SCADA exacta (ej. 502-A, 204-1, R-101) y parámetros de tensión (kV) o frecuencia (Hz).
              </li>
              <li>
                <strong>Colación Obligatoria:</strong> Repetición textual inmediata de la orden recibida antes de accionar el equipo físico.
              </li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-rose-400 text-sm mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>2. Clasificación del Informe PDF a Generar</span>
            </h3>
            <div className="space-y-2">
              <p>
                <strong className="text-blue-300">a) PROTOCOLO_NORMATIVO:</strong> Aplicable a maniobras programadas, rutinarias o de despacho económico estándar.
              </p>
              <p>
                <strong className="text-rose-300">b) ANALISIS_FALLA_RESPONSABILIDAD:</strong> Peritaje técnico probatorio para colapsos, disparos fortuitos, desacuerdos entre agentes o emergencias por sobretensión.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-emerald-400 text-sm mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>3. Casos Reales Integrados</span>
            </h3>
            <p>
              Puede probar inmediatamente el motor pericial seleccionando cualquiera de los 4 casos preconfigurados de la pestaña <strong>"Casos Reales SEP"</strong>.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg text-xs"
          >
            Entendido, Volver a la App
          </button>
        </div>
      </div>
    </div>
  );
};
