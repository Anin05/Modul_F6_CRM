@extends('layouts.app')

@section('title', 'Master Klien')
@section('page_title', 'Master Klien')

@section('content')
<nav class="crumb">
    <span>CRM Klien &amp; Kontak</span>
    <x-icon name="chevR" size="12" />
    <span class="cur">Master Klien</span>
</nav>

<div class="page-head">
    <div>
        <h1>Master Klien</h1>
        <p>Kelola data perusahaan klien dan seluruh kontak bisnis Anda.</p>
    </div>
    <a class="btn btn-primary" href="{{ route('klien.create') }}">
        <x-icon name="plus" size="16" /> Tambah Klien
    </a>
</div>

<div class="cards-3">
    <div class="stat">
        <div>
            <div class="stat-l">Total Klien</div>
            <div class="stat-v">
                <b>{{ $totalKlien }}</b>
                <span>Perusahaan terdaftar</span>
            </div>
        </div>
        <div class="stat-ic"><x-icon name="building" size="18" /></div>
    </div>
    <div class="stat">
        <div>
            <div class="stat-l">Aktif</div>
            <div class="stat-v">
                <b>{{ $aktifKlien }}</b>
                <span>{{ $totalKlien > 0 ? number_format(($aktifKlien / $totalKlien) * 100, 1) : 0 }}% dari total klien</span>
            </div>
        </div>
        <div class="stat-ic"><x-icon name="checkCircle" size="18" /></div>
    </div>
    <div class="stat">
        <div>
            <div class="stat-l">Arsip</div>
            <div class="stat-v">
                <b>{{ $arsipKlien }}</b>
                <span>Data tersimpan aman</span>
            </div>
        </div>
        <div class="stat-ic"><x-icon name="archive" size="18" /></div>
    </div>
</div>

