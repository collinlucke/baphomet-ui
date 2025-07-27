# Kill process on port 5173 if it exists
Write-Host "🔍 Checking for processes on port 5173..." -ForegroundColor Cyan

try {
  # Find process using port 5173
  $process = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -First 1
    
  if ($process) {
    $processId = $process.OwningProcess
    Write-Host "🔥 Killing process $processId on port 5173..." -ForegroundColor Yellow
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Port 5173 cleared" -ForegroundColor Green
    Start-Sleep -Seconds 1
  }
  else {
    Write-Host "✅ Port 5173 is already free" -ForegroundColor Green
  }
}
catch {
  # Fallback to netstat method
  try {
    $netstatOutput = netstat -ano | Select-String ":5173"
    if ($netstatOutput) {
      $processId = ($netstatOutput[0] -split '\s+')[4]
      Write-Host "🔥 Killing process $processId on port 5173..." -ForegroundColor Yellow
      taskkill /PID $processId /F | Out-Null
      Write-Host "✅ Port 5173 cleared" -ForegroundColor Green
      Start-Sleep -Seconds 1
    }
    else {
      Write-Host "✅ Port 5173 is already free" -ForegroundColor Green
    }
  }
  catch {
    Write-Host "⚠️ Could not check/clear port 5173" -ForegroundColor Yellow
  }
}

Write-Host "🚀 Starting Vite dev server..." -ForegroundColor Cyan
npx vite
