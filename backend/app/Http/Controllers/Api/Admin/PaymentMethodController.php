<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use App\Http\Resources\PaymentMethodResource;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $paymentMethods = PaymentMethod::paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách phương thức thanh toán thành công',
            'data' => PaymentMethodResource::collection($paymentMethods)->response()->getData(true)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:payment_methods,code',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        $paymentMethod = PaymentMethod::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tạo phương thức thanh toán thành công',
            'data' => new PaymentMethodResource($paymentMethod)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $paymentMethod = PaymentMethod::find($id);

        if (!$paymentMethod) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phương thức thanh toán',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết phương thức thanh toán thành công',
            'data' => new PaymentMethodResource($paymentMethod)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $paymentMethod = PaymentMethod::find($id);

        if (!$paymentMethod) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phương thức thanh toán',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:50|unique:payment_methods,code,' . $id . ',payment_method_id',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $paymentMethod->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật phương thức thanh toán thành công',
            'data' => new PaymentMethodResource($paymentMethod)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $paymentMethod = PaymentMethod::find($id);

        if (!$paymentMethod) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phương thức thanh toán',
            ], 404);
        }

        $paymentMethod->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa phương thức thanh toán thành công',
        ]);
    }
}
