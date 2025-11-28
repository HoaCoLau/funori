<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Http\Resources\PostResource;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Post::with(['author', 'category'])
            ->where('status', 'published')
            ->where('published_at', '<=', now());

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('post_category_id', $request->category_id);
        }
        
        // Filter by slug category
        if ($request->has('category_slug')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category_slug);
            });
        }

        $posts = $query->orderBy('published_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách bài viết thành công',
            'data' => PostResource::collection($posts)->response()->getData(true)
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        // Try to find by slug first, then ID
        $post = Post::with(['author', 'category'])
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->where(function($q) use ($slug) {
                $q->where('slug', $slug)
                  ->orWhere('post_id', $slug);
            })
            ->first();

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
     * Get related posts
     */
    public function related(string $id)
    {
        $post = Post::find($id);
        
        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bài viết',
            ], 404);
        }
        
        $relatedPosts = Post::with(['author', 'category'])
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->where('post_category_id', $post->post_category_id)
            ->where('post_id', '!=', $id)
            ->limit(5)
            ->get();
            
        return response()->json([
            'success' => true,
            'message' => 'Lấy bài viết liên quan thành công',
            'data' => PostResource::collection($relatedPosts)
        ]);
    }
}
