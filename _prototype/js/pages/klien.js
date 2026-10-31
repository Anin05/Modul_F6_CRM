'use strict';
/* =====================================================================
   ANAHEIM CRM · js/pages/klien.js
   Halaman: Master Klien (daftar + filter + pager)
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
