"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Quote,
  Star,
  Briefcase,
  Zap,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

/* ================= TYPES ================= */

interface TestimonialInitialData {
  name?: string;
  role?: string;
  company?: string;
  rating?: number;
  content?: string;
  avatar?: string;
}

interface FormState {
  name: string;
  role: string;
  company: string;
  rating: number;
  content: string;
}

interface SubmitPayload extends FormState {
  avatar: string;
  language: "en" | "id";
}

interface Props {
  initialData?: TestimonialInitialData;
  onSubmit: (data: SubmitPayload) => Promise<void>;
  loading?: boolean;
  language?: "en" | "id";
}

export default function TestimonialForm({
  initialData,
  onSubmit,
  loading = false,
  language = "en",
}: Props) {
  /* ================= FORM ================= */
  const [form, setForm] = useState<FormState>({
    name: "",
    role: "",
    company: "",
    rating: 0,
    content: "",
  });

  /* ================= AVATAR ================= */
  const [selectedAvatar, setSelectedAvatar] =
    useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] =
    useState<string>("");
  const [avatarUrl, setAvatarUrl] =
    useState<string>("");
  const [uploadingAvatar, setUploadingAvatar] =
    useState(false);

  /* ================= INIT ================= */
  useEffect(() => {
    if (!initialData) return;

    setForm({
      name: initialData.name ?? "",
      role: initialData.role ?? "",
      company: initialData.company ?? "",
      rating: initialData.rating ?? 0,
      content: initialData.content ?? "",
    });

    if (initialData.avatar) {
      setAvatarPreview(initialData.avatar);
      setAvatarUrl(initialData.avatar);
    }
  }, [initialData]);

  /* ================= HELPERS ================= */
  const update = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  /* ================= AVATAR UPLOAD ================= */
  async function uploadAvatar() {
    if (!selectedAvatar) return;

    const toastId = toast.loading("Uploading avatar...");
    setUploadingAvatar(true);

    try {
      const fd = new FormData();
      fd.append("file", selectedAvatar);

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error();

      const data: { url: string } = await res.json();

      setAvatarUrl(data.url);
      setAvatarPreview(data.url);
      setSelectedAvatar(null);

      toast.success("Avatar uploaded", { id: toastId });
    } catch {
      toast.error("Avatar upload failed", { id: toastId });
    } finally {
      setUploadingAvatar(false);
    }
  }

  /* ================= SUBMIT ================= */
  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!avatarUrl) {
      toast.error("Please upload avatar first");
      return;
    }

    const payload: SubmitPayload = {
      ...form,
      avatar: avatarUrl,
      language,
    };

    await onSubmit(payload);
  }

  /* ================= UI ================= */
  return (
    <div className="grid lg:grid-cols-2 gap-10">
      {/* ================= FORM ================= */}
      <form onSubmit={submit} className="space-y-4">
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            update("name", e.target.value)
          }
          required
        />

        <Input
          placeholder="Role"
          value={form.role}
          onChange={(e) =>
            update("role", e.target.value)
          }
        />

        <Input
          placeholder="Company"
          value={form.company}
          onChange={(e) =>
            update("company", e.target.value)
          }
        />

        {/* ===== Avatar ===== */}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setSelectedAvatar(f);
            setAvatarPreview(
              URL.createObjectURL(f)
            );
          }}
        />

        {selectedAvatar && (
          <Button
            type="button"
            onClick={uploadAvatar}
            disabled={uploadingAvatar}
            className="gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            {uploadingAvatar
              ? "Uploading..."
              : "Upload Avatar"}
          </Button>
        )}

        {/* ===== Rating ===== */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => update("rating", v)}
            >
              <Star
                className={`w-6 h-6 ${v <= form.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                  }`}
              />
            </button>
          ))}
        </div>

        <Textarea
          rows={5}
          placeholder="Testimonial content"
          value={form.content}
          onChange={(e) =>
            update("content", e.target.value)
          }
          required
        />

        <Button
          type="submit"
          disabled={loading || !avatarUrl}
          className="w-full"
        >
          {loading
            ? "Saving..."
            : "Save Testimonial"}
        </Button>
      </form>

      {/* ================= PREVIEW ================= */}
      <div className="lg:sticky lg:top-6 h-fit">
        <Card className="relative p-8 backdrop-blur bg-white/80 dark:bg-slate-950/80">
          <div className="absolute -top-4 left-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-slate-600 rounded-full flex items-center justify-center">
              <Quote className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Content */}
            <div className="lg:col-span-2">
              <div className="flex gap-1 mb-6">
                {form.rating ? (
                  Array.from({
                    length: form.rating,
                  }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))
                ) : (
                  <Skeleton className="h-5 w-24" />
                )}
              </div>

              {form.content ? (
                <blockquote className="text-xl font-medium">
                  “{form.content}”
                </blockquote>
              ) : (
                <Skeleton className="h-24 w-full" />
              )}
            </div>

            {/* Client */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center gap-4 mb-4">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar"
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <Skeleton className="w-16 h-16 rounded-full" />
                )}

                <div>
                  <h4 className="font-bold">
                    {form.name || "—"}
                  </h4>
                  <p className="text-sm flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {form.role || "—"}
                  </p>
                  <p className="text-blue-600 text-sm font-semibold">
                    {form.company || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-blue-500" />
                Verified Client
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}