"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { siteData } from "@/data/site";
import { usePerformanceVisibility } from "@/lib/performance";

interface Node {
  id: string;
  label: string;
  baseAngle: number;
  baseRadius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  kind: "project" | "stack";
  color: string;
  tagline?: string;
  status?: string;
  metric?: string;
  connections: string[];
}

interface Edge {
  a: string;
  b: string;
  colorA: string;
  colorB: string;
}

interface Particle {
  edgeIndex: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
  reverse: boolean;
}

const STACK_COLORS: Record<string, string> = {
  React: "#00d8ff",
  TypeScript: "#3178c6",
  CUDA: "#76b900",
  "Node.js": "#22c55e",
  Python: "#eab308",
  Whisper: "#a855f7",
  FastAPI: "#14b8a6",
};

const PROJECT_COLORS: Record<string, string> = {
  codeatlas: "#00d8ff",
  "whatsapp-auto-sticker": "#22c55e",
  interviewai: "#fbbf24",
  wasper: "#76b900",
  spacesweep: "#38bdf8",
  "nordicos-tattoo": "#818cf8",
  "segundo-cerebro": "#c084fc",
};

const PROJECT_STACK_MAP: Record<string, string[]> = {
  codeatlas: ["React", "TypeScript"],
  "whatsapp-auto-sticker": ["Node.js", "TypeScript"],
  interviewai: ["Python", "FastAPI"],
  wasper: ["Python", "Whisper", "CUDA"],
  spacesweep: ["TypeScript"],
  "nordicos-tattoo": ["TypeScript"],
  "segundo-cerebro": ["Python"],
};

