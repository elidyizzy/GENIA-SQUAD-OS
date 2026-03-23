# GEN.IA CREATORS — Especificação Completa do Sistema (Plano Setorial)

## Overview
Reestruturação e validação completa do sistema GEN.IA CREATORS para garantir total aderência à arquitetura de 4 fases definida (Upload, Briefing, Copy, Imagens). O foco é assegurar que o fluxo no Frontend (React) e Backend (FastAPI + Pillow) esteja 100% alinhado com as lógicas avançadas de design e interações com IA detalhadas na Especificação Master.

## Project Type
WEB / BACKEND

## Success Criteria
- [ ] Fase 1 (Upload) extrai e renderiza fielmente a análise visual (grid, cores, tipografia).
- [ ] Fase 2 (Briefing) coleta todos os campos exigidos (Sobre, Estrutura, Imagens do Usuário, Branding com Handle e Tagline, Estética).
- [ ] Fase 3 (Copy) permite edição slide a slide, mapeamento de imagens e aprovação de destaques.
- [ ] Fase 4 (Imagens) gera os PNGs via Pillow seguindo rigorosamente as 10 REGRAS VISUAIS (Zero Espaço Morto, Header, Linha Accent, Padrão Capa/Screenshot, Overlay Dinâmico).
- [ ] Persistência segura de estados entre fases e navegação via Sidebar (Dashboard, Setup, Histórico).

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, Axios, Lucide React (Ícones).
- **Backend**: Python (FastAPI), Pillow (Geração de Imagens), SDK do Claude/Anthropic (Análise e Copy).
- **IA Generativa**: Claude 3 Opus/Sonnet para Visão e Texto; Imagen 3 (Opcional/Integrado) para geração de cenas de fundo.

## File Structure (Alvos Principais)
- `frontend/src/App.jsx` (Refatoração do roteamento de fases e formulários de Briefing/Copy)
- `backend/app/services/claude.py` (Ajuste dos prompts da Fase 1 e Fase 3 para saída JSON exato)
- `backend/app/services/image_generator.py` (Refatoração massiva para as 10 Regras Visuais em Pillow)
- `backend/app/schemas.py` (Modelo de dados atualizado para suportar todo o fluxo da Fase 2 e 3)

## Task Breakdown

### TASK 1: Revisão da Fase 1 e Fase 2 (Frontend & Schemas)
- **Agent:** frontend-specialist / backend-specialist
- **Skill:** react-components, pydantic
- **INPUT:** App.jsx e schemas.py atuais.
- **OUTPUT:** UI da Fase 2 atualizada com blocos de Branding, Estrutura e Imagens. Integração do painel lateral de Insights Visuais.
- **VERIFY:** Formulário de briefing renderiza todos os novos drop-downs e caixas de texto exigidas pela especificação.

### TASK 2: Revisão da Fase 3 (Motor de Copy e Prompts)
- **Agent:** backend-specialist
- **Skill:** prompt-engineering
- **INPUT:** claude.py
- **OUTPUT:** Prompts ajustados para cuspir a estrutura narrativa exata e demarcar palavras de [DESTAQUE] e underlines.
- **VERIFY:** O JSON gerado pela IA mapeia diretamente para o modelo `CopySlide` (tipo de fundo, posicao_imagem, bloco_rodape).

### TASK 3: Refatoração do Motor Pillow (As 10 Regras de Ouro)
- **Agent:** backend-specialist
- **Skill:** image-processing
- **INPUT:** image_generator.py
- **OUTPUT:** Funções utilitárias nativas implementadas (`load_cover`, `add_gradient_overlay`, `add_screenshot`, `fill_bottom_block`) e aplicação irrestrita das 10 regras.
- **VERIFY:** Os PNGs gerados a partir do fluxo não devem conter margens vazias, alternam Dark/Light corretamente e têm overlay de gradiente limpo.

### TASK 4: Integração de UI Restante (Pipeline e Dashboard)
- **Agent:** frontend-specialist
- **Skill:** layout
- **INPUT:** Frontend
- **OUTPUT:** Sidebar implementada, Painel de Contexto dinâmico e botões de re-download no Histórico.
- **VERIFY:** Usuário consegue transitar pelas 4 fases visualizando o status na Sidebar adequadamente.

## ✅ PHASE X Verification (Status)
- Lint & Component Check: [ ] Pending
- Visual Pillow Check (As 10 Regras): [ ] Pending
- End-to-End Flow: [ ] Pending
- Date: 2026-03-12
