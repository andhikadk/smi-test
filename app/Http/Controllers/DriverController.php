<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Enums\DriverStatus;
use App\Http\Requests\DriverRequest;
use App\Models\Driver;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    public function index(): Response
    {
        $now = now();

        $drivers = Driver::with(['bookings' => function ($query) use ($now) {
            $query->where('status', BookingStatus::APPROVED)
                ->where('start_datetime', '<=', $now)
                ->where('end_datetime', '>=', $now);
        }])
            ->orderBy('name')
            ->get()
            ->map(function ($driver) {
                $isInUse = $driver->bookings->isNotEmpty();

                if ($isInUse) {
                    $displayStatus = ['value' => 'in_use', 'label' => 'Sedang Bertugas'];
                } else {
                    $displayStatus = [
                        'value' => $driver->status->value,
                        'label' => $driver->status->getLabel(),
                    ];
                }

                return [
                    'id' => $driver->id,
                    'name' => $driver->name,
                    'license_number' => $driver->license_number,
                    'phone' => $driver->phone,
                    'status' => $displayStatus,
                ];
            });

        return Inertia::render('drivers/index', [
            'drivers' => $drivers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('drivers/create', [
            'statuses' => collect(DriverStatus::cases())->map(fn ($s) => [
                'value' => $s->value,
                'label' => $s->getLabel(),
            ]),
        ]);
    }

    public function store(DriverRequest $request): RedirectResponse
    {
        Driver::create($request->validated());

        return redirect()
            ->route('drivers.index')
            ->with('success', 'Sopir berhasil ditambahkan.');
    }

    public function edit(Driver $driver): Response
    {
        return Inertia::render('drivers/edit', [
            'driver' => [
                'id' => $driver->id,
                'name' => $driver->name,
                'license_number' => $driver->license_number,
                'phone' => $driver->phone,
                'status' => $driver->status->value,
            ],
            'statuses' => collect(DriverStatus::cases())->map(fn ($s) => [
                'value' => $s->value,
                'label' => $s->getLabel(),
            ]),
        ]);
    }

    public function update(DriverRequest $request, Driver $driver): RedirectResponse
    {
        $driver->update($request->validated());

        return redirect()
            ->route('drivers.index')
            ->with('success', 'Sopir berhasil diperbarui.');
    }

    public function destroy(Driver $driver): RedirectResponse
    {
        $driver->delete();

        return redirect()
            ->route('drivers.index')
            ->with('success', 'Sopir berhasil dihapus.');
    }
}

