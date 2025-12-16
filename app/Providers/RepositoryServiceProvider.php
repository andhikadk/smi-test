<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * All of the container bindings that should be registered.
     */
    public array $bindings = [
        \App\Repositories\Contracts\BookingRepositoryInterface::class => \App\Repositories\Eloquent\EloquentBookingRepository::class,

        \App\Repositories\Contracts\ActivityLogRepositoryInterface::class => \App\Repositories\Eloquent\EloquentActivityLogRepository::class,

        \App\Repositories\Contracts\ApprovalRepositoryInterface::class => \App\Repositories\Eloquent\EloquentApprovalRepository::class,

        \App\Repositories\Contracts\UserRepositoryInterface::class => \App\Repositories\Eloquent\EloquentUserRepository::class,

        \App\Repositories\Contracts\VehicleRepositoryInterface::class => \App\Repositories\Eloquent\EloquentVehicleRepository::class,

        \App\Repositories\Contracts\DriverRepositoryInterface::class => \App\Repositories\Eloquent\EloquentDriverRepository::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
