from __future__ import annotations

import base64
import io
import textwrap
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Dict

from PIL import Image, ImageColor, ImageDraw, ImageFont
from zipfile import ZipFile

from ..schemas import CopyPayload, ReferenceInsights, StyleOptions, CopySlide

ASSETS_DIR = Path(__file__).resolve().parent.parent / "assets"
FONTS_DIR = ASSETS_DIR / "fonts"
W, H = 1080, 1350

@dataclass
class GenerationResult:
    files: List[str]
    zip_name: Optional[str]

# Utilities
def _load_font(weight: str, size: int) -> ImageFont.FreeTypeFont:
    font_path = FONTS_DIR / f"Montserrat-{weight}.ttf"
    if font_path.exists():
        return ImageFont.truetype(str(font_path), size=size)
    return ImageFont.load_default()

def _load_base64_image(b64: str) -> Image.Image:
    if "," in b64:
        b64 = b64.split(",")[1]
    bg_bytes = base64.b64decode(b64)
    return Image.open(io.BytesIO(bg_bytes)).convert("RGB")

def load_cover(img: Image.Image, target_w: int, target_h: int) -> Image.Image:
    # Cover crop (preenche sem distorcer)
    scale = max(target_w / img.width, target_h / img.height)
    new_w = int(img.width * scale)
    new_h = int(img.height * scale)
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = (img.width - target_w) // 2
    top = (img.height - target_h) // 2
    return img.crop((left, top, left + target_w, top + target_h))

