/* src/components/layout/PageShell.tsx */
import React, { ReactNode } from "react";
import AppHeader from "../navigation/AppHeader";
import AppFooter from "../navigation/AppFooter";

interface PageShellProps {
  headerLeft?: ReactNode;
  headerCenter?: ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
  showFooter?: boolean;
}

export default function PageShell({ 
  headerLeft, 
  headerCenter, 
  headerRight, 
  children, 
  showFooter = true 
}: PageShellProps) {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden font-['Jost']">
      <AppHeader left={headerLeft} center={headerCenter} right={headerRight} />
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>
      {showFooter && <AppFooter />}
    </div>
  );
}