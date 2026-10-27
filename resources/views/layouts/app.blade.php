<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'CRM Klien & Kontak' }} - PT Anaheim Nimbus Universal</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>

    <style>
        @layer base {
            html, body { margin: 0; padding: 0; }
            body { overscroll-behavior: none; }
            main > :first-child { margin-top: 0 !important; }
            main > :last-child { margin-bottom: 0 !important; }
        }
        ::-webkit-scrollbar { display: none; }
    </style>

    <!-- Tailwind CDN Script (Sesuai Konfigurasi Custom Tema) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "primary-fixed-dim": "#c3c0ff",
                        "tertiary": "#005522",
                        "tertiary-fixed-dim": "#62df7d",
                        "on-error-container": "#93000a",
                        "surface-container-low": "#f2f3ff",
                        "primary-container": "#4f46e5",
                        "inverse-surface": "#283044",
                        "surface-tint": "#4d44e3",
                        "surface-container-high": "#e2e7ff",
                        "on-primary": "#ffffff",
                        "secondary-fixed-dim": "#c0c1ff",
                        "outline-variant": "#c7c4d8",
                        "on-surface-variant": "#464555",
                        "on-secondary": "#ffffff",
                        "background": "#faf8ff",
                        "surface": "#faf8ff",
                        "primary": "#3525cd",
                        "secondary-fixed": "#e1e0ff",
                        "on-tertiary-fixed": "#002109",
                        "surface-container": "#eaedff",
                        "on-primary-fixed-variant": "#3323cc",
                        "tertiary-container": "#00702f",
                        "on-surface": "#131b2e",
                        "secondary": "#4648d4",
                        "error-container": "#ffdad6",
                        "inverse-primary": "#c3c0ff",
                        "on-surface-variant": "#464555",
                        "surface-dim": "#d2d9f4",
                        "inverse-on-surface": "#eef0ff",
                        "on-primary-fixed": "#0f0069",
                        "surface-bright": "#faf8ff",
                        "on-secondary-fixed": "#07006c",
                        "surface-variant": "#dae2fd",
                        "on-tertiary-container": "#78f591",
                        "secondary-container": "#6063ee",
                        "primary-fixed": "#e2dfff",
                        "on-secondary-fixed-variant": "#2f2ebe",
                        "surface-container-lowest": "#ffffff",
                        "on-tertiary-fixed-variant": "#005320",
                        "on-error": "#ffffff",
                        "surface-container-highest": "#dae2fd",
                        "outline": "#777587",
                        "error": "#ba1a1a",
                        "on-tertiary": "#ffffff",
                        "on-primary-container": "#dad7ff",
                        "tertiary-fixed": "#7ffc97"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "space-md": "1rem",
                        "space-xs": "0.25rem",
                        "space-sm": "0.5rem",
                        "space-xl": "2rem",
                        "margin-mobile": "1rem",
                        "space-lg": "1.5rem",
                        "margin": "2rem",
                        "gutter": "1.5rem",
                        "gutter-mobile": "0.75rem"
                    },
                    "fontFamily": {
                        "display-lg": ["Inter"],
                        "body-lg": ["Inter"],
                        "label-md": ["Inter"],
                        "headline-lg-mobile": ["Inter"],
                        "headline-md": ["Inter"],
                        "title-sm": ["Inter"],
                        "headline-lg": ["Inter"],
                        "table-header": ["Inter"],
                        "label-sm": ["Inter"],
                        "body-sm": ["Inter"],
                        "body-md": ["Inter"]
                    },
                    "fontSize": {
                        "display-lg": ["2rem", { "lineHeight": "2.5rem", "fontWeight": "700" }],
                        "body-lg": ["1rem", { "lineHeight": "1.5rem", "fontWeight": "400" }],
                        "label-md": ["0.875rem", { "lineHeight": "1.25rem", "fontWeight": "500" }],
                        "headline-lg-mobile": ["1.25rem", { "lineHeight": "1.75rem", "fontWeight": "600" }],
                        "headline-md": ["1.125rem", { "lineHeight": "1.625rem", "fontWeight": "600" }],
                        "title-sm": ["0.875rem", { "lineHeight": "1.25rem", "fontWeight": "600" }],
                        "headline-lg": ["1.5rem", { "lineHeight": "2rem", "fontWeight": "600" }],
                        "table-header": ["0.6875rem", { "lineHeight": "1rem", "fontWeight": "600" }],
                        "label-sm": ["0.75rem", { "lineHeight": "1rem", "fontWeight": "500" }],
                        "body-sm": ["0.75rem", { "lineHeight": "1rem", "fontWeight": "400" }],
                        "body-md": ["0.875rem", { "lineHeight": "1.25rem", "fontWeight": "400" }]
                    }
                }
            }
        };
    </script>
