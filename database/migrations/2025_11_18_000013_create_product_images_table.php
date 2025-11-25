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
        Schema::create('product_images', function (Blueprint $table) {
            $table->id('image_id');
            $table->unsignedBigInteger('product_id')->comment('Ảnh này thuộc sản phẩm nào');
            $table->unsignedBigInteger('variant_id')->nullable()->comment('Nếu NULL, là ảnh chung. Nếu có, là ảnh riêng của biến thể');
            $table->string('image_url', 255);
            $table->string('alt_text', 255)->nullable();
            $table->integer('sort_order')->default(0);
            
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('variant_id')->references('variant_id')->on('product_variants')->onDelete('set null')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
