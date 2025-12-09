<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    /** @use HasFactory<\Database\Factories\ProductCategoryFactory> */
    use HasFactory;

    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = ['product_id', 'category_id'];

    protected $fillable = [
        'product_id',
        'category_id',
    ];
}
