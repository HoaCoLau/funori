<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShippingMethod>
 */
class ShippingMethodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'code' => $this->faker->unique()->bothify('SM-####-????'),
            'base_cost' => $this->faker->randomFloat(2, 5, 50),
            'description' => $this->faker->sentence(),
            'is_active' => $this->faker->boolean(),
        ];
    }
}
