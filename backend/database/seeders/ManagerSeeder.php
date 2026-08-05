<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ManagerSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => env('MANAGER_EMAIL', 'manager@digimenu.test')],
            [
                'name' => env('MANAGER_NAME', 'DigiMenu Manager'),
                'password' => Hash::make(env('MANAGER_PASSWORD', 'password')),
                'role' => 'manager',
            ],
        );
    }
}
