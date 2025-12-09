<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentMethodFactory> */
    use HasFactory;

    protected $primaryKey = 'payment_method_id';
    public $timestamps = false;
    protected $fillable = ['name', 'code', 'description', 'is_active'];
}
