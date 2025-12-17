<?php

namespace App\Repositories\Contracts;

use App\Models\ActivityLog;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ActivityLogRepositoryInterface
{
    public function create(array $data): ActivityLog;

    public function getLatest(int $limit = 50): Collection;

    public function paginate(int $perPage = 15): LengthAwarePaginator;
}
