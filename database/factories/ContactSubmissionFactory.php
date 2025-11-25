<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContactSubmission>
 */
class ContactSubmissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'email' => $this->faker->email(),
            'phone' => $this->faker->phoneNumber(),
            'subject' => $this->faker->sentence(),
            'message_content' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['new', 'read', 'replied', 'spam']),
        ];
    }
}
