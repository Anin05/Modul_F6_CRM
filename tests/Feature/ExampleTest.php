<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Database\Seeders\CrmSeeder;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CrmSeeder::class);
    }

    public function test_root_redirects_to_dashboard(): void
    {
        $response = $this->get('/');
        $response->assertRedirect('/dashboard');
    }

    public function test_dashboard_loads_successfully(): void
    {
        $response = $this->get('/dashboard');
        $response->assertStatus(200);
        $response->assertSee('ANAHEIM');
    }

    public function test_klien_index_loads(): void
    {
        $response = $this->get('/klien');
        $response->assertStatus(200);
        $response->assertSee('Master Klien');
    }

    public function test_kontak_index_loads(): void
    {
        $response = $this->get('/kontak');
        $response->assertStatus(200);
        $response->assertSee('Kontak Klien');
    }

    public function test_riwayat_index_loads(): void
    {
        $response = $this->get('/riwayat');
        $response->assertStatus(200);
        $response->assertSee('Riwayat Interaksi');
    }

    public function test_arsip_index_loads(): void
    {
        $response = $this->get('/arsip');
        $response->assertStatus(200);
        $response->assertSee('Arsip');
    }
}
