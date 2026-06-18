# AWS Deployment Guide

This guide outlines the recommended strategy for deploying the SolarOps Solar Farm Management Cloud to a production AWS environment. Based on the project's Docker Compose architecture, an **EC2 + Docker Compose** deployment represents the most efficient path to production without introducing the heavy complexity of ECS or EKS.

## 1. AWS Infrastructure Setup

### Amazon EC2 (Elastic Compute Cloud)
1. **Instance Type**: Provision a `t3.medium` or `t3.large` instance running Ubuntu 24.04 LTS. This provides sufficient memory (4GB+) to comfortably run the entire container stack (PostgreSQL, NestJS, React, Prometheus, Grafana, Loki).
2. **Elastic IP**: Attach an Elastic IP to the instance so the public IPv4 address remains static across reboots.
3. **Storage**: Attach a minimum 30GB EBS (Elastic Block Store) `gp3` volume. Time-series databases (Prometheus/Loki) and PostgreSQL require consistent I/O.

### Security Groups (VPC)
Configure the EC2 instance's Security Group to restrict inbound traffic while allowing specific ports:

| Port | Protocol | Source | Purpose |
|------|----------|--------|---------|
| 22 | TCP | Your IP | SSH Access |
| 80 | TCP | 0.0.0.0/0 | HTTP Traffic (Nginx / Let's Encrypt) |
| 443 | TCP | 0.0.0.0/0 | HTTPS Traffic |

*Note: Do not expose PostgreSQL (5432) or Grafana (3001) directly to the internet. Route all access through a reverse proxy.*

## 2. Server Provisioning

SSH into the newly provisioned EC2 instance and execute the following bootstrap steps:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker & Git
sudo apt install docker.io docker-compose-v2 git -y

# Start and enable Docker
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu
```

## 3. Application Deployment

```bash
# Clone the repository
git clone https://github.com/yourusername/helios-control-center.git
cd helios-control-center

# Copy and modify environment variables
cp .env.example .env
nano .env # (Set secure database passwords and JWT secrets)

# Launch the stack
make build
make migrate
make seed
```

## 4. Production Considerations (Reverse Proxy)

While the frontend runs on port `5173` and the backend on `3000`, production requires mapping these to standard HTTP(S) ports using a reverse proxy.

1. **Install Nginx** directly on the host (or run it as an additional Docker container).
2. Configure Nginx to route traffic based on path:
   - `example.com/api/*` → `localhost:3000`
   - `example.com/*` → `localhost:5173`
3. Use **Certbot (Let's Encrypt)** to provision a free SSL certificate for `example.com`. Update the Nginx configuration to enforce HTTPS.

## 5. Future Scalability Improvements

As the platform scales, the EC2 monolith should be decomposed:
- **Managed Database**: Migrate from a Dockerized PostgreSQL container to AWS RDS (Relational Database Service) for automated backups and Multi-AZ high availability.
- **Container Orchestration**: Migrate from Docker Compose on EC2 to AWS Fargate (Serverless ECS) to independently scale the NestJS backend and the Vite frontend.
- **Log Archiving**: Configure Loki to use AWS S3 as an object store rather than the local EC2 filesystem.
