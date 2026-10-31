'use strict';
/* =====================================================================
   ANAHEIM CRM · js/pages/arsip.js
   Halaman: Arsip Klien
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
