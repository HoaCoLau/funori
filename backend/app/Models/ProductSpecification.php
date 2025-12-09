<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSpecification extends Model
{
    /** @use HasFactory<\Database\Factories\ProductSpecificationFactory> */
    use HasFactory;

    protected $primaryKey = 'specification_id';
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'spec_name',
        'spec_value',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
