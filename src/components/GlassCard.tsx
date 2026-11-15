"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  padded?: boolean;
}

export function GlassCard({
  className,
  padded = true,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      role="region"
      aria-roledescription="panel"
      className={cn(
        "glass-panel rounded-3xl relative overflow-hidden",
        padded && "p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface GlassCardHeaderProps {
  title: string;
  subtitle?: string;
}

export function GlassCardHeader({ title, subtitle }: GlassCardHeaderProps) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <h3 className="text-sm font-mono text-zinc-400 tracking-wider uppercase">{title}</h3>
      {subtitle && (
        <p className="text-sm text-zinc-500">{subtitle}</p>
      )}
    </div>
  );
}
