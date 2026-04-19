/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1E3A5F',
          orange: '#F97316',
          bg: '#F1F5F9',
        },
        status: {
          submitted: '#3B82F6',   // blue
          pending: '#EAB308',     // yellow
          inprogress: '#F97316',  // orange
          resolved: '#22C55E',    // green
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
