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
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BookingFilters, type BookingListItem, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Car, Clock, Plus, User } from 'lucide-react';
import { useState } from 'react';

interface Props {
    bookings: BookingListItem[];
    filters: BookingFilters;
    canCreate: boolean;
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pemesanan',
        href: '/bookings',
    },
];

const statusStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

function formatDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function BookingsIndex({ bookings, filters, canCreate }: Props) {
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const applyFilters = () => {
        router.get(
            '/bookings',
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
        router.get('/bookings', {}, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pemesanan Kendaraan" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Pemesanan Kendaraan
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola pemesanan kendaraan perusahaan
                        </p>
                    </div>
                    {canCreate && (
                        <Button asChild>
                            <Link href="/bookings/create">
                                <Plus className="h-4 w-4" />
                                Buat Pemesanan
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base">Filter</CardTitle>
                        <CardDescription>
                            Saring pemesanan berdasarkan status dan tanggal
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="w-full sm:w-40">
                                <Label htmlFor="status" className="mb-2 block text-sm">
                                    Status
                                </Label>
                                <Select
                                    value={filterStatus}
                                    onValueChange={setFilterStatus}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Menunggu</SelectItem>
                                        <SelectItem value="approved">Disetujui</SelectItem>
                                        <SelectItem value="rejected">Ditolak</SelectItem>
                                        <SelectItem value="completed">Selesai</SelectItem>
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
                                <Button
                                    onClick={clearFilters}
                                    variant="outline"
                                    size="sm"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bookings Table */}
                <Card className="flex-1">
                    <CardContent className="p-0">
                        {bookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <h3 className="text-lg font-medium">
                                    Belum Ada Pemesanan
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {canCreate
                                        ? 'Buat pemesanan baru untuk memulai'
                                        : 'Tidak ada pemesanan yang perlu disetujui'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="px-4 py-3 text-left font-medium">
                                                ID
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Pemohon
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Kendaraan
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Supir
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Waktu
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {bookings.map((booking) => (
                                            <tr
                                                key={booking.id}
                                                className="hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="px-4 py-3 font-mono text-xs">
                                                    #{booking.id}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        {booking.user.name}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Car className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <div className="font-medium">
                                                                {booking.vehicle.plate_number}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {booking.vehicle.brand}{' '}
                                                                {booking.vehicle.model}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {booking.driver.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <div className="text-xs">
                                                            <div>
                                                                {formatDate(
                                                                    booking.start_datetime
                                                                )}
                                                            </div>
                                                            <div className="text-muted-foreground">
                                                                s/d{' '}
                                                                {formatDate(
                                                                    booking.end_datetime
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            'border-0',
                                                            statusStyles[
                                                            booking.status.value
                                                            ] || statusStyles.pending
                                                        )}
                                                    >
                                                        {booking.status.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <Link
                                                            href={`/bookings/${booking.id}`}
                                                        >
                                                            Lihat
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
