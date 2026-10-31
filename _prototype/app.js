'use strict';
/* =====================================================================
   ANAHEIM ERP · F-6 CRM Klien & Kontak  (prototype front-end, vanilla JS)
   Halaman: Master Klien · Tambah/Edit Klien · Detail Klien · Tambah Kontak
            Kontak Klien · Riwayat Interaksi · Arsip
   ===================================================================== */

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n, l = 2) => String(n).padStart(l, '0');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const fmt = iso => { const [y, m, d] = iso.split('-'); return `${d} ${MONTHS[+m - 1]} ${y}`; };
const fmtS = iso => { const [, m, d] = iso.split('-'); return `${+d} ${MONTHS[+m - 1]}`; };
const TODAY = '2026-10-26';
const daysAgo = iso => Math.round((new Date(TODAY) - new Date(iso)) / 864e5);
const pctStr = n => n.toFixed(1).replace('.', ',') + '%';

const ICONS = {
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  chevD: '<polyline points="6 9 12 15 18 9"/>',
  chevL: '<polyline points="15 18 9 12 15 6"/>',
  chevR: '<polyline points="9 18 15 12 9 6"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  arrowL: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  ext: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  contact: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 21v-1a5 5 0 0 1 10 0v1"/>',
  archive: '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
};
const ic = (n, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* =====================================================================
   DATA (contoh / mock). Ganti dengan pemanggilan API backend bila sudah ada.
   ===================================================================== */
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
    const dir = Math.floor((i + 1) * 69 / 240) > Math.floor(i * 69 / 240); // total direktur = 72
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

/* =====================================================================
   STATE
   ===================================================================== */
const S = {
  klien: { q: '', status: '', kota: '', page: 1, per: 8 },
  kontak: { q: '', klien: '', tipe: '', status: '', page: 1, per: 8 },
  riwayat: { q: '', klien: '', kanal: '', periode: '', tab: 'all', page: 1, per: 5, sel: null },
  arsip: { q: '', kota: '', periode: '', alasan: '', page: 1, per: 6 },
  detailTab: 'pic', flash: null
};
const U = { klien: () => updKlien(), kontak: () => updKontak(), riwayat: () => updRiwayat(), arsip: () => updArsip() };

/* =====================================================================
   KOMPONEN KECIL
   ===================================================================== */
const initials = n => { const w = n.replace(/^(PT|CV)\s+/, '').split(/\s+/).filter(Boolean); return (((w[0] || '')[0] || '') + ((w[1] || '')[0] || '')).toUpperCase(); };
const badge = s => `<span class="badge ${s === 'Aktif' ? 'ok' : 'mute'}"><i></i>${esc(s)}</span>`;
const avatar = (n, cls = '') => `<span class="avatar ${cls}">${esc(initials(n))}</span>`;
const stat = (l, v, note, icon) => `<div class="stat"><div><div class="stat-l">${l}</div><div class="stat-v"><b>${v}</b><span>${note}</span></div></div><div class="stat-ic">${ic(icon, 18)}</div></div>`;
const crumb = items => `<nav class="crumb">${items.map((it, i) => {
  const last = i === items.length - 1;
  const t = it[1] && !last ? `<a href="${it[1]}">${esc(it[0])}</a>` : `<span class="${last ? 'cur' : ''}">${esc(it[0])}</span>`;
  return (i ? ic('chevR', 12) : '') + t;
}).join('')}</nav>`;
const head = (t, d, right = '') => `<div class="page-head"><div><h1>${t}</h1><p>${d}</p></div>${right}</div>`;
const selBox = (f, val, opts, cls = '') => `<div class="sel ${cls}"><select data-f="${f}">${opts.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(l)}</option>`; }).join('')}</select>${ic('chevD', 14)}</div>`;
const searchBox = (f, val, ph) => `<label class="srch grow">${ic('search')}<input data-f="${f}" placeholder="${esc(ph)}" value="${esc(val)}" autocomplete="off"></label>`;

function pager(key, total, unit, opts) {
  const s = S[key], pages = Math.max(1, Math.ceil(total / s.per)), p = s.page;
  let nums;
  if (pages <= 5) nums = Array.from({ length: pages }, (_, i) => i + 1);
  else if (p <= 3) nums = [1, 2, 3, '…', pages];
  else if (p >= pages - 2) nums = [1, '…', pages - 2, pages - 1, pages];
  else nums = [1, '…', p - 1, p, p + 1, '…', pages];
  const st = total ? (p - 1) * s.per + 1 : 0, en = Math.min(total, p * s.per);
  return `<div class="pager"><span class="muted sm">Menampilkan ${st}–${en} dari ${total} ${unit}</span>
  <div class="pg-r"><div class="sel sm"><select data-pp="${key}">${opts.map(o => `<option value="${o}" ${o === s.per ? 'selected' : ''}>${o} / halaman</option>`).join('')}</select>${ic('chevD', 14)}</div>
  <button class="pg" data-pg="${key}:${p - 1}" ${p <= 1 ? 'disabled' : ''} aria-label="Sebelumnya">${ic('chevL', 14)}</button>
  ${nums.map(n => n === '…' ? '<span class="pg-dots">…</span>' : `<button class="pg ${n === p ? 'on' : ''}" data-pg="${key}:${n}">${n}</button>`).join('')}
  <button class="pg" data-pg="${key}:${p + 1}" ${p >= pages ? 'disabled' : ''} aria-label="Berikutnya">${ic('chevR', 14)}</button></div></div>`;
}
function clampPage(key, total) { const s = S[key], pages = Math.max(1, Math.ceil(total / s.per)); if (s.page > pages) s.page = pages; if (s.page < 1) s.page = 1; }

function toast(m) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2600);
}
function closeMenu() { $('#fMenu')?.remove(); }
function openMenu(btn, items) {
  closeMenu();
  const m = document.createElement('div'); m.className = 'menu'; m.id = 'fMenu';
  m.innerHTML = items.map(i => i.href
    ? `<a href="${i.href}" ${i.ext ? 'target="_blank" rel="noopener"' : ''}>${ic(i.ic, 14)}${i.t}</a>`
    : `<button data-act="${i.act}" data-arg="${esc(i.arg)}">${ic(i.ic, 14)}${i.t}</button>`).join('');
  document.body.appendChild(m);
  const r = btn.getBoundingClientRect(), w = m.offsetWidth;
  m.style.top = (r.bottom + 4) + 'px'; m.style.left = Math.max(8, r.right - w) + 'px';
}

/* =====================================================================
   HALAMAN: DASHBOARD (ringkas)
   ===================================================================== */
function pgDashboard() {
  const a = clients.filter(c => c.status === 'Aktif').length;
  const fu = INT.filter(i => i.follow).length;
  return {
    title: 'Dashboard', nav: 'dashboard', html: `
    ${crumb([['CRM Klien & Kontak'], ['Dashboard']])}
    ${head('Dashboard', 'Ringkasan data klien, kontak, dan aktivitas komunikasi.')}
    <div class="cards-3">
      ${stat('Klien Aktif', a, 'dari ' + clients.length + ' perusahaan', 'building')}
      ${stat('Total Kontak', contacts.length, 'PIC &amp; Direktur', 'contact')}
      ${stat('Tindak Lanjut', fu, 'menunggu dikerjakan', 'calendar')}
    </div>
    <section class="card"><div class="card-head"><div><h2>Akses cepat</h2><div class="sub">Menu yang paling sering digunakan.</div></div></div>
      <div class="quick">
        <a href="#/klien">${ic('building')}Master Klien</a><a href="#/klien/tambah">${ic('plus')}Tambah Klien</a>
        <a href="#/kontak">${ic('contact')}Kontak Klien</a><a href="#/riwayat">${ic('message')}Riwayat Interaksi</a><a href="#/arsip">${ic('archive')}Arsip</a>
      </div></section>
    <section class="card" style="margin-top:16px"><div class="card-head"><div><h2>Interaksi terbaru</h2></div></div>
      <ul class="mini-list">${INT.slice(0, 4).map(i => `<li><span class="i-ic">${ic(KANAL_IC[i.kanal], 14)}</span><div><b>${esc(i.subjek)}</b><small>${esc(i.kode)} · ${esc(cl(i.kode).nama)} · ${esc(i.kontak)}</small></div><span class="dt">${fmtS(i.tgl)}</span></li>`).join('')}</ul>
    </section>`
  };
}

/* =====================================================================
   HALAMAN 1: MASTER KLIEN
   ===================================================================== */
function pgKlien() {
  const fl = S.flash; S.flash = null;
  const kotas = [...new Set(clients.map(c => c.kota))].sort();
  return {
    title: 'Master Klien', nav: 'klien', init: updKlien, html: `
    ${fl ? `<div class="alert ok" id="flash"><span class="al-ic">${ic('check', 14)}</span><div><b>${esc(fl.title)}</b><br>${esc(fl.msg)}</div><button class="al-x" data-act="closeFlash" aria-label="Tutup">${ic('x', 14)}</button></div>` : ''}
    ${crumb([['CRM Klien & Kontak'], ['Master Klien']])}
    ${head('Master Klien', 'Kelola data perusahaan klien dan seluruh kontak bisnis Anda.', `<a class="btn btn-primary" href="#/klien/tambah">${ic('plus')}Tambah Klien</a>`)}
    <div class="cards-3" id="kStats"></div>
    <section class="card">
      <div class="card-head"><div class="ch-l"><h2>Daftar Klien</h2><span class="chip" id="kCount"></span></div><span class="muted sm">Terakhir diperbarui: 20 Okt 2026</span></div>
      <div class="toolbar">
        ${searchBox('klien.q', S.klien.q, 'Cari kode, nama perusahaan, atau email...')}
        ${selBox('klien.status', S.klien.status, [['', 'Semua status'], ['Aktif', 'Aktif'], ['Arsip', 'Arsip']])}
        <div class="pop-wrap"><button class="btn btn-outline" data-act="toggleFilter">${ic('sliders')}Filter</button>
          <div class="pop" id="kPop"><label>Kota</label>${selBox('klien.kota', S.klien.kota, [['', 'Semua kota'], ...kotas])}<button class="btn btn-outline btn-sm" data-act="resetKlien">Reset filter</button></div></div>
        <span class="sp"></span>
        <button class="btn btn-outline" data-act="exportKlien">${ic('download')}Ekspor</button>
      </div>
      <div id="kBody"></div>
    </section>`
  };
}
function filterKlien() {
  const s = S.klien, q = s.q.trim().toLowerCase();
  return clients.filter(c => (!q || [c.kode, c.nama, c.email].some(x => x.toLowerCase().includes(q))) && (!s.status || c.status === s.status) && (!s.kota || c.kota === s.kota));
}
function updKlien() {
  if (!$('#kBody')) return;
  const list = filterKlien(), s = S.klien; clampPage('klien', list.length);
  const t = clients.length, a = clients.filter(c => c.status === 'Aktif').length;
  $('#kStats').innerHTML = stat('Total Klien', t, 'Perusahaan terdaftar', 'building') + stat('Aktif', a, `${pctStr(a / t * 100)} dari total klien`, 'checkCircle') + stat('Arsip', t - a, 'Data tersimpan aman', 'archive');
  $('#kCount').textContent = `${list.length} klien`;
  const rows = list.slice((s.page - 1) * s.per, s.page * s.per);
  $('#kBody').innerHTML = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Kode</th><th>Nama Perusahaan</th><th>Kota</th><th>Telepon</th><th>Email</th><th>Jumlah Kontak</th><th>Status</th><th>Aksi</th></tr></thead><tbody>
  ${rows.length ? rows.map(c => `<tr class="${c.baru ? 'hl' : ''}">
    <td>${c.baru ? `<b>${esc(c.kode)}</b><br><span class="kode-new">BARU</span>` : esc(c.kode)}</td>
    <td><div class="cell-co">${avatar(c.nama, c.baru ? 'dark' : '')}<b>${esc(c.nama)}</b></div></td>
    <td>${esc(c.kota)}</td><td>${esc(c.telp)}</td><td>${esc(c.email)}</td>
    <td><span class="cnt">${ic('users', 14)}${contactsOf(c.kode).length}</span></td>
    <td>${badge(c.status)}</td>
    <td><div class="acts"><button data-go="#/klien/${encodeURIComponent(c.kode)}" aria-label="Lihat detail">${ic('eye', 16)}</button><button data-menu="k:${esc(c.kode)}" aria-label="Menu">${ic('more', 16)}</button></div></td></tr>`).join('')
    : '<tr><td colspan="8" class="empty">Tidak ada klien yang cocok dengan pencarian.</td></tr>'}
  </tbody></table></div>${pager('klien', list.length, 'klien', [8, 16, 32])}`;
}

