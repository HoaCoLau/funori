<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        // Get only top-level categories with their children
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->paginate(20);

        return CategoryResource::collection($categories);
    }

    public function show($id)
    {
        $category = Category::with('children')->findOrFail($id);
        return new CategoryResource($category);
    }
}
