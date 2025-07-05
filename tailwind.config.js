module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#141414',
        foreground: '#ffffff',
        card: {
          DEFAULT: '#181818',
          hover: '#2f2f2f',
          dark: '#0f0f0f',
        },
        accent: {
          DEFAULT: '#e50914',
          hover: '#f40612',
          dark: '#b20710',
          light: '#ff1e2d',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
          muted: '#8c8c8c',
          accent: '#e50914',
        },
        border: {
          DEFAULT: '#333333',
          light: '#404040',
          dark: '#222222',
        },
        gray: {
          850: '#1f1f1f',
          900: '#0f0f0f',
          950: '#0a0a0a',
        },
        'header-bg': 'rgba(20, 20, 20, 0.95)',
        'modal-bg': 'rgba(0, 0, 0, 0.85)',
        'overlay-bg': 'rgba(0, 0, 0, 0.6)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      screens: {
        'xs': '480px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
      spacing: {
        '18': '4.5rem',
        '66': '16.5rem',
        '72': '18rem',
        '78': '19.5rem',
        '84': '21rem',
        '88': '22rem',
        '90': '22.5rem',
        '96': '24rem',
      },
      aspectRatio: {
        '2/3': '2 / 3',
        '3/4': '3 / 4',
        '4/5': '4 / 5',
        '21/9': '21 / 9',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 16px 32px -4px rgba(0, 0, 0, 0.4), 0 8px 16px -4px rgba(0, 0, 0, 0.3)',
        'card-netflix': '0 8px 16px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3)',
        'modal': '0 24px 48px -12px rgba(0, 0, 0, 0.6), 0 16px 32px -8px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 20px rgba(229, 9, 20, 0.4)',
        'glow-lg': '0 0 40px rgba(229, 9, 20, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [
    function({ addUtilities, addComponents, theme }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': `${theme('colors.text.muted')} transparent`,
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        '.gpu-accelerated': {
          'transform': 'translateZ(0)',
          'backface-visibility': 'hidden',
          'perspective': '1000px',
        },
      });

      addComponents({
        '.hero-gradient': {
          background: 'linear-gradient(77deg, rgba(0, 0, 0, 0.6) 0%, transparent 85%)',
        },
        '.hero-gradient-bottom': {
          background: 'linear-gradient(to top, rgba(20, 20, 20, 0.9) 0%, rgba(20, 20, 20, 0.4) 60%, transparent 100%)',
        },
        '.card-gradient': {
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 40%, transparent 80%)',
        },
        '.netflix-gradient': {
          background: 'linear-gradient(90deg, #e50914 0%, #f40612 100%)',
        },
        '.dark-gradient': {
          background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(0, 0, 0, 0.8) 100%)',
        },
      });
    },
  ],
}

