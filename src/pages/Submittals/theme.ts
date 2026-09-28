// theme.ts
import { extendTheme as extendJoyTheme } from "@mui/joy/styles";

export const theme = extendJoyTheme({
  fontFamily: {
    body: "'Tajawal', Helvetica, Arial, Lucida, sans-serif",
    display: "'Tajawal', Helvetica, Arial, Lucida, sans-serif",
  },
  typography: {
    h1: {
      fontSize: "4rem",
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: "var(--joy-palette-primary-500)",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          solidBg: "var(--joy-palette-primary-400)",
        },
      },
    },
  },
});
