@echo off
setlocal
cd /d "%~dp0.."
echo Iniciando las bases de Cine Bogota...
docker compose -f integracion/compose.yml up -d --wait
if errorlevel 1 goto error
if not exist ".venv\Scripts\python.exe" (
  python -m venv .venv
  if errorlevel 1 goto error
)
".venv\Scripts\python.exe" -m pip install -r integracion/requirements.txt
if errorlevel 1 goto error
set "POSTGRES_URL=postgresql://cine:cine_demo_local@127.0.0.1:55432/cine_bogota"
set "MONGODB_URI=mongodb://127.0.0.1:57017"
if not defined MONGODB_DATABASE set "MONGODB_DATABASE=cine_bogota_avance2"
echo.
echo Abre http://127.0.0.1:5000/ en tu navegador.
echo Mantenga esta ventana abierta mientras usa la aplicacion.
echo.
".venv\Scripts\python.exe" -m flask --app integracion.app run --host 127.0.0.1
if errorlevel 1 goto error
goto fin
:error
echo.
echo No se pudo iniciar Cine Bogota. Revisa que Docker Desktop y Python esten disponibles.
pause
:fin
endlocal
