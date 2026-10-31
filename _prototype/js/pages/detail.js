'use strict';
/* =====================================================================
   ANAHEIM CRM · js/pages/detail.js
   Halaman: Detail Klien (tab Informasi, PIC & Direktur, Riwayat)
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
