# Modul F-6: CRM (Client and Contact Management)

**ERP PT Anaheim Nimbus Universal — Kelompok F-6**

## 1. Deskripsi Aplikasi

Modul F-6 merupakan bagian dari sistem ERP yang berfungsi untuk mengelola data klien dan kontak perusahaan. Modul ini membantu proses pencatatan, penyimpanan, dan pengelolaan informasi klien agar data tersusun dengan rapi dan mudah diakses.

Fitur utama yang dikembangkan meliputi:

- Pengelolaan data klien.
- Pembuatan kode unik untuk setiap klien.
- Penyimpanan informasi perusahaan, seperti nama, alamat, dan kota.
- Pengelolaan informasi kontak, seperti nomor telepon, email, dan PIC.
- Penambahan, pengubahan, penampilan, dan penghapusan data klien.

## 2. Teknologi yang Digunakan

| Teknologi | Keterangan |
|---|---|
| Laravel | Framework backend |
| PHP | Bahasa pemrograman |
| SQLite | Database lokal |
| Composer | Dependency manager PHP |
| REST API | Komunikasi antar aplikasi |
| OpenAPI 3.0.0 | Dokumentasi spesifikasi API |
| GitHub | Pengelolaan repositori |

## 3. Struktur Repositori

Berikut merupakan struktur folder utama project Laravel F-6:

```text
PPL2026_F6/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Requests/
│   └── Models/
├── bootstrap/
├── config/
├── database/
│   ├── migrations/
│   ├── seeders/
│   ├── factories/
│   └── database.sqlite
├── public/
├── resources/
├── routes/
│   ├── api.php
│   └── web.php
├── storage/
├── tests/
├── vendor/
├── .env.example
├── .gitignore
├── artisan
├── composer.json
├── composer.lock
├── openapi.yaml
└── README.md
```

**Keterangan folder dan file:**

- `app/`: Menyimpan kode utama aplikasi, seperti model dan controller.
- `bootstrap/`: Menyimpan proses awal atau konfigurasi bootstrap Laravel.
- `config/`: Menyimpan konfigurasi aplikasi.
- `database/`: Menyimpan migration, seeder, factory, dan database SQLite.
- `public/`: Direktori utama yang dapat diakses melalui web.
- `resources/`: Menyimpan file tampilan dan aset aplikasi.
- `routes/`: Menyimpan definisi endpoint API dan web.
- `storage/`: Menyimpan file log, cache, dan file yang dihasilkan aplikasi.
- `tests/`: Menyimpan file pengujian aplikasi.
- `.env.example`: Contoh konfigurasi environment aplikasi.
- `artisan`: File command-line interface Laravel.
- `composer.json`: Menyimpan informasi dependency project.
- `openapi.yaml`: Dokumentasi spesifikasi API.

## 4. Panduan Instalasi dan Menjalankan Backend Lokal

### A. Persyaratan

Pastikan perangkat sudah memiliki beberapa kebutuhan berikut:

- PHP sesuai versi yang dibutuhkan project Laravel.
- Composer.
- SQLite.
- Git.
- Web browser.
- Postman (opsional, untuk pengujian API).

### B. Clone Repository

Buka terminal atau CMD, kemudian jalankan perintah berikut:

```bash
git clone https://github.com/Anin05/PPL2026_F6.git
```

Masuk ke folder project:

```bash
cd PPL2026_F6
```

### C. Install Dependency

Jalankan perintah berikut untuk menginstal seluruh dependency Laravel:

```bash
composer install
```

### D. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`.

Untuk Windows CMD:

```cmd
copy .env.example .env
```

Untuk terminal Linux atau macOS:

```bash
cp .env.example .env
```

Selanjutnya, buka file `.env` dan sesuaikan konfigurasi database menjadi:

```env
DB_CONNECTION=sqlite
```

Pastikan konfigurasi database lainnya tidak mengarahkan aplikasi ke MySQL.

### E. Menyiapkan Database SQLite

Pastikan file database SQLite tersedia di dalam folder `database/` dengan nama:

```text
database/database.sqlite
```

Jika file tersebut belum tersedia, buat file baru bernama `database.sqlite` di dalam folder `database/`.

Untuk Windows CMD, dapat menggunakan perintah:

```cmd
type nul > database\database.sqlite
```

### F. Generate Application Key

Jalankan perintah berikut untuk membuat application key Laravel:

```bash
php artisan key:generate
```

### G. Menjalankan Migration

Jalankan perintah berikut untuk membuat tabel database berdasarkan file migration yang tersedia:

```bash
php artisan migrate
```

Jika project menyediakan seeder dan membutuhkan data awal, jalankan:

```bash
php artisan db:seed
```

### H. Menjalankan Server Laravel

Setelah konfigurasi selesai, jalankan server lokal dengan perintah:

```bash
php artisan serve
```

Jika berhasil, aplikasi backend dapat diakses melalui alamat:

```text
http://127.0.0.1:8000
```

## 5. Dokumentasi API

Dokumentasi API pada Modul F-6 menggunakan format OpenAPI 3.0.0 dan disimpan dalam file `openapi.yaml`.

Dokumentasi ini berfungsi sebagai panduan untuk mengetahui endpoint, metode HTTP, parameter, request body, serta response yang tersedia pada backend.

Untuk melihat dokumentasi API, ikuti langkah berikut:

1. Buka [Swagger Editor](https://editor.swagger.io/).
2. Pilih menu File, kemudian Open.
3. Masukkan atau upload file `openapi.yaml`.
4. Dokumentasi endpoint API akan ditampilkan pada Swagger Editor.

Dokumentasi ini dapat digunakan oleh tim frontend sebagai acuan dalam menghubungkan aplikasi dengan backend.

## 6. Integrasi Sistem

Modul F-6 berfungsi untuk menyediakan dan mengelola data klien serta kontak perusahaan yang dapat digunakan oleh modul lain dalam sistem ERP.

Informasi yang dikelola meliputi:

- Kode unik klien sebagai identitas setiap perusahaan.
- Nama dan alamat perusahaan.
- Informasi kota atau lokasi perusahaan.
- Nama PIC atau penanggung jawab.
- Nomor telepon dan alamat email kontak.

Data tersebut dapat dimanfaatkan oleh modul lain yang membutuhkan informasi klien sebagai bagian dari proses bisnis perusahaan.

## 7. Penutup

Repository ini merupakan dokumentasi pengembangan Modul F-6: CRM (Client and Contact Management) pada proyek ERP PT Anaheim Nimbus Universal.

Dokumentasi ini diharapkan dapat membantu proses pengembangan, pengujian, pemeliharaan, serta integrasi backend dengan modul lain dalam sistem ERP.

---

**Kelompok F-6**  
Program Studi Teknik Informatika  
Universitas Pasundan
