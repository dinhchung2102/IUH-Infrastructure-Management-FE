import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useThemeContext } from "./ThemeContext";
import { lightTheme, darkTheme } from "../theme";

export default function ThemeProvider({ children }) {
  const { currentTheme } = useThemeContext();
  const theme = currentTheme === "dark" ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
