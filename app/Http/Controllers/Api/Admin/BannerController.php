<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Http\Resources\BannerResource;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class BannerController extends Controller
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
        $banners = Banner::orderBy('sort_order', 'asc')->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách banner thành công',
            'data' => BannerResource::collection($banners)->response()->getData(true)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|file|image|max:5120', // 5MB
            'position' => 'required|string|max:50',
            'target_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $request->only(['title', 'subtitle', 'position', 'target_url', 'sort_order', 'is_active']);
        
        // Set defaults if not provided
        if (!isset($data['sort_order'])) $data['sort_order'] = 0;
        if (!isset($data['is_active'])) $data['is_active'] = true;

        if ($request->hasFile('image')) {
            $data['image_url'] = $this->fileUploadService->upload($request->file('image'));
        }

        $banner = Banner::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Tạo banner thành công',
            'data' => new BannerResource($banner)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy banner',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết banner thành công',
            'data' => new BannerResource($banner)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy banner',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'nullable|file|image|max:5120',
            'position' => 'sometimes|required|string|max:50',
            'target_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $request->only(['title', 'subtitle', 'position', 'target_url', 'sort_order', 'is_active']);

        if ($request->hasFile('image')) {
            $data['image_url'] = $this->fileUploadService->upload($request->file('image'));
        }

        $banner->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật banner thành công',
            'data' => new BannerResource($banner)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy banner',
            ], 404);
        }

        $banner->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa banner thành công',
        ]);
    }
}
