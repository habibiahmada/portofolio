"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, Check, X } from "lucide-react";
import type { ProjectRow } from "@/lib/supabase/types";

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<ProjectRow>>({});
  const [saving, setSaving] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/projects?page_size=100");
    const data = await res.json();
    if (data.success) setProjects(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setForm({
      id: "",
      title_en: "",
      title_id: "",
      description_en: "",
      description_id: "",
      image: "",
      tags: [],
      live_url: "",
      github_url: "",
      year: new Date().getFullYear(),
    });
  };

  const startEdit = (p: ProjectRow) => {
    setEditingId(p.id);
    setCreating(false);
    setForm({ ...p });
  };

  const cancel = () => {
    setEditingId(null);
    setCreating(false);
    setForm({});
  };

  const save = async () => {
    if (!form.id || !form.title_en || !form.title_id) return;
    setSaving(true);
    const method = creating ? "POST" : "PATCH";
    const res = await fetch("/api/admin/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      cancel();
      fetchProjects();
    } else {
      alert(data.error?.message || "Save failed");
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await globalThis.fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
    fetchProjects();
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
          <h1 className="text-xl font-bold">Projects</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{projects.length} projects</p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Create/Edit form */}
      {(creating || editingId) && (
        <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-300">
            {creating ? "New Project" : "Edit Project"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="ID" value={form.id || ""} onChange={(v) => setForm((f) => ({ ...f, id: v }))} disabled={!!editingId} />
            <InputField label="Year" type="number" value={String(form.year || "")} onChange={(v) => setForm((f) => ({ ...f, year: Number(v) }))} />
            <InputField label="Title (EN)" value={form.title_en || ""} onChange={(v) => setForm((f) => ({ ...f, title_en: v }))} />
            <InputField label="Title (ID)" value={form.title_id || ""} onChange={(v) => setForm((f) => ({ ...f, title_id: v }))} />
            <div className="md:col-span-2">
              <label className="block text-xs text-zinc-500 mb-1 font-mono">Description (EN)</label>
              <textarea
                value={form.description_en || ""}
                onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/50 min-h-[80px]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-zinc-500 mb-1 font-mono">Description (ID)</label>
              <textarea
                value={form.description_id || ""}
                onChange={(e) => setForm((f) => ({ ...f, description_id: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/50 min-h-[80px]"
              />
            </div>
            <InputField label="Image URL" value={form.image || ""} onChange={(v) => setForm((f) => ({ ...f, image: v }))} />
            <InputField label="Live URL" value={form.live_url || ""} onChange={(v) => setForm((f) => ({ ...f, live_url: v }))} />
            <InputField label="GitHub URL" value={form.github_url || ""} onChange={(v) => setForm((f) => ({ ...f, github_url: v }))} />
            <InputField label="Tags (comma separated)" value={(form.tags || []).join(", ")} onChange={(v) => setForm((f) => ({ ...f, tags: v.split(",").map((t) => t.trim()).filter(Boolean) }))} />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save
            </button>
            <button onClick={cancel} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50 text-zinc-400 text-sm hover:text-zinc-200 transition-all">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900/50 text-zinc-500 text-xs uppercase tracking-wider font-mono">
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Title (EN)</th>
              <th className="text-left px-4 py-3">Year</th>
              <th className="text-left px-4 py-3">Tags</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-zinc-600 text-sm">
                  No projects yet. Create your first one.
                </td>
              </tr>
            )}
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-900/30 transition-colors">
                <td className="px-4 py-3 text-zinc-400 font-mono text-xs max-w-[120px] truncate">{p.id}</td>
                <td className="px-4 py-3 text-zinc-200 font-medium max-w-[300px] truncate">{p.title_en}</td>
                <td className="px-4 py-3 text-zinc-500">{p.year}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(p.tags || []).slice(0, 3).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-zinc-800/50 text-[10px] text-zinc-400 font-mono">{t}</span>
                    ))}
                    {(p.tags?.length || 0) > 3 && (
                      <span className="text-[10px] text-zinc-600">+{p.tags!.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Reusable input ──
function InputField({
  label,
  value,
  onChange,
  type = "text",
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1 font-mono">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </div>
  );
}
