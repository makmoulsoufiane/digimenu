<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MenuController extends Controller
{
    public function index(): JsonResponse
    {
        $menus = Menu::query()
            ->with('items')
            ->orderBy('id')
            ->get()
            ->map(fn (Menu $menu): array => $this->serializeMenu($menu));

        return response()->json([
            'menus' => $menus,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $menu = Menu::create($this->validatedMenuData($request));

        return response()->json($this->serializeMenu($menu->load('items')), 201);
    }

    public function show(Menu $menu): JsonResponse
    {
        return response()->json($this->serializeMenu($menu->load('items')));
    }

    public function update(Request $request, Menu $menu): JsonResponse
    {
        $menu->update($this->validatedMenuData($request, $menu));

        return response()->json($this->serializeMenu($menu->load('items')));
    }

    public function destroy(Menu $menu): JsonResponse
    {
        $menu->delete();

        return response()->json(status: 204);
    }

    private function validatedMenuData(Request $request, ?Menu $menu = null): array
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:80',
                Rule::unique('menus', 'name')->ignore($menu),
            ],
            'description' => ['nullable', 'string', 'max:240'],
            'startTime' => ['nullable', 'date_format:H:i', 'required_with:endTime'],
            'endTime' => ['nullable', 'date_format:H:i', 'required_with:startTime', 'after:startTime'],
            'days' => ['array'],
            'days.*' => ['string', Rule::in([
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ])],
            'status' => ['nullable', Rule::in(['active', 'draft'])],
            'icon' => ['nullable', 'string', 'max:40'],
            'imageUrl' => ['nullable', 'string'],
        ]);

        return [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'start_time' => $validated['startTime'] ?? null,
            'end_time' => $validated['endTime'] ?? null,
            'days' => $validated['days'] ?? [],
            'status' => $validated['status'] ?? $menu?->status ?? 'draft',
            'icon' => $validated['icon'] ?? $menu?->icon ?? 'menus',
            'image_url' => $validated['imageUrl'] ?? null,
        ];
    }

    private function serializeMenu(Menu $menu): array
    {
        return [
            'id' => $menu->id,
            'name' => $menu->name,
            'description' => $menu->description ?? '',
            'startTime' => $menu->start_time ? substr((string) $menu->start_time, 0, 5) : '',
            'endTime' => $menu->end_time ? substr((string) $menu->end_time, 0, 5) : '',
            'days' => $menu->days ?? [],
            'status' => $menu->status,
            'icon' => $menu->icon,
            'imageUrl' => $menu->image_url ?? '',
            'items' => $menu->items->map(fn ($item): array => [
                'id' => $item->id,
                'menuId' => $item->menu_id,
                'name' => $item->name,
                'description' => $item->description,
                'category' => $item->category,
                'price' => (float) $item->price,
                'available' => $item->available,
                'image' => $item->image ?? '',
            ]),
        ];
    }
}
