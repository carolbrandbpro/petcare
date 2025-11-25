export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF7A00',
        secondary: '#FFC946',
        black: '#0A0A0A',
        gray: { 50: '#F5F5F5' },
        white: '#FFFFFF',
        info: '#32B3FF'
      },
      fontFamily: {
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: { xl: '16px', lg: '12px' },
      boxShadow: { soft: '0 8px 24px rgba(0,0,0,0.08)' }
    }
  },
  plugins: []
}