// theme.tsx
import { extendTheme } from "@chakra-ui/react";

const fonts = {
  mono: `'Menlo', monospace`,
  heading: `'Menlo', monospace`,
  body: `'Menlo', monospace`,
  minecraft: `'Minecraftia', monospace`, // 🔥 custom
};

// In Chakra v2, breakpoints are just an object, no createBreakpoints needed
const breakpoints = {
  base: "0em",
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
  "2xl": "96em",
};

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        backgroundColor: "#1B202C",
      },
      "@font-face": [
        {
          fontFamily: "Minecraftia",
          src: "url('/fonts/Minecraftia.ttf') format('truetype')",
          fontWeight: "normal",
          fontStyle: "normal",
        },
      ],
    },
  },
  fonts,
  breakpoints,
});

export default theme;
