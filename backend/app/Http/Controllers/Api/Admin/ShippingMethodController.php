<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingMethod;
use App\Http\Resources\ShippingMethodResource;
use Illuminate\Http\Request;

class ShippingMethodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $shippingMethods = ShippingMethod::paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách phương thức vận chuyển thành công',
            'data' => ShippingMethodResource::collection($shippingMethods)->response()->getData(true)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:shipping_methods,code',
            'base_cost' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        $shippingMethod = ShippingMethod::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tạo phương thức vận chuyển thành công',
            'data' => new ShippingMethodResource($shippingMethod)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $shippingMethod = ShippingMethod::find($id);

        if (!$shippingMethod) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phương thức vận chuyển',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết phương thức vận chuyển thành công',
            'data' => new ShippingMethodResource($shippingMethod)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $shippingMethod = ShippingMethod::find($id);

        if (!$shippingMethod) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phương thức vận chuyển',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:50|unique:shipping_methods,code,' . $id . ',shipping_method_id',
            'base_cost' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $shippingMethod->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật phương thức vận chuyển thành công',
            'data' => new ShippingMethodResource($shippingMethod)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $shippingMethod = ShippingMethod::find($id);

        if (!$shippingMethod) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phương thức vận chuyển',
            ], 404);
        }

        $shippingMethod->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa phương thức vận chuyển thành công',
        ]);
    }
}
