#!/bin/bash

# Kill process on port 5173 if it exists
echo "🔍 Checking for processes on port 5173..."

# For Windows (using netstat and taskkill)
if command -v netstat.exe &> /dev/null; then
  PID=$(netstat -ano | findstr :5173 | awk '{print $5}' | head -1)
  if [ ! -z "$PID" ]; then
    echo "🔥 Killing process $PID on port 5173..."
    taskkill //PID $PID //F
    echo "✅ Port 5173 cleared"
  else
    echo "✅ Port 5173 is already free"
  fi
# For Unix-like systems (Linux/macOS)
elif command -v lsof &> /dev/null; then
  PID=$(lsof -ti:5173)
  if [ ! -z "$PID" ]; then
    echo "🔥 Killing process $PID on port 5173..."
    kill -9 $PID
    echo "✅ Port 5173 cleared"
  else
    echo "✅ Port 5173 is already free"
  fi
else
  echo "⚠️ Could not detect system type for port cleanup"
fi

echo "🚀 Starting Vite dev server..."
vite
