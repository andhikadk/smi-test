<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'role' => ['required', new Enum(UserRole::class)],
            'approval_level' => [
                'nullable',
                'integer',
                'min:1',
                'max:2',
                Rule::requiredIf(function () {
                    return $this->input('role') === UserRole::APPROVER->value;
                }),
            ],
        ];

        // Password required on create, optional on update
        if ($isUpdate) {
            $rules['password'] = ['nullable', 'string', Password::defaults()];
        } else {
            $rules['password'] = ['required', 'string', Password::defaults()];
        }

        return $rules;
    }

    public function attributes(): array
    {
        return [
            'name' => 'nama',
            'email' => 'email',
            'password' => 'password',
            'role' => 'role',
            'approval_level' => 'level persetujuan',
        ];
    }

    public function messages(): array
    {
        return [
            'approval_level.required_if' => 'Level persetujuan wajib diisi untuk role Approver.',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Remove approval_level if role is not approver
        if ($this->input('role') !== UserRole::APPROVER->value) {
            $this->merge(['approval_level' => null]);
        }
    }
}
