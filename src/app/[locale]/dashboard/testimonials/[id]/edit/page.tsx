'use client';

import { useRouter, useParams } from 'next/navigation';

import TestimonialForm from '@/components/ui/sections/admin/forms/testimonialform';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';


import useAdminTestimonials from '@/hooks/api/admin/testimonials/useAdminTestimonials';

export default function Page() {
  const router = useRouter();
  const routeParams = useParams();
  const id = routeParams.id as string;

  const { testimonials, loading: fetching } = useAdminTestimonials();
  const initialData = testimonials.find(t => t.id === id);

  if (fetching) {
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
      {initialData && (
        <TestimonialForm
          initialData={initialData}
          onSuccess={() => router.push('/dashboard/testimonials')}
        />
      )}
    </div>
  );
}