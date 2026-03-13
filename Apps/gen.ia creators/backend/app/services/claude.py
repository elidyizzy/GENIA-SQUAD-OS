import base64
import json
import os
from typing import Any, Dict, List

import anthropic
from fastapi import UploadFile

from ..schemas import CopyPayload, CopyRequest, ReferenceInsights, CopySlide

VISION_MODEL = os.getenv("ANTHROPIC_VISION_MODEL", "claude-3-haiku-20240307")
TEXT_MODEL = os.getenv("ANTHROPIC_TEXT_MODEL", "claude-3-haiku-20240307")


class AnthropicUnavailable(Exception):
    """Erro levantado quando a API não está configurada."""


def _client() -> anthropic.Anthropic:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise AnthropicUnavailable("Defina ANTHROPIC_API_KEY para usar os modelos da Anthropic")
    return anthropic.Anthropic(api_key=api_key)


def _parse_json_block(text: str) -> Dict[str, Any]:
    """Extrai o primeiro bloco JSON válido encontrado no texto."""
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("A resposta do modelo não contém JSON válido")
    snippet = text[start : end + 1]
    return json.loads(snippet)


def _mock_insights(num_images: int = 1) -> ReferenceInsights:
    return ReferenceInsights(
        summary=f"{num_images} imagem(ns) com composição clean, fundo claro, acento laranja e tipografia geométrica.",
        palette=["#0f172a", "#f97316", "#e2e8f0", "#ffffff"],
        typography=["Montserrat Bold", "Montserrat SemiBold", "Montserrat Regular"],
        layout_notes="Grid 3x3 com destaque para bloco de título central e ícones minimalistas.",
        mood="Confiante, ousado e direto",
        aspect_ratio="1080x1080",
    )


def _mock_copy(req: CopyRequest) -> CopyPayload:
    slide_count = req.briefing.slide_count or 5
    slides = []
    for i in range(slide_count):
        slides.append(
            CopySlide(
                slide_number=i+1,
                background_type="dark" if i % 2 == 0 else "light",
                headline=f"Slide {i+1}: {req.briefing.theme}",
                highlight_word="Slide",
                body=f"Este é um mock data para o slide {i+1} atendendo ao hook: {req.briefing.hook}.",
                highlight_phrase="Preste atenção nisso" if i == 0 else None,
                image_ref=None,
                image_position="centro" if i == 0 else None,
                footer_block="Tag de footer mock",
                notes="Notas do mock",
            )
        )
    return CopyPayload(slides=slides)


async def analyze_reference_images(images: List[UploadFile]) -> ReferenceInsights:
    if not images:
        raise ValueError("Envie pelo menos uma imagem de referência")
    if len(images) > 10:
        raise ValueError("Limite de 10 imagens por análise")

    files: List[tuple[str, str]] = []  # (media_type, base64)
    for img in images:
        data = await img.read()
        if not data:
            continue
        encoded = base64.b64encode(data).decode()
        media_type = img.content_type or "image/png"
        files.append((media_type, encoded))

    if not files:
        raise ValueError("Nenhuma imagem válida enviada")

    if os.getenv("MOCK_ANTHROPIC", "false").lower() == "true":
        return _mock_insights(len(files))

    client = _client()
    prompt = (
        "Você é um analista de design visual sênior. Receberá de 1 a 10 imagens de um carrossel do Instagram. "
        "Sua tarefa é extrair e detalhar ESTRUTURALMENTE as regras de design para replicá-las em código. "
        "Responda ESTRITAMENTE com um JSON contendo as chaves: summary (resumo em texto explícito do visual), "
        "palette (lista de strings hex), typography (lista strings de sugestão exata de fonte/peso), "
        "layout_notes (texto super detalhado com regras de header, margins, alternância dark/light, onde vão textos e imgs), "
        "mood, e aspect_ratio (ex: '1080x1350' ou '1080x1080')."
    )

    content_blocks: List[Dict[str, Any]] = [{"type": "text", "text": prompt}]
    for media_type, encoded in files:
        content_blocks.append(
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": media_type,
                    "data": encoded,
                },
            }
        )

    message = client.messages.create(
        model=VISION_MODEL,
        max_tokens=700,
        temperature=0.2,
        messages=[{"role": "user", "content": content_blocks}],
    )

    text_response = message.content[0].text if message.content else ""
    parsed = _parse_json_block(text_response)

    return ReferenceInsights(
        summary=parsed.get("summary", ""),
        palette=parsed.get("palette", []),
        typography=parsed.get("typography", []),
        layout_notes=parsed.get("layout_notes"),
        mood=parsed.get("mood"),
        aspect_ratio=parsed.get("aspect_ratio", "1080x1080"),
        raw_analysis=parsed,
    )


