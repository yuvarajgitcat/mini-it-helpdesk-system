# 15-minute demo script

## Before recording (5 min)
- Close the browser, VS Code and chat apps; keep two PowerShell windows and one browser tab.
- Window 1: `cd` to helpdesk-app, run `minikube status` and `kubectl get pods -n helpdesk` (all Running).
- Window 2: `kubectl port-forward svc/web 8080:80 -n helpdesk` (leave it open). Browser: http://localhost:8080
- Increase PowerShell font size. Keep `docs\evidence\` open in File Explorer.
- Rehearse once; the whole run is about 12 minutes of live commands.

## 0:00-1:30  Problem and architecture
Say: the helpdesk app already worked with local dev servers; the goal is to run it under Kubernetes and prove
scheduling, resource limits, fault recovery and persistence. Show the architecture lines and the component table
in `docs\PROJECT.md`: web x2 -> api x2 -> postgres x1, two PVCs.

## 1:30-3:00  The application running on Kubernetes
Browser: dashboard, tickets page, open a ticket with evidence (thumbnail shows), change one status.
Say: the browser talks only to nginx; nginx proxies /api and /uploads to the API; the API reads PostgreSQL.
```powershell
kubectl get deploy,pods,svc,pvc -n helpdesk -o wide
```

## 3:00-5:00  Scheduling, replicas, limits, probes
```powershell
kubectl describe node minikube | Select-String "Allocated resources" -Context 0,6
kubectl describe deploy api -n helpdesk | Select-String "Replicas:|Image:|Limits:|Requests:|cpu:|memory:|Liveness:|Readiness:|RollingUpdateStrategy"
```
Say: the scheduler placed every Pod on the one node; requests are what it reserves, limits are the ceiling;
readiness decides whether a Pod receives traffic, liveness decides whether it is restarted.

## 5:00-7:30  Fault recovery: delete an API Pod under traffic
```powershell
$web = ((kubectl get pods -n helpdesk -l app=web --no-headers | Where-Object { $_ -match "Running" }) -split "\s+")[0]
$victim = ((kubectl get pods -n helpdesk -l app=api --no-headers | Where-Object { $_ -match "Running" }) -split "\s+")[0]
kubectl delete pod -n helpdesk $victim --wait=false
1..12 | ForEach-Object { $r = kubectl exec -n helpdesk $web -- sh -c "wget -q -O /dev/null http://api:5000/api/tickets && echo OK || echo FAIL"; "$r   readyReplicas=$(kubectl get deploy api -n helpdesk -o jsonpath='{.status.readyReplicas}')"; Start-Sleep 1 }
kubectl get pods -n helpdesk -l app=api
```
Say: requests keep succeeding because the second replica serves them; the ReplicaSet notices 1/2 and creates a
replacement; readyReplicas returns to 2 in about 7 seconds (measured).

## 7:30-10:00  Persistence: delete the database Pod
```powershell
$q = "select count(*) from tickets"
kubectl exec -n helpdesk deploy/postgres -- psql -U helpdesk -d helpdesk -t -A -c $q
kubectl exec -n helpdesk deploy/postgres -- psql -U helpdesk -d helpdesk -c "insert into tickets (employee_id,asset_id,title,description) values ((select min(employee_id) from employees),(select min(asset_id) from assets),'PERSISTENCE-TEST','survives pod deletion')"
kubectl exec -n helpdesk deploy/postgres -- psql -U helpdesk -d helpdesk -t -A -c $q
kubectl delete pod -n helpdesk -l app=postgres
kubectl wait --for=condition=Ready pod -l app=postgres -n helpdesk --timeout=120s
kubectl exec -n helpdesk deploy/postgres -- psql -U helpdesk -d helpdesk -t -A -c "select ticket_id,title from tickets where title='PERSISTENCE-TEST'"
kubectl logs -n helpdesk deploy/postgres | Select-String "Skipping initialization"
kubectl exec -n helpdesk deploy/postgres -- psql -U helpdesk -d helpdesk -c "delete from tickets where title='PERSISTENCE-TEST'"
```
Say: the Pod is new, the volume is the same PVC; Postgres found its data directory and skipped initialisation.
Mention: deleting the PVC would delete the data (reclaim policy Delete). Expect the count to be 7, then 8, then 8.

## 10:00-11:30  Resource limits
```powershell
kubectl apply -f k8s\experiments\oom-test.yaml
Start-Sleep 20
kubectl get pod oom-test -n helpdesk -o jsonpath="{.status.containerStatuses[0].state.terminated.reason} exit={.status.containerStatuses[0].state.terminated.exitCode}"
kubectl delete pod oom-test -n helpdesk
```
Say: memory is not compressible, so exceeding the limit kills the container (OOMKilled, 137). For CPU, show
`docs\evidence\stage4.txt`: an infinite loop was held at 101m against a 100m limit, because CPU is throttled, not killed.

## 11:30-13:00  Problems found and fixed (show docs\PROJECT.md section 4)
1. pg_dump from PostgreSQL 18 failed to load into 16 (`transaction_timeout`): the database came up empty; removed the line.
2. API v1 crashed when the database Pod was deleted (unhandled pool error); v2 adds a handler; re-test: 0 restarts.
3. Rolling update v1 -> v2 under traffic: 0 of 9 requests failed (`docs\evidence\stage4b.txt`).
4. Evidence images used a hard-coded localhost URL; fixed in web v2.

## 13:00-14:30  Limitations (say them plainly)
- Single node: no node-failure recovery. One database replica: about 7 s of errors while it restarts, no failover.
- The API readiness probe does not check the database. Uploads volume is ReadWriteOnce (fine on one node).
- Demo credentials in a plain Secret. Autoscaling not attempted because of memory.

## 14:30-15:00  Close
Four claims demonstrated: app on Kubernetes; replicas with limits; deleted API Pod recovered; database data survived.
Everything is reproducible with `k8s\deploy-from-scratch.ps1`; evidence is in `docs\evidence\`.

## If something goes wrong while recording
- Port-forward dead: Ctrl+C, rerun it, hard refresh the browser.
- Cluster stopped: `minikube start --driver=docker`, wait for Pods Running.
- A command fails: say what you expected, show the error, move on. Evidence files back up every claim.