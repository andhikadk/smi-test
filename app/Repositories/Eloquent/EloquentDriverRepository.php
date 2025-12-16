<?php

namespace App\Repositories\Eloquent;

use App\Enums\BookingStatus;
use App\Enums\DriverStatus;
use App\Models\Driver;
use App\Repositories\Contracts\DriverRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentDriverRepository implements DriverRepositoryInterface
{
    public function findById(int $id): ?Driver
    {
        return Driver::find($id);
    }

    public function getAll(): Collection
    {
        return Driver::all();
    }

    public function getAvailable(): Collection
    {
        return Driver::where('status', DriverStatus::AVAILABLE)->get();
    }

    public function getAvailableForDateRange(string $startDatetime, string $endDatetime): Collection
    {
        return Driver::where('status', DriverStatus::AVAILABLE)
            ->whereDoesntHave('bookings', function ($query) use ($startDatetime, $endDatetime) {
                $query->where(function ($q) use ($startDatetime, $endDatetime) {
                    $q->whereBetween('start_datetime', [$startDatetime, $endDatetime])
                        ->orWhereBetween('end_datetime', [$startDatetime, $endDatetime])
                        ->orWhere(function ($subQ) use ($startDatetime, $endDatetime) {
                            $subQ->where('start_datetime', '<=', $startDatetime)
                                ->where('end_datetime', '>=', $endDatetime);
                        });
                })
                    ->whereIn('status', [
                        BookingStatus::PENDING,
                        BookingStatus::APPROVED,
                    ]);
            })
            ->get();
    }
}