async def generate_copy(req: CopyRequest) -> CopyPayload:
    if os.getenv("MOCK_ANTHROPIC", "false").lower() == "true":
        return _mock_copy(req)

    client = _client()
    briefing = req.briefing
    insights = req.reference_insights

    prompt = f"""
    Você é um copywriter de Instagram especializado em carrosséis de alto impacto.

    CONTEXTO:
    - Análise visual da referência: {insights.dict() if insights else 'Nenhuma'}
    - Briefing do usuário: {briefing.dict()}
    - Número de slides: {briefing.slide_count}
    - Tom: {briefing.tone}
    - Estrutura: {briefing.narrative_structure}
    - Instruções adicionais de ajuste ou alteração: {briefing.extra_instructions if getattr(briefing, 'extra_instructions', None) else 'Nenhuma'}

    REGRAS DE COPY:
    1. Slide 1 (HOOK): Frase provocativa que para o scroll. Máximo 6-8 palavras por linha. Uma palavra-chave em DESTAQUE.
    2. Slide 2 (CONTEXTO): Expandir o hook. Estrutura A/B funciona bem (o que todo mundo faz vs o que eu fiz).
    3. Slides 3-5 (DESENVOLVIMENTO): Prova concreta. Se tiver screenshots, cada slide mostra uma feature. Headlines curtos + explicação em 2-3 linhas.
    4. Slide 6 (VIRADA): Elemento pessoal/emocional. Foto do usuário se disponível.
    5. Slide 7 (MENSAGEM): Frase de impacto + bio/sobre ou lista completa de features.
    6. Slide 8 (CTA): Call to action claro. Link, botão visual, frase de fechamento.

    FORMATO DE SAÍDA:
    A resposta deve ser ESTRITAMENTE um arquivo JSON com uma chave raiz `slides`, que é uma lista de objetos.
    Para cada slide, retornar EXATAMENTE as seguintes chaves (usar null se não houver preenchimento):
    - slide_number (int)
    - background_type: "dark" ou "light"
    - headline: texto principal do slide
    - highlight_word: a palavra que deve receber a cor de destaque (deve estar contida na headline exata, ou null)
    - body: texto secundário, frases curtas explicativas
    - highlight_phrase: frase com underline (se houver, ou null)
    - image_ref: label exato da imagem do usuário passada no briefing a ser usada (ou null)
    - image_position: "topo", "centro", "fundo", "full-background" (ou null)
    - footer_block: texto complementar curto para rodapé para não deixar buraco (ou null)
    - notes: instruções visuais específicas par ao módulo gerador (ou null)

    ESTILO:
    - Português brasileiro com acentuação correta
    - Tom: {briefing.tone}
    - Usar → (seta) para listas, nunca bullet points
    - Headlines: diretos, sem floreio
    - Corpo: frases curtas, uma ideia por linha
    """

    message = client.messages.create(
        model=TEXT_MODEL,
        max_tokens=2000,
        temperature=0.4,
        messages=[{"role": "user", "content": prompt}],
    )

    text_response = message.content[0].text if message.content else ""
    parsed = _parse_json_block(text_response)

    slides = []
    for idx, item in enumerate(parsed.get("slides", [])):
        slides.append(
            CopySlide(
                slide_number=item.get("slide_number") or (idx+1),
                background_type=item.get("background_type") or "dark",
                headline=item.get("headline") or "",
                highlight_word=item.get("highlight_word"),
                body=item.get("body") or "",
                highlight_phrase=item.get("highlight_phrase"),
                image_ref=item.get("image_ref"),
                image_position=item.get("image_position"),
                footer_block=item.get("footer_block"),
                notes=item.get("notes"),
            )
        )

    return CopyPayload(slides=slides)

