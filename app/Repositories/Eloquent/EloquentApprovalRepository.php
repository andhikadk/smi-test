<?php

namespace App\Repositories\Eloquent;

use App\Models\Approval;
use App\Repositories\Contracts\ApprovalRepositoryInterface;

class EloquentApprovalRepository implements ApprovalRepositoryInterface
{
    public function create(array $data): Approval
    {
        return Approval::create($data);
    }
}
