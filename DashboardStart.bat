@echo off
setlocal

:: Get the folder path where this batch file is located (with trailing backslash)
set "BasePath=%~dp0"

:: Convert Windows path to file URI format by replacing backslashes with slashes
set "BasePathURI=%BasePath:\=/%"

:: Full URI to the HTML dashboard
set "HTML_URI=file:///%BasePathURI%SI_ElKanaouet.html"

:: Path to the Startup folder
set "StartupFolder=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

:: Name of the shortcut
set "ShortcutPath=%StartupFolder%\SI_ElKanaouet_Dashboard.url"

:: Create the shortcut file
(
    echo [InternetShortcut]
    echo URL=%HTML_URI%
) > "%ShortcutPath%"

:: Open the dashboard now
start "" "%HTML_URI%"

pause
endlocal
