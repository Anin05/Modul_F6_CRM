<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kontaks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('klien_id')->constrained('kliens')->cascadeOnDelete();
            $table->string('nama');
            $table->string('tipe')->default('PIC'); // PIC / Direktur
            $table->string('jabatan')->nullable();
            $table->string('divisi')->nullable();
            $table->string('wa');
            $table->string('email')->nullable();
            $table->string('status')->default('Aktif'); // Aktif / Nonaktif
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kontaks');
    }
};

