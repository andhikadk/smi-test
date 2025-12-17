import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    CalendarCheck,
    Truck,
    FileSpreadsheet,
    LayoutGrid,
    Users,
    ScrollText,
} from 'lucide-react';
import AppLogo from './app-logo';
import { useMemo } from 'react';

type UserRole = 'admin' | 'approver' | 'employee';

const mainNavItems: (NavItem & { roles: UserRole[] })[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        roles: ['admin', 'approver', 'employee'],
    },
    {
        title: 'Pemesanan',
        href: '/bookings',
        icon: CalendarCheck,
        roles: ['admin', 'approver'],
    },
    {
        title: 'Kendaraan',
        href: '/vehicles',
        icon: Truck,
        roles: ['admin'],
    },
    {
        title: 'Sopir',
        href: '/drivers',
        icon: Users,
        roles: ['admin'],
    },
    {
        title: 'Laporan',
        href: '/reports',
        icon: FileSpreadsheet,
        roles: ['admin'],
    },
    {
        title: 'Log Aktivitas',
        href: '/activity-logs',
        icon: ScrollText,
        roles: ['admin'],
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = (auth.user as { role?: UserRole })?.role || 'employee';

    const filteredNavItems = useMemo(() => {
        return mainNavItems
            .filter((item) => item.roles.includes(userRole))
            .map(({ roles, ...rest }) => rest);
    }, [userRole]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

