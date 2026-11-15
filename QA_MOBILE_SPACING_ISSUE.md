# APONTAMENTO DE QA: DENSIDADE & ESPAÇAMENTO EXCESSIVO MOBILE
**Documento:** QA-ISSUE-2026-MOBILE-SPACING  
**De:** Steve Rogers (QA Engineer)  
**Para:** Big Boss (CEO) / Cópia: Tony Stark (Tech Lead), Peter Parker (Frontend)  
**Projeto:** Portfólio de Engenharia Thiago Ibrahim (Street-Tech)  
**Origem do Chamado:** Vistoria direta do Fundador (Thiago Ibrahim) com capturas de tela  

---

## 1. DIAGNÓSTICO DO FUNDADOR & EVIDÊNCIAS
O fundador inspecionou a versão mobile e apontou:
> *"Só tem muitos espaços vazios, e estão muito distantes, manda pro boss"*

Nas capturas enviadas pelo fundador:
1. **Entre o Manifesto do Construtor e Projetos:** Um grande bloco de espaço negro vazio empurra o título `// 4 obras reais de engenharia` e `PROJETOS NUCLEARES` para longe do conteúdo do Hero.
2. **Entre a Jornada e Princípios de Construção:** Um vão vertical vazio de quase 200px separa o final da timeline do título `PRINCÍPIOS DE CONSTRUÇÃO`, deixando a tela desconexa e vazia durante a rolagem.

---

## 2. CAUSA RAIZ TÉCNICA (CODE AUDIT)
O design atual utiliza classes de espaçamento estáticas pensadas para Desktop (`py-24` = 96px, `mb-16` = 64px) aplicadas diretamente no mobile:

| Componente | Linha | Classe Atual (Mobile) | Efeito Cumulativo no Mobile |
| :--- | :--- | :--- | :--- |
| **HeroSection.tsx** | L.27 | `pb-16` (64px) | Soma com o `py-24` de Projetos = **160px de vão vazio** |
| **ChronologySection.tsx** | L.19, L.23 | `py-24` (96px) + `mb-16` (64px) | **160px de padding** + **64px de margem** no título |
| **ToolboxSection.tsx** | L.29, L.32 | `py-24` (96px) + `mb-16` (64px) | **192px de gap** somado ao final de Projetos |
| **JournalSection.tsx** | L.7, L.10 | `py-24` (96px) + `mb-16` (64px) | **192px de gap** entre Arsenal e Jornada |
| **PrinciplesSection.tsx** | L.9, L.13 | `py-24` (96px) + `mb-16` (64px) | **192px de vão vazio** entre Jornada e Princípios |

Em uma tela de smartphone (altura típica de 667px a 844px), um vão de **192px a 256px** representa **25% a 35% de toda a viewport** composta exclusivamente por espaço preto vazio. Isso dilui a atitude densa e tática do estilo Street-Tech.

---

## 3. PLANO DE CORREÇÃO PARA PETER PARKER (FRONTEND)
Recomenda-se ajustar os tokens de espaçamento vertical com breakpoints responsivos (`py-10 sm:py-14 md:py-28` ou `py-12 md:py-32`), condensando a experiência mobile sem alterar o visual desktop:

1. **HeroSection.tsx (L.27 & L.154):**
   - Alterar `pb-16 md:py-28` para `pb-8 sm:pb-12 md:py-28`.
   - Reduzir a margem superior do Manifesto no mobile de `mt-16 sm:mt-12` para `mt-8 sm:mt-12`.
2. **ChronologySection.tsx (L.19 & L.23):**
   - Alterar `py-24 md:py-32` para `py-10 sm:py-14 md:py-32`.
   - Alterar `mb-16` do cabeçalho para `mb-8 sm:mb-12 md:mb-16`.
   - Reduzir `mb-16 md:mb-20` da figura do Canvas para `mb-8 md:mb-16`.
3. **ToolboxSection.tsx (L.29 & L.32):**
   - Alterar `py-24 md:py-32` para `py-10 sm:py-14 md:py-32`.
   - Alterar `mb-16` para `mb-8 sm:mb-12 md:mb-16`.
4. **JournalSection.tsx (L.7 & L.10):**
   - Alterar `py-24 md:py-32` para `py-10 sm:py-14 md:py-32`.
   - Alterar `mb-16` para `mb-8 sm:mb-12 md:mb-16`.
5. **PrinciplesSection.tsx (L.9 & L.13):**
   - Alterar `py-24 md:py-32` para `py-10 sm:py-14 md:py-32`.
   - Alterar `mb-16` para `mb-8 sm:mb-12 md:mb-16`.

---

## 4. IMPACTO ESPERADO
- Redução de **~50% a 60%** dos vãos vazios no mobile.
- Encaixe dinâmico e contínuo dos cartões na rolagem tátil.
- Visual desktop preservado a 100% sem nenhuma regressão.
