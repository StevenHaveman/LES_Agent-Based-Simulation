@echo off
echo Starting INSIGHT: Integrated Neighborhood Simulation for Informing Green Housing Transitions

start "Frontend" cmd /k "cd frontend && npm run dev"
start "Ollama" cmd /k "ollama serve"
start "Backend" cmd /k "python backend/abm/app.py"

echo.
echo All services have been started.
pause