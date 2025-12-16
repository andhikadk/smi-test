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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type VehicleListItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Truck, Edit, Plus, Trash2 } from 'lucide-react';

interface Props {
    vehicles: VehicleListItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kendaraan',
        href: '/vehicles',
    },
];

const statusStyles: Record<string, string> = {
    available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    in_service: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    in_use: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function VehiclesIndex({ vehicles }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus kendaraan ini?')) {
            router.delete(`/vehicles/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kendaraan" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Daftar Kendaraan
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data kendaraan perusahaan
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/vehicles/create">
                            <Plus className="h-4 w-4" />
                            Tambah Kendaraan
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Kendaraan ({vehicles.length})
                        </CardTitle>
                        <CardDescription>
                            Daftar semua kendaraan yang terdaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Plat Nomor</TableHead>
                                    <TableHead>Merek/Model</TableHead>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead>Kepemilikan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                            Belum ada data kendaraan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    vehicles.map((vehicle) => (
                                        <TableRow key={vehicle.id}>
                                            <TableCell className="font-medium">
                                                {vehicle.plate_number}
                                            </TableCell>
                                            <TableCell>
                                                {vehicle.brand} {vehicle.model}
                                            </TableCell>
                                            <TableCell>{vehicle.type.label}</TableCell>
                                            <TableCell>{vehicle.ownership.label}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'border-0',
                                                        statusStyles[vehicle.status.value]
                                                    )}
                                                >
                                                    {vehicle.status.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link href={`/vehicles/${vehicle.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(vehicle.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
