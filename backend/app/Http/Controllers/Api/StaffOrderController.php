<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Orders\UpdateOrderStatusRequest;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;

class StaffOrderController extends Controller
{
    public function __construct(private readonly OrderService $orders) {}

    public function index(): JsonResponse
    {
        $orders = Order::query()
            ->with(['items.menuItem', 'visit.restaurantTable', 'visit.customer', 'visit.review', 'waiter'])
            ->whereIn('status', [
                Order::STATUS_PENDING,
                Order::STATUS_ACCEPTED,
                Order::STATUS_COOKED,
            ])
            ->latest()
            ->get()
            ->map(fn (Order $order): array => OrderPresenter::present($order));

        return response()->json([
            'orders' => $orders,
        ]);
    }

    public function update(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $order = $this->orders->updateStatus(
            $order,
            $request->validated('status'),
            $request->user(),
        );

        return response()->json([
            'order' => OrderPresenter::present($order),
        ]);
    }
}
