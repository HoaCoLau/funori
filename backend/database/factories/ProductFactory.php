<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_name' => $this->faker->words(3, true),
            'base_sku' => $this->faker->unique()->ean8(),
            'description' => $this->faker->paragraph(),
            'base_price' => $this->faker->randomFloat(2, 10, 1000),
            'is_customizable' => $this->faker->boolean(),
        ];
    }
}
