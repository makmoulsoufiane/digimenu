<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_time',
        'end_time',
        'days',
        'status',
        'icon',
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'days' => 'array',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }
}
