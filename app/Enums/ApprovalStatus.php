<?php

namespace App\Enums;

enum ApprovalStatus: string
{
    case APPROVED = 'approved';
    case REJECTED = 'rejected';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function getLabel(): string
    {
        return match ($this) {
            self::APPROVED => 'Disetujui',
            self::REJECTED => 'Ditolak',
        };
    }
}
