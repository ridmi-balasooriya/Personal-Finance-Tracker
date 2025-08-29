/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: { 
    extend: {
      fontFamily: {
        heading: ['Inter', 'sans-serif'], // default for body and headings
        body: ['IBM Plex Sans', 'sans-serif'], // default body font
        roboto: ['Roboto', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        bold: '700',
      },
      colors: {
        primary: '#1e40af',
        secondary: '#9333ea',
        accent: '#f59e0b',
        background: '#f3f4f6',
        text: '#333333',
      },
      spacing: {
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '40px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      }
    } 
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;