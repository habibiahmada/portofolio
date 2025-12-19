"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    X,
    Save,
    Eye,
    EyeOff,
    UploadCloud,
    FileText,
    Clock,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import TiptapEditor from "@/components/ui/tiptap-editor";
import HtmlRenderer from "@/components/ui/html-renderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ================= TYPES ================= */

export interface ArticleFormData {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    tags: string[];
    read_time: string;
    image: string;
    published: boolean;
}

interface ArticleInitialData {
    image?: string;
    published?: boolean;
    article_translations?: Array<{
        language: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        tags: string[];
        read_time: string;
    }>;
}

interface Props {
    initialData?: ArticleInitialData;
    onSubmit: (data: ArticleFormData) => Promise<void>;
    loading?: boolean;
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
}

export default function ArticleForm({
    initialData,
    onSubmit,
    loading = false,
}: Props) {
    const [showPreview, setShowPreview] = useState(true);
    const [tagInput, setTagInput] = useState("");

    const [form, setForm] = useState<ArticleFormData>({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        tags: [],
        read_time: "1 min",
        image: "",
        published: false,
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploading, setUploading] = useState(false);

    /* ================= INIT ================= */
    useEffect(() => {
        if (!initialData) return;

        const t = initialData.article_translations?.[0];

        setForm({
            title: t?.title ?? "",
            slug: t?.slug ?? "",
            content: t?.content ?? "",
            excerpt: t?.excerpt ?? "",
            tags: t?.tags ?? [],
            read_time: t?.read_time ?? "1 min",
            image: initialData.image ?? "",
            published: initialData.published ?? false,
        });

        if (initialData.image) {
            setPreviewUrl(initialData.image);
        }
    }, [initialData]);

    /* ================= HELPERS ================= */
    const update = <K extends keyof ArticleFormData>(
        key: K,
        value: ArticleFormData[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleTitleChange = (title: string) => {
        update("title", title);
        if (!initialData) {
            update("slug", generateSlug(title));
        }
    };

    const handleContentChange = (content: string) => {
        update("content", content);
        update("read_time", calculateReadTime(content));
    };

    const addTag = () => {
        if (!tagInput.trim()) return;
        if (form.tags.includes(tagInput.trim())) {
            setTagInput("");
            return;
        }
        update("tags", [...form.tags, tagInput.trim()]);
        setTagInput("");
    };

    const removeTag = (tag: string) => {
        update("tags", form.tags.filter((t) => t !== tag));
    };

    /* ================= UPLOAD ================= */
    const handleUpload = async () => {
        if (!selectedFile) return;

        const toastId = toast.loading("Uploading image...");
        setUploading(true);

        try {
            const fd = new FormData();
            fd.append("file", selectedFile);

            const res = await fetch("/api/upload/image", {
                method: "POST",
                body: fd,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            update("image", data.url);
            setPreviewUrl(data.url);
            setSelectedFile(null);
            toast.success("Image uploaded", { id: toastId });
        } catch {
            toast.error("Failed to upload image", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const submit = async () => {
        if (loading || uploading) return;
        if (!form.title.trim()) {
            toast.error("Please enter a title");
            return;
        }
        if (!form.content.trim()) {
            toast.error("Please enter content");
            return;
        }
        await onSubmit(form);
    };

    /* ================= UI ================= */
    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* ================= FORM ================= */}
            <div className="lg:col-span-2 space-y-6">
                {/* BASIC INFO */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Article Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter article title..."
                                value={form.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                placeholder="article-slug"
                                value={form.slug}
                                onChange={(e) => update("slug", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                URL: /articles/{form.slug || "article-slug"}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                placeholder="Brief description of the article..."
                                rows={2}
                                value={form.excerpt}
                                onChange={(e) => update("excerpt", e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* CONTENT EDITOR */}
                <Card>
                    <CardHeader>
                        <CardTitle>Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="editor">
                            <TabsList className="mb-4">
                                <TabsTrigger value="editor">Editor</TabsTrigger>
                                <TabsTrigger value="preview">Preview</TabsTrigger>
                            </TabsList>
                            <TabsContent value="editor">
                                <TiptapEditor
                                    content={form.content}
                                    onChange={handleContentChange}
                                    placeholder="Write your article content here..."
                                    className="min-h-[400px]"
                                />
                            </TabsContent>
                            <TabsContent value="preview">
                                <div className="border rounded-md p-4 min-h-[400px]">
                                    {form.content ? (
                                        <HtmlRenderer content={form.content} />
                                    ) : (
                                        <p className="text-muted-foreground italic">
                                            No content to preview
                                        </p>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* IMAGE UPLOAD */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cover Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-4">
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
                            {previewUrl && (
                                <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden">
                                    <Image
                                        src={previewUrl}
                                        alt="Cover preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* TAGS */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add tag..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && (e.preventDefault(), addTag())
                                }
                            />
                            <Button type="button" variant="outline" onClick={addTag}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.tags.map((t) => (
                                <span
                                    key={t}
                                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                >
                                    {t}
                                    <button type="button" onClick={() => removeTag(t)}>
                                        <X className="w-3 h-3 hover:text-destructive" />
                                    </button>
                                </span>
                            ))}
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
                        Preview Card
                    </Button>

                    <Button onClick={submit} disabled={loading || uploading} className="gap-2">
                        <Save className="w-4 h-4" />
                        {loading ? "Saving..." : "Save Article"}
                    </Button>
                </div>
            </div>

            {/* ================= SIDEBAR ================= */}
            <div className="space-y-4">
                {/* PUBLISH SETTINGS */}
                <Card>
                    <CardHeader>
                        <CardTitle>Publish Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="published" className="cursor-pointer">
                                Published
                            </Label>
                            <Switch
                                id="published"
                                checked={form.published}
                                onCheckedChange={(checked) => update("published", checked)}
                            />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Read time: {form.read_time}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* PREVIEW CARD */}
                {showPreview && (
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
                                No cover image
                            </div>
                        )}
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{form.read_time}</span>
                                <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${form.published ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                    {form.published ? 'Published' : 'Draft'}
                                </span>
                            </div>

                            <h3 className="font-bold line-clamp-2">
                                {form.title || "Article Title"}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {form.excerpt || "Article excerpt will appear here..."}
                            </p>

                            <div className="flex flex-wrap gap-1 pt-2">
                                {form.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {form.tags.length > 3 && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                                        +{form.tags.length - 3}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
