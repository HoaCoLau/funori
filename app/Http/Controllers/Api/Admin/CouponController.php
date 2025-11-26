<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Http\Resources\CouponResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $coupons = Coupon::orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách mã giảm giá thành công',
            'data' => CouponResource::collection($coupons)->response()->getData(true)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:100|unique:coupons,code',
            'description' => 'required|string',
            'discount_type' => 'required|in:percentage,fixed_amount',
            'discount_value' => 'required|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'min_purchase_amount' => 'nullable|numeric|min:0',
            'scope_type' => 'required|in:site_wide,by_collection,by_category,by_product',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'usage_limit_total' => 'nullable|integer|min:1',
            'usage_limit_per_user' => 'nullable|integer|min:1',
            'is_active' => 'nullable|boolean',
            
            // Relations
            'product_ids' => 'required_if:scope_type,by_product|array',
            'product_ids.*' => 'exists:products,product_id',
            'category_ids' => 'required_if:scope_type,by_category|array',
            'category_ids.*' => 'exists:categories,category_id',
            'collection_ids' => 'required_if:scope_type,by_collection|array',
            'collection_ids.*' => 'exists:collections,collection_id',
        ]);

        try {
            DB::beginTransaction();

            $coupon = Coupon::create($validated);

            // Sync relationships based on scope_type
            if ($validated['scope_type'] === 'by_product' && isset($validated['product_ids'])) {
                $coupon->products()->sync($validated['product_ids']);
            } elseif ($validated['scope_type'] === 'by_category' && isset($validated['category_ids'])) {
                $coupon->categories()->sync($validated['category_ids']);
            } elseif ($validated['scope_type'] === 'by_collection' && isset($validated['collection_ids'])) {
                $coupon->collections()->sync($validated['collection_ids']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tạo mã giảm giá thành công',
                'data' => new CouponResource($coupon->load(['products', 'categories', 'collections']))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo mã giảm giá: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $coupon = Coupon::with(['products', 'categories', 'collections'])->find($id);

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy mã giảm giá',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết mã giảm giá thành công',
            'data' => new CouponResource($coupon)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $coupon = Coupon::find($id);

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy mã giảm giá',
            ], 404);
        }

        $validated = $request->validate([
            'code' => 'sometimes|required|string|max:100|unique:coupons,code,' . $id . ',coupon_id',
            'description' => 'sometimes|required|string',
            'discount_type' => 'sometimes|required|in:percentage,fixed_amount',
            'discount_value' => 'sometimes|required|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'min_purchase_amount' => 'nullable|numeric|min:0',
            'scope_type' => 'sometimes|required|in:site_wide,by_collection,by_category,by_product',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after:start_date',
            'usage_limit_total' => 'nullable|integer|min:1',
            'usage_limit_per_user' => 'nullable|integer|min:1',
            'is_active' => 'nullable|boolean',

            // Relations
            'product_ids' => 'required_if:scope_type,by_product|array',
            'product_ids.*' => 'exists:products,product_id',
            'category_ids' => 'required_if:scope_type,by_category|array',
            'category_ids.*' => 'exists:categories,category_id',
            'collection_ids' => 'required_if:scope_type,by_collection|array',
            'collection_ids.*' => 'exists:collections,collection_id',
        ]);

        try {
            DB::beginTransaction();

            $coupon->update($validated);

            // Handle scope changes and sync
            $scopeType = $request->input('scope_type', $coupon->scope_type);

            // Clear old relations if scope changed (optional but cleaner)
            if ($request->has('scope_type') && $request->scope_type !== $coupon->getOriginal('scope_type')) {
                $coupon->products()->detach();
                $coupon->categories()->detach();
                $coupon->collections()->detach();
            }

            if ($scopeType === 'by_product' && $request->has('product_ids')) {
                $coupon->products()->sync($request->product_ids);
            } elseif ($scopeType === 'by_category' && $request->has('category_ids')) {
                $coupon->categories()->sync($request->category_ids);
            } elseif ($scopeType === 'by_collection' && $request->has('collection_ids')) {
                $coupon->collections()->sync($request->collection_ids);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật mã giảm giá thành công',
                'data' => new CouponResource($coupon->load(['products', 'categories', 'collections']))
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật mã giảm giá: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $coupon = Coupon::find($id);

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy mã giảm giá',
            ], 404);
        }

        // Detach all relations
        $coupon->products()->detach();
        $coupon->categories()->detach();
        $coupon->collections()->detach();

        $coupon->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa mã giảm giá thành công',
        ]);
    }
}
