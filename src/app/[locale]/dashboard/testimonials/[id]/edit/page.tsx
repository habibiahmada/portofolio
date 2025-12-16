'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface TestimonialTranslation {
  language: string;
  content: string;
}

interface TestimonialApiItem {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  testimonial_translations: TestimonialTranslation[];
}

interface TestimonialFormData {
  name: string;
  role?: string;
  avatar?: string;
  language: string;
  content: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;

  const [data, setData] = useState<TestimonialFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /* ================= FETCH ================= */
  const fetchTestimonial = useCallback(async () => {
    try {
      const response = await fetch('/api/testimonials?lang=en', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }

      const result: { data: TestimonialApiItem[] } =
        await response.json();

      const item = result.data.find(
        (testimonial) => testimonial.id === id
      );

      if (!item) {
        toast.error('Data testimonial tidak ditemukan');
        router.push('/dashboard/testimonials');
        return;
      }

      const translation = item.testimonial_translations[0];

      setData({
        name: item.name,
        role: item.role,
        avatar: item.avatar,
        language: translation?.language ?? 'en',
        content: translation?.content ?? '',
      });
    } catch (error) {
      console.error('Fetch testimonial error:', error);
      toast.error('Gagal memuat data testimonial');
    }
  }, [id, router]);

  useEffect(() => {
    fetchTestimonial();
  }, [fetchTestimonial]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (formData: TestimonialFormData) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      toast.success('Testimonial berhasil diperbarui');
      router.push('/dashboard/testimonials');
    } catch (error) {
      console.error('Update testimonial error:', error);
      toast.error('Gagal memperbarui testimonial');
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

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between rounded-xl border bg-card p-6">
        <div>
          <h1 className="text-2xl font-bold">
            Edit Testimonial
          </h1>
          <p className="text-sm text-muted-foreground">
            Edit a testimonial to your profile
          </p>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <TestimonialForm
        initialData={data}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}