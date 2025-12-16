"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Edit2, Eye, Calendar, Award, Tag, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DashboardHeader from "@/components/ui/sections/admin/dashboardheader";

interface CertificateTranslation {
    title: string;
    description: string;
    skills: string[];
}

interface Certificate {
    id: string;
    issuer: string;
    year: string;
    preview: string;
    skills: string[];
    certification_translations?: CertificateTranslation[];
}

interface CertificatesResponse {
    data: Certificate[];
    error?: {
        message?: string;
    };
}

export default function AdminCertificatesPage() {
    const locale = useLocale();
    const router = useRouter();

    const [data, setData] = useState<Certificate[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const filteredData = data.filter(
        (cert) =>
            cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const fetchCertificates = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await fetch(
                `/api/certificates?lang=${locale}`,
                { cache: "no-store" }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch certificates (${response.status})`);
            }

            const json: CertificatesResponse = await response.json();

            if (json.error) {
                throw new Error(json.error.message || "Unknown API error");
            }

            setData(json.data || []);
        } catch (error: unknown) {
            console.error("Error fetching certificates:", error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    }, [locale]);

    const deleteCertificate = async (id: string) => {
        const confirmed = confirm("Are you sure you want to delete this certificate?");
        if (!confirmed) return;

        const toastId = toast.loading("Deleting certificate...");

        try {
            const res = await fetch(`/api/certificates/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errJson: { error?: string } = await res.json();
                throw new Error(errJson.error || "Delete failed");
            }

            toast.success("Certificate deleted", { id: toastId });
            fetchCertificates();
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Failed to delete certificate";

            toast.error(message, { id: toastId });
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, [fetchCertificates]);

    return (
        <div className="min-h-screen">
            <div className="mx-auto p-6 space-y-6">
                {/* Header */}
                    <DashboardHeader
                        title="Certificates"
                        description="Manage your professional certificates and achievements"
                        onClick={() => router.push("/dashboard/certificates/new")}
                        actionLabel="Add Certificate"
                        actionIcon={<Plus />}
                    />

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="Search certificates by issuer or title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                    </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Stat icon={<Award size={20} />} label="Total Certificates" value={data.length} />
                    <Stat
                        icon={<Calendar size={20} />}
                        label="This Year"
                        value={data.filter((c) => c.year.toString() === new Date().getFullYear().toString()).length}
                    />
                    <Stat
                        icon={<Tag size={20} />}
                        label="Skills Covered"
                        value={new Set(data.flatMap((c) => c.skills)).size}
                    />
                </div>

                {/* List */}
                {!isLoading && filteredData.length === 0 ? (
                    <div className="bg-card rounded-xl p-12 border text-center">
                        <Award className="mx-auto mb-4" size={48} />
                        <h3 className="text-lg font-medium mb-2">
                            {searchQuery ? "No certificates found" : "No certificates yet"}
                        </h3>
                        {!searchQuery && (
                            <Button onClick={() => router.push("/dashboard/certificates/new")}>
                                <Plus size={18} />
                                Add Certificate
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredData.map((cert) => (
                            <div key={cert.id} className="bg-card rounded-xl p-6 border">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-semibold">
                                            {cert.certification_translations?.[0]?.title}
                                        </h3>
                                        <p className="text-sm">
                                            {cert.issuer} • {cert.year}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={() => window.open(cert.preview, "_blank")}>
                                            <Eye size={16} />
                                        </Button>
                                        <Button onClick={() => router.push(`/dashboard/certificates/${cert.id}/edit`)}>
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button onClick={() => deleteCertificate(cert.id)}>
                                            <Trash size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Stat({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
}) {
    return (
        <div className="bg-card rounded-xl p-5 border">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-card rounded-lg">{icon}</div>
                <div>
                    <p className="text-sm">{label}</p>
                    <p className="text-2xl font-semibold">{value}</p>
                </div>
            </div>
        </div>
    );
}