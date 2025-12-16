import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type LabelValue } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Download, FileSpreadsheet, Filter } from 'lucide-react';
import { useState } from 'react';

interface ReportBooking {
    id: number;
    user: string;
    vehicle: string;
    driver: string;
    purpose: string;
    start_datetime: string;
    end_datetime: string;
    status: LabelValue;
    approver_1: string;
    approver_2: string;
}

interface Filters {
    status: string | null;
    date_from: string | null;
    date_to: string | null;
}

interface Props {
    bookings: ReportBooking[];
    statuses: LabelValue[];
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Laporan', href: '/reports' },
];

const statusStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function ReportsIndex({ bookings, statuses, filters }: Props) {
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const applyFilters = () => {
        router.get(
            '/reports',
            {
                status: filterStatus || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            },
            { preserveState: true }
        );
    };

    const clearFilters = () => {
        setFilterStatus('');
        setDateFrom('');
        setDateTo('');
        router.get('/reports', {}, { preserveState: true });
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (filterStatus) params.append('status', filterStatus);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);

        window.location.href = `/reports/export?${params.toString()}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Pemesanan" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Laporan Pemesanan
                        </h1>
                        <p className="text-muted-foreground">
                            Lihat dan ekspor data pemesanan kendaraan
                        </p>
                    </div>
                    <Button onClick={handleExport} disabled={bookings.length === 0}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Excel
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Filter className="h-4 w-4" />
                            Filter
                        </CardTitle>
                        <CardDescription>
                            Saring data berdasarkan status dan periode
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="w-full sm:w-40">
                                <Label htmlFor="status" className="mb-2 block text-sm">
                                    Status
                                </Label>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((s) => (
                                            <SelectItem key={s.value} value={s.value}>
                                                {s.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full sm:w-40">
                                <Label htmlFor="date_from" className="mb-2 block text-sm">
                                    Dari Tanggal
                                </Label>
                                <Input
                                    id="date_from"
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-40">
                                <Label htmlFor="date_to" className="mb-2 block text-sm">
                                    Sampai Tanggal
                                </Label>
                                <Input
                                    id="date_to"
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={applyFilters} size="sm">
                                    Terapkan
                                </Button>
                                <Button onClick={clearFilters} variant="outline" size="sm">
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5" />
                            Data Pemesanan ({bookings.length})
                        </CardTitle>
                        <CardDescription>
                            Preview data yang akan diekspor
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Pemohon</TableHead>
                                        <TableHead>Kendaraan</TableHead>
                                        <TableHead>Sopir</TableHead>
                                        <TableHead>Tujuan</TableHead>
                                        <TableHead>Mulai</TableHead>
                                        <TableHead>Selesai</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                Tidak ada data yang sesuai filter
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        bookings.map((booking) => (
                                            <TableRow key={booking.id}>
                                                <TableCell className="font-mono text-xs">
                                                    #{booking.id}
                                                </TableCell>
                                                <TableCell>{booking.user}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    {booking.vehicle}
                                                </TableCell>
                                                <TableCell>{booking.driver}</TableCell>
                                                <TableCell className="max-w-[150px] truncate">
                                                    {booking.purpose}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap text-xs">
                                                    {booking.start_datetime}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap text-xs">
                                                    {booking.end_datetime}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            'border-0',
                                                            statusStyles[booking.status.value]
                                                        )}
                                                    >
                                                        {booking.status.label}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
