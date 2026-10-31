<?php

namespace App\Http\Controllers;

use App\Models\Klien;
use App\Models\Kontak;
use App\Models\Interaksi;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalKlien = Klien::count();
        $klienAktif = Klien::aktif()->count();
        $totalKontak = Kontak::count();
        $tindakLanjut = Interaksi::whereNotNull('follow_tgl')->count();

        $interaksiTerbaru = Interaksi::with(['klien', 'kontak'])
            ->latest('tgl')
            ->take(5)
            ->get();

        return view('dashboard', compact(
            'totalKlien',
            'klienAktif',
            'totalKontak',
            'tindakLanjut',
            'interaksiTerbaru'
        ));
    }
}

