<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    /** @use HasFactory<\Database\Factories\WishlistFactory> */
    use HasFactory;

    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = null; // Composite key

    protected $fillable = [
        'user_id',
        'product_id',
    ];
}
