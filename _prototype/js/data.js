'use strict';
/* =====================================================================
   ANAHEIM CRM · js/data.js
   Mock data: clients, contacts, interactions (INT)
   Ganti dengan pemanggilan API backend bila sudah ada.
   ===================================================================== */

// pad didefinisikan di sini karena dibutuhkan sebelum components.js dimuat
const pad = (n, l = 2) => String(n).padStart(l, '0');

const CITY_CODE = { Jakarta: '021', Bandung: '022', Surabaya: '031', Semarang: '024', Tangerang: '021', Bekasi: '021', Bogor: '0251', Yogyakarta: '0274', Medan: '061', Depok: '021', Malang: '0341', Makassar: '0411' };
const CITIES = Object.keys(CITY_CODE);
const W1 = ['Mitra', 'Bintang', 'Sumber', 'Karya', 'Cahaya', 'Tirta', 'Graha', 'Surya', 'Global', 'Mega', 'Citra', 'Dharma', 'Indo', 'Maju', 'Prima', 'Sentosa', 'Adi', 'Bumi', 'Harapan', 'Jaya'];
const W2 = ['Sejahtera', 'Abadi', 'Mandiri', 'Utama', 'Persada', 'Lestari', 'Perkasa', 'Makmur', 'Nusantara', 'Teknik', 'Logistik', 'Digital'];
const NAMED = {
  1: ['PT Anaheim Nimbus Universal', 'Jakarta', '021-5550-1200', 'info@anaheim.co.id', 'Jl. Jenderal Sudirman No. 25, Tanah Abang'],
  2: ['PT Nusantara Teknologi', 'Bandung', '022-7301-8800', 'halo@nusatek.co.id', 'Jl. Asia Afrika No. 88, Bandung'],
  3: ['PT Cipta Karya Sentosa', 'Surabaya', '031-5678-900', 'info@ciptakarya.co.id', 'Jl. Basuki Rahmat No. 12, Surabaya'],
  4: ['CV Sinar Abadi', 'Semarang', '024-7602-110', 'admin@sinarabadi.id', 'Jl. Pandanaran No. 45, Semarang'],
  5: ['PT Bumi Lestari', 'Tangerang', '021-5578-2400', 'info@bumilestari.co.id', 'Jl. Boulevard Gading Serpong No. 7, Tangerang'],
  6: ['PT Prima Logistik', 'Bekasi', '021-8890-4500', 'cs@primalogistik.id', 'Jl. Ahmad Yani No. 31, Bekasi'],
  7: ['PT Solusi Digital Asia', 'Jakarta', '021-5088-1700', 'halo@solusidigital.id', 'Jl. HR Rasuna Said Kav. 5, Jakarta'],
  8: ['CV Mitra Sejahtera', 'Bogor', '0251-8321-600', 'info@mitrasejahtera.id', 'Jl. Pajajaran No. 19, Bogor'],
  19: ['PT Sentra Niaga Mandiri', 'Jakarta'], 32: ['CV Karya Utama', 'Bandung'],
  47: ['PT Lintas Cakrawala', 'Surabaya'], 61: ['PT Graha Pangan Sejati', 'Semarang']
};
const ARS = {
  6: ['2026-10-23', 'Kontrak kerja sama berakhir', 'Admin CRM'], 8: ['2026-10-21', 'Tidak ada aktivitas lanjutan', 'Dimas Saputra'],
  19: ['2026-10-19', 'Permintaan dari klien', 'Admin CRM'], 32: ['2026-10-16', 'Kontrak kerja sama berakhir', 'Admin CRM'],
  47: ['2026-10-12', 'Perubahan entitas perusahaan', 'Dimas Saputra'], 61: ['2026-10-08', 'Tidak ada aktivitas lanjutan', 'Admin CRM'],
  70: ['2026-09-28', 'Kontrak kerja sama berakhir', 'Admin CRM'], 85: ['2026-09-20', 'Permintaan dari klien', 'Dimas Saputra'],
  98: ['2026-09-11', 'Tidak ada aktivitas lanjutan', 'Admin CRM'], 104: ['2026-08-30', 'Perubahan entitas perusahaan', 'Admin CRM'],
  115: ['2026-08-17', 'Kontrak kerja sama berakhir', 'Dimas Saputra'], 127: ['2026-07-29', 'Tidak ada aktivitas lanjutan', 'Admin CRM']
};
const REASONS = ['Kontrak kerja sama berakhir', 'Tidak ada aktivitas lanjutan', 'Permintaan dari klien', 'Perubahan entitas perusahaan', 'Diarsipkan manual'];
const slug = n => n.replace(/^(PT|CV)\s+/, '').toLowerCase().replace(/[^a-z0-9]/g, '');

