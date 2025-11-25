<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use App\Models\Style;
use App\Models\Category;
use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Collection;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use App\Models\ProductSpecification;
use App\Models\User;
use App\Models\Address;
use App\Models\PaymentMethod;
use App\Models\ShippingMethod;
use App\Models\ProductCategory;
use App\Models\ProductCollection;
use App\Models\VariantAttributeValue;
use App\Models\CouponProduct;
use App\Models\CouponCategory;
use App\Models\CouponCollection;
use App\Models\Coupon;
use App\Models\PostCategory;
use App\Models\Post;
use App\Models\Banner;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Wishlist;
use App\Models\Review;
use App\Models\ContactSubmission;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\CouponUsageHistory;

class DatabaseSeeder extends Seeder
{
    const BATCH_SIZE = 1000;
    const TOTAL_RECORDS = 200000;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('Starting seeding with 200k records per table...');
        
        // Disable foreign key constraints for faster insertion
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        $this->seedRoles();
        $this->seedStyles();
        $this->seedCategories();
        $this->seedAttributes();
        $this->seedAttributeValues();
        $this->seedCollections();
        $this->seedProducts();
        $this->seedProductVariants();
        $this->seedProductImages();
        $this->seedProductSpecifications();
        $this->seedProductCategories();
        $this->seedProductCollections();
        $this->seedVariantAttributeValues();
        $this->seedUsers();
        $this->seedAddresses();
        $this->seedPaymentMethods();
        $this->seedShippingMethods();
        $this->seedCoupons();
        $this->seedCouponProducts();
        $this->seedCouponCategories();
        $this->seedCouponCollections();
        $this->seedPostCategories();
        $this->seedPosts();
        $this->seedBanners();
        $this->seedCarts();
        $this->seedCartItems();
        $this->seedWishlists();
        $this->seedReviews();
        $this->seedContactSubmissions();
        $this->seedOrders();
        $this->seedOrderItems();
        $this->seedPayments();
        $this->seedCouponUsageHistory();
        
