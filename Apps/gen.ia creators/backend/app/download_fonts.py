from pathlib import Path

import requests

BASE = "https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf"
FONT_URLS = {
    "Regular": f"{BASE}/Montserrat-Regular.ttf",
    "SemiBold": f"{BASE}/Montserrat-SemiBold.ttf",
    "Bold": f"{BASE}/Montserrat-Bold.ttf",
}


def download_fonts():
    fonts_dir = Path(__file__).resolve().parent / "assets" / "fonts"
    fonts_dir.mkdir(parents=True, exist_ok=True)

    for weight, url in FONT_URLS.items():
        target = fonts_dir / f"Montserrat-{weight}.ttf"
        if target.exists():
            continue
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        target.write_bytes(resp.content)
        print(f"Baixado: {target.name}")


if __name__ == "__main__":
    download_fonts()
    print("Fontes prontas.")

