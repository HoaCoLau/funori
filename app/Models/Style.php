<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Style extends Model
{
    /** @use HasFactory<\Database\Factories\StyleFactory> */
    use HasFactory;

    protected $primaryKey = 'style_id';
    public $timestamps = false;

    protected $fillable = [
        'style_name',
        'style_description',
    ];

    public function collections()
    {
        return $this->hasMany(Collection::class, 'style_id');
    }
}
