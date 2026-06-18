# API Documentation

The Helios Control Center backend exposes a RESTful JSON API. All endpoints (except login) require a valid JWT Bearer token.

**Base URL**: `http://localhost:3000`  
**Swagger UI**: `http://localhost:3000/api/docs`

---

## Authentication

### Login
`POST /api/auth/login`

Authenticates a user and returns a JWT token.

**Request Body**
```json
{
  "email": "admin@helios.local",
  "password": "admin"
}
```

**Response (200 OK)**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Dashboard

### Get Summary
`GET /api/dashboard/summary`

Returns aggregated KPIs for the main dashboard view.

**Response (200 OK)**
```json
{
  "totalFarms": 12,
  "activeFarms": 10,
  "totalEnergyToday": 450.5,
  "averagePowerOutput": 85.2,
  "warnings": 2,
  "telemetryCount": 15000
}
```

### Get Telemetry History
`GET /api/dashboard/history`

Returns the global telemetry averages across all farms over the last 60 minutes for time-series charts.

**Response (200 OK)**
```json
[
  {
    "timestamp": "2026-06-18T10:00:00Z",
    "powerOutput": 420.5,
    "temperature": 28.5,
    "irradiance": 850.2,
    "efficiency": 18.5
  }
]
```

---

## Solar Farms

### List Farms
`GET /api/farms`

Returns a list of all solar farms.

### Get Farm by ID
`GET /api/farms/:id`

Returns detailed metadata about a specific solar farm.

### Get Farm Telemetry
`GET /api/farms/:id/telemetry`

Returns the historical telemetry data generated specifically by this farm for the details page charts.

---

## Users (Admin Only)

### List Users
`GET /api/users`

Returns all registered users. Requires the `ADMIN` role.

**Error Response (403 Forbidden)**
```json
{
  "message": "Forbidden resource",
  "error": "Forbidden",
  "statusCode": 403
}
```

---

## Observability / System

### Health Check
`GET /api/health`

Validates database connectivity and application state. Used by Docker container health checks.

### Prometheus Metrics
`GET /api/metrics`

Returns raw Prometheus-formatted scrape metrics (uptime, HTTP request duration, event loop lag, etc).
