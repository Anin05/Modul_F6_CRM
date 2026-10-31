<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interaksi extends Model
{
    use HasFactory;

    protected $fillable = [
        'klien_id',
        'kontak_id',
        'subjek',
        'kanal',
        'tgl',
        'jam',
        'akhir',
        'ringkas',
        'hasil',
        'oleh',
        'status',
        'follow_tgl',
        'follow_aksi',
        'follow_detail',
        'follow_status',
        'follow_pj',
    ];

    protected $casts = [
        'tgl' => 'date',
        'follow_tgl' => 'date',
    ];

    public function klien(): BelongsTo
    {
        return $this->belongsTo(Klien::class);
    }

    public function kontak(): BelongsTo
    {
        return $this->belongsTo(Kontak::class);
    }
}

