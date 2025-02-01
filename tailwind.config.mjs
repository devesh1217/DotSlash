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
          'primary-light': '#AA1111', // Lighter maroon for hover
          'secondary': '#8B4513',  // Saddle brown
          'accent': '#DAA520',     // Goldenrod
          'light': '#F8F7F4',     // Off-white background
          'dark': '#2F0808',      // Dark maroon
          'error': '#DC2626',     // Error red
          'success': '#059669',    // Success green
          'text': '#1F2937',      // Dark gray for main text
          'text-light': '#4B5563', // Medium gray for secondary text
          'label': '#6B7280',     // Gray for labels
          'border': '#E5E7EB',    // Light gray for borders
          'input': '#F3F4F6',     // Light gray for input backgrounds
          'hover': '#F3F4F6'      // Light gray for hover states
        }
      },
      boxShadow: {
        'gov': '0 2px 4px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};