/* =====================================================================
   HALAMAN 2: TAMBAH / EDIT KLIEN
   ===================================================================== */
const fld = (name, label, req, inner, hint = '', full = false) => `<div class="field ${full ? 'full' : ''}" data-fld="${name}"><label>${label}${req ? ' <em>*</em>' : ''}</label><div class="inp">${inner}<span class="ic-err">${ic('alert', 16)}</span></div><div class="err-msg"></div>${hint ? `<div class="hint">${hint}</div>` : ''}</div>`;

function pgKlienForm(kode) {
  const c = kode ? cl(decodeURIComponent(kode)) : null;
  if (kode && !c) return null;
  const v = k => esc(c ? c[k] : '');
  return {
    title: c ? 'Edit Klien' : 'Tambah Klien', nav: 'klien', html: `
    ${crumb([['CRM Klien & Kontak'], ['Master Klien', '#/klien'], [c ? 'Edit Klien' : 'Tambah Klien']])}
    ${head(c ? 'Edit Klien' : 'Tambah Klien', c ? 'Perbarui informasi perusahaan klien.' : 'Lengkapi informasi perusahaan untuk mendaftarkan klien baru.', `<a class="btn btn-outline" href="#/klien${c ? '/' + encodeURIComponent(c.kode) : ''}">${ic('arrowL')}Kembali</a>`)}
    <div class="form-grid">
      <form class="card" id="fKlien" novalidate>
        <input type="hidden" name="kodeAsli" value="${c ? esc(c.kode) : ''}">
        <div class="f-head"><h2>Informasi Perusahaan</h2><p>Data ini akan menjadi identitas utama klien di sistem.</p></div>
        <div class="f-body">
          ${fld('nama', 'Nama Perusahaan', true, `<input name="nama" value="${v('nama')}" placeholder="Masukkan nama perusahaan">`).replace('class="field"', 'class="field"')}
          <div class="field"><label>Kode Klien</label><div class="inp"><input readonly value="${c ? esc(c.kode) : 'Dibuat otomatis'}"><span class="ic-lock">${ic('lock', 15)}</span></div><div class="hint">Kode unik dibuat otomatis saat data disimpan.</div></div>
          <div class="field full"><label>Alamat</label><div class="inp"><textarea name="alamat" placeholder="Contoh: Jl. Jenderal Sudirman No. 25, Tanah Abang">${v('alamat')}</textarea></div></div>
          ${fld('kota', 'Kota', true, `<input name="kota" value="${v('kota')}" placeholder="Contoh: Jakarta Pusat">`)}
          ${fld('telp', 'Telepon', false, `<input name="telp" value="${v('telp')}" placeholder="Contoh: 021-5550-1200">`)}
          ${fld('hp', 'No. HP / WA', false, `<input name="hp" value="${v('hp')}" placeholder="Contoh: 0812-9900-1200">`, 'Dapat digunakan untuk kontak WhatsApp.')}
          ${fld('email', 'Email', false, `<input name="email" type="text" value="${v('email')}" placeholder="contact@perusahaan.co.id">`)}
          <div class="field full"><label>Status</label><div class="inp"><select name="status"><option ${c && c.status === 'Aktif' || !c ? 'selected' : ''}>Aktif</option><option ${c && c.status === 'Arsip' ? 'selected' : ''}>Arsip</option></select>${ic('chevD', 15).replace('<svg', '<svg class="chev"')}</div><div class="hint">Status awal klien baru adalah Aktif. Klien aktif dapat digunakan pada transaksi.</div></div>
          <div class="f-note full">${ic('shield', 15)}Data klien hanya dapat diakses oleh pengguna yang berwenang (Admin / Account Manager).</div>
        </div>
        <div class="f-foot"><div class="req">* Wajib diisi<small>Tombol Simpan nonaktif selama proses penyimpanan berlangsung.</small></div>
          <div class="btns"><a class="btn btn-outline" href="#/klien${c ? '/' + encodeURIComponent(c.kode) : ''}">Batal</a><button class="btn btn-primary" type="submit">${ic('check')}${c ? 'Simpan Perubahan' : 'Simpan Klien'}</button></div></div>
      </form>
      <aside class="side-col">
        <div class="s-card"><h3>${ic('info', 16)}Panduan pengisian</h3><p>Gunakan nama perusahaan sesuai dokumen resmi agar mudah dikenali di seluruh modul.</p><hr>
          <p><span class="red-dot">•</span> Nama Perusahaan dan Kota wajib diisi sebelum menyimpan.</p><p>Pastikan telepon dan email perusahaan masih aktif dan format email valid.</p></div>
        <div class="s-card tint"><h3>${ic('users', 16)}Selanjutnya, tambah kontak</h3><p>Setelah Simpan berhasil, Anda akan kembali ke daftar Master Klien. Buka Detail Klien dari daftar untuk menambahkan PIC dan Direktur.</p>
          <ul><li>${ic('check', 14)}Satu klien, banyak kontak</li><li>${ic('check', 14)}Simpan → kembali ke daftar → buka Detail → tambah kontak</li></ul></div>
        <div class="s-card"><h3>${ic('users', 16)}Pengguna berwenang</h3><p>Pendaftaran klien dapat dilakukan oleh:</p><p style="color:var(--navy)">Admin · Account Manager · COO · CEO</p></div>
      </aside>
    </div>`
  };
}

