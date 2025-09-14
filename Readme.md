# DNS Threat & Anomaly Detector

A real-time, containerized web application for monitoring, visualizing, and analyzing DNS traffic across multiple network interfaces. Designed for security engineers, network admins, and cybersecurity enthusiasts, this platform enables instant detection of threats, suspicious domains, failed DNS queries, and anomalous client activity—delivered through an interactive web dashboard.

---

## 🚀 Features

- **Live DNS Monitoring:** Capture and inspect DNS traffic by protocol, domain, client, and response code.
- **Threat Detection:** Instantly detect malicious domains, command-and-control (C2) callbacks, DNS tunneling, and failed queries.
- **Real-Time Dashboard:** Visualize key security indicators—top domains, client activity, error codes (NXDOMAIN, SERVFAIL), and protocol usage—via rich charts and tables.
- **Multi-Platform:** Deployable on Windows, macOS, and Linux with a single command using Docker.
- **Easy Deployment:** No manual Python or Node.js setup required; simply use Docker Compose.

---

## 🖼️ Screenshots

*Add screenshots of your dashboard and charts here if available!*

---

## 🛠️ Tech Stack

- **Backend:** Python, Flask, Scapy (for packet capture and parsing)
- **Frontend:** React.js, Material-UI, Chart.js
- **Packaging:** Docker, Docker Compose
- **Serving (Frontend):** Nginx (serves the static React build)

---

## ⚡ Quick Start (Docker)

### 1. **Prerequisites**

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for Windows/macOS)
- [Docker Engine](https://docs.docker.com/engine/install/) & [Docker Compose](https://docs.docker.com/compose/install/) (for Linux)

### 2. **Clone the Repository**

```bash
git clone https://github.com/your-username/dns-threat-analyzer.git
cd dns-threat-analyzer
```

### 3. **Run the Application**

```bash
docker-compose up --build
```

- The **backend** will listen on port `5000`.
- The **frontend** dashboard will be available on [http://localhost](http://localhost).

### 4. **Using the Dashboard**

- Open your browser and go to [http://localhost](http://localhost).
- Select a network interface in the navbar dropdown.
- Click **Start Monitoring** to begin live DNS packet analysis.
- Explore real-time analytics, top domains, clients, protocols, and recent queries.

---

## 📝 Troubleshooting

- **No interfaces detected?**  
  Ensure Docker is running with sufficient permissions (may require `sudo` on Linux).

- **No stats or delayed stats?**  
  Sometimes, the backend packet capture service may need a refresh.  
  - Try stopping and re-starting monitoring, or  
  - Use Docker Compose to restart the backend service:
    ```bash
    docker-compose restart backend
    ```
  - Refresh the web page after a few seconds.

- **Permission errors on Linux?**  
  Run with `sudo` or ensure your user is in the `docker` group.

- **Port conflicts?**  
  Make sure nothing else is running on ports `80` (frontend) or `5000` (backend).

---

## 🧩 Project Structure

```
dns-threat-analyzer/
│
├── backend/                # Flask + Scapy backend for packet capture
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   └── packet-analyser/    # React.js frontend app
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── Dockerfile
│
├── docker-compose.yml      # Orchestrates backend and frontend containers
└── README.md
```

---

## 🏗️ Development

- **Backend:**  
  See `backend/README.md` for API details and local development.
- **Frontend:**  
  See `frontend/packet-analyser/README.md` to run React app locally.

---

## 🙌 Acknowledgements

- [Scapy](https://scapy.net/), [Flask](https://flask.palletsprojects.com/)
- [React.js](https://react.dev/), [Material-UI](https://mui.com/), [Chart.js](https://www.chartjs.org/)
- [Docker](https://www.docker.com/)

---

## 📄 License

*Specify your preferred license here, e.g., MIT, Apache-2.0, etc.*

---

## 💡 Notes

- **For Windows users:** No need to manually install Npcap; Docker handles network capture inside the container.
- **For macOS/Linux:** The same Docker image works out-of-the-box. On Linux, use `sudo` if you encounter permission issues.
- **If you encounter delays or no stats update:** Try restarting the backend service using Docker Compose and refreshing your browser.

---

**Enjoy real-time DNS threat analytics on your own network with just one command!**