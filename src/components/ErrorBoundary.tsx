import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    // If it's a MetaMask or browser extension error, ignore it from showing fallback UI
    const msg = error?.message || "";
    if (
      msg.includes("MetaMask") ||
      msg.includes("metamask") ||
      msg.includes("ethereum")
    ) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const msg = error?.message || "";
    if (
      msg.includes("MetaMask") ||
      msg.includes("metamask") ||
      msg.includes("ethereum")
    ) {
      // Benign extension error, silently ignore
      return;
    }
    console.error("Uncaught application error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">
              Ha ocurrido una incidencia en la interfaz
            </h2>
            <p className="text-sm text-slate-300">
              {this.state.error?.message || "Error inesperado en la aplicación."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[#005DAA] hover:bg-[#004A88] text-white text-sm font-semibold rounded-lg shadow transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reiniciar Sistema</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
