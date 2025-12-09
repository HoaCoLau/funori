<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id('coupon_id');
            $table->string('code', 100)->unique()->comment('Mã mà người dùng nhập, ví dụ: "SALE20"');
            $table->text('description')->comment('Mô tả nội bộ, ví dụ: "Giảm 20% cho BST Mùa hè"');
            $table->enum('discount_type', ['percentage', 'fixed_amount']);
            $table->decimal('discount_value', 10, 2);
            $table->decimal('max_discount_amount', 12, 2)->nullable();
            $table->decimal('min_purchase_amount', 12, 2)->default(0);
            $table->enum('scope_type', ['site_wide', 'by_collection', 'by_category', 'by_product'])->default('site_wide');
            $table->timestamp('start_date');
            $table->timestamp('end_date');
            $table->integer('usage_limit_total')->nullable();
            $table->integer('usage_limit_per_user')->default(1);
            $table->integer('current_usage_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('created_at')->useCurrent();
            
            $table->index('code');
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
