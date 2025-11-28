<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $items = CartItemResource::collection($this->items);
        $totalPrice = $this->items->sum(function ($item) {
            return $item->quantity * $item->variant->price;
        });

        return [
            'id' => $this->cart_id,
            'items' => $items,
            'total_quantity' => $this->items->sum('quantity'),
            'total_price' => (float) $totalPrice,
        ];
    }
}
