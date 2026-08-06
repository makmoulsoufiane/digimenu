<?php

namespace Tests\Feature;

use App\Models\Manager;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MenuApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_menus_can_be_listed_with_items(): void
    {
        $menu = Menu::create([
            'manager_id' => Manager::query()->first()->id,
            'name' => 'Lunch',
            'description' => 'Afternoon dishes.',
            'start_time' => '12:00',
            'end_time' => '16:00',
            'days' => ['Monday'],
            'status' => 'active',
            'icon' => 'utensils',
            'image_url' => '',
        ]);

        $menu->items()->create([
            'name' => 'Garden Salad',
            'description' => 'Fresh greens.',
            'category' => 'Salads',
            'price' => 9.5,
            'available' => true,
            'image' => '',
        ]);

        $this->getJson('/api/menus')
            ->assertOk()
            ->assertJsonPath('menus.0.name', 'Lunch')
            ->assertJsonPath('menus.0.startTime', '12:00')
            ->assertJsonPath('menus.0.items.0.name', 'Garden Salad')
            ->assertJsonPath('menus.0.items.0.menuId', $menu->id);
    }

    public function test_menu_management_requires_authentication(): void
    {
        $this->postJson('/api/menus', [
            'name' => 'Brunch',
            'days' => ['Saturday'],
        ])->assertUnauthorized();
    }

    public function test_manager_can_create_menu(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/menus', [
            'name' => 'Brunch',
            'description' => 'Weekend favorites.',
            'startTime' => '10:00',
            'endTime' => '14:00',
            'days' => ['Saturday', 'Sunday'],
            'status' => 'active',
            'icon' => 'sun',
            'imageUrl' => '',
        ])
            ->assertCreated()
            ->assertJsonPath('name', 'Brunch');

        $this->assertDatabaseHas('menus', [
            'name' => 'Brunch',
            'status' => 'active',
        ]);
    }

    public function test_non_manager_cannot_create_menu(): void
    {
        Sanctum::actingAs(User::factory()->create([
            'role' => 'waiter',
        ]));

        $this->postJson('/api/menus', [
            'name' => 'Brunch',
            'days' => ['Saturday'],
        ])->assertForbidden();
    }

    public function test_menu_items_can_toggle_availability(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $menu = Menu::create([
            'manager_id' => Manager::query()->first()->id,
            'name' => 'Dinner',
            'description' => 'Evening dishes.',
            'start_time' => '18:00',
            'end_time' => '23:00',
            'days' => ['Friday'],
            'status' => 'active',
            'icon' => 'moon',
            'image_url' => '',
        ]);

        $item = $menu->items()->create([
            'name' => 'Grilled Salmon',
            'description' => 'Atlantic salmon.',
            'category' => 'Main course',
            'price' => 28,
            'available' => true,
            'image' => '',
        ]);

        $this->patchJson("/api/menu-items/{$item->id}/availability")
            ->assertOk()
            ->assertJsonPath('available', false);

        $this->assertFalse($item->fresh()->available);
    }
}
