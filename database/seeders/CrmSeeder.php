<?php

namespace Database\Seeders;

use App\Models\Klien;
use App\Models\Kontak;
use App\Models\Interaksi;
use Illuminate\Database\Seeder;

class CrmSeeder extends Seeder
{
    public function run(): void
    {
        $cityCode = [
            'Jakarta' => '021', 'Bandung' => '022', 'Surabaya' => '031',
            'Semarang' => '024', 'Tangerang' => '021', 'Bekasi' => '021',
            'Bogor' => '0251', 'Yogyakarta' => '0274', 'Medan' => '061',
            'Depok' => '021', 'Malang' => '0341', 'Makassar' => '0411'
        ];
        $cities = array_keys($cityCode);
        $w1 = ['Mitra', 'Bintang', 'Sumber', 'Karya', 'Cahaya', 'Tirta', 'Graha', 'Surya', 'Global', 'Mega', 'Citra', 'Dharma', 'Indo', 'Maju', 'Prima', 'Sentosa', 'Adi', 'Bumi', 'Harapan', 'Jaya'];
        $w2 = ['Sejahtera', 'Abadi', 'Mandiri', 'Utama', 'Persada', 'Lestari', 'Perkasa', 'Makmur', 'Nusantara', 'Teknik', 'Logistik', 'Digital'];

        $named = [
            1 => ['PT Anaheim Nimbus Universal', 'Jakarta', '021-5550-1200', 'info@anaheim.co.id', 'Jl. Jenderal Sudirman No. 25, Tanah Abang'],
            2 => ['PT Nusantara Teknologi', 'Bandung', '022-7301-8800', 'halo@nusatek.co.id', 'Jl. Asia Afrika No. 88, Bandung'],
            3 => ['PT Cipta Karya Sentosa', 'Surabaya', '031-5678-900', 'info@ciptakarya.co.id', 'Jl. Basuki Rahmat No. 12, Surabaya'],
            4 => ['CV Sinar Abadi', 'Semarang', '024-7602-110', 'admin@sinarabadi.id', 'Jl. Pandanaran No. 45, Semarang'],
            5 => ['PT Bumi Lestari', 'Tangerang', '021-5578-2400', 'info@bumilestari.co.id', 'Jl. Boulevard Gading Serpong No. 7, Tangerang'],
            6 => ['PT Prima Logistik', 'Bekasi', '021-8890-4500', 'cs@primalogistik.id', 'Jl. Ahmad Yani No. 31, Bekasi'],
            7 => ['PT Solusi Digital Asia', 'Jakarta', '021-5088-1700', 'halo@solusidigital.id', 'Jl. HR Rasuna Said Kav. 5, Jakarta'],
            8 => ['CV Mitra Sejahtera', 'Bogor', '0251-8321-600', 'info@mitrasejahtera.id', 'Jl. Pajajaran No. 19, Bogor'],
            19 => ['PT Sentra Niaga Mandiri', 'Jakarta'],
            32 => ['CV Karya Utama', 'Bandung'],
            47 => ['PT Lintas Cakrawala', 'Surabaya'],
            61 => ['PT Graha Pangan Sejati', 'Semarang']
        ];

        $ars = [
            6 => ['2026-10-23', 'Kontrak kerja sama berakhir', 'Admin CRM'],
            8 => ['2026-10-21', 'Tidak ada aktivitas lanjutan', 'Dimas Saputra'],
            19 => ['2026-10-19', 'Permintaan dari klien', 'Admin CRM'],
            32 => ['2026-10-16', 'Kontrak kerja sama berakhir', 'Admin CRM'],
            47 => ['2026-10-12', 'Perubahan entitas perusahaan', 'Dimas Saputra'],
            61 => ['2026-10-08', 'Tidak ada aktivitas lanjutan', 'Admin CRM'],
            70 => ['2026-09-28', 'Kontrak kerja sama berakhir', 'Admin CRM'],
            85 => ['2026-09-20', 'Permintaan dari klien', 'Dimas Saputra'],
            98 => ['2026-09-11', 'Tidak ada aktivitas lanjutan', 'Admin CRM'],
            104 => ['2026-08-30', 'Perubahan entitas perusahaan', 'Admin CRM'],
            115 => ['2026-08-17', 'Kontrak kerja sama berakhir', 'Dimas Saputra'],
            127 => ['2026-07-29', 'Tidak ada aktivitas lanjutan', 'Admin CRM']
        ];

        $klienMap = []; // kode => Klien model

        for ($n = 1; $n <= 129; $n++) {
            $nm = $named[$n] ?? [];
            $nama = $nm[0] ?? (($n % 3 === 0 ? 'CV' : 'PT') . ' ' . $w1[$n % 20] . ' ' . $w2[($n + (int)floor($n / 20) * 3) % 12]);
            $kota = $nm[1] ?? $cities[$n % 12];
            $kode = $n === 1 ? 'PTANU' : 'KLI-' . str_pad($n, 3, '0', STR_PAD_LEFT);
            $slug = strtolower(preg_replace('/[^a-z0-9]/', '', preg_replace('/^(PT|CV)\s+/i', '', $nama)));

            $isArsip = isset($ars[$n]);
            $arsData = $isArsip ? $ars[$n] : null;

            $klien = Klien::create([
                'kode' => $kode,
                'nama' => $nama,
                'kota' => $kota,
                'telp' => $nm[2] ?? ($cityCode[$kota] . '-' . (5000 + ($n * 37) % 4000) . '-' . (100 + ($n * 53) % 900)),
                'email' => $nm[3] ?? "info@{$slug}.co.id",
                'alamat' => $nm[4] ?? "Jl. Merdeka No. " . (($n % 90) + 1) . ", {$kota}",
                'hp' => $n === 1 ? '0812-9900-1200' : ('0812-' . (1000 + ($n * 71) % 9000) . '-' . (1000 + ($n * 29) % 9000)),
                'status' => $isArsip ? 'Arsip' : 'Aktif',
                'tgl_arsip' => $arsData ? $arsData[0] : null,
                'alasan_arsip' => $arsData ? $arsData[1] : null,
                'diarsipkan_oleh' => $arsData ? $arsData[2] : null,
                'baru' => $n === 1,
            ]);

            $klienMap[$kode] = $klien;
            $klienByIndex[$n] = $klien;
        }

        // FIXED Contacts
        $fixed = [
            ['Andi Pratama', 1, 'PIC', 'Manajer Pengadaan', 'Procurement', '0812-3456-7890', 'andi@anaheim.co.id'],
            ['Budi Santoso', 1, 'Direktur', 'CEO / Direktur Utama', 'Direksi', '0811-2233-4455', 'budi@anaheim.co.id'],
            ['Rina Wulandari', 1, 'PIC', 'Admin Keuangan', 'Finance', '0813-5678-9012', 'rina@anaheim.co.id'],
            ['Dewi Lestari', 1, 'Direktur', 'Direktur Operasional', 'Operasional', '0812-8899-0011', 'dewi@anaheim.co.id'],
            ['Fajar Hidayat', 2, 'PIC', 'IT Manager', 'Teknologi Informasi', '0812-7070-2201', 'fajar@nusatek.co.id'],
            ['Maya Puspita', 3, 'Direktur', 'Direktur Utama', 'Direksi', '0811-8080-3302', 'maya@ciptakarya.co.id'],
            ['Agus Setiawan', 4, 'PIC', 'Admin Operasional', 'Operasional', '0813-6060-4403', 'agus@sinarabadi.id'],
            ['Nadia Putri', 5, 'PIC', 'Manajer Kemitraan', 'Business Development', '0812-9090-5504', 'nadia@bumilestari.co.id']
        ];

        $kontakMap = []; // nama_klienid => Kontak

        foreach ($fixed as $f) {
            $kl = $klienByIndex[$f[1]];
            $kontak = Kontak::create([
                'klien_id' => $kl->id,
                'nama' => $f[0],
                'tipe' => $f[2],
                'jabatan' => $f[3],
                'divisi' => $f[4],
                'wa' => $f[5],
                'email' => $f[6],
                'status' => 'Aktif',
            ]);
            $kontakMap[$f[0]] = $kontak;
        }

        // Generate additional contacts
        $fn = ['Rizky', 'Siti', 'Joko', 'Ayu', 'Hendra', 'Wulan', 'Taufik', 'Mega', 'Dimas', 'Lina', 'Bayu', 'Putri', 'Ilham', 'Sari', 'Yudi', 'Anita', 'Reza', 'Dian', 'Fitri', 'Galih'];
        $ln = ['Pratama', 'Wijaya', 'Kusuma', 'Santoso', 'Hidayat', 'Saputra', 'Nugroho', 'Permata', 'Rahman', 'Utami', 'Firmansyah', 'Anggraini', 'Setiawan', 'Maharani', 'Lestari'];
        $picJ = [['Manajer Pengadaan', 'Procurement'], ['Admin Keuangan', 'Finance'], ['IT Manager', 'Teknologi Informasi'], ['Admin Operasional', 'Operasional'], ['Manajer Kemitraan', 'Business Development'], ['Staf Purchasing', 'Procurement']];
        $dirJ = [['Direktur Utama', 'Direksi'], ['Direktur Operasional', 'Operasional'], ['Direktur Keuangan', 'Finance'], ['CEO / Direktur Utama', 'Direksi']];

        for ($i = 0; $i < 240; $i++) {
            $targetClientIndex = (($i * 7) % 129) + 1;
            $targetClient = $klienByIndex[$targetClientIndex];

            $isDir = (int)floor(($i + 1) * 69 / 240) > (int)floor($i * 69 / 240);
            $firstName = $fn[($i * 7) % 20];
            $lastName = $ln[($i * 11 + 3) % 15];
            $fullName = "{$firstName} {$lastName}";
            $job = $isDir ? $dirJ[$i % count($dirJ)] : $picJ[$i % count($picJ)];

            $emailDomain = explode('@', $targetClient->email)[1] ?? 'perusahaan.co.id';

            Kontak::create([
                'klien_id' => $targetClient->id,
                'nama' => $fullName,
                'tipe' => $isDir ? 'Direktur' : 'PIC',
                'jabatan' => $job[0],
                'divisi' => $job[1],
                'wa' => '081' . (($i % 3) + 1) . '-' . (1000 + ($i * 37) % 9000) . '-' . (1000 + ($i * 91) % 9000),
                'email' => strtolower($firstName) . '@' . $emailDomain,
                'status' => $i % 17 === 16 ? 'Nonaktif' : 'Aktif',
            ]);
        }

        // Interaksi
        $initialInteractions = [
            [
                'subjek' => 'Pembahasan kebutuhan pengadaan Q4',
                'kode' => 'PTANU',
                'kontak' => 'Andi Pratama',
                'kanal' => 'Rapat',
                'tgl' => '2026-10-23',
                'jam' => '14.00',
                'akhir' => '15.00',
                'oleh' => 'Admin CRM',
                'ringkas' => 'Kebutuhan 120 unit disepakati; penawaran revisi akan dikirim.',
                'hasil' => 'Klien menyetujui kebutuhan 120 unit untuk Q4. Penawaran perlu disesuaikan dengan jadwal pengiriman bertahap dan termin pembayaran 30 hari.',
                'follow_tgl' => '2026-10-27',
                'follow_aksi' => 'Kirim penawaran',
                'follow_detail' => 'Kirim penawaran revisi kepada Andi Pratama.',
                'follow_status' => 'Direncanakan',
                'follow_pj' => 'Admin CRM',
            ],
            [
                'subjek' => 'Konfirmasi kelengkapan dokumen tagihan',
                'kode' => 'PTANU',
                'kontak' => 'Rina Wulandari',
                'kanal' => 'Email',
                'tgl' => '2026-10-22',
                'jam' => '10.30',
                'akhir' => '11.00',
                'oleh' => 'Admin CRM',
                'ringkas' => 'Dokumen invoice dan faktur pajak telah diterima lengkap.',
                'hasil' => 'Seluruh dokumen tagihan periode September telah diterima dan diverifikasi oleh tim keuangan klien.',
                'follow_tgl' => null,
                'follow_aksi' => null,
                'follow_detail' => null,
                'follow_status' => null,
                'follow_pj' => null,
            ],
            [
                'subjek' => 'Penjadwalan demo solusi integrasi',
                'kode' => 'KLI-002',
                'kontak' => 'Fajar Hidayat',
                'kanal' => 'WhatsApp',
                'tgl' => '2026-10-22',
                'jam' => '09.15',
                'akhir' => '09.30',
                'oleh' => 'Dimas Saputra',
                'ringkas' => 'Klien meminta demo bersama tim IT pada pekan depan.',
                'hasil' => 'Klien tertarik pada integrasi dengan sistem internal dan meminta sesi demo bersama tim IT.',
                'follow_tgl' => '2026-10-28',
                'follow_aksi' => 'Konfirmasi demo',
                'follow_detail' => 'Konfirmasi jadwal demo kepada Fajar Hidayat.',
                'follow_status' => 'Direncanakan',
                'follow_pj' => 'Admin CRM',
            ],
            [
                'subjek' => 'Arahan kerja sama tahun 2027',
                'kode' => 'PTANU',
                'kontak' => 'Budi Santoso',
                'kanal' => 'Telepon',
                'tgl' => '2026-10-21',
                'jam' => '15.00',
                'akhir' => '15.30',
                'oleh' => 'Dimas Saputra',
                'ringkas' => 'Direksi menyampaikan prioritas dan ruang lingkup kemitraan.',
                'hasil' => 'Direksi menyampaikan prioritas kemitraan 2027 dan meminta proposal ruang lingkup kerja sama.',
                'follow_tgl' => '2026-10-28',
                'follow_aksi' => 'Kirim proposal',
                'follow_detail' => 'Kirim proposal kerja sama 2027 kepada Budi Santoso.',
                'follow_status' => 'Direncanakan',
                'follow_pj' => 'Admin CRM',
            ],
            [
                'subjek' => 'Evaluasi layanan operasional bulanan',
                'kode' => 'PTANU',
                'kontak' => 'Dewi Lestari',
                'kanal' => 'Rapat',
                'tgl' => '2026-10-20',
                'jam' => '13.00',
                'akhir' => '14.00',
                'oleh' => 'Admin CRM',
                'ringkas' => 'Evaluasi selesai; alur eskalasi operasional telah disepakati.',
                'hasil' => 'Evaluasi layanan bulan lalu selesai dan alur eskalasi operasional disepakati kedua pihak.',
                'follow_tgl' => null,
                'follow_aksi' => null,
                'follow_detail' => null,
                'follow_status' => null,
                'follow_pj' => null,
            ]
        ];

        $subj = ['Tindak lanjut penawaran harga', 'Diskusi perpanjangan kontrak', 'Review dokumen kerja sama', 'Kunjungan ke kantor klien', 'Klarifikasi spesifikasi produk', 'Negosiasi termin pembayaran', 'Pengenalan layanan baru', 'Konfirmasi jadwal pengiriman', 'Survei kepuasan pelanggan', 'Pembahasan SLA layanan', 'Pembaruan data perusahaan', 'Undangan acara tahunan', 'Koordinasi implementasi proyek'];
        $dates = ['2026-10-19', '2026-10-18', '2026-10-16', '2026-10-15', '2026-10-14', '2026-10-12', '2026-10-09', '2026-10-08', '2026-10-07', '2026-10-06', '2026-10-05', '2026-10-02', '2026-10-01'];
        $kanals = ['Telepon', 'Email', 'Rapat', 'WhatsApp'];

        foreach ($subj as $i => $s) {
            $f = $fixed[$i % 8];
            $initialInteractions[] = [
                'subjek' => $s,
                'kode' => $klienByIndex[$f[1]]->kode,
                'kontak' => $f[0],
                'kanal' => $kanals[$i % 4],
                'tgl' => $dates[$i],
                'jam' => str_pad(9 + ($i % 7), 2, '0', STR_PAD_LEFT) . '.00',
                'akhir' => str_pad(10 + ($i % 7), 2, '0', STR_PAD_LEFT) . '.00',
                'oleh' => ($i % 3 === 0) ? 'Dimas Saputra' : 'Admin CRM',
                'ringkas' => "{$s} bersama {$f[0]} telah dilakukan dan dicatat.",
                'hasil' => "Pembahasan \"{$s}\" berjalan lancar dan kedua pihak sepakat melanjutkan komunikasi.",
                'follow_tgl' => ($i === 1 || $i === 4) ? ($i === 1 ? '2026-10-29' : '2026-10-30') : null,
                'follow_aksi' => ($i === 1 || $i === 4) ? 'Kirim dokumen' : null,
                'follow_detail' => ($i === 1 || $i === 4) ? "Kirim dokumen pendukung kepada {$f[0]}." : null,
                'follow_status' => ($i === 1 || $i === 4) ? 'Direncanakan' : null,
                'follow_pj' => ($i === 1 || $i === 4) ? 'Admin CRM' : null,
            ];
        }

        foreach ($initialInteractions as $int) {
            $kl = $klienMap[$int['kode']] ?? null;
            $kt = $kontakMap[$int['kontak']] ?? null;
            if (!$kt && $kl) {
                $kt = $kl->kontaks()->first();
            }

            if ($kl) {
                Interaksi::create([
                    'klien_id' => $kl->id,
                    'kontak_id' => $kt?->id,
                    'subjek' => $int['subjek'],
                    'kanal' => $int['kanal'],
                    'tgl' => $int['tgl'],
                    'jam' => $int['jam'],
                    'akhir' => $int['akhir'],
                    'ringkas' => $int['ringkas'],
                    'hasil' => $int['hasil'],
                    'oleh' => $int['oleh'],
                    'status' => 'Selesai',
                    'follow_tgl' => $int['follow_tgl'],
                    'follow_aksi' => $int['follow_aksi'],
                    'follow_detail' => $int['follow_detail'],
                    'follow_status' => $int['follow_status'],
                    'follow_pj' => $int['follow_pj'],
                ]);
            }
        }
    }
}

