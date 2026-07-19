"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, Check, X } from "lucide-react";
import type { CertificateRow } from "@/lib/supabase/types";

export default function AdminCertificates() {
  const [items, setItems] = useState<CertificateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<CertificateRow>>({});
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    const res = await globalThis.fetch("/api/admin/certificates?page_size=100");
    const data = await res.json();
    if (data.success) setItems(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  const startCreate = () => {
    setCreating(true); setEditingId(null);
    setForm({ id: "", org: "", title: "", description: "", pages: [], thumb: "", is_pinned: false });
  };

  const startEdit = (c: CertificateRow) => {
    setEditingId(c.id); setCreating(false); setForm({ ...c });
  };

  const cancel = () => { setEditingId(null); setCreating(false); setForm({}); };

  const save = async () => {
    if (!form.id || !form.title || !form.org) return;
    setSaving(true);
    const method = creating ? "POST" : "PATCH";
    const res = await fetch("/api/admin/certificates", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) { cancel(); loadItems(); }
    else { alert(data.error?.message || "Save failed"); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this certificate?")) return;
    await globalThis.fetch(`/api/admin/certificates?id=${id}`, { method: "DELETE" });
    loadItems();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-zinc-500" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Certificates</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{items.length} certificates</p>
        </div>
        <button onClick={startCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all">
          <Plus className="w-4 h-4" /> New Certificate
        </button>
      </div>

      {(creating || editingId) && (
        <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-300">{creating ? "New Certificate" : "Edit Certificate"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="ID" value={form.id || ""} onChange={(v) => setForm((f) => ({ ...f, id: v }))} disabled={!!editingId} />
            <InputField label="Org" value={form.org || ""} onChange={(v) => setForm((f) => ({ ...f, org: v }))} />
            <div className="md:col-span-2">
              <InputField label="Title" value={form.title || ""} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-zinc-500 mb-1 font-mono">Description</label>
              <textarea value={form.description || ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/50 min-h-[80px]" />
            </div>
            <InputField label="Thumb URL" value={form.thumb || ""} onChange={(v) => setForm((f) => ({ ...f, thumb: v }))} />
            <div>
              <label className="block text-xs text-zinc-500 mb-1 font-mono">Pages (comma separated URLs)</label>
              <input type="text" value={(form.pages || []).join(", ")} onChange={(e) => setForm((f) => ({ ...f, pages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/50" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_pinned || false} onChange={(e) => setForm((f) => ({ ...f, is_pinned: e.target.checked }))} className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-500 focus:ring-red-500/50" />
                <span className="text-xs text-zinc-400 font-mono">Pinned</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
            </button>
            <button onClick={cancel} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50 text-zinc-400 text-sm hover:text-zinc-200 transition-all">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900/50 text-zinc-500 text-xs uppercase tracking-wider font-mono">
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Org</th>
              <th className="text-left px-4 py-3">Pinned</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-600 text-sm">No certificates yet.</td></tr>
            )}
            {items.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-900/30 transition-colors">
                <td className="px-4 py-3 text-zinc-400 font-mono text-xs max-w-[120px] truncate">{c.id}</td>
                <td className="px-4 py-3 text-zinc-200 font-medium max-w-[300px] truncate">{c.title}</td>
                <td className="px-4 py-3 text-zinc-500">{c.org}</td>
                <td className="px-4 py-3">{c.is_pinned ? <span className="text-red-400 text-xs font-semibold">YES</span> : <span className="text-zinc-600 text-xs">no</span>}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => remove(c.id)} className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
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

function InputField({ label, value, onChange, type = "text", disabled }: { label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1 font-mono">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/50 disabled:opacity-40 disabled:cursor-not-allowed" />
    </div>
  );
}
