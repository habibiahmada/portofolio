'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ServiceFormData) => {
    setLoading(true);

    try {
      const payload = {
        key: data.key,
        icon: data.icon,
        color: data.color,
        translations: [
          {
            language: 'en',
            title: data.title,
            description: data.description,
            bullets: data.bullets.filter(Boolean),
          },
        ],
      };

      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Create service failed');
      }

      toast.success('Service berhasil ditambahkan');
      router.push('/dashboard/services');
    } catch (error) {
      console.error('Create service error:', error);
      toast.error('Gagal menambahkan service');
    } finally {
      setLoading(false);
    }
  };

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
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between rounded-xl border bg-card p-6">
        <div>
          <h1 className="text-2xl font-bold">New Service</h1>
          <p className="text-sm text-muted-foreground">
            Add a new service to your platform
          </p>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <ServiceForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}