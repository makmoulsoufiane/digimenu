<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\RestaurantTable;
use Illuminate\Http\JsonResponse;

class PublicTableController extends Controller
{
    public function show(RestaurantTable $table): JsonResponse
    {
        $menus = Menu::query()
            ->with(['items' => fn ($query) => $query->where('available', true)->orderBy('name')])
            ->where('status', 'active')
            ->orderBy('id')
            ->get()
            ->map(fn (Menu $menu): array => [
                'id' => $menu->id,
                'name' => $menu->name,
                'description' => $menu->description ?? '',
                'items' => $menu->items->map(fn ($item): array => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'category' => $item->category,
                    'price' => (float) $item->price,
                    'image' => $item->image ?? '',
                ]),
            ]);

        return response()->json([
            'table' => [
                'id' => $table->id,
                'code' => $table->code,
                'number' => $table->table_number,
                'capacity' => $table->capacity,
                'status' => $table->status,
            ],
            'menus' => $menus,
        ]);
    }
}
