"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { toast } from "sonner";
import DashboardHeader from "@/components/ui/sections/admin/dashboardheader";
import { useRouter } from "next/navigation";

interface Testimonial {
    avatar: string | StaticImport;
    id: string;
    name: string;
    role: string;
    company: string;
    rating: number;
    testimonial_translations: {
        language: string;
        content: string;
    }[];
}

export default function Page() {
    const [data, setData] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchTestimonials = async () => {
        setLoading(true);
        const res = await fetch("/api/testimonials?lang=en");
        const json = await res.json();
        setData(json.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const deleteTestimonial = async (id: string) => {
        const ok = confirm("Yakin ingin menghapus testimonial ini?");
        if (!ok) return;

        const res = await fetch(`/api/testimonials/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            toast.error("Gagal menghapus testimonial");
            return;
        }

        toast.success("Testimonial berhasil dihapus");
        fetchTestimonials();
    };


    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <DashboardHeader
                title="Testimonials"
                description="Manage your testimonials here"
                actionLabel="Add Testimonial"
                actionIcon={<Plus />}
                onClick={() => router.push("/dashboard/testimonials/new")}
            />

            {/* Content */}
            {loading ? (
                <p>Loading...</p>
            ) : data.length === 0 ? (
                <p className="text-muted-foreground">Belum ada testimonial</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((item) => (
                        <Card
                            key={item.id}
                            className="p-4 flex justify-between items-start"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.role} · {item.company}
                                        </p>
                                    </div>
                                    <Image
                                        className="rounded-full mr-5"
                                        src={item.avatar}
                                        alt={item.name}
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <p className="text-sm line-clamp-2">
                                    {item.testimonial_translations?.[0]?.content}
                                </p>
                                <div className="flex gap-2 justify-end">
                                    <Link href={`/dashboard/testimonials/${item.id}/edit`}>
                                        <Button size="sm">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        size="sm"
                                        onClick={() => deleteTestimonial(item.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
