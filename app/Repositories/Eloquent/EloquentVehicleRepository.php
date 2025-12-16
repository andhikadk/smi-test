<?php

namespace App\Repositories\Eloquent;

use App\Enums\BookingStatus;
use App\Enums\VehicleStatus;
use App\Models\Vehicle;
use App\Repositories\Contracts\VehicleRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentVehicleRepository implements VehicleRepositoryInterface
{
    public function findById(int $id): ?Vehicle
    {
        return Vehicle::find($id);
    }

    public function getAll(): Collection
    {
        return Vehicle::all();
    }

    public function getAvailable(): Collection
    {
        return Vehicle::where('status', VehicleStatus::AVAILABLE)->get();
    }

    public function getAvailableForDateRange(string $startDatetime, string $endDatetime): Collection
    {
        return Vehicle::where('status', VehicleStatus::AVAILABLE)
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
