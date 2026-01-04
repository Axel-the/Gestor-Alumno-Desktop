@echo off
setlocal
title Desinstalador - Gestor Alumno

echo ==============================================
echo    Desinstalador Tactico - Gestor Alumno
echo ==============================================
echo.

set "APP_NAME=Gestor Alumno"
set "EXE_NAME=Gestor Alumno.exe"
set "TARGET_DIR=%USERPROFILE%\GestorAlumnoApp"
set "SHORTCUT_PATH=%USERPROFILE%\Desktop\%APP_NAME%.lnk"

echo [!] Este proceso eliminara la aplicacion y su acceso directo.
set /p "choice=¿Estas seguro de que deseas desinstalar %APP_NAME%? (S/N): "
if /I not "%choice%"=="S" (
    echo.
    echo [v] Desinstalacion cancelada.
    pause
    exit /b
)

echo.
echo [+] Cerrando la aplicacion si esta abierta...
taskkill /F /IM "%EXE_NAME%" /T 2>nul

echo [+] Eliminando acceso directo del Escritorio...
if exist "%SHORTCUT_PATH%" (
    del /f /q "%SHORTCUT_PATH%"
    echo [v] Acceso directo eliminado.
) else (
    echo [-] No se encontro acceso directo en el escritorio.
)

echo [+] Eliminando archivos de la aplicacion en %TARGET_DIR%...
if exist "%TARGET_DIR%" (
    rd /s /q "%TARGET_DIR%"
    echo [v] Carpeta de archivos eliminada.
) else (
    echo [-] No se encontro la carpeta de instalacion.
)

echo.
echo ==============================================
echo    DESINSTALACION COMPLETADA CON EXITO
echo ==============================================
echo.
echo La aplicacion ha sido removida de tu sistema.
echo.
pause
exit
