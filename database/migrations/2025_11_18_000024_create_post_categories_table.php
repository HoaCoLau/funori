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
        Schema::create('post_categories', function (Blueprint $table) {
            $table->id('post_category_id');
            $table->string('name', 255);
            $table->string('slug', 255)->unique();
            $table->unsignedBigInteger('parent_id')->nullable();
            
            $table->foreign('parent_id')->references('post_category_id')->on('post_categories')->onDelete('set null')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_categories');
    }
};
