<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\WishlistResource;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WishlistController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $wishlist = Wishlist::where('user_id', $user->user_id)
            ->with('product.images')
            ->get();

        return WishlistResource::collection($wishlist);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id',
        ]);

        $user = Auth::user();
        
        // Check if already exists
        $exists = Wishlist::where('user_id', $user->user_id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Product is already in wishlist.'], 409);
        }

        DB::table('wishlists')->insert([
            'user_id' => $user->user_id,
            'product_id' => $request->product_id,
        ]);

        return response()->json(['message' => 'Product added to wishlist.']);
    }

    public function destroy($productId)
    {
        $user = Auth::user();
        
        $deleted = Wishlist::where('user_id', $user->user_id)
            ->where('product_id', $productId)
            ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Product removed from wishlist.']);
        }

        return response()->json(['message' => 'Product not found in wishlist.'], 404);
    }
}
