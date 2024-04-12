# Development
```sh
npm start
```
http://localhost:3000

# Deployment
The docker file builds and packages everything. Run it locally with `npm run docker`  and `npm run docker:run`.
http://localhost:8080

GitHub Actions will build the docker file and host it in the GitHub container registry.
Once the new version is pushed, run `k apply -f k8s/app.yaml` to apply it to the cluster.

If that doesn't trigger a new pod to start, delete the current pod to have it pull the new image.