export function ConstellationCanvas({
  onSelectProject,
}: {
  onSelectProject?: (projectId: string) => void;
} = {}) {
  const { containerRef, shouldRenderLight } = usePerformanceVisibility(0.05);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const hoverRef = useRef<string | null>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  // Dados dos projetos e stacks
  const { initialNodes, initialEdges } = useMemo(() => {
    const projects = siteData.projects;
    const stacks = Object.keys(STACK_COLORS);
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Nós de projetos
    projects.forEach((p, i) => {
      const angle = (i / projects.length) * Math.PI * 2 - Math.PI / 2;
      const color = PROJECT_COLORS[p.id] || "#ffffff";
      const connectedStacks = PROJECT_STACK_MAP[p.id] || [];
      const stackNodeIds = connectedStacks.map((s) => `stack-${s}`);

      nodes.push({
        id: p.id,
        label: p.name,
        baseAngle: angle,
        baseRadius: 0.38,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        r: 6 + (p.maturity || 3),
        kind: "project",
        color,
        tagline: p.taglineHandwritten || p.vision.slice(0, 50) + "...",
        status: p.statusLabel,
        metric: p.metrics?.[0] ? `${p.metrics[0].label}: ${p.metrics[0].value}` : undefined,
        connections: stackNodeIds,
      });
    });

    // Nós de stacks
    stacks.forEach((s, i) => {
      const angle = (i / stacks.length) * Math.PI * 2;
      const color = STACK_COLORS[s] || "#ffffff";
      const connectedProjects = projects
        .filter((p) => (PROJECT_STACK_MAP[p.id] || []).includes(s))
        .map((p) => p.id);

      nodes.push({
        id: `stack-${s}`,
        label: s,
        baseAngle: angle,
        baseRadius: 0.16,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        r: 4.5,
        kind: "stack",
        color,
        connections: connectedProjects,
      });
    });

    // Arestas
    projects.forEach((p) => {
      const pColor = PROJECT_COLORS[p.id] || "#ffffff";
      (PROJECT_STACK_MAP[p.id] || []).forEach((s) => {
        const sColor = STACK_COLORS[s] || "#ffffff";
        edges.push({
          a: p.id,
          b: `stack-${s}`,
          colorA: pColor,
          colorB: sColor,
        });
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  useEffect(() => {
    if (!shouldRenderLight) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const isMobileScreen = window.innerWidth < 768;
    const enableGlow = !isMobileScreen;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;
      dpr = isMobileScreen ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateDimensions();

    // Clona nós e arestas para a referência de animação
    nodesRef.current = initialNodes.map((n) => ({ ...n }));
    edgesRef.current = [...initialEdges];

    // Inicializa partículas de fótons viajando nas arestas (apenas no desktop para poupar CPU/GPU mobile)
    const particles: Particle[] = [];
    if (!isMobileScreen) {
      initialEdges.forEach((_, edgeIndex) => {
        for (let p = 0; p < 2; p++) {
          particles.push({
            edgeIndex,
            progress: Math.random(),
            speed: 0.003 + Math.random() * 0.004,
            size: 2.2 + Math.random() * 1.5,
            color: p % 2 === 0 ? initialEdges[edgeIndex].colorA : initialEdges[edgeIndex].colorB,
            reverse: p % 2 === 1,
          });
        }
      });
    }
    particlesRef.current = particles;

    let lastTime = performance.now();
    let accumulatedOrbitTime = 0;

    const render = (now: number) => {
      const dt = Math.min(now - lastTime, 100);
      lastTime = now;

      // Trava/pausa a rotação orbital SOMENTE quando o cursor do mouse estiver sobre um nó
      const isHoveringNode = hoverRef.current !== null;
      if (!isHoveringNode) {
        accumulatedOrbitTime += dt;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const activeHoverId = hoverRef.current;
      const mouse = mousePosRef.current;

      // 1. Atualiza posições orbitais com física suave e contenção estrita nas bordas
      const nodes = nodesRef.current;
      const nodeMap = new Map(nodes.map((n) => [n.id, n]));

      // Cálculo adaptativo seguro para garantir que NENHUM nó seja cortado nas bordas (Desktop e Mobile)
      const isMobileScreen = width < 640;
      const marginX = isMobileScreen ? 48 : 200;
      const marginY = isMobileScreen ? 36 : 150;
      const safeRadiusX = Math.max(isMobileScreen ? 55 : 120, (width - marginX) / 2);
      const safeRadiusY = Math.max(isMobileScreen ? 48 : 110, (height - marginY) / 2);
      const safeProjectRadius = Math.min(safeRadiusX, safeRadiusY * (isMobileScreen ? 0.90 : 1.02));
      const safeStackRadius = safeProjectRadius * (isMobileScreen ? 0.44 : 0.42);

      nodes.forEach((n) => {
        // Velocidade orbital suave, estável e uniforme (sem oscilação radial)
        const speed = n.kind === "project" ? 0.00014 : 0.00009;
        const currentAngle = n.baseAngle + accumulatedOrbitTime * speed;
        const currentRadius = n.kind === "project" ? safeProjectRadius : safeStackRadius;

        let targetX = cx + Math.cos(currentAngle) * currentRadius;
        let targetY = cy + Math.sin(currentAngle) * (currentRadius * (isMobileScreen ? 0.85 : 0.80));

        // Se o mouse estiver sobre este nó específico, leve atração magnética centrada
        if (mouse && activeHoverId === n.id) {
          const dx = mouse.x - targetX;
          const dy = mouse.y - targetY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80 && dist > 1) {
            targetX += (dx / dist) * 8;
            targetY += (dy / dist) * 8;
          }
        }

        // Interpolação suave (lerp) - No mobile ou primeiro frame, posicionamento direto sem atraso
        if (isMobileScreen || (n.x === 0 && n.y === 0)) {
          n.x = targetX;
          n.y = targetY;
        } else {
          n.x += (targetX - n.x) * 0.1;
          n.y += (targetY - n.y) * 0.1;
        }
      });

      // 2. Renderiza arestas de conexão com gradientes vivos
      const edges = edgesRef.current;
      edges.forEach((e) => {
        const a = nodeMap.get(e.a);
        const b = nodeMap.get(e.b);
        if (!a || !b) return;

        const isConnectedToHover =
          activeHoverId !== null &&
          (activeHoverId === e.a ||
            activeHoverId === e.b ||
            (nodeMap.get(activeHoverId)?.connections || []).includes(e.a) ||
            (nodeMap.get(activeHoverId)?.connections || []).includes(e.b));

        const isDirect = activeHoverId === e.a || activeHoverId === e.b;

        // Gradiente entre as duas cores dos nós
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        if (isDirect) {
          grad.addColorStop(0, a.color);
          grad.addColorStop(1, b.color);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.4;
          ctx.shadowColor = a.color;
          ctx.shadowBlur = enableGlow ? 10 : 0;
        } else if (isConnectedToHover) {
          grad.addColorStop(0, `${a.color}aa`);
          grad.addColorStop(1, `${b.color}aa`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.shadowBlur = 0;
        } else {
          grad.addColorStop(0, `${a.color}25`);
          grad.addColorStop(1, `${b.color}25`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // 3. Renderiza pacotes de luz / partículas viajantes (Data Packets)
      particlesRef.current.forEach((p) => {
        const edge = edges[p.edgeIndex];
        if (!edge) return;
        const a = nodeMap.get(edge.a);
        const b = nodeMap.get(edge.b);
        if (!a || !b) return;

        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const t = p.reverse ? 1 - p.progress : p.progress;
        const px = a.x + (b.x - a.x) * t;
        const py = a.y + (b.y - a.y) * t;

        const isDirect = activeHoverId === edge.a || activeHoverId === edge.b;
        const pSize = isDirect ? p.size * 1.5 : p.size;

        ctx.fillStyle = isDirect ? "#ffffff" : p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = enableGlow ? (isDirect ? 12 : 6) : 0;

        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 4. Renderiza nós (Halos, Círculos e Rótulos)
      nodes.forEach((n) => {
        const isHover = activeHoverId === n.id;
        const isConnected =
          activeHoverId !== null &&
          (nodeMap.get(activeHoverId)?.connections || []).includes(n.id);
        const isProject = n.kind === "project";

        const radius = n.r + (isHover ? 3 : 0);

        // Halo de luz externo estável e limpo (Zero oscilação)
        const glowRadius = radius * (isHover ? 2.8 : isProject ? 2.2 : 1.6);
        const haloGrad = ctx.createRadialGradient(n.x, n.y, radius * 0.5, n.x, n.y, glowRadius);
        haloGrad.addColorStop(0, `${n.color}${isHover ? "99" : isProject ? "40" : "20"}`);
        haloGrad.addColorStop(1, `${n.color}00`);

        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Anel orbital constante e elegante
        if (isProject || isHover) {
          ctx.strokeStyle = `${n.color}${isHover ? "dd" : "55"}`;
          ctx.lineWidth = isHover ? 1.6 : 1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius + (isHover ? 6 : 4), 0, Math.PI * 2);
          ctx.stroke();
        }

        // Núcleo do nó
        ctx.fillStyle = isHover ? "#ffffff" : n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = enableGlow ? (isHover ? 16 : 8) : 0;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Borda interna de contraste
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = isHover ? 2 : 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Tipografia do rótulo adaptada para mobile e desktop
        const isSmallScreen = width < 640;
        const fontSize = isSmallScreen
          ? isProject
            ? (isHover ? 10.5 : 9)
            : (isHover ? 8.5 : 7.5)
          : isProject
            ? (isHover ? 12 : 11)
            : (isHover ? 10 : 9);
        ctx.font = `${isHover ? "700 " : ""}${fontSize}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";

        if (isHover || isConnected) {
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#000000";
          ctx.shadowBlur = enableGlow ? 4 : 0;
        } else if (isProject) {
          ctx.fillStyle = "#e4e4e7";
        } else {
          ctx.fillStyle = "#a1a1aa";
        }

        const labelY = n.y > height - 55 ? n.y - radius - 8 : n.y + radius + 14;
        ctx.fillText(n.label, n.x, labelY);
        ctx.shadowBlur = 0;
      });

      // No mobile (< 768px), o grafo é renderizado sob demanda (zero loop rAF contínuo para erradicar jank de scroll)
      if (!isMobileScreen) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    // Render inicial
    render(performance.now());

    const onResize = () => {
      updateDimensions();
      if (isMobileScreen) {
        render(performance.now());
      }
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    const onMove = (ev: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      mousePosRef.current = { x, y };

      let found: Node | null = null;
      for (const n of nodesRef.current) {
        const dx = n.x - x;
        const dy = n.y - y;
        if (Math.sqrt(dx * dx + dy * dy) <= n.r + 14) {
          found = n;
          break;
        }
      }

      hoverRef.current = found ? found.id : null;
      setHoveredNode(found);

      if (canvas) {
        canvas.style.cursor = found ? "pointer" : "crosshair";
      }
    };

    const onLeave = () => {
      mousePosRef.current = null;
      hoverRef.current = null;
      setHoveredNode(null);
      if (canvas) {
        canvas.style.cursor = "crosshair";
      }
    };

    const onClick = (ev: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;

      for (const n of nodesRef.current) {
        const dx = n.x - x;
        const dy = n.y - y;
        if (Math.sqrt(dx * dx + dy * dy) <= n.r + 14) {
          if (n.kind === "project") {
            if (onSelectProject) {
              onSelectProject(n.id);
            }
          }
          break;
        }
      }
    };

    const onTouchStart = (ev: TouchEvent) => {
      if (ev.touches.length === 1) {
        const touch = ev.touches[0];
        const rect = container.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        mousePosRef.current = { x, y };

        let found: Node | null = null;
        for (const n of nodesRef.current) {
          const dx = n.x - x;
          const dy = n.y - y;
          if (Math.sqrt(dx * dx + dy * dy) <= n.r + 20) {
            found = n;
            break;
          }
        }

        hoverRef.current = found ? found.id : null;
        setHoveredNode(found);

        if (isMobileScreen) {
          render(performance.now());
        }

        if (found && found.kind === "project" && onSelectProject) {
          onSelectProject(found.id);
        }
      }
    };

    const onTouchEnd = () => {
      mousePosRef.current = null;
      hoverRef.current = null;
      setHoveredNode(null);
      if (isMobileScreen) {
        render(performance.now());
      }
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("click", onClick);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("click", onClick);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [shouldRenderLight, initialNodes, initialEdges, containerRef, onSelectProject]);

  return (
    <div ref={containerRef} className="relative w-full h-[280px] sm:h-[380px] md:h-[540px] select-none">
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair touch-pan-y"
        aria-label="Topologia de AST e dependências de projetos"
      />

      {/* Tooltip HUD Técnica Flutuante de Alto Impacto */}
      {hoveredNode && (
        <div
          className="absolute top-3 right-3 sm:top-4 sm:right-4 max-w-[280px] sm:max-w-xs p-3 sm:p-4 rounded-lg border-2 bg-zinc-950/95 backdrop-blur-md shadow-2xl transition-all duration-200 pointer-events-none z-30"
          style={{ borderColor: hoveredNode.color }}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest px-2 py-0.5 rounded font-bold"
              style={{ backgroundColor: `${hoveredNode.color}25`, color: hoveredNode.color }}
            >
              {hoveredNode.kind === "project" ? "MÓDULO DE PROJETO" : "CORE STACK"}
            </span>
            {hoveredNode.status && (
              <span className="font-mono text-[9px] sm:text-[10px] text-zinc-400">
                {hoveredNode.status}
              </span>
            )}
          </div>

          <h4 className="font-display text-lg sm:text-xl text-white tracking-tight mb-1">
            {hoveredNode.label}
          </h4>

          {hoveredNode.tagline && (
            <p className="font-handwriting text-amber-300 text-xs sm:text-sm mb-2">
              {hoveredNode.tagline}
            </p>
          )}

          {hoveredNode.metric && (
            <div className="mt-2 pt-2 border-t border-zinc-800 text-[10px] sm:text-[11px] font-mono text-zinc-300 flex items-center justify-between">
              <span className="text-zinc-500">TELEMETRIA:</span>
              <span className="font-bold text-white">{hoveredNode.metric}</span>
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-zinc-800 text-[9px] sm:text-[10px] font-mono text-zinc-400">
            <span>CONEXÕES ATIVAS: {hoveredNode.connections.length} VÍNCULOS</span>
          </div>

          {hoveredNode.kind === "project" && (
            <div className="mt-2 pt-2 border-t border-zinc-800 text-[9px] sm:text-[10px] font-mono text-[#fbbf24] font-bold flex items-center gap-1">
              <span>▸ TOQUE PARA ABRIR O PROJETO & REPOSITÓRIO ↗</span>
            </div>
          )}
        </div>
      )}

      {/* Legenda de Telemetria no Rodapé do Card */}
      <div className="absolute bottom-2 left-3 sm:bottom-3 sm:left-4 flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[9px] sm:text-[10px] text-zinc-400 pointer-events-none">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00d8ff]" /> React/TS
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#76b900]" /> CUDA/Nvidia
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Node/Streams
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#eab308]" /> Python/FastAPI
        </span>
      </div>
    </div>
  );
}
