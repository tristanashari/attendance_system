/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        "blue-primary": "#1870F4",
        "blue-secondary": "#E7ECF6",
        "gray-light": "#F5F5F5",
        "gray-disabled": "#A9A9A9",
        "gray-disabled-text": "#535353",
        "gold": "#C49313",
        "blue-background": "#232E65",
      },
      fontFamily: {
        inter: ["Inter"],
        miriam: ["Miriam Libre"]
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}

