<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // Eager load relationships for listing
        $query->with(['images', 'categories']);

        // Filter by Category
        if ($request->has('category_id')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.category_id', $request->category_id);
            });
        }

        // Filter by Collection
        if ($request->has('collection_id')) {
            $query->whereHas('collections', function ($q) use ($request) {
                $q->where('collections.collection_id', $request->collection_id);
            });
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Price Range
        if ($request->has('price_min')) {
            $query->where('base_price', '>=', $request->price_min);
        }
        if ($request->has('price_max')) {
            $query->where('base_price', '<=', $request->price_max);
        }

        // Sorting
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('base_price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('base_price', 'desc');
                    break;
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate(12);

        return ProductResource::collection($products);
    }

    public function show($id)
    {
        $product = Product::with([
            'images',
            'categories',
            'variants.attributeValues.attribute', // Nested eager loading for the resource logic
            'specifications',
            'collections'
        ])->findOrFail($id);

        return new ProductResource($product);
    }

    public function related($id)
    {
        $product = Product::findOrFail($id);
        
        // Simple related logic: same categories
        $categoryIds = $product->categories->pluck('category_id');

        $relatedProducts = Product::whereHas('categories', function ($q) use ($categoryIds) {
            $q->whereIn('categories.category_id', $categoryIds);
        })
        ->where('product_id', '!=', $id)
        ->with(['images', 'categories'])
        ->take(4)
        ->get();

        return ProductResource::collection($relatedProducts);
    }
}
