/** @type {import('tailwindcss').Config} */
module.exports = {
  // Fajlovi u kojima Tailwind traži korišćene klase.
  content: ['./public/index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Paleta "Trust & Authority" — navy baza + plavi primarni ton (poverenje i putovanje).
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        navy: {
          800: '#111c34',
          900: '#0f172a',
        },
        coral: {
          500: '#f9735b',
          600: '#ea5b45',
        },
      },
      // Preporučeni font iz dizajn sistema.
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 50px -36px rgba(15,23,42,0.45)',
        'card-hover': '0 26px 60px -34px rgba(15,23,42,0.55)',
        button: '0 14px 30px -18px rgba(37,99,235,0.8)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
