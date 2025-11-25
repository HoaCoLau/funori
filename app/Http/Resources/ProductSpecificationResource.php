<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductSpecificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->spec_id,
            'name' => $this->spec_name,
            'value' => $this->spec_value,
        ];
    }
}
