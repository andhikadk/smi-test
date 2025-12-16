import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ChartDataPoint, type DashboardStats, type TrendPeriod } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CalendarCheck, Car, Clock, Truck, Users } from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface Props {
    stats: DashboardStats;
    bookingTrend: ChartDataPoint[];
    vehicleUsage: ChartDataPoint[];
    statusDistribution: ChartDataPoint[];
    currentPeriod: TrendPeriod;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const COLORS = ['#f59e0b', '#123c61', '#4b5563', '#64748b'];
const NAVY = '#123c61';
const STEEL = '#4b5563';

export default function Dashboard({
    stats,
    bookingTrend,
    vehicleUsage,
    statusDistribution,
    currentPeriod,
}: Props) {
    const [period, setPeriod] = useState<TrendPeriod>(currentPeriod);

    const handlePeriodChange = (value: string) => {
        const newPeriod = value as TrendPeriod;
        setPeriod(newPeriod);
        router.get(
            '/dashboard',
            { period: newPeriod },
            { preserveState: true, preserveScroll: true }
        );
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card className="card-industrial">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Pemesanan
                            </CardTitle>
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-technical">
                                {stats.total_bookings}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-industrial-amber">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Menunggu Persetujuan
                            </CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-technical text-amber-600">
                                {stats.pending_bookings}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-industrial">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Disetujui
                            </CardTitle>
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-technical">
                                {stats.approved_bookings}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-industrial">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Kendaraan
                            </CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-technical">
                                {stats.total_vehicles}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-industrial">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Sopir
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-technical">
                                {stats.total_drivers}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Booking Trend */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Tren Pemesanan</CardTitle>
                                    <CardDescription>
                                        {period === 'daily' && 'Jumlah pemesanan 30 hari terakhir'}
                                        {period === 'weekly' && 'Jumlah pemesanan 8 minggu terakhir'}
                                        {period === 'monthly' && 'Jumlah pemesanan 6 bulan terakhir'}
                                    </CardDescription>
                                </div>
                                <ToggleGroup
                                    type="single"
                                    value={period}
                                    onValueChange={handlePeriodChange}
                                    variant="outline"
                                    size="sm"
                                >
                                    <ToggleGroupItem value="daily" aria-label="Harian">
                                        Harian
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="weekly" aria-label="Mingguan">
                                        Mingguan
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="monthly" aria-label="Bulanan">
                                        Bulanan
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                {bookingTrend.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={bookingTrend}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={STEEL} opacity={0.3} />
                                            <XAxis
                                                dataKey="label"
                                                stroke={STEEL}
                                                angle={period === 'daily' ? -45 : 0}
                                                textAnchor={period === 'daily' ? 'end' : 'middle'}
                                                height={period === 'daily' ? 60 : 30}
                                            />
                                            <YAxis allowDecimals={false} stroke={STEEL} />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke={NAVY}
                                                strokeWidth={2}
                                                name="Pemesanan"
                                                dot={{ fill: NAVY }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">
                                        Belum ada data pemesanan
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Distribusi Status</CardTitle>
                            <CardDescription>
                                Persentase status pemesanan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                {statusDistribution.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusDistribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) =>
                                                    `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                                }
                                                outerRadius={100}
                                                fill={NAVY}
                                                dataKey="count"
                                                nameKey="status"
                                            >
                                                {statusDistribution.map((_, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">
                                        Belum ada data pemesanan
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Vehicle Usage */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Pemakaian Kendaraan
                        </CardTitle>
                        <CardDescription>
                            Frekuensi penggunaan per kendaraan (Top 10)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            {vehicleUsage.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={vehicleUsage} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke={STEEL} opacity={0.3} />
                                        <XAxis type="number" allowDecimals={false} stroke={STEEL} />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={100}
                                            tick={{ fontSize: 12 }}
                                            stroke={STEEL}
                                        />
                                        <Tooltip />
                                        <Bar
                                            dataKey="count"
                                            fill={NAVY}
                                            name="Pemesanan"
                                            radius={[0, 0, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    Belum ada data pemakaian kendaraan
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
