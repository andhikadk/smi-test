import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

// ===========================
// Core Types
// ===========================

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

// ===========================
// Common Types
// ===========================

export interface LabelValue {
    value: string;
    label: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

// ===========================
// Dashboard Types
// ===========================

export interface DashboardStats {
    total_bookings: number;
    pending_bookings: number;
    approved_bookings: number;
    total_vehicles: number;
    total_drivers: number;
}

export interface ChartDataPoint {
    label?: string;
    month?: string;
    name?: string;
    status?: string;
    count: number;
    [key: string]: string | number | undefined;
}

export type TrendPeriod = 'daily' | 'weekly' | 'monthly';

// ===========================
// Base Model Interfaces
// ===========================

export interface BaseModel {
    id: number;
    created_at?: string;
    updated_at?: string;
}

export interface User extends BaseModel {
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    [key: string]: unknown;
}

export interface Vehicle extends BaseModel {
    plate_number: string;
    brand: string;
    model: string;
    type: string;
    ownership?: string;
    status?: string;
}

export interface Driver extends BaseModel {
    name: string;
    license_number: string;
    phone?: string;
    status?: string;
}

export interface Booking extends BaseModel {
    purpose: string;
    start_datetime: string;
    end_datetime: string;
    current_approval_level: number;
}

export interface Approval extends BaseModel {
    approval_level: number;
    notes: string | null;
}

// ===========================
// Filters
// ===========================

export interface BookingFilters {
    status: string | null;
    date_from: string | null;
    date_to: string | null;
}

// ===========================
// List Item Types (with LabelValue for enums)
// ===========================

export interface UserListItem extends Pick<User, 'id' | 'name' | 'email'> { }

export interface VehicleListItem extends Pick<Vehicle, 'id' | 'plate_number' | 'brand' | 'model'> {
    type: LabelValue;
    ownership: LabelValue;
    status: LabelValue;
}

export interface DriverListItem extends Pick<Driver, 'id' | 'name' | 'license_number'> {
    phone: string;
    status: LabelValue;
}

export interface BookingListItem extends Pick<Booking, 'id' | 'purpose' | 'start_datetime' | 'end_datetime' | 'current_approval_level' | 'created_at'> {
    user: Pick<User, 'id' | 'name'>;
    vehicle: Pick<Vehicle, 'id' | 'plate_number' | 'brand' | 'model'>;
    driver: Pick<Driver, 'id' | 'name'>;
    status: LabelValue;
}

export interface ApprovalListItem extends Pick<Approval, 'id' | 'approval_level' | 'notes' | 'created_at'> {
    approver: Pick<User, 'name' | 'email'>;
    status: LabelValue;
}

// ===========================
// Detail Types (extended info)
// ===========================

export interface BookingDetail extends BookingListItem {
    user: Pick<User, 'id' | 'name' | 'email'>;
    vehicle: Pick<Vehicle, 'id' | 'plate_number' | 'brand' | 'model' | 'type'>;
    driver: Pick<Driver, 'id' | 'name' | 'license_number'> & { phone: string };
    updated_at: string;
    approvals: ApprovalListItem[];
    approver_1: Pick<User, 'id' | 'name'>;
    approver_2: Pick<User, 'id' | 'name'>;
}

// ===========================
// Form Data Types (raw values for forms)
// ===========================

export interface VehicleFormData extends Pick<Vehicle, 'id' | 'plate_number' | 'brand' | 'model' | 'type'> {
    ownership: string;
    status: string;
}

export interface DriverFormData extends Pick<Driver, 'id' | 'name' | 'license_number'> {
    phone: string;
    status: string;
}

// ===========================
// Select Item Types (minimal for dropdowns)
// ===========================

export interface UserSelectItem extends Pick<User, 'id' | 'name' | 'email'> { }

export interface VehicleSelectItem extends Pick<Vehicle, 'id' | 'plate_number' | 'brand' | 'model' | 'type'> { }

export interface DriverSelectItem extends Pick<Driver, 'id' | 'name' | 'license_number'> { }
