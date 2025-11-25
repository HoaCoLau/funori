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
        Schema::create('payments', function (Blueprint $table) {
            $table->id('payment_id');
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('payment_method_id')->nullable()->comment('FK to payment_methods');
            $table->string('payment_status', 50)->default('Pending')->comment('Pending, Success, Failed');
            $table->decimal('amount', 12, 2)->comment('Số tiền thanh toán');
            $table->string('transaction_code', 255)->nullable()->comment('Mã giao dịch từ bên thứ 3 (VNPAY, Momo...)');
            $table->timestamp('payment_date')->useCurrent();
            
            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('payment_method_id')->references('payment_method_id')->on('payment_methods')->onDelete('set null')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
