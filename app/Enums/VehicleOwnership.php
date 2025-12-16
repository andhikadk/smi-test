<?php

namespace App\Enums;

enum VehicleOwnership: string
{
    case OWNED = 'owned';
    case RENTED = 'rented';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function getLabel(): string
    {
        return match($this) {
            self::OWNED => 'Milik Perusahaan',
            self::RENTED => 'Disewa',
        };
    }
}