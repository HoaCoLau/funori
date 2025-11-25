<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->product_id,
            'name' => $this->product_name,
            'sku' => $this->base_sku,
            'description' => $this->description,
            'base_price' => (float) $this->base_price,
            'is_customizable' => (boolean) $this->is_customizable,
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'specifications' => ProductSpecificationResource::collection($this->whenLoaded('specifications')),
            // Collections resource can be added later if needed, or just simple array for now
            'collections' => $this->whenLoaded('collections', function () {
                return $this->collections->map(function ($collection) {
                    return [
                        'id' => $collection->collection_id,
                        'name' => $collection->collection_name,
                    ];
                });
            }),
            'created_at' => $this->created_at ? $this->created_at->format('d/m/Y H:i') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('d/m/Y H:i') : null,
        ];
    }
}
