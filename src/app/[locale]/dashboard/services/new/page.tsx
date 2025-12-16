"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ServiceForm from "@/components/ui/sections/admin/forms/serviceform";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submit = async (data: any) => {
    setLoading(true);

    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (!res.ok) {
      toast.error("Gagal menambahkan service");
      return;
    }

    toast.success("Service berhasil ditambahkan");
    router.push("/dashboard/services");
  };

  return (
    <div className="min-h-screen">
      {/* ================= BREADCRUMB ================= */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/services">
              Services
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6 rounded-xl border bg-card p-6">
        <div>
          <h1 className="text-2xl font-bold">New Service</h1>
          <p className="text-sm text-muted-foreground">
            Add a new service to your platform
          </p>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <ServiceForm onSubmit={submit} loading={loading} />
    </div>
  );
}