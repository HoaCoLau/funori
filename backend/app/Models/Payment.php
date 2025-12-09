<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory;

    protected $primaryKey = 'payment_id';
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'payment_method_id',
        'payment_status',
        'amount',
        'transaction_code',
        'payment_date',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }
}
