<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariantAttributeValue extends Model
{
    /** @use HasFactory<\Database\Factories\VariantAttributeValueFactory> */
    use HasFactory;

    protected $table = 'variant_attribute_values';
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = null; // Composite key

    protected $fillable = [
        'variant_id',
        'value_id',
    ];
}
