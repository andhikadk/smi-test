<?php

namespace App\Exceptions;

use Exception;

class UnauthorizedApprovalException extends Exception
{
    protected $message = 'exceptions.unauthorized_approval';
}
