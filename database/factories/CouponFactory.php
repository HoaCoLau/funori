<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Coupon>
 */
class CouponFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->bothify('??##??##'),
            'description' => $this->faker->sentence(),
            'discount_type' => $this->faker->randomElement(['percentage', 'fixed_amount']),
            'discount_value' => $this->faker->randomFloat(2, 5, 50),
            'max_discount_amount' => $this->faker->randomFloat(2, 50, 200),
            'min_purchase_amount' => $this->faker->randomFloat(2, 0, 100),
            'scope_type' => $this->faker->randomElement(['site_wide', 'by_collection', 'by_category', 'by_product']),
            'start_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'end_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'usage_limit_total' => $this->faker->numberBetween(100, 1000),
            'usage_limit_per_user' => $this->faker->numberBetween(1, 5),
            'current_usage_count' => $this->faker->numberBetween(0, 100),
            'is_active' => $this->faker->boolean(),
        ];
    }
}