/* =====================================================================
   HALAMAN 3: DETAIL KLIEN
   ===================================================================== */
function pgDetail(kodeEnc) {
  const c = cl(decodeURIComponent(kodeEnc)); if (!c) return null;
  const ks = contactsOf(c.kode), pic = ks.filter(k => k.tipe === 'PIC').length, dir = ks.length - pic, tab = S.detailTab;
  const ints = INT.filter(i => i.kode === c.kode);
  let body = '';
  if (tab === 'info') {
    body = `<section class="card"><div class="card-head"><div><h2>Informasi Perusahaan</h2><div class="sub">Data identitas klien di sistem.</div></div></div>
    <dl class="info-grid" style="border-top:1px solid var(--border)">
      <div><dt>Nama Perusahaan</dt><dd>${esc(c.nama)}</dd></div><div><dt>Kode Klien</dt><dd>${esc(c.kode)}</dd></div><div><dt>Status</dt><dd>${badge(c.status)}</dd></div>
      <div class="span2"><dt>Alamat</dt><dd>${esc(c.alamat || '-')}</dd></div><div><dt>Kota</dt><dd>${esc(c.kota)}</dd></div>
      <div><dt>Telepon</dt><dd>${esc(c.telp || '-')}</dd></div><div><dt>No. HP / WA</dt><dd>${esc(c.hp || '-')}</dd></div><div><dt>Email</dt><dd>${esc(c.email || '-')}</dd></div>
      ${c.arsip ? `<div class="span2"><dt>Alasan diarsipkan</dt><dd>${esc(c.arsip.alasan)} · ${fmt(c.arsip.tgl)}</dd></div>` : ''}
    </dl></section>`;
  } else if (tab === 'int') {
    body = `<section class="card"><div class="card-head"><div><h2>Riwayat Interaksi</h2><div class="sub">${ints.length} interaksi tercatat untuk klien ini.</div></div><a class="btn btn-outline btn-sm" href="#/riwayat">Lihat semua</a></div>
    ${ints.length ? `<ul class="mini-list" style="border-bottom:0">${ints.map(i => `<li><span class="i-ic">${ic(KANAL_IC[i.kanal], 14)}</span><div><b>${esc(i.subjek)}</b><small>${esc(i.kanal)} · ${esc(i.kontak)}</small></div><span class="dt">${fmt(i.tgl)}</span></li>`).join('')}</ul>` : '<div class="empty-box" style="border-top:1px solid var(--border)">Belum ada interaksi tercatat.</div>'}</section>`;
  } else {
    body = `<section class="card"><div class="card-head"><div><h2>PIC &amp; Direktur</h2><div class="sub">${ks.length} kontak · ${pic} PIC · ${dir} Direktur</div></div><a class="btn btn-primary" href="#/kontak/tambah/${encodeURIComponent(c.kode)}">${ic('plus')}Tambah Kontak</a></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Nama</th><th>Tipe</th><th>Jabatan</th><th>Divisi</th><th>WA</th><th>Email</th><th>Status</th><th>Aksi</th></tr></thead><tbody>
    ${ks.length ? ks.map(k => `<tr><td><div class="cell-co">${avatar(k.nama, 'round')}<b>${esc(k.nama)}</b></div></td><td><span class="tag">${esc(k.tipe)}</span></td><td>${esc(k.jabatan)}</td><td>${esc(k.divisi)}</td><td>${esc(k.wa)}</td><td>${esc(k.email)}</td><td>${badge(k.status)}</td>
      <td><div class="acts"><button data-menu="c:${k.id}" aria-label="Menu">${ic('more', 16)}</button></div></td></tr>`).join('') : '<tr><td colspan="8" class="empty">Belum ada kontak untuk klien ini.</td></tr>'}
    </tbody></table></div>
    <div class="note">${ic('info', 14)}Satu klien dapat memiliki lebih dari satu PIC dan Direktur.</div></section>`;
  }
  return {
    title: 'Detail Klien', nav: 'klien', html: `
    ${crumb([['CRM Klien & Kontak'], ['Master Klien', '#/klien'], ['Detail Klien']])}
    ${head('Detail Klien', 'Informasi perusahaan dan kontak yang terhubung dengan klien.', `<a class="btn btn-outline" href="#/klien">${ic('arrowL')}Kembali</a>`)}
    <section class="card co-card">
      <div class="co-top"><div class="co-l"><div class="co-ic">${ic('building', 28)}</div>
        <div><div class="co-name"><h2>${esc(c.nama)}</h2>${badge(c.status)}</div><div class="co-meta"><span>${esc(c.kode)}</span>•${ic('pin', 13)}<span>${esc(c.kota)}</span></div></div></div>
        <a class="btn btn-outline" href="#/klien/edit/${encodeURIComponent(c.kode)}">${ic('edit')}Edit Klien</a></div>
      <div class="co-info"><span>${ic('pin', 14)}${esc(c.alamat)}</span><span>${ic('phone', 14)}${esc(c.telp)}</span><span>${ic('mail', 14)}${esc(c.email)}</span></div>
      <div class="tabs">
        <button class="tab ${tab === 'info' ? 'on' : ''}" data-tab="info">Informasi</button>
        <button class="tab ${tab === 'pic' ? 'on' : ''}" data-tab="pic">PIC &amp; Direktur <span class="chip">${ks.length}</span></button>
        <button class="tab ${tab === 'int' ? 'on' : ''}" data-tab="int">Riwayat Interaksi</button>
      </div>
    </section>${body}`
  };
}

