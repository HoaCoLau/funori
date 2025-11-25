<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    /** @use HasFactory<\Database\Factories\AddressFactory> */
    use HasFactory;

    protected $primaryKey = 'address_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'full_name',
        'phone',
        'address_line1',
        'ward_name',
        'district_name',
        'city_name',
        'is_default',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
