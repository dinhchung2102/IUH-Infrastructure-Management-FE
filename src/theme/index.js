import { createTheme } from "@mui/material/styles";

// Light theme
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1565c0",
      light: "#42a5f5",
      dark: "#0d47a1",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
      contrastText: "#ffffff",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ed6c02",
      light: "#ff9800",
      dark: "#e65100",
      contrastText: "#ffffff",
    },
    info: {
      main: "#0288d1",
      light: "#03a9f4",
      dark: "#01579b",
      contrastText: "#ffffff",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
      contrastText: "#ffffff",
    },
    white: {
      main: "#ffffff",
      light: "#ffffff",
      dark: "#f5f5f5",
      contrastText: "#333333",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '"Open Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "2.5rem", // ~40px
      fontWeight: 700,
      lineHeight: 1.2,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    h2: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "2rem", // ~32px
      fontWeight: 600,
      lineHeight: 1.3,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    h3: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "1.75rem", // ~28px
      fontWeight: 600,
      lineHeight: 1.3,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    h4: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "1.5rem", // ~24px
      fontWeight: 500,
      lineHeight: 1.4,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    h5: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "1.25rem", // ~20px
      fontWeight: 500,
      lineHeight: 1.4,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    h6: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "1.125rem", // ~18px
      fontWeight: 500,
      lineHeight: 1.4,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    subtitle1: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "1rem", // ~16px
      fontWeight: 500,
      lineHeight: 1.5,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    subtitle2: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "0.875rem", // ~14px
      fontWeight: 500,
      lineHeight: 1.5,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    body1: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "1rem", // ~16px
      lineHeight: 1.6,
      fontWeight: 400,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    body2: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "0.875rem", // ~14px
      lineHeight: 1.6,
      fontWeight: 400,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    button: {
      fontFamily: '"Open Sans", sans-serif',
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.95rem",
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    caption: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "0.75rem", // ~12px
      lineHeight: 1.4,
      fontWeight: 400,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    overline: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "0.75rem",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#42a5f5",
      light: "#90caf9",
      dark: "#1976d2",
      contrastText: "#000000",
    },
    secondary: {
      main: "#388e3c",
      light: "#66bb6a",
      dark: "#2e7d32",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#000000",
    },
    info: {
      main: "#21cbf3",
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#000000",
    },
    success: {
      main: "#388e3c",
      light: "#66bb6a",
      dark: "#2e7d32",
      contrastText: "#ffffff",
    },
    white: {
      main: "#ffffff",
      light: "#ffffff",
      dark: "#f5f5f5",
      contrastText: "#333333",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  typography: {
    fontFamily: '"Open Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "2.5rem", // ~40px
      fontWeight: 700,
      lineHeight: 1.2,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    h2: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "2rem", // ~32px
      fontWeight: 600,
      lineHeight: 1.3,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    h3: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "1.75rem", // ~28px
      fontWeight: 600,
      lineHeight: 1.3,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    h4: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "1.5rem", // ~24px
      fontWeight: 500,
      lineHeight: 1.4,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    h5: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "1.25rem", // ~20px
      fontWeight: 500,
      lineHeight: 1.4,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    h6: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "1.125rem", // ~18px
      fontWeight: 500,
      lineHeight: 1.4,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    subtitle1: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "1rem", // ~16px
      fontWeight: 500,
      lineHeight: 1.5,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    subtitle2: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "0.875rem", // ~14px
      fontWeight: 500,
      lineHeight: 1.5,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    body1: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "1rem", // ~16px
      lineHeight: 1.6,
      fontWeight: 400,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    body2: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "0.875rem", // ~14px
      lineHeight: 1.6,
      fontWeight: 400,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    button: {
      fontFamily: '"Open Sans", sans-serif',
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.95rem",
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    caption: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "0.75rem", // ~12px
      lineHeight: 1.4,
      fontWeight: 400,
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
    overline: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "0.75rem",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontOpticalSizing: "auto",
      fontVariationSettings: '"wdth" 95.2',
    },
  },

  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(255,255,255,0.1)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 8px rgba(0,0,0,0.3)",
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
