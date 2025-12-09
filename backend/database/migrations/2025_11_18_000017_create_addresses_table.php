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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id('address_id');
            $table->unsignedBigInteger('user_id');
            $table->string('full_name', 255)->nullable()->comment('Tên người nhận (có thể khác tên chủ TK)');
            $table->string('phone', 20)->nullable()->comment('SĐT người nhận');
            $table->string('address_line1', 255)->comment('Số nhà, tên đường');
            $table->string('ward_name', 100)->nullable()->comment('Tên Phường/Xã');
            $table->string('district_name', 100)->nullable()->comment('Tên Quận/Huyện');
            $table->string('city_name', 100)->comment('Tên Tỉnh/Thành phố');
            $table->boolean('is_default')->default(false);
            
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
