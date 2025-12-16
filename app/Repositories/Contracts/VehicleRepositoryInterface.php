<?php

namespace App\Repositories\Contracts;

use App\Models\Vehicle;
use Illuminate\Support\Collection;

interface VehicleRepositoryInterface
{
    public function findById(int $id): ?Vehicle;

    public function getAll(): Collection;

    public function getAvailable(): Collection;

    public function getAvailableForDateRange(string $startDatetime, string $endDatetime): Collection;
}
