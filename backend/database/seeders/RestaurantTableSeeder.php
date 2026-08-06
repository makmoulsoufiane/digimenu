<?php

namespace Database\Seeders;

use App\Models\Manager;
use App\Models\RestaurantTable;
use Illuminate\Database\Seeder;

class RestaurantTableSeeder extends Seeder
{
    public function run(): void
    {
        $managerId = Manager::query()->firstOrCreate(
            ['email' => 'manager@digimenu.test'],
            [
                'full_name' => 'DigiMenu Manager',
                'password_hash' => '',
            ],
        )->id;

        foreach (range(1, 6) as $tableNumber) {
            RestaurantTable::query()->updateOrCreate(
                ['code' => "T{$tableNumber}"],
                [
                    'manager_id' => $managerId,
                    'table_number' => $tableNumber,
                    'capacity' => $tableNumber <= 2 ? 2 : 4,
                    'status' => 'available',
                ],
            );
        }
    }
}
