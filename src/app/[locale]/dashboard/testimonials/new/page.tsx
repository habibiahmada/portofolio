"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TestimonialForm from "@/components/ui/sections/admin/forms/testimonialform";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { toast } from "sonner";

interface Props {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submit = async (data: any) => {
    setLoading(true);

    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (!res.ok) {
      toast.error("Gagal menambahkan testimonial");
      return;
    }

    toast.success("Testimonial berhasil ditambahkan");
    router.push("/dashboard/testimonials");
  };


  return (
    <div className="min-h-screen">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/testimonials">
              Testimonials
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
          <h1 className="text-2xl font-bold">New Testimonial</h1>
          <p className="text-sm text-muted-foreground">
            Add a new testimonial to your profile
          </p>
        </div>
      </div>
      <TestimonialForm onSubmit={submit} loading={loading} />
    </div>
  );
}
