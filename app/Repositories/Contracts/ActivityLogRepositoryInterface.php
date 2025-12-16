<?php

namespace App\Repositories\Contracts;

use App\Models\ActivityLog;
use Illuminate\Support\Collection;

interface ActivityLogRepositoryInterface
{
    public function create(array $data): ActivityLog;

    public function getLatest(int $limit = 50): Collection;
}
