<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCollection extends Model
{
    /** @use HasFactory<\Database\Factories\ProductCollectionFactory> */
    use HasFactory;

    protected $table = 'product_collections';
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = null; // Composite key

    protected $fillable = [
        'product_id',
        'collection_id',
    ];
}
