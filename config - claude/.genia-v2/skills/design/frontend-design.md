# Skill: /frontend-design

## Metadata
- **Nome**: Frontend Design
- **Comando**: /frontend-design
- **Agente**: @dev
- **Categoria**: design
- **Versao**: 2.0

## Descricao
Criar interfaces frontend distintivas e production-grade com alta qualidade de design. Gera codigo criativo e polido que evita estetica generica de IA.

## Quando Usar
- Construir componentes web
- Criar landing pages
- Desenvolver dashboards
- Criar componentes React
- Estilizar/embelezar qualquer UI web

## Design Thinking

Antes de codar, entender contexto e comprometer-se com direcao estetica BOLD:

### Proposito
O que este interface resolve? Quem usa?

### Tom (Escolher um extremo)
- Brutalmente minimal
- Maximalismo caotico
- Retro-futurista
- Organico/natural
- Luxo/refinado
- Playful/toy-like
- Editorial/magazine
- Brutalista/raw
- Art deco/geometrico
- Soft/pastel
- Industrial/utilitario

### Diferenciacao
O que torna isso INESQUECIVEL? Qual e a coisa que alguem vai lembrar?

## Diretrizes Esteticas

### Tipografia
- Escolher fontes BONITAS, UNICAS e INTERESSANTES
- EVITAR: Arial, Inter, Roboto, system fonts
- PREFERIR: Fonts distintivos que elevam a estetica
- Parear display font com body font refinado

### Cor e Tema
- Comprometer-se com estetica coesa
- Usar CSS variables para consistencia
- Cores dominantes com acentos fortes > paletas timidas

### Motion
- Usar animacoes para efeitos e micro-interacoes
- Priorizar CSS-only para HTML
- Usar Motion library para React
- Focus em momentos de alto impacto: page load com staggered reveals

### Composicao Espacial
- Layouts inesperados
- Assimetria
- Overlap
- Flow diagonal
- Elementos que quebram o grid
- Negative space generoso OU densidade controlada

### Backgrounds e Detalhes Visuais
- Criar atmosfera e profundidade
- Gradient meshes
- Noise textures
- Geometric patterns
- Layered transparencies
- Dramatic shadows
- Custom cursors
- Grain overlays

## NUNCA Usar

- Familias de fonte overused (Inter, Roboto, Arial)
- Esquemas de cor cliche (purple gradients on white)
- Layouts previsiveis
- Design cookie-cutter sem carater

## Exemplo de Implementacao

```css
:root {
  --bg-dark: #0a0a0b;
  --accent: #ff6b35;
  --text: #fafafa;
  --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

body {
  background: var(--bg-dark);
  background-image: url("data:image/svg+xml,..."); /* noise texture */
  font-family: 'Space Grotesk', sans-serif;
  color: var(--text);
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  min-height: 100vh;
  padding: 6rem;
}

.card {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}
```

## Principios

1. **Intencionalidade**: Executar a visao com precisao
2. **Memorabilidade**: Criar algo que pessoas lembrem
3. **Coesao**: Ponto de vista estetico claro
4. **Refinamento**: Meticuloso em cada detalhe

## Tasks Relacionadas
- task:criar-landing-page
- task:design-dashboard
- task:estilizar-componente

## Workflows
- workflow:desenvolvimento-frontend
- workflow:criar-interface