const clients = [];
for (let n = 1; n <= 129; n++) {
  const nm = NAMED[n] || [];
  const nama = nm[0] || ((n % 3 === 0 ? 'CV' : 'PT') + ' ' + W1[n % 20] + ' ' + W2[(n + Math.floor(n / 20) * 3) % 12]);
  const kota = nm[1] || CITIES[n % 12];
  const kode = n === 1 ? 'PTANU' : 'KLI-' + pad(n, 3);
  clients.push({
    n, kode, nama, kota,
    telp: nm[2] || `${CITY_CODE[kota]}-${5000 + (n * 37) % 4000}-${100 + (n * 53) % 900}`,
    email: nm[3] || `info@${slug(nama)}.co.id`,
    alamat: nm[4] || `Jl. Merdeka No. ${n % 90 + 1}, ${kota}`,
    hp: n === 1 ? '0812-9900-1200' : `0812-${1000 + (n * 71) % 9000}-${1000 + (n * 29) % 9000}`,
    status: ARS[n] ? 'Arsip' : 'Aktif',
    arsip: ARS[n] ? { tgl: ARS[n][0], alasan: ARS[n][1], oleh: ARS[n][2] } : null,
    baru: n === 1
  });
}
const cl = kode => clients.find(c => c.kode === kode);

/* ---- kontak ---- */
const FIXED = [
  ['Andi Pratama', 1, 'PIC', 'Manajer Pengadaan', 'Procurement', '0812-3456-7890', 'andi@anaheim.co.id'],
  ['Budi Santoso', 1, 'Direktur', 'CEO / Direktur Utama', 'Direksi', '0811-2233-4455', 'budi@anaheim.co.id'],
  ['Rina Wulandari', 1, 'PIC', 'Admin Keuangan', 'Finance', '0813-5678-9012', 'rina@anaheim.co.id'],
  ['Dewi Lestari', 1, 'Direktur', 'Direktur Operasional', 'Operasional', '0812-8899-0011', 'dewi@anaheim.co.id'],
  ['Fajar Hidayat', 2, 'PIC', 'IT Manager', 'Teknologi Informasi', '0812-7070-2201', 'fajar@nusatek.co.id'],
  ['Maya Puspita', 3, 'Direktur', 'Direktur Utama', 'Direksi', '0811-8080-3302', 'maya@ciptakarya.co.id'],
  ['Agus Setiawan', 4, 'PIC', 'Admin Operasional', 'Operasional', '0813-6060-4403', 'agus@sinarabadi.id'],
  ['Nadia Putri', 5, 'PIC', 'Manajer Kemitraan', 'Business Development', '0812-9090-5504', 'nadia@bumilestari.co.id']
];
const SPEC = { 1: 4, 2: 3, 3: 2, 4: 2, 5: 3, 6: 2, 7: 5, 8: 1, 19: 3, 32: 2, 47: 4, 61: 2 };
const FN = ['Rizky', 'Siti', 'Joko', 'Ayu', 'Hendra', 'Wulan', 'Taufik', 'Mega', 'Dimas', 'Lina', 'Bayu', 'Putri', 'Ilham', 'Sari', 'Yudi', 'Anita', 'Reza', 'Dian', 'Fitri', 'Galih'];
const LN = ['Pratama', 'Wijaya', 'Kusuma', 'Santoso', 'Hidayat', 'Saputra', 'Nugroho', 'Permata', 'Rahman', 'Utami', 'Firmansyah', 'Anggraini', 'Setiawan', 'Maharani', 'Lestari'];
const PIC_J = [['Manajer Pengadaan', 'Procurement'], ['Admin Keuangan', 'Finance'], ['IT Manager', 'Teknologi Informasi'], ['Admin Operasional', 'Operasional'], ['Manajer Kemitraan', 'Business Development'], ['Staf Purchasing', 'Procurement']];
const DIR_J = [['Direktur Utama', 'Direksi'], ['Direktur Operasional', 'Operasional'], ['Direktur Keuangan', 'Finance'], ['CEO / Direktur Utama', 'Direksi']];

