<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Orders\StoreCustomerOrderRequest;
use App\Models\Order;
use App\Models\RestaurantTable;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;

class CustomerOrderController extends Controller
{
    public function __construct(private readonly OrderService $orders) {}

    public function store(StoreCustomerOrderRequest $request, RestaurantTable $table): JsonResponse
    {
        $order = $this->orders->createFromTable($table, $request->validated());

        return response()->json([
            'order' => OrderPresenter::present($order),
        ], 201);
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json([
            'order' => OrderPresenter::present(
                $order->load(['items.menuItem', 'visit.restaurantTable', 'visit.customer', 'waiter']),
            ),
        ]);
    }
}
