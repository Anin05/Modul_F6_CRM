'use strict';
/* =====================================================================
   ANAHEIM CRM · js/actions.js
   ACT handlers (arsipkan, pulihkan, export, dll.) + form validators
   ===================================================================== */

const ACT = {
  closeFlash()  { $('#flash')?.remove(); },
  toggleFilter(){ $('#kPop')?.classList.toggle('open'); },
  resetKlien()  { S.klien.kota = ''; S.klien.status = ''; S.klien.q = ''; S.klien.page = 1; route(); },
  catat()       { toast('Form "Catat Interaksi" belum termasuk di desain prototype ini.'); },
  exportKlien() {
    const rows = [['Kode', 'Nama Perusahaan', 'Kota', 'Telepon', 'Email', 'Jumlah Kontak', 'Status'], ...filterKlien().map(c => [c.kode, c.nama, c.kota, c.telp, c.email, contactsOf(c.kode).length, c.status])];
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })); a.download = 'daftar-klien.csv'; a.click(); URL.revokeObjectURL(a.href);
    toast('Data klien berhasil diekspor.');
  },
  arsipkan(kode)    { const c = cl(kode); c.status = 'Arsip'; c.baru = false; c.arsip = { tgl: TODAY, alasan: 'Diarsipkan manual', oleh: 'Admin CRM' }; toast(`${c.nama} dipindahkan ke arsip.`); route(); },
  pulihkan(kode)    { const c = cl(kode); c.status = 'Aktif'; c.arsip = null; toast(`${c.nama} berhasil dipulihkan ke direktori aktif.`); route(); },
  toggleKontak(id)  { const k = contacts.find(x => x.id === id); k.status = k.status === 'Aktif' ? 'Nonaktif' : 'Aktif'; toast(`Status kontak ${k.nama} menjadi ${k.status}.`); route(); }
};

/* ---------- form validation ---------- */
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