let cid = 0;
const contacts = FIXED.map(f => ({ id: 'K' + (++cid), nama: f[0], kode: clients[f[1] - 1].kode, tipe: f[2], jabatan: f[3], divisi: f[4], wa: f[5], email: f[6], status: 'Aktif' }));
(function genContacts() {
  const used = {};
  FIXED.forEach(f => used[f[1]] = (used[f[1]] || 0) + 1);
  const slots = [];
  Object.entries(SPEC).forEach(([n, c]) => { for (let i = used[n] || 0; i < c; i++) slots.push(+n); });
  const others = clients.filter(c => !SPEC[c.n]).map(c => c.n);
  let k = 0;
  while (slots.length < 240) slots.push(others[k++ % others.length]);
  slots.forEach((n, i) => {
    const c = clients[n - 1];
    const dir = Math.floor((i + 1) * 69 / 240) > Math.floor(i * 69 / 240);
    const fn = FN[(i * 7) % 20], ln = LN[(i * 11 + 3) % 15];
    const j = dir ? DIR_J[i % DIR_J.length] : PIC_J[i % PIC_J.length];
    contacts.push({
      id: 'K' + (++cid), nama: `${fn} ${ln}`, kode: c.kode, tipe: dir ? 'Direktur' : 'PIC', jabatan: j[0], divisi: j[1],
      wa: `081${i % 3 + 1}-${1000 + (i * 37) % 9000}-${1000 + (i * 91) % 9000}`,
      email: `${fn.toLowerCase()}@${c.email.split('@')[1]}`, status: i % 17 === 16 ? 'Nonaktif' : 'Aktif'
    });
  });
})();
const contactsOf = kode => contacts.filter(c => c.kode === kode);

