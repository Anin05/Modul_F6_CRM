<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Klien extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode',
        'nama',
        'kota',
        'telp',
        'email',
        'alamat',
        'hp',
        'status',
        'tgl_arsip',
        'alasan_arsip',
        'diarsipkan_oleh',
        'baru',
    ];

    protected $casts = [
        'tgl_arsip' => 'date',
        'baru' => 'boolean',
    ];

    public function kontaks(): HasMany
    {
        return $this->hasMany(Kontak::class);
    }

    public function interaksis(): HasMany
    {
        return $this->hasMany(Interaksi::class)->latest('tgl');
    }

    public function scopeAktif($query)
    {
        return $query->where('status', 'Aktif');
    }

    public function scopeArsip($query)
    {
        return $query->where('status', 'Arsip');
    }

    public function getInitialsAttribute(): string
    {
        $clean = preg_replace('/^(PT|CV)\s+/i', '', trim($this->nama));
        $words = preg_split('/\s+/', $clean);
        $w1 = $words[0] ?? '';
        $w2 = $words[1] ?? '';
        return strtoupper(mb_substr($w1, 0, 1) . mb_substr($w2, 0, 1));
    }
}

