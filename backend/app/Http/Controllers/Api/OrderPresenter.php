<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;

class OrderPresenter
{
    public static function present(Order $order): array
    {
        return [
            'id' => $order->id,
            'status' => $order->status,
            'total' => (float) $order->total,
            'createdAt' => $order->created_at?->toISOString(),
            'acceptedAt' => $order->accepted_at?->toISOString(),
            'deliveredAt' => $order->delivered_at?->toISOString(),
            'estimatedDeliveryMinutes' => 25,
            'estimatedDeliveryAt' => $order->created_at?->copy()->addMinutes(25)->toISOString(),
            'table' => [
                'id' => $order->visit->restaurantTable->id,
                'code' => $order->visit->restaurantTable->code,
                'number' => $order->visit->restaurantTable->table_number,
            ],
            'customer' => [
                'name' => $order->visit->customer?->name ?? 'Guest',
            ],
            'waiter' => $order->waiter ? [
                'id' => $order->waiter->id,
                'name' => $order->waiter->first_name,
                'email' => $order->waiter->email,
            ] : null,
            'items' => $order->items->map(fn ($item): array => [
                'id' => $item->id,
                'menuItemId' => $item->menu_item_id,
                'name' => $item->menuItem->name,
                'quantity' => $item->quantity,
                'unitPrice' => (float) $item->unit_price,
                'subtotal' => (float) $item->subtotal,
            ])->values(),
        ];
    }
}
