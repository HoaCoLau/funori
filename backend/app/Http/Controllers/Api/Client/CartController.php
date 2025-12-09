<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    private function getCart()
    {
        $user = Auth::user();
        // Find or create cart for the user
        return Cart::firstOrCreate(['user_id' => $user->user_id]);
    }

    public function index()
    {
        $cart = $this->getCart();
        // Eager load items and their variant/product relationships
        $cart->load(['items.variant.product.images', 'items.variant.attributeValues.attribute']);

        return new CartResource($cart);
    }

    public function store(Request $request)
    {
        $request->validate([
            'variant_id' => 'required|exists:product_variants,variant_id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart();
        $variant = ProductVariant::findOrFail($request->variant_id);

        // Check stock (simple check)
        if ($variant->stock_quantity < $request->quantity) {
            return response()->json(['message' => 'Not enough stock available.'], 400);
        }

        // Check if item already exists in cart
        $cartItem = $cart->items()->where('variant_id', $request->variant_id)->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $request->quantity;
            if ($variant->stock_quantity < $newQuantity) {
                return response()->json(['message' => 'Not enough stock available for the requested quantity.'], 400);
            }
            $cartItem->quantity = $newQuantity;
            $cartItem->save();
        } else {
            $cart->items()->create([
                'variant_id' => $request->variant_id,
                'quantity' => $request->quantity,
            ]);
        }

        // Reload cart to return updated data
        $cart->load(['items.variant.product.images', 'items.variant.attributeValues.attribute']);
        return new CartResource($cart);
    }

    public function update(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart();
        $cartItem = $cart->items()->where('cart_item_id', $itemId)->firstOrFail();
        $variant = $cartItem->variant;

        if ($variant->stock_quantity < $request->quantity) {
            return response()->json(['message' => 'Not enough stock available.'], 400);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        $cart->load(['items.variant.product.images', 'items.variant.attributeValues.attribute']);
        return new CartResource($cart);
    }

    public function destroy($itemId)
    {
        $cart = $this->getCart();
        $cart->items()->where('cart_item_id', $itemId)->delete();

        $cart->load(['items.variant.product.images', 'items.variant.attributeValues.attribute']);
        return new CartResource($cart);
    }

    public function clear()
    {
        $cart = $this->getCart();
        $cart->items()->delete();

        return response()->json(['message' => 'Cart cleared successfully.']);
    }
}
