from __future__ import annotations

from typing import List, Optional, Any, Dict

from pydantic import BaseModel, Field


class ReferenceInsights(BaseModel):
    summary: str = Field(..., description="Resumo da imagem de referência")
    palette: List[str] = Field(default_factory=list, description="Paleta de cores hex extraída da imagem")
    typography: List[str] = Field(default_factory=list, description="Sugestões de fontes / peso")
    layout_notes: Optional[str] = Field(
        None, description="Observações sobre composição, enquadramento e elementos gráficos"
    )
    mood: Optional[str] = Field(None, description="Tom emocional percebido")
    aspect_ratio: str = Field(default="1080x1350", description="Resolução alvo para os slides")
    raw_analysis: Optional[Dict[str, Any]] = Field(None, description="Análise bruta completa do Claude")


class Briefing(BaseModel):
    theme: str = Field(..., description="Sobre o que é o carrossel?")
    hook: str = Field(..., description="Mensagem central / hook que para o scroll")
    tone: str = Field(..., description="Tom (Provocativo, Educativo, etc)")
    slide_count: int = Field(default=8, ge=4, le=12, description="Quantos slides?")
    narrative_structure: str = Field(..., description="Estrutura narrativa selecionada")
    
    # Branding
    handle: str = Field(..., description="@handle do Instagram")
    name: Optional[str] = Field(None, description="Nome completo")
    title: Optional[str] = Field(None, description="Título profissional")
    tagline: Optional[str] = Field(None, description="Tagline / assinatura")
    header_left: Optional[str] = Field(default="Powered by GEN.IA", description="Header esquerdo")
    
    # Imagens do usuário para referenciar
    user_images: Optional[List[Dict[str, str]]] = Field(
        default_factory=list, description="Lista de imagens enviadas com labels"
    )
    
    extra_instructions: Optional[str] = Field(None, description="Instruções adicionais de ajuste de IA")


class CopySlide(BaseModel):
    slide_number: int
    background_type: str = Field(..., description="'dark' ou 'light'")
    headline: str
    highlight_word: Optional[str] = Field(None, description="Palavra p/ destaque na headline")
    body: str
    highlight_phrase: Optional[str] = Field(None, description="Frase com underline (Destaque)")
    image_ref: Optional[str] = Field(None, description="Label da imagem do usuário")
    image_position: Optional[str] = Field(None, description="'topo', 'centro', 'fundo', 'full-background'")
    footer_block: Optional[str] = Field(None, description="Texto para bloco de preenchimento de rodapé")
    notes: Optional[str] = Field(None, description="Instruções visuais específicas")


class CopyPayload(BaseModel):
    slides: List[CopySlide]


class CopyRequest(BaseModel):
    briefing: Briefing
    reference_insights: Optional[ReferenceInsights] = None


class ApproveRequest(BaseModel):
    copy: CopyPayload
    approved_by: Optional[str] = None


class StyleOptions(BaseModel):
    primary: str = "#0f172a"
    secondary: str = "#0ea5e9"
    accent: str = "#f97316"
    background: str = "#0A0A0A"
    text: str = "#FFFFFF"
    use_gradient: bool = True
    include_grid: bool = False
    include_logo: bool = True
    custom_backgrounds: Optional[Dict[str, str]] = Field(
        default_factory=dict, description="Mapeamento de background base64"
    )


class ImageSlide(BaseModel):
    index: int
    filename: str
    url: str


class ImageGenerationRequest(BaseModel):
    copy: CopyPayload
    style: Optional[StyleOptions] = Field(default_factory=StyleOptions)
    reference_insights: Optional[ReferenceInsights] = None


class ImageGenerationResponse(BaseModel):
    slides: List[ImageSlide]
    zip_url: Optional[str] = None


class ImagePromptRequest(BaseModel):
    prompt: str

