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
        Schema::create('posts', function (Blueprint $table) {
            $table->id('post_id');
            $table->unsignedBigInteger('user_id')->nullable()->comment('Tác giả bài viết (FK đến Users.user_id)');
            $table->unsignedBigInteger('post_category_id')->nullable();
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('excerpt')->nullable()->comment('Mô tả ngắn/tóm tắt');
            $table->longText('content')->nullable();
            $table->string('featured_image', 255)->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('post_category_id')->references('post_category_id')->on('post_categories')->onDelete('set null')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
