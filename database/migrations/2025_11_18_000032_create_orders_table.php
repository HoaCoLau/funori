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
        Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->unsignedBigInteger('user_id')->nullable()->comment('NULL nếu là khách (guest) đặt hàng');
            $table->timestamp('order_date')->useCurrent();
            $table->string('status', 50)->default('Pending')->comment('Pending, Processing, Shipped, Delivered, Cancelled');
            $table->string('shipping_full_name', 255);
            $table->string('shipping_phone', 20);
            $table->string('shipping_address_line1', 255);
            $table->string('shipping_ward', 100)->nullable();
            $table->string('shipping_district', 100)->nullable();
            $table->string('shipping_city', 100);
            $table->unsignedBigInteger('shipping_method_id')->nullable();
            $table->unsignedBigInteger('payment_method_id')->nullable();
            $table->decimal('subtotal_amount', 12, 2)->comment('Tổng tiền hàng');
            $table->decimal('shipping_fee', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->comment('Tổng tiền cuối cùng phải trả');
            $table->string('applied_coupon_code', 100)->nullable()->comment('Mã code đã nhập');
            $table->unsignedBigInteger('coupon_id')->nullable()->comment('FK liên kết đến mã giảm giá');
            $table->text('customer_note')->nullable();
            
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('coupon_id')->references('coupon_id')->on('coupons')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('shipping_method_id')->references('shipping_method_id')->on('shipping_methods')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('payment_method_id')->references('payment_method_id')->on('payment_methods')->onDelete('set null')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
