/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'gov': {
          'primary': '#8B0000',    // Deep maroon
          'secondary': '#B8860B',  // Dark goldenrod
          'accent': '#DAA520',     // Goldenrod
          'light': '#F5F5DC',     // Beige
          'dark': '#2F0808',      // Dark maroon
          'error': '#DC2626',     // Error red
          'success': '#059669',    // Success green
          'text': '#000'    // Success green
        }
      },
    },
  },
  plugins: [],
};
