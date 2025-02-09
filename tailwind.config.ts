import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xl: { max: '1440px' },
        lg: { max: '1024px' },
        md: { max: '768px' },
        sm: { max: '567px' },
        xs: { max: '425px' },
      },
    },
  },
  plugins: [],
} satisfies Config;
