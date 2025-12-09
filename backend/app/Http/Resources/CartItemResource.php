<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->cart_item_id,
            'variant_id' => $this->variant_id,
            'product_id' => $this->variant->product_id,
            'product_name' => $this->variant->product->product_name,
            'variant_sku' => $this->variant->variant_sku,
            'image' => $this->variant->main_image_url ?? $this->variant->product->images->first()?->image_url,
            'price' => (float) $this->variant->price,
            'quantity' => (int) $this->quantity,
            'subtotal' => (float) $this->variant->price * $this->quantity,
            'attributes' => $this->variant->attributeValues->map(function ($av) {
                return [
                    'attribute' => $av->attribute->attribute_name,
                    'value' => $av->value_name,
                ];
            }),
        ];
    }
}
