<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
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
            'post_category_id' => $this->faker->numberBetween(1, 200000),
            'title' => $this->faker->sentence(),
            'slug' => $this->faker->slug() . '-' . $this->faker->unique()->bothify('#####-?????'),
            'excerpt' => $this->faker->paragraph(),
            'content' => $this->faker->text(),
            'featured_image' => $this->faker->imageUrl(),
            'status' => $this->faker->randomElement(['draft', 'published', 'archived']),
            'published_at' => $this->faker->dateTime(),
        ];
    }
}
