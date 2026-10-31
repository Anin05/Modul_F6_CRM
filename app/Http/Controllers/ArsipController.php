<?php

namespace App\Http\Controllers;

use App\Models\Klien;
use Illuminate\Http\Request;

class ArsipController extends Controller
{
    public function index(Request $request)
    {
        $query = Klien::arsip()->withCount('kontaks');

        if ($request->filled('q')) {
            $q = trim($request->q);
            $query->where(function ($sub) use ($q) {
                $sub->where('kode', 'like', "%{$q}%")
                    ->orWhere('nama', 'like', "%{$q}%")
                    ->orWhere('kota', 'like', "%{$q}%");
            });
        }

        if ($request->filled('kota')) {
            $query->where('kota', $request->kota);
        }

        if ($request->filled('alasan')) {
            $query->where('alasan_arsip', $request->alasan);
        }

        if ($request->filled('periode')) {
            if ($request->periode === '7') {
                $query->where('tgl_arsip', '>=', now()->subDays(7));
            } elseif ($request->periode === '30') {
                $query->where('tgl_arsip', '>=', now()->subDays(30));
            }
        }

        $perPage = in_array((int)$request->per, [6, 12, 24]) ? (int)$request->per : 6;
        $kliens = $query->latest('tgl_arsip')->paginate($perPage)->withQueryString();

        $totalKlien = Klien::count();
        $aktifKlien = Klien::aktif()->count();
        $arsipKlien = Klien::arsip()->count();

        $kotas = Klien::arsip()->select('kota')->distinct()->orderBy('kota')->pluck('kota');
        $reasons = [
            'Kontrak kerja sama berakhir',
            'Tidak ada aktivitas lanjutan',
            'Permintaan dari klien',
            'Perubahan entitas perusahaan',
            'Diarsipkan manual'
        ];

        return view('arsip.index', compact(
            'kliens',
            'totalKlien',
            'aktifKlien',
            'arsipKlien',
            'kotas',
            'reasons'
        ));
    }
}

