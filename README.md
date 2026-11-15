# Portfolio-TT

Portfólio pessoal de **Thiago (TT)**, estudante de TI na ETEC de Itapevi. Apresentado como consola de telemetria pessoal ("Diário de Bordo de um Construtor"): cada projeto é uma missão com status real e métricas reais.

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router), TypeScript estrito, Tailwind CSS v4
- [React](https://react.dev/) 19, [framer-motion], [lucide-react]
- Fontes self-hosted via `next/font/google`: Inter, JetBrains Mono, Newsreader
- Zero chamadas de rede em runtime; conteúdo 100% estático
- `cn()` próprio (clsx + tailwind-merge) em `src/lib/utils.ts`

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Servidor de desenvolvimento (http://localhost:3000)
npm run dev

# 3. Build de produção
npm run build

# 4. Verificações
npx tsc --noEmit      # tipos: 0 erros
npm run lint          # lint: 0 erros / 0 avisos
```

## Decisões visuais

- Fundo base `#09090b` (zinc-950), superfícies `#18181b` / `#202024` translúcidas, nunca preto puro.
- Liquid Glass: `bg rgba(24,24,27,0.6) + backdrop-blur 14px + borda rgba(255,255,255,0.09) + hairline superior (inset) + sombra de contato`.
- Acentos: azul Apple `#0071e3` (CTA), `#3a8dff` (halos/hover), esmeralda `#10b981` (status positivo), âmbar `#f59e0b` (experimento/laboratório).
- Fundo dot-grid sutil + halos radiais difusos + textura de ruído baixíssima opacidade.
- Hero: constelação de projetos em `<canvas>` (grafo estático animado), nós proporcionais à maturidade, arestas reais projeto ↔ stack, hover ilumina nó/arestas + tooltip glass, parallax leve, drift orbital ±2px, `prefers-reduced-motion` para de drift, tela <640px versão simplificada.
- Nenhum gradiente roxo↔azul genérico, nenhum glow neon exagerado, nenhum boneco 3D, nenhum emoji decorativo.

## Conteúdo

Todo o texto vem do brief de especificação (`src/data/site.ts`): pessoa, 8 projetos (CodeAtlas, SpaceSweep, Wasper, Nordicos Tattoo, LojaPro, ClickCell, Segundo Cérebro, Reel-Chuva), arsenal, jornada e princípios. Sem invenções; link genérico do GitHub (`https://github.com`) porque o handle exato não foi confirmado; sem e-mail.

## Limitações

- Next.js/Turbopack não imprime a linha padrão "First Load JS". Primeira carga JS ≈ 556 KB descompactado (chunks de raiz + polyfill).
- Sem API do GitHub; todos os dados são estáticos.
- Canvas da constelação pausa quando fora do viewport via `requestAnimationFrame` controlado por efeito com cleanup.

## Validação (obra fechada)

- `npm install`: OK
- `npx tsc --noEmit`: 0 erros
- `npm run lint`: 0 erros / 0 avisos
- `npm run build`: sucesso (prerender estático)
- Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error`, zero imagens externas, zero gradientes roxo genérico, todos os botões com hover/focus/active.