/* =====================================================================
   HALAMAN 4: TAMBAH KONTAK
   ===================================================================== */
function coSideCard(kode) {
  const c = kode ? cl(kode) : null;
  if (!c) return `<div class="s-card"><h3>${ic('building', 16)}Perusahaan Klien</h3><p>Pilih klien pada formulir untuk melihat ringkasannya.</p></div>`;
  const ks = contactsOf(c.kode), pic = ks.filter(k => k.tipe === 'PIC').length;
  return `<div class="s-card"><h3>${ic('building', 16)}Perusahaan Klien</h3><div class="co-name">${esc(c.nama)}</div>
    <div class="row"><span>${esc(c.kode)}</span>${badge(c.status)}</div><hr>
    <div class="row">${ic('pin', 14)}${esc(c.kota)}</div><div class="row">${ic('users', 14)}${ks.length} kontak · ${pic} PIC · ${ks.length - pic} Direktur</div></div>`;
}
function pgKontakForm(kodeEnc) {
  const kode = kodeEnc ? decodeURIComponent(kodeEnc) : '';
  const c = kode ? cl(kode) : null;
  if (kode && !c) return null;
  const opts = clients.filter(x => x.status === 'Aktif');
  return {
    title: 'Tambah Kontak', nav: c ? 'klien' : 'kontak', html: `
    ${crumb(c ? [['CRM Klien & Kontak'], ['Master Klien', '#/klien'], ['Detail Klien', '#/klien/' + encodeURIComponent(c.kode)], ['PIC & Direktur', '#/klien/' + encodeURIComponent(c.kode)], ['Tambah Kontak']] : [['CRM Klien & Kontak'], ['Kontak Klien', '#/kontak'], ['Tambah Kontak']])}
    ${head('Tambah Kontak', 'Tambahkan PIC atau Direktur untuk perusahaan klien.', `<a class="btn btn-outline" href="${c ? '#/klien/' + encodeURIComponent(c.kode) : '#/kontak'}">${ic('arrowL')}${c ? 'Kembali ke Detail PIC & Direktur' : 'Kembali'}</a>`)}
    <div class="form-grid">
      <form class="card" id="fKontak" novalidate>
        <div class="f-head"><h2>Informasi Kontak</h2><p>${c ? `Kontak akan terhubung dengan ${esc(c.nama)} (${esc(c.kode)}).` : 'Pilih klien yang sudah tersimpan, lalu lengkapi data kontak.'}</p></div>
        <div class="f-body">
          ${c ? `<input type="hidden" name="kode" value="${esc(c.kode)}">` : `<div class="field full" data-fld="kode"><label>Klien <em>*</em></label><div class="inp"><select name="kode" data-sel="kontakKlien"><option value="">Pilih klien...</option>${opts.map(o => `<option value="${esc(o.kode)}">${esc(o.kode)} · ${esc(o.nama)}</option>`).join('')}</select>${ic('chevD', 15).replace('<svg', '<svg class="chev"')}</div><div class="err-msg">Pilih klien terlebih dahulu.</div></div>`}
          ${fld('nama', 'Nama', true, '<input name="nama" placeholder="Nama lengkap kontak">')}
          <div class="field"><label>Tipe</label><input type="hidden" name="tipe" value="PIC"><div class="seg"><button type="button" class="on" data-seg="PIC">${ic('check', 14)}PIC</button><button type="button" data-seg="Direktur">${ic('check', 14)}Direktur</button></div></div>
          <div class="field"><label>Jabatan</label><div class="inp"><input name="jabatan" placeholder="Contoh: Manajer Pengadaan"></div></div>
          <div class="field"><label>Divisi</label><div class="inp"><input name="divisi" placeholder="Contoh: Procurement"></div></div>
          ${fld('wa', 'WA', true, '<input name="wa" placeholder="Contoh: 0812-3456-7890">').replace('<div class="err-msg"></div>', '<div class="err-msg">Nomor WhatsApp wajib diisi.</div>')}
          ${fld('email', 'Email', false, '<input name="email" placeholder="nama@perusahaan.co.id">')}
          <div class="field"><label>Status</label><div class="inp"><select name="status"><option>Aktif</option><option>Nonaktif</option></select>${ic('chevD', 15).replace('<svg', '<svg class="chev"')}</div><div class="hint">Kontak aktif tersedia untuk komunikasi bisnis.</div></div>
          <div class="hint" style="align-self:center;margin:0">Pastikan nomor WhatsApp dan email merupakan kontak kerja yang dapat dihubungi.</div>
          <div class="f-note full">${ic('link', 14)}<span id="linkNote">${c ? `Kontak ini hanya terhubung dengan klien ${esc(c.kode)}.` : 'Kontak ini hanya terhubung dengan klien yang dipilih.'}</span></div>
        </div>
        <div class="f-foot"><div class="req">* Wajib diisi</div><div class="btns"><a class="btn btn-outline" href="${c ? '#/klien/' + encodeURIComponent(c.kode) : '#/kontak'}">Batal</a><button class="btn btn-primary" type="submit">${ic('check')}${c ? 'Simpan &amp; Kembali ke PIC &amp; Direktur' : 'Simpan Kontak'}</button></div></div>
      </form>
      <aside class="side-col">
        <div id="coSide">${coSideCard(kode)}</div>
        <div class="s-card"><h3>${ic('info', 16)}Pilih tipe kontak</h3><div class="pt">PIC</div><p style="margin-top:0">Penanggung jawab komunikasi dan koordinasi harian dengan klien. Contoh: Manajer Pengadaan, Admin Keuangan.</p><hr>
          <div class="pt">Direktur</div><p style="margin-top:0">Pimpinan perusahaan yang menjadi kontak pengambil keputusan. Contoh: CEO / Direktur Utama, Direktur Operasional.</p><hr><span class="lnk" style="color:var(--primary)">Jumlah PIC dan Direktur tidak dibatasi.</span></div>
        <div class="s-card tint"><h3>${ic('info', 16)}Alur Halaman Ini</h3><ol class="steps">
          <li><span class="n">1</span>Master Klien sudah tersimpan sebelumnya</li><li><span class="n">2</span>Buka Detail Klien → Tab PIC &amp; Direktur</li>
          <li><span class="n">3</span>Klik "Tambah Kontak" → halaman ini</li><li><span class="n g">4</span>Simpan → kembali ke PIC &amp; Direktur</li></ol></div>
      </aside>
    </div>`
  };
}

