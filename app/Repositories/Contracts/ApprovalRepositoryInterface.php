<?php

namespace App\Repositories\Contracts;

use App\Models\Approval;

interface ApprovalRepositoryInterface
{
    public function create(array $data): Approval;
}
