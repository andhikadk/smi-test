<?php

namespace App\Http\Requests;

use App\Enums\DriverStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class DriverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $driverId = $this->route('driver')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'license_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('drivers', 'license_number')->ignore($driverId),
            ],
            'phone' => ['required', 'string', 'max:20'],
            'status' => ['required', new Enum(DriverStatus::class)],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nama',
            'license_number' => 'nomor SIM',
            'phone' => 'telepon',
            'status' => 'status',
        ];
    }
}
