"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Archive,
  Loader2,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";
import type { BlogPostRow, BlogStatus } from "@/lib/supabase/types";

const STATUS_COLORS: Record<string, string> = {
  published:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  archived:
    "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

const CATEGORY_LABELS: Record<string, string> = {
  programming: "Programming",
  education: "Education",
  web: "Web",
  career: "Career",
  opinion: "Opinion",
  "news-commentary": "News",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BlogStatus | "all">("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/blog");
    const data = await res.json();
    if (data.success) setPosts(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const updateStatus = async (id: string, status: BlogStatus) => {
    setUpdating(id);
    const res = await fetch("/api/admin/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (data.success) {
      fetchPosts();
    } else {
      alert(data.error?.message || "Update failed");
    }
    setUpdating(null);
  };

  const archive = async (id: string) => {
    if (!confirm("Archive this post? It will no longer be visible publicly."))
      return;
    setUpdating(id);
    const res = await fetch(`/api/admin/blog?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      fetchPosts();
    } else {
      alert(data.error?.message || "Archive failed");
    }
    setUpdating(null);
  };

  const filtered =
    filter === "all" ? posts : posts.filter((p) => p.status === filter);

  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
    archived: posts.filter((p) => p.status === "archived").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Blog Posts</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {counts.all} total, {counts.published} published
          </p>
        </div>
        <a
          href="/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50 text-zinc-400 text-sm font-medium hover:text-zinc-200 transition-all"
        >
          <ExternalLink className="w-4 h-4" /> View Blog
        </a>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 p-1 bg-zinc-900/50 rounded-lg w-fit">
        {(["all", "published", "draft", "archived"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold uppercase tracking-wider transition-all ${
              filter === s
                ? "bg-zinc-800 text-zinc-200"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Posts table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900/50 text-zinc-500 text-xs uppercase tracking-wider font-mono">
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Source</th>
              <th className="text-left px-4 py-3">Published</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-zinc-600 text-sm"
                >
                  {filter === "all"
                    ? "No blog posts yet."
                    : `No ${filter} posts.`}
                </td>
              </tr>
            )}
            {filtered.map((post) => (
              <tr
                key={post.id}
                className="hover:bg-zinc-900/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="max-w-[300px]">
                    <p className="text-zinc-200 font-medium truncate">
                      {post.title}
                    </p>
                    <p className="text-[11px] text-zinc-600 font-mono truncate">
                      /blog/{post.slug}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-zinc-400">
                    {CATEGORY_LABELS[post.category] ?? post.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${STATUS_COLORS[post.status] ?? ""}`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-zinc-500 font-mono">
                    {post.source}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-zinc-500">
                    {formatDate(post.published_at)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* View (if published) */}
                    {post.status === "published" && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                        title="View live"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    {/* Publish / Unpublish */}
                    {updating === post.id ? (
                      <div className="p-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
                      </div>
                    ) : post.status === "published" ? (
                      <button
                        onClick={() => updateStatus(post.id, "draft")}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                        title="Unpublish (set to draft)"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                      </button>
                    ) : post.status === "draft" ? (
                      <button
                        onClick={() => updateStatus(post.id, "published")}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                        title="Publish"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    ) : null}

                    {/* Archive */}
                    {post.status !== "archived" && (
                      <button
                        onClick={() => archive(post.id)}
                        disabled={updating === post.id}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                        title="Archive"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: counts.all, icon: FileText },
          { label: "Published", value: counts.published, icon: Eye },
          { label: "Drafts", value: counts.draft, icon: Pencil },
          { label: "Archived", value: counts.archived, icon: Archive },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-zinc-500" />
              <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                {label}
              </span>
            </div>
            <p className="text-2xl font-bold text-zinc-200">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
