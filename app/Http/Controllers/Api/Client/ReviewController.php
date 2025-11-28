<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index($productId)
    {
        $reviews = Review::where('product_id', $productId)
            ->where('status', 'Approved')
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return ReviewResource::collection($reviews);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string',
        ]);

        $user = Auth::user();

        // Check if user has purchased and received the product
        $hasPurchased = Order::where('user_id', $user->user_id)
            ->where('status', 'delivered') // Assuming 'delivered' is the status for completed orders
            ->whereHas('orderItems.variant', function ($q) use ($request) {
                $q->where('product_id', $request->product_id);
            })
            ->exists();

        // For testing purposes, I might comment this out or make it optional if the user hasn't set up the 'delivered' flow yet.
        // But strictly speaking, it should be there.
        // Given the current state, I'll enforce it but maybe the user can't test it easily without changing order status in DB.
        // I'll add a comment about it.
        
        if (!$hasPurchased) {
            return response()->json(['message' => 'You can only review products you have purchased and received.'], 403);
        }
        // Uncomment the above block to enforce purchase requirement.

        // Check if already reviewed
        $exists = Review::where('user_id', $user->user_id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'You have already reviewed this product.'], 409);
        }

        $review = Review::create([
            'user_id' => $user->user_id,
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
            'status' => 'Pending', // Default to pending
        ]);

        return response()->json(['message' => 'Review submitted successfully and is pending approval.', 'review' => new ReviewResource($review)], 201);
    }
}
