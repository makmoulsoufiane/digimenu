<?php

namespace Database\Seeders;

use App\Models\Manager;
use App\Models\Menu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call(ManagerSeeder::class);

        $weekDays = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ];

        $menus = [
            [
                'name' => 'Breakfast',
                'description' => 'Morning favorites and freshly prepared breakfast plates.',
                'start_time' => '07:00',
                'end_time' => '11:00',
                'days' => array_slice($weekDays, 0, 5),
                'status' => 'active',
                'icon' => 'sun',
                'image_url' => '',
                'items' => [
                    [
                        'name' => 'Avocado Toast',
                        'description' => 'Sourdough, avocado, poached egg, and chili flakes.',
                        'category' => 'Breakfast',
                        'price' => 12,
                        'available' => true,
                        'image' => 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=160&q=80',
                    ],
                ],
            ],
            [
                'name' => 'Lunch',
                'description' => 'Seasonal lunch dishes served throughout the afternoon.',
                'start_time' => '12:00',
                'end_time' => '16:00',
                'days' => array_slice($weekDays, 0, 5),
                'status' => 'active',
                'icon' => 'utensils',
                'image_url' => '',
                'items' => [
                    [
                        'name' => 'Truffle Tagliatelle',
                        'description' => 'Fresh pasta with seasonal black truffles and parmesan.',
                        'category' => 'Main course',
                        'price' => 24,
                        'available' => true,
                        'image' => 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=160&q=80',
                    ],
                    [
                        'name' => 'Mediterranean Bowl',
                        'description' => 'Quinoa, chickpeas, feta, and lemon-tahini dressing.',
                        'category' => 'Salads',
                        'price' => 16.5,
                        'available' => true,
                        'image' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=160&q=80',
                    ],
                    [
                        'name' => 'Smash Burger',
                        'description' => 'Dry-aged beef, cheddar, pickles, and our house sauce.',
                        'category' => 'Main course',
                        'price' => 19,
                        'available' => false,
                        'image' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=160&q=80',
                    ],
                    [
                        'name' => 'Citrus Cheesecake',
                        'description' => 'Creamy cheesecake with orange and lemon zest.',
                        'category' => 'Desserts',
                        'price' => 9.5,
                        'available' => true,
                        'image' => 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=160&q=80',
                    ],
                ],
            ],
            [
                'name' => 'Dinner',
                'description' => 'Evening plates, chef specials, and shared dishes.',
                'start_time' => '18:00',
                'end_time' => '23:00',
                'days' => array_slice($weekDays, 0, 6),
                'status' => 'active',
                'icon' => 'moon',
                'image_url' => '',
                'items' => [
                    [
                        'name' => 'Grilled Salmon',
                        'description' => 'Atlantic salmon, asparagus, and herb butter.',
                        'category' => 'Main course',
                        'price' => 28,
                        'available' => true,
                        'image' => 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=160&q=80',
                    ],
                ],
            ],
            [
                'name' => 'Drinks',
                'description' => 'Hot, cold, and house-made drinks available all day.',
                'start_time' => null,
                'end_time' => null,
                'days' => $weekDays,
                'status' => 'draft',
                'icon' => 'glass',
                'image_url' => '',
                'items' => [
                    [
                        'name' => 'Garden Spritz',
                        'description' => 'Elderflower, cucumber, lime, and sparkling water.',
                        'category' => 'Cold drinks',
                        'price' => 7,
                        'available' => true,
                        'image' => 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=160&q=80',
                    ],
                ],
            ],
        ];

        foreach ($menus as $menuData) {
            $items = $menuData['items'];
            unset($menuData['items']);

            $menuData['manager_id'] = Manager::query()->first()->id;

            $menu = Menu::create($menuData);
            $menu->items()->createMany($items);
        }

        $this->call(RestaurantTableSeeder::class);
    }
}
