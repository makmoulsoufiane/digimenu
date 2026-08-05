<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\MenuItemController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);

Route::apiResource('menus', MenuController::class)->only(['index', 'show']);

Route::middleware(['auth:sanctum', 'manager'])->group(function (): void {
    Route::get('user', [AuthController::class, 'user']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::apiResource('menus', MenuController::class)->except(['index', 'show']);
    Route::apiResource('menu-items', MenuItemController::class)->except(['index', 'show']);
    Route::patch('menu-items/{menu_item}/availability', [MenuItemController::class, 'toggleAvailability']);
});
