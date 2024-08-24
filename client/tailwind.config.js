/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // UTILIZZATI NELL'HOVER DEI TASTI E SFONDI STATICI (tema predominante #eab308,#FF6A06 arancione windtre)
        customColor1: "#eab308", //"usato per i bordi
        customColor2: "#eab308", //"usato per sidebar e intestazioni capitoli indici monocromatico
        customColor3: "#ca8a04", //"usato per hover dei tasti
      },
      // UTILIZZATO PER I CAPITOLI PARAGRAFI CON GRADIENTE (tema predominante #eab308)
      backgroundImage: {
        "gradient-custom-1": "linear-gradient(to right, #967305, #eab308)", //usato per sfumare i capitoli
        "gradient-custom-2": "linear-gradient(to right, #3B2D02, #eab308)", //usato per sfumare paragrafi
      },
    },
  },
  plugins: [],
};
