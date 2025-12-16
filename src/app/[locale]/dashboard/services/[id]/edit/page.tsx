"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    params.then(({ id }) => {
      setId(id);

      fetch(`/api/services?lang=en`)
        .then((res) => res.json())
        .then((res) => {
          const item = res.data.find((s: any) => s.id === id);

          if (!item) {
            toast.error("Data service tidak ditemukan");
            router.push("/dashboard/services");
            return;
          }

          setData({
            key: item.key,
            icon: item.icon,
            color: item.color,
            title: item.service_translations?.[0]?.title,
            description: item.service_translations?.[0]?.description,
            bullets: item.service_translations?.[0]?.bullets,
          });
        });
    });
  }, [params]);


  /* ================= SUBMIT ================= */
  const submit = async (formData: any) => {
    if (!id) return;

    setLoading(true);

    const res = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (!res.ok) {
      toast.error("Gagal memperbarui service");
      return;
    }

    toast.success("Service berhasil diperbarui");
    router.push("/dashboard/services");
  };

  if (!data) {
    return <p className="p-8">Loading...</p>;
  }

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
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6 rounded-xl border bg-card p-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Service</h1>
          <p className="text-sm text-muted-foreground">
            Update service information
          </p>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <ServiceForm
        initialData={data}
        onSubmit={submit}
        loading={loading}
      />
    </div>
  );
}