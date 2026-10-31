<?php

namespace App\Http\Controllers;

use App\Models\Klien;
use App\Models\Kontak;
use Illuminate\Http\Request;

class KontakController extends Controller
{
    public function index(Request $request)
    {
        $query = Kontak::with('klien');

        if ($request->filled('q')) {
            $q = trim($request->q);
            $query->where(function ($sub) use ($q) {
                $sub->where('nama', 'like', "%{$q}%")
                    ->orWhere('jabatan', 'like', "%{$q}%")
                    ->orWhere('divisi', 'like', "%{$q}%")
                    ->orWhere('wa', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        if ($request->filled('klien')) {
            $query->whereHas('klien', function ($k) use ($request) {
                $k->where('kode', $request->klien);
            });
        }

        if ($request->filled('tipe')) {
            $query->where('tipe', $request->tipe);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = in_array((int)$request->per, [8, 16, 32, 50]) ? (int)$request->per : 8;
        $kontaks = $query->latest()->paginate($perPage)->withQueryString();

        $totalKontak = Kontak::count();
        $picCount = Kontak::where('tipe', 'PIC')->count();
        $dirCount = Kontak::where('tipe', 'Direktur')->count();
        $clients = Klien::aktif()->orderBy('nama')->get();

        return view('kontak.index', compact('kontaks', 'totalKontak', 'picCount', 'dirCount', 'clients'));
    }

    public function create(Request $request)
    {
        $selectedKlien = null;
        if ($request->filled('klien_kode')) {
            $selectedKlien = Klien::where('kode', $request->klien_kode)->first();
        }

        $clients = Klien::aktif()->orderBy('nama')->get();

        return view('kontak.create', compact('selectedKlien', 'clients'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'klien_id' => 'required|exists:kliens,id',
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:PIC,Direktur',
            'jabatan' => 'nullable|string|max:100',
            'divisi' => 'nullable|string|max:100',
            'wa' => 'required|string|max:50',
            'email' => 'nullable|email|max:100',
            'status' => 'required|in:Aktif,Nonaktif',
        ]);

        $kontak = Kontak::create($validated);
        $klien = $kontak->klien;

        return redirect()->route('klien.show', ['kode' => $klien->kode, 'tab' => 'pic'])
            ->with('success', "Kontak {$kontak->nama} berhasil ditambahkan ke {$klien->nama}.");
    }

    public function edit(int $id)
    {
        $kontak = Kontak::with('klien')->findOrFail($id);
        $clients = Klien::aktif()->orderBy('nama')->get();
        return view('kontak.edit', compact('kontak', 'clients'));
    }

    public function update(Request $request, int $id)
    {
        $kontak = Kontak::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:PIC,Direktur',
            'jabatan' => 'nullable|string|max:100',
            'divisi' => 'nullable|string|max:100',
            'wa' => 'required|string|max:50',
            'email' => 'nullable|email|max:100',
            'status' => 'required|in:Aktif,Nonaktif',
        ]);

        $kontak->update($validated);

        return redirect()->route('klien.show', ['kode' => $kontak->klien->kode, 'tab' => 'pic'])
            ->with('success', "Data kontak {$kontak->nama} berhasil diperbarui.");
    }

    public function toggleStatus(int $id)
    {
        $kontak = Kontak::findOrFail($id);
        $newStatus = $kontak->status === 'Aktif' ? 'Nonaktif' : 'Aktif';
        $kontak->update(['status' => $newStatus]);

        return back()->with('success', "Status kontak {$kontak->nama} diubah menjadi {$newStatus}.");
    }

    public function destroy(int $id)
    {
        $kontak = Kontak::findOrFail($id);
        $nama = $kontak->nama;
        $kontak->delete();

        return back()->with('success', "Kontak {$nama} berhasil dihapus.");
    }
}

