import { useState, useEffect } from 'react';
import Dashboard from "./Dashboard";
import Navbar from "./components/Navbar";
import InitialPage from "./components/InitialPage";

function App() {
  const [interfaces, setInterfaces] = useState([]);
  const [selectedInterface, setSelectedInterface] = useState("");
  const [pollingTime, setPollingTime] = useState(10);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    async function fetchInterfaces() {
      const res = await fetch("http://127.0.0.1:5000/api/interfaces");
      const data = await res.json();
      setInterfaces(data);
      // Do NOT set selectedInterface here!
    }
    fetchInterfaces();
  }, []);

  return (
    <>
      <Navbar
        interfaces={interfaces}
        selectedInterface={selectedInterface}
        setSelectedInterface={setSelectedInterface}
        pollingTime={pollingTime}
        setPollingTime={setPollingTime}
        isMonitoring={isMonitoring}
        setIsMonitoring={setIsMonitoring}
      />
      {/* Show InitialPage if not monitoring, else show Dashboard */}
      {selectedInterface ? (
        isMonitoring ? (
          <Dashboard selectedInterface={selectedInterface} pollingTime={pollingTime} isMonitoring={isMonitoring} />
        ) : (
          <InitialPage message="Monitoring paused. Start monitoring to see live DNS traffic analytics." />
        )
      ) : (
        <InitialPage message="Please select a network interface to begin monitoring." />
      )}
    </>
  );
}

export default App;