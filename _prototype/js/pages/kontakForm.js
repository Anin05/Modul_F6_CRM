'use strict';
/* =====================================================================
   ANAHEIM CRM · js/pages/kontakForm.js
   Halaman: Tambah Kontak
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
