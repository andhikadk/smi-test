import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BookingDetail, type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Car,
    CheckCircle,
    Clock,
    Phone,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    booking: BookingDetail;
    canApprove: boolean;
}

const statusStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

function formatDateTime(isoString: string): string {
    return new Date(isoString).toLocaleString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function BookingsShow({ booking, canApprove }: Props) {
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    const approveForm = useForm({});
    const rejectForm = useForm({
        notes: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pemesanan',
            href: '/bookings',
        },
        {
            title: `#${booking.id}`,
            href: `/bookings/${booking.id}`,
        },
    ];

    const handleApprove = () => {
        approveForm.post(`/bookings/${booking.id}/approve`);
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        rejectForm.post(`/bookings/${booking.id}/reject`, {
            onSuccess: () => setIsRejectDialogOpen(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pemesanan #${booking.id}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon">
                            <Link href="/bookings">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Pemesanan #{booking.id}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        'border-0',
                                        statusStyles[booking.status.value] ||
                                        statusStyles.pending
                                    )}
                                >
                                    {booking.status.label}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Dibuat {formatDateTime(booking.created_at)}
                            </p>
                        </div>
                    </div>
                    {canApprove && (
                        <div className="flex gap-2">
                            <Button
                                onClick={handleApprove}
                                disabled={approveForm.processing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Setujui
                            </Button>
                            <Button
                                onClick={() => setIsRejectDialogOpen(true)}
                                variant="destructive"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Tolak
                            </Button>
                        </div>
                    )}
                </div>

                {/* Detail Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Vehicle Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                Kendaraan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {booking.vehicle.plate_number}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {booking.vehicle.brand} {booking.vehicle.model}
                            </p>
                            <Badge variant="outline" className="mt-2 capitalize">
                                {booking.vehicle.type}
                            </Badge>
                        </CardContent>
                    </Card>

                    {/* Driver Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Supir
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold">
                                {booking.driver.name}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {booking.driver.license_number}
                            </p>
                            {booking.driver.phone && (
                                <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    {booking.driver.phone}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Time Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                Waktu
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Mulai: </span>
                                    <span className="font-medium">
                                        {formatDateTime(booking.start_datetime)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Selesai: </span>
                                    <span className="font-medium">
                                        {formatDateTime(booking.end_datetime)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requester Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Pemohon
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold">
                                {booking.user.name}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {booking.user.email}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Purpose & Approval History */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Purpose */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tujuan Pemesanan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                {booking.purpose}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Approval History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Riwayat Persetujuan
                            </CardTitle>
                            <CardDescription>
                                Level saat ini: {booking.current_approval_level}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {booking.approvals.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada tindakan persetujuan
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {booking.approvals.map((approval) => (
                                        <div
                                            key={approval.id}
                                            className="flex gap-3 border-l-2 border-muted pl-4"
                                        >
                                            <div
                                                className={cn(
                                                    'mt-0.5 h-3 w-3 rounded-full',
                                                    approval.status.value === 'approved'
                                                        ? 'bg-green-500'
                                                        : 'bg-red-500'
                                                )}
                                            />
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">
                                                        Level {approval.approval_level}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            'border-0 text-xs',
                                                            approval.status.value === 'approved'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                        )}
                                                    >
                                                        {approval.status.label}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {approval.approver.name}
                                                </p>
                                                {approval.notes && (
                                                    <p className="rounded-md bg-muted p-2 text-sm">
                                                        {approval.notes}
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDateTime(approval.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Reject Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Pemesanan</DialogTitle>
                        <DialogDescription>
                            Berikan alasan penolakan pemesanan ini. Catatan akan
                            ditampilkan kepada pemohon.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleReject}>
                        <div className="py-4">
                            <Label htmlFor="notes">Catatan Penolakan</Label>
                            <textarea
                                id="notes"
                                className="mt-2 flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Alasan penolakan..."
                                value={rejectForm.data.notes}
                                onChange={(e) =>
                                    rejectForm.setData('notes', e.target.value)
                                }
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsRejectDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={rejectForm.processing}
                            >
                                {rejectForm.processing ? 'Memproses...' : 'Tolak Pemesanan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
