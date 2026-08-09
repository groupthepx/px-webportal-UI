import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/view/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Responsive Breakpoints ที่สอดคล้องกับ MUI
    screens: {
      'xs': '0px',
      'sm': '600px',
      'md': '900px',
      'lg': '1200px',
      'xl': '1536px',
      '2xl': '1920px',
    },
    extend: {
      // Custom Gradients
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #EEA15D 0%, #F1592A 51%, #9F3025 100%)",
        "gradient-primary-hover": "linear-gradient(135deg, #9F3025 0%, #F1592A 51%, #EEA15D 100%)",
      },
      // Spacing สำหรับ Responsive Design
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      // Container ที่ responsive
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          md: '2rem',
          lg: '2.5rem',
          xl: '3rem',
          '2xl': '4rem',
        },
      },
      // Z-index standards
      zIndex: {
        '1': '1',
        '100': '100',
        '500': '500',
        '1000': '1000',
        '1100': '1100',
      },
    },
  },
  plugins: [],
};
export default config;
