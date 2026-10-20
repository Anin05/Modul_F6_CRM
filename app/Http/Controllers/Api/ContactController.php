<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    // GET /api/v1/clients/{clientId}/contacts
    public function index(Request $request, string $clientId): JsonResponse
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

        $query = $client->contacts();

        if ($request->filled('jenis')) {
            $query->where('type', $request->query('jenis'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        return response()->json([
            'success' => true,
            'data' => $query->orderBy('name')->get(),
        ]);
    }

    // POST /api/v1/clients/{clientId}/contacts
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
            'name' => ['required', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'in:PIC,Direktur'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'Data kontak tidak valid.',
                    'details' => $validator->errors(),
                ],
            ], 400);
        }

        $contact = $client->contacts()->create([
            ...$validator->validated(),
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kontak berhasil ditambahkan.',
            'data' => $contact,
        ], 201);
    }

    // PUT /api/v1/clients/{clientId}/contacts/{contactId}
    public function update(
        Request $request,
        string $clientId,
        string $contactId
    ): JsonResponse {
        $contact = Contact::where('client_id', $clientId)
            ->where('id', $contactId)
            ->first();

        if (!$contact) {
            return response()->json([
                'error' => [
                    'code' => 'CONTACT_NOT_FOUND',
                    'message' => 'Kontak tidak ditemukan.',
                    'details' => null,
                ],
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'position' => ['sometimes', 'nullable', 'string', 'max:255'],
            'type' => ['sometimes', 'required', 'in:PIC,Direktur'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'Data kontak tidak valid.',
                    'details' => $validator->errors(),
                ],
            ], 400);
        }

        $contact->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Kontak berhasil diperbarui.',
            'data' => $contact->fresh(),
        ]);
    }

    // PATCH /api/v1/clients/{clientId}/contacts/{contactId}/status
    public function updateStatus(
        string $clientId,
        string $contactId
    ): JsonResponse {
        $contact = Contact::where('client_id', $clientId)
            ->where('id', $contactId)
            ->first();

        if (!$contact) {
            return response()->json([
                'error' => [
                    'code' => 'CONTACT_NOT_FOUND',
                    'message' => 'Kontak tidak ditemukan.',
                    'details' => null,
                ],
            ], 404);
        }

        $contact->update(['status' => 'archived']);

        return response()->json([
            'success' => true,
            'message' => 'Kontak berhasil diarsipkan.',
            'data' => $contact->fresh(),
        ]);
    }
}
