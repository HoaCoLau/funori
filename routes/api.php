<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\AttributeController;
use App\Http\Controllers\Api\Admin\CollectionController;
use App\Http\Controllers\Api\Admin\BannerController;
use App\Http\Controllers\Api\Admin\CouponController;
use App\Http\Controllers\Api\Admin\PostCategoryController;
use App\Http\Controllers\Api\Admin\PostController;
use App\Http\Controllers\Api\Admin\ShippingMethodController;
use App\Http\Controllers\Api\Admin\PaymentMethodController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\OrderController;



Route::prefix('admin')->group(function () {
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('attributes', AttributeController::class);
    Route::apiResource('collections', CollectionController::class);
    Route::apiResource('banners', BannerController::class);
    Route::apiResource('coupons', CouponController::class);
    Route::apiResource('post-categories', PostCategoryController::class);
    Route::apiResource('posts', PostController::class);
    Route::apiResource('shipping-methods', ShippingMethodController::class);
    Route::apiResource('payment-methods', PaymentMethodController::class);
    Route::apiResource('users', UserController::class)->except(['store']);
    Route::apiResource('orders', OrderController::class)->except(['store', 'destroy']);
});

