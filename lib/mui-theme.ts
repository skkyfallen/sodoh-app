import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    admin: {
      page: string;
      surface: string;
      ink: string;
      muted: string;
      border: string;
      sidebar: string;
      active: string;
    };
  }

  interface PaletteOptions {
    admin?: {
      page: string;
      surface: string;
      ink: string;
      muted: string;
      border: string;
      sidebar: string;
      active: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#016936",
      dark: "#014e29",
      light: "#d9f0e2",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0c2418",
      contrastText: "#ffffff",
    },
    background: {
      default: "#fbfdfb",
      paper: "#ffffff",
    },
    text: {
      primary: "#123524",
      secondary: "#55685c",
    },
    divider: "#d3ddd5",
    error: {
      main: "#b42323",
    },
    action: {
      selected: "#d9f0e2",
    },
    admin: {
      page: "#eef3ee",
      surface: "#ffffff",
      ink: "#152b20",
      muted: "#55685c",
      border: "#d3ddd5",
      sidebar: "#0f2a1e",
      active: "#d9f0e2",
    },
  },
  shape: {
    borderRadius: 11,
  },
  typography: {
    fontFamily: "var(--font-body), system-ui, sans-serif",
    h1: { fontFamily: "var(--font-display), system-ui, sans-serif" },
    h2: { fontFamily: "var(--font-display), system-ui, sans-serif" },
    h3: { fontFamily: "var(--font-display), system-ui, sans-serif" },
    h4: { fontFamily: "var(--font-display), system-ui, sans-serif" },
    h5: { fontFamily: "var(--font-display), system-ui, sans-serif" },
    h6: { fontFamily: "var(--font-display), system-ui, sans-serif" },
  },
});

export default theme;
