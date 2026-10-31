<?php

namespace App\Http\Controllers;

use App\Models\Klien;
use App\Models\Kontak;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class KlienController extends Controller
{
    public function index(Request $request)
    {
        $query = Klien::withCount('kontaks');

        if ($request->filled('q')) {
            $q = trim($request->q);
            $query->where(function ($sub) use ($q) {
                $sub->where('kode', 'like', "%{$q}%")
                    ->orWhere('nama', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%")
                    ->orWhere('kota', 'like', "%{$q}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('kota')) {
            $query->where('kota', $request->kota);
        }

        $perPage = in_array((int)$request->per, [8, 16, 32, 50]) ? (int)$request->per : 8;
        $kliens = $query->orderBy('baru', 'desc')->latest()->paginate($perPage)->withQueryString();

        $totalKlien = Klien::count();
        $aktifKlien = Klien::aktif()->count();
        $arsipKlien = Klien::arsip()->count();
        $kotas = Klien::select('kota')->distinct()->orderBy('kota')->pluck('kota');

        return view('klien.index', compact('kliens', 'totalKlien', 'aktifKlien', 'arsipKlien', 'kotas'));
    }

    public function create()
    {
        return view('klien.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kota' => 'required|string|max:100',
            'telp' => 'nullable|string|max:50',
            'hp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100',
            'alamat' => 'nullable|string',
            'status' => 'required|in:Aktif,Arsip',
        ]);

        // Generate unique client code
        $clean = preg_replace('/^(PT|CV)\s+/i', '', trim($validated['nama']));
        $words = preg_split('/\s+/', $clean);
        $initials = '';
        foreach ($words as $w) {
            $initials .= mb_substr($w, 0, 1);
        }
        $kode = strtoupper(preg_replace('/[^A-Z0-9]/', '', $initials));
        if (strlen($kode) < 2) {
            $kode = 'KLI-' . str_pad(Klien::count() + 1, 3, '0', STR_PAD_LEFT);
        }

        $base = $kode;
        $counter = 2;
        while (Klien::where('kode', $kode)->exists()) {
            $kode = "{$base}-{$counter}";
            $counter++;
        }

        $validated['kode'] = $kode;
        $validated['baru'] = true;

        if ($validated['status'] === 'Arsip') {
            $validated['tgl_arsip'] = now();
            $validated['alasan_arsip'] = 'Diarsipkan manual';
            $validated['diarsipkan_oleh'] = 'Admin CRM';
        }

        // Reset previous 'baru' flags
        Klien::where('baru', true)->update(['baru' => false]);

        $klien = Klien::create($validated);

        return redirect()->route('klien.index')->with('success', "Data klien {$klien->nama} berhasil disimpan dengan kode {$klien->kode}.");
    }

    public function show(string $kode, Request $request)
    {
        $klien = Klien::where('kode', $kode)->firstOrFail();
        $tab = $request->query('tab', 'pic');

        $kontaks = $klien->kontaks()->orderBy('tipe', 'asc')->get();
        $picCount = $kontaks->where('tipe', 'PIC')->count();
        $dirCount = $kontaks->where('tipe', 'Direktur')->count();

        $interaksis = $klien->interaksis()->with('kontak')->latest('tgl')->get();

        return view('klien.show', compact('klien', 'tab', 'kontaks', 'picCount', 'dirCount', 'interaksis'));
    }

    public function edit(string $kode)
    {
        $klien = Klien::where('kode', $kode)->firstOrFail();
        return view('klien.edit', compact('klien'));
    }

    public function update(Request $request, string $kode)
    {
        $klien = Klien::where('kode', $kode)->firstOrFail();

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kota' => 'required|string|max:100',
            'telp' => 'nullable|string|max:50',
            'hp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100',
            'alamat' => 'nullable|string',
            'status' => 'required|in:Aktif,Arsip',
        ]);

        if ($validated['status'] === 'Arsip' && $klien->status !== 'Arsip') {
            $validated['tgl_arsip'] = now();
            $validated['alasan_arsip'] = 'Diarsipkan manual';
            $validated['diarsipkan_oleh'] = 'Admin CRM';
        } elseif ($validated['status'] === 'Aktif' && $klien->status === 'Arsip') {
            $validated['tgl_arsip'] = null;
            $validated['alasan_arsip'] = null;
            $validated['diarsipkan_oleh'] = null;
        }

        $klien->update($validated);

        return redirect()->route('klien.show', $klien->kode)->with('success', "Perubahan pada data klien {$klien->nama} telah disimpan.");
    }

    public function destroy(string $kode)
    {
        $klien = Klien::where('kode', $kode)->firstOrFail();
        $nama = $klien->nama;
        $klien->delete();

        return redirect()->route('klien.index')->with('success', "Data klien {$nama} berhasil dihapus.");
    }

    public function arsipkan(Request $request, string $kode)
    {
        $klien = Klien::where('kode', $kode)->firstOrFail();
        $klien->update([
            'status' => 'Arsip',
            'tgl_arsip' => now(),
            'alasan_arsip' => $request->alasan ?? 'Diarsipkan manual',
            'diarsipkan_oleh' => 'Admin CRM',
            'baru' => false,
        ]);

        return back()->with('success', "Klien {$klien->nama} berhasil dipindahkan ke arsip.");
    }

    public function pulihkan(string $kode)
    {
        $klien = Klien::where('kode', $kode)->firstOrFail();
        $klien->update([
            'status' => 'Aktif',
            'tgl_arsip' => null,
            'alasan_arsip' => null,
            'diarsipkan_oleh' => null,
        ]);

        return back()->with('success', "Klien {$klien->nama} berhasil dipulihkan ke direktori aktif.");
    }

    public function export(Request $request): StreamedResponse
    {
        $query = Klien::withCount('kontaks');
        if ($request->filled('q')) {
            $q = trim($request->q);
            $query->where(function ($sub) use ($q) {
                $sub->where('kode', 'like', "%{$q}%")
                    ->orWhere('nama', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('kota')) $query->where('kota', $request->kota);

        $list = $query->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="daftar-klien.csv"',
        ];

        return response()->stream(function () use ($list) {
            $handle = fopen('php://output', 'w');
            fputs($handle, "\xEF\xBB\xBF"); // UTF-8 BOM
            fputcsv($handle, ['Kode', 'Nama Perusahaan', 'Kota', 'Telepon', 'Email', 'Jumlah Kontak', 'Status']);

            foreach ($list as $c) {
                fputcsv($handle, [
                    $c->kode,
                    $c->nama,
                    $c->kota,
                    $c->telp,
                    $c->email,
                    $c->kontaks_count,
                    $c->status,
                ]);
            }
            fclose($handle);
        }, 200, $headers);
    }
}

