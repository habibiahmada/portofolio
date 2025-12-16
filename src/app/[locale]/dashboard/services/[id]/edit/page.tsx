'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ServiceForm, {
  ServiceFormData,
} from '@/components/ui/sections/admin/forms/serviceform';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface ServiceTranslation {
  title: string;
  description: string;
  bullets: string[];
}

interface ServiceApiItem {
  id: string;
  key: string;
  icon: string;
  color: string;
  service_translations: ServiceTranslation[];
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;

  const [data, setData] = useState<ServiceFormData | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchService = useCallback(async () => {
    try {
      const response = await fetch('/api/services?lang=en', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const result: { data: ServiceApiItem[] } = await response.json();
      const item = result.data.find((s) => s.id === id);

      if (!item) {
        toast.error('Data service tidak ditemukan');
        router.push('/dashboard/services');
        return;
      }

      const t = item.service_translations[0];

      setData({
        key: item.key,
        icon: item.icon,
        color: item.color,
        title: t?.title ?? '',
        description: t?.description ?? '',
        bullets: t?.bullets ?? [],
      });
    } catch (error) {
      console.error('Fetch service error:', error);
      toast.error('Gagal memuat data service');
    }
  }, [id, router]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (formData: ServiceFormData) => {
    setLoading(true);

    try {
      const payload = {
        key: formData.key,
        icon: formData.icon,
        color: formData.color,
        translations: [
          {
            language: 'en',
            title: formData.title,
            description: formData.description,
            bullets: formData.bullets.filter(Boolean),
          },
        ],
      };

      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      toast.success('Service berhasil diperbarui');
      router.push('/dashboard/services');
    } catch (error) {
      console.error('Update service error:', error);
      toast.error('Gagal memperbarui service');
    } finally {
      setLoading(false);
    }
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
            <BreadcrumbLink href="/dashboard">
              Dashboard
            </BreadcrumbLink>
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
      <div className="mb-6 flex items-center justify-between rounded-xl border bg-card p-6">
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
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}