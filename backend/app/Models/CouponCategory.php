<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CouponCategory extends Model
{
    /** @use HasFactory<\Database\Factories\CouponCategoryFactory> */
    use HasFactory;

    protected $table = 'coupon_categories';
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = null; // Composite key

    protected $fillable = [
        'coupon_id',
        'category_id',
    ];
}
