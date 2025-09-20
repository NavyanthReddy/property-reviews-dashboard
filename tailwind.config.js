/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        flex: {
          green: '#2F5233',
          'green-light': '#4A7C59',
          'green-dark': '#1A2E1D',
          teal: '#2F5233',
          'green-dark': '#1A2E1D',
          gray: '#6B7280',
          light: '#F8FAFC',
        }
      },
    },
  },
  plugins: [],
}
