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
        Schema::create('coupon_products', function (Blueprint $table) {
            $table->unsignedBigInteger('coupon_id');
            $table->unsignedBigInteger('product_id');
            
            $table->primary(['coupon_id', 'product_id']);
            $table->foreign('coupon_id')->references('coupon_id')->on('coupons')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupon_products');
    }
};
