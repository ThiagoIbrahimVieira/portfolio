"use client";

import { GlassCard } from "@/components/GlassCard";
import { StatusChip } from "@/components/StatusChip";
import type { Project } from "@/types/site";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <GlassCard padded className="group hover:border-accent-blue/50 transition-all duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-sans font-semibold tracking-tight">{project.name}</h2>
            <StatusChip status={project.status} label={project.statusLabel} />
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">{project.vision}</p>

        <div className="grid gap-1.5">
          {project.bullets.map((bullet, i) => (
            <div key={i} className="flex gap-2 text-sm text-zinc-400 leading-snug">
              <span className="text-accent-blue-glow/70 select-none">▸</span>
              <span>{bullet}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech, i) => (
            <span
              key={i}
              className="text-[0.7rem] font-mono px-2 py-1 rounded-full border border-solid border-zinc-800 bg-zinc-900/50 text-zinc-400"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-2">
          {project.metrics.map((m, i) => (
            <div
              key={i}
              className="flex flex-col gap-0.5"
            >
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{m.label}</span>
              <span className="text-sm font-mono font-semibold text-white">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
