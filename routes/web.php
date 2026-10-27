<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;

Route::get('/', function () {
    return redirect()->route('clients.index');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

// CRUD Klien Route
Route::resource('clients', ClientController::class);
Route::get('clients-export', [ClientController::class, 'export'])->name('clients.export');