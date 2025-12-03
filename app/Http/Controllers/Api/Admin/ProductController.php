<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
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
        $products = Product::with([
            'categories', 
            'images', 
            'variants.attributeValues.attribute', 
            'specifications', 
            'collections'
        ])->paginate(10);
        
        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách sản phẩm thành công',
            'data' => ProductResource::collection($products)->response()->getData(true)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'base_sku' => 'required|string|max:100|unique:products,base_sku',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'is_customizable' => 'boolean',
            // Relations
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,category_id',
            'collections' => 'nullable|array',
            'collections.*' => 'exists:collections,collection_id',
            'images' => 'nullable|array',
            'images.*.image_url' => 'required', // File or String
            'images.*.alt_text' => 'nullable|string',
            'images.*.sort_order' => 'nullable|integer',
            'images.*.variant_id' => 'nullable|exists:product_variants,variant_id',
            'variants' => 'nullable|array',
            'variants.*.variant_sku' => 'required|string|distinct|unique:product_variants,variant_sku',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.stock_quantity' => 'integer|min:0',
            'variants.*.main_image_url' => 'nullable', // File or String
            'specifications' => 'nullable|array',
            'specifications.*.spec_name' => 'required|string',
            'specifications.*.spec_value' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // 1. Create Product
            $product = Product::create([
                'product_name' => $validated['product_name'],
                'base_sku' => $validated['base_sku'],
                'description' => $validated['description'] ?? null,
                'base_price' => $validated['base_price'],
                'is_customizable' => $validated['is_customizable'] ?? false,
            ]);

            // 2. Sync Categories
            if (!empty($validated['categories'])) {
                $product->categories()->sync($validated['categories']);
            }

            // 3. Sync Collections
            if (!empty($validated['collections'])) {
                $product->collections()->sync($validated['collections']);
            }

            // 4. Create Images
            if ($request->has('images')) {
                foreach ($request->images as $imgData){
                    if (isset($imgData['image_url']) && $imgData['image_url'] instanceof UploadedFile ) {
                        $file = $imgData['image_url'];
                        $localPath = $file->store('temp_images', 'public');
                        $imgData['temporary_url']=$localPath;
                        $imgData['image_url']=null;
                        $imgData['status']='temporary';
                    }
                    $product->images()->create($imgData);
                }
            }

            // 5. Create Variants
            if ($request->has('variants')) {
                $variants = $request->variants;
                foreach ($variants as $key => $variantData) {
                    if ($request->hasFile("variants.{$key}.main_image_url")) {
                        $url = $this->fileUploadService->upload($request->file("variants.{$key}.main_image_url"));
                        $variants[$key]['main_image_url'] = $url;
                    }
                }
                $product->variants()->createMany($variants);
            }

            // 6. Create Specifications
            if (!empty($validated['specifications'])) {
                $product->specifications()->createMany($validated['specifications']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tạo sản phẩm thành công',
                'data' => new ProductResource($product->load(['categories', 'images', 'variants', 'specifications', 'collections']))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Tạo sản phẩm thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with([
            'categories', 
            'images', 
            'variants.attributeValues.attribute', 
            'specifications', 
            'collections'
        ])->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết sản phẩm thành công',
            'data' => new ProductResource($product)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm',
            ], 404);
        }

        $validated = $request->validate([
            'product_name' => 'sometimes|required|string|max:255',
            'base_sku' => 'sometimes|required|string|max:100|unique:products,base_sku,' . $id . ',product_id',
            'description' => 'nullable|string',
            'base_price' => 'sometimes|required|numeric|min:0',
            'is_customizable' => 'boolean',
            // Relations
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,category_id',
            'collections' => 'nullable|array',
            'collections.*' => 'exists:collections,collection_id',
            'images' => 'nullable|array',
            'images.*.image_url' => 'required', // File or String
            'images.*.alt_text' => 'nullable|string',
            'images.*.sort_order' => 'nullable|integer',
            'images.*.variant_id' => 'nullable|exists:product_variants,variant_id',
            'variants' => 'nullable|array',
            'variants.*.variant_id' => 'nullable|integer', // ID for update
            'variants.*.variant_sku' => 'required_with:variants|string|distinct', // Unique check needs custom logic or ignore
            'variants.*.price' => 'required_with:variants|numeric|min:0',
            'variants.*.stock_quantity' => 'integer|min:0',
            'variants.*.main_image_url' => 'nullable', // File or String
            'specifications' => 'nullable|array',
            'specifications.*.spec_name' => 'required|string',
            'specifications.*.spec_value' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // 1. Update Product Basic Info
            $product->update($request->only([
                'product_name', 'base_sku', 'description', 'base_price', 'is_customizable'
            ]));

            // 2. Sync Categories
            if ($request->has('categories')) {
                $product->categories()->sync($request->categories);
            }

            // 3. Sync Collections
            if ($request->has('collections')) {
                $product->collections()->sync($request->collections);
            }

            // 4. Update Images (Delete all and recreate strategy for simplicity)
            if ($request->has('images')) {
                $product->images()->delete();
                $images = $request->images;
                foreach ($images as $key => $imageData) {
                    if ($request->hasFile("images.{$key}.image_url")) {
                        $url = $this->fileUploadService->upload($request->file("images.{$key}.image_url"));
                        $images[$key]['image_url'] = $url;
                    }
                }
                $product->images()->createMany($images);
            }

            // 5. Update Variants (Smart Update: Create, Update, Delete missing)
            if ($request->has('variants')) {
                $existingVariantIds = $product->variants()->pluck('variant_id')->toArray();
                $processedVariantIds = [];
                $variants = $request->variants;

                foreach ($variants as $key => $variantData) {
                    // Handle file upload for variant image
                    if ($request->hasFile("variants.{$key}.main_image_url")) {
                        $url = $this->fileUploadService->upload($request->file("variants.{$key}.main_image_url"));
                        $variantData['main_image_url'] = $url;
                    }

                    if (isset($variantData['variant_id'])) {
                        // Case 1: Update existing variant
                        if (in_array($variantData['variant_id'], $existingVariantIds)) {
                            $product->variants()->where('variant_id', $variantData['variant_id'])->update([
                                'variant_sku' => $variantData['variant_sku'],
                                'price' => $variantData['price'],
                                'stock_quantity' => $variantData['stock_quantity'] ?? 0,
                                'main_image_url' => $variantData['main_image_url'] ?? null,
                            ]);
                            $processedVariantIds[] = $variantData['variant_id'];
                        } else {
                            // Case 2: Variant ID provided but not found in this product -> Throw error to warn user
                            throw new \Exception("Variant ID {$variantData['variant_id']} không thuộc về sản phẩm này. Vui lòng kiểm tra lại.");
                        }
                    } else {
                        // Case 3: No ID provided -> Create new variant
                        $newVariant = $product->variants()->create([
                            'variant_sku' => $variantData['variant_sku'],
                            'price' => $variantData['price'],
                            'stock_quantity' => $variantData['stock_quantity'] ?? 0,
                            'main_image_url' => $variantData['main_image_url'] ?? null,
                        ]);
                        $processedVariantIds[] = $newVariant->variant_id;
                    }
                }

                // Delete variants not present in the request
                $product->variants()->whereNotIn('variant_id', $processedVariantIds)->delete();
            }

            // 6. Update Specifications (Delete all and recreate)
            if ($request->has('specifications')) {
                $product->specifications()->delete();
                $product->specifications()->createMany($request->specifications);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật sản phẩm thành công',
                'data' => new ProductResource($product->load(['categories', 'images', 'variants', 'specifications', 'collections']))
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Cập nhật sản phẩm thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $image = ProductImage::findOrFail($id);

        $image->update([
        'status' => 'delete'
        ]);

        return response()->json(['message' => 'Ảnh đã được đánh dấu xóa']);

    }
}
