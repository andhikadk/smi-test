import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { Truck, Lock, Mail } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
}: LoginProps) {
    return (
        <>
            <Head title="Masuk" />

            <div className="flex min-h-screen">
                {/* Left Panel - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Truck className="h-8 w-8 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">NikelKu</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                            Sistem Pemesanan
                            <br />
                            Kendaraan Perusahaan
                        </h1>

                        <p className="text-lg text-white/80 max-w-md">
                            Kelola pemesanan kendaraan dengan mudah, pantau status persetujuan,
                            dan akses laporan secara real-time.
                        </p>

                        <div className="mt-12 flex gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">24/7</div>
                                <div className="text-sm text-white/60">Akses Kapanpun</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">2-Level</div>
                                <div className="text-sm text-white/60">Persetujuan</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">Real-time</div>
                                <div className="text-sm text-white/60">Tracking</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                            <div className="p-2.5 bg-primary rounded-xl">
                                <Truck className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-foreground">NikelKu</span>
                        </div>

                        <div className="text-center lg:text-left mb-8">
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                Selamat Datang
                            </h2>
                            <p className="text-muted-foreground">
                                Masuk ke akun Anda untuk melanjutkan
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center text-sm text-green-700 dark:text-green-400">
                                {status}
                            </div>
                        )}

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            Email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="nama@perusahaan.com"
                                                className="pl-10 h-11"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-sm font-medium">
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <Link
                                                    href={request()}
                                                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                                                    tabIndex={5}
                                                >
                                                    Lupa password?
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="pl-10 h-11"
                                            />
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox id="remember" name="remember" tabIndex={3} />
                                        <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                                            Ingat saya di perangkat ini
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-11 text-base font-medium"
                                        tabIndex={4}
                                        disabled={processing}
                                    >
                                        {processing && <Spinner className="mr-2" />}
                                        Masuk
                                    </Button>
                                </>
                            )}
                        </Form>

                        <p className="mt-8 text-center text-xs text-muted-foreground">
                            © {new Date().getFullYear()} NikelKu. Sistem Pemesanan Kendaraan.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
