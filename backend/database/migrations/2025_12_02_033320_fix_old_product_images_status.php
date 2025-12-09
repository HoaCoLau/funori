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
        DB::table('product_images')
            ->whereNotNull('image_url')
            ->whereNull('temporary_url')
            ->update(['status' => 'public']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
