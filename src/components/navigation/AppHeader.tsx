/* src/components/navigation/AppHeader.tsx */
import React, { ReactNode } from "react";

interface AppHeaderProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

export default function AppHeader({ left, center, right }: AppHeaderProps) {
  return (
    <header className="z-[1001] bg-white backdrop-blur-sm border-b border-slate-200 p-3 shrink-0">
      <div className="flex items-center justify-between gap-2 h-10 max-w-[1920px] mx-auto w-full">
        <div className="flex-1 flex justify-start">{left}</div>
        <div className="flex-shrink-0">{center}</div>
        <div className="flex-1 flex justify-end">{right}</div>
      </div>
    </header>
  );
}