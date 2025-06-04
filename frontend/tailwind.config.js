module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2c3e50',
          dark: '#1a252f'
        },
        secondary: '#3498db',
        accent: '#e74c3c',
        success: '#2ecc71',
        healing: '#16a085',
        innovation: '#f39c12',
        light: '#ecf0f1',
        dark: '#2c3e50',
        // Emotional colors
        hope: '#27ae60',
        tension: '#e74c3c',
        confidence: '#3498db',
        uncertainty: '#95a5a6',
        breakthrough: '#f39c12'
      }
    },
  },
  plugins: [],
}
