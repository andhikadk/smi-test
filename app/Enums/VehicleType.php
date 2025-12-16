<?php

namespace App\Enums;

enum VehicleType: string
{
    case PERSONNEL = 'personnel';
    case CARGO = 'cargo';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function getLabel(): string
    {
        return match($this) {
            self::PERSONNEL => 'Angkutan Orang',
            self::CARGO => 'Angkutan Barang',
        };
    }
}