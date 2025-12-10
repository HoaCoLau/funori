<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Http\Resources\PostResource;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
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
        $posts = Post::with(['author', 'category'])->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách bài viết thành công',
            'data' => PostResource::collection($posts)->response()->getData(true)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'post_category_id' => 'nullable|exists:post_categories,post_category_id',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|file|image|max:5120',
            'status' => 'required|in:draft,published,archived',
            'published_at' => 'nullable|date',
        ]);

        $data = $request->only(['title', 'post_category_id', 'excerpt', 'content', 'status', 'published_at']);
        
        // Generate slug
        $data['slug'] = Str::slug($data['title']);
        $count = Post::where('slug', $data['slug'])->count();
        if ($count > 0) {
            $data['slug'] .= '-' . ($count + 1);
        }

        // Upload image
        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $this->fileUploadService->upload($request->file('featured_image'));
        }

        // Set author (assuming auth is working, otherwise null)
        // $data['user_id'] = auth()->id(); 
        // For now, let's leave user_id null or implement if auth is ready. 
        // The user didn't specify auth details, so I'll skip explicit user_id assignment unless they ask.

        $post = Post::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Tạo bài viết thành công',
            'data' => new PostResource($post->load(['author', 'category']))
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = Post::with(['author', 'category'])->find($id);

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bài viết',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết bài viết thành công',
            'data' => new PostResource($post)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bài viết',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'post_category_id' => 'nullable|exists:post_categories,post_category_id',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|file|image|max:5120',
            'status' => 'sometimes|required|in:draft,published,archived',
            'published_at' => 'nullable|date',
        ]);

        $data = $request->only(['title', 'post_category_id', 'excerpt', 'content', 'status', 'published_at']);

        if ($request->has('title')) {
            $data['slug'] = Str::slug($data['title']);
            $count = Post::where('slug', $data['slug'])
                ->where('post_id', '!=', $id)
                ->count();
            if ($count > 0) {
                $data['slug'] .= '-' . ($count + 1);
            }
        }

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $this->fileUploadService->upload($request->file('featured_image'));
        }

        $post->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật bài viết thành công',
            'data' => new PostResource($post->load(['author', 'category']))
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bài viết',
            ], 404);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa bài viết thành công',
        ]);
    }
}
