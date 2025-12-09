<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    /** @use HasFactory<\Database\Factories\ProductVariantFactory> */
    use HasFactory;

    protected $primaryKey = 'variant_id';
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'variant_sku',
        'price',
        'stock_quantity',
        'main_image_url',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'variant_id');
    }

    public function attributeValues()
    {
        return $this->belongsToMany(AttributeValue::class, 'variant_attribute_values', 'variant_id', 'value_id');
    }
}
