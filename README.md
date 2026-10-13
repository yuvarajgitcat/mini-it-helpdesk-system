# Mini IT Helpdesk System on Kubernetes

An IT helpdesk application (tickets, employees, assets, evidence uploads, similar-ticket search) deployed on a
local Kubernetes cluster (Minikube) to study **container scheduling, resource management and fault recovery**.

## Stack
React + Vite + Tailwind/shadcn (frontend, served by nginx) | Node.js + Express + `pg` + Multer (API) |
PostgreSQL 16 with `pg_trgm` | Docker | Minikube / Kubernetes

## Architecture
```
Browser -> web Service (NodePort) -> 2 x nginx Pods (React build; proxies /api and /uploads)
        -> api Service (ClusterIP) -> 2 x Express Pods (shared uploads volume)
        -> postgres Service        -> 1 x PostgreSQL Pod (persistent volume)
```

| Component | Replicas | CPU request / limit | Memory request / limit | Storage |
|---|---|---|---|---|
| web (nginx + React build) | 2 | 25m / 100m | 32Mi / 64Mi | none |
| api (Express) | 2 | 100m / 300m | 128Mi / 256Mi | `uploads-pvc` 1Gi |
| postgres 16 | 1 | 100m / 500m | 256Mi / 512Mi | `postgres-pvc` 1Gi |

Readiness and liveness probes are set on all three. The API deployment uses a rolling update with
`maxUnavailable: 0`.

## What was demonstrated (measured on a single-node Minikube)
| Experiment | Result |
|---|---|
| Delete one API Pod under continuous requests | All requests succeeded; 2/2 ready again in about 7 s |
| Delete the PostgreSQL Pod | Data intact after replacement (same PVC); API returned errors for about 7 s, then recovered |
| Memory limit exceeded | Container `OOMKilled` (exit 137) |
| CPU limit with a busy loop | Held at about 101m against a 100m limit |
| Rolling update API v1 -> v2 under traffic | 0 of 9 requests failed |

Problems found and fixed along the way (PostgreSQL 18 dump vs 16 server, API crash on database loss,
hard-coded URLs in the frontend) are written up in [`docs/PROJECT.md`](docs/PROJECT.md), with raw command output
in [`docs/evidence/`](docs/evidence/).

## Run it on Kubernetes
Requirements: Docker, Minikube, kubectl, PowerShell. From the repository root:
```powershell
powershell -File k8s\deploy-from-scratch.ps1
kubectl port-forward svc/web 8080:80 -n helpdesk
```
Open http://localhost:8080. A fresh clone loads `database/schema.sql`, `day12.sql` and `seed.sql` (sample data).

## Run it locally without Kubernetes
Backend: create `backend/.env` with `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, then
`cd backend; npm install; node src/server.js` (port 5000). Frontend: `cd frontend; npm install; npm run dev`.

## Repository layout
- `backend/`, `frontend/` application code and Dockerfiles
- `k8s/` manifests, `k8s/experiments/` limit tests, `k8s/deploy-from-scratch.ps1`
- `database/` schema, hardening SQL, sample data
- `docs/PROJECT.md` full report, `docs/DEMO-SCRIPT.md` demo script, `docs/evidence/` outputs

## Limitations
Single node (no node-failure recovery); one database replica (short outage on restart, no failover); the API
readiness probe does not check the database; the uploads volume is ReadWriteOnce; the Secret holds demo
credentials in plain YAML; autoscaling was not attempted.