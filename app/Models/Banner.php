<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    /** @use HasFactory<\Database\Factories\BannerFactory> */
    use HasFactory;

    protected $primaryKey = 'banner_id';
    public $timestamps = false;

    protected $fillable = [
        'title',
        'subtitle',
        'image_url',
        'position',
        'target_url',
        'sort_order',
        'is_active',
    ];
}
