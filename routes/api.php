
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\InteractionController;

// Tes API
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API Laravel F-6 berhasil!',
        'data' => [
            'project' => 'CRM Klien dan Kontak',
            'status' => 'Berjalan',
        ],
    ]);
});

// API CRM F-6
Route::prefix('v1')->group(function () {

    // Klien
    Route::get('/clients', [ClientController::class, 'index']);
    Route::post('/clients', [ClientController::class, 'store']);
    Route::get('/clients/{clientId}', [ClientController::class, 'show']);
    Route::put('/clients/{clientId}', [ClientController::class, 'update']);
    Route::patch('/clients/{clientId}/status', [ClientController::class, 'updateStatus']);

    // Kontak
    Route::get('/clients/{clientId}/contacts', [ContactController::class, 'index']);
    Route::post('/clients/{clientId}/contacts', [ContactController::class, 'store']);
    Route::put('/clients/{clientId}/contacts/{contactId}', [ContactController::class, 'update']);
    Route::patch('/clients/{clientId}/contacts/{contactId}/status', [ContactController::class, 'updateStatus']);

    // Riwayat interaksi
    Route::get('/clients/{clientId}/interactions', [InteractionController::class, 'index']);
    Route::post('/clients/{clientId}/interactions', [InteractionController::class, 'store']);
});
