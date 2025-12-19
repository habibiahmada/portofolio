"use client";

import { Trash2, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DashboardHeader from "@/components/ui/sections/admin/dashboardheader";
import { useRouter } from "next/navigation";
import useAdminTestimonials from "@/hooks/api/admin/testimonials/useAdminTestimonials";
import useTestimonialActions from "@/hooks/api/admin/testimonials/useTestimonialActions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Page() {
    const router = useRouter();

    const { testimonials, loading, refreshTestimonials } = useAdminTestimonials();
    const { deleteTestimonial } = useTestimonialActions(refreshTestimonials);

    const handleDelete = async (id: string) => {
        await deleteTestimonial(id);
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
            ) : testimonials.length === 0 ? (
                <p className="text-muted-foreground">Belum ada testimonial</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {testimonials.map((item) => (
                        <Card
                            key={item.id}
                            className="p-4 flex flex-col justify-between gap-4"
                        >
                            {/* Top Section */}
                            <div className="flex items-start justify-between gap-4">
                                {/* Left Content */}
                                <div className="space-y-1">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {item.role} · {item.company}
                                    </p>
                                </div>

                                {/* Avatar Right */}
                                <Image
                                    src={item.avatar || "/favicon.ico"}
                                    alt={item.name}
                                    width={56}
                                    height={56}
                                    className="rounded-full object-cover shrink-0"
                                />
                            </div>

                            {/* Testimonial */}
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {item.testimonial_translations?.[0]?.content}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 pt-2">
                                <Link href={`/ dashboard / testimonials / ${item.id}/edit`}>
                                    <Button size="sm" variant="outline">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </Link >

                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div >
                        </Card >
                    ))}
                </div >

            )}
        </div >
    );
}
