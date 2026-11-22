/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          2: 'var(--color-surface-2)',
        },
        tp: {
          bg:        'var(--color-bg)',
          text:      'var(--color-text)',
          muted:     'var(--color-text-muted)',
          border:    'var(--color-border)',
          borderHov: 'var(--color-border-hover)',
        },
      },
      borderRadius: {
        card:  '12px',
        input: '8px',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        'indigo-glow': '0 0 0 3px rgb(99 102 241 / .18)',
      },
      transitionDuration: {
        150: '150ms',
        200: '200ms',
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
