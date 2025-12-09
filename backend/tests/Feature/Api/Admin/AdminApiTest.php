<?php

namespace Tests\Feature\Api\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;

class AdminApiTest extends TestCase
{
    // We are not using RefreshDatabase here because we want to use the seeded data
    // If we used RefreshDatabase, it would wipe the 200k records which takes forever to re-seed.
    // We will just test read operations.

    public function test_can_list_categories()
    {
        $response = $this->getJson('/api/admin/categories');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'category_id',
                             'category_name',
                             'parent_id',
                             'description',
                             'category_image',
                         ]
                     ],
                     'links',
                     'first_page_url',
                     'last_page_url',
                 ]);
    }

    public function test_can_list_products()
    {
        $response = $this->getJson('/api/admin/products');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'product_id',
                             'product_name',
                             'base_sku',
                             'base_price',
                         ]
                     ]
                 ]);
    }

    public function test_can_list_orders()
    {
        $response = $this->getJson('/api/admin/orders');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'order_id',
                             'user_id',
                             'total_amount',
                             'status',
                         ]
                     ]
                 ]);
    }

    public function test_can_list_users()
    {
        $response = $this->getJson('/api/admin/users');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'user_id',
                             'email',
                             'first_name',
                             'last_name',
                         ]
                     ]
                 ]);
    }
}
