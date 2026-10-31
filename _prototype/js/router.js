'use strict';
/* =====================================================================
   ANAHEIM CRM · js/router.js
   Shell (sidebar), router, event listeners utama
   ===================================================================== */

/* ---------- event listeners ---------- */
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
document.addEventListener('submit', e => { e.preventDefault(); FORMS[e.target.id]?.(e.target); });

/* ---------- sidebar ---------- */
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

/* ---------- router ---------- */
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

window.addEventListener('hashchange', () => { window.scrollTo(0, 0); route(); });
window.addEventListener('scroll', closeMenu, { passive: true });
window.addEventListener('resize', closeMenu);

/* ---------- init ---------- */
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
