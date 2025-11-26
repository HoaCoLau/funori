<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Http\Resources\AttributeResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attributes = Attribute::with('values')->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách thuộc tính thành công',
            'data' => AttributeResource::collection($attributes),
            'pagination' => [
                'total' => $attributes->total(),
                'per_page' => $attributes->perPage(),
                'current_page' => $attributes->currentPage(),
                'last_page' => $attributes->lastPage(),
                'from' => $attributes->firstItem(),
                'to' => $attributes->lastItem(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'attribute_name' => 'required|string|max:100|unique:attributes,attribute_name',
            'values' => 'nullable|array',
            'values.*.value_name' => 'required|string|max:255',
            'values.*.swatch_code' => 'nullable|string|max:50',
        ]);

        try {
            DB::beginTransaction();

            $attribute = Attribute::create([
                'attribute_name' => $validated['attribute_name'],
            ]);

            if (!empty($validated['values'])) {
                $attribute->values()->createMany($validated['values']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tạo thuộc tính thành công',
                'data' => new AttributeResource($attribute->load('values'))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Tạo thuộc tính thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $attribute = Attribute::with('values')->find($id);

        if (!$attribute) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy thuộc tính',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết thuộc tính thành công',
            'data' => new AttributeResource($attribute)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $attribute = Attribute::find($id);

        if (!$attribute) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy thuộc tính',
            ], 404);
        }

        $validated = $request->validate([
            'attribute_name' => 'sometimes|required|string|max:100|unique:attributes,attribute_name,' . $id . ',attribute_id',
            'values' => 'nullable|array',
            'values.*.id' => 'nullable|integer',
            'values.*.value_name' => 'required|string|max:255',
            'values.*.swatch_code' => 'nullable|string|max:50',
        ]);

        try {
            DB::beginTransaction();

            if ($request->has('attribute_name')) {
                $attribute->update(['attribute_name' => $request->attribute_name]);
            }

            if ($request->has('values')) {
                // Strategy: Sync values manually
                // 1. Get IDs of values sent in request
                $sentValueIds = collect($request->values)->pluck('id')->filter()->toArray();
                
                // 2. Delete values not in request
                $attribute->values()->whereNotIn('value_id', $sentValueIds)->delete();

                // 3. Update or Create
                foreach ($request->values as $valueData) {
                    if (isset($valueData['id'])) {
                        $attribute->values()->where('value_id', $valueData['id'])->update([
                            'value_name' => $valueData['value_name'],
                            'swatch_code' => $valueData['swatch_code'] ?? null,
                        ]);
                    } else {
                        $attribute->values()->create([
                            'value_name' => $valueData['value_name'],
                            'swatch_code' => $valueData['swatch_code'] ?? null,
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật thuộc tính thành công',
                'data' => new AttributeResource($attribute->load('values'))
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Cập nhật thuộc tính thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $attribute = Attribute::find($id);

        if (!$attribute) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy thuộc tính',
            ], 404);
        }

        try {
            // Attribute values will be deleted automatically if foreign key has ON DELETE CASCADE
            // If not, we should delete them manually or rely on Model events. 
            // Assuming standard Laravel relation delete:
            $attribute->values()->delete();
            $attribute->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa thuộc tính thành công',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Xóa thuộc tính thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
