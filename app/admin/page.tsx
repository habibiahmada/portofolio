"use client";

import { useEffect, useState } from "react";
import {
  FolderKanban,
  ScrollText,
  Building2,
  Loader2,
} from "lucide-react";

type Stats = {
  projects: number;
  certificates: number;
  companies: number;
};

export default function AdminDashboard() {
  const [session, setSession] = useState<{ email: string; name: string } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  // Fetch session info
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setSession(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch stats if authenticated
  useEffect(() => {
    if (!session) return;
    Promise.all([
      fetch("/api/admin/projects?page_size=1").then((r) => r.json()),
      fetch("/api/admin/certificates?page_size=1").then((r) => r.json()),
      fetch("/api/admin/companies").then((r) => r.json()),
    ]).then(([p, c, comp]) => {
      setStats({
        projects: p.meta?.total || 0,
        certificates: c.meta?.total || 0,
        companies: Array.isArray(comp.data) ? comp.data.length : 0,
      });
    });
  }, [session]);

  // ── Dashboard ──
  const statCards = [
    {
      label: "Projects",
      value: stats?.projects ?? "-",
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-red-400 bg-red-500/10",
    },
    {
      label: "Certificates",
      value: stats?.certificates ?? "-",
      icon: ScrollText,
      href: "/admin/certificates",
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      label: "Companies",
      value: stats?.companies ?? "-",
      icon: Building2,
      href: "/admin/companies",
      color: "text-emerald-400 bg-emerald-500/10",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back,{" "}
          <span className="text-red-400">{session?.name ?? "..."}</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your portfolio content from here.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}
              >
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-zinc-100">{card.value}</p>
            <p className="text-xs text-zinc-500 mt-1 font-mono uppercase tracking-wider">
              {card.label}
            </p>
          </a>
        ))}
      </div>

      <div className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-300 mb-2">
          Quick Links
        </h2>
        <div className="flex flex-wrap gap-2">
          {["Projects", "Certificates", "Companies"].map((item) => (
            <a
              key={item}
              href={`/admin/${item.toLowerCase()}`}
              className="px-3 py-1.5 rounded-lg bg-zinc-800/50 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 transition-all"
            >
              Manage {item} →
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