/* =====================================================================
   HALAMAN 5: KONTAK KLIEN
   ===================================================================== */
function pgKontak() {
  return {
    title: 'Kontak Klien', nav: 'kontak', init: updKontak, html: `
    ${crumb([['CRM Klien & Kontak'], ['Kontak Klien']])}
    ${head('Kontak Klien', 'Direktori PIC dan Direktur yang terhubung dengan perusahaan klien.', `<a class="btn btn-primary" href="#/kontak/tambah">${ic('plus')}Tambah Kontak</a>`)}
    <div class="cards-3" id="cStats"></div>
    <section class="card">
      <div class="card-head"><div class="ch-l"><h2>Daftar Kontak</h2><span class="chip" id="cCount"></span></div><span class="muted sm">Terakhir diperbarui: 24 Okt 2026</span></div>
      <div class="toolbar">
        ${searchBox('kontak.q', S.kontak.q, 'Cari nama, jabatan, WA, atau email...')}
        ${selBox('kontak.klien', S.kontak.klien, [['', 'Semua klien'], ...clients.map(c => [c.kode, `${c.kode} · ${c.nama}`])])}
        ${selBox('kontak.tipe', S.kontak.tipe, [['', 'Semua tipe'], 'PIC', 'Direktur'])}
        ${selBox('kontak.status', S.kontak.status, [['', 'Semua status'], 'Aktif', 'Nonaktif'])}
      </div>
      <div id="cBody"></div>
      <div class="note">${ic('info', 14)}Pilih klien yang sudah tersimpan saat menambah kontak. Buka perusahaan untuk melihat tabel PIC &amp; Direktur.</div>
    </section>`
  };
}
function updKontak() {
  if (!$('#cBody')) return;
  const s = S.kontak, q = s.q.trim().toLowerCase();
  const list = contacts.filter(k => (!q || [k.nama, k.jabatan, k.divisi, k.wa, k.email].some(x => x.toLowerCase().includes(q))) && (!s.klien || k.kode === s.klien) && (!s.tipe || k.tipe === s.tipe) && (!s.status || k.status === s.status));
  clampPage('kontak', list.length);
  const pic = contacts.filter(k => k.tipe === 'PIC').length;
  $('#cStats').innerHTML = stat('Total Kontak', contacts.length, 'Kontak tersimpan', 'contact') + stat('PIC', pic, 'Kontak operasional', 'users') + stat('Direktur', contacts.length - pic, 'Kontak pengambil keputusan', 'briefcase');
  $('#cCount').textContent = `${contacts.length} kontak`;
  const rows = list.slice((s.page - 1) * s.per, s.page * s.per);
  $('#cBody').innerHTML = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Nama</th><th>Perusahaan</th><th>Tipe</th><th>Jabatan / Divisi</th><th>WA</th><th>Email</th><th>Status</th><th>Aksi</th></tr></thead><tbody>
  ${rows.length ? rows.map(k => { const c = cl(k.kode); return `<tr><td><b>${esc(k.nama)}</b></td><td><div class="two"><span>${esc(c.nama)}</span><small>${esc(c.kode)}</small></div></td><td><span class="tag">${esc(k.tipe)}</span></td>
    <td><div class="two"><span>${esc(k.jabatan)}</span><small>${esc(k.divisi)}</small></div></td><td>${esc(k.wa)}</td><td>${esc(k.email)}</td><td>${badge(k.status)}</td>
    <td><div class="acts"><a href="#/klien/${encodeURIComponent(k.kode)}" onclick="S.detailTab='pic'" aria-label="Buka perusahaan">${ic('ext', 15)}</a></div></td></tr>`; }).join('')
    : '<tr><td colspan="8" class="empty">Tidak ada kontak yang cocok.</td></tr>'}
  </tbody></table></div>${pager('kontak', list.length, 'kontak', [8, 16, 32])}`;
}

/* =====================================================================
   HALAMAN 6: RIWAYAT INTERAKSI
   ===================================================================== */
const PERIODE_R = [['', '1–24 Okt 2026'], ['late', '17–24 Okt 2026'], ['early', '1–16 Okt 2026']];
function pgRiwayat() {
  const kl = [...new Set(INT.map(i => i.kode))];
  return {
    title: 'Riwayat Interaksi', nav: 'riwayat', init: updRiwayat, html: `
    ${crumb([['CRM Klien & Kontak'], ['Riwayat Interaksi']])}
    ${head('Riwayat Interaksi', 'Catat komunikasi bisnis dan pantau tindak lanjut untuk setiap klien.', `<button class="btn btn-primary" data-act="catat">${ic('plus')}Catat Interaksi</button>`)}
    <section class="card filter-card"><div class="row">
      ${searchBox('riwayat.q', S.riwayat.q, 'Cari subjek atau nama kontak...')}
      ${selBox('riwayat.klien', S.riwayat.klien, [['', 'Semua klien'], ...kl.map(k => [k, `${k} · ${cl(k).nama}`])], 'fill')}
      ${selBox('riwayat.kanal', S.riwayat.kanal, [['', 'Semua kanal'], 'Rapat', 'Email', 'WhatsApp', 'Telepon'], 'fill')}
      ${selBox('riwayat.periode', S.riwayat.periode, PERIODE_R, 'fill')}
    </div><div class="hint">Saat mencatat interaksi, pilih klien yang sudah tersimpan lalu pilih kontak dari perusahaan tersebut.</div></section>
    <div class="r-grid"><section class="card" id="rList"></section><section class="card d-card" id="rDetail"></section></div>`
  };
}
function updRiwayat() {
  if (!$('#rList')) return;
  const s = S.riwayat, q = s.q.trim().toLowerCase();
  const base = INT.filter(i => (!q || i.subjek.toLowerCase().includes(q) || i.kontak.toLowerCase().includes(q) || cl(i.kode).nama.toLowerCase().includes(q)) && (!s.klien || i.kode === s.klien) && (!s.kanal || i.kanal === s.kanal)
    && (!s.periode || (s.periode === 'late' ? i.tgl >= '2026-10-17' : i.tgl <= '2026-10-16')));
  const fuList = base.filter(i => i.follow);
  const list = s.tab === 'tl' ? fuList : base;
  clampPage('riwayat', list.length);
  const rows = list.slice((s.page - 1) * s.per, s.page * s.per);
  if (!list.find(i => i.id === s.sel)) s.sel = list[0]?.id ?? null;
  $('#rList').innerHTML = `<div class="r-tabs"><button class="tab ${s.tab === 'all' ? 'on' : ''}" data-rt="all">Komunikasi tercatat <span class="chip">${base.length}</span></button>
    <button class="tab ${s.tab === 'tl' ? 'on' : ''}" data-rt="tl">Tindak lanjut <span class="chip">${fuList.length}</span></button><span class="sort">Terbaru lebih dahulu</span></div>
  ${rows.length ? rows.map(i => `<div class="i-item ${i.id === s.sel ? 'on' : ''}" data-int="${i.id}"><span class="i-ic">${ic(KANAL_IC[i.kanal], 15)}</span><div class="i-body">
    <div class="i-top"><b>${esc(i.subjek)}</b><span>${fmtS(i.tgl)} ${i.tgl.slice(0, 4)}</span></div>
    <div class="i-co">${esc(i.kode)} · ${esc(cl(i.kode).nama)} · ${esc(i.kontak)}</div><div class="i-sum">${esc(i.ringkas)}</div>
    <div class="i-bot"><span>${esc(i.kanal)} · ${i.jam} WIB · Dicatat: ${esc(i.oleh)}</span>${i.follow ? `<span class="fu">${fmtS(i.follow.tgl)} · ${esc(i.follow.aksi)}</span>` : '<span class="nofu">Tidak ada tindak lanjut</span>'}</div></div></div>`).join('')
    : '<div class="empty-box">Tidak ada interaksi yang cocok.</div>'}
  ${pager('riwayat', list.length, 'interaksi', [5, 10])}`;
  const d = INT.find(i => i.id === s.sel);
  $('#rDetail').innerHTML = d ? `<h3>Detail Interaksi</h3><span class="d-pill"><i></i>Komunikasi selesai</span>
    <div class="d-title">${esc(d.subjek)}</div><div class="d-when">${fmt(d.tgl)} · ${d.jam}–${d.akhir} WIB · ${esc(d.kanal)}</div>
    <div class="d-row"><small>Klien terkait</small><b>${esc(d.kode)} · ${esc(cl(d.kode).nama)}</b></div>
    <div class="d-row d-two"><div><small>Kontak terkait</small><b>${esc(d.kontak)}</b><div class="muted sm">${(() => { const k = contacts.find(x => x.nama === d.kontak && x.kode === d.kode); return k ? esc(k.tipe + ' · ' + k.jabatan) : ''; })()}</div></div><div><small>Dicatat oleh</small><b>${esc(d.oleh)}</b></div></div>
    <div class="d-row"><small>Ringkasan hasil</small><span>${esc(d.hasil)}</span></div>
    ${d.follow ? `<div class="d-fu"><div class="t"><b>Tindak lanjut</b><span class="tg">${esc(d.follow.status)}</span></div>${esc(d.follow.detail)}<small>${fmt(d.follow.tgl)} · Penanggung jawab: ${esc(d.follow.pj)}</small></div>` : ''}
    <a class="d-link" href="#/klien/${encodeURIComponent(d.kode)}" onclick="S.detailTab='pic'">${ic('building', 14)}Lihat klien &amp; kontak terkait ${ic('chevR', 14)}</a>`
    : '<div class="empty-box">Pilih interaksi untuk melihat detailnya.</div>';
}

/* =====================================================================
   HALAMAN 7: ARSIP
   ===================================================================== */
function pgArsip() {
  const kotas = [...new Set(clients.filter(c => c.status === 'Arsip').map(c => c.kota))].sort();
  return {
    title: 'Arsip', nav: 'arsip', init: updArsip, html: `
    ${crumb([['CRM Klien & Kontak'], ['Arsip']])}
    ${head('Arsip', 'Tinjau klien yang diarsipkan dan pulihkan saat kerja sama berlanjut.')}
    <div class="cards-3" id="aStats"></div>
    <div class="banner">${ic('info', 18)}<div><b>Arsip bukan penghapusan permanen</b>Pulihkan untuk mengembalikan klien ke direktori aktif. Kontak dan riwayat interaksi tetap tersimpan bersama klien.</div></div>
    <section class="card">
      <div class="card-head"><div class="ch-l"><h2>Klien Diarsipkan</h2><span class="chip" id="aCount"></span></div><span class="muted sm">Terakhir diperbarui: 24 Okt 2026</span></div>
      <div class="toolbar">
        ${searchBox('arsip.q', S.arsip.q, 'Cari kode atau nama perusahaan...')}
        ${selBox('arsip.kota', S.arsip.kota, [['', 'Semua kota'], ...kotas])}
        ${selBox('arsip.periode', S.arsip.periode, [['', 'Semua periode'], ['7', '7 hari terakhir'], ['30', '30 hari terakhir'], ['okt', 'Oktober 2026']])}
        ${selBox('arsip.alasan', S.arsip.alasan, [['', 'Semua alasan'], ...REASONS])}
      </div>
      <div id="aBody"></div>
    </section>`
  };
}
function updArsip() {
  if (!$('#aBody')) return;
  const s = S.arsip, q = s.q.trim().toLowerCase();
  const t = clients.length, a = clients.filter(c => c.status === 'Aktif').length;
  $('#aStats').innerHTML = stat('Total Klien', t, 'Perusahaan terdaftar', 'building') + stat('Aktif', a, 'Di direktori aktif', 'checkCircle') + stat('Arsip', t - a, 'Data tetap tersimpan', 'archive');
  const list = clients.filter(c => c.status === 'Arsip' && c.arsip).sort((x, y) => y.arsip.tgl.localeCompare(x.arsip.tgl))
    .filter(c => (!q || c.kode.toLowerCase().includes(q) || c.nama.toLowerCase().includes(q)) && (!s.kota || c.kota === s.kota) && (!s.alasan || c.arsip.alasan === s.alasan)
      && (!s.periode || (s.periode === 'okt' ? c.arsip.tgl.startsWith('2026-10') : daysAgo(c.arsip.tgl) <= +s.periode)));
  clampPage('arsip', list.length);
  $('#aCount').textContent = `${t - a} klien`;
  const rows = list.slice((s.page - 1) * s.per, s.page * s.per);
  $('#aBody').innerHTML = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Kode / Perusahaan</th><th>Kota</th><th>Diarsipkan</th><th>Alasan</th><th>Kontak</th><th>Diarsipkan oleh</th><th>Aksi</th></tr></thead><tbody>
  ${rows.length ? rows.map(c => `<tr><td><div class="two"><span><b>${esc(c.nama)}</b></span><small>${esc(c.kode)}</small></div></td><td>${esc(c.kota)}</td><td>${fmt(c.arsip.tgl)}</td><td>${esc(c.arsip.alasan)}</td>
    <td><span class="cnt">${ic('users', 14)}${contactsOf(c.kode).length}</span></td><td>${esc(c.arsip.oleh)}</td>
    <td><div class="acts"><button data-go="#/klien/${encodeURIComponent(c.kode)}" aria-label="Lihat detail">${ic('eye', 16)}</button><button class="btn btn-outline btn-sm" data-act="pulihkan" data-arg="${esc(c.kode)}">${ic('archive', 14)}Pulihkan</button></div></td></tr>`).join('')
    : '<tr><td colspan="7" class="empty">Tidak ada klien arsip yang cocok.</td></tr>'}
  </tbody></table></div>${pager('arsip', list.length, 'klien arsip', [6, 12, 24])}`;
}

