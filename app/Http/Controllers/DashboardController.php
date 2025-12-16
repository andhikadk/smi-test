<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $period = $request->input('period', 'monthly');

        if (! in_array($period, ['daily', 'weekly', 'monthly'])) {
            $period = 'monthly';
        }

        $stats = [
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', BookingStatus::PENDING)->count(),
            'approved_bookings' => Booking::where('status', BookingStatus::APPROVED)->count(),
            'total_vehicles' => Vehicle::count(),
            'total_drivers' => Driver::count(),
        ];

        $bookingTrend = match ($period) {
            'daily' => $this->getDailyTrend(),
            'weekly' => $this->getWeeklyTrend(),
            default => $this->getMonthlyTrend(),
        };

        $vehicleUsage = Vehicle::withCount('bookings')
            ->orderByDesc('bookings_count')
            ->limit(10)
            ->get()
            ->map(fn ($vehicle) => [
                'name' => $vehicle->plate_number,
                'count' => $vehicle->bookings_count,
            ]);

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
            'currentPeriod' => $period,
        ]);
    }

    private function getMonthlyTrend(): Collection
    {
        return Booking::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as period"),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->map(fn ($item) => [
                'label' => $this->formatMonthLabel($item->period),
                'count' => $item->count,
            ]);
    }

    private function getDailyTrend(): Collection
    {
        $results = Booking::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as period"),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        return $this->fillDailyGaps($results);
    }

    private function getWeeklyTrend(): Collection
    {
        $results = Booking::select(
            DB::raw('YEARWEEK(created_at, 1) as year_week'),
            DB::raw('DATE(DATE_SUB(created_at, INTERVAL WEEKDAY(created_at) DAY)) as week_start'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subWeeks(8))
            ->groupBy('year_week', 'week_start')
            ->orderBy('year_week')
            ->get();

        return $this->fillWeeklyGaps($results);
    }

    private function formatMonthLabel(string $yearMonth): string
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

    private function formatDayLabel(string $date): string
    {
        $dt = new \DateTime($date);
        $day = $dt->format('j');
        $month = $this->formatMonthLabel($dt->format('Y-m'));

        return "$day $month";
    }

    private function formatWeekLabel(string $weekStart): string
    {
        $start = new \DateTime($weekStart);
        $end = (clone $start)->modify('+6 days');

        $startDay = $start->format('j');
        $endDay = $end->format('j');
        $startMonth = $this->formatMonthLabel($start->format('Y-m'));
        $endMonth = $this->formatMonthLabel($end->format('Y-m'));

        if ($startMonth === $endMonth) {
            return "$startDay-$endDay $startMonth";
        }

        return "$startDay $startMonth-$endDay $endMonth";
    }

    private function fillDailyGaps(Collection $results): Collection
    {
        $dates = collect();
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dates->push($date);
        }

        $resultMap = $results->pluck('count', 'period')->toArray();

        return $dates->map(fn ($date) => [
            'label' => $this->formatDayLabel($date),
            'count' => $resultMap[$date] ?? 0,
        ]);
    }

    private function fillWeeklyGaps(Collection $results): Collection
    {
        $weeks = collect();
        for ($i = 7; $i >= 0; $i--) {
            $weekStart = now()->subWeeks($i)->startOfWeek()->format('Y-m-d');
            $weeks->push($weekStart);
        }

        $resultMap = $results->pluck('count', 'week_start')->toArray();

        return $weeks->map(fn ($weekStart) => [
            'label' => $this->formatWeekLabel($weekStart),
            'count' => $resultMap[$weekStart] ?? 0,
        ]);
    }
}
