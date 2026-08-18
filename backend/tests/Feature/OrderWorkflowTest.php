<?php

namespace Tests\Feature;

use App\Models\Manager;
use App\Models\Menu;
use App\Models\Order;
use App\Models\RestaurantTable;
use App\Models\User;
use App\Models\Waiter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_scan_table_menu_and_create_order(): void
    {
        [$table, $item] = $this->createTableAndMenuItem();

        $this->getJson("/api/tables/{$table->code}/menu")
            ->assertOk()
            ->assertJsonPath('table.code', 'T1')
            ->assertJsonPath('menus.0.items.0.name', 'Soup');

        $this->postJson("/api/tables/{$table->code}/orders", [
            'customerName' => 'Sara',
            'items' => [
                ['menuItemId' => $item->id, 'quantity' => 2],
            ],
        ])
            ->assertCreated()
            ->assertJsonStructure(['order' => ['visit' => ['id']]])
            ->assertJsonPath('order.visit.status', 'open')
            ->assertJsonPath('order.visit.hasReview', false)
            ->assertJsonPath('order.status', Order::STATUS_PENDING)
            ->assertJsonPath('order.estimatedDeliveryMinutes', 25)
            ->assertJsonPath('order.table.number', 1)
            ->assertJsonPath('order.items.0.name', 'Soup')
            ->assertJsonPath('order.items.0.quantity', 2);

        $this->assertDatabaseHas('orders', [
            'status' => Order::STATUS_PENDING,
            'total' => 15,
        ]);
    }

    public function test_customer_cannot_order_unavailable_items(): void
    {
        [$table, $item] = $this->createTableAndMenuItem(available: false);

        $this->postJson("/api/tables/{$table->code}/orders", [
            'items' => [
                ['menuItemId' => $item->id, 'quantity' => 1],
            ],
        ])->assertUnprocessable();
    }

    public function test_waiter_accepts_cooks_and_delivers_order(): void
    {
        [$table, $item] = $this->createTableAndMenuItem();
        $orderId = $this->postJson("/api/tables/{$table->code}/orders", [
            'items' => [
                ['menuItemId' => $item->id, 'quantity' => 1],
            ],
        ])->json('order.id');

        $waiter = User::factory()->create(['role' => 'waiter']);
        Sanctum::actingAs($waiter);

        $this->patchJson("/api/staff/orders/{$orderId}/status", [
            'status' => Order::STATUS_ACCEPTED,
        ])
            ->assertOk()
            ->assertJsonPath('order.status', Order::STATUS_ACCEPTED)
            ->assertJsonPath('order.waiter.email', $waiter->email);

        $this->patchJson("/api/staff/orders/{$orderId}/status", [
            'status' => Order::STATUS_COOKED,
        ])
            ->assertOk()
            ->assertJsonPath('order.status', Order::STATUS_COOKED);

        $this->patchJson("/api/staff/orders/{$orderId}/status", [
            'status' => Order::STATUS_DELIVERED,
        ])
            ->assertOk()
            ->assertJsonPath('order.status', Order::STATUS_DELIVERED)
            ->assertJsonPath('order.waiter.email', $waiter->email);

        $waiterProfile = Waiter::query()->where('email', $waiter->email)->first();

        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'accepted_by_waiter_id' => $waiterProfile->id,
            'status' => Order::STATUS_DELIVERED,
        ]);
    }

    public function test_delivered_order_cannot_be_delivered_again(): void
    {
        [$table, $item] = $this->createTableAndMenuItem();
        $orderId = $this->postJson("/api/tables/{$table->code}/orders", [
            'items' => [
                ['menuItemId' => $item->id, 'quantity' => 1],
            ],
        ])->json('order.id');

        Sanctum::actingAs(User::factory()->create(['role' => 'waiter']));

        $this->patchJson("/api/staff/orders/{$orderId}/status", [
            'status' => Order::STATUS_ACCEPTED,
        ])->assertOk();

        $this->patchJson("/api/staff/orders/{$orderId}/status", [
            'status' => Order::STATUS_COOKED,
        ])->assertOk();

        $this->patchJson("/api/staff/orders/{$orderId}/status", [
            'status' => Order::STATUS_DELIVERED,
        ])->assertOk();

        $this->patchJson("/api/staff/orders/{$orderId}/status", [
            'status' => Order::STATUS_DELIVERED,
        ])->assertUnprocessable();
    }

    private function createTableAndMenuItem(bool $available = true): array
    {
        $table = RestaurantTable::create([
            'manager_id' => Manager::query()->first()->id,
            'code' => 'T1',
            'table_number' => 1,
            'capacity' => 2,
            'status' => 'available',
        ]);

        $menu = Menu::create([
            'manager_id' => Manager::query()->first()->id,
            'name' => 'Lunch',
            'description' => 'Fresh dishes.',
            'start_time' => '12:00',
            'end_time' => '16:00',
            'days' => ['Monday'],
            'status' => 'active',
            'icon' => 'utensils',
            'image_url' => '',
        ]);

        $item = $menu->items()->create([
            'name' => 'Soup',
            'description' => 'Vegetable soup.',
            'category' => 'Starter',
            'price' => 7.5,
            'available' => $available,
            'image' => '',
        ]);

        return [$table, $item];
    }
}
