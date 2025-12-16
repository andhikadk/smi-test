<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\ActivityLogRepositoryInterface;

class ActivityLogService
{
    public function __construct(
        private ActivityLogRepositoryInterface $activityLogRepository
    ) {}

    public function log(string $activity, ?User $user = null): void
    {
        $this->activityLogRepository->create([
            'user_id' => $user?->id,
            'activity' => $activity,
        ]);
    }
}
