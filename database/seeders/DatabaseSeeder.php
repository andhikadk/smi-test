<?php

namespace Database\Seeders;

use App\Enums\DriverStatus;
use App\Enums\UserRole;
use App\Enums\VehicleOwnership;
use App\Enums\VehicleStatus;
use App\Enums\VehicleType;
use App\Models\Driver;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ===========================
        // USERS
        // ===========================

        // Admin
        User::firstOrCreate(
            ['email' => 'admin@nikelku.id'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRole::ADMIN,
            ]
        );

        // Approvers (Level 1 & 2)
        User::firstOrCreate(
            ['email' => 'supervisor@nikelku.id'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRole::APPROVER,
                'approval_level' => 1,
            ]
        );

        User::firstOrCreate(
            ['email' => 'manager@nikelku.id'],
            [
                'name' => 'Dewi Lestari',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRole::APPROVER,
                'approval_level' => 2,
            ]
        );

        // Employees (Karyawan)
        $employees = [
            ['name' => 'Ahmad Fauzi', 'email' => 'ahmad.fauzi@nikelku.id'],
            ['name' => 'Siti Nurhaliza', 'email' => 'siti.nurhaliza@nikelku.id'],
            ['name' => 'Rudi Hartono', 'email' => 'rudi.hartono@nikelku.id'],
            ['name' => 'Putri Wulandari', 'email' => 'putri.wulandari@nikelku.id'],
            ['name' => 'Eko Prasetyo', 'email' => 'eko.prasetyo@nikelku.id'],
            ['name' => 'Maya Sari', 'email' => 'maya.sari@nikelku.id'],
            ['name' => 'Doni Kusuma', 'email' => 'doni.kusuma@nikelku.id'],
            ['name' => 'Rina Fitriani', 'email' => 'rina.fitriani@nikelku.id'],
        ];

        foreach ($employees as $emp) {
            User::firstOrCreate(
                ['email' => $emp['email']],
                [
                    'name' => $emp['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'role' => UserRole::EMPLOYEE,
                ]
            );
        }

        // ===========================
        // VEHICLES (Kendaraan)
        // ===========================

        $vehicles = [
            // Angkutan Orang - Milik Perusahaan
            [
                'plate_number' => 'B 1234 ABC',
                'brand' => 'Toyota',
                'model' => 'Avanza',
                'type' => VehicleType::PERSONNEL,
                'ownership' => VehicleOwnership::OWNED,
                'status' => VehicleStatus::AVAILABLE,
            ],
            [
                'plate_number' => 'B 5678 DEF',
                'brand' => 'Toyota',
                'model' => 'Innova',
                'type' => VehicleType::PERSONNEL,
                'ownership' => VehicleOwnership::OWNED,
                'status' => VehicleStatus::AVAILABLE,
            ],
            [
                'plate_number' => 'B 9012 GHI',
                'brand' => 'Honda',
                'model' => 'HR-V',
                'type' => VehicleType::PERSONNEL,
                'ownership' => VehicleOwnership::OWNED,
                'status' => VehicleStatus::AVAILABLE,
            ],
            [
                'plate_number' => 'B 3456 JKL',
                'brand' => 'Mitsubishi',
                'model' => 'Pajero Sport',
                'type' => VehicleType::PERSONNEL,
                'ownership' => VehicleOwnership::OWNED,
                'status' => VehicleStatus::AVAILABLE,
            ],
            // Angkutan Orang - Disewa
            [
                'plate_number' => 'B 7890 MNO',
                'brand' => 'Toyota',
                'model' => 'Hiace',
                'type' => VehicleType::PERSONNEL,
                'ownership' => VehicleOwnership::RENTED,
                'status' => VehicleStatus::AVAILABLE,
            ],
            [
                'plate_number' => 'B 2345 PQR',
                'brand' => 'Isuzu',
                'model' => 'Elf',
                'type' => VehicleType::PERSONNEL,
                'ownership' => VehicleOwnership::RENTED,
                'status' => VehicleStatus::AVAILABLE,
            ],
            // Angkutan Barang - Milik Perusahaan
            [
                'plate_number' => 'B 6789 STU',
                'brand' => 'Mitsubishi',
                'model' => 'Colt Diesel',
                'type' => VehicleType::CARGO,
                'ownership' => VehicleOwnership::OWNED,
                'status' => VehicleStatus::AVAILABLE,
            ],
            [
                'plate_number' => 'B 1357 VWX',
                'brand' => 'Hino',
                'model' => 'Dutro',
                'type' => VehicleType::CARGO,
                'ownership' => VehicleOwnership::OWNED,
                'status' => VehicleStatus::AVAILABLE,
            ],
            // Angkutan Barang - Disewa
            [
                'plate_number' => 'B 2468 YZA',
                'brand' => 'Isuzu',
                'model' => 'Giga',
                'type' => VehicleType::CARGO,
                'ownership' => VehicleOwnership::RENTED,
                'status' => VehicleStatus::AVAILABLE,
            ],
            [
                'plate_number' => 'B 1122 BCD',
                'brand' => 'Fuso',
                'model' => 'Fighter',
                'type' => VehicleType::CARGO,
                'ownership' => VehicleOwnership::RENTED,
                'status' => VehicleStatus::IN_SERVICE,
            ],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::firstOrCreate(
                ['plate_number' => $vehicle['plate_number']],
                $vehicle
            );
        }

        // ===========================
        // DRIVERS (Supir)
        // ===========================

        $drivers = [
            [
                'name' => 'Agus Supriyanto',
                'license_number' => 'SIM-A-123456',
                'phone' => '081234567890',
                'status' => DriverStatus::AVAILABLE,
            ],
            [
                'name' => 'Bambang Widodo',
                'license_number' => 'SIM-A-234567',
                'phone' => '081234567891',
                'status' => DriverStatus::AVAILABLE,
            ],
            [
                'name' => 'Cahyo Nugroho',
                'license_number' => 'SIM-B2-345678',
                'phone' => '081234567892',
                'status' => DriverStatus::AVAILABLE,
            ],
            [
                'name' => 'Darmawan Putra',
                'license_number' => 'SIM-B2-456789',
                'phone' => '081234567893',
                'status' => DriverStatus::AVAILABLE,
            ],
            [
                'name' => 'Endang Susanto',
                'license_number' => 'SIM-A-567890',
                'phone' => '081234567894',
                'status' => DriverStatus::AVAILABLE,
            ],
            [
                'name' => 'Fajar Setiawan',
                'license_number' => 'SIM-B2-678901',
                'phone' => '081234567895',
                'status' => DriverStatus::UNAVAILABLE,
            ],
        ];

        foreach ($drivers as $driver) {
            Driver::firstOrCreate(
                ['license_number' => $driver['license_number']],
                $driver
            );
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('');
        $this->command->info('=== LOGIN CREDENTIALS ===');
        $this->command->info('Admin: admin@nikelku.id / password');
        $this->command->info('Approver L1 (Supervisor): supervisor@nikelku.id / password');
        $this->command->info('Approver L2 (Manager): manager@nikelku.id / password');
        $this->command->info('Employee: ahmad.fauzi@nikelku.id / password');
        $this->command->info('');
    }
}
