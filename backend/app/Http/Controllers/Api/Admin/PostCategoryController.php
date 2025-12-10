<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PostCategory;
use App\Http\Resources\PostCategoryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = PostCategory::with('parent')->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách danh mục bài viết thành công',
            'data' => PostCategoryResource::collection($categories)->response()->getData(true)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:post_categories,post_category_id',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        // Ensure slug is unique
        $count = PostCategory::where('slug', $validated['slug'])->count();
        if ($count > 0) {
            $validated['slug'] .= '-' . ($count + 1);
        }

        $category = PostCategory::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tạo danh mục bài viết thành công',
            'data' => new PostCategoryResource($category)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = PostCategory::with('parent')->find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục bài viết',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết danh mục bài viết thành công',
            'data' => new PostCategoryResource($category)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = PostCategory::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục bài viết',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'parent_id' => 'nullable|exists:post_categories,post_category_id',
        ]);

        if ($request->has('name')) {
            $validated['slug'] = Str::slug($validated['name']);
            // Check unique slug excluding current id
            $count = PostCategory::where('slug', $validated['slug'])
                ->where('post_category_id', '!=', $id)
                ->count();
            if ($count > 0) {
                $validated['slug'] .= '-' . ($count + 1);
            }
        }

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật danh mục bài viết thành công',
            'data' => new PostCategoryResource($category)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = PostCategory::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục bài viết',
            ], 404);
        }

        // Check if has posts
        if ($category->posts()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa danh mục đang chứa bài viết',
            ], 400);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa danh mục bài viết thành công',
        ]);
    }
}
