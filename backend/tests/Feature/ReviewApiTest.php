<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Manager;
use App\Models\Order;
use App\Models\RestaurantTable;
use App\Models\Visit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_create_review_for_visit(): void
    {
        $visit = $this->createVisit();

        $this->postJson("/api/visits/{$visit->id}/review", [
            'rating' => 5,
            'comment' => 'Great service.',
        ])
            ->assertCreated()
            ->assertJsonPath('review.visitId', $visit->id)
            ->assertJsonPath('review.rating', 5)
            ->assertJsonPath('review.comment', 'Great service.');

        $this->assertDatabaseHas('reviews', [
            'visit_id' => $visit->id,
            'rating' => 5,
            'comment' => 'Great service.',
        ]);
    }

    public function test_visit_can_only_have_one_review(): void
    {
        $visit = $this->createVisit();

        $this->postJson("/api/visits/{$visit->id}/review", [
            'rating' => 4,
        ])->assertCreated();

        $this->postJson("/api/visits/{$visit->id}/review", [
            'rating' => 3,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('visit');
    }

    public function test_visit_cannot_be_reviewed_before_order_is_delivered(): void
    {
        $visit = $this->createVisit(orderStatus: Order::STATUS_PENDING);

        $this->postJson("/api/visits/{$visit->id}/review", [
            'rating' => 5,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('visit');

        $this->assertDatabaseMissing('reviews', [
            'visit_id' => $visit->id,
        ]);
    }

    public function test_review_rating_must_be_between_one_and_five(): void
    {
        $visit = $this->createVisit();

        $this->postJson("/api/visits/{$visit->id}/review", [
            'rating' => 6,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('rating');
    }

    private function createVisit(string $orderStatus = Order::STATUS_DELIVERED): Visit
    {
        $customer = Customer::create([
            'name' => 'Sara',
        ]);

        $table = RestaurantTable::create([
            'manager_id' => Manager::query()->first()->id,
            'code' => 'T1',
            'table_number' => 1,
            'capacity' => 2,
            'status' => 'occupied',
        ]);

        $visit = Visit::create([
            'customer_id' => $customer->id,
            'restaurant_table_id' => $table->id,
            'status' => 'open',
        ]);

        Order::create([
            'visit_id' => $visit->id,
            'status' => $orderStatus,
            'total' => 25,
            'delivered_at' => $orderStatus === Order::STATUS_DELIVERED ? now() : null,
        ]);

        return $visit;
    }
}
