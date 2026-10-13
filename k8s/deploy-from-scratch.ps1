# Rebuilds the whole helpdesk system on a fresh Minikube cluster.
# Run from the helpdesk-app folder: powershell -File k8s\deploy-from-scratch.ps1
minikube start --driver=docker
docker build -t helpdesk-api:v2 backend
docker build -t helpdesk-web:v2 frontend
minikube image load helpdesk-api:v2
minikube image load helpdesk-web:v2

kubectl apply -f k8s\00-namespace.yaml
kubectl apply -f k8s\01-secret.yaml
if (Test-Path database\full_dump_pg16.sql) {
  kubectl create configmap db-init -n helpdesk --from-file=01-full.sql=database\full_dump_pg16.sql --dry-run=client -o yaml | kubectl apply -f -
} else {
  # public clone: no real data, load schema + sample rows instead
  kubectl create configmap db-init -n helpdesk --from-file=01-schema.sql=database\schema.sql --from-file=02-day12.sql=database\day12.sql --from-file=03-seed.sql=database\seed.sql --dry-run=client -o yaml | kubectl apply -f -
}
kubectl apply -f k8s\15-uploads-pvc.yaml -f k8s\10-postgres.yaml
kubectl rollout status deploy/postgres -n helpdesk --timeout=240s
kubectl apply -f k8s\20-api.yaml -f k8s\30-web.yaml
kubectl rollout status deploy/api -n helpdesk --timeout=180s
kubectl rollout status deploy/web -n helpdesk --timeout=120s
minikube addons enable metrics-server

# copy existing evidence files into the shared uploads volume
$pod = kubectl get pods -n helpdesk -l app=api -o jsonpath="{.items[0].metadata.name}"
if (Test-Path backend\uploads) { kubectl cp backend/uploads "helpdesk/${pod}:/app/uploads" }
kubectl exec -n helpdesk $pod -- sh -c "[ -d /app/uploads/uploads ] && mv /app/uploads/uploads/* /app/uploads/ && rmdir /app/uploads/uploads; true"

Write-Host "Open the UI with: kubectl port-forward svc/web 8080:80 -n helpdesk   then http://localhost:8080"