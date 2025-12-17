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

    public function getLabel(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrator',
            self::APPROVER => 'Approver',
            self::EMPLOYEE => 'Karyawan',
        };
    }
}
