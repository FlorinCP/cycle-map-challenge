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
        'torea-bay': {
          50: '#eff4fe',
          100: '#e2eafd',
          200: '#cad7fb',
          300: '#abbdf6',
          400: '#8998f0',
          500: '#6c77e8',
          600: '#5050db',
          700: '#4341c1',
          800: '#363698',
          900: '#33347c',
          950: '#1e1e48',
        },
        grenadier: {
          50: '#fef5ee',
          100: '#fde8d7',
          200: '#faccac',
          300: '#f7a97a',
          400: '#f37b44',
          500: '#f0581f',
          600: '#de3e15',
          700: '#ba2d14',
          800: '#ba2d14',
          900: '#942618',
          950: '#782116',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
