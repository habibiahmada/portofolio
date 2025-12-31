'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  function handleChange(value: string) {
    router.replace(pathname, { locale: value });
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger
        className="min-w-[64px] justify-center cursor-pointer"
        aria-label="Language"
      >
        <SelectValue placeholder={locale.toUpperCase()} />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="en">EN</SelectItem>
        <SelectItem value="id">ID</SelectItem>
      </SelectContent>
    </Select>
  );
}