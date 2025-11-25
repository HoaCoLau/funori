<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
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
            'full_name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'address_line1' => $this->faker->streetAddress(),
            'ward_name' => $this->faker->citySuffix(),
            'district_name' => $this->faker->city(),
            'city_name' => $this->faker->state(),
            'is_default' => $this->faker->boolean(),
        ];
    }
}
