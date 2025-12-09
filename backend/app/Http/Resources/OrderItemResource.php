<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->order_item_id,
            'product_name' => $this->product_name_at_purchase,
            'sku' => $this->variant_sku_at_purchase,
            'quantity' => $this->quantity,
            'price' => (float) $this->price_at_purchase,
            'total' => (float) ($this->price_at_purchase * $this->quantity),
            'variant_id' => $this->variant_id,
        ];
    }
}
