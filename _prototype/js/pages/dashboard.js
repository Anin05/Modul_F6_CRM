'use strict';
/* =====================================================================
   ANAHEIM CRM · js/pages/dashboard.js
   Halaman: Dashboard (ringkasan)
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
