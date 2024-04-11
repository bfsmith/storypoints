# Deploy
```sh
kubectl create secret generic bible-postgres-creds --from-literal=username='bible' --from-literal=password='password'
kubectl create secret generic bible-db --from-literal=connection_string='postgres://bible:PASSWORD@bible-postgres:5432/bible'
kubectl create secret generic bible-auth --from-literal=auth_key='key'
kubectl apply -f .
```
