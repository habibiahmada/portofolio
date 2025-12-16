"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

export default function TestimonialForm({
  initialData,
  onSubmit,
  loading,
}: Props) {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        onSubmit({
          name: formData.get("name"),
          role: formData.get("role"),
          company: formData.get("company"),
          avatar: formData.get("avatar"),
          rating: Number(formData.get("rating")),
          language: formData.get("language"),
          content: formData.get("content"),
        });
      }}
    >
      <Input name="name" placeholder="Name" defaultValue={initialData?.name} required />
      <Input name="role" placeholder="Role" defaultValue={initialData?.role} />
      <Input name="company" placeholder="Company" defaultValue={initialData?.company} />
      <Input name="avatar" placeholder="Avatar URL" defaultValue={initialData?.avatar} />
      <Input
        name="rating"
        type="number"
        placeholder="Rating (1-5)"
        defaultValue={initialData?.rating}
      />

      <Input
        name="language"
        placeholder="Language (en / id)"
        defaultValue={initialData?.language || "en"}
      />

      <Textarea
        name="content"
        placeholder="Testimonial content"
        rows={5}
        defaultValue={initialData?.content}
        required
      />

      <Button disabled={loading} type="submit">
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
