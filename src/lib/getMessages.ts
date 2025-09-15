import { routing } from '@/i18n/routing';

export async function getMessages(locale: string) {
  try {
    // Validasi locale sebelum import
    if (!routing.locales.includes(locale as typeof routing.locales[number])) {
      console.warn(`Invalid locale: ${locale}, falling back to ${routing.defaultLocale}`);
      locale = routing.defaultLocale;
    }
    
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    
    // Fallback ke default locale jika ada error
    if (locale !== routing.defaultLocale) {
      try {
        return (await import(`../../messages/${routing.defaultLocale}.json`)).default;
      } catch (fallbackError) {
        console.error(`Failed to load fallback messages for locale: ${routing.defaultLocale}`, fallbackError);
      }
    }
    
    return null;
  }
}
  