import os
from pathlib import Path
from typing import List

from dotenv import load_dotenv

# Carrega .env do diretório raiz do projeto (gen.ia creators/)
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
load_dotenv(_PROJECT_ROOT / ".env")
# Fallback: tenta também no diretório backend/
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .schemas import (
    ApproveRequest,
    CopyPayload,
    CopyRequest,
    ImageGenerationRequest,
    ImageGenerationResponse,
    ImagePromptRequest,
    ImageSlide,
    ReferenceInsights,
)
from .services import claude, image_generator

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="GEN.IA Creators API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/outputs", StaticFiles(directory=str(OUTPUT_DIR)), name="outputs")


@app.get("/health")
async def healthcheck():
    return {
        "status": "ok",
        "anthropic_configured": bool(os.getenv("ANTHROPIC_API_KEY")),
        "output_dir": str(OUTPUT_DIR),
    }


@app.post("/api/vision/analyze", response_model=ReferenceInsights)
async def analyze_reference(images: List[UploadFile] = File(...)):
    """
    Aceita 1 a 10 imagens e consolida insights visuais em um único objeto.
    """
    try:
        return await claude.analyze_reference_images(images)
    except claude.AnthropicUnavailable as exc:  # type: ignore[attr-defined]
        raise HTTPException(status_code=503, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:  # pragma: no cover - fallback
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/copy/generate", response_model=CopyPayload)
async def generate_copy(payload: CopyRequest):
    try:
        return await claude.generate_copy(payload)
    except claude.AnthropicUnavailable as exc:  # type: ignore[attr-defined]
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/copy/approve")
async def approve_copy(payload: ApproveRequest):
    return {
        "status": "approved",
        "slides": len(payload.copy.slides),
        "approved_by": payload.approved_by or "anonymous",
    }


@app.post("/api/images/generate", response_model=ImageGenerationResponse)
async def generate_images(payload: ImageGenerationRequest):
    try:
        result = image_generator.generate_carousel(
            copy_payload=payload.copy,
            style=payload.style,
            reference=payload.reference_insights,
            custom_backgrounds=payload.style.custom_backgrounds if payload.style else None,
            output_dir=OUTPUT_DIR,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    slides: List[ImageSlide] = [
        ImageSlide(index=i, filename=filename, url=f"/outputs/{filename}")
        for i, filename in enumerate(result.files)
    ]

    return ImageGenerationResponse(slides=slides, zip_url=f"/outputs/{result.zip_name}" if result.zip_name else None)


@app.post("/api/images/generate-ai")
async def generate_ai_image(payload: ImagePromptRequest):
    import base64
    from io import BytesIO
    from PIL import Image, ImageDraw
    
    # Placeholder para a integração com Imagen 3
    img = Image.new('RGB', (1080, 1350), color=(25, 25, 25))
    draw = ImageDraw.Draw(img)
    draw.text((100, 600), f"IMAGEN 3 MOCK:\n{payload.prompt}", fill=(255, 255, 255))
    
    buffered = BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return {"base64": img_str}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

