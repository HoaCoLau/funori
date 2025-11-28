<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $orders = Order::where('user_id', $user->user_id)
            ->with(['orderItems', 'shippingMethod', 'paymentMethod']) // Basic eager load
            ->orderBy('order_date', 'desc')
            ->paginate(10);

        return OrderResource::collection($orders);
    }

    public function show($id)
    {
        $user = Auth::user();
        $order = Order::where('user_id', $user->user_id)
            ->where('order_id', $id)
            ->with(['orderItems.variant.product', 'shippingMethod', 'paymentMethod']) // Deep eager load for details
            ->firstOrFail();

        return new OrderResource($order);
    }

    public function cancel($id)
    {
        $user = Auth::user();
        $order = Order::where('user_id', $user->user_id)
            ->where('order_id', $id)
            ->with('orderItems.variant')
            ->firstOrFail();

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Only pending orders can be cancelled.'], 400);
        }

        $order->status = 'cancelled';
        $order->save();

        // Restore stock
        foreach ($order->orderItems as $item) {
            if ($item->variant) {
                $item->variant->increment('stock_quantity', $item->quantity);
            }
        }

        return response()->json(['message' => 'Order cancelled successfully.', 'order' => new OrderResource($order)]);
    }
}
