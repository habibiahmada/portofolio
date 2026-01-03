'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DashboardHeader from '@/components/ui/sections/admin/dashboardheader';
import { DynamicIcon } from '@/components/ui/dynamicIcon';

interface ServiceTranslation {
  title: string;
  description: string;
}

interface ServiceItem {
  id: string;
  icon: string;
  color: string;
  service_translations: ServiceTranslation[];
}

interface ServicesResponse {
  data: ServiceItem[];
}

export default function ServicesPage() {
  const locale = useLocale();
  const router = useRouter();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  /* ================= FETCH ================= */
  const fetchServices = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/public/services?lang=${locale}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Fetch failed');
      }

      const result: ServicesResponse = await response.json();
      setServices(result.data ?? []);
    } catch (error) {
      console.error('Fetch services error:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this service?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      toast.success('Service deleted');
      fetchServices();
    } catch (error) {
      console.error('Delete service error:', error);
      toast.error('Failed to delete service');
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Services"
        description="Manage services"
        actionLabel="New Service"
        actionIcon={<Plus className="h-4 w-4" />}
        onClick={() => router.push('/dashboard/services/new')}
      />

      <div className="grid gap-4 mdmd:grid-cols-2 lg:grid-cols-3">
        {/* ================= LOADING ================= */}
        {loading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-xl border"
            />
          ))}

        {/* ================= DATA ================= */}
        {services.map((service) => {
          const translation = service.service_translations[0];
          const isImageIcon =
            typeof service.icon === 'string' &&
            /^https?:\/\//.test(service.icon);

          return (
            <Card key={service.id}>
              <CardContent className="space-y-4 p-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${service.color}`}
                >
                  {isImageIcon ? (
                    <Image
                      src={service.icon}
                      alt=""
                      width={24}
                      height={24}
                    />
                  ) : (
                    <DynamicIcon
                      name={service.icon}
                      className="h-6 w-6 text-white"
                    />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold">
                    {translation?.title ?? '-'}
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {translation?.description ?? ''}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex flex-1 items-center gap-2"
                    onClick={() =>
                      router.push(
                        `/dashboard/services/${service.id}/edit`
                      )
                    }
                    aria-label="Edit Service"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(service.id)}
                    aria-label="Delete Service"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}