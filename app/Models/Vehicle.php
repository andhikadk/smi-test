<?php

namespace App\Models;

use App\Enums\VehicleType;
use App\Enums\VehicleStatus;
use App\Enums\VehicleOwnership;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vehicle extends Model
{
    /** @use HasFactory<\Database\Factories\VehicleFactory> */
    use HasFactory;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'type' => VehicleType::class,
            'ownership' => VehicleOwnership::class,
            'status' => VehicleStatus::class,
        ];
    }
}
