<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kontak extends Model
{
    use HasFactory;

    protected $fillable = [
        'klien_id',
        'nama',
        'tipe',
        'jabatan',
        'divisi',
        'wa',
        'email',
        'status',
    ];

    public function klien(): BelongsTo
    {
        return $this->belongsTo(Klien::class);
    }

    public function interaksis(): HasMany
    {
        return $this->hasMany(Interaksi::class);
    }

    public function scopeAktif($query)
    {
        return $query->where('status', 'Aktif');
    }

    public function getWaLinkAttribute(): string
    {
        $digits = preg_replace('/\D/', '', $this->wa);
        if (str_starts_with($digits, '0')) {
            $digits = '62' . substr($digits, 1);
        }
        return 'https://wa.me/' . $digits;
    }

    public function getInitialsAttribute(): string
    {
        $words = preg_split('/\s+/', trim($this->nama));
        $w1 = $words[0] ?? '';
        $w2 = $words[1] ?? '';
        return strtoupper(mb_substr($w1, 0, 1) . mb_substr($w2, 0, 1));
    }
}

