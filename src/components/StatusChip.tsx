import type { ProjectStatus } from "@/types/site";

const lookup: Record<string, string> = {
  "ativo-fase": "text-accent",
  concluido: "text-secondary",
  construcao: "text-accent",
  experimental: "text-muted",
  laboratorio: "text-muted",
};

const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function StatusChip({ status, label }: { status: ProjectStatus; label: string }) {
  const cls = lookup[normalize(status)] ?? "text-muted";
  return (
    <p className={`text-xs font-mono uppercase tracking-wider mt-2 ${cls}`}>
      {label}
    </p>
  );
}