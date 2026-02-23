/* src/components/ContentLoader.tsx */
import React from "react";

interface ContentLoaderProps {
  label: string;
  progress?: number;
}

/**
 * Unified Loading Component
 * Renders as a standard DOM overlay to ensure identical styling across the app.
 * Used for both initial app loading and 3D model progress.
 */
const ContentLoader: React.FC<ContentLoaderProps> = ({ 
  label, 
  progress 
}) => {
  // Explicit sizing and styles to prevent discrepancies between environments
  const containerClasses = `flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-[200px] h-[200px] antialiased select-none`;
  const labelClasses = `mt-6 text-[11px] uppercase tracking-[0.2em] font-black text-slate-500 text-center leading-none`;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className={containerClasses} style={{ fontFamily: 'Jost' }}>
        <div className="flex-1 flex items-center justify-center w-full">
          {progress !== undefined ? (
            /* Progress Circle - used during model loading */
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200" />
                <circle
                  cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 - (175.9 * progress) / 100}
                  strokeLinecap="round"
                  className="text-slate-800 transition-all duration-300 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-800">
                {Math.round(progress)}%
              </div>
            </div>
          ) : (
            /* Spinner - used for initialization and transitions */
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          )}
        </div>
        <p className={labelClasses}>
          {label}
        </p>
      </div>
    </div>
  );
};

export default ContentLoader;