        // Re-enable foreign key constraints
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $this->command->info('✓ Seeding completed successfully!');
    }

    private function seedRoles(): void
    {
        $this->command->info('Seeding roles...');
        $roles = [
            ['role_name' => 'Admin'],
            ['role_name' => 'Manager'],
            ['role_name' => 'Customer'],
            ['role_name' => 'Vendor'],
            ['role_name' => 'Support'],
        ];
        
        foreach ($roles as $role) {
            Role::create($role);
        }
        $this->command->line('✓ Roles seeded');
    }

    private function seedStyles(): void
    {
        $this->command->info('Seeding styles...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = Style::factory()->count(self::BATCH_SIZE)->make()->toArray();
            Style::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Styles seeded');
    }

    private function seedCategories(): void
    {
        $this->command->info('Seeding categories...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = Category::factory()->count(self::BATCH_SIZE)->make()->toArray();
            Category::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Categories seeded');
    }

    private function seedAttributes(): void
    {
        $this->command->info('Seeding attributes...');
        $attributes = [
            'Color', 'Size', 'Material', 'Weight', 'Dimension', 
            'Pattern', 'Style', 'Brand', 'Fabric Type', 'Care Instructions'
        ];
        
        foreach ($attributes as $attr) {
            Attribute::create(['attribute_name' => $attr]);
        }
        
        // Fill remaining to 200k
        $batches = ceil((self::TOTAL_RECORDS - count($attributes)) / self::BATCH_SIZE);
        for ($i = 0; $i < $batches; $i++) {
            $data = Attribute::factory()->count(self::BATCH_SIZE)->make()->toArray();
            Attribute::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Attributes seeded');
    }

    private function seedAttributeValues(): void
    {
        $this->command->info('Seeding attribute values...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = AttributeValue::factory()->count(self::BATCH_SIZE)->make()->toArray();
            AttributeValue::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Attribute values seeded');
    }

    private function seedCollections(): void
    {
        $this->command->info('Seeding collections...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = Collection::factory()->count(self::BATCH_SIZE)->make()->toArray();
            Collection::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Collections seeded');
    }

    private function seedProducts(): void
    {
        $this->command->info('Seeding products...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = Product::factory()->count(self::BATCH_SIZE)->make()->toArray();
            Product::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Products seeded');
    }

    private function seedProductVariants(): void
    {
        $this->command->info('Seeding product variants...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = ProductVariant::factory()->count(self::BATCH_SIZE)->make()->toArray();
            ProductVariant::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Product variants seeded');
    }

    private function seedProductImages(): void
    {
        $this->command->info('Seeding product images...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = ProductImage::factory()->count(self::BATCH_SIZE)->make()->toArray();
            ProductImage::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Product images seeded');
    }

    private function seedProductSpecifications(): void
    {
        $this->command->info('Seeding product specifications...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = ProductSpecification::factory()->count(self::BATCH_SIZE)->make()->toArray();
            ProductSpecification::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Product specifications seeded');
    }

    private function seedUsers(): void
    {
        $this->command->info('Seeding users...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = User::factory()->count(self::BATCH_SIZE)->make()->toArray();
            User::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Users seeded');
    }

    private function seedAddresses(): void
    {
        $this->command->info('Seeding addresses...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = Address::factory()->count(self::BATCH_SIZE)->make()->toArray();
            Address::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Addresses seeded');
    }

    private function seedPaymentMethods(): void
    {
        $this->command->info('Seeding payment methods...');
        $paymentMethods = [
            ['name' => 'Cash on Delivery', 'code' => 'cod', 'description' => 'Pay when you receive', 'is_active' => true],
            ['name' => 'VNPay', 'code' => 'vnpay', 'description' => 'Vietnam Payment Gateway', 'is_active' => true],
            ['name' => 'Momo', 'code' => 'momo', 'description' => 'Mobile wallet', 'is_active' => true],
            ['name' => 'Bank Transfer', 'code' => 'bank_transfer', 'description' => 'Direct bank transfer', 'is_active' => true],
            ['name' => 'Credit Card', 'code' => 'credit_card', 'description' => 'Visa/Mastercard', 'is_active' => true],
        ];
        
        foreach ($paymentMethods as $method) {
            PaymentMethod::create($method);
        }
        
        // Fill remaining to 200k
        $batches = ceil((self::TOTAL_RECORDS - count($paymentMethods)) / self::BATCH_SIZE);
        for ($i = 0; $i < $batches; $i++) {
            $data = PaymentMethod::factory()->count(self::BATCH_SIZE)->make()->toArray();
            PaymentMethod::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Payment methods seeded');
    }

    private function seedShippingMethods(): void
    {
        $this->command->info('Seeding shipping methods...');
        $shippingMethods = [
            ['name' => 'Standard', 'code' => 'standard', 'base_cost' => 25000, 'description' => '3-5 business days', 'is_active' => true],
            ['name' => 'Express', 'code' => 'express', 'base_cost' => 50000, 'description' => '1-2 business days', 'is_active' => true],
            ['name' => 'Overnight', 'code' => 'overnight', 'base_cost' => 100000, 'description' => 'Next day delivery', 'is_active' => true],
            ['name' => 'Economy', 'code' => 'economy', 'base_cost' => 15000, 'description' => '5-7 business days', 'is_active' => true],
        ];
        
        foreach ($shippingMethods as $method) {
            ShippingMethod::create($method);
        }
        
        // Fill remaining to 200k
        $batches = ceil((self::TOTAL_RECORDS - count($shippingMethods)) / self::BATCH_SIZE);
        for ($i = 0; $i < $batches; $i++) {
            $data = ShippingMethod::factory()->count(self::BATCH_SIZE)->make()->toArray();
            ShippingMethod::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Shipping methods seeded');
    }

    private function seedCoupons(): void
    {
        $this->command->info('Seeding coupons...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = Coupon::factory()->count(self::BATCH_SIZE)->make()->toArray();
            Coupon::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Coupons seeded');
    }

    private function seedPostCategories(): void
    {
        $this->command->info('Seeding post categories...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = PostCategory::factory()->count(self::BATCH_SIZE)->make()->toArray();
            PostCategory::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Post categories seeded');
    }

    private function seedPosts(): void
    {
        $this->command->info('Seeding posts...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = Post::factory()->count(self::BATCH_SIZE)->make()->toArray();
            Post::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Posts seeded');
    }

    private function seedBanners(): void
    {
        $this->command->info('Seeding banners...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = Banner::factory()->count(self::BATCH_SIZE)->make()->toArray();
            Banner::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Banners seeded');
    }

    private function seedCarts(): void
    {
        $this->command->info('Seeding carts...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $startId = $i * self::BATCH_SIZE + 1;
            $data = Cart::factory()
                ->count(self::BATCH_SIZE)
                ->sequence(fn ($sequence) => ['user_id' => $startId + $sequence->index])
                ->make()
                ->toArray();
            Cart::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Carts seeded');
    }

    private function seedCartItems(): void
    {
        $this->command->info('Seeding cart items...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $startId = $i * self::BATCH_SIZE + 1;
            $data = CartItem::factory()
                ->count(self::BATCH_SIZE)
                ->sequence(fn ($sequence) => ['cart_id' => $startId + $sequence->index])
                ->make()
                ->toArray();
            CartItem::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Cart items seeded');
    }

    private function seedWishlists(): void
    {
        $this->command->info('Seeding wishlists...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $startId = $i * self::BATCH_SIZE + 1;
            $data = Wishlist::factory()
                ->count(self::BATCH_SIZE)
                ->sequence(fn ($sequence) => ['user_id' => $startId + $sequence->index])
                ->make()
                ->toArray();
            Wishlist::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Wishlists seeded');
    }

    private function seedReviews(): void
    {
        $this->command->info('Seeding reviews...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = Review::factory()->count(self::BATCH_SIZE)->make()->toArray();
            Review::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Reviews seeded');
    }

    private function seedContactSubmissions(): void
    {
        $this->command->info('Seeding contact submissions...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = ContactSubmission::factory()->count(self::BATCH_SIZE)->make()->toArray();
            ContactSubmission::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Contact submissions seeded');
    }

    private function seedOrders(): void
    {
        $this->command->info('Seeding orders...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = Order::factory()->count(self::BATCH_SIZE)->make()->toArray();
            Order::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Orders seeded');
    }

    private function seedOrderItems(): void
    {
        $this->command->info('Seeding order items...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $startId = $i * self::BATCH_SIZE + 1;
            $data = OrderItem::factory()
                ->count(self::BATCH_SIZE)
                ->sequence(fn ($sequence) => ['order_id' => $startId + $sequence->index])
                ->make()
                ->toArray();
            OrderItem::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Order items seeded');
    }

    private function seedPayments(): void
    {
        $this->command->info('Seeding payments...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $startId = $i * self::BATCH_SIZE + 1;
            $data = Payment::factory()
                ->count(self::BATCH_SIZE)
                ->sequence(fn ($sequence) => ['order_id' => $startId + $sequence->index])
                ->make()
                ->toArray();
            Payment::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Payments seeded');
    }

    private function seedCouponUsageHistory(): void
    {
        $this->command->info('Seeding coupon usage history...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = CouponUsageHistory::factory()->count(self::BATCH_SIZE)->make()->toArray();
            CouponUsageHistory::insert($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Coupon usage history seeded');
    }

    private function seedProductCategories(): void
    {
        $this->command->info('Seeding product categories...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = ProductCategory::factory()->count(self::BATCH_SIZE)->make()->toArray();
            ProductCategory::insertOrIgnore($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Product categories seeded');
    }

    private function seedProductCollections(): void
    {
        $this->command->info('Seeding product collections...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = ProductCollection::factory()->count(self::BATCH_SIZE)->make()->toArray();
            ProductCollection::insertOrIgnore($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Product collections seeded');
    }

    private function seedVariantAttributeValues(): void
    {
        $this->command->info('Seeding variant attribute values...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = VariantAttributeValue::factory()->count(self::BATCH_SIZE)->make()->toArray();
            VariantAttributeValue::insertOrIgnore($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Variant attribute values seeded');
    }

    private function seedCouponProducts(): void
    {
        $this->command->info('Seeding coupon products...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = CouponProduct::factory()->count(self::BATCH_SIZE)->make()->toArray();
            CouponProduct::insertOrIgnore($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Coupon products seeded');
    }

    private function seedCouponCategories(): void
    {
        $this->command->info('Seeding coupon categories...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = CouponCategory::factory()->count(self::BATCH_SIZE)->make()->toArray();
            CouponCategory::insertOrIgnore($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Coupon categories seeded');
    }

    private function seedCouponCollections(): void
    {
        $this->command->info('Seeding coupon collections...');
        $batches = ceil(self::TOTAL_RECORDS / self::BATCH_SIZE);
        
        for ($i = 0; $i < $batches; $i++) {
            $data = CouponCollection::factory()->count(self::BATCH_SIZE)->make()->toArray();
            CouponCollection::insertOrIgnore($data);
            $this->command->line("Batch " . ($i + 1) . "/$batches completed");
        }
        $this->command->line('✓ Coupon collections seeded');
    }
}
