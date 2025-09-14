import React,{useState,useEffect, useRef } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import TablePagination from "@mui/material/TablePagination";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import InitialPage  from "./components/InitialPage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);


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
const API_URL = "http://127.0.0.1:5000/api/stats";

export default function Dashboard({ selectedInterface, pollingTime,isMonitoring=false }) {
    const [stats, setStats] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); 
    const intervalRef = useRef(null);
      //POlling
      useEffect(() => {
        // let interval;
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (isMonitoring && selectedInterface) {
          const startCapture = async () => {
            await fetch("http://127.0.0.1:5000/api/capture", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ interface: selectedInterface })
            });
          };
      
          const fetchStats = () => {
            fetch(API_URL)
              .then(res => res.json())
              .then(setStats)
              .catch(() => setStats(null));
          };
      
          startCapture().then(() => {
            fetchStats();
            intervalRef.current = setInterval(fetchStats, pollingTime * 1000);
          });
        }
      
        // Cleanup interval WHENEVER isMonitoring becomes false or component unmounts
        return () => {
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
      }, [selectedInterface, pollingTime, isMonitoring]);
    
    if(!stats)  return (<InitialPage/>)
    const paginatedQueries = stats?.recent_queries.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    // console.log(stats);
  const barDomainData = {
    labels: stats.top_domains.map(([domain]) => domain),
    datasets: [
      {
        label: "Request counts",
        data: stats.top_domains.map(([, count]) => count),
        backgroundColor: "rgba(54, 162, 235, 0.7)"
      }
    ]
  };

  const barClientData = {
    labels: stats.top_clients.map(([ip]) => ip),
    datasets: [
      {
        label: "Top Clients",
        data: stats.top_clients.map(([, count]) => count),
        backgroundColor: "rgba(255, 99, 132, 0.7)"
      }
    ]
  };

  const pieTypeData = {
    labels: Object.keys(stats.queries_by_type),
    datasets: [
      {
        label: "Query Types",
        data: Object.values(stats.queries_by_type),
        backgroundColor: [
          "#2196f3",
          "#f44336",
          "#ffeb3b",
          "#4caf50",
          "#e91e63"
        ]
      }
    ]
  };

  const pieProtocolData = {
    labels: Object.keys(stats.queries_by_protocol),
    datasets: [
      {
        label: "Protocols",
        data: Object.values(stats.queries_by_protocol),
        backgroundColor: ["#607d8b", "#3f51b5"]
      }
    ]
  };

  const pieRcodeData = {
    labels: Object.keys(stats.queries_by_rcode),
    datasets: [
      {
        label: "Response Codes",
        data: Object.values(stats.queries_by_rcode),
        backgroundColor: ["#00c853", "#ff1744", "#ffd600", "#1de9b6"]
      }
    ]
  };

  const lineTimeData = {
    labels: stats.queries_over_time.map((pt) => pt.timestamp.slice(11, 16)), // HH:MM
    datasets: [
      {
        label: "Queries Over Time",
        data: stats.queries_over_time.map((pt) => pt.count),
        fill: true,
        borderColor: "#ff9800",
        backgroundColor: "rgba(255,152,0,0.2)",
        tension: 0.2
      }
    ]
  };
  
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />  
    <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
        <Typography variant="subtitle1" gutterBottom>
          Total Queries: <strong>{stats.total_queries}</strong>
        </Typography>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 4 }}>
          <Paper sx={{ p: 2, flex: 1, minWidth: 350, borderRadius: 3 }}>
            <Typography variant="h7" gutterBottom>
              Top Domains
            </Typography>
            <Bar data={barDomainData} />
          </Paper>
          <Paper sx={{ p: 2, flex: 1, minWidth: 350, borderRadius: 3 }}>
            <Typography variant="h7" gutterBottom>
              Top Clients
            </Typography>
            <Bar data={barClientData} />
          </Paper>
        </Box>

        <Box sx={{ display: "flex", gap: 5, flexWrap: "wrap", mb: 4 ,width:"max-width"}}>
          <Paper sx={{ p: 2, minWidth: 300, borderRadius: 3 }}>
            <Typography variant="h7" gutterBottom>
              Query Types
            </Typography>
            <Pie data={pieTypeData} />
          </Paper>
          <Paper sx={{ p: 2, minWidth: 300, borderRadius: 3 }}>
            <Typography variant="h7" gutterBottom>
              Protocols
            </Typography>
            <Pie data={pieProtocolData} />
          </Paper>
          <Paper sx={{ p: 2, minWidth: 300, borderRadius: 3 }}>
            <Typography variant="h7" gutterBottom>
              Response Codes
            </Typography>
            <Pie data={pieRcodeData} />
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 2 , borderRadius: 3}}>
            <Typography variant="h7" gutterBottom>
              DNS Queries Over Time
            </Typography>
            <Line data={lineTimeData} />
          </Paper>
        </Box>

        <Box>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Queries
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Source IP</TableCell>
                    <TableCell>Dest IP</TableCell>
                    <TableCell>Domain</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Protocol</TableCell>
                    <TableCell>Src Port</TableCell>
                    <TableCell>Dst Port</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Response?</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedQueries.map((q, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {q.timestamp.slice(11, 19)}
                      </TableCell>
                      <TableCell>{q.src_ip}</TableCell>
                      <TableCell>{q.dst_ip}</TableCell>
                      <TableCell>{q.qname}</TableCell>
                      <TableCell>{q.qtype}</TableCell>
                      <TableCell>{q.protocol}</TableCell>
                      <TableCell>{q.src_port}</TableCell>
                      <TableCell>{q.dst_port}</TableCell>
                      <TableCell>{q.rcode}</TableCell>
                      <TableCell>{q.response ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={stats.recent_queries.length}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={event => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
            />
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}