</head>
<body class="bg-background font-body-md text-body-md text-on-surface antialiased">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none">
        <div class="flex flex-col">
            <div class="h-16 px-space-lg flex items-center gap-space-sm bg-surface-container-lowest">
                <img alt="Anaheim Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1XN_4VqM4oaRH21Q9mZUkSukKtMoDBVWbmDbZpiU9dudFr-emrwntq7ijMsinBtPbd7V5DEqTxh2Sq7oJK5hAcGMbKSn31bUQfjQgeS74FT4JYrtbjivSWQ4Ui-r8u3iWd08epWADzPuu2m7scZAlGAngUF7AGQFYiHslSOesL1sofcb4HLu7eO0CzZ9QlyuNufc7fw40HWq_RwlG0PxGQe9wkusNH8PaV9HemnXuHG_illSrDnm_giQMjN"/>
                <div class="flex flex-col min-w-0 leading-none">
                    <span class="font-title-sm text-title-sm text-on-surface tracking-tight uppercase truncate">ANAHEIM</span>
                    <span class="font-label-sm text-label-sm text-on-surface-variant truncate">PT Anaheim Nimbus Universal</span>
                </div>
            </div>
            
            <div class="px-space-lg pt-space-lg pb-space-xs">
                <p class="font-table-header text-table-header uppercase tracking-wider text-outline">WORKSPACE</p>
                <p class="font-title-sm text-title-sm text-on-surface truncate mt-space-xs">F-6 · CRM Klien &amp; Kontak</p>
            </div>

            <nav class="flex flex-col gap-space-xs px-space-sm mt-space-sm">
                <a href="{{ route('dashboard') }}" class="flex items-center gap-space-sm px-space-sm py-space-sm rounded-lg font-body-md text-body-md {{ request()->routeIs('dashboard') ? 'bg-surface-container-high text-primary font-title-sm' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface' }} transition-colors">
                    <span class="material-symbols-outlined text-[20px]">grid_view</span>
                    <span class="truncate">Dashboard</span>
                </a>

                <a href="{{ route('clients.index') }}" class="flex items-center justify-between px-space-sm py-space-sm transition-colors {{ request()->routeIs('clients.*') ? 'bg-surface-container-high text-primary font-title-sm' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface' }} rounded-lg">
                    <div class="flex items-center gap-space-sm min-w-0">
                        <span class="material-symbols-outlined text-[20px]">apartment</span>
                        <span class="truncate">Master Klien</span>
                    </div>
                    <span class="font-label-sm text-label-sm px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">{{ $totalClients ?? 0 }}</span>
                </a>

                <a href="#" class="flex items-center gap-space-sm px-space-sm py-space-sm rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors">
                    <span class="material-symbols-outlined text-[20px]">contact_page</span>
                    <span class="truncate">Kontak Klien</span>
                </a>

                <a href="#" class="flex items-center gap-space-sm px-space-sm py-space-sm rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors">
                    <span class="material-symbols-outlined text-[20px]">chat</span>
                    <span class="truncate">Riwayat Interaksi</span>
                </a>

                <a href="#" class="flex items-center gap-space-sm px-space-sm py-space-sm rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors">
                    <span class="material-symbols-outlined text-[20px]">archive</span>
                    <span class="truncate">Arsip</span>
                </a>
            </nav>
        </div>

        <div class="flex flex-col p-space-md gap-space-sm bg-surface-container-lowest">
            <a href="#" class="flex items-center gap-space-sm px-space-sm py-space-sm rounded-lg font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors">
                <span class="material-symbols-outlined text-[20px]">help</span>
                <span class="truncate">Pusat bantuan</span>
            </a>
            <div class="flex items-center gap-space-xs px-space-sm py-space-xs">
                <span class="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
                <span class="font-label-sm text-label-sm text-tertiary truncate">Sistem beroperasi normal</span>
            </div>
            <div class="px-space-sm pt-space-xs">
                <span class="font-table-header text-table-header text-outline tracking-tight block">ANAHEIM ERP · v2.4.0</span>
            </div>
        </div>
    </aside>

    <div class="pl-64 flex flex-col min-h-screen">
        <!-- Header -->
        <header class="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter">
            <div class="flex items-center gap-space-sm min-w-0">
                <div class="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant truncate">
                    <span class="font-label-md text-label-md text-on-surface font-semibold truncate">CRM &amp; Kontak</span>
                    <span class="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
                    <span class="font-label-md text-label-md text-primary font-semibold truncate">{{ $breadcrumb ?? 'Master Data' }}</span>
                </div>
            </div>

            <div class="flex items-center gap-space-md">
                <div class="relative flex items-center">
                    <form action="{{ route('clients.index') }}" method="GET" class="flex items-center bg-surface-container-low rounded-lg px-space-sm py-1.5 w-64 lg:w-80 gap-space-xs text-on-surface-variant focus-within:ring-2 focus-within:ring-primary focus-within:bg-surface-container-lowest transition-all">
                        <span class="material-symbols-outlined text-[18px] text-outline">search</span>
                        <input name="search" value="{{ request('search') }}" class="bg-transparent border-0 outline-none w-full font-body-sm text-body-sm text-on-surface placeholder-outline" placeholder="Cari di workspace..." type="text"/>
                        <kbd class="font-table-header text-table-header px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant uppercase select-none">⌘ K</kbd>
                    </form>
                </div>

                <div class="h-6 w-px bg-surface-container-high"></div>

                <button class="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors" type="button">
                    <span class="material-symbols-outlined text-[20px]">notifications</span>
                    <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
                </button>

                <div class="flex items-center gap-space-sm pl-space-xs cursor-pointer group">
                    <img alt="Profile" class="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7LwAIskFL62VI9xaMla0xFwHjiramjwszLxaa6QCKwcPueylsqOmBMBZ8CzCkEdue1Y4ygZn-qpKRrrp0IaOnxjbHhyA8Am5H4DCxHqonzTye62G5Tj6LZKnWFASEfQIpRn4177TObEvxpWV9-NpapsE-DTeGbyKsbjvsdtb7e24Clr2C3qHhhjDSUTDbs03fd6NBcDJ67xmknKM_-Af-EgBlvV3N_mH16dYM8nDckyxdWpHGup2kSA"/>
                    <div class="hidden md:flex flex-col leading-tight">
                        <span class="font-title-sm text-title-sm text-on-surface group-hover:text-primary transition-colors">{{ auth()->user()->name ?? 'Admin CRM' }}</span>
                        <span class="font-label-sm text-label-sm text-on-surface-variant">{{ auth()->user()->role ?? 'Administrator' }}</span>
                    </div>
                    <span class="material-symbols-outlined text-[18px] text-outline group-hover:text-on-surface transition-colors">expand_more</span>
                </div>
            </div>
        </header>

        <!-- Dynamic Main Content -->
        <main class="flex-1 pt-16 w-full px-gutter pb-space-xl bg-background">
            {{ $slot }}
        </main>

        <!-- Footer -->
        <footer class="w-full bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] py-space-md px-gutter flex flex-col md:flex-row items-center justify-between gap-space-sm">
            <span class="font-body-sm text-body-sm text-on-surface-variant">© {{ date('Y') }} PT Anaheim Nimbus Universal. Hak cipta dilindungi.</span>
            <div class="flex items-center gap-space-md">
                <span class="font-label-sm text-label-sm text-outline">F-6 · CRM Klien &amp; Kontak</span>
                <span class="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span class="font-label-sm text-label-sm text-primary">Workspace Terenkripsi</span>
            </div>
        </footer>
    </div>

    @stack('scripts')
</body>
</html>