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
            'employee_id' => ['required', 'integer', 'exists:users,id'],
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,id'],
            'driver_id' => ['required', 'integer', 'exists:drivers,id'],
            'approver_1_id' => ['required', 'integer', 'exists:users,id', 'different:employee_id', 'different:approver_2_id'],
            'approver_2_id' => ['required', 'integer', 'exists:users,id', 'different:employee_id', 'different:approver_1_id'],
            'purpose' => ['required', 'string', 'max:1000'],
            'start_datetime' => ['required', 'date', 'after:now'],
            'end_datetime' => ['required', 'date', 'after:start_datetime'],
        ];
    }

    public function attributes(): array
    {
        return [
            'employee_id' => 'karyawan',
            'vehicle_id' => 'kendaraan',
            'driver_id' => 'sopir',
            'approver_1_id' => 'penyetuju level 1',
            'approver_2_id' => 'penyetuju level 2',
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
            'approver_1_id.different' => 'Penyetuju level 1 harus berbeda dari karyawan dan penyetuju level 2.',
            'approver_2_id.different' => 'Penyetuju level 2 harus berbeda dari karyawan dan penyetuju level 1.',
        ];
    }
}
