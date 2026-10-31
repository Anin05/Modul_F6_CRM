@echo off
title Reset & Seed Database - ANAHEIM CRM
set PATH=C:\laragon\bin\php\php-8.3.36-Win32-vs16-x64;C:\laragon\bin\composer;%PATH%
echo Mereset database dan mengisi kembali data CRM Anaheim...
php artisan migrate:fresh --seed
echo.
echo Selesai!
pause

