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
        Schema::create('banners', function (Blueprint $table) {
            $table->id('banner_id');
            $table->string('title', 255);
            $table->text('subtitle')->nullable();
            $table->string('image_url', 255);
            $table->string('position', 50)->default('home_slider')->comment('Vị trí: home_slider, category_top, sidebar...');
            $table->string('target_url', 255)->nullable()->comment('Link khi click vào banner (ví dụ: /collections/milano)');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
