'use strict';
/* =====================================================================
   ANAHEIM CRM · js/components.js
   Helper functions, icon library, small reusable UI components,
   pager, toast, context menu, state, dan updater map.
   ===================================================================== */

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// pad — didefinisikan di data.js (dimuat lebih dahulu)
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const fmt = iso => { const [y, m, d] = iso.split('-'); return `${d} ${MONTHS[+m - 1]} ${y}`; };
const fmtS = iso => { const [, m, d] = iso.split('-'); return `${+d} ${MONTHS[+m - 1]}`; };
const TODAY = '2026-10-26';
const daysAgo = iso => Math.round((new Date(TODAY) - new Date(iso)) / 864e5);
const pctStr = n => n.toFixed(1).replace('.', ',') + '%';

/* ---------- icon library ---------- */
const ICONS = {
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  chevD: '<polyline points="6 9 12 15 18 9"/>',
  chevL: '<polyline points="15 18 9 12 15 6"/>',
  chevR: '<polyline points="9 18 15 12 9 6"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  arrowL: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  ext: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  contact: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 21v-1a5 5 0 0 1 10 0v1"/>',
  archive: '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
};
const ic = (n, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ---------- state ---------- */
const S = {
  klien:   { q: '', status: '', kota: '', page: 1, per: 8 },
  kontak:  { q: '', klien: '', tipe: '', status: '', page: 1, per: 8 },
  riwayat: { q: '', klien: '', kanal: '', periode: '', tab: 'all', page: 1, per: 5, sel: null },
  arsip:   { q: '', kota: '', periode: '', alasan: '', page: 1, per: 6 },
  detailTab: 'pic', flash: null
};
const U = { klien: () => updKlien(), kontak: () => updKontak(), riwayat: () => updRiwayat(), arsip: () => updArsip() };

/* ---------- small UI components ---------- */
const initials = n => { const w = n.replace(/^(PT|CV)\s+/, '').split(/\s+/).filter(Boolean); return (((w[0] || '')[0] || '') + ((w[1] || '')[0] || '')).toUpperCase(); };
const badge  = s => `<span class="badge ${s === 'Aktif' ? 'ok' : 'mute'}"><i></i>${esc(s)}</span>`;
const avatar = (n, cls = '') => `<span class="avatar ${cls}">${esc(initials(n))}</span>`;
const stat   = (l, v, note, icon) => `<div class="stat"><div><div class="stat-l">${l}</div><div class="stat-v"><b>${v}</b><span>${note}</span></div></div><div class="stat-ic">${ic(icon, 18)}</div></div>`;
const crumb  = items => `<nav class="crumb">${items.map((it, i) => {
  const last = i === items.length - 1;
  const t = it[1] && !last ? `<a href="${it[1]}">${esc(it[0])}</a>` : `<span class="${last ? 'cur' : ''}">${esc(it[0])}</span>`;
  return (i ? ic('chevR', 12) : '') + t;
}).join('')}</nav>`;
const head     = (t, d, right = '') => `<div class="page-head"><div><h1>${t}</h1><p>${d}</p></div>${right}</div>`;
const selBox   = (f, val, opts, cls = '') => `<div class="sel ${cls}"><select data-f="${f}">${opts.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(l)}</option>`; }).join('')}</select>${ic('chevD', 14)}</div>`;
const searchBox = (f, val, ph) => `<label class="srch grow">${ic('search')}<input data-f="${f}" placeholder="${esc(ph)}" value="${esc(val)}" autocomplete="off"></label>`;

/* ---------- pager ---------- */
function pager(key, total, unit, opts) {
  const s = S[key], pages = Math.max(1, Math.ceil(total / s.per)), p = s.page;
  let nums;
  if (pages <= 5) nums = Array.from({ length: pages }, (_, i) => i + 1);
  else if (p <= 3) nums = [1, 2, 3, '…', pages];
  else if (p >= pages - 2) nums = [1, '…', pages - 2, pages - 1, pages];
  else nums = [1, '…', p - 1, p, p + 1, '…', pages];
  const st = total ? (p - 1) * s.per + 1 : 0, en = Math.min(total, p * s.per);
  return `<div class="pager"><span class="muted sm">Menampilkan ${st}–${en} dari ${total} ${unit}</span>
  <div class="pg-r"><div class="sel sm"><select data-pp="${key}">${opts.map(o => `<option value="${o}" ${o === s.per ? 'selected' : ''}>${o} / halaman</option>`).join('')}</select>${ic('chevD', 14)}</div>
  <button class="pg" data-pg="${key}:${p - 1}" ${p <= 1 ? 'disabled' : ''} aria-label="Sebelumnya">${ic('chevL', 14)}</button>
  ${nums.map(n => n === '…' ? '<span class="pg-dots">…</span>' : `<button class="pg ${n === p ? 'on' : ''}" data-pg="${key}:${n}">${n}</button>`).join('')}
  <button class="pg" data-pg="${key}:${p + 1}" ${p >= pages ? 'disabled' : ''} aria-label="Berikutnya">${ic('chevR', 14)}</button></div></div>`;
}
function clampPage(key, total) { const s = S[key], pages = Math.max(1, Math.ceil(total / s.per)); if (s.page > pages) s.page = pages; if (s.page < 1) s.page = 1; }

/* ---------- toast ---------- */
function toast(m) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2600);
}

/* ---------- context menu ---------- */
function closeMenu() { $('#fMenu')?.remove(); }
function openMenu(btn, items) {
  closeMenu();
  const m = document.createElement('div'); m.className = 'menu'; m.id = 'fMenu';
  m.innerHTML = items.map(i => i.href
    ? `<a href="${i.href}" ${i.ext ? 'target="_blank" rel="noopener"' : ''}>${ic(i.ic, 14)}${i.t}</a>`
    : `<button data-act="${i.act}" data-arg="${esc(i.arg)}">${ic(i.ic, 14)}${i.t}</button>`).join('');
  document.body.appendChild(m);
  const r = btn.getBoundingClientRect(), w = m.offsetWidth;
  m.style.top = (r.bottom + 4) + 'px'; m.style.left = Math.max(8, r.right - w) + 'px';
}
