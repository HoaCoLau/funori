<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
use App\Models\ProductVariant;
use App\Models\ShippingMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function getShippingMethods()
    {
        return ShippingMethod::where('is_active', true)->limit(20)->get();
    }

    public function getPaymentMethods()
    {
        return PaymentMethod::where('is_active', true)->limit(20)->get();
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'shipping_full_name' => 'required|string|max:255',
            'shipping_phone' => 'required|string|max:20',
            'shipping_address_line1' => 'required|string|max:255',
            'shipping_ward' => 'required|string|max:100',
            'shipping_district' => 'required|string|max:100',
            'shipping_city' => 'required|string|max:100',
            'shipping_method_id' => 'required|exists:shipping_methods,shipping_method_id',
            'payment_method_id' => 'required|exists:payment_methods,payment_method_id',
            'customer_note' => 'nullable|string',
        ]);

        $user = Auth::user();
        $cart = Cart::where('user_id', $user->user_id)->with('items.variant.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty.'], 400);
        }

        // Calculate totals
        $subtotal = 0;
        foreach ($cart->items as $item) {
            // Check stock again before checkout
            if ($item->variant->stock_quantity < $item->quantity) {
                return response()->json([
                    'message' => "Product {$item->variant->product->product_name} (SKU: {$item->variant->variant_sku}) does not have enough stock."
                ], 400);
            }
            $subtotal += $item->quantity * $item->variant->price;
        }

        $shippingMethod = ShippingMethod::findOrFail($request->shipping_method_id);
        $shippingFee = $shippingMethod->base_cost;

        // Coupon logic (placeholder)
        $discountAmount = 0;
        $couponId = null;
        $appliedCouponCode = null;

        $totalAmount = $subtotal + $shippingFee - $discountAmount;

        DB::beginTransaction();
        try {
            // Create Order
            $order = Order::create([
                'user_id' => $user->user_id,
                'order_date' => now(),
                'status' => 'pending',
                'shipping_full_name' => $request->shipping_full_name,
                'shipping_phone' => $request->shipping_phone,
                'shipping_address_line1' => $request->shipping_address_line1,
                'shipping_ward' => $request->shipping_ward,
                'shipping_district' => $request->shipping_district,
                'shipping_city' => $request->shipping_city,
                'shipping_method_id' => $request->shipping_method_id,
                'payment_method_id' => $request->payment_method_id,
                'subtotal_amount' => $subtotal,
                'shipping_fee' => $shippingFee,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'applied_coupon_code' => $appliedCouponCode,
                'coupon_id' => $couponId,
                'customer_note' => $request->customer_note,
            ]);

            // Create Order Items and Deduct Stock
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->order_id,
                    'variant_id' => $item->variant_id,
                    'quantity' => $item->quantity,
                    'product_name_at_purchase' => $item->variant->product->product_name,
                    'variant_sku_at_purchase' => $item->variant->variant_sku,
                    'price_at_purchase' => $item->variant->price,
                ]);

                // Deduct stock
                $item->variant->decrement('stock_quantity', $item->quantity);
            }

            // Clear Cart
            $cart->items()->delete();

            DB::commit();

            // TODO: Send email, etc.

            return response()->json([
                'message' => 'Order placed successfully.',
                'order_id' => $order->order_id,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Checkout failed: ' . $e->getMessage()], 500);
        }
    }
}