/* =====================================================================
   AKSI, FORM & EVENT
   ===================================================================== */
const ACT = {
  closeFlash() { $('#flash')?.remove(); },
  toggleFilter() { $('#kPop')?.classList.toggle('open'); },
  resetKlien() { S.klien.kota = ''; S.klien.status = ''; S.klien.q = ''; S.klien.page = 1; route(); },
  catat() { toast('Form "Catat Interaksi" belum termasuk di desain prototype ini.'); },
  exportKlien() {
    const rows = [['Kode', 'Nama Perusahaan', 'Kota', 'Telepon', 'Email', 'Jumlah Kontak', 'Status'], ...filterKlien().map(c => [c.kode, c.nama, c.kota, c.telp, c.email, contactsOf(c.kode).length, c.status])];
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })); a.download = 'daftar-klien.csv'; a.click(); URL.revokeObjectURL(a.href);
    toast('Data klien berhasil diekspor.');
  },
  arsipkan(kode) { const c = cl(kode); c.status = 'Arsip'; c.baru = false; c.arsip = { tgl: TODAY, alasan: 'Diarsipkan manual', oleh: 'Admin CRM' }; toast(`${c.nama} dipindahkan ke arsip.`); route(); },
  pulihkan(kode) { const c = cl(kode); c.status = 'Aktif'; c.arsip = null; toast(`${c.nama} berhasil dipulihkan ke direktori aktif.`); route(); },
  toggleKontak(id) { const k = contacts.find(x => x.id === id); k.status = k.status === 'Aktif' ? 'Nonaktif' : 'Aktif'; toast(`Status kontak ${k.nama} menjadi ${k.status}.`); route(); }
};

