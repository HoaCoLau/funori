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
        Schema::create('product_specifications', function (Blueprint $table) {
            $table->id('spec_id');
            $table->unsignedBigInteger('product_id');
            $table->string('spec_name', 100)->comment('Ví dụ: "Chiều dài", "Bảo hành"');
            $table->string('spec_value', 255)->comment('Ví dụ: "2200mm", "5 năm"');
            
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_specifications');
    }
};
