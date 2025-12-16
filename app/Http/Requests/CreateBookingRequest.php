<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,id'],
            'driver_id' => ['required', 'integer', 'exists:drivers,id'],
            'purpose' => ['required', 'string', 'max:1000'],
            'start_datetime' => ['required', 'date', 'after:now'],
            'end_datetime' => ['required', 'date', 'after:start_datetime'],
        ];
    }

    public function attributes(): array
    {
        return [
            'vehicle_id' => 'kendaraan',
            'driver_id' => 'sopir',
            'purpose' => 'tujuan',
            'start_datetime' => 'waktu mulai',
            'end_datetime' => 'waktu selesai',
        ];
    }

    public function messages(): array
    {
        return [
            'start_datetime.after' => 'Waktu mulai harus setelah waktu saat ini.',
            'end_datetime.after' => 'Waktu selesai harus setelah waktu mulai.',
        ];
    }
}
