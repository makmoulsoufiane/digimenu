<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\RestaurantTable;
use App\Models\User;
use App\Models\Visit;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function createFromTable(RestaurantTable $table, array $data): Order
    {
        return DB::transaction(function () use ($table, $data): Order {
            $customer = Customer::create([
                'name' => $data['customerName'] ?? null,
            ]);

            $visit = Visit::create([
                'customer_id' => $customer->id,
                'restaurant_table_id' => $table->id,
                'status' => 'open',
            ]);

            $itemsById = $this->availableItemsById($data['items']);
            $orderItems = collect($data['items'])->map(function (array $requestedItem) use ($itemsById): array {
                $menuItem = $itemsById->get((int) $requestedItem['menuItemId']);
                $quantity = (int) $requestedItem['quantity'];
                $unitPrice = (float) $menuItem->price;

                return [
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $quantity * $unitPrice,
                ];
            });

            $order = Order::create([
                'visit_id' => $visit->id,
                'status' => Order::STATUS_PENDING,
                'total' => $orderItems->sum('subtotal'),
            ]);

            $order->items()->createMany($orderItems->all());

            return $order->load(['items.menuItem', 'visit.restaurantTable', 'visit.customer', 'visit.review', 'waiter']);
        });
    }

    public function updateStatus(Order $order, string $status, User $staff): Order
    {
        if (! $staff->isStaff()) {
            throw ValidationException::withMessages([
                'staff' => 'Only staff accounts can update orders.',
            ]);
        }

        $waiterProfile = $staff->waiterProfile();

        match ($status) {
            Order::STATUS_ACCEPTED => $this->accept($order, $waiterProfile?->id),
            Order::STATUS_COOKED => $this->markCooked($order),
            Order::STATUS_DELIVERED => $this->deliver($order),
            default => null,
        };

        return $order->refresh()->load(['items.menuItem', 'visit.restaurantTable', 'visit.customer', 'visit.review', 'waiter']);
    }

    private function availableItemsById(array $items): Collection
    {
        $ids = collect($items)->pluck('menuItemId')->map(fn ($id): int => (int) $id)->unique()->values();
        $menuItems = MenuItem::query()
            ->whereIn('id', $ids)
            ->where('available', true)
            ->get()
            ->keyBy('id');

        if ($menuItems->count() !== $ids->count()) {
            throw ValidationException::withMessages([
                'items' => 'One or more selected menu items are not available.',
            ]);
        }

        return $menuItems;
    }

    private function accept(Order $order, ?int $waiterId): void
    {
        if ($order->status !== Order::STATUS_PENDING) {
            throw ValidationException::withMessages([
                'status' => 'Only new orders can be accepted.',
            ]);
        }

        $order->update([
            'status' => Order::STATUS_ACCEPTED,
            'accepted_by_waiter_id' => $waiterId,
            'accepted_at' => now(),
        ]);
    }

    private function markCooked(Order $order): void
    {
        if ($order->status !== Order::STATUS_ACCEPTED) {
            throw ValidationException::withMessages([
                'status' => 'Only accepted orders can be marked cooked.',
            ]);
        }

        $order->update([
            'status' => Order::STATUS_COOKED,
        ]);
    }

    private function deliver(Order $order): void
    {
        if ($order->status !== Order::STATUS_COOKED) {
            throw ValidationException::withMessages([
                'status' => 'Only cooked orders can be marked delivered.',
            ]);
        }

        $order->update([
            'status' => Order::STATUS_DELIVERED,
            'delivered_at' => now(),
        ]);
    }
}
