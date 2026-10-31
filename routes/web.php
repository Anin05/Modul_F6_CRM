<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KlienController;
use App\Http\Controllers\KontakController;
use App\Http\Controllers\InteraksiController;
use App\Http\Controllers\ArsipController;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Master Klien
Route::prefix('klien')->name('klien.')->group(function () {
    Route::get('/', [KlienController::class, 'index'])->name('index');
    Route::get('/tambah', [KlienController::class, 'create'])->name('create');
    Route::post('/', [KlienController::class, 'store'])->name('store');
    Route::get('/export', [KlienController::class, 'export'])->name('export');
    Route::get('/{kode}', [KlienController::class, 'show'])->name('show');
    Route::get('/{kode}/edit', [KlienController::class, 'edit'])->name('edit');
    Route::put('/{kode}', [KlienController::class, 'update'])->name('update');
    Route::delete('/{kode}', [KlienController::class, 'destroy'])->name('destroy');
    Route::post('/{kode}/arsipkan', [KlienController::class, 'arsipkan'])->name('arsipkan');
    Route::post('/{kode}/pulihkan', [KlienController::class, 'pulihkan'])->name('pulihkan');
});

// Kontak Klien
Route::prefix('kontak')->name('kontak.')->group(function () {
    Route::get('/', [KontakController::class, 'index'])->name('index');
    Route::get('/tambah', [KontakController::class, 'create'])->name('create');
    Route::post('/', [KontakController::class, 'store'])->name('store');
    Route::get('/{id}/edit', [KontakController::class, 'edit'])->name('edit');
    Route::put('/{id}', [KontakController::class, 'update'])->name('update');
    Route::post('/{id}/toggle', [KontakController::class, 'toggleStatus'])->name('toggle');
    Route::delete('/{id}', [KontakController::class, 'destroy'])->name('destroy');
});

// Riwayat Interaksi
Route::prefix('riwayat')->name('riwayat.')->group(function () {
    Route::get('/', [InteraksiController::class, 'index'])->name('index');
    Route::get('/catat', [InteraksiController::class, 'create'])->name('create');
    Route::post('/', [InteraksiController::class, 'store'])->name('store');
});

// Arsip
Route::prefix('arsip')->name('arsip.')->group(function () {
    Route::get('/', [ArsipController::class, 'index'])->name('index');
});
