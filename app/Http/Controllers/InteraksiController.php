<?php

namespace App\Http\Controllers;

use App\Models\Klien;
use App\Models\Kontak;
use App\Models\Interaksi;
use Illuminate\Http\Request;

class InteraksiController extends Controller
{
    public function index(Request $request)
    {
        $tab = $request->query('tab', 'all'); // 'all' or 'tl'
        $query = Interaksi::with(['klien', 'kontak']);

        if ($request->filled('q')) {
            $q = trim($request->q);
            $query->where(function ($sub) use ($q) {
                $sub->where('subjek', 'like', "%{$q}%")
                    ->orWhere('ringkas', 'like', "%{$q}%")
                    ->orWhereHas('klien', fn($k) => $k->where('nama', 'like', "%{$q}%")->orWhere('kode', 'like', "%{$q}%"))
                    ->orWhereHas('kontak', fn($kt) => $kt->where('nama', 'like', "%{$q}%"));
            });
        }

        if ($request->filled('klien')) {
            $query->whereHas('klien', fn($k) => $k->where('kode', $request->klien));
        }

        if ($request->filled('kanal')) {
            $query->where('kanal', $request->kanal);
        }

        if ($request->filled('periode')) {
            if ($request->periode === 'late') {
                $query->where('tgl', '>=', '2026-10-17');
            } elseif ($request->periode === 'early') {
                $query->where('tgl', '<=', '2026-10-16');
            }
        }

        if ($tab === 'tl') {
            $query->whereNotNull('follow_tgl');
        }

        $allCount = Interaksi::count();
        $tlCount = Interaksi::whereNotNull('follow_tgl')->count();

        $interaksis = $query->latest('tgl')->paginate(5)->withQueryString();

        $selId = $request->query('sel', $interaksis->first()?->id);
        $selected = $selId ? Interaksi::with(['klien', 'kontak'])->find($selId) : null;
        if (!$selected && $interaksis->isNotEmpty()) {
            $selected = $interaksis->first();
        }

        $klienList = Klien::has('interaksis')->orderBy('nama')->get();

        return view('riwayat.index', compact('interaksis', 'tab', 'allCount', 'tlCount', 'selected', 'klienList'));
    }

    public function create(Request $request)
    {
        $clients = Klien::aktif()->with('kontaks')->orderBy('nama')->get();
        $selectedKlien = null;
        if ($request->filled('klien_kode')) {
            $selectedKlien = Klien::where('kode', $request->klien_kode)->with('kontaks')->first();
        }

        return view('riwayat.create', compact('clients', 'selectedKlien'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'klien_id' => 'required|exists:kliens,id',
            'kontak_id' => 'nullable|exists:kontaks,id',
            'subjek' => 'required|string|max:255',
            'kanal' => 'required|in:Rapat,Email,WhatsApp,Telepon',
            'tgl' => 'required|date',
            'jam' => 'nullable|string|max:20',
            'akhir' => 'nullable|string|max:20',
            'ringkas' => 'nullable|string',
            'hasil' => 'nullable|string',
            'follow_tgl' => 'nullable|date',
            'follow_aksi' => 'nullable|string|max:100',
            'follow_detail' => 'nullable|string',
        ]);

        $validated['oleh'] = 'Admin CRM';
        $validated['status'] = 'Selesai';
        if (!empty($validated['follow_tgl'])) {
            $validated['follow_status'] = 'Direncanakan';
            $validated['follow_pj'] = 'Admin CRM';
        }

        $int = Interaksi::create($validated);

        return redirect()->route('riwayat.index', ['sel' => $int->id])
            ->with('success', 'Interaksi berhasil dicatat.');
    }
}

