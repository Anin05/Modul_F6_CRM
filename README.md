# 📂 Modul F-6: CRM Klien dan Kontak (ERP Sistem)

Repositori ini berisi kode sumber **Backend Laravel** beserta dokumentasi kontrak API untuk Modul F-6 (*Customer Relationship Management* - Klien dan Kontak) dalam proyek pengembangan sistem Enterprise Resource Planning (ERP) PT Anaheim Nimbus Universal.

---

## 👥 Tim Penyusun (Kelompok F-6)

* **Project Manager / Dokumentasi**: Habib Wira
* **Backend Developer**: Anandita Putri
* **Testing & Validasi API**: Anindya Gita
* **Frontend Developer**: Mustika Weni
* **UI/UX Designer**: Fernanda Aminullah

---

## 🛠️ Tech Stack
* **Backend Framework**: Laravel (PHP)
* **API Architecture**: RESTful JSON API
* **Database**: SQLite (Development Environment)
* **Dokumentasi Kontrak**: OpenAPI (`openapi.yaml`)

---

## 📋 Fitur Modul F-6
1. **Manajemen Klien**: Menambah, melihat, memperbarui, dan menghapus data profil klien perusahaan.
2. **Validasi Data**: Pencegahan duplikasi data klien berdasarkan kode unik (*client code*).
3. **Dokumentasi Endpoint**: Kontrak API terstandarisasi untuk integrasi langsung dengan tim Frontend.

---

## 🚀 Panduan Menjalankan Proyek di Lokal

Ikuti langkah-langkah berikut di terminal atau VS Code untuk menjalankan server backend:

1. **Clone repositori ini:**
   ```bash
   git clone [https://github.com/Anin05/PPL2026_F6.git](https://github.com/Anin05/PPL2026_F6.git)
Masuk ke direktori proyek:

Bash
cd PPL2026_F6
Install dependencies PHP (Composer):

Bash
composer install
Salin file konfigurasi lingkungan:

Bash
cp .env.example .env
Generate application key:

Bash
php artisan key:generate
Jalankan migrasi database dan seeder:

Bash
php artisan migrate --seed
Jalankan server lokal:

Bash
php artisan serve
Server backend akan aktif di: http://127.0.0.1:8000
