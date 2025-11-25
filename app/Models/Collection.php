<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    /** @use HasFactory<\Database\Factories\CollectionFactory> */
    use HasFactory;

    protected $primaryKey = 'collection_id';
    public $timestamps = false;

    protected $fillable = [
        'collection_name',
        'description',
        'collection_image',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_collections', 'collection_id', 'product_id');
    }
}
