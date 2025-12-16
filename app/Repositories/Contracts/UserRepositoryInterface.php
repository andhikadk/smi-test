<?php

namespace App\Repositories\Contracts;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Collection;

interface UserRepositoryInterface
{
    public function findApproverByLevel(int $level): ?User;

    public function findByRole(UserRole $role): Collection;
}
