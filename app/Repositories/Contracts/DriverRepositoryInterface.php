<?php

namespace App\Repositories\Contracts;

use App\Models\Driver;
use Illuminate\Support\Collection;

interface DriverRepositoryInterface
{
    public function findById(int $id): ?Driver;

    public function getAll(): Collection;

    public function getAvailable(): Collection;

    public function getAvailableForDateRange(string $startDatetime, string $endDatetime): Collection;
}
