<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Stats cards
        $stats = [
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', BookingStatus::PENDING)->count(),
            'approved_bookings' => Booking::where('status', BookingStatus::APPROVED)->count(),
            'total_vehicles' => Vehicle::count(),
            'total_drivers' => Driver::count(),
        ];

        // Booking trend - last 6 months
        $bookingTrend = Booking::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($item) => [
                'month' => $this->formatMonth($item->month),
                'count' => $item->count,
            ]);

        // Vehicle usage - bookings per vehicle
        $vehicleUsage = Vehicle::withCount('bookings')
            ->orderByDesc('bookings_count')
            ->limit(10)
            ->get()
            ->map(fn ($vehicle) => [
                'name' => $vehicle->plate_number,
                'count' => $vehicle->bookings_count,
            ]);

        // Status distribution
        $statusDistribution = Booking::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status->getLabel(),
                'count' => $item->count,
            ]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'bookingTrend' => $bookingTrend,
            'vehicleUsage' => $vehicleUsage,
            'statusDistribution' => $statusDistribution,
        ]);
    }

    private function formatMonth(string $yearMonth): string
    {
        $months = [
            '01' => 'Jan', '02' => 'Feb', '03' => 'Mar',
            '04' => 'Apr', '05' => 'Mei', '06' => 'Jun',
            '07' => 'Jul', '08' => 'Agu', '09' => 'Sep',
            '10' => 'Okt', '11' => 'Nov', '12' => 'Des',
        ];

        $parts = explode('-', $yearMonth);
        return $months[$parts[1]] ?? $yearMonth;
    }
}
