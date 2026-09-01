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
        vouchy: {
          purple: {
            50: '#F5F3FF',
            100: '#EDE9FE',
            200: '#DDD6FE',
            300: '#C4B5FD',
            400: '#A78BFA',
            500: '#8B5CF6',
            600: '#7C3AED',
            700: '#6D28D9',
            800: '#5B21B6',
            900: '#4C1D95',
          },
          yellow: {
            50: '#FEFCE8',
            100: '#FEF08A',
            200: '#FDE047',
            300: '#FACC15',
          },
          blue: {
            50: '#F0F9FF',
            100: '#E0F2FE',
            200: '#BAE6FD',
            300: '#7DD3FC',
            400: '#38BDF8',
          },
          mint: {
            50: '#F0FDF4',
            100: '#DCFCE7',
            200: '#A7F3D0',
            300: '#6EE7B7',
            400: '#34D399',
          },
          coral: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            200: '#FCA5A5',
            300: '#F87171',
          },
          pink: {
            50: '#FDF2F8',
            100: '#FCE7F3',
            200: '#FBCFE8',
            300: '#F472B6',
          },
          lavender: {
            50: '#FAF5FF',
            100: '#F3E8FF',
            200: '#E9D5FF',
            300: '#D8B4FE',
          },
          cream: '#FAF8F5',
          dark: '#1E1B2E',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Nunito', 'DM Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'playful': '0 8px 30px rgba(139, 92, 246, 0.12)',
        'playful-lg': '0 15px 40px rgba(139, 92, 246, 0.18)',
        'card-soft': '0 4px 20px rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        wiggle: 'wiggle 2s ease-in-out infinite',
        pop: 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
