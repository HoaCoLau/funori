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
        Schema::create('coupon_usage_history', function (Blueprint $table) {
            $table->id('usage_id');
            $table->unsignedBigInteger('coupon_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('order_id');
            $table->timestamp('used_at')->useCurrent();
            
            $table->foreign('coupon_id')->references('coupon_id')->on('coupons')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupon_usage_history');
    }
};
