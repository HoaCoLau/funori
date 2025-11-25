<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CouponCollection extends Model
{
    /** @use HasFactory<\Database\Factories\CouponCollectionFactory> */
    use HasFactory;

    protected $table = 'coupon_collections';
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = null; // Composite key

    protected $fillable = [
        'coupon_id',
        'collection_id',
    ];
}
