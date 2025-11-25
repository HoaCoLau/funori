<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CouponUsageHistory extends Model
{
    /** @use HasFactory<\Database\Factories\CouponUsageHistoryFactory> */
    use HasFactory;

    protected $table = 'coupon_usage_history';
    protected $primaryKey = 'usage_id';
    public $timestamps = false;

    protected $fillable = [
        'coupon_id',
        'user_id',
        'order_id',
        'used_at',
    ];

    public function coupon()
    {
        return $this->belongsTo(Coupon::class, 'coupon_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
