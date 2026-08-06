<?php

namespace Database\Seeders;

use App\Models\Manager;
use App\Models\User;
use App\Models\Waiter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ManagerSeeder extends Seeder
{
    public function run(): void
    {
        $managerUser = User::query()->updateOrCreate(
            ['email' => env('MANAGER_EMAIL', 'manager@digimenu.test')],
            [
                'name' => env('MANAGER_NAME', 'DigiMenu Manager'),
                'password' => Hash::make(env('MANAGER_PASSWORD', 'password')),
                'role' => 'manager',
            ],
        );

        $manager = Manager::query()->updateOrCreate(
            ['email' => $managerUser->email],
            [
                'full_name' => $managerUser->name,
                'password_hash' => $managerUser->password,
            ],
        );

        $waiterUser = User::query()->updateOrCreate(
            ['email' => env('WAITER_EMAIL', 'waiter@digimenu.test')],
            [
                'name' => env('WAITER_NAME', 'DigiMenu Waiter'),
                'password' => Hash::make(env('WAITER_PASSWORD', 'password')),
                'role' => 'waiter',
            ],
        );

        Waiter::query()->updateOrCreate(
            ['email' => $waiterUser->email],
            [
                'manager_id' => $manager->id,
                'first_name' => explode(' ', $waiterUser->name)[0] ?: $waiterUser->name,
                'password_hash' => $waiterUser->password,
            ],
        );
    }
}
