import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F0',
        beige: '#F5EBDC',
        'beige-dark': '#E8D9C3',
        gold: '#C8A24A',
        'gold-light': '#D4B25E',
        'gold-dark': '#A88234',
        brown: '#3E2F1C',
        'brown-light': '#5A4631',
        'brown-dark': '#2A1E0F',
        festive: '#D4612A',
        'festive-dark': '#B04D1F',
        'festive-light': '#E8763D',
        amber: '#F2A93B',
        success: '#2D7A4B',
        danger: '#C0392B',
        warning: '#D4A017'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      maxWidth: {
        '8xl': '88rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
