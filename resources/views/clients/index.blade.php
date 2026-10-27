<x-app-layout>
    <x-slot name="breadcrumb">Master Klien</x-slot>

    <div class="flex flex-col w-full">
        <!-- Sub-header / Breadcrumbs & Page Action -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
            <div class="flex flex-col">
                <div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant mb-1">
                    <span>CRM Klien &amp; Kontak</span>
                    <span class="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                    <span class="text-primary font-medium">Master Klien</span>
                </div>
                <h1 class="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Master Klien</h1>
                <p class="font-body-md text-body-md text-on-surface-variant mt-0.5">Kelola data perusahaan klien dan seluruh kontak bisnis Anda.</p>
            </div>

            <!-- Action Button -->
            <div class="flex items-center gap-space-sm self-start md:self-auto">
                <a href="{{ route('clients.create') }}" class="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-semibold transition-all shadow-[0_1px_3px_rgba(15,23,42,0.08)] active:scale-[0.98]">
                    <span class="material-symbols-outlined text-[18px]">add</span>
                    <span>Tambah Klien</span>
                </a>
            </div>
        </div>

        <!-- Metric / Stat Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
            <!-- Stat 1 -->
            <div class="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-lg shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.02)] flex items-start justify-between">
                <div class="flex flex-col">
                    <span class="font-label-sm text-label-sm text-on-surface-variant">Total Klien</span>
                    <div class="flex items-baseline gap-space-xs mt-1">
                        <span class="font-display-lg text-display-lg font-bold text-on-surface tracking-tight">{{ $stats['total'] }}</span>
                        <span class="font-body-sm text-body-sm text-on-surface-variant">Perusahaan terdaftar</span>
                    </div>
                </div>
                <div class="w-10 h-10 rounded-lg bg-secondary-fixed text-primary flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[20px]">apartment</span>
                </div>
            </div>

            <!-- Stat 2 -->
            <div class="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-lg shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.02)] flex items-start justify-between">
                <div class="flex flex-col">
                    <span class="font-label-sm text-label-sm text-on-surface-variant">Aktif</span>
                    <div class="flex items-baseline gap-space-xs mt-1">
                        <span class="font-display-lg text-display-lg font-bold text-on-surface tracking-tight">{{ $stats['active'] }}</span>
                        <span class="font-body-sm text-body-sm text-on-surface-variant">
                            {{ $stats['total'] > 0 ? number_format(($stats['active'] / $stats['total']) * 100, 1, ',', '.') : 0 }}% dari total klien
                        </span>
                    </div>
                </div>
                <div class="w-10 h-10 rounded-lg bg-secondary-fixed text-primary flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
            </div>

            <!-- Stat 3 -->
            <div class="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-lg shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.02)] flex items-start justify-between">
                <div class="flex flex-col">
                    <span class="font-label-sm text-label-sm text-on-surface-variant">Arsip</span>
                    <div class="flex items-baseline gap-space-xs mt-1">
                        <span class="font-display-lg text-display-lg font-bold text-on-surface tracking-tight">{{ $stats['archived'] }}</span>
                        <span class="font-body-sm text-body-sm text-on-surface-variant">Data tersimpan aman</span>
                    </div>
                </div>
                <div class="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[20px]">archive</span>
                </div>
            </div>
        </div>

        <!-- Table Card Wrapper -->
        <div class="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.02)] overflow-hidden flex flex-col">
            <!-- Table Header Section -->
            <div class="px-space-lg pt-space-lg pb-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                <div class="flex items-center gap-space-sm">
                    <h2 class="font-headline-md text-headline-md text-on-surface font-semibold">Daftar Klien</h2>
                    <span class="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-secondary-fixed text-primary font-medium">{{ $stats['total'] }} klien</span>
                </div>
                <span class="font-label-sm text-label-sm text-outline">Terakhir diperbarui: {{ \Carbon\Carbon::now()->translatedFormat('d M Y') }}</span>
            </div>

            <!-- Filter & Search Section -->
            <form action="{{ route('clients.index') }}" method="GET" class="px-space-lg py-space-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-sm bg-surface-container-lowest">
                <div class="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
                    <!-- Search Input -->
                    <div class="relative flex-1 max-w-md">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">search</span>
                        <input name="search" value="{{ request('search') }}" class="w-full pl-9 pr-space-md py-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#c3c0ff] transition-all" placeholder="Cari kode, nama perusahaan, atau email..." type="text"/>
                    </div>

                    <!-- Status Filter -->
                    <div class="relative inline-block">
                        <select name="status" onchange="this.form.submit()" class="w-full sm:w-auto inline-flex items-center justify-between gap-space-xs px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors outline-none cursor-pointer">
                            <option value="">Semua Status</option>
                            <option value="aktif" {{ request('status') == 'aktif' ? 'selected' : '' }}>Aktif</option>
                            <option value="arsip" {{ request('status') == 'arsip' ? 'selected' : '' }}>Arsip</option>
                        </select>
                    </div>

                    <button type="submit" class="inline-flex items-center justify-center gap-space-xs px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors">
                        <span class="material-symbols-outlined text-[18px] text-outline">filter_list</span>
                        <span>Filter</span>
                    </button>
                </div>

                <div class="flex items-center gap-space-sm shrink-0">
                    <a href="{{ route('clients.export') }}" class="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors">
                        <span class="material-symbols-outlined text-[18px] text-outline">download</span>
                        <span>Ekspor</span>
                    </a>
                </div>
            </form>

            <!-- Data Table Container -->
            <div class="w-full overflow-x-auto mt-space-xs">
                <table class="w-full text-left whitespace-nowrap">
                    <thead>
                        <tr class="bg-surface-container-low/70">
                            <th class="py-3 px-space-lg font-table-header text-table-header uppercase tracking-wider text-outline">Kode</th>
                            <th class="py-3 px-space-md font-table-header text-table-header uppercase tracking-wider text-outline">Nama Perusahaan</th>
                            <th class="py-3 px-space-md font-table-header text-table-header uppercase tracking-wider text-outline">Kota</th>
                            <th class="py-3 px-space-md font-table-header text-table-header uppercase tracking-wider text-outline">Telepon / HP</th>
                            <th class="py-3 px-space-md font-table-header text-table-header uppercase tracking-wider text-outline">Email</th>
                            <th class="py-3 px-space-md font-table-header text-table-header uppercase tracking-wider text-outline text-center">Jumlah Kontak</th>
                            <th class="py-3 px-space-md font-table-header text-table-header uppercase tracking-wider text-outline">Status</th>
                            <th class="py-3 pr-space-lg pl-space-md font-table-header text-table-header uppercase tracking-wider text-outline text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-none font-body-sm text-body-sm">
                        @forelse($clients as $client)
                            <tr class="hover:bg-surface-container-low/50 transition-colors group">
                                <td class="py-3.5 px-space-lg font-label-md text-label-md text-on-surface-variant font-medium">
                                    {{ $client->code }}
                                </td>
                                <td class="py-3.5 px-space-md">
                                    <div class="flex items-center gap-space-sm">
                                        <div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-semibold text-[11px] shrink-0">
                                            {{ $client->initials }}
                                        </div>
                                        <a href="{{ route('clients.show', $client->id) }}" class="font-title-sm text-title-sm text-primary hover:underline font-semibold truncate max-w-[220px]">
                                            {{ $client->name }}
                                        </a>
                                    </div>
                                </td>
                                <td class="py-3.5 px-space-md text-on-surface-variant">{{ $client->city ?? '-' }}</td>
                                <td class="py-3.5 px-space-md text-on-surface">{{ $client->phone ?? $client->mobile ?? '-' }}</td>
                                <td class="py-3.5 px-space-md text-on-surface-variant">{{ $client->email }}</td>
                                <td class="py-3.5 px-space-md text-center">
                                    <span class="inline-flex items-center gap-1 text-on-surface-variant">
                                        <span class="material-symbols-outlined text-[16px] text-outline">group</span>
                                        <span>{{ $client->contacts_count }}</span>
                                    </span>
                                </td>
                                <td class="py-3.5 px-space-md">
                                    @if(strtolower($client->status) === 'aktif')
                                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-tertiary font-label-sm text-label-sm font-medium">
                                            <span class="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                                            <span>Aktif</span>
                                        </span>
                                    @else
                                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-medium">
                                            <span class="w-1.5 h-1.5 rounded-full bg-outline"></span>
                                            <span>Arsip</span>
                                        </span>
                                    @endif
                                </td>
                                <td class="py-3.5 pr-space-lg pl-space-md text-right">
                                    <div class="inline-flex items-center gap-1 justify-end">
                                        <a href="{{ route('clients.show', $client->id) }}" class="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container-high transition-colors" title="Lihat Detail">
                                            <span class="material-symbols-outlined text-[18px]">visibility</span>
                                        </a>
                                        <a href="{{ route('clients.edit', $client->id) }}" class="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors" title="Edit">
                                            <span class="material-symbols-outlined text-[18px]">edit</span>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" class="text-center py-6 text-on-surface-variant">Data klien tidak ditemukan.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <!-- Table Pagination Footer -->
            <div class="px-space-lg py-space-md bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-md">
                <span class="font-body-sm text-body-sm text-on-surface-variant">
                    Menampilkan {{ $clients->firstItem() ?? 0 }}-{{ $clients->lastItem() ?? 0 }} dari {{ $clients->total() }} klien
                </span>
                
                <div>
                    {{ $clients->links() }}
                </div>
            </div>
        </div>
    </div>
</x-app-layout>