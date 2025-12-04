<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->image_id,
            'image_url' => $this->status === 'temporary' 
                ? asset('storage/' . $this->temporary_url) 
                : $this->image_url,
            'alt_text' => $this->alt_text,
            'sort_order' => $this->sort_order,
            'variant_id' => $this->variant_id,
        ];
    }
}
