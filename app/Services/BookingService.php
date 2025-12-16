<?php

namespace App\Services;

use App\Enums\ApprovalStatus;
use App\Enums\BookingStatus;
use App\Exceptions\BookingNotFoundException;
use App\Exceptions\BookingNotPendingException;
use App\Exceptions\UnauthorizedApprovalException;
use App\Models\User;
use App\Repositories\Contracts\ApprovalRepositoryInterface;
use App\Repositories\Contracts\BookingRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BookingService
{
    public function __construct(
        private BookingRepositoryInterface $bookingRepository,
        private ActivityLogService $activityLogService,
        private ApprovalRepositoryInterface $approvalRepository,
        private UserRepositoryInterface $userRepository
    ) {}

    public function createBooking(array $data)
    {
        DB::beginTransaction();
        try {
            $booking = $this->bookingRepository->create([
                'user_id' => $data['user_id'],
                'vehicle_id' => $data['vehicle_id'],
                'driver_id' => $data['driver_id'],
                'purpose' => $data['purpose'],
                'start_datetime' => $data['start_datetime'],
                'end_datetime' => $data['end_datetime'],
                'status' => BookingStatus::PENDING,
                'current_approval_level' => 1,
            ]);

            $this->activityLogService->log(
                "User {$booking->user->name} membuat pemesanan untuk kendaraan {$booking->vehicle->plate_number}.",
                $booking->user
            );

            DB::commit();

            return $booking;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            throw new Exception('An unexpected error occurred while creating the booking.');
        }
    }

    public function approveBooking(int $bookingId, User $approver)
    {
        DB::beginTransaction();
        try {
            $booking = $this->bookingRepository->findById($bookingId);

            if (! $booking) {
                throw new BookingNotFoundException;
            }

            if ($booking->status !== BookingStatus::PENDING) {
                throw new BookingNotPendingException($booking->status->getLabel());
            }

            if ($approver->approval_level !== $booking->current_approval_level) {
                throw new UnauthorizedApprovalException;
            }

            $this->approvalRepository->create([
                'booking_id' => $booking->id,
                'approver_id' => $approver->id,
                'approval_level' => $booking->current_approval_level,
                'status' => ApprovalStatus::APPROVED,
            ]);

            $nextApprover = $this->findApproverForLevel($booking->current_approval_level + 1);

            if ($nextApprover) {
                $this->bookingRepository->update($booking->id, [
                    'current_approval_level' => $booking->current_approval_level + 1,
                ]);

                $this->activityLogService->log(
                    "Pemesanan {$booking->id} disetujui oleh {$approver->name} (Level {$booking->current_approval_level}). Menunggu persetujuan dari {$nextApprover->name}.",
                    $approver
                );
            } else {
                $this->bookingRepository->update($booking->id, [
                    'status' => BookingStatus::APPROVED,
                ]);

                $this->activityLogService->log(
                    "Pemesanan {$booking->id} telah disetujui sepenuhnya oleh {$approver->name} (Level {$booking->current_approval_level}).",
                    $approver
                );
            }

            DB::commit();

            return $this->bookingRepository->findById($bookingId);
        } catch (BookingNotFoundException|BookingNotPendingException|UnauthorizedApprovalException $e) {
            DB::rollBack();
            throw $e;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            throw new Exception('An unexpected error occurred while approving the booking.');
        }
    }

    public function rejectBooking(int $bookingId, User $approver, ?string $notes = null)
    {
        DB::beginTransaction();
        try {
            $booking = $this->bookingRepository->findById($bookingId);

            if (! $booking) {
                throw new BookingNotFoundException;
            }

            if ($booking->status !== BookingStatus::PENDING) {
                throw new BookingNotPendingException($booking->status->getLabel());
            }

            if ($approver->approval_level !== $booking->current_approval_level) {
                throw new UnauthorizedApprovalException;
            }

            $this->approvalRepository->create([
                'booking_id' => $booking->id,
                'approver_id' => $approver->id,
                'approval_level' => $booking->current_approval_level,
                'status' => ApprovalStatus::REJECTED,
                'notes' => $notes,
            ]);

            $this->bookingRepository->update($booking->id, [
                'status' => BookingStatus::REJECTED,
            ]);

            $this->activityLogService->log(
                "Pemesanan {$booking->id} DITOLAK oleh {$approver->name} (Level {$booking->current_approval_level}).",
                $approver
            );

            DB::commit();

            return $this->bookingRepository->findById($bookingId);
        } catch (BookingNotFoundException|BookingNotPendingException|UnauthorizedApprovalException $e) {
            DB::rollBack();
            throw $e;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            throw new Exception('An unexpected error occurred while rejecting the booking.');
        }
    }

    private function findApproverForLevel(int $level)
    {
        return $this->userRepository->findApproverByLevel($level);
    }
}
