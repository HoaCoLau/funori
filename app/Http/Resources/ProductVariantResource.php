<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->variant_id,
            'sku' => $this->variant_sku,
            'price' => (float) $this->price,
            'stock_quantity' => $this->stock_quantity,
            'main_image_url' => $this->main_image_url,
        ];
    }
}
