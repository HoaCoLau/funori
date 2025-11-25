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
        Schema::create('attribute_values', function (Blueprint $table) {
            $table->id('value_id');
            $table->unsignedBigInteger('attribute_id');
            $table->string('value_name', 255)->comment('Ví dụ: "Da bò Ý", "Trắng kem"');
            $table->string('swatch_code', 50)->nullable()->comment('Mã màu HEX (#FFFFFF) hoặc URL ảnh mẫu vải');
            
            $table->foreign('attribute_id')->references('attribute_id')->on('attributes')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attribute_values');
    }
};
