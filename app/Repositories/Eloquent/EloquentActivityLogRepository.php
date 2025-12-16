<?php

namespace App\Repositories\Eloquent;

use App\Models\ActivityLog;
use App\Repositories\Contracts\ActivityLogRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentActivityLogRepository implements ActivityLogRepositoryInterface
{
    public function create(array $data): ActivityLog
    {
        return ActivityLog::create($data);
    }

    public function getLatest(int $limit = 50): Collection
    {
        return ActivityLog::with('user:id,name')
            ->latest()
            ->take($limit)
            ->get();
    }
}
