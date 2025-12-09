<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->coupon_id,
            'code' => $this->code,
            'description' => $this->description,
            'discount_type' => $this->discount_type,
            'discount_value' => (float) $this->discount_value,
            'max_discount_amount' => $this->max_discount_amount ? (float) $this->max_discount_amount : null,
            'min_purchase_amount' => (float) $this->min_purchase_amount,
            'scope_type' => $this->scope_type,
            'start_date' => $this->start_date ? $this->start_date->format('Y-m-d H:i:s') : null,
            'end_date' => $this->end_date ? $this->end_date->format('Y-m-d H:i:s') : null,
            'usage_limit_total' => $this->usage_limit_total,
            'usage_limit_per_user' => $this->usage_limit_per_user,
            'current_usage_count' => $this->current_usage_count,
            'is_active' => (bool) $this->is_active,
            'products' => $this->when($this->scope_type === 'by_product', function () {
                return $this->products->map(function ($product) {
                    return ['id' => $product->product_id, 'name' => $product->product_name];
                });
            }),
            'categories' => $this->when($this->scope_type === 'by_category', function () {
                return $this->categories->map(function ($category) {
                    return ['id' => $category->category_id, 'name' => $category->category_name];
                });
            }),
            'collections' => $this->when($this->scope_type === 'by_collection', function () {
                return $this->collections->map(function ($collection) {
                    return ['id' => $collection->collection_id, 'name' => $collection->collection_name];
                });
            }),
        ];
    }
}
