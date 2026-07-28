"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, Check, X } from "lucide-react";
import type { CompanyRow } from "@/lib/supabase/types";

export default function AdminCompanies() {
  const [items, setItems] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<CompanyRow>>({});
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    const res = await globalThis.fetch("/api/admin/companies");
    const data = await res.json();
    if (data.success) setItems(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  const startCreate = () => {
    setCreating(true); setEditingId(null);
    setForm({ name: "", logo: "" });
  };

  const startEdit = (c: CompanyRow) => {
    setEditingId(c.id); setCreating(false); setForm({ ...c });
  };

  const cancel = () => { setEditingId(null); setCreating(false); setForm({}); };

  const save = async () => {
    if (!form.name) return;
    setSaving(true);
    const method = creating ? "POST" : "PATCH";
    const res = await fetch("/api/admin/companies", {
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
    if (!confirm("Delete this company?")) return;
    await globalThis.fetch(`/api/admin/companies?id=${id}`, { method: "DELETE" });
    loadItems();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-zinc-500" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Companies</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{items.length} companies</p>
        </div>
        <button onClick={startCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all">
          <Plus className="w-4 h-4" /> New Company
        </button>
      </div>

      {(creating || editingId) && (
        <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-300">{creating ? "New Company" : "Edit Company"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Name" value={form.name || ""} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <InputField label="Logo URL" value={form.logo || ""} onChange={(v) => setForm((f) => ({ ...f, logo: v }))} />
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
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Logo</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {items.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-12 text-center text-zinc-600 text-sm">No companies yet.</td></tr>
            )}
            {items.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-900/30 transition-colors">
                <td className="px-4 py-3 text-zinc-200 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-zinc-500 font-mono text-xs max-w-[200px] truncate">{c.logo}</td>
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

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1 font-mono">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/50" />
    </div>
  );
}
