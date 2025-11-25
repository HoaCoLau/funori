<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingMethod extends Model
{
    /** @use HasFactory<\Database\Factories\ShippingMethodFactory> */
    use HasFactory;

    protected $primaryKey = 'shipping_method_id';
    public $timestamps = false;
    protected $fillable = ['name', 'code', 'base_cost', 'description', 'is_active'];
}
