import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type DriverSelectItem,
    type UserSelectItem,
    type VehicleSelectItem,
} from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Car, User, UserCheck } from 'lucide-react';

interface Props {
    employees: UserSelectItem[];
    vehicles: VehicleSelectItem[];
    drivers: DriverSelectItem[];
    approvers: UserSelectItem[];
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pemesanan',
        href: '/bookings',
    },
    {
        title: 'Buat Pemesanan',
        href: '/bookings/create',
    },
];

export default function BookingsCreate({ employees, vehicles, drivers, approvers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        vehicle_id: '',
        driver_id: '',
        approver_1_id: '',
        approver_2_id: '',
        purpose: '',
        start_datetime: '',
        end_datetime: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/bookings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pemesanan" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/bookings">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Buat Pemesanan Baru
                        </h1>
                        <p className="text-muted-foreground">
                            Isi formulir untuk mengajukan pemesanan kendaraan
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    {/* Main Form */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Employee Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Karyawan
                                </CardTitle>
                                <CardDescription>
                                    Pilih karyawan yang akan menggunakan kendaraan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="employee_id">Karyawan *</Label>
                                    <Select
                                        value={data.employee_id}
                                        onValueChange={(value) =>
                                            setData('employee_id', value)
                                        }
                                    >
                                        <SelectTrigger id="employee_id">
                                            <SelectValue placeholder="Pilih Karyawan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((employee) => (
                                                <SelectItem
                                                    key={employee.id}
                                                    value={employee.id.toString()}
                                                >
                                                    {employee.name} ({employee.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.employee_id} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Vehicle & Driver Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Car className="h-5 w-5" />
                                    Kendaraan & Supir
                                </CardTitle>
                                <CardDescription>
                                    Pilih kendaraan dan supir yang tersedia
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="vehicle_id">Kendaraan *</Label>
                                    <Select
                                        value={data.vehicle_id}
                                        onValueChange={(value) =>
                                            setData('vehicle_id', value)
                                        }
                                    >
                                        <SelectTrigger id="vehicle_id">
                                            <SelectValue placeholder="Pilih Kendaraan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehicles.map((vehicle) => (
                                                <SelectItem
                                                    key={vehicle.id}
                                                    value={vehicle.id.toString()}
                                                >
                                                    {vehicle.plate_number} -{' '}
                                                    {vehicle.brand} {vehicle.model}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.vehicle_id} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="driver_id">Supir *</Label>
                                    <Select
                                        value={data.driver_id}
                                        onValueChange={(value) =>
                                            setData('driver_id', value)
                                        }
                                    >
                                        <SelectTrigger id="driver_id">
                                            <SelectValue placeholder="Pilih Supir" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {drivers.map((driver) => (
                                                <SelectItem
                                                    key={driver.id}
                                                    value={driver.id.toString()}
                                                >
                                                    {driver.name} ({driver.license_number})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.driver_id} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Time Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Waktu Pemesanan</CardTitle>
                                <CardDescription>
                                    Tentukan waktu mulai dan selesai penggunaan kendaraan
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_datetime">
                                        Waktu Mulai *
                                    </Label>
                                    <Input
                                        id="start_datetime"
                                        type="datetime-local"
                                        value={data.start_datetime}
                                        onChange={(e) =>
                                            setData('start_datetime', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.start_datetime} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_datetime">
                                        Waktu Selesai *
                                    </Label>
                                    <Input
                                        id="end_datetime"
                                        type="datetime-local"
                                        value={data.end_datetime}
                                        onChange={(e) =>
                                            setData('end_datetime', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.end_datetime} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Purpose */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tujuan Pemesanan</CardTitle>
                                <CardDescription>
                                    Jelaskan keperluan penggunaan kendaraan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="purpose">Tujuan *</Label>
                                    <textarea
                                        id="purpose"
                                        className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Contoh: Antar jemput tamu dari bandara untuk meeting dengan client"
                                        value={data.purpose}
                                        onChange={(e) =>
                                            setData('purpose', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.purpose} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Approver Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCheck className="h-5 w-5" />
                                    Penyetuju
                                </CardTitle>
                                <CardDescription>
                                    Tentukan 2 level penyetuju untuk pemesanan ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="approver_1_id">Penyetuju Level 1 *</Label>
                                    <Select
                                        value={data.approver_1_id}
                                        onValueChange={(value) =>
                                            setData('approver_1_id', value)
                                        }
                                    >
                                        <SelectTrigger id="approver_1_id">
                                            <SelectValue placeholder="Pilih Penyetuju" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {approvers.map((approver) => (
                                                <SelectItem
                                                    key={approver.id}
                                                    value={approver.id.toString()}
                                                    disabled={data.approver_2_id === approver.id.toString()}
                                                >
                                                    {approver.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.approver_1_id} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="approver_2_id">Penyetuju Level 2 *</Label>
                                    <Select
                                        value={data.approver_2_id}
                                        onValueChange={(value) =>
                                            setData('approver_2_id', value)
                                        }
                                    >
                                        <SelectTrigger id="approver_2_id">
                                            <SelectValue placeholder="Pilih Penyetuju" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {approvers.map((approver) => (
                                                <SelectItem
                                                    key={approver.id}
                                                    value={approver.id.toString()}
                                                    disabled={data.approver_1_id === approver.id.toString()}
                                                >
                                                    {approver.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.approver_2_id} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <Card>
                            <CardContent className="pt-6">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Ajukan Pemesanan'}
                                </Button>
                                <p className="mt-2 text-center text-xs text-muted-foreground">
                                    Pemesanan akan menunggu persetujuan berjenjang
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
