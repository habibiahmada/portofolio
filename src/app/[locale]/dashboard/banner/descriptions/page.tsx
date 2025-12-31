"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, FileText } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import DashboardHeader from "@/components/ui/sections/admin/dashboardheader";

interface HeroSnapshot {
  greeting: string;
  description: string;
  typewriter_texts: string[];
  developer_tag: string;
  console_tag: string;
  cv_url: string;
  cv_file: string | null;
}

export default function Page() {
  const locale = useLocale();
  const t = useTranslations("hero");

  const [saving, setSaving] = useState(false);

  const [greeting, setGreeting] = useState("");
  const [description, setDescription] = useState("");
  const [typewriterTexts, setTypewriterTexts] = useState<string[]>([]);
  const [newTypewriterText, setNewTypewriterText] = useState("");
  const [developerTag, setDeveloperTag] = useState("<Developer />");
  const [consoleTag, setConsoleTag] = useState("Hello World!");

  const [cvUrl, setCvUrl] = useState("");
  const [selectedCVFile, setSelectedCVFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initialRef = useRef<HeroSnapshot | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/hero?lang=${locale}`);
        const json: { data?: Partial<HeroSnapshot> } = await res.json();
        const data = json.data;

        if (!data) return;

        setGreeting(data.greeting ?? "");
        setDescription(data.description ?? "");
        setTypewriterTexts(data.typewriter_texts ?? []);
        setDeveloperTag(data.developer_tag ?? "<Developer />");
        setConsoleTag(data.console_tag ?? "Hello World!");
        setCvUrl(data.cv_url ?? "");

        initialRef.current = {
          greeting: data.greeting ?? "",
          description: data.description ?? "",
          typewriter_texts: data.typewriter_texts ?? [],
          developer_tag: data.developer_tag ?? "<Developer />",
          console_tag: data.console_tag ?? "Hello World!",
          cv_url: data.cv_url ?? "",
          cv_file: null
        };
      } catch (error) {
        console.error(error);
        toast.error(t("toast.loadError"));
      }
    }

    fetchData();
  }, [locale, t]);

  const hasChanges = useMemo(() => {
    if (!initialRef.current) return false;

    const current: HeroSnapshot = {
      greeting,
      description,
      typewriter_texts: typewriterTexts,
      developer_tag: developerTag,
      console_tag: consoleTag,
      cv_url: cvUrl,
      cv_file: selectedCVFile ? selectedCVFile.name : null
    };

    return JSON.stringify(current) !== JSON.stringify(initialRef.current);
  }, [
    greeting,
    description,
    typewriterTexts,
    developerTag,
    consoleTag,
    cvUrl,
    selectedCVFile
  ]);

  const resetToInitial = () => {
    if (!initialRef.current) return;

    const snap = initialRef.current;
    setGreeting(snap.greeting);
    setDescription(snap.description);
    setTypewriterTexts(snap.typewriter_texts);
    setDeveloperTag(snap.developer_tag);
    setConsoleTag(snap.console_tag);
    setCvUrl(snap.cv_url);
    setSelectedCVFile(null);
  };

  const addTypewriterText = () => {
    if (!newTypewriterText.trim()) return;
    setTypewriterTexts(prev => [...prev, newTypewriterText.trim()]);
    setNewTypewriterText("");
  };

  const updateTypewriterText = (index: number, value: string) => {
    setTypewriterTexts(prev =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const removeTypewriterText = (index: number) => {
    setTypewriterTexts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading(t("toast.loading"));

    try {
      let finalCvUrl = cvUrl;

      if (selectedCVFile) {
        const formData = new FormData();
        formData.append("file", selectedCVFile);

        const uploadRes = await fetch("/api/upload/cv", {
          method: "POST",
          body: formData
        });

        if (!uploadRes.ok) throw new Error("Upload failed");

        const uploadJson: { url?: string } = await uploadRes.json();
        finalCvUrl = uploadJson.url ?? finalCvUrl;
      }

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

      if (!res.ok) throw new Error("Save failed");

      toast.success(t("toast.success"), { id: toastId });
      setSelectedCVFile(null);
      setCvUrl(finalCvUrl);
    } catch (error) {
      console.error(error);
      toast.error(t("toast.saveError"), { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  /* JSX DI BAWAH TIDAK DIUBAH */

  return (
    <div className="min-h-screen">
      <div className="mx-auto p-6 space-y-6">
        {/* Header */}
        <DashboardHeader
          title={t("title")}
          description={t("subtitle")}
        />

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
                    aria-label={t("admin.delete")}
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
              <Button onClick={addTypewriterText} aria-label={t("typewriter.add")}>
                <Plus className="w-4 h-4 mr-2" />
                {t("typewriter.add")}
              </Button>
            </div>
          </CardContent>
        </Card>

         {/* CV Upload */}
        <Card>
          <CardHeader>
            <CardTitle>{t("cv.title")}</CardTitle>
            <CardDescription>{t("cv.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{t("cv.currentLabel")}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedCVFile
                      ? selectedCVFile.name
                      : cvUrl
                      ? decodeURIComponent((cvUrl.split('/').pop() as string) ?? cvUrl)
                      : t("cv.none")}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cvUrl && window.open(cvUrl, '_blank')}
                  disabled={!cvUrl}
                  aria-label={t("cv.view")}
                >
                  {t("cv.view")}
                </Button>
                <Button
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={t("cv.change")}
                >
                  {t("cv.change")}
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedCVFile(file);
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end pt-6">
        {hasChanges && (
          <Badge variant="secondary">
            {t("actions.unsavedChanges") || "Unsaved changes"}
          </Badge>
        )}
        <Button variant="outline" onClick={resetToInitial} disabled={!hasChanges || saving} aria-label={t("actions.reset")}>
          {t("actions.reset") || "Reset"}
        </Button>
        <Button onClick={handleSave} disabled={saving || !hasChanges} aria-label={t("actions.save")}>
          {saving ? t("actions.saving") : t("actions.save")}
        </Button>
      </div>
    </div>
    </div>
  );
}
