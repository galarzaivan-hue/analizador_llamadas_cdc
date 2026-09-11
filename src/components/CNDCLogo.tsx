import React from "react";

interface CNDCLogoProps {
  variant?: "full" | "horizontal" | "compact" | "icon";
  theme?: "light" | "dark";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showSubtitle?: boolean;
}

export const CNDCLogo: React.FC<CNDCLogoProps> = ({
  className = "",
  showSubtitle = true,
}) => {
  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="flex items-baseline space-x-2">
        <span className="font-black text-2xl sm:text-3xl tracking-tight text-[#005DAA]">
          CNDC
        </span>
        {showSubtitle && (
          <span className="font-bold text-xs sm:text-sm text-[#E8771A]">
            Comité Nacional de Despacho de Carga
          </span>
        )}
      </div>
      <div className="h-[2px] w-full bg-[#E8771A] mt-0.5" />
    </div>
  );
};


