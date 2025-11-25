<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    /** @use HasFactory<\Database\Factories\AttributeFactory> */
    use HasFactory;

    protected $primaryKey = 'attribute_id';
    public $timestamps = false;

    protected $fillable = [
        'attribute_name',
    ];

    public function values()
    {
        return $this->hasMany(AttributeValue::class, 'attribute_id');
    }
}
