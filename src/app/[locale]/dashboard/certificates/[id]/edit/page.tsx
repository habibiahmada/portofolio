"use client";

import { useParams } from "next/navigation";
import CertificateForm from "@/components/ui/sections/admin/forms/certificateform";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import useAdminCertificates from "@/hooks/api/admin/certificates/useAdminCertificates";

export default function EditCertificatePage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { certificates, loading } = useAdminCertificates();
    const certificate = certificates.find(c => c.id === id);
    
    const initialData = certificate ? {
        issuer: certificate.issuer,
        year: Number(certificate.year),
        preview: certificate.preview,
        certification_translations: certificate.certification_translations
    } : undefined;

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

            {initialData && id && (
                <CertificateForm
                    mode="edit"
                    initialData={initialData}
                    certificateId={id}
                />
            )}
        </div>
    );
}