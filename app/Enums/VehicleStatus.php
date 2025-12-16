<?php

namespace App\Enums;

enum VehicleStatus: string
{
    case AVAILABLE = 'available';
    case IN_USE = 'in_use';
    case IN_SERVICE = 'in_service';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function getLabel(): string
    {
        return match($this) {
            self::AVAILABLE => 'Tersedia',
            self::IN_USE => 'Sedang Dipakai',
            self::IN_SERVICE => 'Dalam Service',
        };
    }
}