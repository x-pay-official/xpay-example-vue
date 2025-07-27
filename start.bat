@echo off
echo Starting X-Pay SDK Vue Example...

if not exist node_modules (
  echo Installing dependencies...
  npm install
  if %errorlevel% neq 0 (
    echo Failed to install dependencies
    exit /b 1
  )
)

echo Starting development server...
echo Once started, open your browser to: http://localhost:3000
npm run dev