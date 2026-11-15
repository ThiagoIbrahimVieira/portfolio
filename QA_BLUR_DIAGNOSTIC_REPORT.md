# RELATÓRIO DE DIAGNÓSTICO DE CAUSA RAIZ // QA-TECH-LEAD
**ID DO DEFEITO:** `DEF-003-BLUR-CONTAINER-TRAP`  
**SEVERIDADE:** P0 - CRÍTICA (Bloqueador Visual / Inacessibilidade de Conteúdo)  
**STATUS:** INVESTIGAÇÃO CONCLUÍDA // PLANO DE REMEDIAÇÃO PREPARADO  
**RESPONSÁVEL:** Steve Rogers (Chief QA Engineer)  
**DESTINATÁRIOS:** Big Boss (`agent-3511b994-398b-47bb-8105-466001f667a0`), Peter Parker (Frontend), Thiago Ibrahim (Founder)  
**DATA:** 15/11/2026  

---

## 1. SUMÁRIO EXECUTIVO

Em auditoria visual conduzida pelo Fundador (Thiago Ibrahim) através de captura de tela de alta resolução (`uploaded_media_1794778218403.jpg`), foi constatado que a subseção inteira **"PROJETOS DE SUPORTE & LABORATÓRIO"** (contendo o título, subtítulo, contador de repositórios e os 3 cards interativos: *SpaceSweep*, *Nórdicos Tattoo* e *Segundo Cérebro*) permaneceu completamente desfocada (`filter: blur(...)`), com texto e elementos ilegíveis no viewport.

A equipe de QA reproduziu o defeito com 100% de consistência via scripts de instrumentação de runtime Chromium (`tools/test-exact-blur.mjs` e `tools/test-scroll-continuous.mjs`). A causa raiz foi isolada em **três falhas arquiteturais combinadas**:
1. **Aninhamento Indevido de Filtro em Container Composto:** O componente `<RevealSection variant="blur-fade">` foi aplicado ao wrapper pai (`<div className="mt-20 pt-16 border-t border-zinc-800">`) de mais de 900px de altura, que engloba tanto o cabeçalho quanto a grade de cards 3D filhos que já possuem suas próprias animações internas.
2. **Dessincronização de IntersectionObserver com Latência de 1050ms:** O `RevealSection` utiliza `viewport={{ once: true, margin: "-70px" }}` e uma transição lenta de `duration: 0.9s` + `delay: 0.15s`. Quando o usuário navega por scroll rápido ou âncora, a restrição de margem e a latência de mais de 1 segundo mantêm o container congelado no estado `hidden: { opacity: 0, filter: "blur(6px)", y: 28 }` ou em interpolação intermediária (`blur(3.5px)` a `blur(1.7px)`).
3. **Armadilha de Compositing Layer no Chromium (`filter: blur(0px)`):** Ao concluir a transição, a variante aplica `filter: blur(0px)`. No motor de renderização do Chromium, manter `filter: blur(...)` ativo no atributo `style` de um elemento pai força a criação de um stacking context isolado em textura offscreen de GPU. Ao colidir com as transformações 3D dos cards filhos (`perspective(1000px) rotateX(...) rotateY(...) scale3d(...)`), o Chromium falha no descarte da camada rasterizada, degradando a nitidez do texto e introduzindo artefatos visuais permanentes se a animação for interrompida ou executada durante rolagem.

---

## 2. EVIDÊNCIA DE REPRODUÇÃO & DADOS DE RUNTIME

A execução do teste automatizado de scroll no ambiente de produção (`https://portifolio-thiago-ibrahim.vercel.app/`) registrou os seguintes dados exatos de medição de DOM:

| Posição / Momento | `hTop` (px do topo) | Estilo Computado no Wrapper | `computedFilter` | `computedOpacity` |
|---|---|---|---|---|
| **Scroll imediato (50ms)** | `99.6px` | `opacity: 0; filter: blur(6px); transform: translateY(28px)` | `blur(6px)` | `0.00` |
| **Transição (+200ms)** | `88.1px` | `opacity: 0.41; filter: blur(3.53px); ...` | `blur(3.53px)` | `0.41` |
| **Transição (+500ms)** | `71.8px` | `opacity: 0.99; filter: blur(0.04px); ...` | `blur(0.04px)` | `0.99` |
| **Estabilizado (+1000ms)**| `71.6px` | `opacity: 1; filter: blur(0px); transform: none;` | `blur(0px)` | `1.00` |

### Análise dos Dados
- A posição em que Thiago Ibrahim tirou o print corresponde com exatidão a `hTop ≈ 100px` (logo abaixo do header de navegação fixo).
- Se o usuário rola a página e para a rolagem enquanto a transição de 1050ms ainda está em curso, ou se o navegador pausa repaints em segundo plano / baixa prioridade durante scroll, a imagem da tela congela exatamente no estado capturado no print do Fundador (`blur` visível entre 2px e 6px).
- O fato de `filter: blur(0px)` permanecer gravado inline no DOM impede o motor do navegador de desligar a aceleração de filtro da GPU.

---

## 3. MAPEAMENTO DE RISCO NO CÓDIGO (TODAS AS OCORRÊNCIAS DE `blur-fade`)

Realizamos auditoria global via `git grep "blur-fade" src/` para mapear todos os pontos suscetíveis a este comportamento:

