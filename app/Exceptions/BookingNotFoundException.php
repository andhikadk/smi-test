<?php

namespace App\Exceptions;

use Exception;

class BookingNotFoundException extends Exception
{
    protected $message = 'exceptions.booking_not_found';
}
