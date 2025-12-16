<?php

namespace App\Repositories\Eloquent;

use App\Enums\UserRole;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function findApproverByLevel(int $level): ?User
    {
        return User::where('role', UserRole::APPROVER)
            ->where('approval_level', $level)
            ->first();
    }

    public function findByRole(UserRole $role): Collection
    {
        return User::where('role', $role)->get();
    }
}
