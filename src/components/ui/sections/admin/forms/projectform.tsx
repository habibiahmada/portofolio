"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    X,
    Save,
    Eye,
    EyeOff,
    UploadCloud,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import useProjectActions, { ProjectFormData } from "@/hooks/api/admin/projects/useProjectActions";

/* ================= TYPES ================= */

interface ProjectInitialData {
    id?: string;
    image_url?: string;
    year?: number;
    technologies?: string[];
    live_url?: string;
    github_url?: string;
    projects_translations?: Array<{
        language: string;
        title: string;
        description: string;
    }>;
    // Fallback if data comes flattened or transformed
    translation?: {
        title: string;
        description: string;
    } | null;
}

interface Props {
    initialData?: ProjectInitialData;
    onSuccess?: () => void;
}

export default function ProjectForm({
    initialData,
    onSuccess,
}: Props) {
    const [showPreview, setShowPreview] = useState(true);
    const [techInput, setTechInput] = useState("");

    const [form, setForm] = useState<ProjectFormData>({
        title: "",
        description: "",
        year: new Date().getFullYear(),
        technologies: [],
        live_url: "",
        github_url: "",
        image_url: "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    // Hooks
    const { createProject, updateProject, uploadImage, submitting } = useProjectActions(onSuccess);
    const [uploading, setUploading] = useState(false);

    /* ================= INIT ================= */
    useEffect(() => {
        if (!initialData) return;

        const t = initialData.projects_translations?.[0] || initialData.translation;

        setForm({
            title: t?.title ?? "",
            description: t?.description ?? "",
            year: initialData.year ?? new Date().getFullYear(),
            technologies: initialData.technologies ?? [],
            live_url: initialData.live_url ?? "",
            github_url: initialData.github_url ?? "",
            image_url: initialData.image_url ?? "",
        });

        if (initialData.image_url) {
            setPreviewUrl(initialData.image_url);
        }
    }, [initialData]);

    /* ================= HELPERS ================= */
    const update = <K extends keyof ProjectFormData>(
        key: K,
        value: ProjectFormData[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const addTech = () => {
        if (!techInput.trim()) return;
        if (form.technologies.includes(techInput.trim())) {
            setTechInput("");
            return;
        }
        update("technologies", [...form.technologies, techInput.trim()]);
        setTechInput("");
    };

    const removeTech = (tag: string) => {
        update("technologies", form.technologies.filter(t => t !== tag));
    };

    /* ================= UPLOAD ================= */
    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const url = await uploadImage(selectedFile);
            update("image_url", url);
            setPreviewUrl(url);
            setSelectedFile(null);
        } catch {
            // Toast handled in hook
        } finally {
            setUploading(false);
        }
    };

    /* ================= SUBMIT ================= */
    const submit = async () => {
        if (submitting || uploading) return;
        if (!form.image_url) {
            toast.error("Please upload an image first");
            return;
        }
        // Basic validation
        if (!form.title) {
            toast.error("Title is required");
            return;
        }

        if (initialData?.id) {
            await updateProject(initialData.id, form);
        } else {
            await createProject(form);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="grid lg:grid-cols-4 gap-6">
            {/* ================= FORM ================= */}
            <div className="lg:col-span-3 space-y-6">
                {/* BASIC INFO */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <Input
                            placeholder="Project Title"
                            value={form.title}
                            onChange={(e) => update("title", e.target.value)}
                        />

                        <Textarea
                            placeholder="Project Description"
                            rows={4}
                            value={form.description}
                            onChange={(e) => update("description", e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="number"
                                placeholder="Year"
                                value={form.year}
                                onChange={(e) => update("year", Number(e.target.value))}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* IMAGE UPLOAD */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex flex-col gap-4">
                            <label className="text-sm font-medium">Project Image</label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (!f) return;
                                    setSelectedFile(f);
                                    setPreviewUrl(URL.createObjectURL(f));
                                }}
                            />
                            {selectedFile && (
                                <Button
                                    type="button"
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="gap-2 w-fit"
                                >
                                    <UploadCloud className="w-4 h-4" />
                                    {uploading ? "Uploading..." : "Upload Now"}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* TECH & LINKS */}
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Technologies</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add technology (e.g. Next.js)"
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                                />
                                <Button type="button" variant="outline" onClick={addTech}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.technologies.map((t) => (
                                    <span
                                        key={t}
                                        className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                    >
                                        {t}
                                        <button type="button" onClick={() => removeTech(t)}>
                                            <X className="w-3 h-3 hover:text-destructive" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Live URL</label>
                                <Input
                                    placeholder="https://..."
                                    value={form.live_url}
                                    onChange={(e) => update("live_url", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">GitHub URL</label>
                                <Input
                                    placeholder="https://github.com/..."
                                    value={form.github_url}
                                    onChange={(e) => update("github_url", e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPreview((v) => !v)}
                        className="gap-2"
                    >
                        {showPreview ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                        Preview
                    </Button>

                    <Button onClick={submit} disabled={submitting || uploading} className="gap-2">
                        <Save className="w-4 h-4" />
                        {submitting ? "Saving..." : "Save Project"}
                    </Button>
                </div>
            </div>

            {/* ================= PREVIEW ================= */}
            {showPreview && (
                <div className="lg:sticky lg:top-6 h-fit space-y-4">
                    <Card className="overflow-hidden border-2 border-primary/10 transition-all hover:border-primary/30">
                        {previewUrl ? (
                            <div className="aspect-video relative">
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground italic p-4 text-center text-xs">
                                No image uploaded
                            </div>
                        )}
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-primary tracking-widest uppercase">
                                    {form.year}
                                </span>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold line-clamp-1">
                                    {form.title || "Project Title"}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {form.description || "Project description goes here..."}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-2">
                                {form.technologies.slice(0, 3).map((tech) => (
                                    <span
                                        key={tech}
                                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold"
                                    >
                                        {tech}
                                    </span>
                                ))}
                                {form.technologies.length > 3 && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">
                                        +{form.technologies.length - 3}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
