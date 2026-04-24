# Cuore Kokedamas — Design System

## Sobre a marca

**Cuore Kokedamas** é uma marca artesanal de kokedamas — a arte botânica japonesa de cultivar plantas em esferas de musgo. "Cuore" (coração em italiano) reflete o cuidado e carinho investido em cada peça.

**Personalidade:** Boho, natural, acolhedora
**Clima visual:** Cottage garden — aconchego e nostalgia
**Público:** Amantes de plantas e jardinagem, entusiastas de decoração de interiores
**Canais:** Instagram, WhatsApp Business, Site/Landing page, Cartão de visita, Feiras e eventos, Embalagens e tags

---

## CONTENT FUNDAMENTALS

### Tom de voz
- **Acolhedor e gentil** — como uma conversa entre amigas no jardim
- **Poético mas acessível** — referências à natureza sem ser técnico demais
- Uso de "você" (informal, próximo)
- Frases curtas e evocativas
- Sem emoji excessivo — apenas 🌿 🪴 💚 quando apropriado em redes sociais
- Casing: minúsculo para textos em redes sociais, title case para títulos formais

### Exemplos de copy
- "cada kokedama é um pequeno jardim suspenso, feito com carinho"
- "natureza que cabe na palma da mão"
- "traga o verde para dentro de casa"
- "feito à mão, com amor e musgo"

---

## VISUAL FOUNDATIONS

### Cores
- **Primária:** Verde musgo (`#3B5A2B` a `#5A8544`) — extraído diretamente do logo
- **Secundária:** Terracota (`#C45D33`) — terra, barro, raízes, aconchego
- **Neutros:** Areia/linho (`#F7F5F2` a `#2C2520`) — tons terrosos e quentes
- **Accent:** Dourado seco (`#B8963E`) — para detalhes premium e destaques
- **Background principal:** Off-white quente (`#FDFBF8`)

### Tipografia
- **Display/Títulos:** Cormorant Garamond — serifada elegante com personalidade orgânica. Pesos 400-700, inclusive itálico.
- **Corpo:** DM Sans — sans-serif limpa e amigável, excelente legibilidade. Pesos 400-700.
- **Combinação:** serifada para títulos traz sofisticação; sans para corpo garante leitura fácil. Perfeito para o posicionamento "artesanal mas cuidadoso".

### Backgrounds
- Predominância de fundos claros e quentes (off-white, creme, areia)
- Uso de verde musgo como fundo em seções de destaque
- Sem gradientes agressivos — se usado, gradientes muito sutis entre tons de areia
- Texturas: papel kraft, linho ou musgo como texturas sutis de fundo (opacidade baixa)
- Sem padrões repetitivos complexos

### Bordas e cantos
- Cantos suavemente arredondados (8-12px) — evita tanto o quadrado duro quanto o ultra-redondo
- Bordas finas e discretas (`1px solid` em tons de areia)
- Cards com sombra suave e quente (sem sombras azuladas)

### Espaçamento
- Generoso — a marca respira. Bastante espaço em branco.
- Escala de 4px (4, 8, 12, 16, 24, 32, 48, 64, 80)
- Margens internas de cards: 24-32px
- Gap entre cards: 16-24px

### Animações e interações
- Transições suaves e lentas (250-400ms) — nada abrupto
- Easing: ease-out natural
- Hover: leve elevação da sombra + escala sutil (1.02)
- Press: sem shrink — apenas cor levemente mais escura
- Sem bounces ou animações chamativas

### Fotografia
- Luz natural, fundo neutro
- Tons quentes e orgânicos
- Sem filtros pesados — edição sutil
- Foco na textura do musgo e detalhes das plantas

### Iconografia
- Estilo line art / traço fino, consistente com o estilo do logo
- Sem ícones preenchidos pesados
- Sugestão: Lucide Icons (traço fino, orgânico)
- CDN: `https://unpkg.com/lucide-static@latest/font/lucide.css`
- Sem emoji em interfaces formais (site, cartão, embalagem)

---

## Arquivos disponíveis

| Arquivo | Descrição |
|---------|-----------|
| `colors_and_type.css` | Tokens CSS (cores, tipo, espaçamento, sombras) |
| `assets/logo-principal.jpeg` | Logo principal (branco sobre verde) |
| `preview/` | Cards visuais do design system |
| `ui_kits/core/` | Componentes UI reutilizáveis |
| `SKILL.md` | Instruções para uso como Agent Skill |
