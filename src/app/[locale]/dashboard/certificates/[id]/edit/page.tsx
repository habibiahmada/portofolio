"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CertificateForm from "@/components/ui/sections/admin/certificateform";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { useLocale } from "next-intl";

interface Certificate {
    id: string;
    title: string;
    issuer?: string;
    issue_date?: string;
    expiry_date?: string | null;
    credential_url?: string | null;
    description?: string | null;
}

interface CertificateResponse {
    data: Certificate[];
}

export default function EditCertificatePage() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const locale = useLocale();

    const [data, setData] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/certificates?lang=${locale}`)
            .then((res) => res.json() as Promise<CertificateResponse>)
            .then((json) => {
                const found = json.data?.find(
                    (c: Certificate) => c.id === id
                );
                setData(found ?? null);
            })
            .finally(() => setLoading(false));
    }, [id, locale]);

    return (
        <div className="min-h-screen">
            {loading && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-card px-4 py-2 rounded-md shadow">
                        Loading
                    </div>
                </div>
            )}

            <Breadcrumb className="mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">
                            Dashboard
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/certificates">
                            Certificates
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between mb-6 rounded-xl border bg-card p-6">
                <div>
                    <h1 className="text-2xl font-bold">Edit Certificate</h1>
                    <p className="text-sm text-muted-foreground">
                        Edit a certificate to your profile
                    </p>
                </div>
            </div>

            {data && id && (
                <CertificateForm
                    mode="edit"
                    initialData={data}
                    certificateId={id}
                />
            )}
        </div>
    );
}