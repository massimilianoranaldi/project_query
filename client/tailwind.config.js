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
        "gradient-custom-1": "linear-gradient(to right, #C3C3C3, #ffffff)", //usato per sfumare i paragrafi
        "gradient-custom-2": "linear-gradient(to right, #C3C3C3, #ffffff)", //usato per sfumare capitoli
      },
    },
  },
  plugins: [],
};
