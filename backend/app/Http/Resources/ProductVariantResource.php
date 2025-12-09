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
            'attributes' => $this->whenLoaded('attributeValues', function () {
                return $this->attributeValues->map(function ($av) {
                    return [
                        'attribute_id' => $av->attribute_id,
                        'attribute_name' => $av->attribute ? $av->attribute->attribute_name : null,
                        'value_id' => $av->value_id,
                        'value_name' => $av->value_name,
                        'swatch_code' => $av->swatch_code,
                    ];
                });
            }),
        ];
    }
}
