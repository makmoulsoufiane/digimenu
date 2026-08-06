<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    public function isManager(): bool
    {
        return $this->role === 'manager';
    }

    public function isWaiter(): bool
    {
        return $this->role === 'waiter';
    }

    public function isStaff(): bool
    {
        return $this->isManager() || $this->isWaiter();
    }

    public function managerProfile(): ?Manager
    {
        if (! $this->isManager()) {
            return null;
        }

        return Manager::query()->firstOrCreate(
            ['email' => $this->email],
            [
                'full_name' => $this->name,
                'password_hash' => $this->password,
            ],
        );
    }

    public function waiterProfile(): ?Waiter
    {
        if (! $this->isWaiter()) {
            return null;
        }

        $manager = Manager::query()->first()
            ?? Manager::create([
                'full_name' => 'DigiMenu Manager',
                'email' => 'manager@digimenu.test',
                'password_hash' => '',
            ]);

        return DB::transaction(fn (): Waiter => Waiter::query()->firstOrCreate(
            ['email' => $this->email],
            [
                'manager_id' => $manager->id,
                'first_name' => explode(' ', $this->name)[0] ?: $this->name,
                'password_hash' => $this->password,
            ],
        ));
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
