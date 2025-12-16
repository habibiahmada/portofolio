"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Save,
  Eye,
  EyeOff,
  Search,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loadLucideIcons } from "@/lib/lucide-cache";
import { DynamicIcon } from "@/components/ui/dynamicIcon";
import PreviewCard from "../preview/cardservice";

/* ================= TYPES ================= */

interface ServiceTranslation {
  language: string;
  title: string;
  description: string;
  bullets: string[];
}

interface ServiceInitialData {
  key?: string;
  icon?: string;
  color?: string;
  translations?: ServiceTranslation[];
  service_translations?: ServiceTranslation[];
}

interface ServiceFormData {
  key: string;
  title: string;
  description: string;
  bullets: string[];
  icon: string;
  color: string;
}

interface SubmitPayload {
  key: string;
  icon: string;
  color: string;
  translations: ServiceTranslation[];
}

interface Props {
  initialData?: ServiceInitialData;
  onSubmit: (data: SubmitPayload) => Promise<void>;
  loading?: boolean;
}

/* ================= CONST ================= */

const colorOptions = [
  "from-indigo-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-purple-500 to-fuchsia-500",
  "from-cyan-500 to-sky-500",
];

export default function ServiceForm({
  initialData,
  onSubmit,
  loading = false,
}: Props) {
  const [showPreview, setShowPreview] = useState(true);
  const [icons, setIcons] = useState<string[]>([]);
  const [iconSearch, setIconSearch] = useState("");
  const [showIconPicker, setShowIconPicker] = useState(false);

  const [form, setForm] = useState<ServiceFormData>({
    key: "",
    title: "",
    description: "",
    bullets: [""],
    icon: "",
    color: colorOptions[0],
  });

  /* ================= INIT ================= */
  useEffect(() => {
    if (!initialData) return;

    const t =
      initialData.translations?.[0] ??
      initialData.service_translations?.[0];

    setForm({
      key: initialData.key ?? "",
      title: t?.title ?? "",
      description: t?.description ?? "",
      bullets:
        Array.isArray(t?.bullets) && t.bullets.length
          ? t.bullets
          : [""],
      icon: initialData.icon ?? "",
      color: initialData.color ?? colorOptions[0],
    });
  }, [initialData]);

  /* ================= ICONS ================= */
  useEffect(() => {
    loadLucideIcons().then((icons) => {
      setIcons(
        Object.keys(icons).filter((i) => /^[A-Z]/.test(i))
      );
    });
  }, []);

  /* ================= HELPERS ================= */
  const update = <K extends keyof ServiceFormData>(
    key: K,
    value: ServiceFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    if (loading) return;

    const payload: SubmitPayload = {
      key: form.key,
      icon: form.icon,
      color: form.color,
      translations: [
        {
          language: "en",
          title: form.title,
          description: form.description,
          bullets: form.bullets.filter(Boolean),
        },
      ],
    };

    await onSubmit(payload);
  };

  /* ================= UI ================= */
  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* ================= FORM ================= */}
      <div className="lg:col-span-3 space-y-6">
        {/* BASIC */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Input
              placeholder="Service key (web-development)"
              value={form.key}
              onChange={(e) =>
                update("key", e.target.value)
              }
            />

            <Input
              placeholder="Service title"
              value={form.title}
              onChange={(e) =>
                update("title", e.target.value)
              }
            />

            <Input
              placeholder="Service description"
              value={form.description}
              onChange={(e) =>
                update("description", e.target.value)
              }
            />
          </CardContent>
        </Card>

        {/* ICON & COLOR */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setShowIconPicker((v) => !v)
              }
              className="gap-2"
            >
              {form.icon ? (
                <>
                  <DynamicIcon
                    name={form.icon}
                    className="w-5 h-5"
                  />
                  {form.icon}
                </>
              ) : (
                "Select Icon"
              )}
            </Button>

            {showIconPicker && (
              <div className="border rounded-xl p-3">
                <div className="relative mb-3">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search icon..."
                    value={iconSearch}
                    onChange={(e) =>
                      setIconSearch(e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-6 md:grid-cols-8 gap-2 max-h-72 overflow-y-auto">
                  {icons
                    .filter((i) =>
                      i
                        .toLowerCase()
                        .includes(
                          iconSearch.toLowerCase()
                        )
                    )
                    .slice(0, 120)
                    .map((i) => {
                      const active =
                        i === form.icon;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            update("icon", i);
                            setShowIconPicker(false);
                          }}
                          className={`relative flex items-center justify-center h-12 rounded-lg border
                          ${
                            active
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-muted"
                          }`}
                        >
                          <DynamicIcon
                            name={i}
                            className="w-7 h-7"
                          />
                          {active && (
                            <Check className="w-4 h-4 absolute top-1 right-1 text-primary" />
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    update("color", c)
                  }
                  className={`h-12 rounded-xl bg-gradient-to-r ${c}
                  ${
                    form.color === c
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FEATURES */}
        <Card>
          <CardContent className="p-6 space-y-3">
            {form.bullets.map((b, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder={`Feature ${i + 1}`}
                  value={b}
                  onChange={(e) => {
                    const next = [
                      ...form.bullets,
                    ];
                    next[i] = e.target.value;
                    update("bullets", next);
                  }}
                />
                {form.bullets.length > 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      update(
                        "bullets",
                        form.bullets.filter(
                          (_, x) => x !== i
                        )
                      )
                    }
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                update("bullets", [
                  ...form.bullets,
                  "",
                ])
              }
              className="gap-2"
            >
              <Plus className="w-3 h-3" />
              Add feature
            </Button>
          </CardContent>
        </Card>

        {/* ACTION */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setShowPreview((v) => !v)
            }
            className="gap-2"
          >
            {showPreview ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            Preview
          </Button>

          <Button
            onClick={submit}
            disabled={loading}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* ================= PREVIEW ================= */}
      {showPreview && (
        <div className="lg:sticky lg:top-6 h-fit">
          <PreviewCard
            title={form.title}
            description={form.description}
            bullets={form.bullets.filter(Boolean)}
            icon={form.icon}
            color={form.color}
          />
        </div>
      )}
    </div>
  );
}