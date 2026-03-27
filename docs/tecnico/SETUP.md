# SETUP — Guia de Configuração do Ambiente
> Responsável: @dev (Neo) | Última atualização: 2026-03-27

---

## Pré-requisitos

```bash
# Verificar versões necessárias
node --version  # >= 18.x
npm --version   # >= 9.x
```

## Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/elidyizzy/[repositorio]
cd [repositorio]

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais (ver VARIAVEIS-AMBIENTE.md)

# 4. Iniciar em desenvolvimento
npm run dev
```

## GEN.IA OS — Setup dos Agentes

```bash
# Verificar agentes instalados corretamente
grep -i "cypher\|neo\|tank\|trinity" .claude/CLAUDE.md

# Se não retornar — reinstalar do repositório oficial
git clone https://github.com/elidyizzy/GENIA-SQUAD-OS temp-genia-os
cp -r temp-genia-os/.claude .claude
cp -r temp-genia-os/.genia .genia
cp -r temp-genia-os/.synapse .synapse
rm -rf temp-genia-os
```

## Resolução de Problemas Comuns

> _[Preencher com os problemas mais frequentes no setup]_

---

_Responsável: @dev (Neo) | Deploy: ver DEPLOY.md_
