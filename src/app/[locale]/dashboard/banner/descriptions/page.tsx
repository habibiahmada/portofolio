'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

export default function Page() {
  const locale = useLocale();
  const t = useTranslations("hero");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [greeting, setGreeting] = useState("");
  const [description, setDescription] = useState("");
  const [typewriterTexts, setTypewriterTexts] = useState<string[]>([]);
  const [newTypewriterText, setNewTypewriterText] = useState("");
  const [developerTag, setDeveloperTag] = useState("<Developer />");
  const [consoleTag, setConsoleTag] = useState("Hello World!");

  // CV State
  const [cvUrl, setCvUrl] = useState("");
  const [selectedCVFile, setSelectedCVFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/hero?lang=${locale}`);
        const { data } = await res.json();

        if (data) {
          setGreeting(data.greeting ?? "");
          setDescription(data.description ?? "");
          setTypewriterTexts(data.typewriter_texts ?? []);
          setDeveloperTag(data.developer_tag ?? "<Developer />");
          setConsoleTag(data.console_tag ?? "Hello World!");
          setCvUrl(data.cv_url ?? "");
        }
      } catch (err) {
        console.error(err);
        toast.error(t("toast.loadError"));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [locale, t]);

  const addTypewriterText = () => {
    if (!newTypewriterText.trim()) return;
    setTypewriterTexts(prev => [...prev, newTypewriterText.trim()]);
    setNewTypewriterText("");
  };

  const removeTypewriterText = (index: number) => {
    setTypewriterTexts(prev => prev.filter((_, i) => i !== index));
  };

  const updateTypewriterText = (index: number, value: string) => {
    setTypewriterTexts(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading(t("toast.loading"));

    try {
      let finalCvUrl = cvUrl;

      if (selectedCVFile) {
        toast.loading(t("toast.uploading"), { id: toastId });

        const formData = new FormData();
        formData.append("file", selectedCVFile);

        const uploadRes = await fetch("/api/upload/cv", {
          method: "POST",
          body: formData
        });

        if (!uploadRes.ok) {
          throw new Error("Upload failed");
        }

        const uploadData = await uploadRes.json();
        finalCvUrl = uploadData.url;

        setCvUrl(finalCvUrl);
        setSelectedCVFile(null);
      }

      toast.loading(t("toast.updating"), { id: toastId });

      const res = await fetch(`/api/hero?lang=${locale}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          greeting,
          description,
          typewriter_texts: typewriterTexts,
          developer_tag: developerTag,
          console_tag: consoleTag,
          cv_url: finalCvUrl
        })
      });

      if (!res.ok) throw new Error();

      toast.success(t("toast.success"), { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(t("toast.saveError"), { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">
          {t("loading")}
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-w-11/12 mx-auto pb-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6">
        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>{t("contentCard.title")}</CardTitle>
            <CardDescription>{t("contentCard.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              <div className="col-span-2 space-y-2">
                <Label>{t("contentCard.greeting.label")}</Label>
                <Input
                  value={greeting}
                  onChange={e => setGreeting(e.target.value)}
                  placeholder={t("contentCard.greeting.placeholder")}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("contentCard.developerTag.label")}</Label>
                <Input
                  value={developerTag}
                  onChange={e => setDeveloperTag(e.target.value)}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label>{t("contentCard.consoleTag.label")}</Label>
                <Input
                  value={consoleTag}
                  onChange={e => setConsoleTag(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("contentCard.bio.label")}</Label>
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={t("contentCard.bio.placeholder")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Typewriter */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>{t("typewriter.title")}</CardTitle>
              <CardDescription>{t("typewriter.description")}</CardDescription>
            </div>
            <Badge variant="secondary">
              {typewriterTexts.length} {t("typewriter.items")}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {typewriterTexts.length === 0 ? (
              <div className="border-dashed border rounded-lg p-6 text-center text-muted-foreground">
                {t("typewriter.empty")}
              </div>
            ) : (
              typewriterTexts.map((text, i) => (
                <div key={i} className="flex gap-3">
                  <Input
                    value={text}
                    onChange={e => updateTypewriterText(i, e.target.value)}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeTypewriterText(i)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}

            <div className="flex gap-3">
              <Input
                value={newTypewriterText}
                onChange={e => setNewTypewriterText(e.target.value)}
                placeholder={t("typewriter.inputPlaceholder")}
                onKeyDown={e => e.key === "Enter" && addTypewriterText()}
              />
              <Button onClick={addTypewriterText}>
                <Plus className="w-4 h-4 mr-2" />
                {t("typewriter.add")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? t("actions.saving") : t("actions.save")}
        </Button>
      </div>
    </div>
  );
}
