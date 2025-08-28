import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button
} from "@mui/material";
// import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
// import AvTimerIcon from "@mui/icons-material/AvTimer";

// Example interface opti

export default function Navbar({
  interfaces ,
  selectedInterface,
  setSelectedInterface,
  pollingTime,
  setPollingTime,
  isMonitoring,
  setIsMonitoring
}) {
  return (
    <AppBar
      position="sticky"
      elevation={4}
      color="default"
      sx={{
        bgcolor: "#23272a", // Modern dark navbar
        color: "#ececec",
        top: 0,
        zIndex: 1000
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left: Logo & Title */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <NetworkCheckIcon sx={{ mr: 1 }} fontSize="large" /> */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontFamily: "Montserrat, Inter, Roboto, Arial",
              letterSpacing: "0.05em",
              color: "#ececec"
            }}
          >
            DNS Analyzer Dashboard
          </Typography>
        </Box>

        {/* Right: Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {/* Interface Select */}
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: 100,
              bgcolor: "#23272a",
              "& .MuiInputLabel-root": { color: "#ececec" },
              "& .MuiSelect-root, & .MuiSelect-icon": { color: "#ececec" }
            }}
          >
            <InputLabel id="interface-label" sx={{ color: "#ececec" }}>
              Interface
            </InputLabel>
            <Select
              labelId="interface-label"
              value={selectedInterface}
              onChange={(e) => setSelectedInterface(e.target.value)}
              label="Interface"
              sx={{ color: "#ececec" }}
            >
              {interfaces.length === 0 ? (
                <MenuItem disabled value="">
                  No active interfaces
                </MenuItem>
              ) : (
                interfaces.map((iface) => (
                  <MenuItem key={iface} value={iface}>
                    {iface}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          {
            selectedInterface && <Button
            variant="contained"
            color={isMonitoring ? "error" : "primary"}
            onClick={() => setIsMonitoring(prev => !prev)}
            disabled={!selectedInterface}
            sx={{ mr: 2 }}
        >
          {isMonitoring ? "STOP" : "Start Monitoring"}
      </Button>
          }
          
          {/* Polling Time Input */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <AvTimerIcon sx={{ color: "#ececec" }} /> */}
            <TextField
              variant="outlined"
              size="small"
              label="Polling (s)"
              type="number"
              value={pollingTime}
              onChange={(e) => setPollingTime(Number(e.target.value))}
              inputProps={{ min: 1, max: 120, style: { padding: '6px 8px', color: "#ececec" } }}
              sx={{
                width: 90,
                bgcolor: "#23272a",
                borderRadius: 1,
                "& .MuiInputLabel-root": { color: "#ececec" },
                "& .MuiInputBase-input": { color: "#ececec" }
              }}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}