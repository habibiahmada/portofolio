'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import TestimonialForm from '@/components/ui/sections/admin/forms/testimonialform';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface TestimonialFormData {
  name: string;
  role?: string;
  avatar?: string;
  language: string;
  content: string;
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (data: TestimonialFormData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Create testimonial failed');
      }

      toast.success('Testimonial berhasil ditambahkan');
      router.push('/dashboard/testimonials');
    } catch (error) {
      console.error('Create testimonial error:', error);
      toast.error('Gagal menambahkan testimonial');
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

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between rounded-xl border bg-card p-6">
        <div>
          <h1 className="text-2xl font-bold">
            New Testimonial
          </h1>
          <p className="text-sm text-muted-foreground">
            Add a new testimonial to your profile
          </p>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <TestimonialForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}