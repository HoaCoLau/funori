<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CouponUsageHistory>
 */
class CouponUsageHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'coupon_id' => $this->faker->numberBetween(1, 200000),
            'user_id' => $this->faker->numberBetween(1, 200000),
            'order_id' => $this->faker->numberBetween(1, 200000),
            'used_at' => $this->faker->dateTime(),
        ];
    }
}
