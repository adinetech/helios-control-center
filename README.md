# ☀️ Helios Control Center

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=flat&logo=nestjs&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)

Helios Control Center is an enterprise-grade IoT fleet management platform designed to monitor, analyze, and manage simulated solar farm telemetry in real-time. Built as a comprehensive university project demonstrating modern SaaS architecture, it features a complete observability stack, Role-Based Access Control (RBAC), and a dynamic, dark-mode-first React frontend.

## ✨ Features

- **Real-Time Telemetry Dashboard**: Live monitoring of active solar farms, tracking Battery SOC, Grid Import/Export, and PV Strings.
- **Pluggable Telemetry Providers**: Switch between a deterministic Simulator engine (for demos) and a Live Deye Inverter provider via environment variables.
- **Live "Digital Twin" Mode**: Securely pull real Prometheus telemetry from a physical Deye Hybrid Inverter over a private Tailscale network.
- **Enterprise Observability**: Fully integrated Prometheus, Grafana, Promtail, and Loki stack for metrics collection and distributed log aggregation.
- **Secure Authentication (RBAC)**: JWT-based authentication enforcing strict Admin-only access to user management and sensitive endpoints.
- **Polished UI/UX**: Built with React 19, Tailwind CSS v4, and shadcn/ui, featuring interactive Recharts, loading skeletons, and a global Command Palette (⌘K).

## 🏗️ Technology Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, TanStack Query, Recharts.
- **Backend**: NestJS, TypeScript, Prisma ORM.
- **Database**: PostgreSQL 15.
- **Monitoring**: Prometheus (Metrics), Promtail & Loki (Logs), Grafana (Dashboards).
- **Infrastructure**: Docker & Docker Compose.

## 🚀 Quick Start

The entire stack is containerized. To launch the platform:

```bash
# Clone the repository
git clone https://github.com/yourusername/helios-control-center.git
cd helios-control-center

# Build and start all services
make build

# Wait a few seconds for databases to initialize, then run migrations and seed data
make migrate
make seed
```

### Accessing the Services

- **Frontend Dashboard**: `http://localhost:5173` (Login: `admin@helios.local` / `admin`)
- **Backend Swagger API**: `http://localhost:3000/api/docs`
- **Grafana Dashboards**: `http://localhost:3001` (Login: `admin` / `admin`)
- **Adminer (DB UI)**: `http://localhost:8080`

## 🛠️ Docker & Makefile Commands

The project includes a `Makefile` to simplify common operations:

- `make up`: Starts all containers in the background.
- `make down`: Stops and removes all containers.
- `make build`: Rebuilds the frontend and backend Docker images.
- `make logs`: Tails logs for all containers.
- `make migrate`: Deploys Prisma database migrations.
- `make seed`: Seeds the database with the default Admin user and sample Solar Farms.
- `make reset`: Completely wipes volumes, rebuilds, migrates, and reseeds the environment.
- `make clean`: Removes containers, volumes, and orphaned images.
- `make status`: Shows the running status of the Docker Compose stack.

## 📂 Project Structure

```text
helios-control-center/
├── apps/
│   ├── backend/          # NestJS Application, Prisma Schema, API
│   └── frontend/         # React SPA, Vite, Tailwind v4
├── docs/                 # Architectural documentation and guides
├── infra/                # Observability configs (Prometheus, Grafana, Loki)
├── docker-compose.yml    # Root Docker stack configuration
├── Makefile              # Helper scripts
└── README.md
```

## 📊 Monitoring Stack

The platform implements a production-style observability pipeline:
1. **Prometheus**: Scrapes `/api/metrics` (NestJS) and `node-exporter` (Host metrics).
2. **Loki + Promtail**: Aggregates Docker container logs into a centralized TSDB stream.
3. **Grafana**: Automatically provisions Prometheus and Loki datasources on startup, serving pre-configured dashboards for rapid incident response.

## 🗺️ Documentation

Please refer to the `docs/` folder for detailed guides:
- [System Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [AWS Deployment Guide](docs/AWS_DEPLOYMENT.md)
- [Presentation & Viva Guide](docs/PRESENTATION.md)

## 🔮 Future Improvements

- **WebSockets / SSE**: Replace HTTP polling with Server-Sent Events or WebSockets for instant telemetry updates.
- **Microservices Split**: Decouple the `TelemetryGeneratorService` into a standalone worker node or serverless function.
- **Geospatial Queries**: Implement PostGIS to plot solar farms on a live, interactive map.
- **CI/CD Pipeline**: Integrate GitHub Actions for automated linting, testing, and Docker image pushing.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
