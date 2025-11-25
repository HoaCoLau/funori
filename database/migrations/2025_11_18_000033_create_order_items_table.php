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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id('order_item_id');
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('variant_id')->nullable()->comment('NULL nếu biến thể đã bị xóa khỏi CSDL');
            $table->integer('quantity');
            $table->string('product_name_at_purchase', 255);
            $table->string('variant_sku_at_purchase', 150);
            $table->decimal('price_at_purchase', 12, 2)->comment('Giá của 1 sản phẩm tại thời điểm mua');
            
            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('variant_id')->references('variant_id')->on('product_variants')->onDelete('set null')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
