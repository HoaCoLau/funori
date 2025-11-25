<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CouponProduct extends Model
{
    /** @use HasFactory<\Database\Factories\CouponProductFactory> */
    use HasFactory;

    protected $table = 'coupon_products';
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = null; // Composite key

    protected $fillable = [
        'coupon_id',
        'product_id',
    ];
}
