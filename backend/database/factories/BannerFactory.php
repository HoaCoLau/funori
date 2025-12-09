<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Banner>
 */
class BannerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'subtitle' => $this->faker->sentence(),
            'image_url_desktop' => $this->faker->imageUrl(),
            'image_url_mobile' => $this->faker->imageUrl(),
            'target_url' => $this->faker->url(),
            'sort_order' => $this->faker->numberBetween(0, 10),
            'is_active' => $this->faker->boolean(),
        ];
    }
}
