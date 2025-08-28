
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
  Typography,
  Box,
} from "@mui/material";


const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1A1A1A"
    }
  },
  typography: {
    fontFamily: "Montserrat, Inter, Roboto, Arial",
    h4: { fontWeight: 700, fontSize: "2rem" },
    h6: { fontWeight: 600, fontSize: "1rem" },
    subtitle1: { fontSize: "1rem" }
  }
});

export default function InitialPage() {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper elevation={5} sx={{ p: 4, borderRadius: 3, textAlign: "center", maxWidth: 500, width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          Welcome to DNS Analyzer
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          To get started, follow these steps:
        </Typography>
        <Box sx={{ textAlign: "left", mx: "auto", maxWidth: 400 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Step 1:</strong> Select a network interface to monitor.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Step 2:</strong> Set polling time and start packet capture.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Step 3:</strong> View real-time DNS statistics & visualizations on your dashboard.
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 4, color: "gray" }}>
          Once stats are available, your dashboard will automatically update.
        </Typography>
      </Paper>
    </Box>
      </ThemeProvider>
    );
  }
