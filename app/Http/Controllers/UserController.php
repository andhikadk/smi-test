<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    public function index(): Response
    {
        $users = $this->userRepository->paginate(15);

        return Inertia::render('users/index', [
            'users' => [
                'data' => $users->map(fn ($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => [
                        'value' => $user->role->value,
                        'label' => $user->role->getLabel(),
                    ],
                    'approval_level' => $user->approval_level,
                ]),
                'links' => $users->linkCollection(),
                'meta' => [
                    'current_page' => $users->currentPage(),
                    'from' => $users->firstItem(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'to' => $users->lastItem(),
                    'total' => $users->total(),
                ],
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/create', [
            'roles' => collect(UserRole::cases())->map(fn ($role) => [
                'value' => $role->value,
                'label' => $role->getLabel(),
            ]),
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Hash password
        $data['password'] = Hash::make($data['password']);

        $this->userRepository->create($data);

        return redirect()
            ->route('users.index')
            ->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'approval_level' => $user->approval_level,
            ],
            'roles' => collect(UserRole::cases())->map(fn ($role) => [
                'value' => $role->value,
                'label' => $role->getLabel(),
            ]),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        // Only hash and update password if provided
        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        $this->userRepository->update($user, $data);

        return redirect()
            ->route('users.index')
            ->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(User $user): RedirectResponse
    {
        // Prevent deleting self
        if ($user->id === auth()->id()) {
            return redirect()
                ->route('users.index')
                ->with(
                    'error',
                    'Anda tidak dapat menghapus akun Anda sendiri.'
                );
        }

        try {
            $this->userRepository->delete($user);

            return redirect()
                ->route('users.index')
                ->with('success', 'Pengguna berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()
                ->route('users.index')
                ->with(
                    'error',
                    'Tidak dapat menghapus pengguna. Mungkin masih memiliki data terkait.'
                );
        }
    }
}
