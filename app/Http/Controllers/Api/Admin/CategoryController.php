<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\FileUploadService;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::with('children')->paginate(10);
        
        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách danh mục thành công',
            'data' => CategoryResource::collection($categories)->response()->getData(true)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,category_id',
            'description' => 'nullable|string',
            'category_image' => 'nullable|file|max:2048',
        ]);

        if ($request->hasFile('category_image')) {
            $url = $this->fileUploadService->upload($request->file('category_image'));
            $validated['category_image'] = $url;
        }

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tạo danh mục thành công',
            'data' => new CategoryResource($category)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = Category::with('children')->find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết danh mục thành công',
            'data' => new CategoryResource($category)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục',
            ], 404);
        }

        $validated = $request->validate([
            'category_name' => 'sometimes|required|string|max:255',
            'parent_id' => 'nullable|exists:categories,category_id',
            'description' => 'nullable|string',
            'category_image' => 'nullable|file|image|max:2048',
        ]);

        if ($request->hasFile('category_image')) {
            $url = $this->fileUploadService->upload($request->file('category_image'));
            $validated['category_image'] = $url;
        }

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật danh mục thành công',
            'data' => new CategoryResource($category)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục',
            ], 404);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa danh mục thành công',
        ]);
    }
}
