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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id('variant_id');
            $table->unsignedBigInteger('product_id');
            $table->string('variant_sku', 150)->unique()->comment('SKU duy nhất cho từng biến thể');
            $table->decimal('price', 12, 2)->comment('Giá cụ thể cho biến thể này');
            $table->integer('stock_quantity')->default(0);
            $table->string('main_image_url', 255)->nullable()->comment('Ảnh đại diện cho biến thể này');
            
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
