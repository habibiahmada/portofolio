import type { Metadata } from "next";
import { AdminShell } from "./admin-shell";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Admin",
    description: "Portfolio admin panel for Habibi Ahmad Aziz.",
    path: "/admin",
    noIndex: true,
  }),
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
