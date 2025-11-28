<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->review_id,
            'product_id' => $this->product_id,
            'product_name' => $this->product ? $this->product->product_name : null,
            'user_name' => $this->user ? ($this->user->first_name . ' ' . $this->user->last_name) : 'Anonymous',
            'rating' => (int) $this->rating,
            'title' => $this->title,
            'comment' => $this->comment,
            'status' => $this->status,
            'created_at' => $this->created_at ? $this->created_at->format('d/m/Y') : null,
        ];
    }
}
