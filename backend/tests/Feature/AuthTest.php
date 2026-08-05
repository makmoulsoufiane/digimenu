<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_manager_can_log_in(): void
    {
        User::factory()->create([
            'email' => 'manager@digimenu.test',
            'password' => Hash::make('secret-password'),
            'role' => 'manager',
        ]);

        $this->withHeader('Origin', 'http://localhost:5173')->postJson('/api/login', [
            'email' => 'manager@digimenu.test',
            'password' => 'secret-password',
            'remember' => true,
        ])
            ->assertOk()
            ->assertJsonPath('user.email', 'manager@digimenu.test')
            ->assertJsonPath('user.role', 'manager');

        $this->assertAuthenticated();
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'manager@digimenu.test',
            'password' => Hash::make('secret-password'),
        ]);

        $this->withHeader('Origin', 'http://localhost:5173')->postJson('/api/login', [
            'email' => 'manager@digimenu.test',
            'password' => 'wrong-password',
        ])->assertUnprocessable();

        $this->assertGuest();
    }

    public function test_login_rejects_non_manager_accounts(): void
    {
        User::factory()->create([
            'email' => 'waiter@digimenu.test',
            'password' => Hash::make('secret-password'),
            'role' => 'waiter',
        ]);

        $this->withHeader('Origin', 'http://localhost:5173')->postJson('/api/login', [
            'email' => 'waiter@digimenu.test',
            'password' => 'secret-password',
        ])->assertUnprocessable();

        $this->assertGuest();
    }
}
