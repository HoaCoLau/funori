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
        Schema::create('collections', function (Blueprint $table) {
            $table->id('collection_id');
            $table->string('collection_name', 255);
            $table->unsignedBigInteger('style_id')->nullable();
            $table->text('description')->nullable();
            $table->string('lifestyle_image', 255)->nullable()->comment('Ảnh chụp cả bộ sưu tập');
            
            $table->foreign('style_id')->references('style_id')->on('styles')->onDelete('set null')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collections');
    }
};
