Write-Host "Applying config..."
$env:KUBECONFIG = "$HOME\.kube\config;$HOME\master-kubeconfig.yaml"
kubectl config view --flatten > $HOME\.kube\config.merged
Move-Item $HOME\.kube\config.merged $HOME\.kube\config -Force

Write-Host "Kube config merged"
