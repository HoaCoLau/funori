<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'shippingMethod', 'paymentMethod']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('order_date', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('order_date', '<=', $request->to_date);
        }

        // Sort by newest
        $query->orderBy('order_date', 'desc');

        $orders = $query->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách đơn hàng thành công',
            'data' => OrderResource::collection($orders)->response()->getData(true)
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['user', 'shippingMethod', 'paymentMethod', 'orderItems'])->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết đơn hàng thành công',
            'data' => new OrderResource($order)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng',
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:Pending,Processing,Shipped,Delivered,Cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái đơn hàng thành công',
            'data' => new OrderResource($order)
        ]);
    }
}
