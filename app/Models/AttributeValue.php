<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttributeValue extends Model
{
    /** @use HasFactory<\Database\Factories\AttributeValueFactory> */
    use HasFactory;

    protected $table = 'attribute_values';
    protected $primaryKey = 'value_id';
    public $timestamps = false;

    protected $fillable = [
        'attribute_id',
        'value_name',
        'swatch_code',
    ];

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attribute_id');
    }
}
