import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#233565',
        secondary: '#8BD8BC',
        tertiary: '#F5F5F5',
        accent: '#F2A541',
        dark: '#131C25',
      }
    },
  },
  plugins: [],
}
export default config
