# 🚀 Docker Monitoring Stack with Prometheus & Grafana

A complete monitoring solution deployed on Google Cloud Platform using Docker, Nginx, Prometheus, and Grafana.

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Services](#services)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Monitoring Queries](#monitoring-queries)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project demonstrates a production-ready monitoring stack that includes:
- **Node.js Application** with custom Prometheus metrics
- **Nginx** as a reverse proxy
- **Prometheus** for metrics collection
- **Grafana** for visualization and dashboards
- **Node Exporter** for system metrics
- All services containerized with Docker Compose

## 🏗️ Architecture
```
Internet → GCP VM → Nginx (Port 80) → Docker Network
                                      ├── Node.js App (Port 3000)
                                      ├── Prometheus (Port 9090)
                                      ├── Grafana (Port 3001)
                                      └── Node Exporter (Port 9100)
```

## 🔧 Services

| Service | Port | Description |
|---------|------|-------------|
| Nginx | 80 | Reverse proxy for all services |
| Node.js App | 3000 | Sample application with metrics endpoint |
| Prometheus | 9090 | Metrics collection and storage |
| Grafana | 3001 | Visualization and dashboards |
| Node Exporter | 9100 | System metrics collector |

## ✅ Prerequisites

- Google Cloud Platform account
- GCP VM instance (e2-medium or higher recommended)
- Docker & Docker Compose installed
- Firewall rules configured for ports: 80, 3000, 9090, 9100, 3001

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Start all services
```bash
docker-compose up -d
```

### 3. Verify services are running
```bash
docker-compose ps
```

### 4. Access the services

- Main App: `http://YOUR_VM_IP/`
- Prometheus: `http://YOUR_VM_IP:9090`
- Grafana: `http://YOUR_VM_IP:3001`
  - Username: `admin`
  - Password: `admin123`

## 📊 Usage

### Accessing Prometheus

1. Navigate to `http://YOUR_VM_IP:9090`
2. Go to Status → Targets to verify all services are UP
3. Use the Graph tab to run PromQL queries

### Creating Grafana Dashboards

1. Login to Grafana at `http://YOUR_VM_IP:3001`
2. Navigate to Dashboards → New → New Dashboard
3. Add visualization panels with Prometheus queries
4. Save your dashboard

### Sample PromQL Queries
```promql
# HTTP request rate
rate(http_requests_total[5m])

# Average response time
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])

# CPU usage
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

## 📸 Screenshots

### Application Homepage
![Application](screenshots/app-homepage.png)

### Prometheus Dashboard
![Prometheus](screenshots/prometheus-dashboard.png)

### Grafana Dashboard
![Grafana](screenshots/grafana-dashboard.png)

### Metrics Overview
![Metrics](screenshots/metrics-overview.png)

## 🔍 Monitoring Queries

### Application Metrics

- **Total Requests**: `sum(http_requests_total)`
- **Request Rate**: `rate(http_requests_total[5m])`
- **Error Rate**: `rate(http_requests_total{status=~"5.."}[5m])`
- **Response Time (p95)**: `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))`

### System Metrics

- **CPU Usage**: `100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)`
- **Memory Usage**: `(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100`
- **Disk Usage**: `100 - ((node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100)`
- **Network I/O**: `rate(node_network_receive_bytes_total[5m])`, `rate(node_network_transmit_bytes_total[5m])`

## 🛠️ Useful Commands
```bash
# View logs
docker-compose logs -f [service-name]

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Check resource usage
docker stats
```

## 🐛 Troubleshooting

### Containers won't start
```bash
docker-compose logs [container-name]
docker-compose ps
```

### Can't access services
- Check firewall rules in GCP Console
- Verify external IP: `curl ifconfig.me`
- Test locally: `curl http://localhost:9090`

### Prometheus shows targets as DOWN
```bash
docker-compose restart prometheus
docker-compose logs prometheus
```

### Grafana shows "No Data"
- Verify Prometheus data source configuration
- Check if Prometheus has data
- Generate traffic to the application

## 📝 Project Structure
```
monitoring-project/
├── app/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── nginx/
│   └── nginx.conf
├── prometheus/
│   └── prometheus.yml
├── grafana/
│   └── provisioning/
│       ├── datasources/
│       │   └── datasource.yml
│       └── dashboards/
│           └── dashboard.yml
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

Your Name
- GitHub: [@Omthube23e](https://github.com/Omthube23)

## 🙏 Acknowledgments

- Built on Google Cloud Platform
- Uses Prometheus for monitoring
- Grafana for visualization
- Docker for containerization

---

**⭐ If you found this project helpful, please give it a star!**
