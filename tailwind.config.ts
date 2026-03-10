import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f2',
          100: '#F5E6E6',
          200: '#f5d0d0',
          300: '#ebadad',
          400: '#cc5555',
          500: '#A53A3A',
          600: '#8B2F2F',
          700: '#7A2525',
          800: '#6B2020',
          900: '#5C1B1B',
        },
        maroon: {
          DEFAULT: '#8B2F2F',
          light: '#A53A3A',
          dark: '#7A2525',
          50: '#FAFAFA',
          100: '#F5E6E6',
          200: '#f5d0d0',
          300: '#ebadad',
        },
        campus: {
          bg: '#FAFAFA',
          primary: '#8B2F2F',
          accent: '#F5E6E6',
          hover: '#7A2525',
        },
      },
    },
  },
  plugins: [],
};

export default config;
