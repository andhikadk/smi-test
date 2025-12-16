<?php

namespace App\Repositories\Contracts;

use App\Models\Booking;
use Illuminate\Support\Collection;

interface BookingRepositoryInterface
{
    public function findById(int $id): ?Booking;

    public function create(array $data): Booking;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;

    public function findPendingForApprover(int $approverId): Collection;

    public function getAllWithFilters(array $filters): Collection;
}
