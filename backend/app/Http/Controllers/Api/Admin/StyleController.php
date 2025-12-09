<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Style;
use App\Http\Resources\StyleResource;
use Illuminate\Http\Request;

class StyleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Style::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('style_name', 'like', "%{$search}%")
                  ->orWhere('style_description', 'like', "%{$search}%");
        }

        $styles = $query->paginate(20);
        
        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách phong cách thành công',
            'data' => StyleResource::collection($styles)->response()->getData(true)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'style_name' => 'required|string|max:255',
            'style_description' => 'nullable|string',
        ]);

        $style = Style::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tạo phong cách thành công',
            'data' => new StyleResource($style)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $style = Style::find($id);

        if (!$style) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phong cách',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết phong cách thành công',
            'data' => new StyleResource($style)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $style = Style::find($id);

        if (!$style) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phong cách',
            ], 404);
        }

        $validated = $request->validate([
            'style_name' => 'sometimes|required|string|max:255',
            'style_description' => 'nullable|string',
        ]);

        $style->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật phong cách thành công',
            'data' => new StyleResource($style)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $style = Style::find($id);

        if (!$style) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phong cách',
            ], 404);
        }

        $style->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa phong cách thành công',
        ]);
    }
}
