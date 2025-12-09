<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    /** @use HasFactory<\Database\Factories\CouponFactory> */
    use HasFactory;

    protected $primaryKey = 'coupon_id';
    public $timestamps = false;

    protected $fillable = [
        'code',
        'description',
        'discount_type',
        'discount_value',
        'max_discount_amount',
        'min_purchase_amount',
        'scope_type',
        'start_date',
        'end_date',
        'usage_limit_total',
        'usage_limit_per_user',
        'current_usage_count',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'coupon_products', 'coupon_id', 'product_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'coupon_categories', 'coupon_id', 'category_id');
    }

    public function collections()
    {
        return $this->belongsToMany(Collection::class, 'coupon_collections', 'coupon_id', 'collection_id');
    }

    public function usageHistory()
    {
        return $this->hasMany(CouponUsageHistory::class, 'coupon_id');
    }
}
