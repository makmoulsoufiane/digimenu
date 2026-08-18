<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Models\Order;
use App\Models\Review;
use App\Models\Visit;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request, Visit $visit): JsonResponse
    {
        if (! $visit->orders()->where('status', Order::STATUS_DELIVERED)->exists()) {
            throw ValidationException::withMessages([
                'visit' => 'You can review the visit after your order is delivered.',
            ]);
        }

        if ($visit->review()->exists()) {
            throw ValidationException::withMessages([
                'visit' => 'This visit already has a review.',
            ]);
        }

        $review = $visit->review()->create($request->validated());

        return response()->json([
            'review' => $this->serializeReview($review),
        ], 201);
    }

    private function serializeReview(Review $review): array
    {
        return [
            'id' => $review->id,
            'visitId' => $review->visit_id,
            'rating' => $review->rating,
            'comment' => $review->comment,
            'createdAt' => $review->created_at?->toISOString(),
            'updatedAt' => $review->updated_at?->toISOString(),
        ];
    }
}
