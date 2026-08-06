<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('managers', function (Blueprint $table): void {
            $table->id();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->timestamps();
        });

        Schema::create('waiters', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('manager_id')->constrained()->cascadeOnDelete();
            $table->string('first_name');
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->timestamps();
        });

        $managerId = $this->seedManagerProfile();
        $this->seedWaiterProfiles($managerId);

        Schema::table('menus', function (Blueprint $table): void {
            $table->foreignId('manager_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
        });

        Schema::table('restaurant_tables', function (Blueprint $table): void {
            $table->foreignId('manager_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
        });

        DB::table('menus')->whereNull('manager_id')->update(['manager_id' => $managerId]);
        DB::table('restaurant_tables')->whereNull('manager_id')->update(['manager_id' => $managerId]);

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE menus MODIFY manager_id BIGINT UNSIGNED NOT NULL');
            DB::statement('ALTER TABLE restaurant_tables MODIFY manager_id BIGINT UNSIGNED NOT NULL');
        }

        DB::table('orders')->update(['accepted_by_waiter_id' => null]);

        Schema::table('orders', function (Blueprint $table): void {
            $table->dropForeign(['accepted_by_waiter_id']);
            $table->foreign('accepted_by_waiter_id')->references('id')->on('waiters')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->dropForeign(['accepted_by_waiter_id']);
            $table->foreign('accepted_by_waiter_id')->references('id')->on('users')->nullOnDelete();
        });

        Schema::table('restaurant_tables', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('manager_id');
        });

        Schema::table('menus', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('manager_id');
        });

        Schema::dropIfExists('waiters');
        Schema::dropIfExists('managers');
    }

    private function seedManagerProfile(): int
    {
        $managerUser = DB::table('users')->where('role', 'manager')->first();

        return (int) DB::table('managers')->insertGetId([
            'full_name' => $managerUser?->name ?? 'DigiMenu Manager',
            'email' => $managerUser?->email ?? 'manager@digimenu.test',
            'password_hash' => $managerUser?->password ?? '',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function seedWaiterProfiles(int $managerId): void
    {
        $waiterUsers = DB::table('users')->where('role', 'waiter')->get();

        if ($waiterUsers->isEmpty()) {
            DB::table('waiters')->insert([
                'manager_id' => $managerId,
                'first_name' => 'DigiMenu Waiter',
                'email' => 'waiter@digimenu.test',
                'password_hash' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return;
        }

        foreach ($waiterUsers as $waiterUser) {
            DB::table('waiters')->insert([
                'manager_id' => $managerId,
                'first_name' => explode(' ', $waiterUser->name)[0] ?: $waiterUser->name,
                'email' => $waiterUser->email,
                'password_hash' => $waiterUser->password,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
};