<section class="card">
    <div class="card-head">
        <div class="ch-l">
            <h2>Daftar Klien</h2>
            <span class="chip">{{ $kliens->total() }} klien</span>
        </div>
        <span class="muted sm">Halaman {{ $kliens->currentPage() }} dari {{ $kliens->lastPage() }}</span>
    </div>

    <!-- Toolbar Filters -->
    <form action="{{ route('klien.index') }}" method="GET" class="toolbar" id="filterForm">
        <label class="srch grow">
            <x-icon name="search" size="16" />
            <input name="q" placeholder="Cari kode, nama perusahaan, atau email..." value="{{ request('q') }}" autocomplete="off">
        </label>

        <div class="sel">
            <select name="status" onchange="this.form.submit()">
                <option value="">Semua status</option>
                <option value="Aktif" {{ request('status') === 'Aktif' ? 'selected' : '' }}>Aktif</option>
                <option value="Arsip" {{ request('status') === 'Arsip' ? 'selected' : '' }}>Arsip</option>
            </select>
            <x-icon name="chevD" size="14" />
        </div>

        <div class="sel">
            <select name="kota" onchange="this.form.submit()">
                <option value="">Semua kota</option>
                @foreach ($kotas as $kota)
                    <option value="{{ $kota }}" {{ request('kota') === $kota ? 'selected' : '' }}>{{ $kota }}</option>
                @endforeach
            </select>
            <x-icon name="chevD" size="14" />
        </div>

        @if (request()->hasAny(['q', 'status', 'kota']))
            <a href="{{ route('klien.index') }}" class="btn btn-outline btn-sm">Reset</a>
        @endif

        <span class="sp"></span>

        <a href="{{ route('klien.export', request()->query()) }}" class="btn btn-outline">
            <x-icon name="download" size="16" /> Ekspor
        </a>
    </form>

    <!-- Table -->
    <div class="tbl-wrap">
        <table class="tbl">
            <thead>
                <tr>
                    <th>Kode</th>
                    <th>Nama Perusahaan</th>
                    <th>Kota</th>
                    <th>Telepon</th>
                    <th>Email</th>
                    <th>Jumlah Kontak</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($kliens as $c)
                    <tr class="{{ $c->baru ? 'hl' : '' }}">
                        <td>
                            @if ($c->baru)
                                <b>{{ $c->kode }}</b><br>
                                <span class="kode-new">BARU</span>
                            @else
                                {{ $c->kode }}
                            @endif
                        </td>
                        <td>
                            <div class="cell-co">
                                <span class="avatar {{ $c->baru ? 'dark' : '' }}">{{ $c->initials }}</span>
                                <b>{{ $c->nama }}</b>
                            </div>
                        </td>
                        <td>{{ $c->kota }}</td>
                        <td>{{ $c->telp ?? '-' }}</td>
                        <td>{{ $c->email ?? '-' }}</td>
                        <td>
                            <span class="cnt">
                                <x-icon name="users" size="14" />
                                {{ $c->kontaks_count }}
                            </span>
                        </td>
                        <td>
                            <span class="badge {{ $c->status === 'Aktif' ? 'ok' : 'mute' }}">
                                <i></i>{{ $c->status }}
                            </span>
                        </td>
                        <td>
                            <div class="acts rel">
                                <a href="{{ route('klien.show', $c->kode) }}" aria-label="Lihat detail">
                                    <x-icon name="eye" size="16" />
                                </a>
                                <button type="button" data-dropdown-trigger aria-label="Menu">
                                    <x-icon name="more" size="16" />
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item" href="{{ route('klien.show', $c->kode) }}">
                                        <x-icon name="eye" size="14" /> Lihat detail
                                    </a>
                                    <a class="dropdown-item" href="{{ route('klien.edit', $c->kode) }}">
                                        <x-icon name="edit" size="14" /> Edit klien
                                    </a>
                                    @if ($c->status === 'Aktif')
                                        <form action="{{ route('klien.arsipkan', $c->kode) }}" method="POST" onsubmit="return confirm('Arsipkan klien {{ $c->nama }}?')">
                                            @csrf
                                            <button type="submit" class="dropdown-item">
                                                <x-icon name="archive" size="14" /> Arsipkan
                                            </button>
                                        </form>
                                    @else
                                        <form action="{{ route('klien.pulihkan', $c->kode) }}" method="POST">
                                            @csrf
                                            <button type="submit" class="dropdown-item">
                                                <x-icon name="archive" size="14" /> Pulihkan
                                            </button>
                                        </form>
                                    @endif
                                </div>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8" class="empty">Tidak ada klien yang cocok dengan filter pencarian.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Pager -->
    <div class="pager">
        <span class="muted sm">
            Menampilkan {{ $kliens->firstItem() ?? 0 }}–{{ $kliens->lastItem() ?? 0 }} dari {{ $kliens->total() }} klien
        </span>
        <div class="pg-r">
            <div class="sel sm">
                <select onchange="location.href = this.value">
                    @foreach ([8, 16, 32] as $per)
                        <option value="{{ request()->fullUrlWithQuery(['per' => $per, 'page' => 1]) }}" {{ $kliens->perPage() == $per ? 'selected' : '' }}>
                            {{ $per }} / halaman
                        </option>
                    @endforeach
                </select>
                <x-icon name="chevD" size="14" />
            </div>

            @if ($kliens->onFirstPage())
                <button class="pg" disabled aria-label="Sebelumnya"><x-icon name="chevL" size="14" /></button>
            @else
                <a class="pg" href="{{ $kliens->previousPageUrl() }}" aria-label="Sebelumnya"><x-icon name="chevL" size="14" /></a>
            @endif

            @foreach ($kliens->getUrlRange(max(1, $kliens->currentPage() - 2), min($kliens->lastPage(), $kliens->currentPage() + 2)) as $page => $url)
                <a class="pg {{ $page == $kliens->currentPage() ? 'on' : '' }}" href="{{ $url }}">{{ $page }}</a>
            @endforeach

            @if ($kliens->hasMorePages())
                <a class="pg" href="{{ $kliens->nextPageUrl() }}" aria-label="Berikutnya"><x-icon name="chevR" size="14" /></a>
            @else
                <button class="pg" disabled aria-label="Berikutnya"><x-icon name="chevR" size="14" /></button>
            @endif
        </div>
    </div>
</section>
@endsection

