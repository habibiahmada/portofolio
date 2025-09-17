"use client";

import * as React from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  function handleChangeLang(newLocale: string) {
    // Gunakan router dari i18n navigation yang sudah aware dengan locale
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <Select
      value={currentLocale}
      onValueChange={handleChangeLang}
    >
      <SelectTrigger className="cursor-pointer w-17">
        <SelectValue placeholder={currentLocale.toUpperCase()} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem  className="cursor-pointer hover:bg-gray-500 focus:bg-gray-500 focus:text-white" value="en">EN</SelectItem>
        <SelectItem  className="cursor-pointer hover:bg-gray-500 focus:bg-gray-500 focus:text-white" value="id">ID</SelectItem>
      </SelectContent>
    </Select>
  );
}
