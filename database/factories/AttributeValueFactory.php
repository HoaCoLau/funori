<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttributeValue>
 */
class AttributeValueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'attribute_id' => $this->faker->numberBetween(1, 200000),
            'value_name' => $this->faker->word(),
            'swatch_code' => $this->faker->hexColor(),
        ];
    }
}
