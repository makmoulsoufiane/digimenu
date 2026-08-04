<?php

namespace Tests\Feature;

use App\Models\Menu;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MenuApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_menus_can_be_listed_with_items(): void
    {
        $menu = Menu::create([
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

    public function test_menu_items_can_toggle_availability(): void
    {
        $menu = Menu::create([
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
