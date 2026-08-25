"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  Trash2,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  status: string;
  created_at: string;
  blog_posts?: { slug: string; title: string };
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminBlogPostComments({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [postId, setPostId] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    params.then((p) => setPostId(p.id));
  }, [params]);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    const res = await fetch(`/api/admin/blog/${postId}/comments`);
    const data = await res.json();
    if (data.success) setComments(data.data || []);
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const updateStatus = async (commentId: string, status: string) => {
    setUpdating(commentId);
    const res = await fetch(`/api/admin/blog/${postId}/comments`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment_id: commentId, status }),
    });
    const data = await res.json();
    if (data.success) fetchComments();
    setUpdating(null);
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm("Permanently delete this comment?")) return;
    setUpdating(commentId);
    await fetch(`/api/admin/blog/${postId}/comments?comment_id=${commentId}`, {
      method: "DELETE",
    });
    fetchComments();
    setUpdating(null);
  };

  const filtered =
    filter === "all" ? comments : comments.filter((c) => c.status === filter);

  const counts = {
    all: comments.length,
    pending: comments.filter((c) => c.status === "pending").length,
    approved: comments.filter((c) => c.status === "approved").length,
    rejected: comments.filter((c) => c.status === "rejected").length,
  };

  const postTitle = comments[0]?.blog_posts?.title || "Blog Post";

  if (loading || !postId) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Comments</h1>
          <p className="text-sm text-zinc-500 mt-0.5 truncate max-w-md">
            {postTitle}
          </p>
        </div>
        <Link
          href={`/blog/${comments[0]?.blog_posts?.slug || ""}`}
          target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 text-zinc-400 text-xs font-mono hover:text-zinc-200 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" /> View Post
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-zinc-900/50 rounded-lg w-fit">
        {(["all", "pending", "approved", "rejected"] as const).map((s) => (
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

      {/* Comments list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-600 text-sm">
            {filter === "all"
              ? "No comments on this post."
              : `No ${filter} comments.`}
          </div>
        ) : (
          filtered.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 font-mono">
                    {formatDate(comment.created_at)}
                  </span>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${STATUS_COLORS[comment.status] ?? ""}`}
                  >
                    {comment.status}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {updating === comment.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
                  ) : (
                    <>
                      {comment.status !== "approved" && (
                        <button
                          onClick={() => updateStatus(comment.id, "approved")}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                          title="Approve"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {comment.status !== "rejected" && (
                        <button
                          onClick={() => updateStatus(comment.id, "rejected")}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                          title="Reject"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {comment.body}
              </p>

              <p className="text-[10px] text-zinc-600 font-mono">
                User: {comment.user_id.slice(0, 8)}...
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
