import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/ui/**/*.{ts,tsx}', './src/ui/index.html'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#08090f',
          card: '#0f1018',
          hover: '#13141f',
        },
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
        },
        accent: {
          DEFAULT: '#06b6d4',
        },
        text: {
          DEFAULT: '#f0f0f0',
          muted: '#888888',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
