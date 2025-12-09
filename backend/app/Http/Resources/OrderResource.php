<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->order_id,
            'order_date' => $this->order_date,
            'status' => $this->status,
            'customer' => [
                'id' => $this->user_id,
                'name' => $this->user ? ($this->user->first_name . ' ' . $this->user->last_name) : 'Guest',
                'email' => $this->user ? $this->user->email : null,
                'phone' => $this->user ? $this->user->phone : null,
            ],
            'shipping_info' => [
                'full_name' => $this->shipping_full_name,
                'phone' => $this->shipping_phone,
                'address' => $this->shipping_address_line1,
                'ward' => $this->shipping_ward,
                'district' => $this->shipping_district,
                'city' => $this->shipping_city,
                'method' => $this->shippingMethod ? $this->shippingMethod->name : null,
            ],
            'payment_method' => $this->paymentMethod ? $this->paymentMethod->name : null,
            'financials' => [
                'subtotal' => (float) $this->subtotal_amount,
                'shipping_fee' => (float) $this->shipping_fee,
                'discount' => (float) $this->discount_amount,
                'total' => (float) $this->total_amount,
            ],
            'coupon_code' => $this->applied_coupon_code,
            'note' => $this->customer_note,
            'items' => OrderItemResource::collection($this->whenLoaded('orderItems')),
        ];
    }
}
