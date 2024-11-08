import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-purple': {
            100: '#e4e2e9',
            200: '#cac5d3',
            300: '#afa9bc',
            400: '#938ba2',
            500: '#635d6f',
            600: '#4e475c',
            700: '#3c354b',
            800: '#282235',
            900: '#171221',
        },
      }
    },
  },
  plugins: [],
} satisfies Config

