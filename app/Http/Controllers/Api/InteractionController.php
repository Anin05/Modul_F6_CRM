<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Interaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InteractionController extends Controller
{
    // GET /api/v1/clients/{clientId}/interactions
    public function index(string $clientId): JsonResponse
    {
        $client = Client::find($clientId);

        if (!$client) {
            return response()->json([
                'error' => [
                    'code' => 'CLIENT_NOT_FOUND',
                    'message' => 'Klien tidak ditemukan.',
                    'details' => null,
                ],
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $client->interactions()
                ->orderByDesc('interaction_at')
                ->get(),
        ]);
    }

    // POST /api/v1/clients/{clientId}/interactions
    public function store(Request $request, string $clientId): JsonResponse
    {
        $client = Client::find($clientId);

        if (!$client) {
            return response()->json([
                'error' => [
                    'code' => 'CLIENT_NOT_FOUND',
                    'message' => 'Klien tidak ditemukan.',
                    'details' => null,
                ],
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'type' => [
                'required',
                'in:Telepon,WhatsApp,Email,Meeting,Kunjungan',
            ],
            'notes' => ['required', 'string'],
            'interaction_at' => ['required', 'date'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'Data interaksi tidak valid.',
                    'details' => $validator->errors(),
                ],
            ], 400);
        }

        $interaction = $client->interactions()->create(
            $validator->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Interaksi berhasil dicatat.',
            'data' => $interaction,
        ], 201);
    }
}
