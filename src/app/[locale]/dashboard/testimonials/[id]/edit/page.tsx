"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TestimonialForm from "@/components/ui/sections/admin/forms/testimonialform";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
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

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      fetch(`/api/testimonials?lang=en`)
        .then((res) => res.json())
        .then((res) => {
          const item = res.data.find((t: any) => t.id === id);
          if (!item) {
            toast.error("Data testimonial tidak ditemukan");
            router.push("/dashboard/testimonials");
            return;
          }

          setData({
            ...item,
            language: item.testimonial_translations[0]?.language,
            content: item.testimonial_translations[0]?.content,
          });
        });

    });
  }, [params]);

  const submit = async (formData: any) => {
    if (!id) return;
    setLoading(true);

    const res = await fetch(`/api/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (!res.ok) {
      toast.error("Gagal memperbarui testimonial");
      return;
    }

    toast.success("Testimonial berhasil diperbarui");
    router.push("/dashboard/testimonials");
  };

  if (!data) return <p className="p-8">Loading...</p>;

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
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-6 rounded-xl border bg-card p-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Testimonial</h1>
          <p className="text-sm text-muted-foreground">
            Edit a testimonial to your profile
          </p>
        </div>
      </div>
      <TestimonialForm
        initialData={data}
        onSubmit={submit}
        loading={loading}
      />
    </div>
  );
}
