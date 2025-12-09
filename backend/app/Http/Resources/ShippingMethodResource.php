<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShippingMethodResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->shipping_method_id,
            'name' => $this->name,
            'code' => $this->code,
            'base_cost' => (float) $this->base_cost,
            'description' => $this->description,
            'is_active' => (bool) $this->is_active,
        ];
    }
}
