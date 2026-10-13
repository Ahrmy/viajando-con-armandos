import type { CSSProperties } from "react";
import type { DbStatus } from "../../types/dashboard";

const statusStyles: Record<DbStatus, CSSProperties> = {
  conectando: { background: "#fef9c3", color: "#854d0e" },
  conectado: { background: "#dcfce7", color: "#166534" },
  error: { background: "#fee2e2", color: "#991b1b" },
};

const statusLabels: Record<DbStatus, string> = {
  conectando: "Conectando a Supabase…",
  conectado: "Supabase conectado ✓",
  error: "Error de conexión — revisa la consola",
};

export default function StatusPill({ status }: { status: DbStatus }) {
  return (
    <span
      role="status"
      style={{
        fontSize: 12,
        padding: "4px 12px",
        borderRadius: 999,
        ...statusStyles[status],
      }}
    >
      {statusLabels[status]}
    </span>
  );
}
