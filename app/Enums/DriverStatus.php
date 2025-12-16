<?php

namespace App\Enums;

enum DriverStatus: string
{
    case AVAILABLE = 'available';
    case UNAVAILABLE = 'unavailable';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function getLabel(): string
    {
        return match($this) {
            self::AVAILABLE => 'Tersedia',
            self::UNAVAILABLE => 'Tidak Tersedia',
        };
    }
}