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
import Pagination from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import {
    type ActivityLogListItem,
    type BreadcrumbItem,
    type PaginatedData,
} from '@/types';
import { Head } from '@inertiajs/react';
import { ScrollText } from 'lucide-react';

interface Props {
    activityLogs: PaginatedData<ActivityLogListItem>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Log Aktivitas',
        href: '/activity-logs',
    },
];

export default function ActivityLogsIndex({ activityLogs }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Log Aktivitas" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Log Aktivitas
                    </h1>
                    <p className="text-muted-foreground">
                        Riwayat aktivitas sistem
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ScrollText className="h-5 w-5" />
                            Aktivitas ({activityLogs.meta.total})
                        </CardTitle>
                        <CardDescription>
                            Semua aktivitas yang tercatat dalam sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Waktu</TableHead>
                                    <TableHead>Pengguna</TableHead>
                                    <TableHead>Aktivitas</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activityLogs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            Belum ada log aktivitas
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activityLogs.data.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">
                                                {log.created_at}
                                            </TableCell>
                                            <TableCell>
                                                {log.user?.name || 'Sistem'}
                                            </TableCell>
                                            <TableCell>
                                                {log.activity}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <Pagination
                            links={activityLogs.links}
                            meta={activityLogs.meta}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
