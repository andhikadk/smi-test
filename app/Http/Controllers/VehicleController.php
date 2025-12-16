<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Enums\VehicleOwnership;
use App\Enums\VehicleStatus;
use App\Enums\VehicleType;
use App\Http\Requests\VehicleRequest;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function index(): Response
    {
        $now = now();

        $vehicles = Vehicle::with(['bookings' => function ($query) use ($now) {
            $query->where('status', BookingStatus::APPROVED)
                ->where('start_datetime', '<=', $now)
                ->where('end_datetime', '>=', $now);
        }])
            ->orderBy('plate_number')
            ->get()
            ->map(function ($vehicle) {
                $isInUse = $vehicle->bookings->isNotEmpty();

                if ($isInUse) {
                    $displayStatus = ['value' => 'in_use', 'label' => 'Sedang Dipakai'];
                } else {
                    $displayStatus = [
                        'value' => $vehicle->status->value,
                        'label' => $vehicle->status->getLabel(),
                    ];
                }

                return [
                    'id' => $vehicle->id,
                    'plate_number' => $vehicle->plate_number,
                    'brand' => $vehicle->brand,
                    'model' => $vehicle->model,
                    'type' => [
                        'value' => $vehicle->type->value,
                        'label' => $vehicle->type->getLabel(),
                    ],
                    'ownership' => [
                        'value' => $vehicle->ownership->value,
                        'label' => $vehicle->ownership->getLabel(),
                    ],
                    'status' => $displayStatus,
                ];
            });

        return Inertia::render('vehicles/index', [
            'vehicles' => $vehicles,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('vehicles/create', [
            'types' => collect(VehicleType::cases())->map(fn ($type) => [
                'value' => $type->value,
                'label' => $type->getLabel(),
            ]),
            'ownerships' => collect(VehicleOwnership::cases())->map(fn ($o) => [
                'value' => $o->value,
                'label' => $o->getLabel(),
            ]),
            'statuses' => collect(VehicleStatus::cases())->map(fn ($s) => [
                'value' => $s->value,
                'label' => $s->getLabel(),
            ]),
        ]);
    }

    public function store(VehicleRequest $request): RedirectResponse
    {
        Vehicle::create($request->validated());

        return redirect()
            ->route('vehicles.index')
            ->with('success', 'Kendaraan berhasil ditambahkan.');
    }

    public function edit(Vehicle $vehicle): Response
    {
        return Inertia::render('vehicles/edit', [
            'vehicle' => [
                'id' => $vehicle->id,
                'plate_number' => $vehicle->plate_number,
                'brand' => $vehicle->brand,
                'model' => $vehicle->model,
                'type' => $vehicle->type->value,
                'ownership' => $vehicle->ownership->value,
                'status' => $vehicle->status->value,
            ],
            'types' => collect(VehicleType::cases())->map(fn ($type) => [
                'value' => $type->value,
                'label' => $type->getLabel(),
            ]),
            'ownerships' => collect(VehicleOwnership::cases())->map(fn ($o) => [
                'value' => $o->value,
                'label' => $o->getLabel(),
            ]),
            'statuses' => collect(VehicleStatus::cases())->map(fn ($s) => [
                'value' => $s->value,
                'label' => $s->getLabel(),
            ]),
        ]);
    }

    public function update(VehicleRequest $request, Vehicle $vehicle): RedirectResponse
    {
        $vehicle->update($request->validated());

        return redirect()
            ->route('vehicles.index')
            ->with('success', 'Kendaraan berhasil diperbarui.');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        $vehicle->delete();

        return redirect()
            ->route('vehicles.index')
            ->with('success', 'Kendaraan berhasil dihapus.');
    }
}
