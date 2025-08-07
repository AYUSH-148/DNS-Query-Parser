import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar position="static"  elevation={4}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="div" sx={{ mb: 0 }}>
            DNS Analyzer Dashboard
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}