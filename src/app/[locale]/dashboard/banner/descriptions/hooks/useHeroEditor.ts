"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

export interface HeroSnapshot {
  greeting: string;
  description: string;
  typewriter_texts: string[];
  developer_tag: string;
  console_tag: string;
  cv_url: string;
  cv_file: string | null;
}

export function useHeroEditor() {
  const locale = useLocale();
  const t = useTranslations("hero");

  const [saving, setSaving] = useState(false);

  const [greeting, setGreeting] = useState("");
  const [description, setDescription] = useState("");
  const [typewriterTexts, setTypewriterTexts] = useState<string[]>([]);
  const [developerTag, setDeveloperTag] = useState("<Developer />");
  const [consoleTag, setConsoleTag] = useState("Hello World!");
  const [cvUrl, setCvUrl] = useState("");
  const [selectedCVFile, setSelectedCVFile] = useState<File | null>(null);

  const initialRef = useRef<HeroSnapshot | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/public/hero?lang=${locale}`);
        const json = await res.json();
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
      } catch {
        toast.error(t("toast.loadError"));
      }
    }

    fetchData();
  }, [locale, t]);

  const hasChanges = useMemo(() => {
    if (!initialRef.current) return false;

    return JSON.stringify({
      greeting,
      description,
      typewriter_texts: typewriterTexts,
      developer_tag: developerTag,
      console_tag: consoleTag,
      cv_url: cvUrl,
      cv_file: selectedCVFile?.name ?? null
    }) !== JSON.stringify(initialRef.current);
  }, [
    greeting,
    description,
    typewriterTexts,
    developerTag,
    consoleTag,
    cvUrl,
    selectedCVFile
  ]);

  const reset = () => {
    if (!initialRef.current) return;
    const s = initialRef.current;

    setGreeting(s.greeting);
    setDescription(s.description);
    setTypewriterTexts(s.typewriter_texts);
    setDeveloperTag(s.developer_tag);
    setConsoleTag(s.console_tag);
    setCvUrl(s.cv_url);
    setSelectedCVFile(null);
  };

  const save = async () => {
    setSaving(true);
    const toastId = toast.loading(t("toast.loading"));

    try {
      let finalCvUrl = cvUrl;

      if (selectedCVFile) {
        const formData = new FormData();
        formData.append("file", selectedCVFile);

        const upload = await fetch("/api/upload/cv", {
          method: "POST",
          body: formData
        });

        if (!upload.ok) throw new Error();
        const { url } = await upload.json();
        finalCvUrl = url ?? finalCvUrl;
      }

      const res = await fetch(`/api/admin/hero?lang=${locale}`, {
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

      setCvUrl(finalCvUrl);
      setSelectedCVFile(null);
      toast.success(t("toast.success"), { id: toastId });
    } catch {
      toast.error(t("toast.saveError"), { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return {
    t,
    saving,
    hasChanges,
    state: {
      greeting,
      description,
      typewriterTexts,
      developerTag,
      consoleTag,
      cvUrl,
      selectedCVFile
    },
    actions: {
      setGreeting,
      setDescription,
      setTypewriterTexts,
      setDeveloperTag,
      setConsoleTag,
      setCvUrl,
      setSelectedCVFile,
      reset,
      save
    }
  };
}
