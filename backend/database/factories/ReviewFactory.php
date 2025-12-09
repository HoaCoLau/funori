<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
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
            'user_id' => $this->faker->numberBetween(1, 200000),
            'rating' => $this->faker->numberBetween(1, 5),
            'title' => $this->faker->sentence(),
            'comment' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['Pending', 'Approved', 'Rejected']),
        ];
    }
}
