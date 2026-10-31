<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kliens', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique();
            $table->string('nama');
            $table->string('kota');
            $table->string('telp')->nullable();
            $table->string('email')->nullable();
            $table->text('alamat')->nullable();
            $table->string('hp')->nullable();
            $table->string('status')->default('Aktif'); // Aktif / Arsip
            $table->date('tgl_arsip')->nullable();
            $table->string('alasan_arsip')->nullable();
            $table->string('diarsipkan_oleh')->nullable();
            $table->boolean('baru')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kliens');
    }
};

