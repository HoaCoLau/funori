<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => $this->faker->numberBetween(1, 200000),
            'order_date' => $this->faker->dateTime(),
            'status' => $this->faker->randomElement(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
            'shipping_full_name' => $this->faker->name(),
            'shipping_phone' => $this->faker->phoneNumber(),
            'shipping_address_line1' => $this->faker->streetAddress(),
            'shipping_ward' => $this->faker->citySuffix(),
            'shipping_district' => $this->faker->city(),
            'shipping_city' => $this->faker->state(),
            'shipping_method_id' => $this->faker->numberBetween(1, 200000),
            'payment_method_id' => $this->faker->numberBetween(1, 200000),
            'subtotal_amount' => $this->faker->randomFloat(2, 50, 500),
            'shipping_fee' => $this->faker->randomFloat(2, 5, 20),
            'discount_amount' => $this->faker->randomFloat(2, 0, 50),
            'total_amount' => $this->faker->randomFloat(2, 50, 600),
            'applied_coupon_code' => null,
            'coupon_id' => null,
            'customer_note' => $this->faker->sentence(),
        ];
    }
}
