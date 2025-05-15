$image_name = "josephyusmita/stripped-autoscaler"

# Read env file
Get-Content .env | ForEach-Object {
  if($_ -match '^\s*([^#][^=]*)=(.*)$') {
    $key = $matches[1].Trim()
    $value = $matches[2].Trim()
    [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
  }
}

docker build -t $image_name .
docker run -d --name 'scheduler-api' -p "${env:PORT}:${env:PORT}" $image_name
