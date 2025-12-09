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
        Schema::create('products', function (Blueprint $table) {
            $table->id('product_id');
            $table->string('product_name', 255);
            $table->string('base_sku', 100)->unique()->comment('SKU cho sản phẩm gốc');
            $table->text('description')->nullable();
            $table->decimal('base_price', 12, 2)->default(0)->comment('Giá khởi điểm, có thể bị ghi đè bởi biến thể');
            $table->boolean('is_customizable')->default(false);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
