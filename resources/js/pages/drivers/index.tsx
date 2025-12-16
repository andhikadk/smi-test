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
import { type BreadcrumbItem, type DriverListItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Phone, Plus, Trash2, Users } from 'lucide-react';

interface Props {
    drivers: DriverListItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sopir',
        href: '/drivers',
    },
];

const statusStyles: Record<string, string> = {
    available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    unavailable: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    in_use: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function DriversIndex({ drivers }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus Sopir ini?')) {
            router.delete(`/drivers/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sopir" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Daftar Sopir
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data Sopir perusahaan
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/drivers/create">
                            <Plus className="h-4 w-4" />
                            Tambah Sopir
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Sopir ({drivers.length})
                        </CardTitle>
                        <CardDescription>
                            Daftar semua Sopir yang terdaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Nomor SIM</TableHead>
                                    <TableHead>Telepon</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {drivers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            Belum ada data Sopir
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    drivers.map((driver) => (
                                        <TableRow key={driver.id}>
                                            <TableCell className="font-medium">
                                                {driver.name}
                                            </TableCell>
                                            <TableCell>{driver.license_number}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                                    {driver.phone}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'border-0',
                                                        statusStyles[driver.status.value]
                                                    )}
                                                >
                                                    {driver.status.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link href={`/drivers/${driver.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(driver.id)}
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
