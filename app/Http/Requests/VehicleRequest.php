<?php

namespace App\Http\Requests;

use App\Enums\VehicleOwnership;
use App\Enums\VehicleStatus;
use App\Enums\VehicleType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class VehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $vehicleId = $this->route('vehicle')?->id;

        return [
            'plate_number' => [
                'required',
                'string',
                'max:20',
                Rule::unique('vehicles', 'plate_number')->ignore($vehicleId),
            ],
            'brand' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'type' => ['required', new Enum(VehicleType::class)],
            'ownership' => ['required', new Enum(VehicleOwnership::class)],
            'status' => ['required', new Enum(VehicleStatus::class)],
        ];
    }

    public function attributes(): array
    {
        return [
            'plate_number' => 'nomor plat',
            'brand' => 'merek',
            'model' => 'model',
            'type' => 'jenis',
            'ownership' => 'kepemilikan',
            'status' => 'status',
        ];
    }
}
