<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case APPROVER = 'approver';
    case EMPLOYEE = 'employee';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
