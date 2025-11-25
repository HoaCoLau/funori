<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => $this->faker->numberBetween(1, 200000),
            'variant_id' => $this->faker->numberBetween(1, 200000),
            'quantity' => $this->faker->numberBetween(1, 5),
            'product_name_at_purchase' => $this->faker->words(3, true),
            'variant_sku_at_purchase' => $this->faker->ean13(),
            'price_at_purchase' => $this->faker->randomFloat(2, 10, 100),
        ];
    }
}
