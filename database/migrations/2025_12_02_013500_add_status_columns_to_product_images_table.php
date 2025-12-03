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
        Schema::table('product_images', function (Blueprint $table) {
            $table->enum('status', ['temporary', 'public', 'delete'])->default('temporary')->after('image_id');
            $table->string('temporary_url')->nullable()->after('image_url');
            $table->string('image_url')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            $table->dropColumn(['status', 'temporary_url']);
            $table->string('image_url')->nullable(false)->change();
        });
    }
};