/* ---- interaksi ---- */
const mkFu = (tgl, aksi, detail) => ({ tgl, aksi, detail, status: 'Direncanakan', pj: 'Admin CRM' });
const INT = [
  { subjek: 'Pembahasan kebutuhan pengadaan Q4', kode: 'PTANU', kontak: 'Andi Pratama', kanal: 'Rapat', tgl: '2026-10-23', jam: '14.00', akhir: '15.00', oleh: 'Admin CRM', ringkas: 'Kebutuhan 120 unit disepakati; penawaran revisi akan dikirim.', hasil: 'Klien menyetujui kebutuhan 120 unit untuk Q4. Penawaran perlu disesuaikan dengan jadwal pengiriman bertahap dan termin pembayaran 30 hari.', follow: mkFu('2026-10-27', 'Kirim penawaran', 'Kirim penawaran revisi kepada Andi Pratama.') },
  { subjek: 'Konfirmasi kelengkapan dokumen tagihan', kode: 'PTANU', kontak: 'Rina Wulandari', kanal: 'Email', tgl: '2026-10-22', jam: '10.30', akhir: '11.00', oleh: 'Admin CRM', ringkas: 'Dokumen invoice dan faktur pajak telah diterima lengkap.', hasil: 'Seluruh dokumen tagihan periode September telah diterima dan diverifikasi oleh tim keuangan klien.', follow: null },
  { subjek: 'Penjadwalan demo solusi integrasi', kode: 'KLI-002', kontak: 'Fajar Hidayat', kanal: 'WhatsApp', tgl: '2026-10-22', jam: '09.15', akhir: '09.30', oleh: 'Dimas Saputra', ringkas: 'Klien meminta demo bersama tim IT pada pekan depan.', hasil: 'Klien tertarik pada integrasi dengan sistem internal dan meminta sesi demo bersama tim IT.', follow: mkFu('2026-10-28', 'Konfirmasi demo', 'Konfirmasi jadwal demo kepada Fajar Hidayat.') },
  { subjek: 'Arahan kerja sama tahun 2027', kode: 'PTANU', kontak: 'Budi Santoso', kanal: 'Telepon', tgl: '2026-10-21', jam: '15.00', akhir: '15.30', oleh: 'Dimas Saputra', ringkas: 'Direksi menyampaikan prioritas dan ruang lingkup kemitraan.', hasil: 'Direksi menyampaikan prioritas kemitraan 2027 dan meminta proposal ruang lingkup kerja sama.', follow: mkFu('2026-10-28', 'Kirim proposal', 'Kirim proposal kerja sama 2027 kepada Budi Santoso.') },
  { subjek: 'Evaluasi layanan operasional bulanan', kode: 'PTANU', kontak: 'Dewi Lestari', kanal: 'Rapat', tgl: '2026-10-20', jam: '13.00', akhir: '14.00', oleh: 'Admin CRM', ringkas: 'Evaluasi selesai; alur eskalasi operasional telah disepakati.', hasil: 'Evaluasi layanan bulan lalu selesai dan alur eskalasi operasional disepakati kedua pihak.', follow: null }
];
(function genInt() {
  const subj = ['Tindak lanjut penawaran harga', 'Diskusi perpanjangan kontrak', 'Review dokumen kerja sama', 'Kunjungan ke kantor klien', 'Klarifikasi spesifikasi produk', 'Negosiasi termin pembayaran', 'Pengenalan layanan baru', 'Konfirmasi jadwal pengiriman', 'Survei kepuasan pelanggan', 'Pembahasan SLA layanan', 'Pembaruan data perusahaan', 'Undangan acara tahunan', 'Koordinasi implementasi proyek'];
  const dates = ['2026-10-19', '2026-10-18', '2026-10-16', '2026-10-15', '2026-10-14', '2026-10-12', '2026-10-09', '2026-10-08', '2026-10-07', '2026-10-06', '2026-10-05', '2026-10-02', '2026-10-01'];
  const kanal = ['Telepon', 'Email', 'Rapat', 'WhatsApp'];
  subj.forEach((s, i) => {
    const f = FIXED[i % 8];
    INT.push({
      subjek: s, kode: clients[f[1] - 1].kode, kontak: f[0], kanal: kanal[i % 4], tgl: dates[i], jam: `${pad(9 + i % 7)}.00`, akhir: `${pad(10 + i % 7)}.00`,
      oleh: i % 3 === 0 ? 'Dimas Saputra' : 'Admin CRM', ringkas: `${s} bersama ${f[0]} telah dilakukan dan dicatat.`,
      hasil: `Pembahasan "${s.toLowerCase()}" berjalan lancar dan kedua pihak sepakat melanjutkan komunikasi.`,
      follow: (i === 1 || i === 4) ? mkFu(i === 1 ? '2026-10-29' : '2026-10-30', 'Kirim dokumen', `Kirim dokumen pendukung kepada ${f[0]}.`) : null
    });
  });
  INT.sort((a, b) => b.tgl.localeCompare(a.tgl));
  INT.forEach((x, i) => x.id = i + 1);
})();
const KANAL_IC = { Rapat: 'video', Email: 'mail', WhatsApp: 'message', Telepon: 'phone' };
