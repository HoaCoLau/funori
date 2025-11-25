<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->category_id,
            'name' => $this->category_name,
            'slug' => \Illuminate\Support\Str::slug($this->category_name), // Tự động tạo slug nếu cần
            'description' => $this->description,
            'image_url' => $this->category_image, // Đảm bảo đây là full URL
            'parent_id' => $this->parent_id,
            'children' => CategoryResource::collection($this->whenLoaded('children')), // Đệ quy cho danh mục con
            'created_at' => $this->created_at ? $this->created_at->format('d/m/Y H:i') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('d/m/Y H:i') : null,
        ];
    }
}
