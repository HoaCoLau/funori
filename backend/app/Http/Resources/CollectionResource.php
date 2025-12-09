<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CollectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->collection_id,
            'name' => $this->collection_name,
            'style_id' => $this->style_id,
            'style_name' => $this->style ? $this->style->style_name : null,
            'description' => $this->description,
            'image' => $this->lifestyle_image,
            'products_count' => $this->whenCounted('products'),
        ];
    }
}
