kubectl create deployment cpu-hog `
  --image=polinux/stress `
  --replicas=3 `
  -- /bin/sh -c "stress --cpu 12 --timeout 300"
