import { Button } from '@/components/ui/button';
import { PaginationLink } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    links: PaginationLink[];
    meta: {
        from: number | null;
        to: number | null;
        total: number;
    };
}

export default function Pagination({ links, meta }: Props) {
    if (links.length <= 3) return null; // Only prev/next, no actual pages

    const showingText =
        meta.from && meta.to
            ? `Menampilkan ${meta.from}-${meta.to} dari ${meta.total} data`
            : 'Tidak ada data';

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <p className="text-sm text-muted-foreground">{showingText}</p>
            <div className="flex items-center gap-2">
                {links.map((link, index) => {
                    if (index === 0) {
                        // Previous button
                        return (
                            <Button
                                key="prev"
                                variant="outline"
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link href={link.url}>
                                        <ChevronLeft className="h-4 w-4" />
                                        Sebelumnya
                                    </Link>
                                ) : (
                                    <>
                                        <ChevronLeft className="h-4 w-4" />
                                        Sebelumnya
                                    </>
                                )}
                            </Button>
                        );
                    }

                    if (index === links.length - 1) {
                        // Next button
                        return (
                            <Button
                                key="next"
                                variant="outline"
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link href={link.url}>
                                        Selanjutnya
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <>
                                        Selanjutnya
                                        <ChevronRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        );
                    }

                    // Page number buttons
                    return (
                        <Button
                            key={index}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            disabled={!link.url}
                            asChild={!!link.url}
                        >
                            {link.url ? (
                                <Link href={link.url}>{link.label}</Link>
                            ) : (
                                link.label
                            )}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
