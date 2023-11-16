/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        customBackground: "#f4f6f9",
        primaryColor: "#800000",
        secondaryColor: "#FFDF00",
        // Add other custom colors here if needed
        screens: {
          "1000px": "1050px",
          "1100px": "1110px",
          "800px": "800px",
          "1300px": "1300px",
          "400px":"400px"
        },
      },
    },
  },
  plugins: [],
}

