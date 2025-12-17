<?php

namespace App\Enums;

enum VehicleStatus: string
{
    case AVAILABLE = 'available';
    case IN_SERVICE = 'in_service';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function getLabel(): string
    {
        return match ($this) {
            self::AVAILABLE => 'Tersedia',
            self::IN_SERVICE => 'Dalam Service',
        };
    }
}