| Arquivo | Linha | Alvo do Envelope | Nível de Risco | Diagnóstico |
|---|---|---|---|---|
| `src/sections/ChronologySection.tsx` | **L. 105** | **Container Pai Inteiro (Header + Grid 3D de Cards)** | **CRÍTICO (P0)** | **Ponto exato do bug.** Envelope gigante contendo nós interativos filhos complexos. |
| `src/sections/ChronologySection.tsx` | L. 26 | Cabeçalho "PROJETOS NUCLEARES" | Baixo | Texto folha isolado (sem nós 3D filhos). |
| `src/sections/HeroSection.tsx` | L. 69 | Título Display "THIAGO IBRAHIM" | Baixo | Texto folha isolado. |
| `src/sections/ToolboxSection.tsx` | L. 35 | Cabeçalho "ARSENAL DE COMBATE" | Baixo | Texto folha isolado. |
| `src/sections/PrinciplesSection.tsx` | L. 16 | Cabeçalho "PRINCÍPIOS DE CONSTRUÇÃO" | Baixo | Texto folha isolado. |
| `src/sections/JournalSection.tsx` | L. 13 | Cabeçalho "JORNADA & DIÁRIO DE BORDO" | Baixo | Texto folha isolado. |

---

## 4. PLANO DE REMEDIAÇÃO PRESCRETO PARA PETER PARKER (FRONTEND)

Para eliminar definitivamente o bug de desfoque sem alterar a identidade visual nem quebrar animações aprovadas, prescrevemos 2 intervenções cirúrgicas:

### Ação 1: Desacoplar o `blur-fade` do Container de Cards em `src/sections/ChronologySection.tsx`
No trecho entre as linhas 104 e 132:
- **Remover** o `<RevealSection variant="blur-fade">` que envolve o container externo (`<div className="mt-20 pt-16 border-t border-zinc-800">`).
- **Aplicar** `<RevealSection variant="blur-fade" duration={0.6}>` **estritamente** ao bloco de texto do cabeçalho (linhas 107 a 120).
- Manter o grid de cards (`otherProjects.map`) livre de qualquer filtro CSS de container pai, permitindo que cada card execute apenas seu próprio `variant="card-expand"` nativo sem herdar camadas de blur de nós ascendentes.

```tsx
// ANTES (BUG):
<RevealSection variant="blur-fade" delay={0.15} duration={0.9}>
  <div className="mt-20 pt-16 border-t border-zinc-800">
    <div>... cabeçalho ...</div>
    <div className="grid md:grid-cols-3 gap-8">
      {otherProjects.map(...)}
    </div>
  </div>
</RevealSection>

// DEPOIS (CORRIGIDO & BLINDADO):
<div className="mt-20 pt-16 border-t border-zinc-800">
  <RevealSection variant="blur-fade" duration={0.5}>
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-zinc-800/80">
      <div>
        <span className="font-handwriting text-[#fbbf24] text-xl block mb-1 select-none">
          {"// obras complementares & experimentos auditados"}
        </span>
        <h3 className="font-display text-3xl md:text-4xl text-white tracking-tight">
          PROJETOS DE SUPORTE & LABORATÓRIO
        </h3>
      </div>
      <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{otherProjects.length} REPOSITÓRIOS AUDITADOS</span>
      </div>
    </div>
  </RevealSection>

  {/* Grid isolado de qualquer filter: blur ancestral */}
  <div className="grid md:grid-cols-3 gap-8">
    {otherProjects.map((p, idx) => (
      <RevealSection key={p.id} delay={0.08 + 0.12 * idx} variant="card-expand" duration={0.6}>
        <ProjectStreetCard project={p} onSelect={setSelectedProject} />
      </RevealSection>
    ))}
  </div>
</div>
```

---

### Ação 2: Sanitização da Variante `blur-fade` em `src/components/effects/RevealSection.tsx`
No arquivo `src/components/effects/RevealSection.tsx` (linhas 27 a 32):
- Trocar `filter: "blur(0px)"` por `filter: "none"` no estado `visible`.
- Ajustar a duração padrão para evitar tempos mortos de interpolação perceptíveis.

```tsx
// ANTES:
"blur-fade": {
  hidden: { opacity: 0, filter: "blur(6px)", y: 28 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
},

// DEPOIS (Limpa completamente o layer de compositing da GPU ao terminar):
"blur-fade": {
  hidden: { opacity: 0, filter: "blur(6px)", y: 20 },
  visible: { opacity: 1, filter: "none", y: 0 },
},
```

---

## 5. CRITÉRIOS DE ACEITAÇÃO PARA HOMOLOGAÇÃO
1. **Zero Filtros Ativos no Grid de Projetos:** Ao inspecionar o container dos cards secundários, a propriedade computada `filter` deve ser obrigatoriamente `none`.
2. **Nitidez Instantânea no Scroll:** Rolar em qualquer velocidade para `#projetos` ou abrir via hash `#projetos` deve exibir o texto dos cards perfeitamente nítido sem atrasos perceptíveis.
3. **Respeito a `prefers-reduced-motion`:** Usuários com redução de movimento ativada devem receber `filter: "none"` e `opacity: 1` instantaneamente.
4. **Build & CI Verificados:** `npm run build` deve compilar com 0 erros de TypeScript e 0 avisos de lint.
