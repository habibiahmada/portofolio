import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";
import CertificateForm from "@/components/ui/sections/admin/forms/certificateform";

export default function NewCertificatePage() {
    return (
        <div className="min-h-screen">

            <Breadcrumb className="mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/certificates">
                            Certificates
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbPage>New</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between mb-6 rounded-xl border bg-card p-6">
                <div>
                    <h1 className="text-2xl font-bold">Add New Certificate</h1>
                    <p className="text-sm text-muted-foreground">
                        Add a new certificate to your profile
                    </p>
                </div>
            </div>

            <CertificateForm mode="create" />
        </div>
    );
}
