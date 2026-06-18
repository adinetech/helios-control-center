# System Architecture

Helios Control Center is built using a modern, decoupled microservices-oriented architecture orchestrated by Docker Compose. This document details the structural components and the architectural decisions driving the project.

## 1. Overall System Architecture

The ecosystem relies on a strict separation of concerns, heavily utilizing RESTful HTTP boundaries and centralized database storage.

```mermaid
graph TD
    User([End User]) -->|HTTP :5173| Frontend[React Dashboard]
    Admin([System Admin]) -->|HTTP :3001| Grafana[Grafana]
    
    Frontend -->|HTTP/REST :3000| Backend[NestJS Backend]
    Grafana -->|Query Metrics| Prometheus[Prometheus]
    Grafana -->|Query Logs| Loki[Loki]
    
    Backend -->|TCP :5432| DB[(PostgreSQL)]
    Backend -->|Expose :3000/api/metrics| Prometheus
    
    subgraph Telemetry Abstraction
        Backend -->|TELEMETRY_PROVIDER| Provider{TelemetryProvider}
        Provider -->|simulator| Simulator[Sine Wave Simulator]
        Provider -->|deye| Deye[Deye Live Fetcher]
    end
    
    Deye -->|Tailscale VPN :9105| HomeInverter[Home Deye Inverter Exporter]
    
    Promtail[Promtail] -->|Reads /var/log| DockerEngine
    Promtail -->|Pushes Logs| Loki
```

## 2. Request Flow (Authentication)

This sequence demonstrates how the frontend securely retrieves protected telemetry using JWT authentication.

```mermaid
sequenceDiagram
    participant User
    participant React as Frontend (React)
    participant Nest as Backend (NestJS)
    participant DB as PostgreSQL
    
    User->>React: Enters Credentials
    React->>Nest: POST /api/auth/login
    Nest->>DB: Query User (Email)
    DB-->>Nest: Return Hashed Hash
    Nest->>Nest: Verify bcrypt hash
    Nest-->>React: Return JWT Token
    React->>React: Store JWT in Zustand
    React->>Nest: GET /api/dashboard/summary (Auth Bearer)
    Nest->>DB: Query Telemetry Aggregates
    DB-->>Nest: Return Data
    Nest-->>React: Return JSON Response
```

## 3. Database ER Diagram

The relational structure focuses on Solar Farms and their continuous stream of generated Telemetry.

```mermaid
erDiagram
    User {
        int id PK
        string email
        string password
        string role
        DateTime createdAt
    }
    
    Farm {
        int id PK
        string name
        string location
        float capacityMw
        string status
        DateTime createdAt
    }
    
    Telemetry {
        int id PK
        int farmId FK
        float powerOutputKw
        float pv1PowerKw
        float batterySoc
        float gridPowerKw
        float loadPowerKw
        DateTime timestamp
    }
    
    Farm ||--o{ Telemetry : "Generates"
```

## 4. Key Architectural Decisions

### Why NestJS for the Backend?
NestJS enforces a highly structured, Angular-like modular architecture. By using Dependency Injection and strict TypeScript decorators, it ensures the codebase remains maintainable, testable, and scalable as business logic complexities (like the `TelemetryGeneratorService`) grow.

### Why Prisma ORM over TypeORM?
Prisma provides strict type safety directly tied to the database schema. Rather than manually defining entity classes that can drift from the database structure, Prisma generates a customized TypeScript client, ensuring query safety at compile-time.

### Why React & Tailwind v4?
React provides a predictable, component-driven UI. Tailwind CSS v4 eliminates the need for bulky configuration files and provides an incredibly rapid styling developer experience. Using `shadcn/ui` leverages Radix UI's accessibility primitives, resulting in an enterprise-grade interface without massive custom CSS overhead.

### Why Docker Compose?
For this university project and initial client deliverables, Docker Compose provides a deterministic, infrastructure-as-code environment. Every developer and evaluator can reproduce the exact production environment with a single command (`make up`), eliminating "it works on my machine" inconsistencies.

### Why Prometheus + Grafana + Loki?
Instead of relying on basic `console.log`, implementing a full observability stack demonstrates an understanding of production infrastructure. Prometheus handles quantitative metrics (time-series polling), while Loki handles qualitative metrics (error logs), combining cleanly into unified Grafana dashboards.
