<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerOrderController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\PublicTableController;
use App\Http\Controllers\Api\StaffOrderController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);

Route::apiResource('menus', MenuController::class)->only(['index', 'show']);
Route::get('tables/{table:code}/menu', [PublicTableController::class, 'show']);
Route::post('tables/{table:code}/orders', [CustomerOrderController::class, 'store']);
Route::get('orders/{order}', [CustomerOrderController::class, 'show']);

Route::middleware(['auth:sanctum'])->group(function (): void {
    Route::get('user', [AuthController::class, 'user']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::middleware('manager')->group(function (): void {
        Route::apiResource('menus', MenuController::class)->except(['index', 'show']);
        Route::apiResource('menu-items', MenuItemController::class)->except(['index', 'show']);
        Route::patch('menu-items/{menu_item}/availability', [MenuItemController::class, 'toggleAvailability']);
    });

    Route::middleware('staff')->group(function (): void {
        Route::get('staff/orders', [StaffOrderController::class, 'index']);
        Route::patch('staff/orders/{order}/status', [StaffOrderController::class, 'update']);
    });
});
