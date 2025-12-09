<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductImage>
 */
class ProductImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => $this->faker->numberBetween(1, 200000),
            'variant_id' => null,
            'image_url' => $this->faker->imageUrl(),
            'alt_text' => $this->faker->sentence(),
            'sort_order' => $this->faker->numberBetween(0, 10),
        ];
    }
}