document.addEventListener('click', e => {
  const m = e.target.closest('[data-menu]');
  if (m) {
    e.stopPropagation();
    const [t, id] = m.dataset.menu.split(':');
    if (t === 'k') {
      const c = cl(id);
      openMenu(m, [{ t: 'Lihat detail', ic: 'eye', href: '#/klien/' + encodeURIComponent(id) }, { t: 'Edit klien', ic: 'edit', href: '#/klien/edit/' + encodeURIComponent(id) },
        c.status === 'Aktif' ? { t: 'Arsipkan', ic: 'archive', act: 'arsipkan', arg: id } : { t: 'Pulihkan', ic: 'archive', act: 'pulihkan', arg: id }]);
    } else {
      const k = contacts.find(x => x.id === id), wa = k.wa.replace(/\D/g, '').replace(/^0/, '62');
      openMenu(m, [{ t: 'Hubungi via WhatsApp', ic: 'message', href: 'https://wa.me/' + wa, ext: true }, { t: 'Kirim email', ic: 'mail', href: 'mailto:' + k.email },
        { t: k.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan', ic: 'check', act: 'toggleKontak', arg: id }]);
    }
    return;
  }
  if (!e.target.closest('#fMenu')) closeMenu();
  const pop = $('#kPop'); if (pop && !e.target.closest('.pop-wrap')) pop.classList.remove('open');

  const g = e.target.closest('[data-go]'); if (g) { location.hash = g.dataset.go; return; }
  const p = e.target.closest('[data-pg]'); if (p) { if (!p.disabled) { const [k, v] = p.dataset.pg.split(':'); S[k].page = +v; U[k](); } return; }
  const a = e.target.closest('[data-act]'); if (a) { ACT[a.dataset.act]?.(a.dataset.arg, a); closeMenu(); return; }
  const tb = e.target.closest('[data-tab]'); if (tb) { S.detailTab = tb.dataset.tab; route(); return; }
  const rt = e.target.closest('[data-rt]'); if (rt) { S.riwayat.tab = rt.dataset.rt; S.riwayat.page = 1; updRiwayat(); return; }
  const it = e.target.closest('[data-int]'); if (it) { S.riwayat.sel = +it.dataset.int; updRiwayat(); return; }
  const sg = e.target.closest('[data-seg]');
  if (sg) { const f = sg.closest('.field'); $$('[data-seg]', f).forEach(b => b.classList.toggle('on', b === sg)); f.querySelector('input[name=tipe]').value = sg.dataset.seg; return; }
  if (e.target.closest('#bellBtn')) toast('Tidak ada notifikasi baru.');
});

function onField(e) {
  const t = e.target;
  if (t.dataset.f) { const [k, p] = t.dataset.f.split('.'); S[k][p] = t.value; S[k].page = 1; U[k](); }
}
document.addEventListener('input', e => { onField(e); e.target.closest('.field.err')?.classList.remove('err'); });
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.pp) { S[t.dataset.pp].per = +t.value; S[t.dataset.pp].page = 1; U[t.dataset.pp](); return; }
  if (t.dataset.sel === 'kontakKlien') { $('#coSide').innerHTML = coSideCard(t.value); const c = cl(t.value); $('#linkNote').textContent = c ? `Kontak ini hanya terhubung dengan klien ${c.kode}.` : 'Kontak ini hanya terhubung dengan klien yang dipilih.'; }
  onField(e);
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function setErr(f, name, msg) { const el = f.querySelector(`[data-fld="${name}"]`); if (!el) return true; el.classList.toggle('err', !!msg); if (msg) el.querySelector('.err-msg').textContent = msg; return !msg; }
const FORMS = {
  fKlien(f) {
    const d = Object.fromEntries(new FormData(f)); let ok = true;
    ok = setErr(f, 'nama', d.nama.trim() ? '' : 'Nama perusahaan wajib diisi.') && ok;
    ok = setErr(f, 'kota', d.kota.trim() ? '' : 'Kota wajib diisi.') && ok;
    ok = setErr(f, 'email', d.email.trim() && !EMAIL_RE.test(d.email.trim()) ? 'Format email tidak valid.' : '') && ok;
    if (!ok) { f.querySelector('.field.err input')?.focus(); return; }
    const btn = f.querySelector('[type=submit]'); btn.disabled = true; btn.textContent = 'Menyimpan...';
    setTimeout(() => {
      const val = { nama: d.nama.trim(), alamat: d.alamat.trim(), kota: d.kota.trim(), telp: d.telp.trim(), hp: d.hp.trim(), email: d.email.trim(), status: d.status };
      if (d.kodeAsli) {
        const c = cl(d.kodeAsli); Object.assign(c, val);
        if (val.status === 'Arsip' && !c.arsip) c.arsip = { tgl: TODAY, alasan: 'Diarsipkan manual', oleh: 'Admin CRM' }; if (val.status === 'Aktif') c.arsip = null;
        S.flash = { title: 'Data klien berhasil diperbarui.', msg: `Perubahan pada ${c.nama} telah disimpan.` };
      } else {
        let kode = val.nama.split(/\s+/).map(w => w[0]).join('').toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (kode.length < 2) kode = 'KLI-' + pad(clients.length + 1, 3);
        let base = kode, i = 2; while (cl(kode)) kode = `${base}-${i++}`;
        clients.forEach(c => c.baru = false);
        clients.unshift({ n: clients.length + 1, kode, ...val, arsip: val.status === 'Arsip' ? { tgl: TODAY, alasan: 'Diarsipkan manual', oleh: 'Admin CRM' } : null, baru: true });
        S.flash = { title: 'Data klien berhasil disimpan.', msg: 'Kode klien berhasil dibuat otomatis. Klien baru telah ditambahkan ke daftar.' };
      }
      Object.assign(S.klien, { q: '', status: '', kota: '', page: 1 });
      location.hash = '#/klien';
    }, 500);
  },
  fKontak(f) {
    const d = Object.fromEntries(new FormData(f)); let ok = true;
    ok = setErr(f, 'kode', d.kode ? '' : 'Pilih klien terlebih dahulu.') && ok;
    ok = setErr(f, 'nama', d.nama.trim() ? '' : 'Nama wajib diisi.') && ok;
    ok = setErr(f, 'wa', d.wa.trim() ? '' : 'Nomor WhatsApp wajib diisi.') && ok;
    ok = setErr(f, 'email', d.email.trim() && !EMAIL_RE.test(d.email.trim()) ? 'Format email tidak valid.' : '') && ok;
    if (!ok) { f.querySelector('.field.err input, .field.err select')?.focus(); return; }
    const btn = f.querySelector('[type=submit]'); btn.disabled = true; btn.textContent = 'Menyimpan...';
    setTimeout(() => {
      contacts.push({ id: 'K' + (++cid), nama: d.nama.trim(), kode: d.kode, tipe: d.tipe, jabatan: d.jabatan.trim() || '-', divisi: d.divisi.trim() || '-', wa: d.wa.trim(), email: d.email.trim() || '-', status: d.status });
      S.detailTab = 'pic'; toast('Kontak berhasil disimpan.');
      location.hash = '#/klien/' + encodeURIComponent(d.kode);
    }, 500);
  }
};
document.addEventListener('submit', e => { e.preventDefault(); FORMS[e.target.id]?.(e.target); });

/* =====================================================================
   SHELL & ROUTER
   ===================================================================== */
const NAV = [['dashboard', 'Dashboard', 'grid', '#/dashboard'], ['klien', 'Master Klien', 'building', '#/klien'], ['kontak', 'Kontak Klien', 'contact', '#/kontak'], ['riwayat', 'Riwayat Interaksi', 'message', '#/riwayat'], ['arsip', 'Arsip', 'archive', '#/arsip']];
function buildSidebar() {
  $('#sidebar').innerHTML = `
    <div class="brand"><div class="brand-row"><span class="logo-mark">A</span>ANAHEIM</div><small>PT Anaheim Nimbus Universal</small></div>
    <div class="ws"><small>WORKSPACE</small><b>F-6 · CRM Klien &amp; Kontak</b></div>
    <nav class="nav">${NAV.map(n => `<a href="${n[3]}" data-nav="${n[0]}">${ic(n[2], 17)}${n[1]}</a>`).join('')}</nav>
    <div class="side-foot"><a class="help" href="#/klien" onclick="toast('Pusat bantuan belum tersedia di prototype ini.');return false">${ic('help', 17)}Pusat bantuan</a>
      <div class="side-status"><i></i>Sistem beroperasi normal</div><div class="side-ver">ANAHEIM ERP · v2.4.0</div></div>`;
}
function setSidebar(open) { $('#sidebar').classList.toggle('open', open); $('#scrim').classList.toggle('show', open); }

function route() {
  closeMenu();
  const p = (location.hash.replace(/^#\/?/, '') || 'klien').split('/');
  const [a, b, c] = p; let r = null;
  if (a === 'dashboard') r = pgDashboard();
  else if (a === 'klien') r = !b ? pgKlien() : b === 'tambah' ? pgKlienForm() : b === 'edit' ? pgKlienForm(c) : pgDetail(b);
  else if (a === 'kontak') r = b === 'tambah' ? pgKontakForm(c) : pgKontak();
  else if (a === 'riwayat') r = pgRiwayat();
  else if (a === 'arsip') r = pgArsip();
  if (!r) { location.hash = '#/klien'; return; }
  document.title = `${r.title} · ANAHEIM CRM`;
  $('#pageTitle').textContent = r.title;
  $$('.nav a').forEach(x => x.classList.toggle('on', x.dataset.nav === r.nav));
  $('#view').innerHTML = r.html;
  r.init?.();
  setSidebar(false);
}
let lastHash = null;
window.addEventListener('hashchange', () => { window.scrollTo(0, 0); route(); });
window.addEventListener('scroll', closeMenu, { passive: true });
window.addEventListener('resize', closeMenu);

document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  $('#menuBtn').addEventListener('click', () => setSidebar(true));
  $('#scrim').addEventListener('click', () => setSidebar(false));
  const gs = $('#globalSearch');
  gs.addEventListener('keydown', e => { if (e.key === 'Enter' && gs.value.trim()) { Object.assign(S.klien, { q: gs.value.trim(), status: '', kota: '', page: 1 }); gs.value = ''; gs.blur(); if (location.hash === '#/klien') route(); else location.hash = '#/klien'; } });
  document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); gs.focus(); } });
  $('#userBtn').addEventListener('click', () => toast('Masuk sebagai Admin CRM (Administrator).'));
  if (!location.hash) location.hash = '#/klien'; else route();
});
