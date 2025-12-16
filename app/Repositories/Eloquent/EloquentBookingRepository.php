<?php

namespace App\Repositories\Eloquent;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\User;
use App\Repositories\Contracts\BookingRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentBookingRepository implements BookingRepositoryInterface
{
    public function findById(int $id): ?Booking
    {
        return Booking::find($id);
    }

    public function create(array $data): Booking
    {
        return Booking::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $booking = Booking::find($id);
        if (! $booking) {
            return false;
        }

        return $booking->update($data);
    }

    public function delete(int $id): bool
    {
        $booking = Booking::find($id);
        if (! $booking) {
            return false;
        }

        return $booking->delete();
    }

    public function findPendingForApprover(int $approverId): Collection
    {
        $approver = User::find($approverId);

        if (! $approver) {
            return collect();
        }

        return Booking::with(['user', 'vehicle', 'driver'])
            ->where('status', BookingStatus::PENDING)
            ->where('current_approval_level', $approver->approval_level)
            ->latest()
            ->get();
    }

    public function getAllWithFilters(array $filters): Collection
    {
        $query = Booking::with(['user', 'vehicle', 'driver']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (isset($filters['date_from'])) {
            $query->whereDate('start_datetime', '>=', $filters['date_from']);
        }
        if (isset($filters['date_to'])) {
            $query->whereDate('end_datetime', '<=', $filters['date_to']);
        }

        return $query->latest()->get();
    }
}
