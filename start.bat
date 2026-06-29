@echo off
echo Starting INNO 625...

start "Frontend" cmd /k "cd frontend && npm run dev"
start "Ollama" cmd /k "ollama serve"
start "Backend" cmd /k "python backend/abm/app.py"

echo.
echo All services have been started.
pause