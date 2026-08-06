<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_ACCEPTED = 'accepted';

    public const STATUS_COOKED = 'cooked';

    public const STATUS_DELIVERED = 'delivered';

    protected $fillable = [
        'visit_id',
        'accepted_by_waiter_id',
        'status',
        'total',
        'accepted_at',
        'delivered_at',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'accepted_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }

    public function waiter(): BelongsTo
    {
        return $this->belongsTo(Waiter::class, 'accepted_by_waiter_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
