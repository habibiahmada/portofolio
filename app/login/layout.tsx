import type { Metadata } from "next";
import { pageMetadata, SITE_COPY } from "@/lib/site-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Login",
    description: SITE_COPY.loginDescription,
    path: "/login",
    noIndex: true,
  }),
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
