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
        Schema::create('shipping_methods', function (Blueprint $table) {
            $table->id('shipping_method_id');
            $table->string('name', 255);
            $table->string('code', 50)->unique()->comment('e.g., standard, express');
            $table->decimal('base_cost', 12, 2)->default(0);
            $table->text('description')->nullable()->comment('e.g., "2-3 ngày làm việc"');
            $table->boolean('is_active')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_methods');
    }
};
