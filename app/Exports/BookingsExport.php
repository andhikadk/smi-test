<?php

namespace App\Exports;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BookingsExport implements FromQuery, Responsable, ShouldAutoSize, WithHeadings, WithMapping
{
    use Exportable;

    private ?string $status;

    private ?string $dateFrom;

    private ?string $dateTo;

    private string $fileName = 'laporan-pemesanan.xlsx';

    public function __construct(?string $status = null, ?string $dateFrom = null, ?string $dateTo = null)
    {
        $this->status = $status;
        $this->dateFrom = $dateFrom;
        $this->dateTo = $dateTo;
    }

    public function query(): Builder
    {
        $query = Booking::with(['user', 'vehicle', 'driver', 'approver1', 'approver2'])
            ->orderBy('created_at', 'desc');

        if ($this->status) {
            $query->where('status', BookingStatus::from($this->status));
        }

        if ($this->dateFrom) {
            $query->whereDate('start_datetime', '>=', $this->dateFrom);
        }

        if ($this->dateTo) {
            $query->whereDate('end_datetime', '<=', $this->dateTo);
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Pemohon',
            'Email Pemohon',
            'Kendaraan',
            'Plat Nomor',
            'Sopir',
            'Tujuan',
            'Mulai',
            'Selesai',
            'Status',
            'Penyetuju 1',
            'Penyetuju 2',
            'Dibuat',
        ];
    }

    public function map($booking): array
    {
        return [
            $booking->id,
            $booking->user->name,
            $booking->user->email,
            $booking->vehicle->brand.' '.$booking->vehicle->model,
            $booking->vehicle->plate_number,
            $booking->driver->name,
            $booking->purpose,
            $booking->start_datetime->format('d/m/Y H:i'),
            $booking->end_datetime->format('d/m/Y H:i'),
            $booking->status->getLabel(),
            $booking->approver1->name ?? '-',
            $booking->approver2->name ?? '-',
            $booking->created_at->format('d/m/Y H:i'),
        ];
    }
}
