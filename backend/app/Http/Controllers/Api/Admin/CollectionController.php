<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Http\Resources\CollectionResource;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Collection::with('style')->withCount('products');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('collection_name', 'like', "%{$search}%");
        }

        $perPage = $request->input('per_page', 20);
        $collections = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách bộ sưu tập thành công',
            'data' => CollectionResource::collection($collections)->response()->getData(true)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'collection_name' => 'required|string|max:255|unique:collections,collection_name',
            'style_id' => 'nullable|exists:styles,style_id',
            'description' => 'nullable|string',
            'lifestyle_image' => 'nullable|file|image|max:2048',
        ]);

        if ($request->hasFile('lifestyle_image')) {
            $url = $this->fileUploadService->upload($request->file('lifestyle_image'));
            $validated['lifestyle_image'] = $url;
        }

        $collection = Collection::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tạo bộ sưu tập thành công',
            'data' => new CollectionResource($collection)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $collection = Collection::with(['style', 'products'])->withCount('products')->find($id);

        if (!$collection) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bộ sưu tập',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết bộ sưu tập thành công',
            'data' => new CollectionResource($collection)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $collection = Collection::find($id);

        if (!$collection) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bộ sưu tập',
            ], 404);
        }

        $validated = $request->validate([
            'collection_name' => 'sometimes|required|string|max:255|unique:collections,collection_name,' . $id . ',collection_id',
            'style_id' => 'nullable|exists:styles,style_id',
            'description' => 'nullable|string',
            'lifestyle_image' => 'nullable|file|image|max:2048',
        ]);

        if ($request->hasFile('lifestyle_image')) {
            $url = $this->fileUploadService->upload($request->file('lifestyle_image'));
            $validated['lifestyle_image'] = $url;
        }

        $collection->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật bộ sưu tập thành công',
            'data' => new CollectionResource($collection)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $collection = Collection::find($id);

        if (!$collection) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bộ sưu tập',
            ], 404);
        }

        // Optional: Detach products before deleting if needed, but standard delete usually fine if no foreign key constraints block it.
        // Assuming pivot table product_collections has cascade or we just delete the collection record.
        // If we want to be safe:
        $collection->products()->detach();
        
        $collection->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa bộ sưu tập thành công',
        ]);
    }
}
