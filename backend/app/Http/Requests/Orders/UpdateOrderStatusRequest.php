<?php

namespace App\Http\Requests\Orders;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isStaff() ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in([
                Order::STATUS_ACCEPTED,
                Order::STATUS_COOKED,
                Order::STATUS_DELIVERED,
            ])],
        ];
    }
}
