'use strict';
/* =====================================================================
   ANAHEIM CRM · js/pages/kontak.js
   Halaman: Kontak Klien (direktori PIC & Direktur)
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
