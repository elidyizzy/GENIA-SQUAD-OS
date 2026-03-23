/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base grafite (cinza escuro, quase preto)
        grafite: {
          950: '#0d0d0f',
          900: '#131316',
          800: '#1a1a1f',
          700: '#222228',
          600: '#2a2a32',
          500: '#35353f',
          400: '#45454f',
        },
        // Amarelo gema fechado (não neon, não pastel)
        gema: {
          DEFAULT: '#d4a012',
          light: '#e6b82a',
          dark: '#b8890e',
          muted: 'rgba(212, 160, 18, 0.15)',
        },
        // Vermelho escuro discreto (alertas/atrasos)
        alerta: {
          DEFAULT: '#9b2c2c',
          light: '#c53030',
          muted: 'rgba(155, 44, 44, 0.15)',
        },
        // Verde fechado pouco saturado (sucesso/conclusão)
        sucesso: {
          DEFAULT: '#4a7c59',
          light: '#5a9a6c',
          muted: 'rgba(74, 124, 89, 0.15)',
        },
        // Texto
        texto: {
          primary: '#e8e6e3',
          secondary: '#9a9590',
          muted: '#6b6560',
        },
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(212, 160, 18, 0.15)',
        deep: '0 8px 40px rgba(0, 0, 0, 0.5)',
        inner: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
