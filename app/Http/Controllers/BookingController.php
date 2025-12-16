<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\ApprovalActionRequest;
use App\Http\Requests\CreateBookingRequest;
use App\Models\Booking;
use App\Repositories\Contracts\BookingRepositoryInterface;
use App\Repositories\Contracts\DriverRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Contracts\VehicleRepositoryInterface;
use App\Services\BookingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(
        private BookingService $bookingService,
        private BookingRepositoryInterface $bookingRepository,
        private VehicleRepositoryInterface $vehicleRepository,
        private DriverRepositoryInterface $driverRepository,
        private UserRepositoryInterface $userRepository
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $bookings = $this->bookingRepository->getAllWithFilters([
                'status' => $request->query('status'),
                'date_from' => $request->query('date_from'),
                'date_to' => $request->query('date_to'),
            ]);
        } elseif ($user->isApprover()) {
            $bookings = $this->bookingRepository->findPendingForApprover($user->id);
        } else {
            $bookings = collect();
        }

        return Inertia::render('bookings/index', [
            'bookings' => $bookings->map(fn ($booking) => [
                'id' => $booking->id,
                'user' => [
                    'id' => $booking->user->id,
                    'name' => $booking->user->name,
                ],
                'vehicle' => [
                    'id' => $booking->vehicle->id,
                    'plate_number' => $booking->vehicle->plate_number,
                    'brand' => $booking->vehicle->brand,
                    'model' => $booking->vehicle->model,
                ],
                'driver' => [
                    'id' => $booking->driver->id,
                    'name' => $booking->driver->name,
                ],
                'purpose' => $booking->purpose,
                'start_datetime' => $booking->start_datetime->toISOString(),
                'end_datetime' => $booking->end_datetime->toISOString(),
                'status' => [
                    'value' => $booking->status->value,
                    'label' => $booking->status->getLabel(),
                ],
                'current_approval_level' => $booking->current_approval_level,
                'created_at' => $booking->created_at->toISOString(),
            ]),
            'filters' => [
                'status' => $request->query('status'),
                'date_from' => $request->query('date_from'),
                'date_to' => $request->query('date_to'),
            ],
            'canCreate' => $user->isAdmin(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('bookings/create', [
            'employees' => $this->userRepository->findByRole(UserRole::EMPLOYEE)->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
            ]),
            'vehicles' => $this->vehicleRepository->getAvailable()->map(fn ($v) => [
                'id' => $v->id,
                'plate_number' => $v->plate_number,
                'brand' => $v->brand,
                'model' => $v->model,
                'type' => $v->type->value,
            ]),
            'drivers' => $this->driverRepository->getAvailable()->map(fn ($d) => [
                'id' => $d->id,
                'name' => $d->name,
                'license_number' => $d->license_number,
            ]),
            'approvers' => $this->userRepository->findByRole(UserRole::APPROVER)->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
            ]),
        ]);
    }

    public function store(CreateBookingRequest $request): RedirectResponse
    {
        try {
            $booking = $this->bookingService->createBooking([
                'user_id' => $request->validated('employee_id'),
                'vehicle_id' => $request->validated('vehicle_id'),
                'driver_id' => $request->validated('driver_id'),
                'approver_1_id' => $request->validated('approver_1_id'),
                'approver_2_id' => $request->validated('approver_2_id'),
                'purpose' => $request->validated('purpose'),
                'start_datetime' => $request->validated('start_datetime'),
                'end_datetime' => $request->validated('end_datetime'),
            ]);

            return redirect()
                ->route('bookings.show', $booking->id)
                ->with('success', 'Pemesanan berhasil dibuat dan menunggu persetujuan.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => 'Gagal membuat pemesanan: '.$e->getMessage()]);
        }
    }

    public function show(Booking $booking): Response
    {
        // Load relationships needed for the view
        $booking->load(['user', 'vehicle', 'driver', 'approvals.approver', 'approver1', 'approver2']);

        $user = request()->user();
        $expectedApproverId = $booking->current_approval_level === 1
            ? $booking->approver_1_id
            : $booking->approver_2_id;
        $canApprove = $booking->status->value === 'pending' && $user->id === $expectedApproverId;

        return Inertia::render('bookings/show', [
            'booking' => [
                'id' => $booking->id,
                'user' => [
                    'id' => $booking->user->id,
                    'name' => $booking->user->name,
                    'email' => $booking->user->email,
                ],
                'vehicle' => [
                    'id' => $booking->vehicle->id,
                    'plate_number' => $booking->vehicle->plate_number,
                    'brand' => $booking->vehicle->brand,
                    'model' => $booking->vehicle->model,
                    'type' => $booking->vehicle->type->value,
                ],
                'driver' => [
                    'id' => $booking->driver->id,
                    'name' => $booking->driver->name,
                    'license_number' => $booking->driver->license_number,
                    'phone' => $booking->driver->phone,
                ],
                'purpose' => $booking->purpose,
                'start_datetime' => $booking->start_datetime->toISOString(),
                'end_datetime' => $booking->end_datetime->toISOString(),
                'status' => [
                    'value' => $booking->status->value,
                    'label' => $booking->status->getLabel(),
                ],
                'current_approval_level' => $booking->current_approval_level,
                'created_at' => $booking->created_at->toISOString(),
                'updated_at' => $booking->updated_at->toISOString(),
                'approvals' => $booking->approvals->map(fn ($approval) => [
                    'id' => $approval->id,
                    'approver' => [
                        'name' => $approval->approver->name,
                        'email' => $approval->approver->email,
                    ],
                    'approval_level' => $approval->approval_level,
                    'status' => [
                        'value' => $approval->status->value,
                        'label' => $approval->status->getLabel(),
                    ],
                    'notes' => $approval->notes,
                    'created_at' => $approval->created_at->toISOString(),
                ]),
                'approver_1' => [
                    'id' => $booking->approver1->id,
                    'name' => $booking->approver1->name,
                ],
                'approver_2' => [
                    'id' => $booking->approver2->id,
                    'name' => $booking->approver2->name,
                ],
            ],
            'canApprove' => $canApprove,
        ]);
    }

    public function approve(Booking $booking, ApprovalActionRequest $request): RedirectResponse
    {
        try {
            $this->bookingService->approveBooking($booking->id, $request->user());

            return back()->with('success', 'Pemesanan berhasil disetujui.');
        } catch (\App\Exceptions\BookingNotFoundException $e) {
            return back()->withErrors(['error' => 'Pemesanan tidak ditemukan.']);
        } catch (\App\Exceptions\BookingNotPendingException $e) {
            return back()->withErrors(['error' => 'Pemesanan tidak dalam status menunggu persetujuan.']);
        } catch (\App\Exceptions\UnauthorizedApprovalException $e) {
            return back()->withErrors(['error' => 'Anda tidak berwenang menyetujui pemesanan ini.']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menyetujui pemesanan: '.$e->getMessage()]);
        }
    }

    public function reject(Booking $booking, ApprovalActionRequest $request): RedirectResponse
    {
        try {
            $this->bookingService->rejectBooking(
                $booking->id,
                $request->user(),
                $request->validated('notes')
            );

            return back()->with('success', 'Pemesanan berhasil ditolak.');
        } catch (\App\Exceptions\BookingNotFoundException $e) {
            return back()->withErrors(['error' => 'Pemesanan tidak ditemukan.']);
        } catch (\App\Exceptions\BookingNotPendingException $e) {
            return back()->withErrors(['error' => 'Pemesanan tidak dalam status menunggu persetujuan.']);
        } catch (\App\Exceptions\UnauthorizedApprovalException $e) {
            return back()->withErrors(['error' => 'Anda tidak berwenang menolak pemesanan ini.']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menolak pemesanan: '.$e->getMessage()]);
        }
    }
}
