<?php

namespace App\Http\Controllers;

use App\Repositories\Contracts\ActivityLogRepositoryInterface;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function __construct(
        private ActivityLogRepositoryInterface $activityLogRepository
    ) {}

    public function index(): Response
    {
        $activityLogs = $this->activityLogRepository->paginate(15);

        return Inertia::render('activity-logs/index', [
            'activityLogs' => [
                'data' => $activityLogs->map(fn ($log) => [
                    'id' => $log->id,
                    'activity' => $log->activity,
                    'user' => $log->user ? [
                        'name' => $log->user->name,
                    ] : null,
                    'created_at' => $log->created_at->format('d M Y H:i'),
                ]),
                'links' => $activityLogs->linkCollection(),
                'meta' => [
                    'current_page' => $activityLogs->currentPage(),
                    'from' => $activityLogs->firstItem(),
                    'last_page' => $activityLogs->lastPage(),
                    'per_page' => $activityLogs->perPage(),
                    'to' => $activityLogs->lastItem(),
                    'total' => $activityLogs->total(),
                ],
            ],
        ]);
    }
}
