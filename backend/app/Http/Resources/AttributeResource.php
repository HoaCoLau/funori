<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttributeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->attribute_id,
            'name' => $this->attribute_name,
            'values' => $this->values->map(function ($value) {
                return [
                    'id' => $value->value_id,
                    'name' => $value->value_name,
                    'swatch_code' => $value->swatch_code,
                ];
            }),
        ];
    }
}
