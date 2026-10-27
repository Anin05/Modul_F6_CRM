<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::withCount('contacts');

        // Pencarian dinamis berdasarkan code, name, atau email
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $clients = $query->paginate(8)->withQueryString();

        // Statistik ringkasan
        $stats = [
            'total'    => Client::count(),
            'active'   => Client::where('status', 'aktif')->count(),
            'archived' => Client::where('status', 'arsip')->count(),
        ];

        return view('clients.index', compact('clients', 'stats'));
    }

    public function create()
    {
        return view('clients.create');
    }

    public function show(Client $client)
    {
        return view('clients.show', compact('client'));
    }

    public function edit(Client $client)
    {
        return view('clients.edit', compact('client'));
    }
}