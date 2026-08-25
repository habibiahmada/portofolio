"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
}

interface CommentSectionProps {
  postId: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check auth status
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setIsAuthenticated(data.success && data.data))
      .catch(() => setIsAuthenticated(false));
  }, []);

  // Load approved comments
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/public/blog/${postId}/comments`);
      const data = await res.json();
      if (data.success) setComments(data.data || []);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || submitting) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/public/blog/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setBody("");
        setMessage("Comment submitted for moderation. It will appear after admin approval.");
      } else {
        setMessage(data.error?.message || "Failed to submit comment.");
      }
    } catch {
      setMessage("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold tracking-tight text-foreground">
        Comments
        {comments.length > 0 && (
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({comments.length})
          </span>
        )}
      </h3>

      {/* Comment form */}
      {isAuthenticated === true ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            maxLength={2000}
            className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50 resize-none transition-all"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground/50">
              {body.length}/2000
            </span>
            <button
              type="submit"
              disabled={!body.trim() || submitting}
              className="px-4 py-1.5 rounded-full text-xs font-mono font-semibold bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
          {message && (
            <p className="text-xs text-muted-foreground/70">{message}</p>
          )}
        </form>
      ) : isAuthenticated === false ? (
        <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 text-center">
          <p className="text-sm text-muted-foreground">
            <a href="/login" className="text-brand underline underline-offset-2">
              Sign in
            </a>{" "}
            to leave a comment.
          </p>
        </div>
      ) : null}

      {/* Comments list */}
      {loading ? (
        <div className="py-8 text-center text-sm text-muted-foreground/50">
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground/50">
          No comments yet. Be the first to share your thoughts.
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center text-[10px] font-bold text-brand">
                  {comment.user_id.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs text-muted-foreground/60 font-mono">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {comment.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
