# ☀️ SolarOps Solar Farm Management Cloud

[![Deploy to EC2](https://github.com/adinetech/helios-control-center/actions/workflows/deploy.yml/badge.svg)](https://github.com/adinetech/helios-control-center/actions/workflows/deploy.yml)

**SolarOps** is an enterprise-grade solar farm operations platform designed to monitor, analyze, and manage real-time solar telemetry across multiple sites. Built as a comprehensive cloud platform demonstrating modern SaaS architecture — full observability stack, Role-Based Access Control (RBAC), and a dynamic SCADA-style React dashboard.

## 🏗️ Architecture

```
[ React Frontend ] ←→ [ NestJS Backend ] ←→ [ PostgreSQL ]
        ↓                       ↓
  [ Tailscale VPN ]      [ Prometheus + Loki ]
                               ↓
                          [ Grafana ]
```

## 🚀 Quick Start (Local)

```bash
git clone https://github.com/adinetech/helios-control-center.git
cd helios-control-center
cp .env.example .env
docker compose up -d
```

Access the platform:
- **Landing Page**: `http://localhost:5173`
- **Dashboard**: `http://localhost:5173/dashboard` (Login: `admin@solarops.cloud` / `admin`)
- **Grafana**: `http://localhost:3001` (admin / admin)
- **API Docs**: `http://localhost:3000/api/docs`
- **Prometheus**: `http://localhost:9090`

## ☁️ Cloud Deployment (AWS EC2)

Deployment is fully automated via GitHub Actions. Any push to `main` will:
1. SSH into the EC2 instance
2. Pull the latest code
3. Rebuild and restart all Docker containers

Set these GitHub Repository Secrets:
- `EC2_HOST` — Your Elastic IP
- `EC2_USERNAME` — `ubuntu`
- `EC2_SSH_KEY` — Contents of your `.pem` file

## 📁 Project Structure

```
helios-control-center/
├── apps/
│   ├── backend/          # NestJS API (TypeScript)
│   │   ├── prisma/       # DB schema, migrations, seed
│   │   └── src/          # Controllers, services, modules
│   └── frontend/         # React + Vite dashboard
│       └── src/
│           ├── pages/    # Dashboard, Farms, Alerts, Status, Landing
│           └── components/
├── infra/
│   ├── grafana/          # Dashboard provisioning
│   ├── prometheus/       # Metrics scrape config
│   ├── loki/             # Log aggregation
│   └── promtail/         # Log shipper
├── .github/workflows/    # CI/CD pipeline
└── docker-compose.yml    # Full stack orchestration
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Recharts, shadcn/ui |
| Backend | NestJS, Prisma ORM, JWT Auth |
| Database | PostgreSQL 15 |
| Monitoring | Prometheus, Grafana, Loki, Promtail |
| Telemetry | Deye Inverter Exporter (real) / Simulator |
| Infrastructure | AWS EC2, Docker Compose, Tailscale VPN |
| CI/CD | GitHub Actions |

## 📊 Features

- **SCADA-style Dashboard** — Real-time energy flow animation, KPI cards, 8+ analytics charts
- **Multi-site Solar Farm Management** — CRUD operations for farm installations
- **Live Telemetry** — Battery SOC, PV power, grid import/export, inverter temperature
- **Role-Based Access Control** — Admin and Operator roles with JWT authentication
- **Full Observability** — Node.js metrics, HTTP latency, event loop lag, application logs
- **Automated Deployment** — Push to main → live in 60 seconds

---
*B.Tech CSE 2024-2028 | Amazon Web Services Case Study | Problem Statement #42*
