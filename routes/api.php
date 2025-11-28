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
use App\Http\Controllers\Api\Admin\ReviewController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Client\AuthController;
use App\Http\Controllers\Api\Client\ProductController as ClientProductController;
use App\Http\Controllers\Api\Client\CategoryController as ClientCategoryController;
use App\Http\Controllers\Api\Client\CartController;
use App\Http\Controllers\Api\Client\CheckoutController;
use App\Http\Controllers\Api\Client\OrderController as ClientOrderController;
use App\Http\Controllers\Api\Client\WishlistController;
use App\Http\Controllers\Api\Client\ReviewController as ClientReviewController;
use App\Http\Controllers\Api\Client\PaymentController;


// Admin Routes
Route::prefix('admin')->group(function () {
    // Admin Auth
    Route::post('login', [AdminAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AdminAuthController::class, 'logout']);
        Route::get('profile', [AdminAuthController::class, 'user']);
        Route::get('dashboard', [DashboardController::class, 'index']);

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
        Route::apiResource('reviews', ReviewController::class)->except(['store']);
    });
});

// Client Public Routes
Route::get('/products', [ClientProductController::class, 'index']);
Route::get('/products/{id}', [ClientProductController::class, 'show']);
Route::get('/products/{id}/related', [ClientProductController::class, 'related']);
Route::get('/products/{id}/reviews', [ClientReviewController::class, 'index']); // Public reviews
Route::get('/categories', [ClientCategoryController::class, 'index']);
Route::get('/categories/{id}', [ClientCategoryController::class, 'show']);

// Payment Callback Routes (Public because PayPal redirects here)
Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');
Route::get('/payment/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');

// Client Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'user']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);

    // Cart Routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{itemId}', [CartController::class, 'update']);
    Route::delete('/cart/{itemId}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);

    // Checkout Routes
    Route::get('/checkout/shipping-methods', [CheckoutController::class, 'getShippingMethods']);
    Route::get('/checkout/payment-methods', [CheckoutController::class, 'getPaymentMethods']);
    Route::post('/checkout', [CheckoutController::class, 'checkout']);

    // Order History Routes
    Route::get('/orders', [ClientOrderController::class, 'index']);
    Route::get('/orders/{id}', [ClientOrderController::class, 'show']);
    Route::put('/orders/{id}/cancel', [ClientOrderController::class, 'cancel']);

    // Wishlist Routes
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);

    // Review Routes
    Route::post('/reviews', [ClientReviewController::class, 'store']);

    // Payment Routes
    Route::post('/payment/create', [PaymentController::class, 'createPayment']);
});

