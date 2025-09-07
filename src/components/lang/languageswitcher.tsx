import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
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

  const currentLocale = pathname.split("/")[1] || "en";

  function handleChangeLang(newLocale: string) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  }

  return (
    <Select
      value={currentLocale}
      onValueChange={handleChangeLang}
    >
      <SelectTrigger className="cursor-pointer">
        <SelectValue placeholder={currentLocale.toUpperCase()} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem  className="cursor-pointer" value="en">EN</SelectItem>
        <SelectItem  className="cursor-pointer" value="id">ID</SelectItem>
      </SelectContent>
    </Select>
  );
}
