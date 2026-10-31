'use strict';
/* =====================================================================
   ANAHEIM CRM · js/pages/riwayat.js
   Halaman: Riwayat Interaksi
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
