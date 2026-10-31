<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interaksis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('klien_id')->constrained('kliens')->cascadeOnDelete();
            $table->foreignId('kontak_id')->nullable()->constrained('kontaks')->nullOnDelete();
            $table->string('subjek');
            $table->string('kanal')->default('Rapat'); // Rapat, Email, WhatsApp, Telepon
            $table->date('tgl');
            $table->string('jam')->default('09:00');
            $table->string('akhir')->default('10:00');
            $table->text('ringkas')->nullable();
            $table->text('hasil')->nullable();
            $table->string('oleh')->default('Admin CRM');
            $table->string('status')->default('Selesai');
            // Tindak lanjut (follow up)
            $table->date('follow_tgl')->nullable();
            $table->string('follow_aksi')->nullable();
            $table->text('follow_detail')->nullable();
            $table->string('follow_status')->nullable(); // Direncanakan, dsb.
            $table->string('follow_pj')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interaksis');
    }
};

