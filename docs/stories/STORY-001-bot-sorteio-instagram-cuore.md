# STORY-001 — Bot Sorteio Instagram Cuore

**Status:** Ready
**Agente:** @dev
**Criado:** 2026-03-12
**Atualizado:** 2026-03-12
**Estimativa:** G
**Épico:** EP-001 — Automação de Sorteio Instagram

---

## Descrição

Como Elidy (@cuoreterapiaverde), quero um bot que leia automaticamente os comentários "EU QUERO" do post de sorteio e envie um número de participação para cada pessoa, para que eu não precise fazer isso manualmente e nenhuma participante seja esquecida.

---

## Acceptance Criteria

- [ ] AC1: Bot lê comentários do post `DVmnOIrEWI7` e filtra os que contêm "EU QUERO" (case-insensitive)
- [ ] AC2: Cada @usuario único recebe um número sequencial (começa em 1), sem duplicatas
- [ ] AC3: Participante recebe notificação com seu número (via DM ou resposta no comentário, configurável via `.env`)
- [ ] AC4: Dados de participantes persistem em `data/participantes.json` entre reinicializações
- [ ] AC5: Notificação é enviada apenas 1x por participante (flag `dm_enviada`)
- [ ] AC6: Bot roda em loop a cada 1 hora sem intervenção manual
- [ ] AC7: Log de auditoria em `data/log.jsonl` registra todos os eventos
- [ ] AC8: Script detecta token expirado e avisa no console com instruções
- [ ] AC9: Arquivo `.env.example` documenta todas as variáveis necessárias
- [ ] AC10: `SETUP-META-API.md` contém passo-a-passo completo para configurar a API

---

## Tasks Técnicas

- [ ] T1: Criar `src/instagram_client.py` — wrapper Graph API (get_media_id, get_comments, reply_comment, send_dm)
- [ ] T2: Criar `src/sorteio_manager.py` — lógica de participantes (carregar, salvar, atribuir número, idempotência)
- [ ] T3: Criar `src/dm_sender.py` — orquestra envio (DM ou comentário conforme MODO_ENVIO)
- [ ] T4: Criar `src/scheduler.py` — loop 1h com tratamento de erros
- [ ] T5: Criar `main.py` — entry point com validação de .env
- [ ] T6: Criar `config.py` — carrega e valida variáveis de ambiente
- [ ] T7: Criar `requirements.txt` e `.env.example`
- [ ] T8: Criar `docs/SETUP-META-API.md` — guia completo Meta Developer
- [ ] T9: Criar `tests/test_sorteio.py` — testes unitários do sorteio_manager
- [ ] T10: Criar `.gitignore` (excluir `.env`, `data/`, `__pycache__`)

---

## Branch

`feat/STORY-001-bot-sorteio-instagram-cuore`

## Arquivos Envolvidos

- `Apps/instagram Cuore/src/instagram_client.py` (criar)
- `Apps/instagram Cuore/src/sorteio_manager.py` (criar)
- `Apps/instagram Cuore/src/dm_sender.py` (criar)
- `Apps/instagram Cuore/src/scheduler.py` (criar)
- `Apps/instagram Cuore/main.py` (criar)
- `Apps/instagram Cuore/config.py` (criar)
- `Apps/instagram Cuore/requirements.txt` (criar)
- `Apps/instagram Cuore/.env.example` (criar)
- `Apps/instagram Cuore/.gitignore` (criar)
- `Apps/instagram Cuore/docs/SETUP-META-API.md` (criar)
- `Apps/instagram Cuore/tests/test_sorteio.py` (criar)

## Dependências

- Nenhuma story anterior

## Riscos

- Permissão `instagram_manage_messages` requer revisão da Meta (pode levar dias)
- Mitigação: usar modo `comentario` como fallback até aprovação
- Token expira em 60 dias — usuária precisa renovar manualmente

---

## Validação @po (Oracle)

**Checklist 10/10 ✅**
- [x] Título claro e acionável
- [x] Formato Como/quero/para
- [x] 10 Acceptance Criteria definidos
- [x] 10 Tasks técnicas listadas
- [x] Dependências mapeadas (nenhuma)
- [x] Estimativa G definida
- [x] Branch definida
- [x] Arquivos listados
- [x] Testes identificados (T9)
- [x] Riscos documentados

**Status: APROVADA para desenvolvimento ✅**
