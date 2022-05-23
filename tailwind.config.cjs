const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: [
    "outline-black/25",
    "dark:outline-white/25",
    "outline-blue",
    "dark:outline-lime",
    {
      pattern:
        /bg-(slate|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchia|pink|rose)-(100|200|300|400|500|600|700|800|900)/,
      pattern:
        /outline-(slate|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchia|pink|rose)-(100|200|300|400|500|600|700|800|900)/,
      pattern:
        /text-(slate|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchia|pink|rose)-(100|200|300|400|500|600|700|800|900)/,
    },
  ],
  theme: {
    extend: {},
    colors: {
      transparent: "transparent",
      red: colors.red,
      teal: colors.teal,
      emerald: colors.emerald,
      orange: colors.orange,
      yellow: colors.yellow,
      blue: colors.blue,
      "white-trans": "rgba(255,255,255,0.2)",
      "white-transLight": "rgba(255,255,255,0.2)",
      "white-transDark": "rgba(255,255,255,0.2)",
      "black-trans": "rgba(0,0,0,0.2)",
      "black-transLight": "rgba(0,0,0,0.2)",
      "black-transDark": "rgba(0,0,0,0.35)",
      "white-500": "#fff",
    },
  },
};
