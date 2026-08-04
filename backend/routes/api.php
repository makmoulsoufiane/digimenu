<?php

use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\MenuItemController;
use Illuminate\Support\Facades\Route;

Route::apiResource('menus', MenuController::class);
Route::apiResource('menu-items', MenuItemController::class)->except(['index', 'show']);
Route::patch('menu-items/{menu_item}/availability', [MenuItemController::class, 'toggleAvailability']);
