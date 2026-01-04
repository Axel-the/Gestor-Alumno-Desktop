@echo off
setlocal
title Instalador - Gestor Alumno

echo ==============================================
echo    Instalador Tactico - Gestor Alumno
echo ==============================================
echo.

set "APP_NAME=Gestor Alumno"
set "EXE_NAME=Gestor Alumno.exe"
set "SOURCE_DIR=%~dp0dist-electron\win-unpacked"
set "TARGET_DIR=%USERPROFILE%\GestorAlumnoApp"

if not exist "%SOURCE_DIR%\%EXE_NAME%" (
    echo [ERROR] No se seleccionaron los archivos base. 
    echo Asegurate de haber ejecutado 'npm run build' primero.
    pause
    exit /b
)

echo [+] Creando carpeta de aplicacion en %TARGET_DIR%...
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
xcopy /E /I /Y "%SOURCE_DIR%\*" "%TARGET_DIR%\" >nul

echo [+] Creando acceso directo en el Escritorio...
set "VBS_SCRIPT=%TEMP%\CreateShortcut.vbs"
echo Set oWS = CreateObject("WScript.Shell") > "%VBS_SCRIPT%"
echo sLinkFile = oWS.SpecialFolders("Desktop") ^& "\%APP_NAME%.lnk" >> "%VBS_SCRIPT%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%VBS_SCRIPT%"
echo oLink.TargetPath = "%TARGET_DIR%\%EXE_NAME%" >> "%VBS_SCRIPT%"
echo oLink.WorkingDirectory = "%TARGET_DIR%" >> "%VBS_SCRIPT%"
echo oLink.Description = "Gestor de Alumnos - Desktop" >> "%VBS_SCRIPT%"
echo oLink.IconLocation = "%TARGET_DIR%\logo.jpeg" >> "%VBS_SCRIPT%"
echo oLink.Save >> "%VBS_SCRIPT%"

cscript /nologo "%VBS_SCRIPT%"
del "%VBS_SCRIPT%"

echo.
echo ==============================================
echo    INSTALACION COMPLETADA CON EXITO
echo ==============================================
echo.
echo Ya puedes cerrar esta ventana y abrir la app
echo desde el acceso directo en tu Escritorio.
echo.
pause
exit
