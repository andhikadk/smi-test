<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Exports\BookingsExport;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->input('status');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $query = Booking::with(['user', 'vehicle', 'driver', 'approver1', 'approver2'])
            ->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', BookingStatus::from($status));
        }

        if ($dateFrom) {
            $query->whereDate('start_datetime', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('end_datetime', '<=', $dateTo);
        }

        $bookings = $query->get()->map(fn ($booking) => [
            'id' => $booking->id,
            'user' => $booking->user->name,
            'vehicle' => $booking->vehicle->plate_number.' - '.$booking->vehicle->brand.' '.$booking->vehicle->model,
            'driver' => $booking->driver->name,
            'purpose' => $booking->purpose,
            'start_datetime' => $booking->start_datetime->format('d/m/Y H:i'),
            'end_datetime' => $booking->end_datetime->format('d/m/Y H:i'),
            'status' => [
                'value' => $booking->status->value,
                'label' => $booking->status->getLabel(),
            ],
            'approver_1' => $booking->approver1->name ?? '-',
            'approver_2' => $booking->approver2->name ?? '-',
        ]);

        $statuses = collect(BookingStatus::cases())->map(fn ($s) => [
            'value' => $s->value,
            'label' => $s->getLabel(),
        ]);

        return Inertia::render('reports/index', [
            'bookings' => $bookings,
            'statuses' => $statuses,
            'filters' => [
                'status' => $status,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    public function export(Request $request): BinaryFileResponse
    {
        $status = $request->input('status');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $fileName = 'laporan-pemesanan-'.now()->format('Y-m-d-His').'.xlsx';

        return (new BookingsExport($status, $dateFrom, $dateTo))
            ->download($fileName);
    }
}
