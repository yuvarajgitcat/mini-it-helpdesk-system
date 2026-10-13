# Container Scheduling, Resource Management and Fault Recovery with Kubernetes
IT Helpdesk application (React + Express + PostgreSQL) deployed on a local Minikube cluster.

## 1. Architecture
Browser -> Service `web` (NodePort) -> 2 x nginx Pods (serve React build, proxy `/api` and `/uploads`)
-> Service `api` (ClusterIP) -> 2 x Express Pods -> Service `postgres` -> 1 x PostgreSQL 16 Pod.

| Component | Kubernetes object | Replicas | CPU request/limit | Memory request/limit | Storage |
|---|---|---|---|---|---|
| web (nginx + React build, image v2) | Deployment + NodePort Service | 2 | 25m / 100m | 32Mi / 64Mi | none |
| api (Express, image v2) | Deployment + ClusterIP Service | 2 | 100m / 300m | 128Mi / 256Mi | `uploads-pvc` (1Gi) at /app/uploads |
| postgres 16 | Deployment (Recreate) + ClusterIP Service | 1 | 100m / 500m | 256Mi / 512Mi | `postgres-pvc` (1Gi) |

Configuration: Secret `db-secret` (database name, user, password; demo values only). ConfigMap `db-init`
holds the SQL that initialises an empty database on first start. API and web both define readiness and
liveness probes. The API deployment uses a rolling update with maxUnavailable 0 and maxSurge 1.

## 2. How the four success criteria were met
1. **Helpdesk runs through Kubernetes.** All three tiers run as Pods; the cluster database holds the real
   data (3 employees, 3 assets, 7 tickets, 2 history rows, 3 evidence rows). Evidence: `docs/evidence/stage2c.txt`, `final-state.txt`.
2. **Multiple replicas with explicit CPU/memory settings.** 2 API and 2 web replicas, limits shown above.
   Evidence: `stage3.txt`, `final-state.txt`.
3. **Deleted API Pod is recreated.** With one API Pod deleted under continuous requests, every request still
   succeeded (the other replica served them) and the Deployment was back to 2/2 ready in about 7 seconds. Evidence: `stage4.txt` section 2.
4. **Database data survives Pod replacement.** A marker ticket was inserted, the PostgreSQL Pod was deleted,
   and the replacement Pod (same PVC) returned the same ticket count; its log says initialisation was skipped.
   Evidence: `stage4.txt` section 3.

## 3. Additional experiments
| Experiment | Result |
|---|---|
| Memory limit (Pod allocating past 64Mi) | `OOMKilled`, exit code 137 |
| CPU limit (busy loop, limit 100m) | `kubectl top` showed 101m |
| Rolling update v1 -> v2 under traffic | 0 of 9 requests failed; 13 s; new Pods started before old ones stopped |
| Shared uploads | File written in one API Pod read from the other; existing evidence images served by the API |
| Database Pod deleted (API v2) | API returned HTTP 500 for about 7 s, then recovered without a restart; data intact |
| Node allocation at Stage 4 | CPU requests 32%, memory requests 26% of the single Minikube node |

## 4. Problems found and fixed
1. **Dump version mismatch.** The local PostgreSQL is 18 and the cluster image is 16. `pg_dump` wrote
   `SET transaction_timeout`, which version 16 rejects; initialisation aborted and the database came up empty.
   Fixed by removing that line and the `\restrict` / `\unrestrict` lines into `database/full_dump_pg16.sql`.
2. **API crash on database loss.** With API v1, deleting the database Pod made one API container exit with
   code 1 (unhandled `error` event from an idle pool connection); Kubernetes restarted it. Fixed in `backend/src/db.js` by adding
   a `pool.on("error")` handler (image v2). Re-test: both API Pods stayed at 0 restarts and logged the handled error instead.
3. **Hard-coded API URL.** `frontend/src/services/api.js` pointed to `localhost:5000`; it now uses
   `VITE_API_BASE`, set to `/api` in the image build (original saved in `docs/evidence/api.js.original`).

4. **Evidence images used a hard-coded address.** `TicketsPage.jsx` built image URLs as `http://localhost:5000` + `file_url`,
   which a browser cannot reach through Kubernetes, so no evidence image displayed. Fixed to use the relative `/uploads/...`
   path (served by nginx, proxied to the API) when `VITE_API_BASE` is set (web image v2; original in
   `docs/evidence/TicketsPage.jsx.original`). Verified in the browser with an old and a newly uploaded image.

## 5. Limitations
- Single-node Minikube: no node-failure recovery; Pods share one machine.
- One PostgreSQL replica: a database Pod restart causes a short outage (about 7 s measured); no replication or failover.
- The API readiness probe checks that the server responds, not that the database is reachable.
- `uploads-pvc` is ReadWriteOnce; it works here because there is one node. A multi-node cluster would need shared storage (for example NFS).
- The `standard` storage class has reclaim policy Delete: deleting a Pod keeps data, deleting the PVC removes it.
- The Secret holds demo credentials in plain YAML; a real deployment would use an external secret store.
- Autoscaling was out of scope for the available memory.

## 6. Files
- `k8s/` manifests, `k8s/experiments/` limit tests, `k8s/deploy-from-scratch.ps1` full rebuild
- `database/` schema, hardening SQL, `full_dump_pg16.sql` (loaded into the cluster)
- `docs/evidence/` command output from every stage
- The real-data dumps (database/full_dump*.sql) are not committed to the public repository; a fresh clone loads schema.sql, day12.sql and seed.sql (sample data) instead.
