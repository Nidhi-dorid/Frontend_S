/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soothing warm grayscale
        gray: {
          900: '#3D312A',
          800: '#52433A',
          700: '#69574D',
          600: '#877366',
          500: '#A69285',
          400: '#C2B1A5',
          300: '#DDD1C9',
          200: '#EDE4DD',
          100: '#F5EFEA',
          50: '#F9F6F4'
        },
        brand: {
          navy: '#4A3B32',    // Warm earthy taupe replacing harsh navy
          orange: '#E07A5F',  // Soft terracotta replacing bright neon orange
          bg: '#FAF7F2',      // Soothing warm ivory background
        },
        status: {
          submitted: '#6B90A6',   // Muted calm blue
          pending: '#D4A373',     // Warm soft yellow/tan
          inprogress: '#E07A5F',  // Terracotta
          resolved: '#81B29A',    // Soft sage green
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      fontWeight: {
        // Softening the font weights globally for a more soothing look
        medium: '400',
        semibold: '500', 
        bold: '600',     
        extrabold: '700',
      }
    },
  },
  plugins: [],
}
