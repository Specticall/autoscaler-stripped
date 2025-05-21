helm upgrade kube-prometheus-stack prometheus-community/kube-prometheus-stack `
  -n monitoring `
  -f high-cpu-rule.yaml
