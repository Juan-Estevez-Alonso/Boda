import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'olive': {
          50: '#f7f5f0',
          100: '#ece6db',
          200: '#d9cdb7',
          300: '#c5b493',
          400: '#b29c6f',
          500: '#a0874a',
          600: '#7d6a3a',
          700: '#5a4d2a',
          800: '#3d351d',
          900: '#231d0f',
        },
        'sand': {
          50: '#fef9f3',
          100: '#f9f1e8',
          200: '#f3e3d1',
          300: '#ead5ba',
          400: '#e1c7a3',
          500: '#d9b98c',
          600: '#c9a876',
          700: '#b89960',
          800: '#9d8450',
          900: '#824f40',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
