<?php

namespace App\Repositories\Eloquent;

use App\Enums\UserRole;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function findApproverByLevel(int $level): ?User
    {
        return User::where('role', UserRole::APPROVER)
            ->where('approval_level', $level)
            ->first();
    }
}
