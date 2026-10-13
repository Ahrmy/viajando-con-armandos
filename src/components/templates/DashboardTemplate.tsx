import type { ReactNode } from "react";

interface DashboardTemplateProps {
  sidebar: ReactNode;
  topbar: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  overlays: ReactNode;
}

export default function DashboardTemplate({
  sidebar,
  topbar,
  children,
  footer,
  overlays,
}: DashboardTemplateProps) {
  return (
    <div className="app-shell">
      {sidebar}
      <main className="main-content" id="inicio">
        {topbar}
        <div className="page-container">
          {children}
          {footer}
        </div>
      </main>
      {overlays}
    </div>
  );
}
