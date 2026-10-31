@echo off
title ANAHEIM CRM - Laravel Server
set PATH=C:\laragon\bin\php\php-8.3.36-Win32-vs16-x64;C:\laragon\bin\composer;%PATH%
echo ========================================================
echo   ANAHEIM CRM - PT Anaheim Nimbus Universal
echo   Modul CRM Klien & Kontak (Laravel Framework)
echo ========================================================
echo.
echo Server sedang berjalan...
echo Buka di browser: http://127.0.0.1:8000
echo.
echo (Tekan Ctrl+C untuk menghentikan server)
echo ========================================================
echo.
php artisan serve
pause

