"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote, Star, Briefcase, Zap } from "lucide-react";
import { toast } from "sonner";

interface Props {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  language?: "en" | "id";
}

export default function TestimonialForm({
  initialData,
  onSubmit,
  loading,
  language = "en",
}: Props) {
  /* ================= AVATAR ================= */
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    initialData?.avatar || ""
  );
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string>(
    initialData?.avatar || ""
  );
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  /* ================= PREVIEW ================= */
  const [preview, setPreview] = useState({
    name: initialData?.name || "",
    role: initialData?.role || "",
    company: initialData?.company || "",
    rating: initialData?.rating || 0,
    content: initialData?.content || "",
  });

  /* ================= HANDLERS ================= */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setPreview(prev => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  }

  function handleAvatarSelect(file: File) {
    setSelectedAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function uploadAvatar() {
    if (!selectedAvatar) return;

    const toastId = toast.loading("Uploading avatar...");
    setUploadingAvatar(true);

    const formData = new FormData();
    formData.append("file", selectedAvatar);

    try {
      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload avatar");

      const data: { url: string } = await res.json();

      setUploadedAvatarUrl(data.url);
      setAvatarPreview(data.url);
      setSelectedAvatar(null);

      toast.success("Avatar uploaded", { id: toastId });
    } catch (err) {
      toast.error("Avatar upload failed", { id: toastId });
    } finally {
      setUploadingAvatar(false);
    }
  }

  /* ================= UI ================= */
  return (
    <div className="grid lg:grid-cols-2 gap-10">
      {/* ================= FORM ================= */}
      <form
        className="space-y-4"
        onSubmit={e => {
          e.preventDefault();

          onSubmit({
            name: preview.name,
            role: preview.role,
            company: preview.company,
            avatar: uploadedAvatarUrl, // ✅ URL hasil upload
            rating: preview.rating,
            content: preview.content,
            language,
          });
        }}
      >
        <Input
          name="name"
          placeholder="Name"
          defaultValue={preview.name}
          onChange={handleChange}
          required
        />

        <Input
          name="role"
          placeholder="Role"
          defaultValue={preview.role}
          onChange={handleChange}
        />

        <Input
          name="company"
          placeholder="Company"
          defaultValue={preview.company}
          onChange={handleChange}
        />

        {/* ===== Avatar Upload ===== */}
        <Input
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleAvatarSelect(file);
          }}
        />

        {selectedAvatar && (
          <Button
            type="button"
            onClick={uploadAvatar}
            disabled={uploadingAvatar}
          >
            {uploadingAvatar ? "Uploading..." : "Upload Avatar"}
          </Button>
        )}

        <Input
          name="rating"
          type="number"
          min={1}
          max={5}
          placeholder="Rating (1-5)"
          defaultValue={preview.rating}
          onChange={handleChange}
        />

        <Textarea
          name="content"
          placeholder="Testimonial content"
          rows={5}
          defaultValue={preview.content}
          onChange={handleChange}
          required
        />

        <Button disabled={loading || !uploadedAvatarUrl} type="submit">
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>

      {/* ================= PREVIEW ================= */}
      <div className="max-w-6xl mx-auto">
        <Card className="relative p-8 lg:p-12 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
          <div className="absolute -top-4 left-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-slate-600 rounded-full flex items-center justify-center">
              <Quote className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Content */}
            <div className="lg:col-span-2">
              <div className="flex gap-1 mb-6">
                {preview.rating
                  ? Array.from({ length: preview.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))
                  : Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="w-5 h-5 rounded-full" />
                    ))}
              </div>

              {preview.content ? (
                <blockquote className="text-xl font-medium">
                  &quot;{preview.content}&quot;
                </blockquote>
              ) : (
                <Skeleton className="h-24 w-full" />
              )}
            </div>

            {/* Client */}
            <div>
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-4 mb-4">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <Skeleton className="w-16 h-16 rounded-full" />
                  )}

                  <div>
                    <h4 className="font-bold">
                      {preview.name || <Skeleton className="h-4 w-24" />}
                    </h4>
                    <p className="text-sm flex gap-1 items-center">
                      <Briefcase className="w-3 h-3" />
                      {preview.role || "—"}
                    </p>
                    <p className="text-blue-600 text-sm font-semibold">
                      {preview.company || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Verified Client
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}