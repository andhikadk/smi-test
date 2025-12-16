<?php

namespace App\Exceptions;

use Exception;

class BookingNotPendingException extends Exception
{
    public function __construct(string $currentStatus = '')
    {
        $message = __('exceptions.booking_not_pending');

        if ($currentStatus) {
            $message .= " Current status: {$currentStatus}";
        }

        parent::__construct($message);
    }
}
