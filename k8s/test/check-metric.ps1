curl -X POST 'http://localhost:9090/api/v1/query?query=sum(rate(container_cpu_usage_seconds_total{job="kubelet", image!="", container!="POD"}[5m]))/sum(machine_cpu_cores)'
