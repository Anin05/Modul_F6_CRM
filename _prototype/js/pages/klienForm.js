'use strict';
/* =====================================================================
   ANAHEIM CRM · js/pages/klienForm.js
   Halaman: Tambah / Edit Klien
   ===================================================================== */

const fld = (name, label, req, inner, hint = '', full = false) =>
  `<div class="field ${full ? 'full' : ''}" data-fld="${name}"><label>${label}${req ? ' <em>*</em>' : ''}</label><div class="inp">${inner}<span class="ic-err">${ic('alert', 16)}</span></div><div class="err-msg"></div>${hint ? `<div class="hint">${hint}</div>` : ''}</div>`;

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
          ${fld('nama', 'Nama Perusahaan', true, `<input name="nama" value="${v('nama')}" placeholder="Masukkan nama perusahaan">`)}
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
