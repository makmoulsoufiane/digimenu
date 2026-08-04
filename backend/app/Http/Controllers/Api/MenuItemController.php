<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MenuItemController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $item = MenuItem::create($this->validatedItemData($request));

        return response()->json($this->serializeItem($item), 201);
    }

    public function update(Request $request, MenuItem $menuItem): JsonResponse
    {
        $menuItem->update($this->validatedItemData($request, $menuItem));

        return response()->json($this->serializeItem($menuItem->refresh()));
    }

    public function destroy(MenuItem $menuItem): JsonResponse
    {
        $menuItem->delete();

        return response()->json(status: 204);
    }

    public function toggleAvailability(MenuItem $menuItem): JsonResponse
    {
        $menuItem->update([
            'available' => ! $menuItem->available,
        ]);

        return response()->json($this->serializeItem($menuItem->refresh()));
    }

    private function validatedItemData(Request $request, ?MenuItem $item = null): array
    {
        $menuId = (int) $request->input('menuId', $item?->menu_id);

        $validated = $request->validate([
            'menuId' => ['required', 'integer', Rule::exists('menus', 'id')],
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('menu_items', 'name')
                    ->where('menu_id', $menuId)
                    ->ignore($item),
            ],
            'description' => ['required', 'string', 'max:280'],
            'category' => ['required', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0.01'],
            'available' => ['boolean'],
            'image' => ['nullable', 'string'],
        ]);

        return [
            'menu_id' => $validated['menuId'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'price' => $validated['price'],
            'available' => $validated['available'] ?? true,
            'image' => $validated['image'] ?? null,
        ];
    }

    private function serializeItem(MenuItem $item): array
    {
        return [
            'id' => $item->id,
            'menuId' => $item->menu_id,
            'name' => $item->name,
            'description' => $item->description,
            'category' => $item->category,
            'price' => (float) $item->price,
            'available' => $item->available,
            'image' => $item->image ?? '',
        ];
    }
}