def add_gradient_overlay(base_img: Image.Image, start_y: int, height: int, target_color: tuple, power: float = 1.5) -> Image.Image:
    gradient = Image.new("RGBA", (base_img.width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(gradient)
    for i in range(height):
        alpha = int(255 * ((i / height) ** power))
        draw.line([(0, i), (base_img.width, i)], fill=(*target_color, alpha))
    temp = base_img.convert("RGBA")
    temp.paste(gradient, (0, start_y), gradient)
    return temp.convert("RGB")

def draw_underline(draw: ImageDraw.ImageDraw, x: int, y: int, width: int, color: tuple, thickness: int = 4):
    draw.rectangle([x, y, x + width, y + thickness], fill=color)

def add_header(draw: ImageDraw.ImageDraw, left_text: str, right_text: str, dark: bool):
    color = "#9A9A9A" if dark else "#646464"
    f = _load_font("Regular", 17)
    draw.text((50, 35), left_text, fill=color, font=f)
    tw = draw.textlength(right_text, font=f)
    draw.text((W - 50 - tw, 35), right_text, fill=color, font=f)

def _wrap_text(text: str, font: ImageFont.ImageFont, max_width: int) -> List[str]:
    lines = []
    for p in text.split("\n"):
        words = p.split()
        if not words:
            lines.append("")
            continue
        curr_line = words[0]
        for word in words[1:]:
            if font.getlength(curr_line + " " + word) <= max_width:
                curr_line += " " + word
            else:
                lines.append(curr_line)
                curr_line = word
        lines.append(curr_line)
    return lines

def _draw_rich_text(draw: ImageDraw.ImageDraw, txt: str, pos: tuple[int, int], font: ImageFont.ImageFont, base_color: str, accent_word: Optional[str], accent_color: str):
    x, y = pos
    if not accent_word or accent_word not in txt:
        draw.text((x, y), txt, font=font, fill=base_color)
        return
    
    parts = txt.split(accent_word)
    for i, part in enumerate(parts):
        if part:
            draw.text((x, y), part, font=font, fill=base_color)
            x += draw.textlength(part, font=font)
        if i < len(parts) - 1:
            draw.text((x, y), accent_word, font=font, fill=accent_color)
            x += draw.textlength(accent_word, font=font)

def _render_slide(
    slide: CopySlide,
    slide_index: int,
    output_path: Path,
    style: StyleOptions,
    reference: Optional[ReferenceInsights],
    custom_bg_dict: dict[int, str],
):
    dark = slide.background_type == "dark"
    bg_color = style.background if dark else "#F5F2EB" 
    text_color = style.text if dark else "#0A0A0A"
    mid_text_color = "#9A9A9A" if dark else "#646464"
    accent_color = style.accent

    img = Image.new("RGB", (W, H), color=bg_color)
    draw = ImageDraw.Draw(img)

    # REGRAS 2 e 3: Accent Top e Header
    draw.rectangle([0, 0, W, 5], fill=accent_color)
    add_header(draw, "Powered by GEN.IA", "@genia_creators", dark)

    current_y = 120
    padding = 60
    
    # Optional image cover processing (Nano Banana or user upload)
    bg_b64 = custom_bg_dict.get(slide_index) or custom_bg_dict.get(str(slide_index))
    if bg_b64:
        try:
            user_img = _load_base64_image(bg_b64)
            if slide.image_position == "topo":
                # Cover top 65%
                target_h = int(H * 0.65)
                cover = load_cover(user_img, W, target_h)
                img.paste(cover, (0, 0))
                # Add gradient overlay for transition
                img = add_gradient_overlay(img, target_h - 300, 300, ImageColor.getrgb(bg_color))
                draw = ImageDraw.Draw(img)
                # Re-draw accent and header over image
                draw.rectangle([0, 0, W, 5], fill=accent_color)
                add_header(draw, "Powered by GEN.IA", "@genia_creators", True) # Dark header mode on photo
                current_y = target_h + 30
            else:
                # Default full background with dark overlay for readability
                cover = load_cover(user_img, W, H)
                img.paste(cover, (0, 0))
                overlay = Image.new("RGBA", (W, H), (0, 0, 0, 180))
                img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
                draw = ImageDraw.Draw(img)
                draw.rectangle([0, 0, W, 5], fill=accent_color)
                add_header(draw, "Powered by GEN.IA", "@genia_creators", dark=True)
                text_color = "#FFFFFF"
                mid_text_color = "#D1D1D1"
        except Exception as e:
            print(f"Erro renderizando bg para slide {slide_index}: {str(e)}")

    # Font handling
    title_font = _load_font("Bold", 58) 
    body_font = _load_font("Regular", 28)
    
    # 1. Rendering Headline
    if slide.headline:
        max_w = W - (padding * 2)
        lines = _wrap_text(slide.headline, title_font, max_w)
        for line in lines:
            _draw_rich_text(draw, line, (padding, current_y), title_font, text_color, slide.highlight_word, accent_color)
            current_y += 66
        current_y += 40

    # 2. Rendering Body (with Seta support for lists)
    if slide.body:
        max_w = W - (padding * 2)
        lines = _wrap_text(slide.body, body_font, max_w)
        for line in lines:
            line_txt = line
            if line_txt.startswith("- "):
                line_txt = "→ " + line_txt[2:]
            draw.text((padding, current_y), line_txt, font=body_font, fill=mid_text_color)
            current_y += 40
        current_y += 40

    # 3. Highlight Phrase Underline
    if slide.highlight_phrase:
         hl_font = _load_font("Bold", 28)
         draw.text((padding, current_y), slide.highlight_phrase, font=hl_font, fill=text_color)
         tw = draw.textlength(slide.highlight_phrase, font=hl_font)
         draw_underline(draw, padding, current_y + 36, int(tw), ImageColor.getrgb(accent_color), thickness=4)
         current_y += 60

    # 4. Zero Espaço Morto Rule: Footer filling
    if slide.footer_block:
        rem_height = H - current_y
        if rem_height > 120:
            f_color = "#151515" if dark else "#EAEAEA"
            draw.rectangle([0, current_y, W, H], fill=f_color)
            draw.rectangle([0, current_y, W, current_y+4], fill=accent_color)
            f_font = _load_font("Regular", 24)
            lines = _wrap_text(slide.footer_block, f_font, W - padding * 2)
            cy = current_y + 45
            for line in lines:
                draw.text((padding, cy), line, font=f_font, fill=text_color)
                cy += 35

    img.save(output_path, format="PNG", optimize=True)


def generate_carousel(
    copy_payload: CopyPayload,
    style: Optional[StyleOptions],
    reference: Optional[ReferenceInsights],
    custom_backgrounds: Optional[dict[int, str]],
    output_dir: Path,
) -> GenerationResult:
    if not copy_payload.slides:
        raise ValueError("Nenhum slide fornecido para geração de imagens")

    style = style or StyleOptions()
    output_dir.mkdir(parents=True, exist_ok=True)
    custom_bg_dict = custom_backgrounds or {}

    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    base_name = f"carousel_{timestamp}"

    files: List[str] = []
    for idx, slide in enumerate(copy_payload.slides):
        filename = f"{base_name}_s{idx + 1}.png"
        output_path = output_dir / filename
        _render_slide(slide, idx, output_path, style, reference, custom_bg_dict)
        files.append(filename)

    zip_name = f"{base_name}.zip"
    zip_path = output_dir / zip_name
    with ZipFile(zip_path, "w") as zipf:
        for filename in files:
            zipf.write(output_dir / filename, arcname=filename)

    return GenerationResult(files=files, zip_name=zip_name)
