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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id('cart_item_id');
            $table->unsignedBigInteger('cart_id');
            $table->unsignedBigInteger('variant_id')->comment('Sản phẩm thêm vào giỏ là 1 biến thể cụ thể');
            $table->integer('quantity')->default(1);
            
            $table->unique(['cart_id', 'variant_id']);
            $table->foreign('cart_id')->references('cart_id')->on('carts')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('variant_id')->references('variant_id')->on('product_variants')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
