import type { Config } from 'tailwindcss'

const config: Config = {
  
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#121212',
        primary: '#16a34a', // green buttons
        text: '#ffffff',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
